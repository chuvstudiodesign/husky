# Husky Audio Video — Website Rebuild

## What this is

Husky Audio Video is a luxury smart home automation integrator operating in South
Florida. The client commissioned a new website because the brand has a **new visual
identity** — defined in the Figma file `Husky` (revision v2.4 [S.FL]).

The old site still exists and still carries the right *information*, but its layout,
logotype and visual language are all from the previous identity. Nothing visual from
the old site carries over.

**The job:** rebuild the site in Next.js, keeping the old site's substance and
replacing its entire surface with the new design system.

## The three inputs

| Input | Role | Status |
|---|---|---|
| Figma `Husky` v2.4 | Source of truth for the visual identity | Extracted → design system |
| Old website | Source of truth for copy, services, IA | ⏳ URL pending |
| Design system (`/styleguide`) | The contract everything is built against | ✅ Built |

## Scope

A landing page — single scrolling page, with these regions carried over from the old
site's structure:

- Home / hero
- Services (the old site's "All Services")
- About us
- Contact

The client wants it **more beautiful and more robust** than the old site — not a
transcription. Higher design quality, better UI/UX, modern execution.

## Language

**Everything shipped is in English.** The company operates in the United States —
Boca Raton, South Florida — and the audience is American.

That means: all copy, headings, CTAs, labels, alt text, metadata, form strings, error
messages, and code comments. Also the project documents in `docs/` and the agent and
skill definitions.

The project owner communicates in Portuguese. That is the conversation language only —
it never reaches the product. No Portuguese string ships.

## Non-negotiables

1. **Every visual decision resolves to a design token.** No ad-hoc hex values, no
   one-off spacing. The system in `src/app/globals.css` is the contract.
2. **4px radius ceiling.** A hard brand rule from the Figma spec (Section System,
   Rule 03), tightened from 5px to 4px by the client's 4/8px grid mandate — 5 is not
   on a 4-grid. The deviation from Figma v2.4 is deliberate. Every radius step is
   already clamped in the theme.
3. **Dark-first.** `#090A0F` is the spec'd system backdrop; the app ships with `dark`
   applied. Light mode exists and must stay correct.
4. **Outfit + Geist Sans + Geist Mono.** No other typefaces.
5. **Content is inherited, not invented.** Service names, claims and contact details
   come from the old site. Where copy is rewritten for tone, the *facts* stay.

## The design system (already built)

Documented and browsable at `/styleguide`.

| | Value |
|---|---|
| Primary | `#EC663D` — Husky Orange |
| Secondary | `#15243D` — Husky Navy |
| Background | `#090A0F` |
| Card surface | `#11131C` |
| Border | `rgb(255 255 255 / 0.08)` |
| Radius | 4px ceiling |
| Display / Heading | Outfit |
| Body | Geist Sans |
| System / labels | Geist Mono |

Three OKLCH ramps (`husky`, `navy`, `grey`, each 50–900) are exposed as Tailwind
utilities. Semantic tokens: `--success`, `--warning`, `--info`, `--destructive`.

## How the build is run

Not by hand, and not by one agent doing everything. A small crew of specialists,
coordinated by an orchestrator skill. See
`.claude/skills/husky-orchestrator/SKILL.md`.

The orchestrator delegates and integrates; it does not write page code itself.

## Plan A / Plan B

**Plan A (this phase)** — build the crew, extract the old site's content, and
establish the page blueprint. No page code yet.

**Plan B (next phase)** — the client supplies component-library and interaction
references (3D, motion, Next.js UI libraries). Those get studied, then the site is
built section by section.

## Status

- [x] Design system extracted from Figma and implemented
- [x] Styleguide with 9 documented components
- [ ] Agent crew + orchestrator
- [ ] Content extracted from the old site — **blocked: need the URL**
- [ ] Page blueprint
- [ ] Plan B: reference libraries
- [ ] Build
