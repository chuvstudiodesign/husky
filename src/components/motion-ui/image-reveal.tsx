"use client";

import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

export interface ImageRevealProps extends React.ComponentProps<"div"> {
  /** Which edge the mask retreats toward. */
  direction?: "up" | "down" | "left" | "right";
  /** Seconds the unmask takes. */
  duration?: number;
  /** Seconds before it starts. */
  delay?: number;
}

const CLIP: Record<string, string> = {
  up: "inset(100% 0 0 0)",
  down: "inset(0 0 100% 0)",
  left: "inset(0 0 0 100%)",
  right: "inset(0 100% 0 0)",
};

/**
 * Unmasks its child as it scrolls into view, wiping from one edge.
 *
 * A photograph that fades in reads as a page still loading. One that is *unmasked*
 * reads as deliberate — the image was always there and the frame opened. That is
 * the difference between an animation and a transition, and on a page with a single
 * photograph it is worth the extra care.
 *
 * `clip-path` animates on the compositor, so this costs nothing per frame. Like the
 * other reveals, the hidden state is gated behind `html.js`, so with scripting
 * unavailable the image is simply visible.
 */
export function ImageReveal({
  direction = "up",
  duration = 1.1,
  delay = 0,
  className,
  style,
  children,
  ...props
}: ImageRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.setAttribute("data-revealed", "");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      data-image-reveal=""
      className={cn("overflow-hidden", className)}
      style={
        {
          "--reveal-clip": CLIP[direction],
          "--reveal-duration": `${duration}s`,
          "--reveal-delay": `${delay}s`,
          ...style,
        } as React.CSSProperties
      }
      {...props}
    >
      {children}
    </div>
  );
}
