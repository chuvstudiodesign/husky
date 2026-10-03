"use client";

import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

export interface CursorLightProps {
  /** Radius of the lit circle, in px. */
  radius?: number;
  /** Darkness of the surround, 0–1, as brand-black alpha. */
  strength?: number;
  className?: string;
  children: React.ReactNode;
}

/**
 * P8 — darkness that lifts under the pointer.
 *
 * Pointer position goes straight to `--mx`/`--my` on the node (no React state), and
 * `--cl-on` flips 1/0 on enter/leave. An overlay paints
 * `radial-gradient(var(--r) circle at var(--mx) var(--my), transparent, brand-black / strength)`
 * at `opacity: var(--cl-on)`, so the frame is untouched until the pointer arrives.
 *
 * Off entirely on `(hover: none)`: no listeners, no overlay. Decorative only.
 */
export function CursorLight({
  radius = 320,
  strength = 0.5,
  className,
  children,
}: CursorLightProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !window.matchMedia("(hover: hover)").matches) return;

    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${e.clientX - r.left}px`);
      el.style.setProperty("--my", `${e.clientY - r.top}px`);
    };
    const enter = (e: PointerEvent) => {
      move(e);
      el.style.setProperty("--cl-on", "1");
    };
    const leave = () => el.style.setProperty("--cl-on", "0");

    el.addEventListener("pointermove", move);
    el.addEventListener("pointerenter", enter);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerenter", enter);
      el.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={cn("relative isolate", className)}
      style={
        {
          "--mx": "50%",
          "--my": "50%",
          "--cl-on": 0,
          "--r": `${radius}px`,
          "--strength": strength,
        } as React.CSSProperties
      }
    >
      {children}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 opacity-(--cl-on) transition-opacity duration-250 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none [@media(hover:none)]:hidden"
        style={{
          background:
            "radial-gradient(var(--r) circle at var(--mx) var(--my), transparent, color-mix(in oklab, var(--brand-black) calc(var(--strength) * 100%), transparent))",
        }}
      />
    </div>
  );
}
