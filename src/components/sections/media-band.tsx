import Image from "next/image";

/**
 * The map-in-hand photograph, in the stats block. Client redesign, 2026-09-01,
 * and it is two compositions rather than one:
 *
 *   · **From `lg`** it is the backdrop the four figures stand on. The picture
 *     runs full width of the block, a gradient dissolves its foot into the page
 *     background, and `stats.tsx` lifts the card row onto it.
 *   · **Below `lg`** it is a plain rounded block: whole picture, no gradient,
 *     nothing on top of it, the four cards in their own 2×2 grid underneath.
 *     Client's explicit call — on a phone the overlay reads as a smudge with
 *     boxes on it, because the card stack is two rows deep and taller than the
 *     picture it is meant to sit on.
 *
 * `lg` is the switch because that is where the grid becomes a single row. The
 * overlay composition needs the cards to be one band across the picture's foot;
 * at `md` they are still 2×2 and 420px tall against a 461px picture, which is
 * the same failure as the phone with more room to be wrong in.
 *
 * **In flow, not an absolute `-z-10` layer.** The obvious build is the one
 * `BlueprintGrid` uses in Services — `relative isolate` on the section, the
 * picture pinned behind it — and it is the wrong tool here. That grid is a
 * texture with no size of its own; this is a 3:2 photograph, so an absolute
 * layer would have to be told how tall it is at every width, and the answer
 * changes with the card stack under it. Left in flow the picture keeps its own
 * aspect, the section's height falls out of it, and one negative margin decides
 * the overlap. Being in flow is also what makes the mobile split free: there is
 * nothing to unpin, the cards simply stop being pulled up.
 *
 * `priority`, which the first version of this file deliberately did not have.
 * The picture used to sit under the fold; it is now in the first viewport at
 * both ends of the range — 136px of it at 1440×900, about two thirds of it at
 * 390×844 — and an eager fetch is the honest answer to that. It is ~49KB of
 * webp at the desktop size, not the 4MB source.
 */
export function MediaBand() {
  return (
    // `rounded-md` — 4px, the plain Rule 03 ceiling, at every width and on
    // every corner the shape still has. This picture used to run at
    // `rounded-[24px]` as a documented exception to that ceiling; client,
    // 2026-09-01, "ajusta o border radius pra 4px", with the top corners
    // circled. The exception is withdrawn HERE and only here — `approach.tsx`
    // still carries 24 on the portrait, and that one has not been revisited.
    // Do not reintroduce 24 in this file to "match" it.
    //
    // `-mx-3` from `lg`: the picture overshoots the page's text axis by 12px on
    // each side. Client, 2026-09-01, with the alignment guide drawn down the
    // hero's left edge — "a imagem precisa exceder 8px ou 12px a linha azul de
    // alinhamento. Por conta do alinhamento óptico."
    //
    // Optical alignment is a real correction, not a fudge. A large pale block
    // and a hard-edged glyph do not read as aligned when their bounding boxes
    // are: against a near-black page the picture's light flank retreats, and
    // the eye puts its edge somewhere inside the frame. Both values the client
    // offered were rendered at 1440 and looked at. At 8 the correction is
    // legible only if you know to look for it; at 12 the block sits ON the axis
    // instead of behind it. The text axis itself does not move: the negative
    // margin is on the picture alone, so the hero, the copy and the card row
    // keep the container's own padding, and this stays a 12px correction rather
    // than a wider content column.
    //
    // The 12 predates the radius change and survives it. It was originally
    // argued as half of a 24px corner, which is the usual compensation for a
    // rounded block; the corner is 4px now and that derivation is gone, but the
    // number was chosen by looking at both options on the page rather than by
    // the arithmetic, and what it corrects for — a bright rectangle receding
    // against a black page — is unchanged. Re-rendered at 1440 after the radius
    // dropped and it still reads aligned. Do not recompute it from the radius.
    //
    // It cannot overflow. `section-x` is `clamp(1.5rem, 5vw, 4rem)`, so at the
    // `lg` breakpoint and above the container's own padding is never under
    // 51.2px — the picture eats 12 of it and leaves the rest. Below `lg` the
    // margin is not applied at all, which is what keeps the picture and the
    // card grid on the identical 24px gutters the phone layout is built on.
    //
    // The bottom corners come off at `lg`, and that is defect repair rather
    // than taste. Once the picture is a backdrop its bottom edge has to not
    // exist, and any arc against the page is an edge: the client's screenshot
    // showed the old 24px one as a notch clipped out of the dark below the
    // cards. 4px is a smaller notch and still a notch, so the rule stands.
    // Below `lg` the picture is a block rather than a backdrop and all four
    // corners are correct.
    <div className="relative overflow-hidden rounded-md lg:-mx-3 lg:rounded-b-none">
      <Image
        src="/photos/map-in-hand.jpg"
        alt="A hand holding a phone that shows a dark street map with several zones highlighted in orange, against a plain light grey studio backdrop."
        width={3072}
        height={2048}
        sizes="(min-width: 1280px) 1152px, 100vw"
        priority
        className="h-auto w-full"
      />
      {/* The fade, `lg` and up only.

          It ends where it always ended: solid `--background` at 92% of the
          picture's height, above the frame's own bottom edge. The last stop has
          to land above that edge or the edge shows — the studio backdrop is
          bright, so even 2% of it left over reads as a large flat block three
          levels lighter than the page, with a rounded corner on it.

          What changed is the beginning. Client, 2026-09-01: "ajusta o degradê
          pra ficar ainda mais suave", against a 1440 screenshot with a
          horizontal line drawn across the middle of the picture. That line was
          real and it was the gradient's onset. A two-stop linear ramp is
          continuous in value but not in slope: alpha goes from flat nothing to
          climbing at 1.2%/10px in a single row of pixels, and lateral
          inhibition in the eye turns that kink into a visible edge — a Mach
          band. Across a bright, near-flat studio backdrop there is nothing else
          for the eye to look at, so it looks at the kink.

          The fix is to kill the slope discontinuity, not to move it. The layer
          is two thirds of the picture instead of a half, so it opens at 33% of
          the frame rather than at 50%, and the stops trace an S: barely 6% of
          background after a quarter of the ramp, past halfway before it crosses
          50%, then the steep part in the last third where it is riding on the
          picture's own dark foot and has cover. Both ends are flat, so there is
          no row of pixels where the rate of change jumps.

          Five stops, and Tailwind's gradient utilities carry one `via`. This is
          the one place on the site that needs more than that, and an inline
          `background-image` is the honest way to write it — every colour in it
          is `var(--background)`, thinned with `color-mix` rather than hand-mixed,
          so it stays a token and stays theme-reactive. Do not convert it to
          hex to shorten it.

          At the card row — 79% of the picture, 68% of this layer — the ramp is
          about 60% closed, which is what the row wants: the tiles are opaque, so
          the number that matters is the 48px strip of picture left showing down
          each side of them, and it has to read as the picture dissolving rather
          than as a bright sliver beside a dark box.

          **Two rewrites were tried on 2026-09-01 and both came back.** Recorded
          so neither gets proposed a third time. The first followed a Figma fill
          panel literally: the same two-stop ramp, transparent to solid over
          0–65%, stacked three times. Three identical layers composite to
          `1 − (1 − a)³`, which front-loads hard — measured off the build at
          1440, 39% closed a tenth of the way down the frame and 94% by the 40%
          mark. The hand and the phone were gone. Client: "ficou muito forte,
          reverte". The second kept that 40/65 geometry but used a smoothstep
          between the two, which is band-free on the numbers — largest
          single-row step 4/255, longest repeated value 4 rows — and still puts
          the picture's whole lower third under solid `--background`. Also too
          strong. The lesson both times is the same: the client wants the
          photograph to survive the fade, so the ramp stays long, stays late,
          and finishes at the foot rather than at the midriff. */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 hidden h-2/3 lg:block"
        style={{
          backgroundImage: `linear-gradient(to bottom,
            color-mix(in oklab, var(--background) 0%, transparent) 0%,
            color-mix(in oklab, var(--background) 6%, transparent) 25%,
            color-mix(in oklab, var(--background) 22%, transparent) 45%,
            color-mix(in oklab, var(--background) 48%, transparent) 62%,
            color-mix(in oklab, var(--background) 74%, transparent) 75%,
            color-mix(in oklab, var(--background) 93%, transparent) 84%,
            var(--background) 88%)`,
        }}
      />
    </div>
  );
}
