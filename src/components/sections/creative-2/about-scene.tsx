"use client";

import { useRef, type ReactNode } from "react";

import { SCRUB, gsap } from "@/components/motion-ui/gsap-setup";
import { addScrubText } from "@/components/motion-ui/scrub-text";
import { useScrollScene } from "@/components/motion-ui/use-scroll-scene";

/**
 * Creative 2 — About's scroll scene. The markup is server-rendered by `about.tsx`
 * and passed in as children; this wrapper only finds it by data attribute and
 * scrubs it. Under reduced motion no branch matches and the static layout stands.
 *
 *   [data-about-copy]    the paragraphs column (desktop trigger)
 *   [data-about-split]   one per paragraph, the visual copy to split into words
 *   [data-about-mark]    the outline mark; `[data-bright]` is its /72 stroke layer
 */
export function AboutScene({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const scopeRef = useRef<HTMLDivElement>(null);

  const parts = (scope: HTMLElement) => ({
    copy: scope.querySelector<HTMLElement>("[data-about-copy]"),
    splits: Array.from(
      scope.querySelectorAll<HTMLElement>("[data-about-split]"),
    ),
    mark: scope.querySelector<SVGSVGElement>("[data-about-mark]"),
    paths: Array.from(
      scope.querySelectorAll<SVGPathElement>("[data-about-mark] path"),
    ),
    bright: scope.querySelector<SVGGElement>("[data-about-mark] [data-bright]"),
  });

  /** Words light 0.28 → 1 (dim, but legible ahead of the reader) in reading
   *  order, paragraph after paragraph, on one timeline. Returns the timeline's length in its own time units. */
  const addParagraphs = (tl: gsap.core.Timeline, splits: HTMLElement[]) => {
    for (const el of splits) {
      addScrubText(tl, el, { split: "words", effect: "light", dim: 0.28 });
    }
    return tl.duration() || 1;
  };

  /** DrawSVG 0 → 100% across `total`; the /72 layer fades in over the last 10%. */
  const addMark = (
    tl: gsap.core.Timeline,
    paths: SVGPathElement[],
    bright: SVGGElement | null,
    total: number,
  ) => {
    tl.fromTo(
      paths,
      { drawSVG: "0%" },
      { drawSVG: "100%", duration: total, ease: "none" },
      0,
    );
    if (bright) {
      tl.fromTo(
        bright,
        { opacity: 0 },
        { opacity: 1, duration: total * 0.1, ease: "none" },
        total * 0.9,
      );
    }
  };

  useScrollScene(scopeRef, {
    desktop: ({ scope }) => {
      const { copy, splits, paths, bright } = parts(scope);
      if (!copy) return;
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: copy,
          // Lights just ahead of the reader's eye, finishing as the last line
          // reaches the lower fifth of the viewport.
          start: "top 85%",
          end: "bottom 80%",
          scrub: SCRUB,
        },
      });
      const total = addParagraphs(tl, splits);
      addMark(tl, paths, bright, total);
    },
    mobile: ({ scope }) => {
      const { copy, splits, mark, paths, bright } = parts(scope);
      if (!copy || !mark) return;
      const text = gsap.timeline({
        scrollTrigger: {
          trigger: copy,
          start: "top 85%",
          end: "bottom 85%",
          scrub: SCRUB,
        },
      });
      addParagraphs(text, splits);
      // On the phone the mark sits after the copy, so it gets its own trigger.
      const draw = gsap.timeline({
        scrollTrigger: {
          trigger: mark,
          start: "top 90%",
          end: "bottom 60%",
          scrub: SCRUB,
        },
      });
      addMark(draw, paths, bright, 1);
    },
  });

  return (
    <div ref={scopeRef} className={className}>
      {children}
    </div>
  );
}
