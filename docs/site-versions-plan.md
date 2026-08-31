# Site versions — development plan

Four alternative presentations of the Husky site, built one at a time for the client
to compare. Each is a real page at its own route, not a branch.

**Resuming:** say "continue with site-2" (or 3, 4) and start at that section below.
Everything needed to build it is here.

---

## Hard rules

These hold for every version. Breaking one is a bug, not a variation.

1. **Never touch what is already approved.** `/` (the main site),
   `/new-construction`, and the existing `/styleguide` pages are final. New versions
   live at their own routes and get their own copies of any section they change.
2. **Every new component goes into the design system.** Anything built for these
   versions gets a page under `/styleguide/modern/*` and an entry in
   `navigation.ts`. Adding pages is expected; editing existing ones is not.
3. **The design system is the contract.** Tokens only, 5px radius ceiling, Outfit /
   Geist / Geist Mono, two surface levels, no card inside a card.
4. **Content stays the same across versions.** Same copy, same facts, same services.
   What varies is presentation. Nothing gets invented to fill a layout.
5. **English only**, everywhere that ships.
6. **Motion is progressive.** Content is never withheld pending hydration;
   `transform` and `opacity` only; `prefers-reduced-motion` honoured.

## Numbering

The original brief numbered these 2–5. Site 1 was promoted to the main page at `/`,
so everything shifted down one:

| Route | Was called | What it is |
|---|---|---|
| `/` | — | **The approved main site. Do not modify.** |
| `/new-construction` | — | **Approved. Do not modify.** |
| `/site-1` | "version 2" | Main site's layout, heavily animated |
| `/site-2` | "version 3" | A completely different layout |
| `/site-3` | "version 4" | Another completely different layout |
| `/site-4` | "version 5" | Photo-led hero, widescreen |

## Reference libraries

Studied in `docs/modern-patterns.md`. What to take from each:

| Source | Take |
|---|---|
| React Bits | SplitText, FoldText, CountUp, SpotlightCard, ElasticMesh |
| Motion (motion.dev) | scroll-linked transforms, `useScroll`, spring damping |
| GSAP ScrollTrigger | pinned sections, scrubbed timelines — only where CSS sticky can't |
| Origin Kit | mesh text hover, infinite text pacer, globe |
| Skiper UI | parallax scenes, text reveal box, scroll effects, image reveal |
| Cult UI | surface treatments, bento composition |
| 21st.dev | follow-mouse tech elements, constellation fields |
| UIverse | small interaction details, loaders |

**Filter everything through the brand:** dark, restrained, one accent, 5px radius,
flat surfaces on 1px borders. No glassmorphism, no gradient soup, no pill shapes, no
rainbow. If a component only reads well with a purple-to-cyan gradient, it is the
wrong component.

**Skip:** WebGL backgrounds and smooth-scroll libraries that hijack the wheel
badly. Lenis is the exception — it keeps native scroll semantics.

---

## Site 1 — animated

Route `/site-1`. Same structure and visual language as `/`, but properly animated.
This is the "same site, more alive" version.

**Changes from the main site**

- **Smooth scroll.** Lenis, wrapping the page. Momentum without hijacking: anchors,
  find-in-page and keyboard scrolling must keep working, and it must switch off
  under reduced motion.
- **More scroll animation.** The main site reveals blocks and stops there. This one
  adds scroll-linked motion: parallax on section graphics, a text passage that
  brightens word by word as it is scrolled through, an image that unmasks.
- **Richer type animation.** Fold, echo and variable-weight treatments on headlines,
  used sparingly — one per section at most.
- **Stats order swapped.** `South Florida / Service area` moves to first position;
  `20+ / Years of integration` follows it.
- **One image.** The estate-at-dusk photo, cropped tight, in a section that currently
  has none. Given a reveal treatment rather than dropped in flat.

**New components** → all documented in the styleguide

| Component | What it does |
|---|---|
| `SmoothScroll` | Lenis provider, reduced-motion aware |
| `Parallax` | Scroll-linked translate on any child |
| `TextRevealScroll` | Words brighten in sequence as the block is scrolled through |
| `ImageReveal` | Clip-path unmask on entry |
| `FoldText` | Headline folding in on the X axis, per word |

---

## Site 2 — editorial / index

Route `/site-2`. A completely different structure. Not the main site rearranged.

**The idea.** Treat the page as an index rather than a scroll narrative. A fixed
left column holds the brand, the section list and the current position; the right
column is the only thing that moves. Services become a numbered table that expands
in place instead of a grid of cards. Reads like a technical document, which suits an
integrator far better than a marketing brochure.

**Structure**

- Fixed left rail: wordmark, section index with active state, contact
- Right column scrolls: oversized numbered sections
- Services as an expanding list — number, name, one line, opens to full description
- Type-led throughout: no cards, hairlines only
- Contact as a full-bleed final panel

**New components:** `SectionIndex` (scroll-spy rail), `ExpandingList`, `NumberedRule`

---

## Site 3 — horizontal / control panel

Route `/site-3`. Another complete departure, leaning into the smart-home subject.

**The idea.** The site behaves like the control system it sells. A horizontal
scroll track for services, a zone-status grid, live-looking telemetry framing. The
Figma "Smart Home System" page is the reference for the register.

**Structure**

- Hero with a follow-mouse field, sparse and technical
- Services on a horizontal scroll track, driven by vertical wheel
- A zone grid that reads like a rack status panel, using the system iconography
- About as a sticky-pinned passage with content stepping through it
- Contact as a terminal-style panel

**New components:** `HorizontalScroll`, `FollowMouseField`, `StickyPin`,
`StatusGrid`

---

## Site 4 — photo-led

Route `/site-4`. The version that uses the photography.

**The idea.** The two estate-at-dusk photographs from Figma `09 — Photos` carry the
hero. They are 2132×738, close to 21:9, which is the point: on a widescreen monitor
the frame extends and more of the scene is visible; on a narrow screen it crops in.
The image is centred and always full-bleed.

**Structure**

- Full-bleed photo hero, image centred so the extremities appear as the viewport
  widens. Copy sits over it with a legibility scrim tuned to keep body text at 4.5:1.
- Second photo used later as a full-width band between sections
- The rest follows the main site's rhythm so the photography is the variable
- Slow parallax on the hero image — subtle; the photo is the subject

**New components:** `PhotoHero` (widescreen-centred, scrim-managed), `ImageBand`

**Assets:** already in `public/photos/` — `estate-dusk-01.jpg`, `estate-dusk-02.jpg`

---

## Working method

One version at a time. Build it, verify it, show it, wait for the go-ahead before
starting the next.

**Verification before showing any version** — actual output, never assumed:

```bash
npx tsc --noEmit && npm run lint && npm run build
```

Then render at 1440 and 390, read the screenshots, and check: one `h1`, no
horizontal overflow, contrast on any new colour pairing, and that the page is
readable with scripting disabled.

## Status

- [x] `/` — main site, approved
- [x] `/new-construction` — approved
- [ ] `/site-1` — animated
- [ ] `/site-2` — editorial / index
- [ ] `/site-3` — horizontal / control panel
- [ ] `/site-4` — photo-led

**Open question, deliberately not acted on:** the brief asked for smooth scroll on
the main site too. That would mean modifying `/`, which the standing rule forbids.
It is one line once approved — say the word.
