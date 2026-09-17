"use client";

import { useEffect, useMemo, useRef } from "react";
import { useInView, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";

export interface OdometerProps
  extends Omit<React.ComponentProps<"span">, "children" | "prefix"> {
  /** The number to land on. */
  value: number;
  /** Seconds the roll takes, before the per-digit stagger. */
  duration?: number;
  /** Rendered before the number, e.g. "$". */
  prefix?: string;
  /** Rendered after the number, e.g. "+" or "%". */
  suffix?: string;
}

/** Seconds each digit waits behind the one to its left. */
const STAGGER = 0.06;

/** Decelerates hard into the stop, with no overshoot. A mechanical drum coasts; it
    does not bounce. */
const EASING = "cubic-bezier(0.22, 1, 0.36, 1)";

/** Grouped, no decimals, pinned to a locale so the server and the browser format the
    same string — an unpinned `toLocaleString` is a hydration mismatch on any machine
    whose ICU default is not en-US. */
const FORMATTER = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });

const NUMERALS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

/**
 * A number that rolls into place like a mechanical counter.
 *
 * Each digit position is a clipped window holding a vertical strip of all ten
 * numerals; the strip is translated so the right numeral lands in the window. Because
 * the strip travels a distance proportional to the digit, a 9 physically spins
 * further than a 1 in the same time — the digits move at different speeds, which is
 * what makes it read as a machine rather than a fade. A small left-to-right stagger
 * on top of that settles the places in order, the way a real drum counter does.
 *
 * Driven by a CSS transition rather than a spring per digit. Transform-only, so the
 * whole thing lives in the compositor, and the browser owns the interpolation — ten
 * `useSpring` subscriptions to move ten strips would be a lot of JavaScript to
 * reproduce something CSS already does off the main thread.
 *
 * The final value is server-rendered: strips are positioned on their target digit in
 * the markup, so the number is correct before hydration and correct with JavaScript
 * off. Only a counter still below the fold is wound back to zero to roll — one
 * already on screen has effectively been read, and resetting it would swap a correct
 * number for a wrong one.
 *
 * Assistive technology reads the finished, formatted value from `aria-label`; the
 * rolling strips are `aria-hidden`, so nothing announces a blur of digits.
 */
export function Odometer({
  value,
  duration = 1.2,
  prefix = "",
  suffix = "",
  className,
  ...props
}: OdometerProps) {
  const hostRef = useRef<HTMLSpanElement>(null);
  const stripsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const armedRef = useRef(false);
  const inView = useInView(hostRef, { once: true, amount: 0.6 });
  const reduced = useReducedMotion();

  const digits = FORMATTER.format(value);
  const label = `${prefix}${digits}${suffix}`;

  /* One flat list of cells. Separators, minus signs and the prefix/suffix are static
     characters sharing the same fixed-height box as the digits, so the baseline stays
     put and nothing shifts as the strips move. */
  const cells = useMemo(() => {
    let place = 0;
    return Array.from(`${prefix}${digits}${suffix}`).map((char) => {
      const digit = NUMERALS.indexOf(char);
      return digit >= 0
        ? { char, digit, place: place++ }
        : { char, digit: -1, place: -1 };
    });
  }, [prefix, digits, suffix]);

  // Wind back to zero before the roll — but only for a counter the viewer has not
  // reached yet, and only once we know motion is wanted.
  useEffect(() => {
    const host = hostRef.current;
    if (!host || reduced) return;
    if (host.getBoundingClientRect().top <= window.innerHeight) return;

    for (const strip of stripsRef.current) {
      if (!strip) continue;
      strip.style.transition = "none";
      strip.style.transform = "translateY(0%)";
    }
    armedRef.current = true;
  }, [reduced]);

  useEffect(() => {
    if (!inView || reduced || !armedRef.current) return;
    armedRef.current = false;

    cells.forEach((cell) => {
      if (cell.digit < 0) return;
      const strip = stripsRef.current[cell.place];
      if (!strip) return;
      strip.style.transition = `transform ${duration}s ${EASING} ${cell.place * STAGGER}s`;
      strip.style.transform = `translateY(-${cell.digit * 10}%)`;
    });
  }, [inView, reduced, cells, duration]);

  return (
    <span
      ref={hostRef}
      aria-label={label}
      className={cn("inline-flex items-center tabular-nums", className)}
      {...props}
    >
      {cells.map((cell, i) =>
        cell.digit < 0 ? (
          <span
            key={i}
            aria-hidden
            className="inline-grid place-items-center"
            // 1em with a line-height of 1 is a type metric, not a spacing choice:
            // it is the height of one line box, which is exactly the window a digit
            // has to travel through. No spacing token describes that.
            style={{ height: "1em", lineHeight: 1 }}
          >
            {cell.char}
          </span>
        ) : (
          <span
            key={i}
            aria-hidden
            className="inline-block overflow-hidden"
            style={{ height: "1em", lineHeight: 1 }}
          >
            <span
              ref={(node) => {
                stripsRef.current[cell.place] = node;
              }}
              className="flex flex-col"
              style={{ transform: `translateY(-${cell.digit * 10}%)` }}
            >
              {NUMERALS.map((numeral) => (
                <span
                  key={numeral}
                  className="grid place-items-center"
                  style={{ height: "1em", lineHeight: 1 }}
                >
                  {numeral}
                </span>
              ))}
            </span>
          </span>
        ),
      )}
    </span>
  );
}
