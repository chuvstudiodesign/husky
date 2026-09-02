# Modern UI Motion & Surface Patterns — Research Notes

Research date: 2026-08-30. Sources studied: reactbits.dev (source read from `DavidHDev/react-bits`),
uiverse.io, motion.dev docs, gsap.com/scroll, originkit.dev, skiper-ui.com, cult-ui.com
(`nolly-studio/cult-ui` registry), ui.unlumen.com.

**Filter applied throughout:** Husky is a dark, restrained, luxury smart-home brand.
`#090A0F` background, `#11131C` surface, one accent `#EC663D`, **4px max radius**, flat
surfaces separated by 1px borders at ~8% white, Outfit + Geist. Every recommendation below is
graded **STEAL** / **ADAPT** / **SKIP** against that.

Fetch notes: uiverse.io, originkit.dev/docs and cult-ui.com/docs blocked automated fetches
(403/429); their component inventories were recovered from their public registries/search
indexes instead. Findings for those three are inventory-level, not code-level.

---

## 0. What each library actually is

| Library | What it is | Delivery | Signature |
|---|---|---|---|
| **React Bits** | ~180 copy-paste React components in 4 buckets: TextAnimations, Animations, Components, Backgrounds | copy file, or `jsrepo`/shadcn CLI | Text animations + WebGL backgrounds. Mixed engine: some GSAP, some Motion, some pure CSS |
| **Uiverse** | 7k+ community CSS/Tailwind snippets (buttons, loaders, checkboxes, cards) | copy HTML+CSS | Pure CSS, no JS. Aesthetic is mostly neon/glass/neumorphic — *wrong* for us, but the CSS techniques are reusable |
| **Motion** | The animation library (framer-motion renamed). npm `motion`, v13.1.1 | npm | `motion.*` components, `useScroll`, `useTransform`, `useInView`, `whileInView`, layout animations |
| **GSAP + ScrollTrigger** | Imperative timeline engine + the best scroll plugin in existence. Now 100% free incl. all "Club" plugins (SplitText, ScrollSmoother, MorphSVG) | npm `gsap` 3.15.0, `@gsap/react` 2.1.2 | `pin`, `scrub`, `snap`, `toggleActions`, `matchMedia` |
| **OriginKit** | ~250 free animated components, React + Framer, exposed via MCP. Categories: text effects, galleries, carousels, backgrounds, interactive elements | MCP / copy | "fetch the source in your stack" model |
| **Skiper UI** | ~106 "un-common" components for shadcn. Tailwind + Next + Motion, one file each. Mostly **paid** ($129) | shadcn CLI | Image reveal, image cursor trail, drag-and-scroll, dynamic island, Vercel-style tooltip |
| **Cult UI** | shadcn-compatible registry, heavy on texture and physical materials | shadcn CLI | `texture-card`, `texture-button`, `bg-image-texture`, `minimal-card`, `dither-image`, `shift-card`, `family-drawer`, `direction-aware-tabs`, `animated-number`, `text-animate` |
| **Unlumen** | Small "beautifully designed React components" set, primitives + blocks, dark-mode first. Thin — nothing unique found | — | — |

---

## 1. Text animation patterns

React Bits' TextAnimations folder is the canonical inventory:
`SplitText, BlurText, ScrambledText, DecryptedText, Shuffle, ShinyText, GradientText,
CountUp, Counter, RotatingText, TextType, TextLoop, ScrollReveal, ScrollFloat, ScrollVelocity,
CurvedLoop, GlitchText, FuzzyText, StrokeText, VariableProximity, TextPressure, MaskedHeading,
TrueFocus, SplitFlapText, FallingText, ASCIIText, ParticleText, DepthText, EchoText, WarpText`.

The recurring, genuinely useful ones:

### 1a. Split-text reveal (per-char / per-word stagger) — **STEAL**
Text is split into `<span>` per character, word or line; each span animates
`opacity 0→1, y 40→0` on a stagger, triggered when the block enters view.

React Bits does it with GSAP:
```js
gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);
const split = new SplitText(el, { type: 'chars' });  // SplitText is now free
gsap.fromTo(split.chars,
  { opacity: 0, y: 40 },
  { opacity: 1, y: 0, duration: 1.25, ease: 'power3.out', stagger: 0.05,
    scrollTrigger: { trigger: el, start: 'top 90%', once: true } });
```
Motion equivalent (no plugin, no GSAP): map over words, one `motion.span` each, parent
`whileInView` with `staggerChildren`.

Critical detail from their source: they **wait for `document.fonts.ready`** before splitting.
With Outfit/Geist loaded via `next/font`, split before the font swaps and every character
is measured at the fallback metrics. Non-negotiable.

Accessibility: keep the un-split string in the DOM for screen readers (an `sr-only` copy
inside the semantic element, `aria-hidden` on the split spans; `aria-label` on a generic
span is prohibited by ARIA 1.2 and unevenly exposed).

### 1b. Line-mask reveal — **STEAL (this is the luxury one)**
Instead of per-character, split by **line**, wrap each line in `overflow: hidden`, and slide the
line up from `y: 100%`. Reads editorially rather than techy. This is what expensive agency sites
actually use for headlines, and it's what Cult's `gradient-heading` / Skiper's "image reveal"
are variations of. Radius-agnostic, color-agnostic — fits Husky perfectly.
```jsx
<span className="block overflow-hidden">
  <motion.span className="block"
    initial={{ y: '110%' }} whileInView={{ y: 0 }} viewport={{ once: true }}
    transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: i * 0.08 }}>
    {line}
  </motion.span>
</span>
```

### 1c. Blur-in — **STEAL, sparingly**
`filter: blur(10px) → blur(0)` alongside `opacity` and a small `y`. React Bits' `BlurText`
runs it per word with an IntersectionObserver + Motion keyframes (three steps:
`blur(10px)/op 0 → blur(5px)/op .5 → blur(0)/op 1`).
Beware: animating `filter` is expensive; cap it to one hero headline, never a whole page, and
never on a long paragraph.

### 1d. Scramble / decrypt — **SKIP for headlines, ADAPT for one accent**
`DecryptedText` / `ScrambledText`: characters cycle through random glyphs then settle. Reads
"hacker / crypto", not "luxury home". The one place it *could* work: a single monospace stat
or a serial-number-style detail. Not for the hero.

### 1e. Gradient sweep / shimmer (`ShinyText`, `GradientText`) — **SKIP**
A moving highlight across the text via `background-clip: text` + animated
`background-position`. React Bits drives it with `useAnimationFrame` + `useMotionValue`, but a
CSS keyframe is identical and free. It reads SaaS-gradient. If we want any of it: a **single
very slow, very low-contrast white sweep** across the wordmark on load — no rainbow, no orange
gradient.

### 1f. Counting numbers — **STEAL**
For "X installations / Y years / Z rooms". React Bits' `CountUp` is the correct implementation
and worth copying verbatim in shape:
```js
const mv = useMotionValue(0);
const spring = useSpring(mv, { damping: 20 + 40 / duration, stiffness: 100 / duration });
const inView = useInView(ref, { once: true });
useEffect(() => { if (inView) mv.set(to) }, [inView]);
spring.on('change', v => ref.current.textContent = Intl.NumberFormat('en-US').format(v));
```
Note it writes to `textContent` directly, not through React state — no re-render per frame.
Use `font-variant-numeric: tabular-nums` so the layout doesn't jitter.

### 1g. Rotating / typewriter word swap (`RotatingText`, `TextType`, `TextLoop`) — **ADAPT**
"Smart homes that _[listen / adapt / disappear]_". Typewriter = cheap. **Word swap with a
mask** = fine: fixed-width container, `AnimatePresence mode="popLayout"`, old word exits up
under `overflow:hidden`, new word enters from below. Slow it down (1.8–2.4s per word).

### 1h. Marquee / scroll velocity (`ScrollVelocity`, `CurvedLoop`, `LogoLoop`) — **ADAPT**
Infinite horizontal strip whose speed is modulated by scroll velocity
(`useVelocity(useScroll().scrollY)` → `useSpring` → skew + baseVelocity). Justified **only**
for a brand-partner logo rail (Control4, Lutron, Sonos, etc.). A marquee of *words* is a
gimmick. Add `[mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]`
to fade the edges instead of hard-cutting.

### 1i. Scroll-scrubbed word opacity (`ScrollReveal`) — **ADAPT, one instance max**
Paragraph words go `opacity 0.1 → 1` staggered against scroll progress (GSAP `scrub: true`).
Strong for a single manifesto/brand-statement paragraph. React Bits also adds a `rotate: 3deg`
un-rotation — **drop that**, it's cute and cheapens it.

### Text patterns to skip outright
`GlitchText`, `FuzzyText`, `ASCIIText`, `ParticleText`, `WarpText`, `SplitFlapText`,
`FallingText` (physics), `TextPressure` (variable-font mouse warp), `TrueFocus`. All read as
demo-reel, all fight a luxury tone.

---

## 2. Scroll-driven patterns

### Worth it
| Pattern | What it is | How | Verdict |
|---|---|---|---|
| **Reveal on enter** | fade + 16–24px rise, once | `whileInView` + `viewport={{ once: true, margin: '-15%' }}` | **STEAL.** The backbone. 90% of the "expensive" feeling comes from doing *only* this, consistently, everywhere. |
| **Section-heading stagger** | eyebrow → headline → body → CTA, 60–80ms apart | parent variants + `staggerChildren` | **STEAL.** Costs nothing, reads composed. |
| **Sticky/pinned narrative** | Left column pins, right column steps through 3–4 states | `position: sticky` + `useScroll({ target, offset })`, or GSAP `pin: true` | **STEAL, once.** Perfect for a "how a Husky install works" 3-step or a room-by-room walkthrough. One per page. |
| **Scroll-linked media** | Hero video/image scales `1 → 1.08` and dims as you leave | `useScroll` + `useTransform` | **STEAL.** Subtle, cheap, very premium. |
| **Progress indicator** | 1–2px accent line at top, or a section index in the sticky nav | `useScroll().scrollYProgress` → `<motion.div style={{ scaleX }}>` | **ADAPT.** Only if the page is long. Use `#EC663D` at 1–2px, no glow. |
| **Sticky section header** | Category label sticks while its cards scroll past | `position: sticky` only, no JS | **STEAL.** Zero cost. |

### Gimmicks — skip
- **Horizontal scroll hijack** (GSAP pin + `x: -100%`). Breaks scroll feel, breaks keyboard
  and trackpad expectations, murders mobile. Only defensible for a dedicated portfolio
  gallery, and even then a normal `overflow-x` drag rail is better.
- **ScrollStack / card-stack scroll** (React Bits `ScrollStack`, uses Lenis + rAF transforms).
  Cards pile up under each other with `scale` + `blur`. Very 2024-Apple, already dated,
  and it costs a smooth-scroll library.
- **ScrollSmoother / Lenis smooth scroll.** Overrides native inertia. It feels luxurious on a
  Mac trackpad for the first 5 seconds and wrong forever after. It also breaks
  `scroll-behavior`, anchor links, and browser find. **Skip.** Native scroll is the premium
  choice now.

  **Note (2026-09-02):** overruled in the build. Lenis is the site's single smooth-scroll
  engine (`SmoothScroll`, `src/components/motion-ui/smooth-scroll.tsx`), mounted once in
  each route layout since commit 5380b7f and disabled under `prefers-reduced-motion`.
- **`ScrollExpand` / `ScrollFloat`** — video that expands to fullscreen on scroll. Very heavy,
  very trendy, ages in six months.
- **Parallax** — a mild 5–10% differential on a background image is fine
  (`useTransform(scrollYProgress, [0,1], ['-8%','8%'])`); anything more, or multi-layer
  parallax, reads 2014.

### The one rule that matters
Every scroll animation must be **`once: true`**. Elements that re-animate every time you
scroll past them is the single clearest tell of an amateur site.

---

## 3. Card / surface treatments

React Bits' surface inventory: `SpotlightCard, MagicBento, ChromaGrid, TiltedCard, PixelCard,
GlareHover, BorderGlow, StarBorder, ElectricBorder, Magnet, Noise, GradualBlur, DecayCard,
ProfileCard, ReflectiveCard`. Cult UI's: `texture-card, texture-button, texture-overlay,
bg-image-texture, minimal-card, shift-card, cutout-card, expandable-card, border-beam-button,
glow-button, metal-button, neumorph-button, distorted-glass, dither-image`.

### Reads premium
**Spotlight follows cursor — STEAL (top pick).** A radial gradient centred on the pointer,
sitting above the card, revealed on hover. React Bits' implementation is beautifully cheap —
no React state, no re-render, just CSS custom properties written on `mousemove`:
```jsx
const onMove = e => {
  const r = ref.current.getBoundingClientRect();
  ref.current.style.setProperty('--mx', `${e.clientX - r.left}px`);
  ref.current.style.setProperty('--my', `${e.clientY - r.top}px`);
};
```
```css
.card::before {
  content: ''; position: absolute; inset: 0; opacity: 0;
  transition: opacity .5s; pointer-events: none;
  background: radial-gradient(560px circle at var(--mx) var(--my),
              rgba(236,102,61,.10), transparent 45%);
}
.card:hover::before { opacity: 1; }
```
Husky tuning: use `#EC663D` at **8–12% max**, large radius (500–600px), and pair it with the
border lighting up from `rgba(255,255,255,.08)` to `rgba(255,255,255,.16)`. That border shift
is doing as much work as the glow.

**Border-follows-cursor — STEAL.** Same `--mx/--my` trick, but the gradient paints the
*border* instead of the fill: card gets a 1px padding wrapper with
`background: radial-gradient(200px at var(--mx) var(--my), #EC663D, rgba(255,255,255,.08))`
and an inset child at `#11131C`. This is the best-looking effect available to us because it
respects flat surfaces and 1px borders exactly.

**Grid spotlight (one glow, many cells) — STEAL.** MagicBento's real trick: track the pointer
on the **grid container**, and every cell reads the same `--mx/--my` in page coordinates. One
listener, the light sweeps across cell boundaries as one continuous surface. Gorgeous on a
tight 1px-gap grid.

**Noise / grain overlay — STEAL.** A fixed, `pointer-events: none`, ~3–4% opacity monochrome
grain over the whole page. This is the single highest ratio of "expensive" to effort on a very
dark site: it kills banding in dark gradients and gives flat `#090A0F` a material quality.
Implement as an inline SVG `feTurbulence` data-URI background, not a canvas/WebGL component.
```css
.grain::after{content:'';position:fixed;inset:0;z-index:9999;pointer-events:none;opacity:.035;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");}
```

**Bento grid — ADAPT.** Asymmetric grid of differently-sized cards. Perfectly fine *as layout*.
What makes bentos look cheap is the treatment inside them (gradient blobs, big rounded corners,
emoji icons). With 4px radius, 1px 8% borders, `#11131C` fill and real product photography,
a bento is just a good editorial grid. **Steal the layout, not the styling.**

**Magnetic hover — ADAPT, buttons only.** Element translates toward the cursor within a
padding radius (React Bits `Magnet`: offset = `(cursor - center) / strength`, CSS transition
0.3s out / 0.5s in). Restrict to the primary CTA and maybe the logo. Magnetic *cards* are a
tell that you copied a template. Note their implementation attaches a global `mousemove` with
`setState` per frame — rewrite with `useMotionValue` + `useSpring` to avoid re-renders.

**Note (2026-09-02):** client order 2026-09-01 — no Magnetic on CTAs at all. A control that
moves while you aim at it costs the reader something; see the comment in
`src/components/sections/hero.tsx`.

**Glare sweep on hover — ADAPT.** A `-45deg` band of white at low opacity sweeping across on
hover (pure CSS `background-position` transition, no JS at all in React Bits' version). At
4–6% white over `#11131C` it reads as light passing over glass/metal. At their default 50% it
reads as a Shopify product badge. Turn it way down.

**Texture / material surfaces (Cult UI) — ADAPT.** Cult's `texture-card` is a card with a
subtle image texture and layered inner borders. The *layered inner border* idea is worth
stealing without the texture image: outer 1px at 8% white, plus an inset
`box-shadow: inset 0 1px 0 rgba(255,255,255,.04)` to catch a top edge highlight. That single
inset line is what makes a flat card look milled rather than drawn.

### Reads gimmicky — skip
- **3D tilt** (`TiltedCard`) — rotateX/rotateY on mouse. Instantly reads "2021 dev portfolio."
- **Glassmorphism** (`FluidGlass`, `GlassSurface`, `distorted-glass`) — explicitly against brief.
- **Animated rainbow / conic borders** (`StarBorder`, `ElectricBorder`, `border-beam`) — a
  conic gradient rotating around the border. Every AI-startup site has this. Skip. If we want
  a border accent it must be the cursor-driven one above, in one color.
- **WebGL backgrounds** (`Aurora`, `Plasma`, `Silk`, `LiquidChrome`, `Balatro`, `Prism`,
  `DarkVeil`, `Iridescence` — 55 of them) — 30–120KB of shader code, a permanent GPU burn, a
  battery drain on mobile, and they all look like a screensaver. **Skip all.** The one dark-site
  background worth having is a static 1px dot/line grid at 3% white, plus the grain overlay.
- **Custom cursors** (`BlobCursor`, `SplashCursor`, `TargetCursor`, `GhostCursor`,
  `ImageTrail`, `PixelTrail`) — hostile to usability, screams "template."
- **Neumorphism, dither, pixel headings, cosmic/metal buttons** — all wrong register.
- **Uiverse as a whole** — the technique library is useful (pure-CSS pseudo-element tricks,
  `background-position` sweeps, `clip-path` reveals) but ~95% of the gallery is neon, glass,
  gradient or pill-shaped. Mine it for CSS mechanics, never paste an element.

---

## 4. Motion vs GSAP for the Husky Next.js App Router site

### Verified facts (npm, 2026-08-30)
| | Motion | GSAP |
|---|---|---|
| Package | `motion` **13.1.1** (framer-motion is the same version, kept as an alias dep) | `gsap` **3.15.0** + `@gsap/react` **2.1.2** |
| Install | `npm i motion` | `npm i gsap @gsap/react` |
| Import | `import { motion } from "motion/react"` | `import gsap from "gsap"; import { ScrollTrigger } from "gsap/ScrollTrigger"` |
| Size (gzip, full barrel) | ~45 KB, fully tree-shakable; `motion/react-m` + `LazyMotion` gets the core to ~5 KB | ~27 KB core, ScrollTrigger ~11 KB more, not tree-shakable |
| License | MIT | **Free for everything now** (incl. SplitText, ScrollSmoother, MorphSVG) thanks to Webflow |
| RSC | Every `motion.*` usage needs `"use client"`. Ships `motion/react-client` with the directive pre-applied for convenience | Entirely client-side; needs `"use client"` + `useGSAP` |

### Recommendation: **Motion, as the default. GSAP only if a specific section demands pinning.**

Reasoning:
1. **Declarative fits React.** `whileInView` + variants + `staggerChildren` covers reveal-on-scroll, section stagger and hover states — which is ~95% of what this site needs — in props, with no refs, no cleanup, no `useLayoutEffect` timing bugs, and correct behavior under Strict Mode and Fast Refresh. GSAP needs a `useGSAP` context + revert on every component.
2. **Performance defaults are better for our use case.** Motion runs scroll-*linked* animations on the native **ScrollTimeline** where supported (off the main thread), and pools a single `IntersectionObserver` across all `whileInView` elements. ScrollTrigger is a main-thread scroll listener with precomputed intersections — excellent, but still main-thread.
3. **RSC posture is cleaner.** Sections stay Server Components; only the small animated leaf (`<Reveal>`, `<CountUp>`, `<SplitLines>`) is `"use client"`. GSAP forces the whole animating subtree client-side because it needs a ref to real DOM.
4. **Bundle.** With `LazyMotion` + `motion/react-m` (or just importing the few features used), Motion lands *below* GSAP+ScrollTrigger for our feature set.
5. **Where GSAP still wins:** true pinning with `scrub` and `snap`, complex multi-step timelines, and the now-free `SplitText` plugin (correct line-splitting across wrapped, kerned, non-Latin text is genuinely hard to do by hand). If we build a pinned "how it works" section or want proper line splitting, add `gsap` + `@gsap/react` for **that one component**, wrapped in `useGSAP` and dynamically imported.

**Do not use Lenis / ScrollSmoother.** Native scroll + `scroll-behavior: smooth` for anchors.

**Note (2026-09-02):** overruled — see §2. Lenis (`SmoothScroll`) is the site's single
smooth-scroll engine, mounted in the route layouts, off under `prefers-reduced-motion`.

**Do not use `framer-motion`** as the package name in new code — it's the legacy alias.

Practical setup:
```bash
npm i motion
# only if a pinned section actually ships:
npm i gsap @gsap/react
```
```tsx
// src/components/motion/reveal.tsx
"use client";
import { motion } from "motion/react";
export function Reveal({ children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-12%" }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay }}
    >{children}</motion.div>
  );
}
```
Wrap globally in `<MotionConfig reducedMotion="user">` so every animation respects
`prefers-reduced-motion` without per-component checks.

---

## 5. What actually makes these read "modern" and "expensive"

Mechanics, not adjectives. These are the levers the good examples pull:

1. **One easing curve, used everywhere.** `cubic-bezier(0.16, 1, 0.3, 1)` (expo-out) or
   `power3.out`. Fast start, long settle. The tell of a cheap site is mixed easings — some
   `ease-in-out`, some springs, some linear. Pick one, put it in a token, never deviate.
2. **Slow durations.** 600–900ms for entrances, 250–400ms for hovers. Cheap sites animate at
   200ms and feel twitchy. Expensive motion is *unhurried* — it implies the visitor will wait.
3. **Short travel distance.** 16–24px of `y`, never 80px. Big travel reads as a template;
   small travel reads as intent. Same for scale: `1 → 1.02`, not `1 → 1.1`.
4. **Stagger, not simultaneity.** 60–90ms between siblings. It creates a reading order and
   makes a static grid feel authored.
5. **Generous, non-linear type scale.** A real jump between display and body — e.g.
   `clamp(2.75rem, 6vw, 5.5rem)` for the hero against a 1rem body — with the display set at
   `letter-spacing: -0.02em to -0.03em` and `line-height: 0.95–1.05`. Tight tracking on large
   Outfit is 80% of the luxury signal. Body copy gets the opposite: `line-height: 1.6`,
   `max-width: 62ch`.
6. **Restrained color = accent scarcity.** `#EC663D` should appear maybe **three times per
   viewport**, max: one CTA, one active state, one micro-detail. Accent used as a background
   fill or a gradient destroys its value. Everything else is a white-opacity ladder:
   text 90% / secondary 60% / tertiary 40% / border 8% / hover border 16%.
7. **Depth from borders and one inset highlight, not shadows.** On `#090A0F`, drop shadows are
   invisible or muddy. Layering comes from: 1px `rgba(255,255,255,.08)` outline +
   `inset 0 1px 0 rgba(255,255,255,.04)` top edge + a marginally lighter fill (`#11131C`).
   Three flat planes, cleanly separated. That's the whole elevation system.
8. **Ruthless alignment and a visible grid.** Sections share one max-width and one gutter;
   eyebrow, headline and body all start on the same x. Cheap sites center everything;
   expensive sites commit to a left-aligned column and hold it for the whole page.
9. **Whitespace as the primary luxury signal.** 120–200px of vertical section padding on
   desktop. More than feels comfortable. Density reads as discount retail.
10. **Micro-interactions with state, not decoration.** Hover states that *inform*: the border
    brightens, the arrow shifts 4px right, the label underline wipes in from the left
    (`transform: scaleX` with `transform-origin: left`). Not: bounce, wobble, glow pulse.
11. **Real photography, held large and uncropped, with a slow reveal** (clip-path or a mask
    sliding off over ~1s). One big image beats six small ones.
12. **Grain.** On a near-black site, a 3% noise overlay is the difference between "a dark div"
    and "a material."
13. **Nothing loops forever.** Every ambient loop (marquees, pulsing glows, shader
    backgrounds) reads as a screensaver and cheapens the page. Motion should be *responsive to
    the user* — scroll, hover, pointer — not autonomous. The single exception: a partner-logo
    rail.

---

## Recommended for Husky — shortlist

Build these eight. Nothing else from the research.

1. **`<Reveal>`** — the universal entrance primitive. `motion.div`, `whileInView`,
   `opacity 0→1` + `y 20→0`, `once: true`, 700ms, `[0.16,1,0.3,1]`. One client component,
   used in every section, `delay` prop for stagger.

2. **`<SplitLines>`** — headline line-mask reveal. Split copy on explicit line breaks (authored,
   not measured), each line in `overflow-hidden` with a `motion.span` from `y: 110%`, 80ms
   stagger. Wait for `document.fonts.ready` before showing. An `sr-only` copy carries the full string.

3. **`<SpotlightCard>`** — service/product card. `onMouseMove` writes `--mx/--my` CSS vars (no
   state); `::before` radial `rgba(236,102,61,.10)` at 560px + border transitions
   `rgba(255,255,255,.08) → .16`. 4px radius, `#11131C` fill, `inset 0 1px 0 rgba(255,255,255,.04)`.

4. **`<SpotlightGrid>`** — bento/capabilities grid where the pointer listener lives on the
   *container* and all cells share one light source, so the highlight sweeps continuously
   across the 1px gaps. Same CSS-var mechanic as #3, one listener.

5. **`<CountUp>`** — proof/stats strip. `useMotionValue` + `useSpring` + `useInView({once:true})`,
   writing `textContent` directly (never state) with `Intl.NumberFormat`; `tabular-nums`.

6. **`<StickyProcess>`** — the one pinned section: "how a Husky install works." Left column
   `position: sticky`, right column of 3–4 steps; `useScroll({ target, offset })` drives which
   step is active. Pure CSS sticky + Motion — no GSAP pinning, no scroll hijack.

7. **`<GrainOverlay>`** — fixed, `pointer-events: none`, `opacity: .035`, inline SVG
   `feTurbulence` data-URI, mounted once in the root layout. Zero JS.

8. **`<LogoRail>`** — brand-partner marquee. Duplicated track, CSS `translateX` keyframe
   animation, `mask-image` edge fade, `animation-play-state: paused` on hover,
   disabled under `prefers-reduced-motion`. The only permitted infinite loop on the site.

Global: wrap the app in `<MotionConfig reducedMotion="user">`; define `--ease-out-expo:
cubic-bezier(0.16,1,0.3,1)` and `--dur-enter: 700ms` / `--dur-hover: 300ms` as tokens in
`globals.css` and use nothing else.

**Explicitly not building:** WebGL backgrounds, smooth-scroll libraries, 3D tilt, custom
cursors, glassmorphism, animated rainbow borders, scramble headlines, horizontal scroll
hijacking, card-stack scroll, parallax beyond ~8%.
