import { Counter } from "@/components/motion-ui/counter";
import { Reveal } from "@/components/motion-ui/reveal";
import { MediaBand } from "@/components/sections/media-band";

const stats = [
  {
    value: 20,
    suffix: "+",
    label: "Years of integration",
    numeric: true,
  },
  {
    // Broken here rather than left to wrap, and the break is load-bearing —
    // see FIGURE_BOX. The DOM text still contains a newline, which every
    // screen reader reads as the single word break in "South Florida".
    display: "South\nFlorida",
    label: "Service area",
    numeric: false,
  },
  {
    value: 8,
    suffix: "",
    label: "Systems we install",
    numeric: true,
  },
  {
    value: 5,
    suffix: "",
    label: "Partner platforms",
    numeric: true,
  },
] as const;

/* Every figure sits in the same fixed box, bottom-aligned, so the four labels
   below line up across the row whatever the figure does.

   The box used to be sized to the worst case and the worst case was enormous:
   "South Florida" set at the numerals' own size wrapped to two lines of 48px,
   which made the box 96px tall and left "8" and "5" floating with 48px of dead
   tile above them. Client, 2026-09-01: the four tiles carried equal weight of
   chrome and wildly unequal weight of content.

   The fix is to stop setting a thirteen-character place name at a single
   digit's size. Point size is not optical size — "8" at 48px and "South
   Florida" at 48px are the same measurement and nowhere near the same amount
   of ink — so the word steps down and stacks, and the two together are made to
   occupy exactly the space one numeral does:

     base/md   word 2 × 24px = 48   numeral 36px   box h-12
     lg        word 2 × 30px = 60   numeral 48px   box h-15

   Two consequences worth stating. The void above a numeral is now 12px at both
   steps rather than 48 or 60 — a breath, not a hole — and the whole card is
   ~40px shorter at 1440, which is where the elegance actually comes from. And
   the break in "South Florida" is hard-coded in the data rather than left to
   wrapping, because wrapping is width-dependent: at 1440 the tile is wide
   enough to set it on one line, which would drop that figure to 30px of ink in
   a 60px box and undo the whole arrangement. Forced, it is two lines at every
   width, and every width is 60px.

   Bottom-aligned, so the four figures share a baseline to within the difference
   in their descents — about 5px between the 48px numerals and the 30px word,
   under what the eye resolves, and the labels beneath are exactly level. */
const FIGURE_BOX = "flex h-12 items-end lg:h-15";

/**
 * The credibility band. Sits directly under the hero on the same surface, with
 * nothing but the hero's own bottom padding between them — so it reads as a
 * footnote to the headline rather than as a new section competing with it.
 *
 * **The photograph is this section's backdrop, from `lg` up.** Client redesign,
 * 2026-09-01: the map-in-hand shot was a separate band above the strip and is
 * now the surface the four figures stand on, fading into the page background
 * before it reaches them. Below `lg` the two come apart again — whole picture,
 * no gradient, cards underneath — because the card stack is two rows there and
 * taller than the picture it would be sitting on. It is rendered in flow at the
 * top of the block rather than as an absolute layer behind it, which is what
 * makes that split one class rather than two layouts; `MediaBand` carries the
 * reasoning.
 *
 * Nothing here is ruled. The tiles are separated by the grid gap and the band by
 * its padding: the ruled table this used to be put a second separator on every
 * boundary, and the inner `px-6` pushed the first figure off the page's left
 * edge. The last hairline, a `border-t` on the section, came off with the rest.
 *
 * **The surface is `--card`, and there is no border.** These two were decided
 * together and only make sense together. The earlier build ran `--card-quiet`
 * (#0D0F16) *plus* a hairline, on the argument that a footnote should not carry
 * the weight of fill the showcase cards further down do — and that argument was
 * right about the weight and wrong about where the weight was coming from. The
 * fill was never the loud part. The outline was: four full-strength rectangles
 * drawn in white at 8%, in a section that now has a photograph in it. Client,
 * 2026-09-01, on the four tiles — border and fill at full strength together is
 * the least refined thing in the frame.
 *
 * Take the line away and the quiet fill has nothing left to hold the tile
 * together with: #0D0F16 sits 4/5/7 per channel above a #090A0F page, and a
 * surface that faint with no edge is not a card — rendered at 1440 it simply
 * dissolves wherever the backdrop behind it has already gone dark, which is
 * most of the row. #11131C sits 8/9/13 above the page, which is a surface you
 * can see without an outline. So the fill moves up exactly as far as the border
 * moves out, and the tile ends up reading quieter than either half did alone.
 * White numerals on it measure 18.5:1 and the mono labels 6.6:1, both far past
 * AA.
 *
 * **No icons, and that was tested rather than assumed.** A 40px lucide glyph
 * per tile — clock, map pin, layers, handshake — was built and rendered against
 * the version without, at 1440 and 390. It failed on two counts. The figures
 * are bottom-aligned in a fixed box so the four labels stay level, which means
 * an icon parked at the top of the tile is separated from the numeral by dead
 * space: the tile reads as two groups rather than one, and at 390 that gap is
 * most of the tile. And it costs height the strip cannot spend — 354px against
 * 290 at 1440, 548 against 420 at 390 — which turns a footnote to the hero into
 * a section of its own. The numeral is the tile's whole content; an icon that
 * only restates the label beneath it is a sticker whatever size it is.
 */
export function Stats() {
  return (
    <section className="bg-background">
      {/* 48px, symmetric, and deliberately not a full `.section-y`. This is a
          footnote strip rather than a section, so it does not own a whole beat
          on each side — it owns a little over a quarter of one, and its two
          neighbours supply the rest. The hero's 128px above and the services
          band's 128px below each close to exactly 176px, the `.section-y` step
          at 1440, so both boundaries land on the same beat as the rest of the
          page instead of the strip inflating them. */}
      <div className="section-x mx-auto max-w-7xl py-12">
        <MediaBand />
        {/* Two layouts, one class each. Below `lg` the cards are a plain 2×2
            grid 48px under the picture — the client's mobile call, and the
            picture keeps all four of its corners. From `lg` they are lifted
            onto its foot.

            -10% of the container's *width*, which is the whole overlap rule. A
            vertical margin percentage resolves against the containing block's
            inline size, and the picture is a fixed 3:2, so its height tracks
            that same width — one number therefore lands the card row at 85% of
            the picture's height at every width above the breakpoint, with no
            clamp and no second value to keep in sync. Measured: 85.3% at 1440
            (115px of lift on a 784px picture), 85.4% at 1024. The tenth of a
            percent of drift is the picture's optical overshoot — it is 24px
            wider than the container this margin resolves against — and it is
            two pixels on the tallest frame, not something to correct for.

            85%, down from 79%. Client, 2026-09-01: "desce os cards 30% em
            relação a imagem". Read as the overlap rather than the position,
            which is the only reading the geometry allows — the row cannot move
            down by 30% of the picture without leaving it altogether. The bite
            goes from 21% of the picture's height to 15%, 29% shallower, and the
            row's top edge now sits in the last sixth of the frame instead of
            cutting the subject off where it ends.

            Two things the shallower bite must not break, and does not. The
            picture's bottom edge stays covered — the row runs 79px past it at
            1440, 118px at 1024 — so there is still no faded foot showing below
            the cards, which was the "espaço vazio" the client rejected in the
            67% build. And the step into Services is untouched by construction:
            a negative top margin shortens the flow by exactly what it lifts, so
            giving 6% of it back moves the row and everything after it down
            together. Measured before and after, the gap from the row's bottom
            to the Services eyebrow is the same 200px at 1440 and 164px at 1024.

            `relative` is load-bearing, not decoration. `MediaBand` is
            positioned (it has to be, for the gradient), and a positioned
            element paints over a static one whatever the source order says —
            without this the picture's faded foot would render on top of the
            first row of figures.

            48px of lateral inset from `lg`, and it exists for the same reason
            the bottom corners came off the picture: an overlay has to read as
            sitting *on* the photograph, and a row whose edges coincide with the
            frame's reads as a second frame butted against the first. The
            client's screenshot circles the first card's left edge landing on —
            a hair past — the picture's own. `mx-12` leaves the picture visible
            down both sides of the row at every width above the breakpoint, and
            measures 60px a side at both 1440 and 1024: 48 of inset plus the
            12px the picture itself now overshoots the container on each side
            for optical alignment. The inset is fixed rather than proportional,
            so a narrower frame simply gives back a little more of itself. It
            does not touch the overlap: `-mt-[10%]` resolves against the
            *container's* inline size, not the row's.

            One gutter at every width: 16px. Client, 2026-09-01, and it
            overrides what this comment used to argue. The rule here was that
            the gutter between two cards should never be narrower than the
            padding inside one, which is why it stepped to 32 at md alongside
            the tile's own `p-8`. The client wants the four read as one row
            rather than as four objects, and a tight gutter is what does that —
            16 is on the 8-grid, so the only thing lost is the old symmetry
            with the tile padding. Keep it in mind if the tiles ever change
            shape; do not "restore" the step. */}
        <dl className="relative mt-12 grid grid-cols-2 gap-4 lg:mx-12 lg:-mt-[10%] lg:grid-cols-4">
          {stats.map((s, i) => (
            /* The card classes ride on Reveal's own div rather than a wrapper
               inside it. `dl > div > (dt, dd)` is the one grouping level HTML5
               allows; a second div would be invalid, and Reveal already renders
               the first. Height is equal by construction — every box inside is
               fixed — so no `h-*` is needed to level the four.

               Padding steps 24 → 32 → 40, all on the 8-grid. The phone used to
               sit at 16 because "Florida" at 36px was wider than a 163px tile
               with anything more; the figure is 24px there now, so the tile can
               afford the air it always wanted. At the top end 40px is what
               keeps a 252×170 tile from reading as a label stuck to a number —
               the card lost ~40px of height when the figure box shrank, and
               padding is where that height belongs.

               Fill, no border. The tile used to carry `--card-quiet` *and* a
               hairline, which is two separations doing one job: on a section
               that now has a photograph in it, the outline is the least
               refined thing in the frame. Dropping it and stepping the fill up
               to `--card` reads quieter overall than the pair did — the edge is
               a change of surface rather than a drawn line, which is the
               system's own rule for section boundaries applied one level down.
               `--card` rather than `--card-quiet` because without the hairline
               the half step disappears against the page — see the block comment
               above for the values and the render that settled it.

               `flex-col-reverse` + `justify-end`: a `dl` wants `dt` before
               `dd` in the DOM, and the figure still paints on top, packed to
               the top edge the way block flow had it. */
            <Reveal
              key={s.label}
              delay={i * 0.08}
              className="bg-card flex flex-col-reverse justify-end rounded-lg p-6 md:p-8"
            >
              {/* Two lines' worth of box at 390 and one from md, but as a floor
                  rather than a fixed height. At 390 the 2-up grid gives the
                  label 155px and "Years of integration" wraps, so 32px is what
                  it takes; at 768 the same grid gives it a 266px text column,
                  every label fits on one line, and a second line there is
                  reserved space nothing ever occupies.

                  `min-h`, not `h` — the fixed version was written against those
                  two widths and quietly failed in between. At 1024 the grid is
                  already 4-up while the type is still at its desktop size, so
                  the text column is 130px and three of the four labels wrap
                  inside a box declared 16px tall: the second line rendered
                  outside its own box and ate half the tile's bottom padding.
                  A floor lets the box take the line it actually needs, and the
                  four tiles stay level anyway — the figures above sit in a fixed
                  box, so every label starts on the same baseline, and grid
                  stretch does the equal-height work the fixed value was
                  credited with.

                  12px above it, down from 16. The label is the figure's caption
                  and has to belong to it: at 16 against a numeral that was
                  itself floating in a 96px box, the two read as separate objects
                  stacked in a tile. Now that the box is the figure's own size,
                  12 puts the label inside the figure's proximity group and
                  leaves the tile's 40px of bottom padding as the only real gap
                  in the card — one clear pairing per tile instead of two loose
                  things. */}
              <dt className="meta mt-3 min-h-8 md:min-h-4">{s.label}</dt>
              {/* One treatment for all four figures: same face, same weight,
                  same white. The service area used to sit in orange as well as
                  a step down, which made the only non-stat the loudest tile in
                  the band; the colour is what had to go, and it went.

                  The step down came back, deliberately and for the opposite
                  reason. Held at the numerals' size the place name was the
                  loudest tile again — thirteen characters of 48px display type
                  over two lines against a single digit. Two thirds of that size
                  is what puts the two at the same optical weight, and it costs
                  the type inventory nothing: 24 and 30 are the sizes either
                  side of the numerals' own 36 and 48, all four on the 4-grid,
                  none of them new to the page.

                  600, down from 700 (client, 2026-09-01). Outfit at full bold
                  is blunt at 48px, and 600 is also what the stat-tile contract
                  asks for — a semibold value, not a bold one.

                  `tabular-nums` on the numeric tiles only, and it is the one
                  place on the site that earns it. The figure guidance is to
                  leave large standalone values proportional, because tabular
                  gives every digit the width of a `0` and a big number goes
                  loose. But these count up: measured in Outfit at 48px, `1` is
                  18.2px against `0` at 32.0px, so a proportional counter
                  running 0 → 20 shifts its own `+` sideways by up to 14px on
                  every frame. A steady 5px of extra width beats that. */}
              <dd
                className={`${FIGURE_BOX} font-display leading-none font-semibold ${
                  s.numeric ? "text-4xl lg:text-5xl" : "text-2xl lg:text-3xl"
                }`}
              >
                {s.numeric ? (
                  <Counter
                    value={s.value}
                    suffix={s.suffix}
                    className="tabular-nums"
                  />
                ) : (
                  <span className="whitespace-pre-line">{s.display}</span>
                )}
              </dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}
