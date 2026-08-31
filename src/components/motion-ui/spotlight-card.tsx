"use client";

import { useCallback, useRef } from "react";

import { cn } from "@/lib/utils";

export interface SpotlightCardProps extends React.ComponentProps<"div"> {
  /** Radius of the highlight in pixels. */
  size?: number;
  /** Peak strength of the surface wash, 0–1. */
  intensity?: number;
}

/**
 * A card whose surface and border catch a soft highlight tracking the cursor.
 *
 * The pointer position is written straight to CSS custom properties on the node, so
 * moving the mouse never triggers a React render — the whole effect runs in the
 * compositor. Opacity is driven by `:hover` in CSS rather than by state, for the
 * same reason.
 *
 * The effect is deliberately faint. It should read as light falling across a
 * physical panel, not as a glow. Purely decorative: it never appears for touch or
 * keyboard users, and nothing depends on it.
 */
export function SpotlightCard({
  size = 400,
  intensity = 0.1,
  className,
  children,
  style,
  ...props
}: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    el.style.setProperty("--my", `${e.clientY - rect.top}px`);
  }, []);

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      className={cn(
        "group/spotlight relative isolate overflow-hidden rounded-lg border",
        "transition-colors duration-500 hover:border-white/16",
        className,
      )}
      style={
        {
          "--mx": "50%",
          "--my": "50%",
          "--spot": `${size}px`,
          "--spot-alpha": intensity,
          ...style,
        } as React.CSSProperties
      }
      {...props}
    >
      {/* Surface wash */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-500 group-hover/spotlight:opacity-100"
        style={{
          background:
            "radial-gradient(var(--spot) circle at var(--mx) var(--my), color-mix(in oklch, var(--primary) calc(var(--spot-alpha) * 100%), transparent), transparent 70%)",
        }}
      />
      {/* Border catch — tighter and brighter than the wash */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-lg opacity-0 transition-opacity duration-500 group-hover/spotlight:opacity-100"
        style={{
          padding: 1,
          background:
            "radial-gradient(calc(var(--spot) * 0.6) circle at var(--mx) var(--my), color-mix(in oklch, var(--primary) 50%, transparent), transparent 65%)",
          // #000 here is a mask stencil, not a colour — the two layers composite
          // with `xor` to leave only the 1px ring. No brand value is involved.
          WebkitMask:
            "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      />
      {children}
    </div>
  );
}
