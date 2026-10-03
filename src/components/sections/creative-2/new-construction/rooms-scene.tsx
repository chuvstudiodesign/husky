"use client";

import { useRef, type ReactNode } from "react";

import { SCRUB, gsap } from "@/components/motion-ui/gsap-setup";
import { useScrollScene } from "@/components/motion-ui/use-scroll-scene";

/** One icon's draw, in timeline units. */
const DRAW = 1;
/** Offset between neighbouring icons when they share a trigger (desktop row). */
const STEP = 0.4;

/**
 * One icon drawing itself, starting at `at`: the blueprint grid fades in, the
 * lines draw in drawing order, and the orange signal switches on last. The same
 * sequence the Services plates use, without the panel wipe.
 */
function addIconDraw(tl: gsap.core.Timeline, room: HTMLElement, at: number) {
  const q = gsap.utils.selector(room);
  const paths = q("[data-icon-path]");
  const span = DRAW * 0.8;
  const stagger = paths.length > 1 ? (span * 0.5) / (paths.length - 1) : 0;
  tl.fromTo(
    q("[data-icon-grid]"),
    { opacity: 0 },
    { opacity: 1, ease: "none", duration: DRAW * 0.3 },
    at,
  )
    .fromTo(
      paths,
      { drawSVG: "0%" },
      { drawSVG: "100%", ease: "none", duration: span * 0.5, stagger },
      at,
    )
    .fromTo(
      q("[data-icon-signal]"),
      { scale: 0, transformOrigin: "50% 50%" },
      { scale: 1, ease: "none", duration: DRAW * 0.1 },
      at + DRAW * 0.85,
    );
}

/**
 * Creative 2, New Construction — the rooms' scroll scene. The markup is
 * server-rendered by `rooms.tsx` and passed in as children; this wrapper finds
 * each `[data-room]` and draws its icon. Text is never touched.
 *
 * desktop  the three sit in one row, so one trigger draws them left to right.
 * mobile   they stack, so each draws on its own entry.
 * reduced motion  neither branch runs; the finished drawings stand.
 */
export function RoomsScene({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const scopeRef = useRef<HTMLUListElement>(null);

  const rooms = (scope: HTMLElement) =>
    Array.from(scope.querySelectorAll<HTMLElement>("[data-room]"));

  useScrollScene(scopeRef, {
    desktop: ({ scope }) => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: scope,
          start: "top 85%",
          end: "top 35%",
          scrub: SCRUB,
        },
      });
      rooms(scope).forEach((room, i) => addIconDraw(tl, room, i * STEP));
    },
    mobile: ({ scope }) => {
      for (const room of rooms(scope)) {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: room,
            start: "top 85%",
            end: "top 45%",
            scrub: SCRUB,
          },
        });
        addIconDraw(tl, room, 0);
      }
    },
  });

  return (
    <ul ref={scopeRef} className={className}>
      {children}
    </ul>
  );
}
