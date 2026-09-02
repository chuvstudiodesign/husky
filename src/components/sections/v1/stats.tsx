import { Counter } from "@/components/motion-ui/counter";
import { Reveal } from "@/components/motion-ui/reveal";

const stats = [
  // Service area leads: the territory qualifies the visitor before the tenure
  // impresses them, and a named place reads warmer than a figure.
  {
    display: "South Florida",
    label: "Service area",
    numeric: false,
  },
  {
    value: 20,
    suffix: "+",
    label: "Years of integration",
    numeric: true,
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

/* Every figure sits in the same fixed box, bottom-aligned. Two consequences: the
   four labels below line up across rows whatever the figure does, and the tiles
   are equal height by construction rather than by a second height class.

   The box is as tall as the tallest value at that width, and no taller:

     base   2 × 36px = 72   the 2-up grid is 148–163px wide and "South Florida"
                            takes two lines at 36px
     md     1 × 36px = 36   still 2-up, but the tile is 330px and the same value
                            fits on one line
     lg     2 × 48px = 96   4-up at 258px, and 48px type puts it back on two

   The md step is the one that was missing. The box held two lines from 360 all
   the way to 1024, so a tablet tile carried a whole empty 36px line above every
   figure — the file already made this argument for the label below and then
   drew the line at lg for the figure. Bottom-aligned throughout, so all four
   figures sit on one baseline and the labels stay level whatever the value
   does. */
const FIGURE_BOX = "flex h-18 items-end md:h-9 lg:h-24";

/**
 * The credibility band. Sits directly under the hero on the same surface, with
 * nothing but the hero's own bottom padding between them — so it reads as a
 * footnote to the headline rather than as a new section competing with it.
 *
 * Nothing here is ruled. The tiles are separated by the grid gap and the band by
 * its padding: the ruled table this used to be put a second separator on every
 * boundary, and the inner `px-6` pushed the first figure off the page's left
 * edge. The last hairline, a `border-t` on the section, came off with the rest.
 *
 * **The surface is `--card-quiet` (#0D0F16), not `--card`.** A footnote should
 * not carry the same weight of fill as the showcase cards further down; at full
 * `--card` the four tiles read as a second row of panels competing with the
 * hero directly above. Three values were rendered at 1440 and looked at:
 * #11131C was too present, plain `--background` with only the border left the
 * tiles as outlines with nothing inside them, and the half step between the two
 * still reads as a surface while staying out of the hero's way. Client call,
 * 2026-09-01. Contrast on it is better than on `--card`, not worse: white
 * numerals 19.1:1, mono labels 6.8:1.
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
        {/* One gutter, not two: with the tiles carrying a fill and an outline
            the old 32/48 split read as two different grids. 16px on the phone
            and 32px from md, both on the 8-grid — and it steps at md rather
            than lg because the tile padding does, and the gutter between two
            cards has to stay at least as wide as the gutter inside one or the
            grid reads as a slab. */}
        <dl className="grid grid-cols-2 gap-4 md:gap-8 lg:grid-cols-4">
          {stats.map((s, i) => (
            /* The card classes ride on Reveal's own div rather than a wrapper
               inside it. `dl > div > (dt, dd)` is the one grouping level HTML5
               allows; a second div would be invalid, and Reveal already renders
               the first. Height is equal by construction — every box inside is
               fixed — so no `h-*` is needed to level the four.

               32px of padding from md, 16px on the phone: at 390 the 2-up grid
               gives each card 163px, and 32px a side would leave "Florida" at
               36px more narrow than the word. At 768 the same 2-up grid gives
               it 330px, where 16px read as no gutter at all against a tile that
               size — the phone figure was being held two breakpoints past the
               phone. */
            <Reveal
              key={s.label}
              delay={i * 0.08}
              className="bg-card-quiet border-border rounded-lg border p-4 md:p-8"
            >
              {/* One treatment for all four figures, numeric or not: same size,
                  same weight, same white. The service area used to sit a step
                  down and in orange, which made the only non-stat the loudest
                  tile in the band and put a 30px step in the page's type
                  inventory that nothing else used.

                  600, down from 700 (client, 2026-09-01). Outfit at full bold
                  is blunt at 48px, and 600 is also what the stat-tile contract
                  asks for — a semibold value, not a bold one. Size unchanged.

                  `tabular-nums` on the numeric tiles only, and it is the one
                  place on the site that earns it. The figure guidance is to
                  leave large standalone values proportional, because tabular
                  gives every digit the width of a `0` and a big number goes
                  loose. But these count up: measured in Outfit at 48px, `1` is
                  18.2px against `0` at 32.0px, so a proportional counter
                  running 0 → 20 shifts its own `+` sideways by up to 14px on
                  every frame. A steady 5px of extra width beats that. */}
              <dd
                className={`${FIGURE_BOX} font-display text-4xl leading-none font-semibold lg:text-5xl`}
              >
                {s.numeric ? (
                  <Counter
                    value={s.value}
                    suffix={s.suffix}
                    className="tabular-nums"
                  />
                ) : (
                  <span>{s.display}</span>
                )}
              </dd>
              {/* h-8 = two lines. At 390px the 2-up grid gives the label 155px,
                  and "Years of integration" wraps — without the fixed box that
                  one tile came out 16px taller than its neighbours. From md the
                  tile is 266px of text column and the longest label measures
                  ~164px, so every one of them fits on a single line and the
                  second line becomes reserved space nothing ever occupies. The
                  drop was written for lg; the labels stop wrapping at md. */}
              <dt className="meta mt-4 h-8 md:h-4">{s.label}</dt>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}
