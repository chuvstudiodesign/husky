"use client";

import { useEffect } from "react";

import {
  ScrollTrigger,
  registerGsap,
  scheduleRefresh,
} from "@/components/motion-ui/gsap-setup";
import { LENIS_READY_EVENT } from "@/components/motion-ui/smooth-scroll";

/** How long after mount a hash arrival keeps being re-landed, in ms. */
const LANDING_WINDOW = 4000;
/** Any of these means the visitor has taken over the scroll. */
const LANDING_INPUTS = ["wheel", "touchstart", "keydown", "pointerdown"] as const;

export interface ScrollSceneRootProps {
  /** Images whose decode should finish before the first full refresh. Defaults to
   *  anything marked `data-scroll-scene-hero` (put it on the hero `<Image>`). */
  heroSelector?: string;
  children: React.ReactNode;
}

/**
 * P3 — page-level host for scroll scenes. Mount once per page, around the sections.
 *
 *   · registers GSAP;
 *   · keeps ScrollTrigger in step with Lenis (`lenis.on("scroll", ScrollTrigger.update)`),
 *     whether Lenis starts before or after this component;
 *   · after `window` load and the hero image's decode, sorts triggers into page order
 *     and refreshes once, so pin spacers are measured against final layout;
 *   · when the page was opened on a `#section`, lands on it again once the pins
 *     above it have taken their space.
 *
 * Renders no element of its own.
 */
export function ScrollSceneRoot({
  heroSelector = "[data-scroll-scene-hero]",
  children,
}: ScrollSceneRootProps) {
  useEffect(() => {
    registerGsap();
    let cancelled = false;

    // --- Lenis sync ------------------------------------------------------
    let unsubscribe: (() => void) | undefined;
    const attach = () => {
      const lenis = window.__lenis;
      if (!lenis || unsubscribe) return;
      unsubscribe = lenis.on("scroll", ScrollTrigger.update);
    };
    attach();
    window.addEventListener(LENIS_READY_EVENT, attach);

    // --- Settle after load + hero decode ---------------------------------
    const settle = async () => {
      const imgs = Array.from(
        document.querySelectorAll<HTMLImageElement>(
          `img${heroSelector}, ${heroSelector} img`,
        ),
      );
      await Promise.all(imgs.map((img) => img.decode().catch(() => undefined)));
      if (cancelled) return;
      scheduleRefresh();
    };
    const onLoad = () => void settle();
    if (document.readyState === "complete") onLoad();
    else window.addEventListener("load", onLoad, { once: true });

    // --- Arriving on a hash ------------------------------------------------
    // The browser scrolls to `#section` before any scene has built, and every
    // pin above the target then adds its spacer and pushes the target down.
    // Re-land on it after each refresh, until the layout has settled or the
    // visitor scrolls for themselves.
    const stopLanding = () => {
      ScrollTrigger.removeEventListener("refresh", land);
      LANDING_INPUTS.forEach((type) =>
        window.removeEventListener(type, stopLanding),
      );
      window.clearTimeout(landingTimer);
    };
    const land = () => {
      const target = document.getElementById(
        decodeURIComponent(window.location.hash.slice(1)),
      );
      if (!target) return;
      if (window.__lenis) {
        window.__lenis.scrollTo(target, { immediate: true, force: true });
      } else {
        const margin = parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
        window.scrollTo({
          top: target.getBoundingClientRect().top + window.scrollY - margin,
          behavior: "instant",
        });
      }
    };
    let landingTimer = 0;
    if (window.location.hash.length > 1) {
      ScrollTrigger.addEventListener("refresh", land);
      LANDING_INPUTS.forEach((type) =>
        window.addEventListener(type, stopLanding, { once: true, passive: true }),
      );
      landingTimer = window.setTimeout(stopLanding, LANDING_WINDOW);
    }

    return () => {
      cancelled = true;
      stopLanding();
      window.removeEventListener(LENIS_READY_EVENT, attach);
      window.removeEventListener("load", onLoad);
      unsubscribe?.();
    };
  }, [heroSelector]);

  return <>{children}</>;
}
