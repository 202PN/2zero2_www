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

interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> };
  WEB3FORMS_ACCESS_KEY?: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/api/contact") {
      if (request.method !== "POST") {
        return json({ error: "Method not allowed." }, 405);
      }
      return handleContact(request, env);
    }

    // Everything else is served from the static export (with 404 handling).
    return env.ASSETS.fetch(request);
  },
};

async function handleContact(request: Request, env: Env): Promise<Response> {
  // The site's own JS posts JSON; the no-JS <form action="/api/contact">
  // fallback posts urlencoded form data. Accept both, and answer the
  // no-JS path with a small branded HTML page instead of raw JSON.
  const contentType = request.headers.get("content-type") ?? "";
  const wantsHtml = !contentType.includes("application/json");

  let data: Record<string, unknown>;
  try {
    if (contentType.includes("application/json")) {
      data = (await request.json()) as Record<string, unknown>;
    } else {
      data = Object.fromEntries(await request.formData());
    }
  } catch {
    return reply(wantsHtml, { error: "Invalid request." }, 400);
  }

  const str = (v: unknown, max: number) =>
    typeof v === "string" ? v.trim().slice(0, max) : "";
  const email = str(data.email, 320);
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
      { error: "Could not send your message right now — please email info@2zero2.build directly." },
      500
    );
  }

  const res = await fetch("https://api.web3forms.com/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      access_key: env.WEB3FORMS_ACCESS_KEY,
      subject: `New inquiry from ${email}`,
      from_name: "2zero2 website",
      email, // used as the reply-to on the delivered email
      message: message || "(no details provided)",
    }),
  });

  const result = (await res.json().catch(() => ({}))) as { success?: boolean };
  if (!res.ok || !result.success) {
    console.error("Web3Forms error", res.status, JSON.stringify(result));
    return reply(
      wantsHtml,
      { error: "Could not send your message. Please email info@2zero2.build directly." },
      502
    );
  }

  return reply(wantsHtml, { ok: true });
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

/* JSON for the site's own fetch(); a branded HTML page for no-JS form posts. */
function reply(
  wantsHtml: boolean,
  body: { ok?: boolean; error?: string },
  status = 200
): Response {
  if (!wantsHtml) return json(body, status);

  const ok = !body.error;
  const title = ok ? "Message sent" : "Message not sent";
  const detail = ok
    ? "Thanks — your message is on its way. We reply within one business day."
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
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
