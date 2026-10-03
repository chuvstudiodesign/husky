"use client";

import { useRef } from "react";

import { SCRUB, gsap } from "@/components/motion-ui/gsap-setup";
import { RollText } from "@/components/motion-ui/roll-text";
import { useScrollScene } from "@/components/motion-ui/use-scroll-scene";
import { cn } from "@/lib/utils";

/**
 * The name rail. Two renders of the same list, exactly one of which is ever
 * displayed (the other is `display: none`, so it is out of the accessibility tree
 * too):
 *
 *   wide     `.display-1`, ≥ md with motion allowed — the scrubbed nameplate rail
 *   compact  `.display-2`, below md (scrubbed, same code; a step up to 40/44 on
 *            the phone, client 2026-10-03) and under reduced motion (a wrapping
 *            row of solid names)
 *
 * Two lists rather than one because the type classes live in `@layer components`,
 * where Tailwind v4 generates no responsive variants (`md:display-1` is a no-op).
 *
 * Each name is an outline layer (in the a11y tree, via RollText's sr-only copy) and
 * a solid overlay (aria-hidden) clipped from the right by `--clip`. Server render:
 * rail at rest, every solid copy fully shown. The motion build writes `--clip`
 * per frame from each name's distance to the viewport centre: fully filled within
 * ±8vw, empty beyond ±20vw, so only one name is ever mid-fill. While it is, an
 * orange caret (the cable's "live head") rides the clip edge.
 */

const STROKE =
  "text-transparent [-webkit-text-stroke:1px_color-mix(in_oklab,var(--foreground)_48%,transparent)]";

function Name({ name }: { name: string }) {
  return (
    <span data-rail-name="" className="group relative inline-grid">
      {/* Outline — the readable layer. Reduced motion: solid foreground. */}
      <RollText
        className={cn(
          STROKE,
          "col-start-1 row-start-1 motion-reduce:text-foreground motion-reduce:[-webkit-text-stroke:0]",
        )}
      >
        {name}
      </RollText>
      {/* Solid — fills in as the name crosses the viewport centre; fully on while
          hovered (state, 250ms). */}
      <span
        aria-hidden="true"
        data-rail-solid=""
        className={cn(
          "text-foreground col-start-1 row-start-1 [clip-path:inset(0_var(--clip,0%)_0_0)]",
          "transition-[clip-path] duration-250 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:[clip-path:inset(0)] motion-reduce:transition-none",
        )}
      >
        <RollText>{name}</RollText>
      </span>
      {/* Live head: 1px orange caret on the clip edge, shown only while the
          name is mid-fill (`--caret`, written by the motion build; 0 at rest,
          under reduced motion and on hover, where the fill is complete). */}
      <span
        aria-hidden="true"
        data-rail-caret=""
        className="bg-primary pointer-events-none absolute top-1/2 left-0 h-[0.8em] w-px -translate-y-1/2 opacity-[var(--caret,0)] group-hover:opacity-0"
      />
    </span>
  );
}

function Rail({
  names,
  variant,
}: {
  names: readonly string[];
  variant: "wide" | "compact";
}) {
  const wide = variant === "wide";
  return (
    <ul
      data-rail=""
      className={cn(
        "w-max items-center",
        wide
          ? "display-1 hidden gap-[8vw] md:motion-safe:flex"
          : "display-2 flex gap-[12vw] max-md:motion-safe:text-[2.5rem] max-md:motion-safe:leading-[2.75rem] md:motion-safe:hidden motion-reduce:w-auto motion-reduce:flex-wrap motion-reduce:gap-x-12 motion-reduce:gap-y-4",
      )}
    >
      {names.map((name, i) => (
        <li
          key={name}
          className={cn(
            "flex items-center whitespace-nowrap",
            wide ? "gap-[8vw]" : "gap-[12vw] motion-reduce:gap-12",
          )}
        >
          {i > 0 && (
            // Hidden in the wrapping (reduced) row, where a separator would
            // otherwise open the second line.
            <span
              aria-hidden="true"
              className="text-foreground/32 font-mono motion-reduce:hidden"
            >
              ·
            </span>
          )}
          <Name name={name} />
        </li>
      ))}
    </ul>
  );
}

export function PartnersRail({ names }: { names: readonly string[] }) {
  const scopeRef = useRef<HTMLDivElement>(null);

  const build = () => {
    const scope = scopeRef.current;
    if (!scope) return;
    // The displayed list (the other is display: none, so it has no box).
    const rail = Array.from(
      scope.querySelectorAll<HTMLElement>("[data-rail]"),
    ).find((el) => el.getClientRects().length > 0);
    if (!rail) return;

    const names = Array.from(
      rail.querySelectorAll<HTMLElement>("[data-rail-name]"),
    );
    const parts = names.map((el) => {
      const caret = el.querySelector<HTMLElement>("[data-rail-caret]");
      return {
        el,
        setClip: gsap.quickSetter(el, "--clip", "%"),
        setCaret: gsap.quickSetter(el, "--caret"),
        setCaretX: caret ? gsap.quickSetter(caret, "x", "px") : null,
        caret,
      };
    });

    // Filled (0% clip) within ±8vw of the viewport centre, empty (100%) beyond
    // ±20vw, linear between — a narrow ramp, so one name transitions at a time.
    const updateFill = () => {
      const vw = window.innerWidth;
      const centre = vw / 2;
      const full = vw * 0.08;
      const empty = vw * 0.2;
      parts.forEach(({ el, setClip, setCaret, setCaretX }) => {
        const r = el.getBoundingClientRect();
        const d = Math.abs(r.left + r.width / 2 - centre);
        const t = Math.min(Math.max((d - full) / (empty - full), 0), 1);
        setClip(t * 100);
        setCaret(t > 0 && t < 1 ? 1 : 0);
        setCaretX?.(r.width * (1 - t));
      });
    };

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: rail,
        start: "top bottom",
        end: "bottom top",
        scrub: SCRUB,
        invalidateOnRefresh: true,
      },
      // Runs as the smoothed scrub renders, so the fill tracks the rail's actual
      // position rather than the raw scroll.
      onUpdate: updateFill,
    });
    tl.fromTo(
      rail,
      { x: () => window.innerWidth * 0.12 },
      {
        x: () => -(rail.scrollWidth - window.innerWidth * 0.88),
        ease: "none",
      },
    );
    updateFill();

    return () => {
      parts.forEach(({ el, caret }) => {
        el.style.removeProperty("--clip");
        el.style.removeProperty("--caret");
        if (caret) gsap.set(caret, { clearProps: "transform" });
      });
    };
  };

  useScrollScene(scopeRef, { desktop: build, mobile: build });

  return (
    <div ref={scopeRef}>
      <Rail names={names} variant="wide" />
      <Rail names={names} variant="compact" />
    </div>
  );
}
