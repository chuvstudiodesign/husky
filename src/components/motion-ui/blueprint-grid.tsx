import { cn } from "@/lib/utils";
import { DotPattern } from "@/components/ui/dot-pattern";

/**
 * The entrance: nothing at the section's top edge, full texture by a third of
 * the way down.
 *
 * The stop is a percentage rather than a length on purpose. A fade has to be
 * read against the thing it is fading into, and the section is roughly twice as
 * tall on a phone as it is at 1440 — a fixed 240px would be a third of the way
 * down at one width and a tenth at the other, which is two different effects
 * wearing the same number. A third of the section is a third of the section
 * everywhere, and it sidesteps the 8-grid question entirely: there is no px
 * value here to be off the grid.
 */
const FADE_IN = "linear-gradient(to bottom, transparent 0, #000 30%)";

/**
 * A drafting-paper dot grid behind one section.
 *
 * The brand's real product is planning — the argument the site makes is that
 * the technology belongs in the drawings, next to plumbing and electrical. So
 * one section sits on the paper the drawing would be made on. Dots, not lines:
 * a dot grid is the setting-out sheet, it carries no direction of its own, and
 * at a 100px pitch it gives the section a measure without giving it a pattern.
 * It is texture. If you notice it, it is too strong.
 *
 * This is `ui/dot-pattern` with the Husky settings on it and nothing else: the
 * pitch, the dot size, the token, and the reveal. Every one of those four
 * numbers was arrived at by measuring a render rather than by taste, so they
 * live here as one named configuration instead of being retyped at each call
 * site.
 *
 * **Mounting — the host section needs `relative isolate`, and both words do
 * work.** `isolate` is not decoration here and removing it does not degrade
 * the layer, it deletes it:
 *
 *     <section className="bg-background relative isolate">
 *       <BlueprintGrid />
 *       …
 *     </section>
 *
 * The layer sits at `-z-10`. Inside a stacking context the paint order is the
 * context element's own background first, negative-z children second, all
 * in-flow content third — so the dots land above the section's `bg-background`
 * and below every word, card and border in it, which is exactly where a sheet
 * of paper goes. `isolate` is what makes the section that stacking context.
 * Without it the section is merely positioned, `-z-10` resolves against the
 * root instead, and the dots paint behind the section's own opaque background
 * where nobody will ever see them.
 *
 * **Why not `mix-blend-mode: lighten`,** which would have made the paint order
 * irrelevant and needed no `isolate`: it costs the section its text rendering.
 * A blended child forces its parent into a composited layer, and a composited
 * layer on Windows loses subpixel antialiasing — measured, not guessed. Two
 * renders of the same page, one with the blended layer and one without, differ
 * on 35,057 pixels, and the differing pixels are glyph edges: LCD fringes
 * (#11A6DB, #FFDAA8) in one, grey (#A5A4A8, #D8D8DA) in the other. That is one
 * section of the page rendering its type differently from every other section,
 * which is a real defect traded for a convenience. Paint order is free.
 *
 * **The entrance.** A linear-gradient mask on the same SVG takes the layer from
 * nothing at the top edge to full texture a third of the way down, so the paper
 * appears under the section rather than starting at a ruled line. See
 * `FADE_IN`. No second element, no JS, no scroll listener — it is a mask on a
 * layer that was already there.
 *
 * **Cost.** One element, one `<pattern>`, one mask. No image request, no
 * canvas, no scroll listener, no JS: `DotPattern` takes its id as a prop rather
 * than from `useId`, which is what keeps both it and this a server component.
 *
 * **Pitch.** 100px at every breakpoint, on the 4-grid, and deliberately not
 * responsive. A dot grid has no line to get coarse: the phone simply shows
 * fewer dots at the same size, which is what a smaller sheet of the same paper
 * looks like. Rescaling it per breakpoint would be inventing a problem.
 */
export function BlueprintGrid({
  className,
  style,
  ...props
}: React.ComponentProps<typeof DotPattern>) {
  return (
    <DotPattern
      // A 100 cell with the dot at its centre and r=1, so the disc is 2px and
      // the tiling is the 100px pitch the pixel measurements were taken on.
      width={100}
      height={100}
      cx={50}
      cy={50}
      cr={1}
      id="blueprint-dots"
      data-blueprint-grid=""
      className={cn("-z-10 fill-[var(--blueprint-dot)]", className)}
      style={{
        // Black is the mask's alpha channel, not a colour: opaque means show.
        // The -webkit- pair is not decoration either — Chrome only dropped the
        // prefix at 120, and an unmasked layer would start at a hard edge,
        // which is the whole thing this removes.
        WebkitMaskImage: FADE_IN,
        maskImage: FADE_IN,
        ...style,
      }}
      {...props}
    />
  );
}
