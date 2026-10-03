import type { gsap } from "gsap";

import { cn } from "@/lib/utils";

export interface ScrubOdometerProps {
  /** The final figure, as authored ("20", "8", "1,200"). Non-digits render as-is. */
  value: string;
  /** Static trailing text, e.g. "+". */
  suffix?: string;
  className?: string;
}

const DIGITS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

/**
 * P7 — a figure whose digits roll into place as you scroll.
 *
 * Each digit is a 0–9 vertical strip inside a one-line `overflow-hidden` cell.
 * The server renders every strip already parked on its final digit, so the figure
 * reads correctly with no JS and under reduced motion. Motion is added by a scene
 * calling `addOdometer` on its scrubbed timeline — it is never time-based.
 *
 * Not a client component: no hooks, safe in a Server Component.
 */
export function ScrubOdometer({ value, suffix, className }: ScrubOdometerProps) {
  return (
    <span
      data-scrub-odometer=""
      className={cn("inline-flex tabular-nums", className)}
    >
      <span className="sr-only">
        {value}
        {suffix}
      </span>
      <span aria-hidden="true" className="inline-flex">
        {Array.from(value).map((ch, i) => {
          const d = DIGITS.indexOf(ch);
          if (d === -1) {
            return (
              <span key={i} className="whitespace-pre">
                {ch}
              </span>
            );
          }
          return (
            <span key={i} className="relative inline-block overflow-hidden">
              {/* Sizer: holds the cell at exactly one digit, one line. */}
              <span className="invisible">{ch}</span>
              <span
                data-odometer-strip={d}
                className="absolute inset-x-0 top-0 flex flex-col"
                style={{ transform: `translateY(${-d * 10}%)` }}
              >
                {DIGITS.map((n) => (
                  <span key={n} className="block text-center">
                    {n}
                  </span>
                ))}
              </span>
            </span>
          );
        })}
        {suffix && <span>{suffix}</span>}
      </span>
    </span>
  );
}

/**
 * Adds the roll for one odometer to a (scrubbed) timeline. Each strip goes from 0
 * to its target digit with `ease: "none"`. The `fromTo` renders the 0 state
 * immediately, so call this only inside a motion-allowed scene branch.
 *
 * `el` is the `ScrubOdometer` root or any ancestor containing exactly one.
 */
export function addOdometer(
  tl: gsap.core.Timeline,
  el: Element,
  position: gsap.Position = 0,
  duration = 1,
) {
  const strips = el.querySelectorAll<HTMLElement>("[data-odometer-strip]");
  strips.forEach((strip) => {
    const d = Number(strip.dataset.odometerStrip);
    // y: 0 discards the server's inline translate, so yPercent is the only offset.
    tl.fromTo(
      strip,
      { y: 0, yPercent: 0 },
      { yPercent: -d * 10, duration, ease: "none" },
      position,
    );
  });
  return tl;
}
