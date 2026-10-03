"use client";

import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

export interface SpotlightFrameProps {
  /** Classes for the outer frame (sizing, layout). */
  className?: string;
  /** Classes for the inset surface. Defaults to the card fill. */
  innerClassName?: string;
  children: React.ReactNode;
}

/**
 * P10 — a 1px frame whose border catches orange where the cursor is.
 *
 * A 1px padding wrapper painted `var(--border)`, with an overlay of
 * `radial-gradient(200px circle at var(--mx) var(--my), var(--primary), transparent)`
 * that fades in on hover, around an inset child. 4px outer radius; the inset uses
 * the 3px step so the two corners stay concentric across the 1px gap.
 *
 * Pointer position is written to CSS custom properties, never React state. Off on
 * touch (`hover: none`): the frame is a plain 1px border.
 */
export function SpotlightFrame({
  className,
  innerClassName,
  children,
}: SpotlightFrameProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !window.matchMedia("(hover: hover)").matches) return;
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${e.clientX - r.left}px`);
      el.style.setProperty("--my", `${e.clientY - r.top}px`);
    };
    el.addEventListener("pointermove", move);
    return () => el.removeEventListener("pointermove", move);
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        "group/frame bg-border relative isolate rounded-lg p-px",
        className,
      )}
      style={{ "--mx": "50%", "--my": "50%" } as React.CSSProperties}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-lg opacity-0 transition-opacity duration-250 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none [@media(hover:hover)]:group-hover/frame:opacity-100"
        style={{
          background:
            "radial-gradient(200px circle at var(--mx) var(--my), var(--primary), transparent)",
        }}
      />
      <div className={cn("bg-card relative h-full rounded-sm", innerClassName)}>
        {children}
      </div>
    </div>
  );
}
