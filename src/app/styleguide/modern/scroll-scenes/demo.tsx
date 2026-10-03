"use client";

import { useRef } from "react";

import { SCRUB, gsap } from "@/components/motion-ui/gsap-setup";
import {
  MARK_CHIN,
  MARK_PATHS,
  MARK_VIEWBOX,
} from "@/components/motion-ui/husky-mark-paths";
import { useScrollScene } from "@/components/motion-ui/use-scroll-scene";

/** Draws the mark outline with DrawSVG, scrubbed, and reports which branch built. */
export function MarkDrawDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const branchRef = useRef<HTMLSpanElement>(null);

  useScrollScene(ref, {
    desktop: ({ branch }) => draw(branch),
    mobile: ({ branch }) => draw(branch),
  });

  function draw(branch: string) {
    if (branchRef.current) branchRef.current.textContent = branch;
    gsap
      .timeline({
        scrollTrigger: {
          trigger: ref.current,
          start: "top 80%",
          end: "bottom 40%",
          scrub: SCRUB,
        },
      })
      .fromTo("[data-mark-path]", { drawSVG: "0%" }, { drawSVG: "100%", ease: "none" })
      .fromTo("[data-mark-chin]", { opacity: 0 }, { opacity: 1, ease: "none" }, ">-0.2");
    return () => {
      if (branchRef.current) branchRef.current.textContent = "static";
    };
  }

  return (
    <div ref={ref} className="flex w-full items-end justify-between gap-8">
      <svg
        viewBox={MARK_VIEWBOX}
        className="text-foreground/40 h-80 w-auto"
        aria-hidden="true"
      >
        {MARK_PATHS.map((d) => (
          <path
            key={d}
            data-mark-path=""
            d={d}
            fill="none"
            stroke="currentColor"
            strokeWidth={1}
            vectorEffect="non-scaling-stroke"
          />
        ))}
        <rect
          data-mark-chin=""
          x={MARK_CHIN.x - 4}
          y={MARK_CHIN.y - 4}
          width={8}
          height={8}
          className="fill-primary"
        />
      </svg>
      <p className="meta text-muted-foreground">
        Branch: <span ref={branchRef}>static</span>
      </p>
    </div>
  );
}
