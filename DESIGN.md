---
name: 2zero2
description: An editorial lookbook for software — black and white, hairline rules, one chroma, a circuit-board hero, and a site that opens through its own logo.
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

The site is a fashion-house lookbook applied to a development practice. It opens
on one loud piece of artwork — a dark-yellow circuit board of the things the
studio builds, wired to the 2zero2 mark — and everything after it is quiet:
wide-margin type sections like spreads, structured by hairline rules, numbering,
and negative space rather than boxes, cards, borders, or shadows. The register is
urban and confident: monumental uppercase grotesque, mono micro-labels, an
editorial serif reserved for numerals.

It deliberately refuses the dark dev-agency terminal page. The board is the only
place technical drawing appears; there are no stencil markings or panels in the
editorial sections, one typographic voice, and one accent.

**Key characteristics:**
- Near-black and white, with a single chroma used at roughly one percent of pixels —
  everywhere except the hero board, which is the one coloured artwork on the
  page (see Hero board).
- The site opens through its own logo — a black curtain with the 2zero2 mark knocked
  out of it, growing until the page is simply open.
- Radius 0 on every rectangle. No shadows. No gradients used as color.
- Hairline rules at 12–14% ink are the only dividers.
- Two prints, one composition: a dark default and a light theme that swaps
  `ink` and `paper`. Nothing moves between them.
- Four type roles, three families: Archivo (display + body), JetBrains Mono
  (labels), Instrument Serif (numerals). Every face is SIL OFL — see
  Typography.
- Services first. The page exists to say what the studio builds and to get a
  visitor into the contact form; brand moments stay small and never stand
  between a visitor and either of those.

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

- **The artwork.** The hero board and the case-study screenshots are the same
  on both prints. A negative of a drawing or a screenshot is just a wrong
  picture.
- **The accent changes colour.** Signal is `#ffcc00` on the dark print and
  `#355e3b`, a hunter green, on the light one. A saturated yellow that sings on
  black goes weak and acidic on paper; the green holds at 7.2:1 and reads as
  ink rather than highlighter. `#013220` was tried and rejected — at 13.6:1 it
  is so dark it stops registering as an accent at all and just looks like the
  body text.

  It applies everywhere the accent appears: hovers, focus, error text, the
  success heading, the Contact cell, the selected pill.

  **The theme control is the exception.** It is an indicator, not an accent:
  an LED lit `--led-green` on the dark print and an unlit ring on the light
  one, beside a mono `DARK` / `LIGHT` label. Both labels ship and CSS picks
  one via `.on-dark` / `.on-light`, the same way the wordmark does: the theme
  is applied before React hydrates, so choosing in JS would flash the wrong
  word.

  `--color-onsignal` — type sitting on a Signal fill — flips with the accent:
  near-black on yellow, near-white on green. Near-black on `#355e3b` is 2.6:1
  and would fail.

Light-print `--color-dim` is `#6b6b6b`, not `#8a8a8a`, which would fail AA on a
light ground. The page is `#fbfbfa` rather than `#ffffff`: a full-bleed pure
white glares at this scale, and the warmth is what makes it read as paper.

Theme is stored at `localStorage["2z-theme"]` and applied by the same pre-paint
script that gates the intro, so it cannot flash. There is no
`prefers-color-scheme` default — the studio is dark unless a visitor says
otherwise.

### Named Rules

**The One Percent Rule.** Outside the hero board, Signal appears only on: the intro counter as it
reaches 100, nav and link hover, the boxed Contact cell, the active
form pill, and focus rings. It is never a fill
behind body text, never a second accent, and never joined by another saturated
color. If a new element wants color, it gets white or it gets a rule.

Outside the hero board, nothing on the site takes a large saturated fill.
Yellow arrives on interaction, and that is all.

**The Monochrome Photography Rule.** Any photographic asset is desaturated at
the asset level, not with a CSS filter. Client work screenshots are the single
exception, and they are held to the inverse rule below.

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

There is no script or bitmap face. Pinyon Script and DotGothic16 once set
accent words in the hero; both were removed as gimmicky. The wordmark is the
only script on the site, and it is artwork, not type.

**The Open Licence Rule.** Every face on the site is SIL OFL 1.1 — Archivo
(self-hosted, subset), Instrument Serif, JetBrains Mono. The
wordmark's actual face is a commercial licence, so it lives on the site only as
outlined SVG artwork (`public/brand/*.svg`), never as a webfont. Any face added
later has to clear the same bar.

### Hierarchy
- **Display** (`.t-display`): the page h1 only. `clamp(3.2rem, 10.5vw, 9rem)`,
  uppercase, `-0.025em`, leading 0.86.
- **Headline** (`.t-headline`): section h2s, service and project names, buttons.
- **Body** (`.t-body`): sentence-case prose, capped near 46–62ch.
- **Label** (`.t-label`): meta rows, form labels, figcaptions, nav, footer.
  The connective tissue of the whole page. Sections do not open with a
  label eyebrow — the header stands alone.
- **Serif** (`.t-serif`): index numbers, project years, the intro counter. Never
  used for prose, never italic.

### Named Rules

**The Uppercase Structure Rule.** Everything structural — headings, labels, nav,
buttons — is uppercase. Only body prose and form input text are sentence case.
No italics anywhere.

**The Services-First Hero Rule.** The first screen says what the studio
builds, in the headline itself, and offers exactly one primary action. In
order: the hero board filling the whole first screen with the mark at its
centre, then — on a frosted panel laid over the foot of the board — a plain
headline, `DESIGN AND DEVELOPMENT FOR WEBSITES AND
WEB APPS`, set in the headline face, one body paragraph naming the services and
post-launch support, then `START A PROJECT →` as the
primary action and `BOOK A 30-MINUTE CALL →` as a mono secondary link. A
row at the foot of the panel lists every service by name (from `sm` up; on
a phone the board needs the room). Nothing else goes in the hero —
no second headline, no badges, no client logos, no stats.

**The Nouns Rule.** Section headers are nouns, not sentences and not questions.
`WORK`, `SERVICES`, `PROCESS`, `START A PROJECT` — the order they run down
the home page, proof before offer. The studio section used to
state a claim, and it is now four steps under a one-word head like everything
else. The hero h1 is the one deliberate exception: it is a statement, because the first screen has to say what the
studio does (see The Services-First Hero Rule). Explaining goes in the body
line beside the header, never in the header.


**The Serif-Is-Numerals Rule.** Instrument Serif exists to set numbers against the
grotesque. The moment it sets a sentence, the system has drifted.

## Layout

Sections are full-bleed and padded by a single `--gutter`
(`clamp(1.25rem, 4vw, 4.5rem)`), which every section shares so the left edge of all
type aligns down the entire page. Vertical rhythm runs on
`clamp(5rem, 11vw, 9rem)` between sections.

The header is fixed and always frosted: 55% ink with a backdrop blur at the
top of the page, where it sits over the hero board, rising to 90% ink with a
bottom hairline past 24px of scroll. Below `md` the nav
collapses to an "Index" toggle opening a full-screen list of oversized links.

Grids collapse to one column below `lg`: the hero panel is headline / copy,
two columns from `lg`; services are a `5rem / 1fr / 26rem` index; work is a 3-up
(home) or 2-up (`/work`) grid; process is a 4-up collapsing to 2 then 1;
contact is
`0.85fr / 1.15fr`.

## Elevation & Depth

No shadows anywhere — the one `box-shadow` in the codebase draws the theme
LED's ring, not depth. Depth comes from print logic: surface steps (ink →
elevated), hairline rules, and the scroll-linked plate scale.

Translucency belongs to the hero only. The header and the hero's copy panel
are frosted glass over the board (`.frost`: page colour at 70%, 16px backdrop
blur), so the board gets the whole first screen and still reads through as
texture under the type. Dim text fails contrast on the glass, so secondary
copy there is `paper` at 75–85% instead.

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

During the hold the cut-out shows a flat `#ffcc00` layer (`.ap-fill`) rather
than the page, so the mark reads as solid yellow on black; the busy hero
board seen through the letterforms made it hard to read. The fill fades over
360ms as the opening starts, and from then on the hole shows the page.

Its opening size is capped on both axes (`min(72vw, 54vh, 520px)`): the mask is
square, so a width-only cap overflows a short viewport and crops the badge's
wordmark. Two mask layers — the mark and a solid fill —
composited with `mask-composite: exclude` (`-webkit-mask-composite: xor`) give
everything-except-the-mark, so the page shows through the letterforms. An
Instrument Serif counter climbs to 100 against real load progress
(`document.fonts.ready` plus the hero logo), floored at 0.9s so a warm cache
still gets the beat. At 100 the mask grows to 16× the viewport's larger axis over
950ms on `cubic-bezier(0.76, 0, 0.24, 1)` while the last slivers fade out.

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
with its serif index number, an engagement tag, the one-sentence pitch from
`SERVICES`, `KEY` / value spec rows in mono, and an inverted black footer bar
reading
`START THIS PROJECT →`. They lift 4px on hover. The whole label is a link to
the contact form, and clicking it pre-selects that service in the form's
"What do you need?" picker (a window event, `pickService` in
`useContactForm.ts`).

The label exists to sell the service, so everything on it is information:
an earlier version carried a `2ZERO2 / SERVICE / UNIT NN` stamp and a fake
registration code and left the pitch sentence unrendered. Don't bring
decoration back onto the card.

White objects laid on the black page — that inversion is the point, and it is
why this is the one component allowed borders. Spec rows live in
`SERVICE_SPECS` in `components/content.ts`, keyed by service name; keys stay
one short word (at most `DELIVERED`) so they fit the key column.

**The Framework Rule.** The copy presents every engagement as one defined
process, never as open-ended custom work. That shows in three places:

- **Engagement tag.** Each card says how it is engaged, with no price:
  `FIXED SCOPE` (outlined) with "Quoted after discovery", or `ONGOING`
  (solid) with "Monthly plan". The two styles exist so the kinds read apart
  at a glance. Prices never appear on the site.
- **Uniform rows.** Every card opens with `INCLUDES` and closes with
  `DELIVERED`; only the middle row is specific to the service.
- **Process outputs.** Each of the four steps (`STEPS`) names its output, set
  as a mono `→` line, so the visitor knows what they will have in hand when
  that step closes.

### Hero board (signature)
`components/Schematic.tsx`. The hero is a full-screen board drawn as a
circuit-board blueprint of what the studio builds: wireframes of a marketing
site, a dashboard, and a phone, a database, and black IC chips for the
services behind them (API, AUTH, CDN, CMS), all on a blueprint grid inside an
engineering-drawing frame with zone references and a dimension line. Every
trace runs to U1, a keep-out in the middle that carries the black 2zero2
wordmark at full scale.

Colour is the board's own and stays the same on both prints, tokenised on
`:root` as `--board-bg` (`#b08a10`, a dark yellow), `--board-ink`
(`#111111`), `--led-red` and `--led-green`, plus three neon signal colours,
`--wire-cyan`, `--wire-magenta`, and `--wire-green`. This is the one place
colours beyond Signal appear, and they mean one thing: status. They are
indicators only — never type, never fills larger than an LED.

- **LEDs** are small surface-mount pills: a black bezel that stays put, a lit
  core with a faint bloom and a pinpoint highlight. Blinking ones breathe
  (a soft fade) rather than flash.
- **Signal pulses** are short neon comets on a few traces at a time, built
  from four strokes riding one dash — two translucent blooms, the coloured
  core, a white-hot centre. Wide translucent strokes stand in for a blur
  filter, so they cost nothing to animate and look the same everywhere.
  Keep them few: the cyberpunk reads from the colour, and more of them only
  makes it busy. The ink on the board clears 5.3:1 against
its ground.

The hero section is `min-h-[100svh]` and is itself the board's ground:
`.board` paints the dark yellow and the two-step blueprint grid in CSS, so it
fills any screen shape. The drawing sits on top as one of two sheets, and
both ship; CSS shows one by orientation (`.board-wide` / `.board-tall`):

- **Wide** (1600 × 800, landscape): parts flank U1 left and right.
- **Tall** (800 × 1020, portrait): the site, API, and phone stack above U1;
  the database, CDN, AUTH, and dashboard below.

Either way the sheet is inset to the clear space between the header
(`--header-h`) and the copy panel's overlap (`--panel-overlap`), so every
part reads and only the grid goes under the frosted glass.

Each is fitted whole and centred with `preserveAspectRatio="xMidYMid meet"`,
so no part is ever cropped; the CSS grid carries on around it. Parts, pins,
and the keep-out are shared components — a sheet is only positions and
wiring. Traces are generated from two helpers (`hv`, `vh`: straight, one 45°
jog, straight) and `fan`, which converges a row of pins on a row of targets
with the outer lines jogging first so it never crosses itself; route new
ones with them rather than by hand.

Motion is CSS only: LEDs blink on staggered delays, and a few traces carry a
short signal pulse (`pathLength=100` dash animation). Under reduced motion the
LEDs stay lit and the pulses are removed. There is no client JavaScript.

The hero used to be a looping cloud clip under a scrim. The footage files
(`plate-hero*.mp4`, `plate-hero.webp`) are no longer referenced.

### Theme switch
`components/ThemeSwitch.tsx`. The theme control, first in the header nav: an
8px LED and a mono label naming the current print. Lit green with a faint
ring on the dark print (`DARK`), an unlit outline on the light one
(`LIGHT`) — the same indicator language as the hero board.

It replaced a sun / moon mark, which before that sat out in the hero's sky
with a `[ click ]` label.

### Navigation
Mono micro-labels at 70% paper, going accent on hover. `Contact` is the one
exception: a Signal-bordered cell that fills Signal on hover, identically on
both prints. Below `md` the nav collapses to a three-bar control that morphs into
a cross, with the Contact cell staying beside it: on a phone the one thing
worth reaching is always one tap away, never behind a menu. It is the
only nav item that reads as a control, so the path to contact is on screen
from every scroll position, not just the hero. Do not box a
second item; the affordance works because it is alone.

### Buttons / Links
Text on a 2px bottom rule, uppercase Archivo, with an arrow that translates 4px on
hover. Rule and text both go Signal on hover. No filled buttons anywhere except the
selected form pill.

### Form fields
The contact form asks, in order: what do you need (a single-choice picker of
every service plus "Not sure yet"), name (optional), email (required), and
what you are building. The picker's value is sent as `service` and lands in
the delivered email's subject line.

Borderless inputs on a single bottom rule at 30% paper, rising to 55% on hover and
Signal on focus. Labels are mono micro-labels above the field. Pills are square
bordered cells that invert to Signal fill when selected.

### Plates
`components/Plate.tsx`. A photographic surface with the CSS grain overlay and a
`--plate-scale` custom property driven by one shared rAF loop in `useLenis`
(1.0 → 1.08 across the viewport pass), anchored at the top. Never one
observer per plate. Site screenshots are shown at their own 16:10 with
`object-top`, never cut to a viewport height: on a portrait phone that leaves
only the middle of a landscape image.

## Motion

Lenis for weighted smooth scroll; it also owns hash-link navigation, since a native
anchor jump fights its scroll position. It loads only for a mouse or trackpad
(`(hover: hover) and (pointer: fine)`): on touch it smooths nothing but its
blocking touchmove listeners make native scroll stick. The root carries
`overscroll-behavior-y: none`, so a flick to the top never pulls to refresh.
Reveals are IntersectionObserver-driven,
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
- **Do** open a new section with its header alone, and pad it with `--gutter`.
- **Do** separate things with a hairline rule, and let negative space carry the rest.
- **Do** keep Signal at roughly one percent of pixels, on interaction states only.
- **Do** desaturate any new photographic asset at the asset level.
- **Do** keep red and green to indicators: the hero board and the theme
  switch's LED.
- **Do** hold every text color to 4.5:1 against its background.
- **Do** keep motion to transforms and opacity, and honor reduced motion.
- **Do** check both prints when adding colour. Reach for `--color-signal`,
  which resolves to yellow or green per print.
- **Do** keep new section headers to nouns (see The Nouns Rule).
- **Do** reach for a spec label when a section needs to enumerate what is
  actually delivered — that is what the form is for.
- **Do** leave the photography alone. It is the texture; it does not need a
  pattern laid over it.

### Don't
- **Don't** add a shadow, a glow, a color gradient, or a rounded rectangle.
- **Don't** draw a box outside the label system, and don't give anything a
  large saturated fill.
- **Don't** add numbered eyebrows above section headers, or script accent
  words — both read as gimmicks here.
- **Don't** put more than one primary action in the hero (see The
  Services-First Hero Rule).
- **Don't** add a face that isn't open-licensed (see The Open Licence Rule).
- **Don't** introduce a second accent color, or use Signal as a background for prose.
- **Don't** set prose in Instrument Serif, or use italics anywhere.
- **Don't** let the aperture become load-bearing. It must stay server-rendered
  (or it flashes) *and* fail closed (or a bad browser gets a black screen).
- **Don't** describe the size of the team, or lean on how personal it is
  ("the people who scope it build it", "we read every message ourselves").
  Talk about the work and the process instead.
- **Don't** promise response times ("we reply within one business day").
  Say what happens next, not how fast.
- **Don't** fabricate testimonials, metrics, or claims. Copy comes from
  `components/content.ts`, which is product truth.
- **Don't** write "202" — the agency is always "2zero2".
