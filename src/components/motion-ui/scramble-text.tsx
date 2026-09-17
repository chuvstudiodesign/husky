"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";

/**
 * `.:/-01` — punctuation, a dash, a slash and two binary digits.
 *
 * The charset is the whole argument for this component. Scrambling through the
 * full alphabet in a display face reads as hacker cosplay; it is the single most
 * dated text effect on the internet. Scrambling a *monospace technical label*
 * through six glyphs that all belong to an address, a timestamp or a status code
 * reads like a piece of equipment booting — which is exactly the register this
 * brand is in. Hence the narrow set, and hence Geist Mono, baked in rather than
 * offered as an option.
 */
const DEFAULT_CHARSET = ".:/-01";

export interface ScrambleTextProps {
  /** The string to resolve to. Plain text only — it is the accessible name. */
  children: string;
  /** Glyphs the unresolved characters cycle through. */
  charset?: string;
  /** Characters resolved per second. */
  speed?: number;
  className?: string;
  /** Element to render. Use the real semantic tag for where it sits. */
  as?: "span" | "p" | "div" | "h2" | "h3";
}

/**
 * A monospace label that resolves out of noise the first time it scrolls into view.
 *
 * Zero dependencies, and deliberately so: the well-known React implementation of
 * this effect is built on GSAP's `SplitText` and `ScrambleTextPlugin`, both of
 * which are paid Club plugins. The mechanic underneath is twenty lines — hold the
 * target string, advance a reveal head over time, and each tick emit the real
 * character for every index the head has passed and a random glyph for the rest.
 * There is nothing to license.
 *
 * **Layout never moves.** Every tick emits exactly as many characters as the
 * target, spaces are passed through untouched so word shapes hold, and the element
 * reserves its final measure in `ch`. In a monospace face with a constant
 * character count the width is constant by construction, which is the second
 * reason this is a mono-only component.
 *
 * **The real string is in the DOM**, server-rendered, so it is correct before
 * hydration and correct with JavaScript off entirely. The animating copy is
 * `aria-hidden`; a visually hidden sibling carries the accessible text, so no
 * screen reader is ever handed a mouthful of slashes mid-resolve.
 *
 * **Reduced motion does not branch the tree.** `useReducedMotion()` resolves to
 * null on the server and true on the client, so using it to pick markup — or even
 * a style value — guarantees a hydration mismatch for precisely the people who
 * asked for less movement. It is read inside the effect only: the effect returns
 * before it observes anything, and the `prefers-reduced-motion` rule in globals.css
 * cancels the hidden start state. The result is the finished string, immediately,
 * from markup that is identical in both cases.
 *
 * Use it once per page, on an eyebrow, a stat or a status line. Twice and it stops
 * being equipment and starts being a tic.
 */
export function ScrambleText({
  children,
  charset = DEFAULT_CHARSET,
  speed = 24,
  className,
  as: Tag = "span",
}: ScrambleTextProps) {
  const hostRef = useRef<HTMLElement>(null);
  const outRef = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const host = hostRef.current;
    const out = outRef.current;
    if (!host || !out) return;

    // Nothing to do: the final string is already rendered, and the CSS override
    // keeps it visible. No observer, no loop, no second tree.
    if (reduced) return;

    const target = children;
    const glyphs = Array.from(charset.length > 0 ? charset : DEFAULT_CHARSET);

    let frame = 0;
    let start = 0;
    let lastChurn = 0;

    const tick = (now: number) => {
      if (start === 0) start = now;
      const head = ((now - start) / 1000) * speed;

      if (head >= target.length) {
        out.textContent = target;
        frame = 0;
        return;
      }

      // Re-roll the unresolved glyphs about fourteen times a second. Every frame
      // and the label strobes; much slower and it stops reading as movement.
      if (now - lastChurn >= 70) {
        lastChurn = now;
        let next = "";
        for (let i = 0; i < target.length; i += 1) {
          const ch = target[i];
          next =
            i < head || ch === " "
              ? next + ch
              : next + glyphs[(Math.random() * glyphs.length) | 0];
        }
        out.textContent = next;
      }

      frame = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          observer.unobserve(entry.target);
          host.setAttribute("data-revealed", "");
          frame = requestAnimationFrame(tick);
        }
      },
      { threshold: 0.6, rootMargin: "0px 0px -5% 0px" },
    );

    observer.observe(host);

    return () => {
      observer.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, [children, charset, speed, reduced]);

  return (
    <Tag
      ref={hostRef as React.Ref<never>}
      data-scramble
      className={cn("font-mono", className)}
    >
      <span className="sr-only select-none">{children}</span>
      <span
        ref={outRef}
        data-scramble-out
        aria-hidden
        className="inline-block whitespace-pre"
        // Derived from the string itself, not a magic number: the element can
        // never be narrower than the text it is going to hold.
        style={{ minWidth: `${children.length}ch` }}
      >
        {children}
      </span>
    </Tag>
  );
}
