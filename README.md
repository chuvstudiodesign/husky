# Husky Audio Video

Marketing site for Husky Audio Video, a luxury smart home integrator in Boca Raton,
Florida. Built on the brand identity defined in Figma (`Husky`, revision v2.4 [S.FL]).

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · shadcn/ui ·
Motion

## Routes

| Route | What it is |
|---|---|
| `/` | The main landing page |
| `/new-construction` | The "bring your integrator in early" argument, aimed at people currently building |
| `/styleguide` | Design tokens: colour, type, radius, elevation, plus inline demos of button, card, badge, alert and radio group |
| `/styleguide/modern/*` | The eight custom motion components |
| `/styleguide/components/*` | Nine shadcn primitives with a page each: accordion, alert, alert-dialog, aspect-ratio, attachment, avatar, badge, breadcrumb, bubble. The other six — button, card, label, radio-group, separator, spinner — have no page of their own |

## Running it

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build
npm run lint
```

No environment variables are required. The site is fully static.

## Design system

`src/app/globals.css` is the contract. Every colour, radius, font and spacing value
on the site resolves to a token defined there, and `/styleguide` documents them.

Three rules carry over from the Figma spec and are not negotiable:

1. **Background `#090A0F`, card surface `#11131C`.** Two surface levels, never a card
   nested inside a card. One background for the whole site: a full-width band is that
   background, `brand-light` or orange, and nothing else. Text on an orange band is
   `#090A0F`, buttons included; text on a light band is black or navy. Sections are
   separated by whitespace and a change of surface, never by a decorative rule — card
   outlines, inputs and focus rings are chrome, not dividers. The full wording is in
   `.claude/skills/husky-design-system/SKILL.md`.
2. **4px radius ceiling.** Figma v2.4 spec'd 5px; the client's 4/8px grid mandate moved
   it to 4, because 5 is not on a 4-grid. That deviation is deliberate. Every step in
   the theme is clamped, so `rounded-xl` and `rounded-4xl` both resolve to 4px.
   `rounded-full` is for genuine circles only.
3. **Three typefaces.** Outfit for display, Geist Sans for body, Geist Mono for
   technical labels.

The page is dark-first and takes its variety from section-level contrast rather than
a light/dark toggle: near-black, card, a single light band, then the orange close.

## Typographic scale

Sections draw from one vocabulary rather than inventing sizes:
`.display-1` `.display-2` `.display-3` `.lead` `.body-text` `.nav-text` `.meta`
`.eyebrow`, plus `.section-x` / `.section-y` for rhythm.

Every size and leading in that vocabulary lands on the 4/8px grid — body 16/28, lead
16/28 → 20/32, nav and the mono labels 12/16, display leading always the size plus 4.
The classes carry it; setting a size by hand is how the grid breaks.

One exception: the hero's lead paragraph keeps `.lead`'s pre-2026-09-01-order sizing
(16/28 → 24/36) via a `.hero-lead` class added alongside `.lead` in `hero.tsx`, per
client order — every other `.lead` on the site takes the 20/32 desktop figure above.

## Motion

Custom components live in `src/components/motion-ui/`. Two rules apply to all of
them:

- **Content is never withheld pending hydration.** Scroll-reveal hides its starting
  state behind an `html.js` guard set by a blocking inline script, so the server
  sends fully visible markup. With scripting blocked or slow, the text is still
  there.
- **Transform and opacity only**, and `prefers-reduced-motion` is honoured
  throughout.

## Content

`docs/` holds the source material rather than guesswork:

- `content-inventory.md` — everything extracted verbatim from the legacy site
- `content-strategy.md` — what carries over and why
- `copy-home.md`, `copy-new-construction.md` — the shipped copy, section by section

Claims marked `[VERIFY]` in those files (the "20+ years" figure, the certification
status) still need client confirmation before the site goes live.

## Deploying

Import the repository into Vercel. The framework is detected automatically and no
configuration is needed.
