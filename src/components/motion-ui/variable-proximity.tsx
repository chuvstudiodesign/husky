"use client";

import { useEffect, useMemo, useRef } from "react";
import { useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";

/** Elements this can render as. Deliberately short — it is a headline effect. */
type ProximityTag = "h1" | "h2" | "h3" | "h4" | "p" | "span" | "div";

export interface VariableProximityProps
  extends Omit<React.ComponentProps<"span">, "children" | "ref"> {
  /** The text. A plain string — this splits it, so it cannot take elements. */
  children: string;
  /** Radius of the cursor's influence, in CSS pixels. */
  radius?: number;
  /** `wght` axis value at rest, and the value rendered under reduced motion. */
  fromWeight?: number;
  /** `wght` axis value directly under the cursor. */
  toWeight?: number;
  /** How weight decays with distance. */
  falloff?: "linear" | "gaussian";
  /** Element to render. Pick the one the document outline actually needs. */
  as?: ProximityTag;
}

/**
 * A headline whose letters gain weight as the cursor passes over them.
 *
 * Outfit ships a continuous `wght` axis, so this is not a swap between two cuts — it
 * is a genuine interpolation, and the swell travels through the word like a bulge in
 * a rope. That is the entire reason to use it: it is one of the few text effects that
 * is native to the typeface rather than painted on top of it, so it costs nothing in
 * brand terms. No colour, no gradient, no glow.
 *
 * Per-character weight is written straight to `style.fontVariationSettings` from a
 * rAF loop, with the pointer held in a ref. React never renders during the effect —
 * a thirty-character headline at 60fps would otherwise be 1800 renders a second to
 * move a font axis.
 *
 * Character rectangles are measured once and cached, not read per frame: calling
 * `getBoundingClientRect` on every span every frame would force a layout flush and
 * hand back exactly the same numbers. The cache is invalidated on resize and scroll,
 * which is when those numbers actually change.
 *
 * A screen reader gets the whole string once, from the wrapper's `aria-label`; every
 * character span is `aria-hidden`, so nobody hears the word spelled out.
 *
 * Note the shape of the reduced-motion handling: the rendered tree is identical
 * either way, and only the effect is skipped. Branching the markup on a hook that
 * resolves differently on the server than in the browser is a hydration mismatch
 * waiting to happen, and the static render is already correct — every span starts at
 * `fromWeight` inline.
 */
export function VariableProximity({
  children,
  radius = 120,
  fromWeight = 300,
  toWeight = 700,
  falloff = "gaussian",
  as = "span",
  className,
  ...props
}: VariableProximityProps) {
  const hostRef = useRef<HTMLElement>(null);
  const charsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const reduced = useReducedMotion();

  /* Split into words first, then characters. Splitting the raw string would leave
     bare spaces between inline-blocks, which collapse and remove every wrap
     opportunity — a long headline would then run off the side of the viewport
     instead of breaking. Words wrap; letters inside a word do not. */
  const words = useMemo(() => {
    const parts = children.split(/(\s+)/).filter(Boolean);
    let index = 0;
    return parts.map((part) => {
      const isSpace = /^\s+$/.test(part);
      const chars = isSpace
        ? []
        : Array.from(part).map((char) => ({ char, index: index++ }));
      return { part, isSpace, chars };
    });
  }, [children]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host || reduced) return;

    const spans = charsRef.current.filter(Boolean) as HTMLSpanElement[];
    if (spans.length === 0) return;

    const centersX = new Float64Array(spans.length);
    const centersY = new Float64Array(spans.length);
    let measured = false;

    let pointerX = NaN;
    let pointerY = NaN;
    let lastX = NaN;
    let lastY = NaN;
    let frame: number | null = null;
    let visible = true;
    /** Set when every span is already sitting at `fromWeight`, so the loop can stop
        once the cursor has left instead of rewriting identical values forever. */
    let settled = true;

    const measure = () => {
      for (let i = 0; i < spans.length; i++) {
        const rect = spans[i].getBoundingClientRect();
        centersX[i] = rect.left + rect.width / 2;
        centersY[i] = rect.top + rect.height / 2;
      }
      measured = true;
    };

    // Gaussian at sigma = radius / 2 puts a soft shoulder on the swell: the letter
    // under the cursor is fully weighted, its neighbours are most of the way there,
    // and the tail dies out smoothly. Linear is a cone, which reads sharper.
    const sigma2 = 2 * (radius / 2) * (radius / 2);
    const weightAt = (distance: number) => {
      if (distance >= radius) return 0;
      return falloff === "linear"
        ? 1 - distance / radius
        : Math.exp(-(distance * distance) / sigma2);
    };

    const tick = () => {
      frame = null;
      if (!measured) measure();

      const active = !Number.isNaN(pointerX);
      let anyLifted = false;

      for (let i = 0; i < spans.length; i++) {
        let t = 0;
        if (active) {
          const dx = centersX[i] - pointerX;
          const dy = centersY[i] - pointerY;
          const d2 = dx * dx + dy * dy;
          if (d2 < radius * radius) t = weightAt(Math.sqrt(d2));
        }
        if (t > 0) anyLifted = true;
        const wght = Math.round(fromWeight + (toWeight - fromWeight) * t);
        spans[i].style.fontVariationSettings = `'wght' ${wght}`;
      }

      lastX = pointerX;
      lastY = pointerY;
      settled = !anyLifted;
    };

    const wake = () => {
      if (frame === null && visible) frame = requestAnimationFrame(tick);
    };

    const handlePointer = (event: PointerEvent) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
      // Early exit: a pointer that has not moved produces the same weights it
      // produced last frame.
      if (pointerX === lastX && pointerY === lastY && settled) return;
      wake();
    };

    const handleLeave = () => {
      pointerX = NaN;
      pointerY = NaN;
      wake();
    };

    const invalidate = () => {
      measured = false;
      wake();
    };

    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (!visible && frame !== null) {
        cancelAnimationFrame(frame);
        frame = null;
      }
    });
    intersectionObserver.observe(host);

    const resizeObserver = new ResizeObserver(invalidate);
    resizeObserver.observe(host);

    window.addEventListener("pointermove", handlePointer, { passive: true });
    window.addEventListener("pointerleave", handleLeave);
    window.addEventListener("blur", handleLeave);
    window.addEventListener("scroll", invalidate, { passive: true });

    return () => {
      if (frame !== null) cancelAnimationFrame(frame);
      intersectionObserver.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener("pointermove", handlePointer);
      window.removeEventListener("pointerleave", handleLeave);
      window.removeEventListener("blur", handleLeave);
      window.removeEventListener("scroll", invalidate);
      // Restore the resting weight rather than clearing the property — clearing it
      // would drop the server-rendered baseline on any remount.
      for (const span of spans)
        span.style.fontVariationSettings = `'wght' ${fromWeight}`;
    };
  }, [reduced, radius, fromWeight, toWeight, falloff, words]);

  const Tag = as;

  return (
    <Tag
      // The tag union is narrower than the ref type React infers per element; every
      // member of it is an HTMLElement, which is all the effect needs.
      ref={hostRef as React.Ref<never>}
      aria-label={children}
      className={cn("font-display", className)}
      {...props}
    >
      {words.map((word, wordIndex) =>
        word.isSpace ? (
          <span key={`s${wordIndex}`} aria-hidden>
            {word.part}
          </span>
        ) : (
          <span key={`w${wordIndex}`} aria-hidden className="inline-block">
            {word.chars.map(({ char, index }) => (
              <span
                key={index}
                ref={(node) => {
                  charsRef.current[index] = node;
                }}
                className="inline-block"
                style={{ fontVariationSettings: `'wght' ${fromWeight}` }}
              >
                {char}
              </span>
            ))}
          </span>
        ),
      )}
    </Tag>
  );
}
