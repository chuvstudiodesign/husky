"use client";

import { useEffect, useRef } from "react";
import { useInView, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";

export interface CounterProps extends Omit<React.ComponentProps<"span">, "children"> {
  /** The number to land on. */
  value: number;
  /** Seconds the count takes. */
  duration?: number;
  /** Rendered before the number, e.g. "$". */
  prefix?: string;
  /** Rendered after the number, e.g. "+" or "%". */
  suffix?: string;
  /** Decimal places to show. */
  decimals?: number;
}

/**
 * Counts up to `value` the first time it scrolls into view.
 *
 * The running number is written straight to `textContent` rather than held in React
 * state — a 60fps counter driving 90+ renders would be pure waste, and it keeps the
 * component out of React's update path entirely.
 *
 * Eases out, so it decelerates into the final number instead of stopping dead. A
 * visually hidden span holds the finished value and the animated span is
 * `aria-hidden`, so assistive technology reads the result and never a moving
 * number. Under reduced motion the value is simply there.
 */
export function Counter({
  value,
  duration = 1.6,
  prefix = "",
  suffix = "",
  decimals = 0,
  className,
  ...props
}: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const numberRef = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduced = useReducedMotion();

  useEffect(() => {
    const node = numberRef.current;
    if (!node) return;

    const format = (n: number) => `${prefix}${n.toFixed(decimals)}${suffix}`;

    if (reduced) {
      node.textContent = format(value);
      return;
    }

    // Only wind back to zero for a counter the viewer hasn't reached yet. One that
    // is already on screen at mount has effectively been read — resetting it would
    // replace a correct number with a wrong one, and if the observer never fires
    // (short page, no scroll) it would stay wrong.
    const rect = node.getBoundingClientRect();
    const belowFold = rect.top > window.innerHeight;

    if (!inView) {
      if (belowFold) node.textContent = format(0);
      return;
    }

    let frame = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const t = Math.min((now - start) / 1000 / duration, 1);
      // easeOutExpo — quick departure, gentle landing
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      node.textContent = format(value * eased);
      if (t < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, reduced, value, duration, decimals, prefix, suffix]);

  const label = `${prefix}${value.toFixed(decimals)}${suffix}`;

  return (
    <span ref={ref} className={cn("tabular-nums", className)} {...props}>
      <span className="sr-only">{label}</span>
      {/* Server-rendered with the final value, so the number is correct before
          hydration and correct with JS disabled. */}
      <span ref={numberRef} aria-hidden>
        {label}
      </span>
    </span>
  );
}
