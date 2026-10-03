import { CableSegment } from "@/components/motion-ui/cable-segment";
import type { CSSProperties } from "react";

import {
  MARK_BOX,
  MARK_PATHS,
  MARK_VIEWBOX,
} from "@/components/motion-ui/husky-mark-paths";
import { AboutScene } from "@/components/sections/creative-2/about-scene";
import { ABOUT } from "@/components/sections/creative-2/content";

/** The drawn mark sits 14.58 units inside the viewBox on each side (measured with
 *  getBBox). As a share of the rendered width, it's what the SVG must shift so the
 *  stroke — not the empty viewBox margin — lines up with the column edge. */
const MARK_INSET_X = 14.58;
const markInset = {
  "--mark-inset": `${(MARK_INSET_X / MARK_BOX.width) * 100}%`,
} as CSSProperties;

/** The mark as a single 1px line. Two layers: the /40 base, and a /72 layer that
 *  the scene fades in over the last tenth of the draw. Static: /40, fully drawn. */
function MarkOutline({
  className,
  style,
}: {
  className?: string;
  style?: CSSProperties;
}) {
  const paths = (
    <>
      {MARK_PATHS.map((d) => (
        <path key={d} d={d} vectorEffect="non-scaling-stroke" strokeWidth={1} />
      ))}
    </>
  );
  return (
    <svg
      data-about-mark=""
      viewBox={MARK_VIEWBOX}
      fill="none"
      aria-hidden="true"
      focusable="false"
      className={className}
      style={style}
    >
      <g className="stroke-foreground/40">{paths}</g>
      <g data-bright="" className="stroke-foreground/72 opacity-0">
        {paths}
      </g>
    </svg>
  );
}

/**
 * Creative 2 — 7. About `#about`. A reading room: the paragraphs light word by
 * word at reading pace while the mark draws itself in one 1px line beside them.
 * Spec: `docs/creative-versions.md` §7.
 *
 * ≥768: a 12-column grid. Columns 1–5 are a CSS-sticky column (no GSAP pin) with
 * the eyebrow, the H2 and the outline mark; columns 7–12 hold the paragraphs.
 * <768: one column. The sticky wrapper becomes `display: contents`, so the mark
 * can drop to the end of the section with `order-last`, right-aligned at 56vw.
 */
export function About() {
  return (
    <section
      id="about"
      aria-labelledby="about-title"
      className="group section-x section-y-lg relative"
    >
      <CableSegment />
      <AboutScene className="flex flex-col md:grid md:grid-cols-12 md:gap-x-12">
        <div className="contents md:sticky md:top-[20vh] md:col-span-5 md:block md:self-start">
          <p className="eyebrow text-muted-foreground transition-colors duration-250 ease-[cubic-bezier(0.16,1,0.3,1)] group-data-[powered]:text-foreground motion-reduce:transition-none">
            {ABOUT.eyebrow}
          </p>
          <h2 id="about-title" className="display-2 text-foreground mt-6">
            {ABOUT.h2}
          </h2>
          {/* 24vh keeps the sticky column shorter than the copy, so it pins. The
              inset shift aligns the stroke to the H2's left edge (phone: the
              column's right edge). */}
          <MarkOutline
            style={markInset}
            className="order-last mt-16 ml-auto block h-auto w-[56vw] translate-x-(--mark-inset) md:order-none md:mt-12 md:ml-0 md:h-[24vh] md:w-auto md:-translate-x-(--mark-inset)"
          />
        </div>

        <div
          data-about-copy=""
          className="mt-12 flex flex-col gap-12 md:col-span-6 md:col-start-7 md:mt-0"
        >
          {ABOUT.body.map(({ text, verify }) => (
            // [VERIFY] retained: the first paragraph's "over 20 years" awaits
            // client confirmation (copy-home.md). Flagged, not removed.
            <p
              key={text}
              data-verify={verify ? "" : undefined}
              className="lead max-w-[40ch]"
            >
              <span className="sr-only">{text}</span>
              <span data-about-split="" aria-hidden="true" className="block">
                {text}
              </span>
            </p>
          ))}
        </div>
      </AboutScene>
    </section>
  );
}
