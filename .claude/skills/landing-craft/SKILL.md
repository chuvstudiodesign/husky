---
name: landing-craft
description: Patterns for building a high-end marketing landing page — section archetypes, hero construction, narrative order, conversion mechanics, responsive strategy and motion budget. Load when planning page structure or implementing a marketing section.
---

# Landing page craft

For a considered, high-ticket service — a luxury smart home integrator, not a SaaS
signup. The visitor is evaluating **trust and taste**, and will convert by making
contact, not by clicking "buy".

That changes the mechanics: proof and craft outrank urgency and friction-reduction.

## Narrative order

A landing page is an argument. The order is the argument.

1. **Hero** — who you are, what you do, for whom. One sentence, no jargon.
2. **Credibility** — why you're believable. Years, scope, pedigree, territory.
3. **Services** — what you actually deliver, grouped so it can be scanned.
4. **Proof** — work, results, or specifics that a competitor couldn't claim.
5. **Process** — how engagement works. Reduces the fear of an opaque, expensive project.
6. **About** — the people. High-ticket services are bought from people.
7. **Contact** — the conversion. Low friction, human, specific.

Not every page needs all seven. It needs them **in this order** — reversing proof and
services makes the claim land before the evidence.

## Hero

The hero does one job: make the visitor understand and want to keep scrolling.

- **One headline.** Large, confident, specific. "Intelligent Home" beats "Welcome to
  Husky Audio Video".
- **One supporting line.** The concrete what and where.
- **One primary action.** A second competing CTA halves the first.
- **One visual.** Let it breathe. A busy hero reads as cheap.

Avoid: carousels (nobody sees slide 2), autoplaying video with sound, a wall of
feature bullets, "We are a leading provider of…".

Height: tall enough to feel composed, short enough that the fold hints at more.
Full viewport height is a default, not a requirement — a deliberate 85vh with the next
section peeking often converts better.

## Section archetypes

Reach for these rather than inventing structure per section:

| Archetype | Use for | Shape |
|---|---|---|
| **Statement** | A single claim with authority | Big type, huge margins, nothing else |
| **Card grid** | Services, capabilities | 2–4 columns, equal weight |
| **Feature split** | One thing explained with a visual | 50/50 text + media, alternating sides |
| **Metric row** | Credibility in numbers | 3–4 large figures with mono labels |
| **Editorial** | Story, about, philosophy | Narrow measure, generous leading |
| **Logo / proof strip** | Partners, brands carried | Quiet, monochrome, evenly spaced |
| **Process steps** | Numbered engagement flow | Horizontal or vertical numbered list |
| **CTA band** | Conversion | Contrasting surface, one action |

**Alternate density.** Card grid → statement → feature split → metric row. Two grids
back to back produce a wall.

## Conversion mechanics

For a considered purchase:

- **Contact is the conversion.** Make it trivially easy. Phone, email, and a short
  form — not a 9-field qualification gauntlet.
- **Ask for the minimum.** Name, contact, and what they need. Every extra field costs
  submissions.
- **Be specific about what happens next.** "We'll call within one business day" beats
  "Submit".
- **Repeat the CTA** at natural decision points — after services, after proof, in the
  footer. Not floating and following.
- **Show the territory.** A local integrator's service area is a qualifier, not a
  limitation.

## Responsive strategy

Design the **narrow** case honestly, then let it expand. A layout that only works at
1440px is not finished.

- Single column below `md`. Don't cram a 3-up grid onto a phone.
- Display type must step down — 48px on desktop is 32–36px on mobile, and the tracking
  changes with it.
- Section padding shrinks, but never below a comfortable gutter (~24px).
- Touch targets ≥ 44px. This includes the nav.
- Tables and wide content scroll inside their own container; the page body never
  scrolls sideways.

Test at 375, 768, 1280, 1920.

## Motion budget

Motion is the fastest way to make a premium site feel cheap. Spend it carefully.

**Worth it:**
- Section reveal on scroll — subtle, once, ~20px rise with a fade.
- Hover state changes on interactive elements.
- Smooth transitions between states that actually change.

**Not worth it:**
- Every element animating in sequence.
- Parallax for its own sake.
- Counters that spin up.
- Anything that delays the visitor reading the content.

Rules: `transform` and `opacity` only. 150–250ms for states, 300–500ms for entrances,
ease-out on entry. Honour `prefers-reduced-motion` — no exceptions.

## Navigation

For a single-page site: a slim sticky header with anchor links, plus the primary CTA.

- Keep it quiet. The nav is not the content.
- Indicate the current section if the page is long.
- On mobile, a sheet or drawer — not a cramped inline row.
- The logo returns to top.

## Copy discipline

**Language: English, always.** The company operates in the United States and the
audience is American. Every shipped string — headings, body, CTAs, labels, alt text,
metadata, form and error messages — is written in US English. The project owner may
brief in another language; that never reaches the product.

- **Concrete beats superlative.** "20+ years of custom integrator pedigree in South
  Florida" beats "the best in the business".
- **Second person.** "Your home", not "the client's home".
- **Cut the preamble.** The first sentence of most drafts is throat-clearing.
- **Sentence case** for headings; the mono uppercase treatment is for labels only.
- **Numbers are credibility.** Use them wherever they're true.

## Technical baseline

- Semantic landmarks: `header`, `nav`, `main`, `section`, `footer`. One `h1`.
- Headings in order — don't skip levels for styling.
- Images: `next/image`, explicit dimensions or `fill`, real `alt`, `priority` on the
  hero only.
- Server Components by default; `"use client"` only where interaction demands it.
- Metadata + Open Graph. A shared link that renders blank looks broken.
- Fonts via `next/font` — already configured, don't add more.

## Anti-patterns

Things that consistently make a premium brand look cheap:

- Stock photography of anonymous people shaking hands
- Icon-per-bullet feature lists
- Testimonial sliders
- "Trusted by thousands" without naming anyone
- Gradient text
- Multiple accent colors
- A cookie banner that fights the hero
- Chat bubble popping open unprompted
