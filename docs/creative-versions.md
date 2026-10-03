# Creative versions: direction for `/creative-1`, `/creative-2`, `/creative-3`

Three new alternative home pages. They exist because the client found the current site
visually unambitious. Each version is a **different design**: different composition,
visual construction, type treatment and motion language. They are **not** different
section orders.

Fixed across all three:

- **Section order:** Hero, Stats, Services, Approach, Partners, Showcase, About, Contact.
  Header and footer come from `src/app/(site)/layout.tsx`, which also supplies Lenis,
  `Grain` and `ScrollProgress`.
- **Copy:** `docs/copy-home.md`, verbatim. Two blocks are not in that file. They come from
  the approved `/` page and trace back to the inventory:
  - the fourth stat, `8 / Systems we install`;
  - the Showcase block: eyebrow `The result`, H2 `Technology you stop noticing.`, caption
    `Boca Raton · Lighting, audio and surveillance`, and the photo alt
    `A Husky-integrated estate at dusk, interior and landscape lighting on`.
  Nothing else gets added. `[VERIFY]` items stay in the copy, flagged as they are today.
- **Hard rules** from `docs/site-versions-plan.md`:
  - Don't touch `/`.
  - Every new primitive gets a `/styleguide/modern/*` page and an entry in
    `src/app/styleguide/navigation.ts`.
  - Tokens only. Radius stops at 4px. Fonts are Outfit, Geist and Geist Mono.
  - Use two surface levels and never put a card inside a card.
  - English only.
- **Brand filter:**
  - One accent (orange), used as a signal.
  - Full-width bands can only be `#090A0F`, `--brand-light` or orange.
  - Text on an orange band is brand-black. Text on a light band is black or navy.
  - No decorative dividers, no glassmorphism, no gradient soup and no pills.
- **Motion contract** (all three versions):
  1. The server-rendered HTML is the **final, readable state**. JS may set a "before"
     state only on elements **below the first viewport**, and only inside the
     motion-allowed `matchMedia` branch. Nothing in the first viewport is ever hidden while
     waiting for hydration.
  2. `prefers-reduced-motion: reduce`: no pins and no scrub. Content renders in its static
     final layout, which is specified per section below.
  3. Animate `transform`, `opacity` and `clip-path` only. Use DrawSVG
     (`stroke-dashoffset`) on SVG. Never animate `filter`, `width`/`height`/`top`/`left`
     or `letter-spacing`. Tracking effects are faked with per-character `x`.
  4. Every pinned or horizontal scene has a written **390px fallback**. Below `md`
     (768px) **nothing pins** in Creative 1. iOS address-bar resizes make pins jump, and
     the phone already has the most honest scroll there is.
  5. The scrub core is mandatory. Reveal-on-enter alone does not meet the brief.

The three versions are deliberately far apart:

| | Creative 1: **Low Voltage** | Creative 2: **Afterdark** | Creative 3: **Switchboard** |
|---|---|---|---|
| Visual construction | 1px architectural linework that draws itself | Cinema: full-bleed photography and one 3D object | Pure typography and full-width colour bands. No images. |
| Type treatment | Display type split into lines that rise and track apart | Subtitle-scale captions over picture, letterboxed | Type fitted to the viewport width, scaling and tracking as the hero object |
| Motion language | Drawing, wiring, wiping: the house gets *built* | Camera moves, exposure, cuts: the house is *filmed* | Switching, flipping, snapping: the house gets *operated* |
| Through-line | A cable run that powers each section, from mark to mark | An extruded 3D Husky mark the camera orbits | The mark broken into shards that assemble at Contact |
| Dominant axis | Vertical, with one horizontal track (Services) | Depth (z) | Horizontal bands and rows |
| Three.js | No | **Yes (the only one)** | No |

---

# Creative 1: Low Voltage

## Concept

**The page wires the house as you scroll.** Every visual is built from the vocabulary of
an integrator's drawings: 1px lines, plan geometry, cable runs, junction nodes and mono
annotations. Scrolling is the act of construction. Lines draw, rooms slide past, the
wiring goes in before the walls close, and at the end the system powers on in orange.
It gives the copy's two theses, *"engineered quietly"* and *"before the walls close"*, a
literal moving form.

- **Surfaces, top to bottom:**
  - Hero: dark, with the dusk photo inside the mark.
  - Stats: **light band**.
  - Services, Approach, Partners, Showcase and About: dark.
  - Contact: **orange band**.

  That gives a heavy/quiet rhythm and three surface changes in eight sections.
- **Orange budget:** the cable's live head, active junction nodes, one primary CTA per
  viewport, and the Contact band. Nothing else.
- **Easing:** one curve for scrubbed tweens, `ease: "none"`, so motion is linear to
  scroll. The scrub smoothing value supplies the feel. One curve for state changes,
  `cubic-bezier(0.16, 1, 0.3, 1)`, at 250ms.
- **Scrub smoothing:** `scrub: 0.3` everywhere. Lenis already smooths the wheel, and a
  larger value makes pinned scenes feel laggy.

## Page-level through-line: the Cable Run

The cable starts as the Husky mark's chin in the hero, runs down the page's left gutter
through every section, and ends by drawing the mark again, in brand-black, on the orange
Contact band. It is one device that ties the scroll story together. In effect it is the
scroll progress bar, made physical and on-brand.

**Construction:**

- Each section renders one `<CableSegment>` in its left gutter.
- Placement: `left: calc(var(--gutter) / 2)`, where the gutter is the `.section-x`
  padding. That puts the cable at 32px at 1440 and 12px at 390.
- Each segment has two layers:
  - **Track:** a 1px full-height line, `bg-foreground/12`. On the light band it is
    `bg-navy-900/16`.
  - **Fill:** a 1px line, `bg-foreground/48`, with `transform-origin: top`. Its
    `scaleY` scrubs 0 to 1 from `top center` to `bottom center` of the section. Inside a
    pinned section, the trigger is the pin, so the fill tracks pin progress.
- **Live head:** a 1px × 24px orange tip that rides the fill's leading edge
  (`y = fill progress × segment height`). The orange is always the moving point, never
  the whole line.
- **Junction node:** an 8 × 8 square at the top of each segment. Corners are square
  (`rounded-none`; 0 is under the ceiling). Border is 1px `foreground/24`.
  - When the head passes it, the node fills orange and the section's eyebrow shifts from
    `muted-foreground` to `foreground`.
  - Driven by `onToggle`, with a 250ms CSS transition. This is a **state change**, so it
    is not scrubbed.
  - It reverses on scroll-up, because it is state.
- **Origin:** in the hero, the first segment's top is visually anchored to the mark
  window's chin point. The mark path's lowest node is around `(540, 708)` in viewBox
  `386 354 308 372`.
- **Terminus:** in Contact, the last segment turns right at the H2 baseline. A DrawSVG
  path continues into the outline of a large brand-black mark, which then fills (see
  §8).
- **Semantics:** decorative. `aria-hidden`, `pointer-events: none`.
- **Reduced motion:** track and fill render fully drawn at `foreground/24`, with every
  node outlined and none of them orange. The cable stays as a static graphic device.
- **390px:** the same device at 12px from the left edge. Nodes are 8px. No change in
  behaviour, because it doesn't pin, it just fills.

## Shared primitives: build these first, in this order

All live in `src/components/motion-ui/`. Each one gets a styleguide page at
`/styleguide/modern/<name>`.

| # | File | Export / API | What it does |
|---|---|---|---|
| P1 | `gsap-setup.ts` | `registerGsap()` (idempotent); `SCRUB = 0.3`; `MQ = { motionDesktop: "(min-width: 768px) and (prefers-reduced-motion: no-preference)", motionMobile: "(max-width: 767.98px) and (prefers-reduced-motion: no-preference)" }` | Registers `ScrollTrigger`, `SplitText`, `DrawSVGPlugin` and `useGSAP` once. Calls `ScrollTrigger.config({ ignoreMobileResize: true })`. |
| P2 | `use-scroll-scene.ts` | `useScrollScene(scope: RefObject<HTMLElement>, build: { desktop?: (ctx) => void; mobile?: (ctx) => void }, deps?)` | `useGSAP` plus `gsap.matchMedia()` keyed on `MQ`. Awaits `document.fonts.ready` before calling `build`, then `ScrollTrigger.refresh()`. Reverts automatically. **Every section uses this. No raw `ScrollTrigger.create` in section files.** |
| P3 | `scroll-scene-root.tsx` | `<ScrollSceneRoot>{children}</ScrollSceneRoot>` (client, page-level) | Calls `registerGsap()`. After `window` `load` and hero-image decode, runs `ScrollTrigger.sort()` and `ScrollTrigger.refresh()`. Mounted once in `page.tsx`, wrapping the sections. |
| P4 | `scrub-text.tsx` | `<ScrubText as="h2" split="lines" \| "words" \| "chars" effect="rise" \| "light" \| "spread" start="top 80%" end="top 30%" trigger?: RefObject timeline?: gsap.core.Timeline position?: number className>{string}</ScrubText>` | SplitText wrapper. **rise:** lines mask inside `overflow-hidden`, `yPercent 100 → 0`, stagger 0.08. **light:** words `opacity 0.16 → 1`, stagger. **spread:** chars `x` from ±(index offset × 0.06em) to 0, with opacity 0 to 1, which fakes tracking-in. If `timeline` is passed, it adds its tweens there instead of making its own trigger, so pinned scenes can sequence it. Renders the plain string in an `sr-only` node and marks the split copy `aria-hidden`. Static: the plain string. |
| P5 | `cable-segment.tsx` | `<CableSegment tone="dark" \| "light" first?: boolean last?: boolean pinTrigger?: RefObject>` | The through-line segment described above. |
| P6 | `husky-mark-paths.ts` | `MARK_VIEWBOX = "386 354 308 372"`, `MARK_HEAD_D`, `MARK_JAW_D`, `MARK_CHIN = { x: 540, y: 708 }`, `MARK_MUZZLE = { x: 540, y: 668 }` | The two vector paths from `public/brand/icon/husky-mark-orange.svg`, copied once as constants so the hero clip, the About outline and the Contact terminus all share one geometry. |
| P7 | `scrub-odometer.tsx` | `<ScrubOdometer value="20" suffix="+" className />` plus helper `addOdometer(tl, el, position, duration)` | Each digit is a 0–9 vertical strip inside a 1-line `overflow-hidden` cell, `tabular-nums`. SSR renders the final digit. `addOdometer` tweens each strip's `yPercent` from 0 to the target, scrubbed, never time-based. |
| P8 | `cursor-light.tsx` | `<CursorLight radius={320} strength={0.5} className>{children}</CursorLight>` | Writes `--mx`/`--my` on `pointermove`, without React state. It also writes `--cl-on: 1` on enter and `0` on leave. An overlay child uses `radial-gradient(var(--r) circle at var(--mx) var(--my), transparent, rgb(9 10 15 / var(--strength)))` so the darkness lifts under the pointer. Off on `(hover: none)`. |
| P9 | `roll-text.tsx` | `<RollText as="span">{label}</RollText>` | Hover text roll. The label is duplicated in a 1-line mask; on hover both copies move `yPercent -100`, staggered per char at 12ms over 300ms. Only the first copy is in the accessibility tree. CSS only, plus a `--i` custom property per char. |
| P10 | `spotlight-frame.tsx` | `<SpotlightFrame>{children}</SpotlightFrame>` | Border-follows-cursor frame. A 1px padding wrapper with `radial-gradient(200px at var(--mx) var(--my), var(--primary), var(--border))` around an inset child. 4px radius. Off on touch. |

Content constants live in **`src/components/sections/creative-1/content.ts`**:

- every string from `copy-home.md` used on this page, plus the two `/`-sourced blocks;
- the `WHATSAPP` href, `https://api.whatsapp.com/send?phone=19548648005`. It is currently
  duplicated per page; this file holds Creative 1's copy.

Sections import from there, so no string is retyped in a component.

Route: **`src/app/(site)/creative-1/page.tsx`**.

- A Server Component. It renders `<ScrollSceneRoot>` wrapping the eight sections in
  order.
- Metadata copies `/`'s title and description, plus `robots: { index: false }` because
  this is an alternative presentation.
- Section ids: `home`, `stats`, `services`, `approach`, `partners`, `showcase`,
  `about`, `contact`.

Each section file is a Server Component shell. Only the animated part is a `"use client"`
child in the same file or a sibling.

**Heading outline:**

- `h1`: the hero.
- `h2`: one per section. Stats gets an `sr-only` `h2` ("Husky at a glance") so the levels
  stay in order.
- `h3`: the three service families.
- `h4`: the eight service names.

---

## 1. Hero `#home`

**File:** `src/components/sections/creative-1/hero.tsx`

**Concept:** you look at a dusk house *through* the Husky mark. Scrolling flies you through
the mark until the house fills the screen.

**Copy:**

- Eyebrow: `LUXURY SMART HOME AUTOMATION`
- H1: `Smart homes,` / `engineered quietly.` (two authored lines)
- Lead: the "We design and install…" paragraph, with `.lead .hero-lead`
- CTAs: `Request a Consultation` goes to WhatsApp (primary button); `See What We Do` goes
  to `#services` (text link)
- Image: `public/photos/estate-dusk-01.jpg`, `priority`

**Layout at 1440:**

- 12-column grid, with `100svh` as the pinned frame.
- Columns 1–6, vertically centred:
  - eyebrow;
  - H1 in `.display-1`, left-aligned, with each line its own block;
  - lead at max 34ch;
  - CTA row, gap 24.
- Columns 7–12: the **mark window**. An SVG at 72vh tall, centred, with the `MARK_*`
  paths as a `<clipPath>` around an `<image>` of the dusk photo set to cover a 2:1 box
  behind it. A 1px `foreground/24` stroke traces the mark outline over the image.
- The cable's first segment drops from `MARK_CHIN` to the bottom of the viewport. Below
  `md` there's no anchor in the mark, so it starts at the section's top-left.

**Layout at 390:**

- Single column, top-aligned below the header.
- Eyebrow, then H1 (`.display-1` resolves to 44px), lead, and a full-width primary
  button. The text link sits under it.
- The mark window sits beneath at 80vw wide.
- First viewport: eyebrow, H1 and lead all visible. The mark peeks at the fold.

**Load (one-time, not scroll):**

- The outline stroke draws with DrawSVG, 0% to 100%, over 1.2s using the expo-out curve.
- The clipped photo goes from `opacity 0.0 → 1` over 0.6s, starting at 0.8s.
- The text is **not** animated on load. It's the LCP and must be readable immediately.

**Scroll choreography, desktop (`motionDesktop`):**

- Trigger: section, `start: "top top"`, `end: "+=150%"`.
- **Pin: yes, 150vh.**
- Scrub: `SCRUB`.
- Two copies of the photo exist:
  - **A:** inside the mark clip.
  - **B:** a full-bleed `next/image` layer behind everything, with
    `clip-path: inset(50% 50% 50% 50%)` (fully hidden). That initial state applies
    **only** inside the motion branch, so SSR shows no layer B at all.

| Progress | What moves | From → To |
|---|---|---|
| 0 → 0.30 | Lead and CTA row | `y 0 → -32`, `opacity 1 → 0` |
| 0 → 0.45 | H1 line 1 / line 2 (ScrubText `split="lines"`, driven by timeline) | line 1 `x 0 → -14vw`, line 2 `x 0 → +14vw`; both `opacity 1 → 0` from 0.25 |
| 0 → 0.60 | Mark window group | `scale 1 → 11`. `transformOrigin` = `MARK_MUZZLE` (the solid block of the muzzle, so the scaled shape covers the screen instead of turning into stripes). `x` recentres the group on the viewport centre. |
| 0 → 0.20 | Mark outline stroke | `opacity 1 → 0` |
| 0.35 → 0.70 | Photo layer B | `clip-path inset(50% 50% 50% 50%) → inset(0% 0% 0% 0%)`; image `scale 1.15 → 1` |
| 0.70 → 1.00 | Dim overlay over B (`bg-background`) | `opacity 0 → 0.55`, handing off to the light Stats band |
| 0 → 1 | CableSegment fill | `scaleY 0 → 1` |

At progress 1 the screen is the full-bleed dusk house, dimmed. On unpin, Stats scrolls up
over it.

**Scroll choreography, 390 (`motionMobile`):**

- **No pin.**
- Trigger: the mark window, `start: "top 80%"`, `end: "bottom top"`.
- The mark group goes `scale 1 → 2.2`.
- Layer B is constrained to the mark window's box. Its clip goes `inset(50%) → inset(0)`
  over the first 60%, so the mark opens into a photo band.
- Text is never scrubbed on mobile.

**Hover / cursor:**

- Pointer over the hero moves photo A inside the mark by ±12px, the opposite way to the
  cursor, through `gsap.quickTo` (0.6s). It reads as looking through a window. This is a
  transform on the `<image>` element.
- The primary button gets the standard state change: background step plus a 4px arrow
  shift. **No magnetic effect** (client order, 2026-09-01).

**Reduced motion:**

- Static two-column hero: the mark window holds the photo and the outline is drawn.
- No load animation, no pin. Layer B is not rendered.

**Section-local pieces:** `MarkWindow` (client, in the same file). Uses P2, P4, P5 and P6.

---

## 2. Stats `#stats`

**File:** `src/components/sections/creative-1/stats.tsx`

**Concept:** an instrument calibrating. One line draws across the band, and each figure
reads out as the line passes it.

**Copy (order per site-versions-plan):**

| Figure | Label |
|---|---|
| `South Florida` | `SERVICE AREA` |
| `20+` | `YEARS OF INTEGRATION` `[VERIFY]` |
| `8` | `SYSTEMS WE INSTALL` |
| `5` | `PARTNER PLATFORMS` |

Markup is a `<dl>`. The section has an `sr-only` `h2` reading `Husky at a glance`.

**Surface:** `--brand-light` band. Figures are `navy-900`, labels are brand-black, and the
cable switches to `tone="light"`.

**Layout at 1440:**

- Section height is `100svh` (the pinned frame). Content is vertically centred.
- A single full-width **measure line**: 1px `navy-900/24`, sitting at 50% height inside
  `.section-x`.
- Four equal columns sit above the line, each with its figure (`.display-1`) bottom-aligned
  to the line, 24px above it.
- Mono labels (`.eyebrow`) sit 16px below the line.
- Each column has a 1px × 16px tick on the line at its left edge.

**Layout at 390:**

- 2 × 2 grid, gap 48/24.
- Each cell has its own 1px rule under the figure.
- `South Florida` spans both columns in row 1, as two lines of `.display-2`. The numerals
  share row 2 and row 3 is `5` alone, left-aligned.
- Figures use `.display-2`.

**Scroll choreography, desktop:**

- Trigger: section, `start: "top top"`, `end: "+=100%"`.
- **Pin: yes, 100vh.**
- Scrub: `SCRUB`.

| Progress | What moves | From → To |
|---|---|---|
| 0 → 0.80 | Measure line (a `navy-900/48` fill over the 24% track) | `scaleX 0 → 1`, origin left |
| 0 → 0.80 | **Draw head**: a 2px × 16px orange tick riding the line's end | `x 0 → line width` |
| 0.00 → 0.20 | `South Florida` | `clip-path inset(0 100% 0 0) → inset(0 0 0 0)`, so the head "writes" it |
| 0.20 → 0.40 | `20+` | `addOdometer` rolls the digit strips 0 → 2 and 0 → 0 (the second strip does one full turn, 0→9→0, via a 10-tall strip). `+` fades in at the end. |
| 0.40 → 0.60 | `8` | Odometer 0 → 8 |
| 0.60 → 0.80 | `5` | Odometer 0 → 5 |
| per column, same windows | Label | ScrubText `effect="spread"` |
| per column, at its window start | Column tick | `scaleY 0 → 1` |
| 0.80 → 1.00 | Hold | Nothing moves, so the readout can be read |

**Scroll choreography, 390:**

- **No pin.**
- Each cell gets its own trigger, `start: "top 85%"`, `end: "top 45%"`:
  - its rule goes `scaleX 0 → 1`;
  - its figure rolls (odometer) or wipes (South Florida);
  - its label spreads.

**Hover:**

- Hovering a column re-runs that figure's odometer once as a 600ms timed tween (state
  feedback, not scroll).
- The column's tick turns orange for the duration of the hover.
- Desktop only.

**Reduced motion:** the final figures and a fully drawn line. No ticks animate.

Uses P2, P4, P5 and P7.

---

## 3. Services `#services`

**File:** `src/components/sections/creative-1/services.tsx` (plus `service-plate.tsx` in
the same folder)

**Concept:** walk through the house room by room. A horizontal track of three "rooms"
(the families) slides past while the cable runs along its top, from plate to plate.

**Copy:**

- Eyebrow `WHAT WE DO`
- H2 `Eight systems. One house that behaves.`
- The intro paragraph
- Three families as `h3`:
  - `Entertainment`
  - `Comfort & Control`
  - `Infrastructure & Security`
- Eight services as `h4` plus their paragraphs, verbatim
- CTA `Talk Through Your Project`, linking to WhatsApp

**Images (`public/showcase/*.svg`, `next/image` with `unoptimized`, because they're
SVG):**

| Service | Image |
|---|---|
| Home Cinema | `home-cinema` |
| Multi Room Audio | `multi-room-audio` |
| Outdoor Entertainment | `outdoor-entertainment` |
| Automation | `automation` |
| Smart Lighting | `smart-lighting` |
| Smart Blinds | `smart-blinds` |
| Wi-Fi & Networking | `wifi-networking` |
| Surveillance | `surveillance` |

Family covers: `entertainment`, `comfort-control`, `infrastructure`.

**Default DOM / CSS (no JS, reduced motion, below `md`): a vertical stack.**

- Intro block, then each family in turn:
  - a sticky family header (`position: sticky; top: 5rem`, `bg-background`) showing the
    mono index `01 / 03` and the `h3`;
  - then that family's plates, stacked.
- A plate is:
  - the image in a 4:3 frame, 4px radius, light panel art;
  - then mono `01 / 08`;
  - `h4` in `.display-3`;
  - body in `.body-text` at max 40ch.
- The CTA comes after the last family.

**Track mode (JS + `motionDesktop` only):**

- On mount the section sets `data-mode="track"`.
- CSS switches the inner wrapper to a single flex row, `height: 100svh`, items centred.
  It's below the fold, so the layout switch isn't visible.

**Layout at 1440 (track mode):**

- Panel 0 (**intro**, 36vw): eyebrow, H2 at `.display-2`, intro at `.lead`, max 32ch.
- For each family:
  - a **family cover panel** (24vw): the family cover image at 4:5, cropped through a
    4px frame. Over it, the mono index `01 / 03` and the `h3` at `.display-2`, set on a
    `bg-background` label block anchored to the lower-left of the frame, so text never
    sits on the art;
  - then one **plate** per service (30vw each): image 4:3 at full plate width, then text
    below at 24px.
- Final panel (**CTA**, 28vw): mono `08 / 08 · END OF RUN`, and the primary CTA button.
- Gutters between panels: 4vw.
- A **horizontal cable** runs 32px above the image tops: a 1px `foreground/12` track,
  with a `foreground/48` fill and an orange head.
- An 8px node sits above each plate.
- A fixed-in-pin mono **readout** sits bottom-left of the pinned frame:
  `03 / 08 · SMART LIGHTING`.

**Scroll choreography, desktop (track mode):**

- `distance = track.scrollWidth - innerWidth`.
- Trigger: section, `start: "top top"`, `end: () => "+=" + distance * 0.75`.
- **Pin: yes, about 230vh at 1440 × 900.** The track is roughly 300vw, so distance is
  about 200vw.
- `invalidateOnRefresh: true`.
- Main tween: track `x 0 → -distance`, `ease: "none"`, scrub `SCRUB`. This is the
  `containerAnimation` for everything else below.

| Driven by | What moves | From → To |
|---|---|---|
| main tween progress 0 → 1 | Horizontal cable fill | `scaleX 0 → 1`; head `x` follows |
| each plate, `containerAnimation`, `start: "left 95%"`, `end: "left 55%"` | Plate image | `clip-path inset(0 0 100% 0) → inset(0 0 0% 0)`; image inner `scale 1.12 → 1` |
| same window, offset +0.1 | Plate text block | `y 24 → 0`, `opacity 0.0 → 1` |
| each family cover, `start: "left 100%"`, `end: "left 40%"` | `h3` (ScrubText `split="chars"`, `effect="spread"`) | chars come in from spread |
| each family cover, same window | Cover image | `x -6vw → 0` inside its frame (parallax inside the mask) |
| each node, `start: "left 60%"` | Node | `onToggle` sets the orange fill (state) |
| main progress | Readout | `onUpdate` sets the text to the plate whose left edge is nearest 50vw (text swap, scroll-linked) |
| pin progress | Vertical CableSegment | `scaleY 0 → 1` |

**Keyboard:** add a `focusin` listener on the track. When a link or heading inside it gets
focus, compute that element's track offset and call `window.scrollTo` to the matching
pinned scroll position, so focused content is never offscreen.

**Scroll choreography, 390:**

- **No pin, no track.** The vertical stack is used.
- Each plate image: trigger the plate, `start: "top 90%"`, `end: "top 50%"`.
  - `clip-path inset(0 0 100% 0) → inset(0)`
  - image `scale 1.12 → 1`
- Family `h3`: `spread` scrub as its sticky header enters.
- The vertical cable fills as normal.

**Hover / cursor (desktop):**

- Each plate image sits in a `SpotlightFrame` (P10): the 1px border lights orange around
  the cursor.
- The `h4` uses `RollText` (P9) when the plate is hovered.
- The plate image goes `scale 1 → 1.03` over 300ms, inside its clip.

**Reduced motion:**

- The vertical stack at every width. At `md` and up, each family's plates sit in a
  2-column grid under the sticky family header.
- Everything visible, no clips.

> This is the page's single card-grid-like moment. Neighbours are a light metric band and
> a pinned drawing, never another grid.

Uses P2, P4, P5, P9 and P10.

---

## 4. Approach `#approach`

**File:** `src/components/sections/creative-1/approach.tsx` (plus `approach-plan.tsx`
for the inline SVG)

**Concept:** before the walls close. A building section draws itself, the wiring goes in
orange, and then the drywall closes over it. Only the device points stay visible.

**Copy:**

- Eyebrow `OUR APPROACH`
- H2 `The best time to plan a smart home is before the walls close.`
- The two body paragraphs, verbatim
- CTA `Read How We Plan a Build`, linking to `/new-construction`

**The drawing (`ApproachPlan`, inline SVG):**

- `viewBox 0 0 800 600`.
- An abstract two-storey building section. This is illustration, not a claim.
- Contents:
  - ground line;
  - slab;
  - two floors;
  - four wall studs per floor as paired verticals;
  - pitched roof;
  - one stair as a stepped polyline.
- About 14 paths, all `stroke="currentColor"` (`foreground/56`), 1px, `vector-effect:
  non-scaling-stroke`, no fills.
- **Wiring:** one orange path routed from a panel at the ground floor, up through the
  studs, to six **device nodes** (8 × 8 squares, `--primary`). Placement: two in the
  ceilings, one at a stair, one outside under the eave, two at the wall midpoints.
- **Walls layer:** for each floor, one rect between the outer studs, `fill: var(--card)`,
  sitting above the wiring and below the nodes. A second, inner 1px `foreground/24` stroke
  stands for the finished face.
- Must be hand-authorable in one pass. Keep it rectilinear.

**Layout at 1440:**

- `100svh` pinned frame.
- Columns 1–5: eyebrow, H2 at `.display-2`, the two paragraphs at `.body-text` max 44ch
  (gap 16, with 48 to the CTA), then the CTA as a secondary button.
- Columns 6–12: the drawing, at 100% column width and max 72vh tall, vertically centred.
- Mono annotations sit at the drawing's corners. They are labels of the drawing's state,
  not claims:
  - `SECTION A–A` (fixed);
  - a status label that swaps with scroll: `PLAN`, then `ROUGH-IN`, then `CLOSED`.

**Layout at 390:**

- The text block first, then the drawing at full width (4:3).
- The annotations shrink to a single status label above the drawing.

**Scroll choreography, desktop:**

- Trigger: section, `start: "top top"`, `end: "+=160%"`.
- **Pin: yes, 160vh.**
- Scrub: `SCRUB`.

| Progress | What moves | From → To |
|---|---|---|
| 0.00 → 0.40 | Structure paths | DrawSVG `0% → 100%`, stagger 0.02 in source order (ground, then slab, floors, studs, roof) |
| 0.05 → 0.45 | H2 (ScrubText `split="lines"`, `effect="rise"`, on the timeline) | lines `yPercent 100 → 0` |
| 0.40 → 0.65 | Wiring path | DrawSVG `0% → 100%`, `stroke: var(--primary)` |
| 0.45 → 0.68 | Device nodes, in path order | `scale 0 → 1`, origin centre, stagger 0.03 |
| 0.68 → 0.90 | Wall rects | `clip-path inset(100% 0 0 0) → inset(0 0 0 0)`. Drywall rises bottom to top and covers the wiring. Nodes stay above. |
| 0.70 → 0.90 | Wiring path | `opacity 1 → 0` (only what's outside the walls still shows; belt and braces) |
| 0.40 / 0.68 | Status label | text swaps from `PLAN` to `ROUGH-IN` to `CLOSED` (`onUpdate`, threshold-based) |
| 0.90 → 1.00 | Hold | — |
| 0 → 1 | CableSegment | fill |

Body and CTA are **never** hidden or scrubbed. They are readable at progress 0.

**Scroll choreography, 390:**

- **No pin.**
- Same timeline (minus the label swap timing), with its trigger on the **drawing**:
  `start: "top 75%"`, `end: "bottom 25%"`.
- H2 rise has its own trigger: `start: "top 85%"`, `end: "top 40%"`.

**Hover:** pointer over a device node (desktop) scales it `1 → 1.5` (state, 200ms) and
shows a 1px leader line to the nearest wall face. Purely visual, no tooltip text, because
we don't invent device names.

**Reduced motion:**

- The drawing in its **rough-in** state: structure plus orange wiring plus nodes, with
  the walls not drawn. That's the instructive frame.
- The status label reads `ROUGH-IN`.

Uses P2, P4 and P5.

---

## 5. Partners `#partners`

**File:** `src/components/sections/creative-1/partners.tsx`

**Concept:** a quiet section. The five platform names pass on one line at display scale,
moved only by the scroll, the way a nameplate rail slides under a hand.

**Copy:**

- Eyebrow `PLATFORMS WE BUILD ON`
- H2 `We install what we can stand behind.`
- Body (keep `[VERIFY]`)
- Names in a `<ul>`: Cisco · Araknis · Ubiquiti · CommScope · Sonos

**Layout at 1440:**

- Normal flow, `.section-y`, not pinned.
- Top: eyebrow and H2 (`.display-2`) in columns 1–6, body in columns 8–12 at
  `.body-text`.
- Below, 96px down, the **name rail**: a single non-wrapping row of the five names in
  Outfit at `.display-1`, gap 8vw, mono `·` separators.
- Each name is two layers:
  - **Outline:** `-webkit-text-stroke: 1px var(--foreground)`, transparent fill,
    `foreground/32`.
  - **Solid:** an overlay copy, `aria-hidden`.
- The section is `overflow-x: clip`.

**Layout at 390:** the same structure stacked. The rail uses `.display-2`, gap 12vw.

**Scroll choreography (desktop and 390, same code):**

- Trigger: the rail, `start: "top bottom"`, `end: "bottom top"`.
- **No pin.**

| Progress | What moves | From → To |
|---|---|---|
| 0 → 1 | Rail | `x 12vw → -(rail width - 88vw)`. The full list crosses in one pass: Cisco enters as the rail does, and Sonos settles at the right as it leaves. |
| per name, `onUpdate` | Solid copy | `clip-path inset(0 X% 0 0)`, where X maps from the name's distance to viewport centre (100% at ≥ 40vw away, 0% at the centre). The name **fills in as it crosses the centre** and empties as it leaves. This is set with `gsap.quickSetter`, not React. |

**Hover:** `RollText` on each name (desktop). The solid copy fills fully while hovered
(state, 250ms).

**Reduced motion:**

- The rail becomes a wrapping flex row at `.display-2`.
- All names solid `foreground`, no outlines.

Uses P2, P5 and P9.

---

## 6. Showcase `#showcase`

**File:** `src/components/sections/creative-1/showcase.tsx`

**Concept:** "Technology you stop noticing." The house first appears annotated with its
systems, like a drawing. Then the annotations fade away and the lights come up, until only
the house is left.

**Copy:**

- Eyebrow `The result`
- H2 `Technology you stop noticing.`
- Caption (`.meta`) `Boca Raton · Lighting, audio and surveillance`
- Image `public/photos/estate-dusk-02.jpg`, with the alt above
- The annotation labels are exactly the three words of the caption: `LIGHTING`,
  `AUDIO`, `SURVEILLANCE`. No new claims.

**Layout at 1440:**

- `100svh` pinned frame.
- The photo is full-bleed (`object-cover`). The 21:9 source crops its sides at 16:10.
- **Annotation layer:** an SVG over the photo (`preserveAspectRatio` matching the image's
  cover crop) containing:
  - three 1px `foreground/72` leader lines (an elbowed polyline per label);
  - an 8px square node at each line's photo end;
  - `.text-system` labels at the free ends, on a `bg-background` chip, 4px radius, so
    the labels stay legible on any part of the photo.

  The builder places the node ends on a lit window, a landscape-light pool and an eave
  line in the actual photo.
- **Dim overlay:** `bg-background` at the opacities in the table.
- **Text block:** bottom-left, over a scrim at the foot only (`bg-background/72` →
  transparent, height 40%). Eyebrow, then H2 at `.display-1`, then the caption, 24px
  below.

**Layout at 390:**

- The photo is in a 4:5 frame (`object-position: 60% center`), not full-bleed height.
- The annotations become three numbered nodes (`1 2 3`) on the photo, with a legend list
  underneath: `1 LIGHTING · 2 AUDIO · 3 SURVEILLANCE`.
- The text block sits **below** the photo on the background (no overlay), H2 at
  `.display-1` (44px).

**Scroll choreography, desktop:**

- Trigger: section, `start: "top top"`, `end: "+=140%"`.
- **Pin: yes, 140vh.**
- Scrub: `SCRUB`.

| Progress | What moves | From → To |
|---|---|---|
| 0.00 → 0.15 | Photo frame | `clip-path inset(10% 8% 10% 8%) → inset(0)`; image `scale 1.08 → 1` |
| 0.00 → 0.15 | Dim overlay | `opacity 0.55` (held) |
| 0.10 → 0.40 | Leader lines | DrawSVG `0% → 100%`, stagger 0.06; nodes `scale 0 → 1`; label chips `clip-path inset(0 100% 0 0) → inset(0)` |
| 0.40 → 0.55 | Hold | annotated state |
| 0.55 → 0.80 | Leader lines | DrawSVG `100% → 0%` (undraw from the label end back to the node); chips wipe out; nodes `scale 1 → 0` |
| 0.55 → 0.85 | Dim overlay | `opacity 0.55 → 0.10` ("lights on") |
| 0.70 → 1.00 | H2 (ScrubText `rise`, on the timeline), then the caption | lines `yPercent 100 → 0`; caption `opacity 0 → 1` at 0.9 |
| 0 → 1 | CableSegment | fill |

The H2 is hidden at progress 0 only inside the motion branch, and this section is far
below the fold, so the hydration rule holds.

**Scroll choreography, 390:**

- **No pin.**
- Trigger: the photo frame, `start: "top 85%"`, `end: "bottom 20%"`.
- Within that window: the frame clip opens over 0–0.2, the numbered nodes appear over
  0.2–0.5, and the overlay goes `0.55 → 0.10` over 0.5–0.9. The nodes **stay**, because
  the legend refers to them.
- H2 rise has its own trigger below.

**Hover / cursor (desktop):** the photo is wrapped in `CursorLight` (P8, radius 320px,
strength 0.5).

- While the annotated state is showing (progress < 0.55), the dark overlay lifts in a
  circle under the pointer. You "torch" the house.
- After "lights on", the effect fades out (`--cl-on` tweened by the timeline), because
  the house is already lit.

**Reduced motion:** the photo framed at full width, overlay at 0.10, no annotations, and
the H2 and caption below the photo.

Uses P2, P4, P5 and P8.

---

## 7. About `#about`

**File:** `src/components/sections/creative-1/about.tsx`

**Concept:** a reading room. The paragraphs light up word by word at your reading pace,
while the Husky mark draws itself in a single 1px line beside them. It's the quietest
section on the page, and it sets up the finale.

**Copy:**

- Eyebrow `WHO WE ARE`
- H2 `A luxury technology integrator, based in Boca Raton.`
- The three paragraphs, verbatim, with `[VERIFY]` retained

**Layout at 1440:**

- Normal flow, `.section-y-lg`.
- Columns 1–5 are a **sticky** column (CSS `position: sticky; top: 20vh`, no GSAP pin)
  holding:
  - eyebrow;
  - H2 at `.display-2`;
  - under it, the **mark outline**: an SVG of the `MARK_*` paths, stroke only, 1px
    `foreground/40`, at 40vh tall, left-aligned.
- Columns 7–12 hold the three paragraphs at `.lead` (20/32), max 40ch, gap 48.

**Layout at 390:**

- Eyebrow, then H2 (not sticky), then the paragraphs at `.lead` (16/28).
- The mark outline moves to the end of the section, at 56vw, right-aligned.

**Scroll choreography (desktop):**

- **No pin.** Uses sticky.
- Trigger: the paragraphs column, `start: "top 75%"`, `end: "bottom 55%"`, scrub
  `SCRUB`.

| Progress | What moves | From → To |
|---|---|---|
| 0 → 1 | All three paragraphs (ScrubText `split="words"`, `effect="light"`, one shared timeline) | words `opacity 0.16 → 1`, in reading order |
| 0 → 1 | Mark outline (both paths) | DrawSVG `0% → 100%` |
| 0.9 → 1 | Mark outline stroke | `foreground/40 → foreground/72` (opacity on a duplicate stroke layer) |
| 0 → 1 | CableSegment | fill |

**Scroll choreography (390):**

- Same, with no sticky column.
- Paragraph light: `start: "top 85%"`, `end: "bottom 60%"`.
- Mark draw: its own trigger, `start: "top 90%"`, `end: "bottom 60%"`.

**Hover:** none. This section is for reading. Its quietness is the contrast that the
finale needs.

**Reduced motion:** full-opacity text, the mark outline fully drawn at `foreground/40`,
and the sticky column kept (sticky is not motion).

Uses P2, P4, P5 and P6.

---

## 8. Contact `#contact`

**File:** `src/components/sections/creative-1/contact.tsx`

**Concept:** power on. The orange band rises from the bottom like a breaker thrown. The
cable makes its last turn and draws the Husky mark in brand-black, which then fills. This
is the end of the run.

**Copy:**

- Eyebrow `GET IN TOUCH`
- H2 `Tell us what you're building.`
- The sub paragraph
- Channel table, as a `<dl>`, mono labels:

| Label | Value |
|---|---|
| WhatsApp | +1 954 864 8005 |
| Phone | +1 954 864 8005 (`tel:`) |
| Email | info@huskyautomation.com (`mailto:`) |
| Studio | 4301 Oak Cir #26, Boca Raton, FL 33431 |
| Instagram | @huskyautomation |
| Facebook | huskyautomation |

- Primary CTA `Message Us on WhatsApp`.
- **No form.** It is an open client question in `copy-home.md`; don't pre-empt it.

**Surface:**

- Full-width **orange band**.
- **All text is `--brand-black`.** That includes the button, which is a 1px brand-black
  border with brand-black text. Hover is `bg-brand-black/10` plus a 4px arrow shift, and
  the text colour never changes.
- The cable's last segment and the terminal mark are brand-black on this band.

**Layout at 1440:**

- `.section-y-lg`.
- Columns 1–7: eyebrow, H2 at `.display-1`, sub at `.lead` max 44ch, then the CTA, 48px
  below.
- Columns 8–12: the channel `<dl>`. Each row has a mono label at 12/16 over its value at
  `.body-text`, rows separated by 32px of space (no rules).
- **Terminal mark:** bottom-right, bleeding off the band's right edge. `MARK_*` paths at
  about 60vh tall, `aria-hidden`.

**Layout at 390:**

- Stacked: eyebrow, H2 (44px), sub, then the full-width CTA (min 48px tall), then the
  channel list.
- The terminal mark sits below the list at 64vw, right-aligned, cropped by the band's
  bottom edge.

**Scroll choreography (desktop):**

- **No pin.**
- Two triggers, both scrub `SCRUB`.

| Trigger | Progress | What moves | From → To |
|---|---|---|---|
| section, `start: "top bottom"`, `end: "top 35%"` | 0 → 1 | Band | `clip-path inset(100% 0 0 0) → inset(0 0 0 0)`. The orange rises from the bottom edge. Before it, the section reads as `#090A0F`: the band sits on a `bg-background` wrapper, so the uncovered part is the page backdrop. |
| same | 0.4 → 1 | H2 (ScrubText `split="chars"`, `effect="spread"`) | chars track in |
| section, `start: "top 35%"`, `end: "bottom bottom"` | 0 → 0.35 | Last CableSegment, which turns right at the H2 baseline | vertical fill, then a DrawSVG horizontal run to the mark's chin |
| same | 0.30 → 0.75 | Terminal mark, both paths as outline (1px brand-black stroke) | DrawSVG `0% → 100%` |
| same | 0.70 → 0.95 | Terminal mark fill (brand-black) | `fill-opacity 0 → 1` (opacity on a filled duplicate layer) |

The channel list and CTA are **never** scrubbed. They're readable as soon as the band
covers them, and in reduced motion they are always readable.

**Scroll choreography, 390:** the same two triggers with `end` values `"top 50%"` and
`"bottom bottom"`. The chars spread is replaced with `rise` by lines, because spread at
44px across a narrow measure jitters.

**Hover:**

- Each channel row: a 2px brand-black underline wipes in under the value
  (`scaleX 0 → 1`, origin left, 250ms), with a 4px arrow shift.
- Email and phone rows also show a mono `COPY` affordance, which copies on click and
  swaps the label to `COPIED` for 1.6s. That's a state change, not decoration.

**Reduced motion:** a solid orange band, the mark filled, the cable's last segment drawn.

Uses P2, P4, P5 and P6.

---

## Creative 1: build order and checklist

1. P1–P3, then P6, then P4, then P5. Each one gets its styleguide page as it lands.
2. `content.ts`, then `page.tsx` with all eight sections as static shells (the reduced
   motion layouts). Verify the page reads fully with JS off.
3. Sections in page order: Hero, Stats, Services, Approach, Partners, Showcase, About,
   Contact. P7 is built with Stats, P9 and P10 with Services, P8 with Showcase.
4. After each pinned section, scroll the full page at 1440 and 390 to check the pin
   spacers. Later triggers must start where they should.
5. Verify:
   - `npx tsc --noEmit && npm run lint && npm run build`
   - screenshots at 1440 and 390
   - one `h1`
   - no horizontal overflow at 390
   - every scene checked with `prefers-reduced-motion: reduce` emulated
   - contrast of brand-black on orange, navy on light, and `foreground` text over the
     photo scrim, all at ≥ 4.5:1
6. **Pinned scroll budget at 1440 × 900:**

   | Section | Pin |
   |---|---|
   | Hero | 150vh |
   | Stats | 100vh |
   | Services | ≈ 230vh |
   | Approach | 160vh |
   | Showcase | 140vh |

   That's about 780vh of pinned scroll. It must not grow; if it feels long in review,
   shorten Services first (factor 0.75 → 0.6).

**Files:**

```
src/app/(site)/creative-1/page.tsx
src/components/sections/creative-1/content.ts
src/components/sections/creative-1/hero.tsx
src/components/sections/creative-1/stats.tsx
src/components/sections/creative-1/services.tsx
src/components/sections/creative-1/service-plate.tsx
src/components/sections/creative-1/approach.tsx
src/components/sections/creative-1/approach-plan.tsx
src/components/sections/creative-1/partners.tsx
src/components/sections/creative-1/showcase.tsx
src/components/sections/creative-1/about.tsx
src/components/sections/creative-1/contact.tsx

src/components/motion-ui/gsap-setup.ts          (P1)
src/components/motion-ui/use-scroll-scene.ts    (P2)
src/components/motion-ui/scroll-scene-root.tsx  (P3)
src/components/motion-ui/scrub-text.tsx         (P4)
src/components/motion-ui/cable-segment.tsx      (P5)
src/components/motion-ui/husky-mark-paths.ts    (P6)
src/components/motion-ui/scrub-odometer.tsx     (P7)
src/components/motion-ui/cursor-light.tsx       (P8)
src/components/motion-ui/roll-text.tsx          (P9)
src/components/motion-ui/spotlight-frame.tsx    (P10)

src/app/styleguide/modern/<name>/page.tsx  for P4, P5, P7, P8, P9, P10
                                           (P1–P3 and P6 documented on one
                                           "Scroll scenes" page)
src/app/styleguide/navigation.ts           entries for the above
```

P1–P4 and P6 are written generically so that Creative 2 and 3 reuse them. Their APIs are
not Creative-1-specific.

---

# Creative 2: Afterdark

**Concept.** The page is a film of one evening at a Husky house, and the camera never
cuts away from its subject: a **3D extruded Husky mark**. This is the only version that
uses Three.js, and the justification is that the mark is the hero object, not a
background. It's built from `MARK_*` paths via `SVGLoader` + `ExtrudeGeometry`, in a matte
near-black material with a single orange rim light. It lives in one fixed `<canvas>`
behind the content, and scroll scrubs the camera through eight keyframes, one per
section:

- **Hero:** a slow push-in on the mark's face.
- **Stats:** the camera orbits to a profile view.
- **Services:** the mark recedes to a small object and the camera tracks past it.
- **Approach:** a top-down plan view, where the mark reads as a floor-plan footprint.
- **Showcase:** the camera pulls back and the mark dissolves into the photo's lights.
- **Contact:** the camera ends face-on, with the rim light fully on.

Composition is cinematic, not gridded:

- full-bleed scenes in 2.39:1 letterbox frames;
- copy set like subtitles and title cards, Outfit centred low in the frame, mono
  timecodes as section eyebrows (`00:01`…`00:08`);
- the photography (`estate-dusk-01/02`, `map-in-hand`, `approach-portrait`) used as
  plates.

Everything is depth and exposure. Nothing is drawn and nothing is switched.

**Signature devices:**

1. **Scrubbed 3D camera rail.** A GSAP timeline of camera position/target keyframes on
   one ScrollTrigger spanning the page. Pointer yaw/pitch is ±8° on the mark. Rendering
   runs only at `md`+ with motion allowed and `devicePixelRatio` capped at 1.5.
   Elsewhere, a pre-rendered still of the mark replaces the canvas.
2. **Letterbox cuts.** Two `--brand-black` bars `scaleY` in and out between scenes
   (`clip-path` on the scene), like an aspect-ratio change. Scenes pin for 100–120vh each.
3. **Exposure scrub.** Each photo plate goes from a silhouette (dark overlay at 0.85) to
   lit (0.1) as its scene progresses. On Showcase, the mark's rim light and the photo's
   lights come up together.
4. **Services as a credits roll.** The eight service names scroll vertically through a
   centred, sticky title-card slot at `.display-1`. The current name is at full opacity
   and its neighbours at 0.2. The matching showcase SVG crossfades in a fixed letterboxed
   frame. Vertical, not horizontal, so it can't be confused with Creative 1's track.
5. **Cursor:** the rim light's direction follows the pointer, and hovered CTAs
   "catch the light" with a 1px orange edge.

Mobile: no canvas, a static mark still, no pins. Each scene is a plate followed by its
text, with the exposure scrub retained as a non-pinned scroll range.

---

# Creative 3: Switchboard

**Concept.** The house as a control surface you operate by scrolling. There are no
photographs, no 3D and no illustrations: **type, colour bands and switches are the whole
visual system.**

- The hero H1 is set at a viewport-filling scale, each line fitted to 100% width. It's
  the page's image.
- As you scroll it scales down and tracks in to its resting `.display-1` position: a
  scrubbed FLIP between two measured layouts.
- From there the page is a stack of full-width bands that **switch** surface
  (`#090A0F` / `--brand-light` / orange) as each section takes over.
- The transition between bands is a scrubbed **venetian-blind wipe**: 12 horizontal slats
  flip on `rotateX`/`scaleY`, a direct nod to Smart Blinds.
- The mono label system is pushed to the foreground as instrumentation: channel numbers,
  levels and on/off states.

The motion language is mechanical, with stepped, snapped scrubs
(`snap: { snapTo: 1/8, duration: 0.2 }` where a section has discrete states). It's the
opposite of Creative 1's continuous drawing and Creative 2's continuous camera.

**Signature devices:**

1. **Fitted kinetic H1.** Per-line `scale` and per-char `x` scrub from fitted-width to
   resting size over a 120vh pin. Outfit's variable weight responds to pointer proximity
   on hover (the existing `VariableProximity` approach, transform-free because it changes
   weight only).
2. **Blind-wipe band switches** between every surface change.
3. **Services as a switchboard.** Eight full-width rows, each with a large square toggle
   (4px radius, 48px tall). As the row crosses the centre line, the toggle flips on
   (orange thumb, state) and the row's description opens. The open is a scrubbed
   `clip-path` reveal, so it is tied to scroll, not to a click; click also toggles it.
   Rows are grouped under the three family headers as channel banks.
4. **Stats as fitted numerals.** `20+`, `8` and `5` each fill a band's width and are
   revealed through a scrubbed horizontal mask. `South Florida` runs as a scroll-velocity
   ticker. The partner names reuse that ticker on an orange band in brand-black.
5. **The shattered mark** is the through-line. The Husky mark is split into about 6
   polygon shards, cut from `MARK_*` with MorphSVG-friendly sub-paths. The shards are
   scattered across the hero corners and travel with the scroll, one shard docking per
   section. At Contact all six snap together into the whole mark.
6. **Cursor:** a mono coordinate readout (`X 0412 · Y 0233`) trails the pointer inside
   the hero only, and the toggles respond to hover with a 2px thumb nudge.

Mobile: the H1 starts at fitted width and isn't pinned (a scale scrub over the hero's own
exit range). Blind wipes drop to 6 slats. Switchboard rows flip as they cross 50% of the
viewport. Shards dock without travelling.
