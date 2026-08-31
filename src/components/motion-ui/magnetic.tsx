"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";

export interface MagneticProps extends React.ComponentProps<"div"> {
  /** How far the element follows the cursor, as a fraction of the offset. */
  strength?: number;
}

/**
 * Pulls its child a short distance toward the cursor while the pointer is over it,
 * then springs back on exit.
 *
 * Keep `strength` low. The effect should register as responsiveness, not as the
 * button trying to escape — past about 0.4 it stops feeling precise and starts
 * feeling loose. Disabled entirely under reduced motion, and it never gates
 * anything: the child is a normal focusable element underneath.
 */
export function Magnetic({
  strength = 0.25,
  className,
  children,
  ...props
}: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 18, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 200, damping: 18, mass: 0.4 });

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    if (reduced) return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - (rect.left + rect.width / 2)) * strength);
    y.set((e.clientY - (rect.top + rect.height / 2)) * strength);
  }

  function reset() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={{ x: springX, y: springY }}
      className={cn("inline-block", className)}
      {...(props as React.ComponentProps<typeof motion.div>)}
    >
      {children}
    </motion.div>
  );
}
