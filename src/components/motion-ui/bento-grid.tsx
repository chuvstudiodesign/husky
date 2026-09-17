"use client";

import { useCallback, useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

/**
 * A grid whose cells light their own hairline border as the pointer approaches.
 *
 * The important difference from a per-card hover effect: one listener on the
 * container measures the pointer against *every* cell, and intensity falls off
 * with distance. Cards near the cursor brighten, cards further away stay dark, and
 * the grid reads as a single illuminated surface rather than as N independent
 * hover targets. That is what makes it feel like one object.
 *
 * Everything is written to CSS custom properties on the DOM nodes, so pointer
 * movement never triggers a React render, and reads are coalesced to one per
 * frame. The upstream version also emits particles and tilts the cards; both are
 * dropped. Under these brand constraints — flat surfaces, 5px radius, one accent —
 * the border glow alone is the whole effect, and the extras only make it noisy.
 */
export function BentoGrid({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  const ref = useRef<HTMLDivElement>(null);
  const frame = useRef(0);
  const point = useRef({ x: 0, y: 0, active: false });

  const paint = useCallback(() => {
    frame.current = 0;
    const root = ref.current;
    if (!root) return;

    const cells = root.querySelectorAll<HTMLElement>("[data-bento-cell]");
    const { x, y, active } = point.current;

    for (const cell of cells) {
      const r = cell.getBoundingClientRect();
      // Distance from the pointer to the nearest point on the cell, so a card the
      // cursor is inside reads as fully lit rather than lit only at its centre.
      const dx = Math.max(r.left - x, 0, x - r.right);
      const dy = Math.max(r.top - y, 0, y - r.bottom);
      const dist = Math.hypot(dx, dy);

      const RANGE = 340;
      const intensity = active ? Math.max(0, 1 - dist / RANGE) : 0;

      cell.style.setProperty("--glow-x", `${x - r.left}px`);
      cell.style.setProperty("--glow-y", `${y - r.top}px`);
      // Eased so the falloff is gentle near the cursor and quick at the edge.
      cell.style.setProperty("--glow", `${intensity * intensity}`);
    }
  }, []);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const schedule = () => {
      if (!frame.current) frame.current = requestAnimationFrame(paint);
    };

    const onMove = (e: PointerEvent) => {
      point.current = { x: e.clientX, y: e.clientY, active: true };
      schedule();
    };
    const onLeave = () => {
      point.current.active = false;
      schedule();
    };

    // On the window, not the grid: a card should begin to light as the cursor
    // approaches from outside, which is the whole point of the falloff.
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave);
    window.addEventListener("scroll", schedule, { passive: true });

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("scroll", schedule);
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, [paint]);

  return (
    <div
      ref={ref}
      className={cn("grid gap-3", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export interface BentoCellProps extends React.ComponentProps<"div"> {
  /** Column span at lg and above. */
  span?: 1 | 2 | 3;
  /** Row span at lg and above. */
  rows?: 1 | 2;
}

const SPAN: Record<number, string> = {
  1: "lg:col-span-1",
  2: "lg:col-span-2",
  3: "lg:col-span-3",
};
const ROWS: Record<number, string> = {
  1: "lg:row-span-1",
  2: "lg:row-span-2",
};

/**
 * One cell. Asymmetry is the point — a bento grid where every tile is the same
 * size is just a grid, and gives the reader no order to read them in.
 */
export function BentoCell({
  span = 1,
  rows = 1,
  className,
  children,
  ...props
}: BentoCellProps) {
  return (
    <div
      data-bento-cell=""
      className={cn(
        "bg-card relative isolate overflow-hidden rounded-lg border",
        SPAN[span],
        ROWS[rows],
        className,
      )}
      style={
        {
          "--glow": 0,
          "--glow-x": "50%",
          "--glow-y": "50%",
        } as React.CSSProperties
      }
      {...props}
    >
      {/* Border catch. Masked to a 1px ring so only the hairline lights, which is
          what keeps this reading as a drawn edge rather than as a glow. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-lg"
        style={{
          opacity: "var(--glow)",
          padding: 1,
          background:
            "radial-gradient(220px circle at var(--glow-x) var(--glow-y), var(--primary), transparent 70%)",
          WebkitMask:
            "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      />
      {/* A much fainter wash across the surface itself. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          opacity: "var(--glow)",
          background:
            "radial-gradient(300px circle at var(--glow-x) var(--glow-y), color-mix(in oklch, var(--primary) 7%, transparent), transparent 70%)",
        }}
      />
      {children}
    </div>
  );
}
