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
  script:
    fontFamily: "Pinyon Script, Apple Chancery, cursive"
    fontWeight: 400
    lineHeight: 0.9
  pixel:
    fontFamily: "DotGothic16, ui-monospace, monospace"
    fontWeight: 400
    textTransform: lowercase
    lineHeight: 1
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
- Two prints, one composition: a dark default and a light theme that swaps
  `ink` and `paper`. Nothing moves between them.
- Six type roles, five families: Archivo (display + body), JetBrains Mono
  (labels), Instrument Serif (numerals), Pinyon Script (script accents),
  DotGothic16 (bitmap accents). Every face is SIL OFL — see Typography.
- Bold against script: the wordmark's own face is the counterweight to the
  monumental grotesque.

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

### Two prints

The light theme is a token swap, not a second stylesheet: `--color-ink` (the
page) and `--color-paper` (the type) exchange values on
`:root[data-theme="light"]`, and every utility built on them inverts for free.
Spec labels become black cards on white, the header flips, the grain switches
from `overlay` to `multiply`.

Three things do **not** simply invert, and each is a deliberate token:

- **The photography.** A negative of a cloud is an ugly cloud. The plates stay
  as shot; only the scrims over them flip (`--hero-scrim`, `--band-scrim`), so
  the same image reads as storm on the dark print and open sky on the light one.
- **Yellow.** Signal is identical on both prints, everywhere: the hero
  tagline, the marquee marks, the Contact cell, the sun, and every interaction
  state — link and card hovers, field focus, error text, the success heading.
  The two prints differ in black and white and nothing else, which is the
  point of the theme.

  Record the cost rather than hiding it. `#ffcc00` measures ~13:1 on the dark
  ground and ~1.3–1.7:1 on the light one. On the decorative marks that is
  fine — the tagline is logotype, which WCAG 1.4.3 exempts, and the Contact
  cell is identified by its label at full paper contrast. On the interaction
  states it is a deliberate trade of contrast for brand consistency: a hover
  or an error message in Signal on the light print is faint. Anything that
  must be read without the accent still reads, because the accent is always a
  *change* from an already-legible default, never the only signal.

  `--color-onsignal` is near-black in both prints, so type sitting on a Signal
  fill always clears.
- **The intro curtain.** Always dark. Black opening onto a light page is a
  better reveal than white onto white, and it keeps the counter and rays
  legible without a second set of tokens.

Light-print `--color-dim` is `#6b6b6b`, not `#8a8a8a`, which would fail AA on a
light ground. The page is `#fbfbfa` rather than `#ffffff`: a full-bleed pure
white glares at this scale, and the warmth is what makes it read as paper.

Theme is stored at `localStorage["2z-theme"]` and applied by the same pre-paint
script that gates the intro, so it cannot flash. There is no
`prefers-color-scheme` default — the studio is dark unless a visitor says
otherwise.

### Named Rules

**The One Percent Rule.** Signal appears only on: the intro counter as it
reaches 100, nav and link hover, the boxed Contact cell, the active
form pill, focus rings, and the hero's script tagline. It is never a fill
behind body text, never a second accent, and never joined by another saturated
color. If a new element wants color, it gets white or it gets a rule.

Nothing on the site takes a large saturated fill. Yellow arrives on
interaction, or as a few words of script, and that is all.

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
**Pixel:** DotGothic16 — a bitmap face light enough in the stroke to sit beside
a fine copperplate. Press Start 2P was tried first and read as two unrelated
objects next to it: chunky 8-bit against hairline calligraphy is a clash, not a
contrast. Set lowercase on purpose. One word in the hero lockup, nowhere else.

**Script:** Pinyon Script — a fine copperplate, chosen over the brush faces
that echo the wordmark because the luxury register matters more here than
matching the logo's stroke. Its x-height is small, so it runs at roughly 0.65×
the display size rather than the 0.36× a brush face needed. Display sizes only.

**The Open Licence Rule.** Every face on the site is SIL OFL 1.1 — Archivo
(self-hosted, subset), Pinyon Script, DotGothic16, Instrument Serif, JetBrains
Mono. The
wordmark's actual face is a commercial licence, so it lives on the site only as
outlined SVG artwork (`public/brand/*.svg`), never as a webfont. Any face added
later has to clear the same bar.

### Hierarchy
- **Display** (`.t-display`): the page h1 only. `clamp(3.2rem, 10.5vw, 9rem)`,
  uppercase, `-0.025em`, leading 0.86.
- **Headline** (`.t-headline`): section h2s, service and project names, buttons.
- **Body** (`.t-body`): sentence-case prose, capped near 46–62ch.
- **Label** (`.t-label`): section eyebrows `(01) SERVICES`, meta rows, figcaptions,
  nav, footer. The connective tissue of the whole page.
- **Serif** (`.t-serif`): index numbers, project years, the intro counter. Never
  used for prose, never italic.
- **Script** (`.t-script`): the other half of the bold/script contrast. One or
  two words at a time, always adjacent to something set in the display face —
  never a line of its own, never body copy. It stands in for the wordmark's
  voice, so it carries the logo's yellow where it appears against black.
- **Pixel** (`.t-pixel`): the bitmap register. One word at a time, inside a
  lockup, never a line of copy and never small enough that the pixel grid stops
  reading as deliberate.
- **Outline** (`.t-outline`): display type with the fill knocked out and a 1px
  stroke on `currentColor`. Used once per page at most, as a plate overlay — on
  the home page it is "TWO ZERO TWO" across the process band. Knock out the fill
  with `-webkit-text-fill-color`, never `color`, or the stroke's `currentColor`
  goes transparent along with it.

### Named Rules

**The Uppercase Structure Rule.** Everything structural — headings, labels, nav,
buttons — is uppercase. Only body prose and form input text are sentence case.
No italics anywhere.

**The Quiet Hero Rule.** The hero carries no call to action. Plate, eyebrow,
wordmark, one factual line — that is all. A button in the first viewport reads
as eager, and eager is the opposite of the register this site is in. The nav is
always on screen and the contact section is one anchor away; the booking link
lives down there too, where offering it is an answer rather than a pitch.

**The Nouns Rule.** Section headers are nouns, not sentences and not questions.
`OFFERINGS`, `WORK`, `PROCESS`, `START A PROJECT`. There are no exceptions
left: the studio section used to state a claim, and it is now four steps under
a one-word head like everything else. The hero
h1 is the wordmark itself — grotesque `2ZERO2` with the logo's own tagline,
`digital design`, set in the script face beneath it. Explaining goes in the mono
eyebrow above or the body line below, never in the header.

**The Three Registers Rule.** The hero lockup is the one place the type system
shows its whole range at once: `2ZERO2` in the display grotesque, `digital` in
the bitmap face, `design` in the script — machine, arcade, hand, stacked into a
single mark. The three have to be balanced by weight, not by size: a hairline
script needs roughly double the point size of a brush one to hold the same
presence, and the bitmap face has to be chosen to match whichever script is in
play. It works because the three are locked together, share a baseline,
and the lower two are both lowercase; setting the pixel word in caps breaks it. Neither the script nor the pixel face may stand alone elsewhere:
both exist only as counterweights to something set in the display face.

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
(home) or 2-up (`/work`) grid; process is a 4-up collapsing to 2 then 1;
contact is
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

Radius 0 on every rectangle: plates, buttons, fields, pills, spec labels, the
boxed Contact cell, the mobile index. There are no curves in the system at all
beyond the letterforms of the wordmark itself.

**The Square Corner Rule.** Nothing in between — no 4px "softening."

**The Borders Belong To Labels Rule.** Spec labels are the one place hard
borders and boxes are allowed, because a label is a physical object. Everywhere
else structure stays hairlines and negative space. Do not let box-drawing leak
out of the label system into the editorial sections.

## Components

### The Aperture (signature)
`components/Aperture.tsx`. A fixed black curtain with the 2zero2 globe badge
knocked out of it, laid over the page. The badge — arched wordmark over a
wireframe globe over `DIGITAL DESIGN` — is used rather than the script mark
because it is compact and centred, so it holds the middle of the frame the way
the reference does; the globe's wireframe also lets the plate through as fine
lines rather than solid slabs. The mask asset is
`public/brand/2zero2_globe_mask.svg`, a pure-white copy of the badge (only
alpha matters to a mask, but being explicit beats relying on the coloured
original).

Its opening size is capped on both axes (`min(72vw, 54vh, 520px)`): the mask is
square, so a width-only cap overflows a short viewport and crops the badge's
wordmark. Two mask layers — the mark and a solid fill —
composited with `mask-composite: exclude` (`-webkit-mask-composite: xor`) give
everything-except-the-mark, so the page shows through the letterforms. An
Instrument Serif counter climbs to 100 against real load progress
(`document.fonts.ready` plus the hero plate), floored at 1.6s so a warm cache
still gets the beat. At 100 the mask grows to 16× the viewport's larger axis over
1150ms on `cubic-bezier(0.76, 0, 0.24, 1)` while the last slivers fade out.

**It is server-rendered, so the curtain is in the very first painted frame.**
Deferring it to a client effect makes the site flash into view before the black
lands on top of it — the one thing this component exists to prevent.

**It fails closed.** The curtain is `display: none` by default. A blocking
pre-paint script in `app/layout.tsx` is the only thing that turns it on, by
setting `data-intro="hold"` on `<html>`. That script bails — leaving the site
open — under `prefers-reduced-motion` or where mask compositing is unsupported,
and it is wrapped in a `try` so a throw lands in the same place. No JavaScript
at all lands there too. A 4s watchdog force-opens a stalled load.

**It plays on every page load.** There is no once-per-session flag: the
entrance is the brand, and it runs every time someone arrives. What keeps that
from grating is that the gate script only runs on a real document load, so
client-side navigation back to `/` unmounts the aperture immediately instead of
replaying it. Clicking Home from Work does not re-run the intro; refreshing
does.

`data-intro` is the whole state machine, and it also locks scroll:
`"hold"` (counter running, header and hero copy held back) → `"open"` (mask
growing, copy entering behind it) → removed (curtain unmounted, scroll released).

Anything the gate script needs must come from a plain module, never from a
`"use client"` file — a constant imported from one reaches the server-rendered
script as `undefined` rather than its value.

### Spec labels (signature)
`components/SpecLabel.tsx`. Services are rendered as product labels: a white
card with a hard 2px black border, a boxed header pairing the service name
against a `2ZERO2 / SERVICE / UNIT NN` stamp cell, bulleted `KEY: value` spec
rows in mono, and an inverted black footer bar carrying `2zero2.build`, the
unit count, and an abstract registration glyph. They lift 4px on hover and
pre-select their project type in the contact form.

White objects laid on the black page — that inversion is the point, and it is
why this is the one component allowed borders. Spec rows live in
`SERVICE_SPECS` in `components/content.ts`, keyed by service name; keys stay
one short word so they fit the key column.

### The plate
The hero photograph carries nothing over it. Earlier passes ran a square grid,
then construction lines, then a quilted lattice, then a hand-drawn wireframe;
all are gone. A photograph is already texture, and anything laid across it
competes rather than combines. The only things in the plate are the scrim and
the sun.

### Sun (signature)
`components/Sun.tsx`. The theme control, disguised as the sun breaking through
the cloud plate: it sits at a percentage position tuned to a bright pocket of
open sky rather than living in the chrome, so switching prints reads as the
weather changing. Flat fill and hard rays like everything else; its halo is the
one soft edge in the system, allowed because a sun with no light around it
reads as a sticker. On the light print the halo swells and the rays rotate out.

### Navigation
Mono micro-labels at 70% paper, going accent on hover. `Contact` is the one
exception: a Signal-bordered cell that fills Signal on hover, identically on
both prints. Below `md` the nav collapses to a three-bar control that morphs into
a cross, with the Contact cell staying beside it: on a phone the one thing
worth reaching is always one tap away, never behind a menu. It is the
only nav item that reads as a control, and it exists precisely because the hero
carries no call to action (see The Quiet Hero Rule) — the path to contact has to
live somewhere permanent, and the header is always on screen. Do not box a
second item; the affordance works because it is alone.

### Buttons / Links
Text on a 2px bottom rule, uppercase Archivo, with an arrow that translates 4px on
hover. Rule and text both go Signal on hover. No filled buttons anywhere except the
selected form pill.

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
cannot run the observer that would reveal it. The observer also treats
"already scrolled past" as revealed — a fast scroll can carry an element from
below the fold to above it between frames, and it would otherwise stay hidden
for good.

No `will-change` on the plates: it would promote a compositing layer for every
plate on the page for the whole session, and rewriting the transform each frame
gets them composited anyway.

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
- **Do** check both prints when adding colour, and keep them identical apart
  from black and white — that constraint is the theme.
- **Do** keep new section headers to nouns (see The Nouns Rule).
- **Do** reach for a spec label when a section needs to enumerate what is
  actually delivered — that is what the form is for.
- **Do** leave the photography alone. It is the texture; it does not need a
  pattern laid over it.

### Don't
- **Don't** add a shadow, a glow, a color gradient, or a rounded rectangle.
- **Don't** draw a box outside the label system, and don't give anything a
  large saturated fill.
- **Don't** set a line of copy in the script or pixel face, or use either
  without something in the display face next to it.
- **Don't** put a call to action in the hero (see The Quiet Hero Rule).
- **Don't** add a face that isn't open-licensed (see The Open Licence Rule).
- **Don't** introduce a second accent color, or use Signal as a background for prose.
- **Don't** set prose in Instrument Serif, or use italics anywhere.
- **Don't** let the aperture become load-bearing. It must stay server-rendered
  (or it flashes) *and* fail closed (or a bad browser gets a black screen).
- **Don't** fabricate testimonials, metrics, or claims. Copy comes from
  `components/content.ts`, which is product truth.
- **Don't** write "202" — the agency is always "2zero2".
