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
- `next/font` — Archivo self-hosted (subset to woff2); Pinyon Script, DotGothic16,
  Instrument Serif + JetBrains Mono from Google. All SIL OFL 1.1.

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
  Sun.tsx              Theme control, sited in the cloud plate
  Wordmark.tsx         Ships both prints, CSS picks one
  SiteChrome.tsx       Client shell — smooth scroll + header
  SpecLabel.tsx        Services as product labels — the signature component
  Header.tsx  Footer.tsx  Plate.tsx  ProjectCard.tsx  ContactForm.tsx  Reveal.tsx
  useLenis.ts          Smooth scroll, hash links, plate scale loop
  useContactForm.ts    POST /api/contact client
  content.ts           Product truth
public/
  brand/               Logo marks, cloud plates, OG image
  work/                Case-study screenshots
worker/index.ts        Static assets + contact endpoint
```

## Themes

Dark by default; a light theme swaps `--color-ink` and `--color-paper` on
`:root[data-theme="light"]`, so components need no theme branches. The choice
lives at `localStorage["2z-theme"]` and is applied by a pre-paint script in
`app/layout.tsx`, so it never flashes. Photography is not inverted — only the
scrims over it. See DESIGN.md → "Two prints" before adding colour.

## Accessibility

Every text color clears 4.5:1 against its background. Reveals, smooth scroll, and
the intro aperture are all disabled under `prefers-reduced-motion`; the aperture
additionally never renders on the server, so the site ships open without
JavaScript and the contact form falls back to a plain `POST`.

## Fonts

Every face is SIL OFL 1.1: **Archivo** (display + body, self-hosted),
**Pinyon Script** (script accents), **DotGothic16** (bitmap accents), **Instrument
Serif** (numerals), **JetBrains Mono** (labels). The wordmark's own commercial face appears only as outlined
SVG artwork under `public/brand/`, never as a webfont — keep it that way.

Archivo is subset to Latin + punctuation with `fontTools`, which takes it from
652KB to 62KB with both variable axes (`wght`, `wdth`) intact. To re-subset
after replacing the source:

```bash
python3 -m fontTools.subset SOURCE.ttf --unicodes="U+0020-007E,U+00A0,U+2010-2015,U+2018-201D,U+2022,U+2026,U+2192,U+00B7,U+00A9,U+00D7" --flavor=woff2 --layout-features='*' --output-file=app/fonts/OUT.woff2
```
