"use client";

import { useLayoutEffect, useRef, type RefObject } from "react";

import {
  MQ,
  gsap,
  registerGsap,
  scheduleRefresh,
  useGSAP,
} from "@/components/motion-ui/gsap-setup";

export interface ScrollSceneContext {
  /** The scope element. Selector strings passed to gsap inside `build` are scoped
   *  to it. */
  scope: HTMLElement;
  /** Which motion branch matched. */
  branch: "desktop" | "mobile";
  /** The gsap.matchMedia context. Everything created inside `build` is recorded in
   *  it and reverted when the branch stops matching or the component unmounts. */
  context: gsap.Context;
}

export type ScrollSceneBuild = (
  ctx: ScrollSceneContext,
) => void | (() => void);

export interface ScrollSceneBuilders {
  /** ≥ 768px, motion allowed. */
  desktop?: ScrollSceneBuild;
  /** < 768px, motion allowed. */
  mobile?: ScrollSceneBuild;
}

/**
 * P2 — the only way a section builds scroll motion.
 *
 * `useGSAP` + `gsap.matchMedia()` keyed on `MQ`. Under reduced motion neither
 * branch matches, nothing is built, and the server-rendered final state stands —
 * so "before" states only ever exist inside a motion branch.
 *
 * Builds wait for `document.fonts.ready` (line splits and measured heights depend on
 * the real fonts), then request one coalesced `ScrollTrigger.refresh()`. Everything
 * reverts on unmount, on breakpoint change, and when `deps` change.
 *
 * The latest `build` functions are always used, so inline closures are fine; pass
 * `deps` only for values that should force a rebuild.
 */
export function useScrollScene(
  scope: RefObject<HTMLElement | null>,
  build: ScrollSceneBuilders,
  deps: unknown[] = [],
) {
  const buildRef = useRef(build);
  // Keep the latest closures without rebuilding. Declared before useGSAP so it
  // runs first in the same commit.
  useLayoutEffect(() => {
    buildRef.current = build;
  });

  useGSAP(
    () => {
      registerGsap();
      const el = scope.current;
      if (!el) return;

      let cancelled = false;
      const mm = gsap.matchMedia();

      const add = (query: string, branch: "desktop" | "mobile") => {
        mm.add(
          query,
          (context) => {
            const fn = buildRef.current[branch];
            return fn ? fn({ scope: el, branch, context }) : undefined;
          },
          el,
        );
      };

      document.fonts.ready.then(() => {
        if (cancelled) return;
        if (buildRef.current.desktop) add(MQ.motionDesktop, "desktop");
        if (buildRef.current.mobile) add(MQ.motionMobile, "mobile");
        scheduleRefresh();
      });

      return () => {
        cancelled = true;
        mm.revert();
      };
    },
    { scope, dependencies: deps, revertOnUpdate: true },
  );
}
