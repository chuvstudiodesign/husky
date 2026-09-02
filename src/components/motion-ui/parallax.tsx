"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";

import { cn } from "@/lib/utils";

export interface ParallaxProps extends React.ComponentProps<"div"> {
  /**
   * Pixels the child drifts across the full pass through the viewport.
   * Negative moves it against the scroll, which reads as "further away".
   */
  distance?: number;
  /** Drift horizontally instead of vertically. */
  axis?: "y" | "x";
}

/**
 * Drifts its child as the block passes through the viewport.
 *
 * Parallax is easy to overdo. The rule that keeps it from looking cheap: the
 * further something is meant to feel, the *less* it should move relative to the
 * page — 40 to 80 pixels across a full pass is plenty. Anything that visibly races
 * the scroll reads as a gimmick rather than as depth.
 *
 * Scroll-linked rather than triggered, so it tracks position continuously and
 * reverses correctly when scrolling back up. Only `transform` animates.
 *
 * Reduced motion is handled in CSS, not here. The drift is an inline transform
 * written by Motion, and `useReducedMotion()` resolves to null on the server, so
 * branching on it would render an offset on the server and `none` on the client —
 * a hydration mismatch for exactly the people who asked for less motion. The
 * markup stays deterministic and `[data-parallax]` is pinned flat in globals.css.
 */
export function Parallax({
  distance = -60,
  axis = "y",
  className,
  children,
  ...props
}: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const shift = useTransform(
    scrollYProgress,
    [0, 1],
    [-distance / 2, distance / 2],
  );

  return (
    <div ref={ref} className={cn(className)} {...props}>
      <motion.div
        data-parallax=""
        style={axis === "y" ? { y: shift } : { x: shift }}
      >
        {children}
      </motion.div>
    </div>
  );
}
