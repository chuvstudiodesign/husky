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

### Known contrast ceiling

White on `#EC663D` measures **3.21:1** — AA for large text only. The Figma uses it on
buttons and it is brand-correct, so it stays. But:

- Small text on orange → use `#090A0F` (6.15:1) instead of white.
- Orange text on a light background → use `husky-600` `#C8491F` (4.74:1).
- Orange on the dark card measures 5.76:1 and is fine.

## Typography

| Role | Family | Spec |
|---|---|---|
| Display H1 | Outfit Bold | 48px, tracking −1% |
| Section H2 | Outfit SemiBold | 28px, tracking −0.5% |
| Body | Geist Sans Regular | 14–16px, line-height 1.5 |
| System / label | Geist Mono | 11–13px, tracking 1px, uppercase |

Utilities: `font-display` / `font-heading` (Outfit), `font-sans` (Geist),
`font-mono` (Geist Mono). The `.text-system` class packages the mono label treatment.

**Three families, no more.** Adding a fourth breaks the identity.

Headings are set in Outfit automatically via the base layer — don't re-declare.

The mono uppercase label is the system's signature move: it reads as instrumentation,
which is what sells "professional control system" rather than "consumer app". Use it
for eyebrows, metadata, status, and small technical annotations. Do not use it for
body copy.

## Radius — RULE 03

**5px maximum. Hard ceiling. No exceptions.**

Every step in the theme is already clamped:

```
--radius-xs  2px    --radius-lg   5px
--radius-sm  3px    --radius-xl   5px  ← clamped
--radius-md  4px    --radius-2xl  5px  ← clamped
                    --radius-3xl  5px  ← clamped
                    --radius-4xl  5px  ← clamped
```

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
2. Every radius ≤ 5px (or a true circle).
3. Renders correctly in both themes.
4. Body text ≥ 4.5:1; large text ≥ 3:1.
5. Three font families, no more.
6. No card nested inside a card.
7. Orange used as signal, not decoration.
