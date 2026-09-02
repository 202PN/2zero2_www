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
- `next/font` — Archivo self-hosted (OFL), Instrument Serif + JetBrains Mono from Google

## Getting started

Requires Node.js 18.18+.

```bash
npm install
npm run dev        # http://localhost:3000
```

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
  page.tsx             Home — hero, services, work, studio, contact
  globals.css          Theme tokens, type roles, aperture, reveals
  work/page.tsx        Work index
  work/[slug]/page.tsx Case study (static params from PROJECTS)
  not-found.tsx        404
components/
  Aperture.tsx         The intro. See DESIGN.md before changing it.
  SiteChrome.tsx       Client shell — smooth scroll + header
  Header.tsx  Footer.tsx  Plate.tsx  ProjectCard.tsx
  ServiceIndex.tsx  ContactForm.tsx  Reveal.tsx
  useLenis.ts          Smooth scroll, hash links, plate scale loop
  useContactForm.ts    POST /api/contact client
  content.ts           Product truth
public/
  brand/               Logo marks, cloud plates, OG image
  work/                Case-study screenshots
worker/index.ts        Static assets + contact endpoint
```

## Accessibility

Every text color clears 4.5:1 against its background. Reveals, smooth scroll, and
the intro aperture are all disabled under `prefers-reduced-motion`; the aperture
additionally never renders on the server, so the site ships open without
JavaScript and the contact form falls back to a plain `POST`.
