/**
 * Cloudflare Worker for the 2zero2 Studio site.
 *
 * Serves the static export (./out) via the ASSETS binding and handles the
 * contact form at POST /api/contact, forwarding submissions through
 * Web3Forms (free, no sending domain required). Web3Forms delivers to the
 * email address tied to your access key.
 *
 * Required config (Worker → Settings → Variables and Secrets):
 *   WEB3FORMS_ACCESS_KEY  (Secret) — get one at https://web3forms.com
 *                                    (enter the inbox you want submissions
 *                                    delivered to, e.g. 2zero2works@gmail.com)
 */

import { CONTACT_EMAIL, SERVICES } from "../components/content";

interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> };
  WEB3FORMS_ACCESS_KEY?: string;
  /* Rate limiting binding (wrangler.jsonc → ratelimits). Optional so the
     form still works if the binding is ever missing; it just isn't limited. */
  CONTACT_LIMITER?: { limit(options: { key: string }): Promise<{ success: boolean }> };
}

/* Bigger than any real message (5,000 characters plus a few short fields),
   small enough that nobody can make the Worker parse megabytes. */
const MAX_BODY_BYTES = 32 * 1024;

/* The only values the form's service picker can send. */
const SERVICE_NAMES = new Set([...SERVICES.map((s) => s.name), "Not sure yet"]);

/* Headers every Worker-generated response carries. Static pages get theirs
   from public/_headers, which does not apply to responses made here. */
const SECURITY_HEADERS: Record<string, string> = {
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Cache-Control": "no-store",
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/api/contact") {
      if (request.method !== "POST") {
        return json({ error: "Method not allowed." }, 405, { Allow: "POST" });
      }
      return handleContact(request, env, url);
    }

    // Everything else is served from the static export (with 404 handling).
    return env.ASSETS.fetch(request);
  },
};

async function handleContact(request: Request, env: Env, url: URL): Promise<Response> {
  // The site's own JS posts JSON; the no-JS <form action="/api/contact">
  // fallback posts urlencoded form data. Accept both, and answer the
  // no-JS path with a small branded HTML page instead of raw JSON.
  const contentType = request.headers.get("content-type") ?? "";
  const isJson = contentType.includes("application/json");
  const isForm =
    contentType.includes("application/x-www-form-urlencoded") ||
    contentType.includes("multipart/form-data");
  const wantsHtml = !isJson;

  // Only this site may post here. Browsers always send Origin on a POST, so
  // a mismatch means another site is submitting on a visitor's behalf.
  const origin = request.headers.get("origin");
  if (origin && origin !== url.origin) {
    return reply(wantsHtml, { error: "Forbidden." }, 403);
  }

  if (!isJson && !isForm) {
    return reply(wantsHtml, { error: "Unsupported content type." }, 415);
  }

  // Per-IP limit, so a script can't flood the inbox or burn the Web3Forms
  // quota. Checked before the body is read.
  if (env.CONTACT_LIMITER) {
    const ip = request.headers.get("cf-connecting-ip") ?? "unknown";
    const { success } = await env.CONTACT_LIMITER.limit({ key: `contact:${ip}` });
    if (!success) {
      return reply(
        wantsHtml,
        { error: "Too many messages from this connection. Please wait a minute and try again." },
        429,
        { "Retry-After": "60" },
      );
    }
  }

  const declared = Number(request.headers.get("content-length") ?? 0);
  if (declared > MAX_BODY_BYTES) {
    return reply(wantsHtml, { error: "Message is too long." }, 413);
  }

  let data: Record<string, unknown>;
  try {
    // Read as text first so the cap also holds when Content-Length is
    // missing or wrong.
    const raw = await request.text();
    if (raw.length > MAX_BODY_BYTES) {
      return reply(wantsHtml, { error: "Message is too long." }, 413);
    }
    if (isJson) {
      const parsed: unknown = JSON.parse(raw);
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error();
      data = parsed as Record<string, unknown>;
    } else {
      data = Object.fromEntries(
        await new Request(url, {
          method: "POST",
          headers: { "content-type": contentType },
          body: raw,
        }).formData(),
      );
    }
  } catch {
    return reply(wantsHtml, { error: "Invalid request." }, 400);
  }

  const str = (v: unknown, max: number) =>
    typeof v === "string" ? v.trim().slice(0, max) : "";
  // Single-line fields lose every control character, so nothing typed into
  // them can break onto a new line of the delivered email's headers.
  const line = (v: unknown, max: number) =>
    str(v, max).replace(/[\u0000-\u001f\u007f]+/g, " ").trim();

  const name = line(data.name, 200);
  const email = line(data.email, 320);
  const rawService = line(data.service, 80);
  const service = SERVICE_NAMES.has(rawService) ? rawService : "";
  const message = str(data.message, 5000);

  // Honeypot: real users never fill this hidden field. Silently accept bots.
  if (str(data.company, 10)) return reply(wantsHtml, { ok: true });

  if (!email) {
    return reply(wantsHtml, { error: "An email address is required." }, 400);
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return reply(wantsHtml, { error: "Please enter a valid email address." }, 400);
  }
  if (!env.WEB3FORMS_ACCESS_KEY) {
    // Config problem, but visitors only need the recovery path.
    return reply(
      wantsHtml,
      { error: `Could not send your message right now — please email ${CONTACT_EMAIL} directly.` },
      500
    );
  }

  const res = await fetch("https://api.web3forms.com/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      access_key: env.WEB3FORMS_ACCESS_KEY,
      subject: `New inquiry${service ? ` (${service})` : ""} from ${name || email}`,
      from_name: "2zero2 website",
      name: name || "(not given)",
      email, // used as the reply-to on the delivered email
      service: service || "(not selected)",
      message: message || "(no details provided)",
    }),
  });

  const result = (await res.json().catch(() => ({}))) as { success?: boolean };
  if (!res.ok || !result.success) {
    // Status only: the response body can echo the submission back.
    console.error("Web3Forms error", res.status);
    return reply(
      wantsHtml,
      { error: `Could not send your message. Please email ${CONTACT_EMAIL} directly.` },
      502
    );
  }

  return reply(wantsHtml, { ok: true });
}

function json(body: unknown, status = 200, extra: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...SECURITY_HEADERS, ...extra, "Content-Type": "application/json" },
  });
}

/* JSON for the site's own fetch(); a branded HTML page for no-JS form posts. */
function reply(
  wantsHtml: boolean,
  body: { ok?: boolean; error?: string },
  status = 200,
  extra: Record<string, string> = {}
): Response {
  if (!wantsHtml) return json(body, status, extra);

  const ok = !body.error;
  const title = ok ? "Message sent" : "Message not sent";
  const detail = ok
    ? "Thanks — your message is on its way. We'll follow up with next steps."
    : escapeHtml(body.error ?? "Something went wrong.");
  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>${title} — 2zero2 Studio</title>
<style>
  body { margin: 0; min-height: 100svh; display: grid; place-items: center;
    background: #0b0b0c; color: #eceae4;
    font: 16px/1.6 "Helvetica Neue", Arial, sans-serif; }
  main { max-width: 34rem; padding: 2rem; border-top: 1px solid rgba(236,234,228,0.14); }
  h1 { font-size: 1.5rem; letter-spacing: -0.01em; }
  p { color: #b3b0a7; }
  a { color: #eceae4; }
</style>
</head>
<body>
<main>
<h1>${title}</h1>
<p>${detail}</p>
<p><a href="/#contact">&larr; Back to 2zero2 Studio</a></p>
</main>
</body>
</html>`;
  return new Response(html, {
    status,
    headers: {
      ...SECURITY_HEADERS,
      ...extra,
      "Content-Type": "text/html; charset=utf-8",
      // The page is static apart from escaped text: no scripts, no
      // framing, nothing loaded from anywhere.
      "Content-Security-Policy":
        "default-src 'none'; style-src 'unsafe-inline'; base-uri 'none'; form-action 'self'; frame-ancestors 'none'",
      "X-Frame-Options": "DENY",
    },
  });
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
