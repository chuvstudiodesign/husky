"use client";

import { useEffect } from "react";
import Lenis from "lenis";

export interface SmoothScrollProps {
  /** How long the wheel's momentum takes to settle, in seconds. */
  duration?: number;
  /** Multiplier on wheel delta. Below 1 slows the page down. */
  wheelMultiplier?: number;
  children: React.ReactNode;
}

/**
 * Momentum scrolling, without hijacking the page.
 *
 * The distinction matters. Most "smooth scroll" libraries take over scrolling
 * entirely and break the things people actually rely on — anchor links, find-in-page,
 * keyboard paging, the scrollbar. Lenis interpolates the native scroll position
 * instead, so all of that keeps working; the page just carries a little inertia.
 *
 * Three things are deliberately switched off:
 *
 *   · **Reduced motion.** If the viewer asked for less movement, momentum is exactly
 *     the kind they meant. Native scroll is restored entirely.
 *   · **Touch.** Phones already have momentum, tuned by the OS. Re-implementing it
 *     in JS makes it worse, never better.
 *   · **Cleanup on unmount**, so navigating away leaves scrolling untouched.
 */
export function SmoothScroll({
  duration = 1.1,
  wheelMultiplier = 1,
  children,
}: SmoothScrollProps) {
  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduced) return;

    const lenis = new Lenis({
      duration,
      wheelMultiplier,
      // Slightly overdamped exponential: quick to respond, no bounce at the end.
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      syncTouch: false,
    });

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    // In-page anchors go through Lenis so they inherit the same easing rather
    // than jumping while the rest of the page glides.
    const onClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement)?.closest?.('a[href*="#"]');
      if (!anchor) return;
      const href = anchor.getAttribute("href") ?? "";
      const hash = href.slice(href.indexOf("#"));
      if (hash.length < 2) return;
      const target = document.querySelector(hash);
      if (!target) return;
      e.preventDefault();
      // No offset here: `section[id] { scroll-margin-top: 5rem }` in globals.css
      // already clears the fixed header, and Lenis honours scroll-margin. Adding
      // one on top of the other landed every anchor 80px too low.
      lenis.scrollTo(target as HTMLElement);
    };

    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("click", onClick);
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, [duration, wheelMultiplier]);

  return <>{children}</>;
}
