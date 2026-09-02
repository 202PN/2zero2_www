---
name: 2zero2
description: An editorial lookbook for software — black and white, hairline rules, one chroma, and a site that opens through its own logo.
colors:
  ink: "#0a0a0a"
  elevated: "#1c1c1c"
  paper: "#ffffff"
  panel: "#f4f4f4"
  dim: "#8a8a8a"
  signal: "#ffcc00"
typography:
  display:
    fontFamily: "Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(3.2rem, 10.5vw, 9rem)"
    fontWeight: 700
    fontVariationSettings: "'wdth' 112"
    lineHeight: 0.86
    letterSpacing: "-0.025em"
    textTransform: uppercase
  headline:
    fontFamily: "Archivo, sans-serif"
    fontSize: "clamp(2.2rem, 6vw, 4.5rem)"
    fontWeight: 700
    fontVariationSettings: "'wdth' 105"
    lineHeight: 0.94
    letterSpacing: "-0.02em"
    textTransform: uppercase
  body:
    fontFamily: "Archivo, sans-serif"
    fontSize: "1.05rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: "0.6875rem"
    letterSpacing: "0.2em"
    textTransform: uppercase
  serif:
    fontFamily: "Instrument Serif, Georgia, serif"
    fontWeight: 400
rounded:
  none: "0px"
  full: "9999px"
spacing:
  gutter: "clamp(1.25rem, 4vw, 4.5rem)"
  section: "clamp(5rem, 11vw, 9rem)"
---

# Design System: 2zero2

## Overview

**Creative North Star: "An editorial lookbook for software."**

The site is a fashion-house lookbook applied to a development practice. Full-bleed
monochrome image plates alternate with wide-margin type sections like spreads.
Structure is carried by hairline rules, numbering, and negative space — never by
boxes, cards, borders, or shadows. The register is urban and confident: monumental
uppercase grotesque, mono micro-labels, an editorial serif reserved for numerals.

It deliberately refuses the dark dev-agency terminal page and equally refuses the
tactical spec-sheet system this replaced. There are no panels, no stencil markings,
no safety colors. There is one photograph treatment (desaturated cloud plate), one
typographic voice, and one accent.

**Key characteristics:**
- Near-black and white, with a single chroma used at roughly one percent of pixels.
- The site opens through its own logo — a black curtain with the 2zero2 mark knocked
  out of it, growing until the page is simply open.
- Radius 0 on every rectangle. No shadows. No gradients used as color.
- Hairline rules at 12–14% ink are the only dividers.
- Four type roles, three families: Archivo (display + body), JetBrains Mono
  (labels), Instrument Serif (numerals only).

## Colors

Defined as Tailwind theme tokens in `app/globals.css`.

### Primary
- **Signal** (`#ffcc00`): the yellow from the 2zero2 logo, and the only chroma
  anywhere in the system.

### Neutral
- **Ink** (`#0a0a0a`): the page. Near-black rather than `#000` — it reads richer on
  screen and leaves true black available as a step below.
- **Elevated** (`#1c1c1c`): the one surface step above the page, used behind image
  plates while they load.
- **Paper** (`#ffffff`) / **Panel** (`#f4f4f4`): inverted sections.
- **Dim** (`#8a8a8a`): micro-labels and secondary prose. 5.7:1 on ink — passes AA
  for body text, which is the floor for any text color in this system.

### Named Rules

**The One Percent Rule.** Signal appears only on: the intro counter as it reaches
100, nav and link hover, the active form pill, the "available" status dot, and focus
rings. It is never a fill behind body text, never a second accent, and never joined
by another saturated color. If a new element wants color, it gets white or it gets
a rule.

**The Monochrome Photography Rule.** Every photographic asset is desaturated at the
asset level, not with a CSS filter — `plate-hero.webp` and `plate-band.webp` ship
greyscale. Client work screenshots are the single exception, and they are held to
the inverse rule below.

**The Index/Detail Rule.** Client work is greyscale wherever it is an index
(home, `/work`) and full color on its own case-study page. Hovering a work card
resolves it to color over 700ms. The index stays disciplined; color is what you
get for committing to a project.

## Typography

**Display / Body:** Archivo (variable, `wdth` + `wght`), self-hosted from
`app/fonts/Archivo-Variable.ttf` under the OFL. The width axis is what keeps the
display type from reading as default Helvetica — headlines run `wdth 112`,
sub-heads `wdth 105`, body `wdth 100`.
**Label:** JetBrains Mono, 11px, `0.2em` tracking, uppercase.
**Serif:** Instrument Serif, numerals and editorial accents only.

### Hierarchy
- **Display** (`.t-display`): the page h1 only. `clamp(3.2rem, 10.5vw, 9rem)`,
  uppercase, `-0.025em`, leading 0.86.
- **Headline** (`.t-headline`): section h2s, service and project names, buttons.
- **Body** (`.t-body`): sentence-case prose, capped near 46–62ch.
- **Label** (`.t-label`): section eyebrows `(01) SERVICES`, meta rows, figcaptions,
  nav, footer. The connective tissue of the whole page.
- **Serif** (`.t-serif`): index numbers, project years, the intro counter. Never
  used for prose, never italic.
- **Outline** (`.t-outline`): display type with the fill knocked out and a 1px
  stroke on `currentColor`. Used once per page at most, as a plate overlay.

### Named Rules

**The Uppercase Structure Rule.** Everything structural — headings, labels, nav,
buttons — is uppercase. Only body prose and form input text are sentence case.
No italics anywhere.

**The Serif-Is-Numerals Rule.** Instrument Serif exists to set numbers against the
grotesque. The moment it sets a sentence, the system has drifted.

## Layout

Sections are full-bleed and padded by a single `--gutter`
(`clamp(1.25rem, 4vw, 4.5rem)`), which every section shares so the left edge of all
type aligns down the entire page. Vertical rhythm runs on
`clamp(5rem, 11vw, 9rem)` between sections.

The header is fixed, transparent over the hero, and transitions to a 90% ink
backdrop with blur and a bottom hairline past 24px of scroll. Below `md` the nav
collapses to an "Index" toggle opening a full-screen list of oversized links.

Grids collapse to one column below `lg`: hero is single-column with content bottom-
aligned over the plate; services are a `5rem / 1fr / 26rem` index; work is a 3-up
(home) or 2-up (`/work`) grid; studio is `1.1fr / 0.9fr`; contact is
`0.85fr / 1.15fr`.

## Elevation & Depth

No shadows anywhere — there is not a single `box-shadow` in the codebase. Depth
comes from print logic: surface steps (ink → elevated), hairline rules, the scrim
gradients over photography, and the scroll-linked plate scale. The only
translucency is functional: the header's 90% backdrop and the hero scrim.

**The Flat Print Rule.** If a surface must separate from another, give it a rule or
a different surface — never a shadow, never a glow. `linear-gradient` may only draw
scrims over photography.

## Shapes

Radius 0 on every rectangle: plates, buttons, fields, pills, the mobile index. The
only curves in the system are the 6px `rounded-full` status dot in the header and
the letterforms of the logo itself.

**The Square Corner Rule.** Nothing in between — no 4px "softening."

## Components

### The Aperture (signature)
`components/Aperture.tsx`. A fixed black curtain with the 2zero2 mark knocked out
of it, laid over an already-rendered page. Two mask layers — the mark and a solid
fill — composited with `mask-composite: exclude` (`-webkit-mask-composite: xor`)
give everything-except-the-mark, so the page shows through the letterforms. An
Instrument Serif counter climbs to 100 against real load progress (`document.fonts.ready`
plus the hero plate), floored at 1.6s so a warm cache still gets the beat. At 100
the mask grows to 16× the viewport's larger axis over 1150ms on
`cubic-bezier(0.76, 0, 0.24, 1)` while the last slivers fade out.

It is built as a knockout precisely so it can never hide content: the site renders
normally underneath from first paint. It is skipped entirely when the session flag
is set, under `prefers-reduced-motion`, and where mask compositing is unsupported.
A 4s watchdog force-opens it if loading stalls.

### Buttons / Links
Text on a 2px bottom rule, uppercase Archivo, with an arrow that translates 4px on
hover. Rule and text both go Signal on hover. No filled buttons anywhere except the
selected form pill.

### Service index
Numbered rows separated by hairlines. Hovering one row drops its siblings to 34%
opacity and turns the hovered name Signal. Clicking pre-selects that project type
in the contact form via a `service:select` event.

### Form fields
Borderless inputs on a single bottom rule at 30% paper, rising to 55% on hover and
Signal on focus. Labels are mono micro-labels above the field. Pills are square
bordered cells that invert to Signal fill when selected.

### Plates
`components/Plate.tsx`. A photographic surface with the CSS grain overlay and a
`--plate-scale` custom property driven by one shared rAF loop in `useLenis`
(1.0 → 1.08 across the viewport pass). Never one observer per plate.

## Motion

Lenis for weighted smooth scroll; it also owns hash-link navigation, since a native
anchor jump fights its scroll position. Reveals are IntersectionObserver-driven,
24px and 800ms on `cubic-bezier(0.22, 1, 0.36, 1)`, staggered 60–100ms, and gated
behind `@media (scripting: enabled)` so content is never hidden from a visitor who
cannot run the observer that would reveal it.

Transforms and opacity only. Everything above is disabled under
`prefers-reduced-motion`, including Lenis itself.

## Do's and Don'ts

### Do
- **Do** open a new section with a numbered mono eyebrow and pad it with `--gutter`.
- **Do** separate things with a hairline rule, and let negative space carry the rest.
- **Do** keep Signal at roughly one percent of pixels, on interaction states only.
- **Do** desaturate any new photographic asset at the asset level.
- **Do** hold every text color to 4.5:1 against its background.
- **Do** keep motion to transforms and opacity, and honor reduced motion.

### Don't
- **Don't** add a shadow, a glow, a color gradient, or a rounded rectangle.
- **Don't** introduce a second accent color, or use Signal as a background for prose.
- **Don't** set prose in Instrument Serif, or use italics anywhere.
- **Don't** let the aperture become load-bearing — the site must render open
  without it.
- **Don't** fabricate testimonials, metrics, or claims. Copy comes from
  `components/content.ts`, which is product truth.
- **Don't** write "202" — the agency is always "2zero2".
