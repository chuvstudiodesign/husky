---
name: husky-design-system
description: The Husky Audio Video design token contract — colors, type, spacing, radius, elevation, and the rules for using them. Load before writing or reviewing any UI in this project, and whenever a color, font, spacing or radius decision is being made.
---

# Husky Design System — the contract

Source of truth: `src/app/globals.css`. Browsable at `/styleguide`.
Derived from Figma `Husky` v2.4 [S.FL]. **Never** invent a value that isn't here.

## The one rule

> Every visual decision resolves to a token. If you're typing a hex code, a px
> radius, or an arbitrary spacing value into a component, you are doing it wrong.

Use the Tailwind utility that maps to the token (`bg-card`, `text-muted-foreground`,
`border`, `rounded-lg`) — not `bg-[#11131C]`.

The only place raw hex is acceptable: the styleguide's own swatches, which document
the tokens, and brand-mark backdrops that must reproduce an exact Figma panel.

## Color

### Brand (immutable — these come from the source vectors)

| Token | Value | Meaning |
|---|---|---|
| `--brand-orange` | `#EC663D` | Primary. Signal, action, active state. |
| `--brand-navy` | `#15243D` | Secondary. Depth, light-mode text. |
| `--brand-light` | `#DFDFDF` | Logo backdrop grey. |
| `--brand-black` | `#090A0F` | System backdrop (Rule 01). |
| `--brand-surface` | `#11131C` | Card fill (Rule 02). |

### Semantic (theme-reactive — always prefer these)

`--background` `--foreground` `--card` `--card-foreground` `--popover`
`--primary` `--primary-foreground` `--secondary` `--muted` `--muted-foreground`
`--accent` `--destructive` `--border` `--input` `--ring`
`--success` `--warning` `--info` (+ `-foreground` pairs)
`--chart-1` … `--chart-5`
`--sidebar*`

### Ramps

`husky-50…900`, `navy-50…900`, `grey-50…900` — generated in OKLCH, perceptually
even. Available as utilities: `bg-husky-500`, `text-navy-900`, `border-grey-200`.

Use a ramp when you need a tint the semantic tokens don't cover. Prefer semantic
tokens first — they adapt across themes; ramps do not.

### Orange discipline

Orange is a **signal**, not a surface. It marks the active zone, the primary action,
the one thing that matters in a view. A page with orange everywhere has no hierarchy.
Roughly: one primary orange element per viewport.

### Bands and text on them — RULE 04 (client, 2026-09-01)

Four rules, and they are not preferences:

1. **One site background: `#090A0F`.** A full-width band may be that background,
   `--brand-light`, or primary orange. Nothing else runs edge to edge — no navy band,
   no card-coloured band, no gradient.
2. **Orange band ⇒ text is `--brand-black`. Always.** Buttons on orange included.
   White on orange does not ship, whatever the size.
3. **Light band ⇒ text is black or navy only.** No grey body copy on light, no orange
   headings on light.
4. **Zero decorative dividers.** No hairline rule between sections, no `Separator` used
   as a section break, no gradient hairline. Separation comes from whitespace and a
   change of surface, nothing else. Component chrome — card outlines, input borders,
   focus rings — is not a divider and stays.

### Known contrast ceiling

White on `#EC663D` measures **3.21:1** — AA for large text only. The Figma uses it on
buttons and it is brand-correct, so it stays. But:

- Small text on orange → use `#090A0F` (6.15:1) instead of white.
- Orange text on a light background → use `husky-600` `#C8491F` (4.74:1).
- Orange on the dark card measures 5.76:1 and is fine.

## Typography

The shipped scale is a set of classes in `globals.css`. Every value sits on the 4/8px
grid (client mandate, 2026-09-01: every px the eye can measure lands on the grid).

Photography exists on the site since 2026-09-01 (client reversal of the earlier
no-photography rule): `public/photos/` holds the brand assets, and the showcase SVGs
embed CC BY photos (credits in `docs/asset-credits.md`). The **24px photographic
radius exception** to the 4px ceiling survives in exactly one place — the Approach
portrait (`src/components/sections/approach.tsx`); the stats map image went back to
4px on a later client order the same day. System chrome stays at 4px everywhere.

| Class | Family | Size / leading |
|---|---|---|
| `.display-1` | Outfit 600 | clamp 44 → 104px, leading = size + 4px, tracking −3.5% |
| `.display-2` | Outfit 500 | clamp 32 → 60px, leading = size + 4px, tracking −2.8% |
| `.display-3` | Outfit 500 | 20 / 24 |
| `.lead` | Geist Sans | 16/28 on a phone → 20/32 on the desktop |
| `.hero-lead` | Geist Sans | Hero-only pin, added alongside `.lead`: 16/28 → 24/36 |
| `.body-text` | Geist Sans | 16 / 28 |
| `.nav-text` | Geist Sans | 12 / 16 |
| `.eyebrow` `.meta` | Geist Mono | 12 / 16, tracking 0.14em, uppercase |
| `.text-system` | Geist Mono | 13px, tracking 0.077em, uppercase |

Draw from these and nothing else — no `text-sm` on a paragraph, no hand-set size. The
bare `h1`/`h2` elements keep the Figma base spec (48px and 28px in Outfit) for pages
that use raw headings, such as the styleguide.

`.lead`'s desktop ceiling moved from 24px to 20px on client order 2026-09-01 (a
screenshot of the Services lead, measured on the running site, showed it never
actually landing on 20 — 22.4px at 1280, clamped at 24px from ~1371px on). One
paragraph is the documented exception: the hero's lead ("só não mexa na hero," same
order). It carries `.hero-lead` alongside `.lead`, in `hero.tsx`, which freezes
`.lead`'s pre-revert formula so the hero renders exactly what it did before —
16/28px at 390/768, 24/36px at 1440/1920. No other `.lead` gets this treatment.

Utilities: `font-display` / `font-heading` (Outfit), `font-sans` (Geist),
`font-mono` (Geist Mono). The `.text-system` class packages the mono label treatment.

**Three families, no more.** Adding a fourth breaks the identity.

Headings are set in Outfit automatically via the base layer — don't re-declare.

The mono uppercase label is the system's signature move: it reads as instrumentation,
which is what sells "professional control system" rather than "consumer app". Use it
for eyebrows, metadata, status, and small technical annotations. Do not use it for
body copy.

## Radius — RULE 03

**4px maximum. Hard ceiling. No exceptions.**

Figma v2.4 spec'd 5px. The client's 4/8px grid mandate (2026-09-01) outranks it —
5 is not on a 4-grid — so the ceiling moved to 4. Deliberate, and the one place the
code departs from the Figma contract. Do not "restore" it.

Every step in the theme is already clamped:

```
--radius-xs  2px    --radius-lg   4px
--radius-sm  3px    --radius-xl   4px  ← clamped
--radius-md  4px    --radius-2xl  4px  ← clamped
                    --radius-3xl  4px  ← clamped
                    --radius-4xl  4px  ← clamped
```

`xs` and `sm` are the two documented exemptions from the grid: they exist only for
controls ≤28px tall, where 4px reads as a pill. Nothing larger may use them.

`rounded-full` is still available and correct for genuine circles — status dots,
avatars, the reaction pill. It is not a loophole for pill-shaped buttons.

## Elevation

The system is **flat**. Separation comes from a 1px border at 8% white, not shadow.

`--shadow-flat` `--shadow-subtle` `--shadow-raised` `--shadow-overlay` exist for
genuine overlays (dropdowns, dialogs). A card on a page uses a border, not a shadow.

## Surface composition — the nesting rule

From the Figma spec, verbatim:

> Stack panels hierarchically on top of the `#090A0F` page backdrop.
> **Do not nest cards with background fills inside other cards.**

Two levels maximum: page backdrop → card. If you need a third level, use a border or
a subtle `--muted` fill, never another `--card` block.

## Spacing

Tailwind's 4px base scale. Prefer the larger end — this is a luxury brand and the
design reads as spacious. Section gaps in the styleguide run at `gap-28` (112px);
match that register on the site.

A limited set, used consistently, beats a bespoke gap per component.

## Themes

`.dark` is the canonical Husky system and ships as the default on `<html>`.
`:root` is the light counterpart, built from the logo sheet's "on light / on grey"
panels.

Both must stay correct. When you add a color, define it in both blocks — never let a
value exist only in one theme.

## Components

shadcn/ui, installed in `src/components/ui/`. Already present and documented at
`/styleguide/components/*`:

accordion · alert · alert-dialog · aspect-ratio · attachment · avatar · badge ·
breadcrumb · bubble · button · card · label · radio-group · separator · spinner

**Extend, don't rebuild.** If a component needs a new variant, wrap it in
`src/components/` rather than forking the primitive.

## Checklist before shipping any UI

1. Zero raw hex values outside documented exceptions.
2. Every radius ≤ 4px (or a true circle).
3. Renders correctly in both themes.
4. Body text ≥ 4.5:1; large text ≥ 3:1.
5. Three font families, no more, and every size from the class scale.
6. No card nested inside a card.
7. Orange used as signal, not decoration.
8. Full-width bands are background, brand-light or orange — nothing else.
9. Text on orange is brand-black; text on light is black or navy.
10. No decorative divider anywhere: whitespace and surface change only.
