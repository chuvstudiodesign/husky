"use client";

import { motion, useScroll, useSpring } from "motion/react";

import { cn } from "@/lib/utils";

/**
 * A hairline bar pinned to the top of the viewport that tracks how far the page has
 * been read.
 *
 * Spring-damped so it trails the scroll slightly instead of snapping — the lag is
 * what makes it feel like a physical indicator. Decorative and hidden from
 * assistive technology; the same information is already in the scrollbar.
 */
export function ScrollProgress({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

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
