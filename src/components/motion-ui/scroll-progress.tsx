"use client";

import { motion, useScroll } from "motion/react";

import { cn } from "@/lib/utils";

/**
 * A hairline bar pinned to the top of the viewport that tracks how far the page has
 * been read.
 *
 * Bound straight to `scrollYProgress`, no spring. A spring keeps moving after the
 * scroll has stopped, and a motion value is outside the reach of `MotionConfig`
 * and the CSS pins, so it was the one thing still animating under reduced motion.
 * Progress is linear anyway. Decorative and hidden from assistive technology; the
 * same information is already in the scrollbar.
 */
export function ScrollProgress({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { scrollYProgress: scaleX } = useScroll();

  return (
    <div
      aria-hidden
      className={cn("fixed inset-x-0 top-0 z-50 h-px", className)}
      {...props}
    >
      <motion.div
        style={{ scaleX }}
        className="bg-primary h-full w-full origin-left"
      />
    </div>
  );
}
