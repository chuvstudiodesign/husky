"use client";

import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

type Direction = "up" | "down" | "left" | "right" | "none";

export interface RevealProps extends React.ComponentProps<"div"> {
  /** Which way the element travels in from. */
  direction?: Direction;
  /** Seconds to wait before starting. Use to stagger siblings. */
  delay?: number;
  /** Seconds the movement takes. */
  duration?: number;
  /** Fraction of the element that must be visible before it fires. */
  amount?: number;
  /** Replay every time it scrolls into view instead of only the first time. */
  repeat?: boolean;
}

/**
 * Scroll-triggered entrance.
 *
 * The hidden starting state lives in CSS behind an `html.js` guard, and that class
 * is set by a blocking inline script in the root layout. The consequence matters:
 * the server sends fully visible markup, so if scripts fail, are blocked, or simply
 * haven't run yet, the content is *there* — never a blank page waiting on
 * hydration. Only once JS is confirmed does anything hide, and it hides before
 * first paint, so there is no flash either way.
 *
 * The transition itself is CSS. IntersectionObserver only flips one attribute, so
 * nothing animates on the main thread.
 */
export function Reveal({
  direction = "up",
  delay = 0,
  duration = 0.6,
  amount = 0.15,
  repeat = false,
  className,
  style,
  children,
  ...props
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Anything already on screen at mount is revealed immediately rather than
    // waiting for a scroll that may never come.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.setAttribute("data-revealed", "");
            if (!repeat) observer.unobserve(entry.target);
          } else if (repeat) {
            entry.target.removeAttribute("data-revealed");
          }
        }
      },
      { threshold: amount, rootMargin: "0px 0px -5% 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [amount, repeat]);

  return (
    <div
      ref={ref}
      data-reveal={direction}
      className={cn(className)}
      style={
        {
          "--reveal-delay": `${delay}s`,
          "--reveal-duration": `${duration}s`,
          ...style,
        } as React.CSSProperties
      }
      {...props}
    >
      {children}
    </div>
  );
}
