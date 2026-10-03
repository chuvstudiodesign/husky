import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { useGSAP } from "@gsap/react";

/**
 * P1 — one place where GSAP is configured for scroll scenes.
 *
 * Every scroll-linked primitive and section imports from here rather than from
 * `gsap/*` directly, so the plugins are registered exactly once and the shared
 * constants (scrub smoothing, the motion media queries) never drift between files.
 */

let registered = false;

/** Registers ScrollTrigger, SplitText, DrawSVGPlugin and useGSAP. Idempotent, and a
 *  no-op on the server. */
export function registerGsap() {
  if (registered || typeof window === "undefined") return;
  gsap.registerPlugin(ScrollTrigger, SplitText, DrawSVGPlugin, useGSAP);
  // iOS address-bar show/hide resizes the viewport on every direction change.
  // Refreshing on it makes pins jump; ignore it.
  ScrollTrigger.config({ ignoreMobileResize: true });
  registered = true;
}

/** Scrub smoothing, in seconds. Lenis already smooths the wheel; more than this
 *  makes pinned scenes feel laggy. */
export const SCRUB = 0.3;

/** The state-change curve (CSS), paired with a 250ms duration. Scrubbed tweens use
 *  `ease: "none"` so motion stays linear to scroll. */
export const STATE_EASE = "cubic-bezier(0.16, 1, 0.3, 1)";

/** The two motion-allowed branches. Under reduced motion neither matches, so no
 *  scene is built and the server-rendered final state stands. */
export const MQ = {
  motionDesktop:
    "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
  motionMobile:
    "(max-width: 767.98px) and (prefers-reduced-motion: no-preference)",
} as const;

let refreshFrame = 0;

/** Coalesces many `ScrollTrigger.refresh()` requests (one per scene as it builds)
 *  into a single refresh on the next frame. */
export function scheduleRefresh() {
  if (typeof window === "undefined") return;
  cancelAnimationFrame(refreshFrame);
  refreshFrame = requestAnimationFrame(() => {
    ScrollTrigger.sort();
    ScrollTrigger.refresh();
  });
}

export { gsap, ScrollTrigger, SplitText, DrawSVGPlugin, useGSAP };
