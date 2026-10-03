"use client";

import { useEffect } from "react";

import {
  ScrollTrigger,
  registerGsap,
  scheduleRefresh,
} from "@/components/motion-ui/gsap-setup";
import { LENIS_READY_EVENT } from "@/components/motion-ui/smooth-scroll";

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
 *     and refreshes once, so pin spacers are measured against final layout.
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


    return () => {
      cancelled = true;
      window.removeEventListener(LENIS_READY_EVENT, attach);
      window.removeEventListener("load", onLoad);
      unsubscribe?.();
    };
  }, [heroSelector]);

  return <>{children}</>;
}
