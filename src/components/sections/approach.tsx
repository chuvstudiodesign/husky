import Image from "next/image";
import Link from "next/link";

import { Reveal } from "@/components/motion-ui/reveal";
import { SplitText } from "@/components/motion-ui/split-text";
import { SectionSeam } from "@/components/sections/section-seam";
import { Button } from "@/components/ui/button";

/**
 * Approach — the page's high-contrast moment and the bridge to
 * `/new-construction`.
 *
 * Site 1 inverts this block: instead of dropping to navy it rises to the brand's
 * light grey, `--brand-light` (#DFDFDF). Against a page that is otherwise near
 * black, a light band is the largest tonal jump available, and it reads as a
 * printed page set into the screen.
 *
 * Because the surface is light, every foreground token here would be wrong — they
 * are all tuned for #090A0F. A light band takes black or navy and nothing else,
 * so all three registers are navy:
 *   navy-900 on #DFDFDF … 11.7:1   (headline)
 *   navy-800 on #DFDFDF … 6.7:1    (lead, and the eyebrow)
 *
 * The eyebrow used to be husky-700, a burnt orange at ~5:1. It passed on
 * contrast and failed on the rule: the only two hues a light band carries are
 * black and navy. navy-800 rather than navy-900 keeps it a step under the
 * headline, so the label still reads as subordinate to the line it introduces.
 *
 * From `lg` the band is two columns: the text as it always was on the left, a
 * 3:2 photograph on the right. Client, 2026-09-01 — "coloca esse homem num 3:2
 * com 24px de borda, ao lado do texto" — against a 1440 screenshot where the
 * copy stopped at x=894 and the remaining ~400px of light grey did nothing. The
 * warm interior in the picture is the one thing on the page that reads as a
 * house rather than a system, and this is the band that can hold it: on #DFDFDF
 * a warm photograph sits down into the surface instead of glowing off it.
 *
 * Copy: docs/copy-home.md § 4.
 */
export function Approach() {
  return (
    <section
      id="approach"
      aria-label="Our approach"
      className="bg-brand-light relative isolate"
    >
      {/* Dark to light. The light band cuts up into the dark one instead of
          starting at a straight line — see `SectionSeam`. */}
      <SectionSeam rise="fill-brand-light" fall="fill-background" />
      <div className="section-x section-y-lg relative mx-auto max-w-7xl">
        {/* Two columns from `lg`, one below it. `gap-16` does both jobs: 64px
            between the columns on the desktop, and 64px between the button and
            the picture once the grid collapses — so the stacked case needs no
            margin of its own.

            1.2fr/1fr rather than a straight half, and the 0.2 is measured, not
            taste. Splitting 1152px evenly gives the text 544px, and the H2
            breaks to four lines at exactly 544: sweeping the column from 480 to
            800 puts the four-line band at 480–544, three lines at 560–736, and
            the original two at 752 and up. The break sits one 16px notch below
            an even split, so tilting the ratio buys a whole line of 60px
            display type for 50px of picture. 1.2fr lands the text at 593 —
            33px of headroom over the cliff, enough that a font-metric shift
            will not drop it back — and the picture at 494, which still runs
            flush to the container's right edge and still reads as the large
            block the client asked for.

            Two lines are not on the menu at any ratio: the H2 needs 752px, and
            752 + 64 of gap leaves 336 for the picture. That is a thumbnail, not
            the "ao lado do texto" the client drew.

            `items-center` survives the move to a 4:5 picture, and now barely
            does anything: at 1440 the text runs 608px and the picture 618.2px,
            so centring offsets it by 5px at each end. It stays over
            `items-start` because it degrades symmetrically — if the copy is
            ever edited or a font metric shifts, a centred picture drifts
            half as far at either end, where a top-aligned one would hang long
            at the bottom only. */}
        <div className="grid gap-16 lg:grid-cols-[1.2fr_1fr] lg:items-center">
          <div>
            <Reveal direction="up" amount={0.2}>
              <p className="eyebrow text-navy-800">Our Approach</p>
            </Reveal>

            {/* `block` is load-bearing, not decoration. SplitText renders
                `cn("inline", className)`, and on an inline box `max-width`,
                `margin-top` and `text-wrap: balance` are all inert — which is
                exactly what made this headline run 1107px on line one and drop
                "the walls close." onto a 370px line two. tailwind-merge drops
                the `inline` when a display utility follows it, so this one word
                turns the other three declarations back on.

                `lg:mt-6` is a consistency fix, not a taste call. Every other
                eyebrow-to-headline pair on this page — Services, Partners,
                About, Contact — sits at `mt-6`, and this one alone sat at
                `mt-4`. Measured at 1440 the gap here was 16px against 24px
                everywhere else, so the label read tighter to its headline in
                one band and looser in five, which is the kind of difference
                that registers as sloppiness rather than as emphasis. Scoped to
                `lg` so the stacked layout keeps the value it was reviewed at.
                20ch caps the measure a little above the balanced line (~19ch),
                so the balancer is free to even the two lines instead of being
                forced by the container. Below `lg` that cap is still what sets
                the measure; from `lg` the grid column is narrower than 20ch and
                the cap goes quiet — see the note on the two `max-w-[47ch]`
                paragraphs. */}
            <SplitText
              as="h2"
              by="word"
              className="display-2 text-navy-900 mt-4 block max-w-[20ch] text-balance lg:mt-6"
            >
              The best time to plan a smart home is before the walls close.
            </SplitText>

            <Reveal direction="up" delay={0.1} amount={0.2}>
              {/* The body measure is still derived from the headline rather
                  than chosen on its own — what changed is the target. It used
                  to be three quarters of the headline block, which nested the
                  body visibly inside it; the client wants the two right edges
                  to line up instead, so the body reaches the headline's own
                  rag.

                  Measured before the photograph landed: the balanced H2's two
                  lines ended at x=872 and x=894, the column started at x=144,
                  so 894 − 144 = 750px. The lead renders at 24px, where 1ch of
                  Geist is 15.91px, so 47ch is 748px and landed the box 2px
                  inside the longer headline line.

                  Both caps survive the two-column split, and from `lg` neither
                  one is doing the work any more: the grid column is 593px at
                  1440, narrower than 20ch (786px) and narrower than 47ch
                  (748px), so the column sets the measure and the caps sit
                  slack behind it. 593px of 24px Geist is 37ch, about 60
                  characters — a shorter line than the 47ch it replaces and a
                  better one. They are kept because below `lg` the section is
                  one full-width column again and they are the only thing
                  standing between this copy and a 1152px line. Right edges
                  still line up there, which is what they were for. */}
              <div className="mt-12 flex flex-col gap-6">
                <p className="lead text-navy-800 max-w-[47ch]">
                  Technology is infrastructure now. It belongs in the drawings
                  alongside plumbing and electrical, not added after the drywall
                  is up, at three times the cost and half the result.
                </p>
                <p className="lead text-navy-800 max-w-[47ch]">
                  If you&rsquo;re building or renovating, bring us in while the
                  plan is still on paper.
                </p>
              </div>

              <div className="mt-12">
                {/* `text-white` is not decoration: the default variant now
                    ships a `text-brand-black` label, which is correct on its
                    own orange fill and unreadable on this navy one. Override
                    the fill, override the label. White on navy-900 measures
                    15.6:1. */}
                <Button
                  asChild
                  size="lg"
                  className="bg-navy-900 hover:bg-navy-800 text-white"
                >
                  <Link href="/new-construction">How We Plan</Link>
                </Button>
              </div>
            </Reveal>
          </div>

          {/* Delay 0.2 continues the column's own stagger — eyebrow at 0, body
              at 0.1 — so the picture arrives last rather than as a separate
              event beside it. */}
          <Reveal direction="up" delay={0.2} amount={0.2}>
            {/* rounded-[24px] is the documented photographic exception to
                Rule 03: client mandate 2026-09-01, 24 is on the client's own
                4/8 grid, and it applies to photographic blocks only. This is
                now the ONLY place it survives — the map image in `MediaBand`
                went back to 4px on a later client order (2026-09-01). Rule 03's
                4px ceiling still governs every piece of system chrome in this
                section — the button beside it included, which measures 4px.

                Two ratios, because the two layouts are different pictures.

                From `lg` the box is 4:5. Client, 2026-09-01 — "melhora o
                encaixe da imagem, talvez mudando de 3:2 pra 2:3, ou 4:5" —
                against a 1440 screenshot where a 494.5 x 329.7 landscape sat
                squat beside a 608px text column and left ~280px of bare light
                grey. Both candidates were rendered and measured at 1440 before
                this one was picked:

                  3:2 … 494.5 x 329.7   text - 278.3   squat, the complaint
                  4:5 … 494.5 x 618.2   text +  10.2   ← shipped
                  2:3 … 494.5 x 741.8   text + 133.8   overshoots

                4:5 lands 10px over a 608px text column — 1.7%, near-matched
                rather than flush, which is what the client asked the picture to
                do: hold the right column the way the text holds the left. It
                also falls out of the *existing* 1.2fr/1fr split, so the measured
                column sweep in the note above stands untouched and the H2 stays
                at three lines. 2:3 would need the image column cut to ~405px to
                match the same height, which re-wraps both columns and re-opens
                a ratio that was settled by measurement.

                2:3 loses on the crop as well. The source is 3072x2048 and the
                man sits right of centre, so a portrait box crops width only
                (full height is always kept — his hair clears the top edge by
                ~2% in the original, and nothing here touches that). 4:5 keeps a
                53.3%-wide window of the source, 2:3 only 44.4%, and at 44.4%
                the right of his hair is cut by the frame.

                `object-[56%_50%]` is where that window sits, and 56 is measured
                too. The subject runs from the phone's left edge at 32.5% of the
                source to the right of his hair at 72.8%; centring that 40.3%
                span inside a 53.3% window puts the window's left edge at 26.0%,
                which is 56% of the 46.7% of travel `object-position` has. At 50%
                his hair nearly grazes the right edge; at 62% the phone crowds
                the left. 56 leaves ~12% of margin on both sides and trims the
                bright grey wall in the top-left corner, the one thing in frame
                that competes with his face. The vertical half is inert at 4:5
                and below — nothing is ever cropped vertically — and is written
                out only so the pair reads as a coordinate.

                Below `lg` the box goes back to 3:2, and not as a fallback. The
                stacked layout is one full-width column: at 1023 a 4:5 box would
                be 920 x 1150, a whole screen of one photograph, and at 390 it
                would run 342 x 428. A full-bleed portrait is a phone-app
                pattern; a band is what this section is. 3:2 gives 920 x 614 and
                342 x 228 instead. It also costs nothing to serve — see `sizes`
                — and `object-position` is a no-op there, because a 3:2 window on
                a 3:2 source crops nothing at all.

                `sizes` has to describe the *height* demand, not the slot width,
                and this is the trap in a portrait box fed by a landscape file.
                next/image serves the whole frame scaled, never a crop, so
                covering 618px of box height out of a 3:2 source needs 618 x 1.5
                = 927px of intrinsic width — nearly twice the 494.5px slot. The
                old `512px` would have handed a 640w file (640 x 427) to a 618px
                box and upscaled it 1.45x. `928px` picks the 1080w webp instead
                (1080 x 720 into 494.5 x 618.2, a 1.17x downscale). 928 is the
                maximum across the whole two-column range: at exactly 1024 the
                slot is only 389.8 x 487.3 and needs 731.

                Below `lg` the ratio matches the source, so height stops driving
                anything and plain `100vw` is exact again — which is the second
                reason 3:2 stays there. No `priority`: fourth band down, well
                under the fold at both ends of the range. */}
            <div className="relative aspect-[3/2] overflow-hidden rounded-[24px] lg:aspect-[4/5]">
              <Image
                src="/photos/approach-portrait.jpg"
                alt="A smiling man sitting back on a sofa in warm interior light, looking down at the phone in his hand."
                fill
                sizes="(min-width: 1024px) 928px, 100vw"
                className="object-cover object-[56%_50%]"
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
