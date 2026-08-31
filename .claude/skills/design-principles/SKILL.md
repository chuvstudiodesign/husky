---
name: design-principles
description: The fundamentals of visual design — hierarchy, contrast, alignment, proximity, repetition, whitespace, balance, rhythm, scale, and Gestalt grouping — with concrete tests for judging whether a layout actually obeys them. Load when designing, building or reviewing any interface layout.
---

# Design fundamentals

These are not style preferences. They are the mechanics that make a layout readable.
A design that violates them looks "off" to everyone and "wrong" to no one in
particular — which is why it must be checked deliberately rather than felt.

Each principle below ends with a **test**: something you can actually verify, not
admire.

---

## 1. Hierarchy

Every screen answers "where do I look first?" — deliberately or by accident.

Rank builds from: **size → weight → color → position → whitespace**. Whitespace is
the most powerful and the most often forgotten: isolating an element outranks
enlarging it.

A section should have exactly one primary element, one or two secondary, and the rest
tertiary. Three competing focal points means none.

> **Test:** Squint until text is illegible. The order in which shapes emerge is your
> real hierarchy. If it doesn't match your intent, the design is wrong regardless of
> how it reads at full clarity.

## 2. Contrast

Contrast is what makes hierarchy *visible*. It applies to size, weight, color,
direction, and density.

The failure mode is timidity: 16px vs 18px is not a contrast, it's a mistake. If two
things have different roles, make the difference **obvious** — a display heading
should be 2.5–3× body size, not 1.2×.

Never carry meaning by hue alone; color-blind users and greyscale printouts lose it.

> **Test:** Convert to greyscale. Is the hierarchy intact? Then check every
> text/background pair: ≥ 4.5:1 for body, ≥ 3:1 for large (≥ 24px, or ≥ 18.66px bold).

## 3. Alignment

Nothing should be placed arbitrarily. Every element sits on a shared edge or axis.

Prefer few alignment lines over many. A layout with two strong vertical axes reads as
composed; one with seven reads as debris. Optical alignment beats mathematical
alignment when they disagree — a round shape needs to overshoot a flat one slightly.

> **Test:** Draw the vertical edges. Count distinct ones. More than three or four in a
> section usually means an accident. Anything off-axis must be off-axis *on purpose*.

## 4. Proximity

Distance encodes relationship. Elements that belong together sit closer than elements
that don't. This is the single cheapest way to make a dense layout legible.

The common failure: uniform gaps everywhere. If the space between a label and its
value equals the space between two unrelated rows, the grouping is invisible.

> **Test:** For any group, the internal gap must be visibly smaller than the gap
> separating it from its neighbours. Roughly 1:2. Uniform spacing = no grouping.

## 5. Whitespace

Not "empty" — it's the material that makes everything else visible. It is also the
strongest single signal of premium. Cheap-looking sites are crowded; expensive-looking
sites are quiet.

Generous space around a heading turns typography into the focal point and produces the
editorial feel luxury brands rely on.

> **Test:** Remove 20% of the content. Does the page get better? If yes, remove it.
> When in doubt, add space rather than a divider — a line is a weaker separator than
> distance, and it adds visual noise.

## 6. Repetition & consistency

Repeating a pattern builds rhythm and teaches the interface. Every new spacing value,
new radius, new type size is a small tax on comprehension.

Use a **limited scale**, consistently. This is why the design system exists.

> **Test:** List every distinct spacing value, font size and radius on the page. If the
> list is long, the design is undisciplined — not rich.

## 7. Rhythm & vertical pacing

A long page needs a beat. Sections should alternate density — a heavy grid followed by
a quiet statement — rather than delivering the same texture repeatedly.

Consistent vertical spacing between sections creates the pulse; deliberately breaking
it creates emphasis.

> **Test:** Zoom out to see the whole page as grey blocks. Is there a pattern of dense
> and open? Or is it a uniform wall?

## 8. Scale

Scale is emotional. Large type is confident. Timid type reads as uncertain, whatever
the words say.

Luxury brands set headlines far larger than feels comfortable in a mockup, with
tighter tracking as size increases (large type needs *negative* letter-spacing; small
type often needs positive).

> **Test:** Does the display type feel slightly too big? Good. Does it feel safe? Then
> it's too small.

## 9. Balance

Weight distributed across the composition. Symmetry reads formal and static;
asymmetry reads modern and dynamic but requires a counterweight — a large quiet area
balancing a small dense one.

> **Test:** Find the visual center of mass. Is the page listing to one side without a
> reason?

## 10. Gestalt grouping

How perception assembles parts into wholes:

- **Proximity** — near things group (see §4).
- **Similarity** — alike things group; vary a property to break a group deliberately.
- **Continuity** — the eye follows lines and edges; align along the intended path.
- **Closure** — implied shapes are perceived; a border is often unnecessary.
- **Common region** — a shared background groups strongly, which is why a card is such
  a heavy device. Use it only when the grouping is real.
- **Figure/ground** — the subject must separate cleanly from its backdrop.

> **Test:** Does anything group visually that isn't related logically? That's a bug.

---

## Typography specifics

- **Measure:** 45–75 characters per line. Beyond ~90 the eye loses its return.
- **Line height:** ~1.5 for body; tighter (1.0–1.2) as display type grows.
- **Tracking:** negative for large display, positive for small uppercase labels.
- **Families:** two or three, maximum. More reads as amateur.
- **Alignment:** left-align body copy. Centered blocks beyond two lines hurt.
- **Hierarchy through weight and size** before color. Color is a last resort.

## Motion

Motion should explain, not decorate.

- 150–250ms for state changes; 300–500ms for entrances.
- Ease-out for entering, ease-in for exiting.
- Animate `transform` and `opacity` only — anything else costs frames.
- Honour `prefers-reduced-motion`. Always.
- If an animation doesn't clarify a relationship or a change, remove it.

## The premium formula

What consistently reads as expensive:

1. **Space** — more than feels necessary.
2. **Restraint** — few typefaces, few colors, one accent.
3. **Scale confidence** — large headlines, unafraid.
4. **One idea per section** — a single strong element doing the work.
5. **Consistency** — a small vocabulary, repeated exactly.
6. **Quality of detail** — precise alignment, correct optical spacing, real contrast.

What reads as cheap: crowding, many competing accents, decorative animation, small
timid type, gradients standing in for hierarchy, and stock imagery.

> Premium comes from what you remove.

---

## Review protocol

When reviewing a layout, work in this order and report **specific, located** findings
— "the eyebrow and the heading in the services section share the same 24px gap as the
section separation, so the group doesn't read" — never "improve spacing".

1. Squint test → hierarchy
2. Greyscale test → contrast carrying meaning
3. Edge count → alignment
4. Gap ratios → proximity/grouping
5. Value inventory → consistency
6. Zoom-out → rhythm
7. Contrast ratios → accessibility

Rank findings by how much they damage comprehension. A broken hierarchy outranks an
off-by-2px margin, always.

## Sources

- [Toptal — 12 Principles of Design](https://www.toptal.com/designers/ui/principles-of-design)
- [IxDF — Visual Hierarchy](https://ixdf.org/literature/topics/visual-hierarchy)
- [UXPin — UX Design Principles](https://www.uxpin.com/studio/blog/ux-design-principles/)
- [The Art of Editorial UI — Typography and Whitespace for Luxury Brands](https://studio.techelix.co/the-art-of-editorial-ui-leveraging-typography-and-whitespace-for-luxury-brands-ui/)
- [Soley Creative — What Makes a Website Luxury](https://www.soleycreative.com/studio-notes/what-makes-a-website-luxury-design-principles-that-sell-premium-products)
