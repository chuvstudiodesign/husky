import { cn } from "@/lib/utils";

/* The seam is drawn in a 1440 × 80 coordinate space and stretched to whatever
   width it lands in, so the two blocks stay the same fraction of the boundary
   at every viewport. The boundary itself is y = 40, halfway down: everything
   above it belongs to the section that is ending, everything below to the one
   beginning.

   Left block, 420 wide at its base and 380 across its crown, flush to the page
   edge and slanted only on its inner side — one half of a hexagon, cut by the
   viewport. Right block is the same shape rotated 180°. Between x = 420 and
   x = 1020 the boundary is a plain straight line, which is what keeps the two
   blocks reading as blocks: a shape needs a flat edge next to it to be a shape
   at all.

   Proportions at 1440: 420 units is 420px and the 40-unit slant is a 45° cut.
   The height does not scale with the width — 40px above the line and 40 below,
   on the 8-grid, because a seam that grew with the viewport would be a 150px
   canyon on a desktop.

   Each block runs 2 units past the boundary into the band of its own colour.
   The path edge and the section edge used to sit on the same line, and when
   that line fell on a fractional pixel — smooth scroll transforms, 2x tablets —
   both painted the row at half coverage and the band behind showed through as
   a hairline along the block's base. Overlapping by 2 units (2px on a desktop,
   1.2px on a phone) puts the join inside a solid fill, where nothing can
   show. */
const RISE = "M0 42V0h380l40 40v2z";
const FALL = "M1440 38v42h-380l-40-40v-2z";

/* Below `md`, the same two blocks drawn for the width they actually land in.
   Stretched into a 390px viewport the desktop geometry compresses its 40-unit
   slant to 11px against a 40px drop — a 75° cliff — and two near-vertical
   cliffs in an 80px strip stop reading as interlocking blocks and start reading
   as a glitch. This pair is the same shape sized for the phone: the strip is 48px
   tall rather than 80 (24 above the line, 24 below, still on the 8-grid), and
   the run is 88 units, which at 390 is 24px against a 24px drop — the 45° cut
   the desktop seam has at 1440, on both pieces. Blocks come out 119px wide
   each, leaving 151px of straight boundary between them, so the two pieces are
   plainly two pieces.

   The numbers look odd because they are written in the desktop's coordinate
   space and read at the phone's width: the viewBox is shared, so the only way
   to change the drawing across a breakpoint in CSS alone is to swap the paths
   inside it. Same trade the file already makes — one unit is one pixel at one
   width only. */
const RISE_SM = "M0 42V0h352l88 40v2z";
const FALL_SM = "M1440 38v42h-352l-88-40v-2z";

export interface SectionSeamProps
  extends Omit<React.ComponentProps<"svg">, "className"> {
  /** Incoming section's own background, as a `fill-*` utility. Rises on the left. */
  rise: string;
  /** Outgoing section's background, as a `fill-*` utility. Descends on the right. */
  fall: string;
  className?: string;
}

/**
 * The shaped edge between two bands of different colour.
 *
 * Where the background changes — dark to light, light to dark, dark to orange —
 * the two bands do not meet on a straight line the whole way across. At the
 * left edge the incoming colour rises into the band above it as one wide half
 * hexagon; at the right edge the outgoing colour descends into the band below
 * by the same shape. The middle stays straight. Two blocks, offset, fitting
 * into each other — the client's sketch, 2026-09-01.
 *
 * An earlier pass repeated a small tooth across the whole width. Rendered, ten
 * to fifteen of them read as a saw edge rather than as a joint, which is the
 * opposite of the point: interlocking is legible when there are two pieces, not
 * when there is a texture.
 *
 * This is a section edge, not a divider. Rule 04's fourth clause bans the
 * hairline between sections, and it bans it because a rule draws a third thing
 * between two surfaces; the seam draws nothing of its own. It is the surface
 * change, given a shape. Nothing appears at a boundary where the colour does
 * not change.
 *
 * **Mounting.** First child of the *incoming* section, which needs `relative`.
 * The strip straddles the boundary — 40px up into the section above and 40px
 * down into this one on a desktop, 24 and 24 on a phone — so it is offset by
 * its own half height:
 *
 *     <section className="bg-brand-light relative">
 *       <SectionSeam rise="fill-brand-light" fall="fill-background" />
 *       …
 *
 * `rise` is always this section's own background token and `fall` is always the
 * one above it, both as `fill-*` utilities, so the seam cannot drift out of
 * sync with either band.
 *
 * Absolute rather than the negative margin the brief suggested, for one reason:
 * a negative `margin-top` on a section's first in-flow child collapses through
 * the section itself, so the whole band — opaque background and all — would
 * move up and paint a straight edge over the shape. Out of flow, the seam costs
 * the page zero layout: no shift, nothing to keep on the grid because nothing
 * moved. What it takes from each side — 40px at desktop, 24px on a phone, where
 * the bands are tighter — is section padding, which is 80px at its very
 * narrowest, so it never lands on type.
 *
 * **Cost.** One element, four paths of which two are `display: none` at any
 * width, no ids to collide with the next seam on the same page, no JS. Static
 * by construction, so reduced motion has nothing to honour.
 */
export function SectionSeam({
  rise,
  fall,
  className,
  ...props
}: SectionSeamProps) {
  return (
    <svg
      aria-hidden
      focusable="false"
      data-section-seam=""
      viewBox="0 0 1440 80"
      preserveAspectRatio="none"
      className={cn(
        "pointer-events-none absolute inset-x-0 block w-full",
        /* Half the strip on a phone, and half the offset with it: the seam
           still straddles the boundary by exactly its own half height. */
        "-top-6 h-12 md:-top-10 md:h-20",
        className,
      )}
      {...props}
    >
      <path d={RISE_SM} className={cn("md:hidden", rise)} />
      <path d={FALL_SM} className={cn("md:hidden", fall)} />
      <path d={RISE} className={cn("hidden md:block", rise)} />
      <path d={FALL} className={cn("hidden md:block", fall)} />
    </svg>
  );
}
