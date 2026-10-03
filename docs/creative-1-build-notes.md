# Creative 1 — build notes for section builders

Read this, then your section in `docs/creative-versions.md`, plus that file's lines 1–172
(contract, Cable Run, primitives). Load the `husky-design-system` skill before writing UI.
Next.js 16 — check `node_modules/next/dist/docs/` when unsure.

## Primitives — as built (these are the real APIs; they override the spec table)

All in `src/components/motion-ui/`. Read the source of any you use.

- `gsap-setup.ts` — `registerGsap()`, `SCRUB` (0.3), `MQ.motionDesktop` / `MQ.motionMobile`,
  `STATE_EASE`, `scheduleRefresh()`, and re-exports of gsap plugins.
- `use-scroll-scene.ts` — `useScrollScene(scope, { desktop?, mobile? }, deps?)`. Each build
  gets `{ scope, branch, context }` and may return a cleanup. **All scroll triggers go
  through this. No raw `ScrollTrigger.create` in section files.**
- `scroll-scene-root.tsx` — already mounted in `src/app/(site)/creative-1/page.tsx`. The
  hero image must carry `data-scroll-scene-hero`.
- `husky-mark-paths.ts` — `MARK_VIEWBOX`, `MARK_HEAD_D`, `MARK_JAW_D`, `MARK_PATHS`,
  `MARK_BOX`, `MARK_CHIN`, `MARK_MUZZLE`.
- `scrub-text.tsx` — `<ScrubText as split effect start end trigger? timeline? position?>`.
  `timeline={null}` = stay static until a timeline arrives. `addScrubText(tl, el, opts,
  position)` sequences text inside a pinned scene's own build. In own-trigger mode, text in
  the first viewport is left alone — hero type must go through a scene timeline.
- `cable-segment.tsx` — `<CableSegment tone first last pinTrigger onPowerChange className
  style>`. While lit it sets `data-powered` on its parent element → style eyebrows with
  `group-data-[powered]:text-foreground` (parent needs `group`). `first` has no node.
- `scrub-odometer.tsx` — `<ScrubOdometer value suffix className>` (server-safe) and
  `addOdometer(tl, el, position, duration)`.
- `cursor-light.tsx` — `<CursorLight radius strength className>`.
- `roll-text.tsx` — `<RollText as className>{string}</RollText>`; also rolls on ancestor
  `group` hover/focus.
- `spotlight-frame.tsx` — `<SpotlightFrame className innerClassName>`.

## Content

All copy comes from `src/components/sections/creative-1/content.ts`. Import it; never retype
a string. If a string you need is missing, add it there (verbatim from `docs/copy-home.md`)
in your own section's export only.

## Your file

Replace the stub in `src/components/sections/creative-1/<section>.tsx` (keep the export
name and the section `id`). Section-local helpers go in the same file or a sibling file
named in the spec. Do **not** edit `page.tsx`, other sections, or shared primitives —
if a primitive has a bug blocking you, describe it in your report instead of editing it.
Don't touch `/` or any existing page.

## Dev server

Already running at **http://localhost:3123** (port 3000 is another project). Do not start or
stop a dev server. Page: `http://localhost:3123/creative-1`. Other builders are working on
other sections of the same page in parallel — ignore their in-progress state.

## Done when

- `npx tsc --noEmit` and `npm run lint` show no errors in your files.
- Screenshots of your section at 1440 (at start, mid-scrub, end of its scene) and at 390,
  plus once with `prefers-reduced-motion: reduce` emulated (Playwright via `npx playwright`
  is fine; scroll to your section by id).
- No horizontal overflow at 390.
- Report in ≤12 lines: what you built, any deviation from the spec and why, any primitive
  problem found.
