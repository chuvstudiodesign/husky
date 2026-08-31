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
| `/styleguide` | Design tokens: colour, type, radius, elevation |
| `/styleguide/modern/*` | The eight custom motion components |
| `/styleguide/components/*` | The shadcn primitives in Husky's tokens |

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
   nested inside a card.
2. **5px radius ceiling.** Every step in the theme is clamped, so `rounded-xl` and
   `rounded-4xl` both resolve to 5px. `rounded-full` is for genuine circles only.
3. **Three typefaces.** Outfit for display, Geist Sans for body, Geist Mono for
   technical labels.

The page is dark-first and takes its variety from section-level contrast rather than
a light/dark toggle: near-black, card, a single light band, then the orange close.

## Typographic scale

Sections draw from one vocabulary rather than inventing sizes:
`.display-1` `.display-2` `.display-3` `.lead` `.body-text` `.meta` `.eyebrow`,
plus `.section-x` / `.section-y` for rhythm.

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
