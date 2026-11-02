# 2zero2

Marketing site for **2zero2**, a digital agency. A Next.js App Router site shipped
as a fully static export, served from a Cloudflare Worker that also handles the
contact form.

Design system: [DESIGN.md](DESIGN.md). Product truth (services, case studies,
process, contact): [`components/content.ts`](components/content.ts) — copy comes
from there, it is not invented in components.

## Tech stack

- [Next.js 15](https://nextjs.org) (App Router, `output: "export"`)
- [React 19](https://react.dev) · TypeScript
- [Tailwind CSS 4](https://tailwindcss.com)
- [Lenis](https://lenis.darkroom.engineering) for smooth scroll (~3KB, lazily imported)
- `next/font` — Archivo self-hosted (subset to woff2); Instrument Serif +
  JetBrains Mono from Google. All SIL OFL 1.1.

## Getting started

Requires Node.js 18.18+.

```bash
npm install
npm run dev        # http://localhost:3000
npm run dev:lan    # also reachable from a phone on the same Wi-Fi
```

`dev:lan` binds to `0.0.0.0` so other devices on the network can reach it at
`http://<your-lan-ip>:3000`. Note the dev server does not run the Cloudflare
Worker, so `POST /api/contact` will fail there — use `wrangler dev`, or a
deployed Worker, to exercise the form.

Note: `npm run build` writes to the same `.next` directory the dev server uses.
Stop `npm run dev` before building, or the running dev server will 404 on its
own chunks.

## Build

```bash
npm run build      # static export to ./out
```

## Deploy

The Worker in `worker/index.ts` serves `./out` through the `ASSETS` binding and
handles `POST /api/contact`, forwarding submissions through Web3Forms.

```bash
npx wrangler deploy
```

**Required before the form works:** set the Web3Forms secret on the Worker.

```bash
npx wrangler secret put WEB3FORMS_ACCESS_KEY
```

Without it the endpoint returns a 500 with a message pointing visitors at
`info@2zero2.build` — the site stays usable, but no mail is delivered.

To preview the Worker and the export together:

```bash
npm run build && npx wrangler dev
```

## Structure

```
app/
  layout.tsx           Shell, fonts, metadata
  page.tsx             Home — hero, services, work, process, contact
  globals.css          Theme tokens, type roles, aperture, reveals
  work/page.tsx        Work index
  work/[slug]/page.tsx Case study (static params from PROJECTS)
  not-found.tsx        404
components/
  Aperture.tsx         The intro. See DESIGN.md before changing it.
  Schematic.tsx        The hero board — circuit-board banner around the logo
  ThemeSwitch.tsx      Theme control in the header — LED + label
  Wordmark.tsx         Ships both prints, CSS picks one
  SiteChrome.tsx       Client shell — smooth scroll + header
  SpecLabel.tsx        Services as product labels — the signature component
  Header.tsx  Footer.tsx  Plate.tsx  ProjectCard.tsx  ContactForm.tsx  Reveal.tsx
  useLenis.ts          Smooth scroll, hash links, plate scale loop
  useContactForm.ts    POST /api/contact client
  content.ts           Product truth
public/
  brand/               Logo marks, OG image
  work/                Case-study screenshots
worker/index.ts        Static assets + contact endpoint
```

## Security

- **Headers.** `public/_headers` sets a Content-Security-Policy, HSTS,
  `nosniff`, `X-Frame-Options: DENY`, a referrer policy, and a permissions
  policy on every static page. The CSP allows same-origin only; if you add a
  third-party script, font, or embed, add its origin there or it will be
  blocked. Responses from the Worker set their own headers in
  `worker/index.ts`, because `_headers` doesn't reach them.
- **Contact endpoint.** `POST /api/contact` accepts only same-origin
  requests, JSON or form bodies up to 32KB, and service names from
  `SERVICES`. It strips control characters from single-line fields, so
  nothing typed into them can inject email headers, and it has a honeypot
  field.
- **Rate limit.** The `CONTACT_LIMITER` binding in `wrangler.jsonc` allows 5
  submissions per IP per minute. It needs wrangler 4.36 or later.
- **Dependencies.** `package.json` overrides `postcss` to a patched version,
  because Next 15 pins a vulnerable one. Drop the override after upgrading to
  a Next release that ships a fixed PostCSS. Run `npm audit` before deploys.
- **No secrets in git.** `.githooks/` blocks any commit or push that adds an
  env file (`.env*`, `.dev.vars`, keys, certs) or a credential-looking value.
  Pushes are scanned commit by commit, not just the last one. `npm install`
  turns the hooks on (the `prepare` script sets `core.hooksPath`), and
  `npm run scan-secrets` checks the whole history at any time. Real secrets
  belong in `npx wrangler@4 secret put <NAME>`, or `.dev.vars` for local
  `wrangler dev` (ignored). For a confirmed false positive, use
  `git commit --no-verify`.
- **No attribution trailers.** `.githooks/commit-msg` removes
  `Co-Authored-By:` and "Generated with" lines from every commit message.
- `npm run dev:lan` exposes the dev server to your whole network. Only use it
  on a network you trust.

## Themes

Dark by default; a light theme swaps `--color-ink` and `--color-paper` on
`:root[data-theme="light"]`, so components need no theme branches. The choice
lives at `localStorage["2z-theme"]` and is applied by a pre-paint script in
`app/layout.tsx`, so it never flashes. The hero board and screenshots are not
inverted. See DESIGN.md → "Two prints" before adding colour.

## Accessibility

Every text color clears 4.5:1 against its background. Reveals, smooth scroll, and
the intro aperture are all disabled under `prefers-reduced-motion`; the aperture
additionally never renders on the server, so the site ships open without
JavaScript and the contact form falls back to a plain `POST`.

## Fonts

Every face is SIL OFL 1.1: **Archivo** (display + body, self-hosted), **Instrument
Serif** (numerals), **JetBrains Mono** (labels). The wordmark's own commercial face appears only as outlined
SVG artwork under `public/brand/`, never as a webfont — keep it that way.

Archivo is subset to Latin + punctuation with `fontTools`, which takes it from
652KB to 62KB with both variable axes (`wght`, `wdth`) intact. To re-subset
after replacing the source:

```bash
python3 -m fontTools.subset SOURCE.ttf --unicodes="U+0020-007E,U+00A0,U+2010-2015,U+2018-201D,U+2022,U+2026,U+2192,U+00B7,U+00A9,U+00D7" --flavor=woff2 --layout-features='*' --output-file=app/fonts/OUT.woff2
```
