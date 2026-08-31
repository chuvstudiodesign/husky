"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";
import { HuskyMark } from "@/components/motion-ui/husky-mark";

/**
 * Sections the mark darkens over by default, keyed by element id.
 *
 * Only the light band. On every dark section the brand orange sits correctly, so
 * it stays; over the light grey Approach it loses its footing, and the card colour
 * turns the mark into a dark silhouette instead.
 *
 * Pass `darkOver={[]}` to switch the behaviour off entirely and keep the mark in
 * brand colour throughout.
 */
const DEFAULT_DARK_OVER = ["approach"];

export interface HalfMarkProps extends React.ComponentProps<"div"> {
  /** Viewport height the mark occupies at rest, on desktop. */
  height?: number;
  /** Viewport height it occupies at rest, on a phone. */
  mobileHeight?: number;
  /** Edge length of the docked badge, in pixels. */
  dockedSize?: number;
  /** Pixels of scroll before it docks or recedes. */
  threshold?: number;
  /**
   * Element ids the mark repaints dark over. Pass `[]` to keep it in brand colour
   * for the whole page.
   */
  darkOver?: string[];
}

/**
 * The Husky wolf, bisected by the edge of the viewport, reacting to scroll.
 *
 * At rest the mark's horizontal centre sits exactly on the screen edge, so half the
 * face is visible and half runs off. It is fixed, so it holds that position while
 * the page scrolls past it.
 *
 * Three behaviours are layered on top:
 *
 *   · **Docking.** Desktop has room to keep the mark where it is, so it stays put
 *     at full size and recedes to 10% — a watermark rather than a subject. A phone
 *     does not, so the mark collapses into a small badge in the bottom-right corner
 *     and gets out of the way.
 *
 *   · **Colour.** The mark repaints as it passes over sections of different tone.
 *     The probe is the mark's own vertical centre, not the section entering the
 *     viewport, so the change fires exactly as the boundary crosses the middle of
 *     the wolf — and it is symmetric, so scrolling back up reverses it at the same
 *     line.
 *
 *   · **Mobile offset.** At rest on a phone the mark sits 10px below centre, which
 *     drops the ears clear of the headline.
 *
 * Every state is written out per breakpoint rather than inherited, because a
 * half-specified variant silently keeps a value from the other branch — which is
 * exactly how the desktop mark once collapsed to badge size.
 *
 * Purely decorative and hidden from assistive technology. It sits at z-20: above
 * the opaque section backgrounds, which would otherwise bury it, below the hero
 * copy at z-30, and below the header at z-40.
 */
export function HalfMark({
  height = 78,
  mobileHeight = 49.4,
  dockedSize = 70,
  threshold = 8,
  darkOver = DEFAULT_DARK_OVER,
  className,
  style,
  ...props
}: HalfMarkProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let frame = 0;

    const update = () => {
      frame = 0;
      setScrolled(window.scrollY > threshold);

      // Which section is under the middle of the mark right now?
      const rect = el.getBoundingClientRect();
      const probe = rect.top + rect.height / 2;

      let over = false;
      for (const id of darkOver) {
        const section = document.getElementById(id);
        if (!section) continue;
        const s = section.getBoundingClientRect();
        if (probe >= s.top && probe < s.bottom) {
          over = true;
          break;
        }
      }
      setDark(over);
    };

    // Coalesce to one read per frame — scroll fires far faster than paint.
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [threshold, darkOver]);

  return (
    <div
      ref={ref}
      aria-hidden
      data-half-mark=""
      data-state={scrolled ? "docked" : "rest"}
      data-tone={dark ? "dark" : "brand"}
      className={cn(
        "pointer-events-none fixed z-20 select-none",
        "transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
        "motion-reduce:transition-none",

        // Colour follows the section beneath, on its own shorter timing so the
        // repaint reads as a change of light rather than as a separate animation.
        dark ? "text-[color:var(--card)]" : "text-[color:var(--primary)]",
        "[transition-property:all,color] [transition-duration:700ms,350ms]",

        scrolled
          ? [
              // Phone — collapse into the bottom-right corner.
              "top-auto right-4 bottom-4 h-[var(--mark-docked)] translate-x-0 translate-y-0 opacity-100",
              // Desktop — hold position and size, recede to a watermark.
              "md:top-1/2 md:right-0 md:bottom-auto md:h-[var(--mark-h)] md:translate-x-1/2 md:-translate-y-1/2 md:opacity-10",
            ]
          : [
              // Phone at rest sits 10px below centre; desktop stays centred.
              "top-1/2 right-0 bottom-auto h-[var(--mark-h-sm)] translate-x-1/2 -translate-y-[calc(50%-10px)] opacity-100",
              "md:h-[var(--mark-h)] md:-translate-y-1/2",
            ],
        className,
      )}
      style={
        {
          "--mark-h": `${height}vh`,
          "--mark-h-sm": `${mobileHeight}vh`,
          "--mark-docked": `${dockedSize}px`,
          ...style,
        } as React.CSSProperties
      }
      {...props}
    >
      <HuskyMark className="h-full w-auto" />
    </div>
  );
}
