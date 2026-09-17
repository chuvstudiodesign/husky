"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";

export interface DotFieldProps extends React.ComponentProps<"div"> {
  /** Distance between dot edges, in CSS pixels. */
  gap?: number;
  /** Side length of each square dot, in CSS pixels. */
  dotSize?: number;
  /** Radius of the pointer's influence, in CSS pixels. */
  proximity?: number;
  /** Any CSS colour string, including a `var()` reference. Resting dot colour. */
  baseColor?: string;
  /** Any CSS colour string, including a `var()` reference. Colour at the cursor. */
  activeColor?: string;
}

/** Steps in the base → active colour ramp. See `buildRamp`. */
const RAMP_STEPS = 32;

type Rgba = [number, number, number, number];

/**
 * Resolves any CSS colour string — including `var(--primary)` and `color-mix()` —
 * into concrete RGBA channels.
 *
 * Two hops, because neither alone is sufficient. A probe element inside the host
 * resolves custom properties against the theme scope the field actually sits in, so
 * `.theme-light` is honoured without the component knowing the themes exist. The
 * computed value can then still come back in a colour space canvas cannot lerp
 * (`oklch()`, which is how the husky/navy/grey ramps are authored), so it is painted
 * onto a 1×1 surface and read back — the browser's own conversion to sRGB, which is
 * the only one guaranteed to match what it would have painted anyway.
 */
function resolveColor(host: HTMLElement, value: string): Rgba {
  const probe = document.createElement("span");
  probe.style.display = "none";
  probe.style.color = value;
  host.appendChild(probe);
  const computed = getComputedStyle(probe).color;
  probe.remove();

  const surface = document.createElement("canvas");
  surface.width = 1;
  surface.height = 1;
  const ctx = surface.getContext("2d", { willReadFrequently: true });
  if (!ctx) return [0, 0, 0, 1];
  ctx.clearRect(0, 0, 1, 1);
  ctx.fillStyle = computed;
  ctx.fillRect(0, 0, 1, 1);
  const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data;
  return [r, g, b, a / 255];
}

/**
 * Precomputes the whole base → active ramp as ready-made `rgba()` strings.
 *
 * The loop touches every dot every frame; building a colour string per dot per frame
 * would allocate thousands of throwaway strings a second and hand the GC a job it
 * does not need. Thirty-two steps is far finer than the eye can resolve across a
 * 1.5px square, so the quantisation is invisible and the allocation drops to zero
 * after mount.
 */
function buildRamp(base: Rgba, active: Rgba): string[] {
  const ramp: string[] = new Array(RAMP_STEPS + 1);
  for (let i = 0; i <= RAMP_STEPS; i++) {
    const t = i / RAMP_STEPS;
    const r = Math.round(base[0] + (active[0] - base[0]) * t);
    const g = Math.round(base[1] + (active[1] - base[1]) * t);
    const b = Math.round(base[2] + (active[2] - base[2]) * t);
    const a = base[3] + (active[3] - base[3]) * t;
    ramp[i] = `rgba(${r},${g},${b},${a.toFixed(3)})`;
  }
  return ramp;
}

/**
 * A canvas field of small squares that brighten toward the cursor.
 *
 * Squares rather than circles, on a tight regular grid: a dot matrix of identical
 * cells reads as a sensor array or a control panel, which is the register this brand
 * lives in. Circles read as confetti.
 *
 * Everything about the loop is built to earn its place on a battery. Dots are laid
 * out once into a flat array and only rebuilt on resize. A single `Path2D` square is
 * translated and re-filled per dot rather than a new path being described each time,
 * which is the difference between a few thousand dots at 60fps and a stutter. The
 * colour ramp is precomputed into fixed strings so a frame allocates nothing. And the
 * loop is not a loop in the usual sense — it suspends itself the moment the field has
 * settled and the pointer has stopped, then a pointer move wakes it for exactly one
 * frame. Off-screen, an IntersectionObserver stops it entirely.
 *
 * There is no click shockwave. The upstream version displaces dots with a physics
 * impulse; that wants an inertia solver, and a decorative background is not worth a
 * dependency. Proximity alone is the part that reads as responsive instrumentation.
 *
 * Colours are resolved from CSS custom properties at mount, so the field follows
 * whichever theme scope it is rendered inside without being told.
 *
 * Purely decorative — `aria-hidden`, `pointer-events-none`, and nothing on the page
 * depends on it. Under `prefers-reduced-motion` the grid is painted once, statically,
 * and no pointer listener is ever attached.
 */
export function DotField({
  gap = 28,
  dotSize = 1.5,
  proximity = 130,
  baseColor = "var(--border)",
  activeColor = "var(--primary)",
  className,
  ...props
}: DotFieldProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    /* --- Field state. All of it lives in closures, never in React state: a
       pointer-driven canvas that re-rendered the tree would be pointless work. --- */
    /* Everything below the layout step works in DEVICE pixels, not CSS pixels. A
       1.5px square placed at a fractional CSS coordinate gets antialiased across two
       or three device pixels and turns to mush — which is fatal for a field whose
       whole character is crisp identical cells. Rounding positions and the square's
       side to whole device pixels is the difference between a sensor grid and a
       smudge. */
    const dots: number[] = []; // flat [x0, y0, x1, y1, …] — one array, no objects
    let ramp = buildRamp(
      resolveColor(host, baseColor),
      resolveColor(host, activeColor),
    );
    let path = new Path2D();
    let dpr = 1;
    let side = 2; // square side, device px
    let width = 0; // CSS px
    let height = 0; // CSS px
    let bounds = host.getBoundingClientRect();

    let pointerX = 0; // device px, relative to the canvas
    let pointerY = 0;
    let pointerInside = false;
    /** 0–1 ramp on the whole effect, so the field fades out when the cursor leaves
        instead of snapping back to base in a single frame. */
    let influence = 0;

    let frame: number | null = null;
    let visible = true;
    let lastX = NaN;
    let lastY = NaN;

    const layout = () => {
      bounds = host.getBoundingClientRect();
      width = Math.max(1, Math.round(bounds.width));
      height = Math.max(1, Math.round(bounds.height));
      // Capped at 2: beyond that the field costs four times the fill for a
      // difference nobody can see on a 1.5px square.
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      const deviceW = Math.round(width * dpr);
      const deviceH = Math.round(height * dpr);
      canvas.width = deviceW;
      canvas.height = deviceH;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      side = Math.max(1, Math.round(dotSize * dpr));
      path = new Path2D();
      path.rect(0, 0, side, side);

      const cell = Math.max(side + 1, Math.round((gap + dotSize) * dpr));
      const cols = Math.max(1, Math.floor((deviceW + cell - side) / cell));
      const rows = Math.max(1, Math.floor((deviceH + cell - side) / cell));
      const originX = Math.round((deviceW - (cols * cell - (cell - side))) / 2);
      const originY = Math.round((deviceH - (rows * cell - (cell - side))) / 2);

      dots.length = 0;
      for (let row = 0; row < rows; row++) {
        const y = originY + row * cell;
        for (let col = 0; col < cols; col++) {
          dots.push(originX + col * cell, y);
        }
      }
    };

    const render = () => {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const radius = proximity * dpr;
      const radius2 = radius * radius;
      const half = side / 2;
      const live = influence > 0.004;
      const restStyle = ramp[0];
      let currentStyle = "";
      // Translation is tracked and applied as a delta so the transform can be walked
      // across the grid without a save/restore pair per dot.
      let tx = 0;
      let ty = 0;

      for (let i = 0; i < dots.length; i += 2) {
        const x = dots[i];
        const y = dots[i + 1];

        let style = restStyle;
        if (live) {
          const dx = x + half - pointerX;
          const dy = y + half - pointerY;
          const d2 = dx * dx + dy * dy;
          // Squared compare first — the square root is only paid for the handful of
          // dots actually inside the radius.
          if (d2 < radius2) {
            const t = (1 - Math.sqrt(d2) / radius) * influence;
            style = ramp[(t * RAMP_STEPS) | 0];
          }
        }

        // Most dots share the resting colour, so this guard collapses thousands of
        // fillStyle writes into one.
        if (style !== currentStyle) {
          ctx.fillStyle = style;
          currentStyle = style;
        }

        ctx.translate(x - tx, y - ty);
        tx = x;
        ty = y;
        ctx.fill(path);
      }
    };

    const tick = () => {
      frame = null;
      const target = pointerInside ? 1 : 0;
      const next = influence + (target - influence) * 0.18;
      influence = Math.abs(target - next) < 0.004 ? target : next;

      render();
      lastX = pointerX;
      lastY = pointerY;

      // Reschedule only while the fade is still settling. Once it has landed the
      // field is a pure function of a stationary pointer, so there is nothing left to
      // draw — the next pointer move will wake us.
      if (influence !== target) wake();
    };

    const wake = () => {
      if (frame === null && visible) frame = requestAnimationFrame(tick);
    };

    const handlePointer = (event: PointerEvent) => {
      const localX = event.clientX - bounds.left;
      const localY = event.clientY - bounds.top;
      pointerX = localX * dpr;
      pointerY = localY * dpr;
      pointerInside =
        localX >= -proximity &&
        localY >= -proximity &&
        localX <= width + proximity &&
        localY <= height + proximity;
      if (pointerX !== lastX || pointerY !== lastY || influence === 0) wake();
    };

    const handleLeave = () => {
      pointerInside = false;
      wake();
    };

    layout();
    render();

    // Reduced motion: the grid is drawn, and that is the whole component. No
    // listeners, no loop, nothing that moves.
    if (reduced) return;

    const resizeObserver = new ResizeObserver(() => {
      layout();
      render();
    });
    resizeObserver.observe(host);

    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) wake();
      else if (frame !== null) {
        cancelAnimationFrame(frame);
        frame = null;
      }
    });
    intersectionObserver.observe(host);

    // A global theme swap flips a class on <html>; re-resolve rather than repaint the
    // field in yesterday's colours. Scope classes applied further down the tree are
    // static in this project, so they are already correct at mount.
    const themeObserver = new MutationObserver(() => {
      ramp = buildRamp(
        resolveColor(host, baseColor),
        resolveColor(host, activeColor),
      );
      render();
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-theme", "style"],
    });

    // The pointer is tracked on the window because the canvas is pointer-events-none
    // and content sits on top of it — listening on the canvas itself would only ever
    // fire in the gaps.
    const onScroll = () => {
      bounds = host.getBoundingClientRect();
    };
    window.addEventListener("pointermove", handlePointer, { passive: true });
    window.addEventListener("pointerleave", handleLeave);
    window.addEventListener("blur", handleLeave);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      if (frame !== null) cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      themeObserver.disconnect();
      window.removeEventListener("pointermove", handlePointer);
      window.removeEventListener("pointerleave", handleLeave);
      window.removeEventListener("blur", handleLeave);
      window.removeEventListener("scroll", onScroll);
    };
  }, [gap, dotSize, proximity, baseColor, activeColor, reduced]);

  return (
    <div
      ref={hostRef}
      aria-hidden
      className={cn("pointer-events-none absolute inset-0", className)}
      {...props}
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}
