"use client";

import { useEffect, useRef, type RefObject } from "react";

import { SCRUB, ScrollTrigger, gsap } from "@/components/motion-ui/gsap-setup";
import { useScrollScene } from "@/components/motion-ui/use-scroll-scene";
import { cn } from "@/lib/utils";

export interface CableSegmentProps {
  /** `dark` on the #090A0F surface, `light` on the brand-light band. */
  tone?: "dark" | "light";
  /** The run's first segment. Its origin is drawn by the section (the mark's
   *  chin), so it has no junction node. */
  first?: boolean;
  /** The run's last segment. The live head hides once the fill completes, where
   *  the section's terminus drawing takes over. */
  last?: boolean;
  /** When the section pins, pass the pinned element. The fill then tracks the
   *  pin's progress instead of the section's passage through the viewport. */
  pinTrigger?: RefObject<HTMLElement | null>;
  /** Called when the junction node powers on / off (state, not scrubbed). */
  onPowerChange?: (on: boolean) => void;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * P5 — one segment of the page's cable run.
 *
 * Place it as a direct child of a `relative` section. It sits at half the section's
 * horizontal gutter (`.section-x`: 32px at 1440, 12px at 390) and spans the
 * section's full height; override with `className`/`style` to shorten it.
 *
 *   track   1px, full height, foreground/12 (navy-900/16 on light)
 *   fill    1px, scaleY 0 → 1 from `top center` to `bottom center`, scrubbed
 *   head    1px × 24px orange tip riding the fill's leading edge
 *   node    8px square at the top; fills orange once the head passes it, with a
 *           250ms CSS transition, and reverses on scroll-up
 *
 * While the node is on, the segment's parent element carries `data-powered`, so a
 * section can restyle its eyebrow with `group-data-[powered]:text-foreground`
 * (give the section `group`) or `[[data-powered]_&]:text-foreground`.
 *
 * Server render and reduced motion: fully drawn at foreground/24, node outlined.
 * Decorative: aria-hidden, pointer-events none.
 */
export function CableSegment({
  tone = "dark",
  first = false,
  last = false,
  pinTrigger,
  onPowerChange,
  className,
  style,
}: CableSegmentProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const nodeRef = useRef<HTMLDivElement>(null);
  const powerRef = useRef(onPowerChange);
  useEffect(() => {
    powerRef.current = onPowerChange;
  });

  const build = () => {
    const root = rootRef.current;
    const fill = fillRef.current;
    const head = headRef.current;
    if (!root || !fill || !head) return;
    const section = root.parentElement ?? root;

    // Find the pin's own ScrollTrigger lazily: the section creates it in its own
    // scene, which may build after this one. Function-based start/end are
    // re-evaluated on every refresh, and refreshPriority -1 refreshes us after it.
    const pinEl = pinTrigger?.current ?? null;
    const findPin = () =>
      pinEl
        ? ScrollTrigger.getAll().find(
            (st) => st.pin === pinEl || (st.trigger === pinEl && st.pin),
          )
        : undefined;

    const triggerEl = pinEl ?? section;
    const start = pinEl ? () => findPin()?.start ?? "top top" : "top center";
    const end = pinEl
      ? () => findPin()?.end ?? "bottom center"
      : "bottom center";

    root.dataset.live = "";

    const setPower = (on: boolean) => {
      if (on) section.dataset.powered = "";
      else delete section.dataset.powered;
      if (nodeRef.current) nodeRef.current.dataset.on = on ? "true" : "false";
      powerRef.current?.(on);
    };

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: triggerEl,
        start: start as ScrollTrigger.Vars["start"],
        end: end as ScrollTrigger.Vars["end"],
        scrub: SCRUB,
        invalidateOnRefresh: true,
        refreshPriority: pinEl ? -1 : 0,
        onLeave: () => {
          if (last) gsap.to(head, { opacity: 0, duration: 0.25 });
        },
        onEnterBack: () => {
          if (last) gsap.to(head, { opacity: 1, duration: 0.25 });
        },
      },
    });
    tl.fromTo(fill, { scaleY: 0 }, { scaleY: 1, ease: "none" }, 0).fromTo(
      head,
      { y: () => -head.offsetHeight },
      { y: () => root.offsetHeight - head.offsetHeight, ease: "none" },
      0,
    );

    // The node is state: on once the head has passed the top, off again on the
    // way back up. Not scrubbed.
    ScrollTrigger.create({
      trigger: triggerEl,
      start: start as ScrollTrigger.Vars["start"],
      end: "max",
      refreshPriority: pinEl ? -1 : 0,
      onToggle: (self) => setPower(self.isActive),
    });

    return () => {
      delete root.dataset.live;
      setPower(false);
    };
  };

  useScrollScene(rootRef, { desktop: build, mobile: build }, [
    pinTrigger,
    last,
  ]);

  const light = tone === "light";

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      data-cable-segment=""
      className={cn(
        "group/cable pointer-events-none absolute inset-y-0 z-10 w-px",
        className,
      )}
      style={{
        // Half the .section-x gutter. `--gutter` lets a page override it.
        left: "calc(var(--gutter, clamp(1.5rem, 5vw, 4rem)) / 2)",
        ...style,
      }}
    >
      {/* Track, fill and head share a clip so the head never pokes past the
          segment's ends. The node sits outside it, as it is wider than 1px. */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Track */}
        <div
          className={cn(
            "absolute inset-0",
            light ? "bg-navy-900/16" : "bg-foreground/12",
          )}
        />
        {/* Fill — static at /24, live at /48 */}
        <div
          ref={fillRef}
          className={cn(
            "absolute inset-0 origin-top",
            light
              ? "bg-navy-900/24 group-data-[live]/cable:bg-navy-900/48"
              : "bg-foreground/24 group-data-[live]/cable:bg-foreground/48",
          )}
        />
        {/* Live head — only exists while a motion branch runs */}
        <div
          ref={headRef}
          className="bg-primary absolute top-0 left-0 hidden h-6 w-px group-data-[live]/cable:block"
        />
      </div>
      {/* Junction node */}
      {!first && (
        <div
          ref={nodeRef}
          data-on="false"
          className={cn(
            "absolute top-0 left-1/2 size-2 -translate-x-1/2 rounded-none border transition-colors duration-250 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none",
            light
              ? "border-navy-900/24 bg-brand-light"
              : "border-foreground/24 bg-background",
            "data-[on=true]:border-primary data-[on=true]:bg-primary",
          )}
        />
      )}
    </div>
  );
}
