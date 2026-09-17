"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";

const DEFAULT_CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-/.";
/* Non-breaking, so a blank flap keeps its cell instead of collapsing. */
const BLANK = "\u00A0";

export interface SplitFlapProps {
  /** The string the board lands on. Plain text — it is the accessible name. */
  children: string;
  /** Glyphs each cell churns through before it settles. */
  charset?: string;
  /** Milliseconds a single cell churns for before locking to its target. */
  flipDuration?: number;
  /** Milliseconds between neighbouring cells starting, left to right. */
  stagger?: number;
  className?: string;
}

/**
 * A split-flap board: every character churns through glyphs and settles, the
 * resolution sweeping left to right.
 *
 * This is the highest-personality component in the set and it costs nothing in
 * brand terms, because a split-flap *is* a piece of equipment. Nothing here needs a
 * gradient, a glow or a rounded blob to read as expensive — flat fills, hairline
 * borders and a 4px corner are what the real object looks like.
 *
 * **No 3D card-flip physics.** A convincing flap needs two half-tiles, a shared
 * axis and a shadow pass, and it buys nothing: what actually sells the effect is
 * the *character churn*. So each cell gets one cheap transform — the glyph shuttles
 * a few percent up and down as it changes — and a timer advances what it shows.
 * Transform and opacity only, so it stays on the compositor.
 *
 * The loop writes to `textContent` and toggles attributes directly. A twelve-cell
 * board re-rolling fourteen times a second would otherwise be 170 React renders a
 * second to display twelve letters.
 *
 * **The final string is server-rendered, one character per cell.** With JavaScript
 * off the board is simply the word, correct and legible. The "unlit" appearance —
 * blank glyphs on a `--secondary` fill — lives in CSS behind
 * `@media (scripting: enabled)`, so it only ever exists in a browser that can
 * actually run the resolve.
 *
 * A note on tokens: the brief called for `--muted` as the off fill, but in the
 * light theme `--muted` and `--card` are the same value (`#f3f6fa`), which would
 * make off and settled cells identical. `--secondary` is the adjacent token and
 * differs from `--card` in both themes, so the board reads as a board in either.
 *
 * **Reduced motion is handled without branching the tree.** `useReducedMotion()`
 * is read inside the effect only — it returns null on the server and true on the
 * client, so branching the markup on it would hand a hydration mismatch to exactly
 * the people who asked for less motion. The effect returns before observing
 * anything and the `prefers-reduced-motion` block in globals.css cancels the unlit
 * state, leaving the server-rendered word in place.
 */
export function SplitFlap({
  children,
  charset = DEFAULT_CHARSET,
  flipDuration = 620,
  stagger = 45,
  className,
}: SplitFlapProps) {
  const cellsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const hostRef = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    // The board already shows the finished string; leave it alone.
    if (reduced) return;

    const target = Array.from(children);
    const glyphs = Array.from(charset.length > 0 ? charset : DEFAULT_CHARSET);

    let frame = 0;
    let startTs = 0;
    let lastChurn = 0;
    let tick = 0;

    const paint = (now: number) => {
      if (startTs === 0) startTs = now;
      const elapsed = now - startTs;

      const churn = now - lastChurn >= 60;
      if (churn) {
        lastChurn = now;
        tick ^= 1;
      }

      let running = false;

      for (let i = 0; i < cellsRef.current.length; i += 1) {
        const cell = cellsRef.current[i];
        if (!cell) continue;
        const glyph = cell.firstElementChild as HTMLElement | null;
        if (!glyph) continue;

        const begin = i * stagger;
        const end = begin + flipDuration;

        if (elapsed >= end) {
          if (!cell.hasAttribute("data-flap-settled")) {
            cell.removeAttribute("data-flap-churning");
            cell.removeAttribute("data-flap-tick");
            cell.setAttribute("data-flap-settled", "");
            glyph.textContent = target[i] === " " ? BLANK : target[i];
          }
          continue;
        }

        running = true;
        if (elapsed < begin) continue; // cell has not woken yet

        cell.setAttribute("data-flap-churning", "");
        if (churn) {
          glyph.textContent = glyphs[(Math.random() * glyphs.length) | 0];
          cell.setAttribute("data-flap-tick", tick === 1 ? "b" : "a");
        }
      }

      frame = running ? requestAnimationFrame(paint) : 0;
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          observer.unobserve(entry.target);
          frame = requestAnimationFrame(paint);
        }
      },
      { threshold: 0.4, rootMargin: "0px 0px -5% 0px" },
    );

    observer.observe(host);

    return () => {
      observer.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, [children, charset, flipDuration, stagger, reduced]);

  const chars = Array.from(children);

  return (
    <span
      ref={hostRef}
      role="img"
      aria-label={children}
      className={cn("inline-flex flex-wrap gap-0.5 font-mono", className)}
    >
      {chars.map((ch, i) => (
        <span
          // Index keys are correct here: cells are positions on a board, not
          // identities, and position is exactly what they are keyed by.
          key={i}
          ref={(el) => {
            cellsRef.current[i] = el;
          }}
          data-flap-cell
          aria-hidden
          className="bg-card text-foreground inline-flex h-9 w-7 items-center justify-center overflow-hidden rounded-md border text-sm font-medium tabular-nums"
        >
          <span data-flap-glyph className="inline-block leading-none">
            {ch === " " ? BLANK : ch}
          </span>
        </span>
      ))}
    </span>
  );
}
