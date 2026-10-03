"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { SCRUB, STATE_EASE, gsap } from "@/components/motion-ui/gsap-setup";
import { MARK_BOX, MARK_CHIN } from "@/components/motion-ui/husky-mark-paths";
import { addScrubText } from "@/components/motion-ui/scrub-text";
import { useScrollScene } from "@/components/motion-ui/use-scroll-scene";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  The band + the cable's terminus                                    */
/* ------------------------------------------------------------------ */

interface Run {
  w: number;
  h: number;
  d: string;
}

/**
 * Measures the terminus route in band coordinates. Two legs, like a conduit on a
 * drawing: down the gutter, then one straight run right into the mark's chin.
 * The horizontal leg sits below every line of copy and the channel list, so it
 * neither splits the H2 from its sub nor boxes the columns in (an earlier
 * version turned at the H2 and dropped between the columns; with the gutter it
 * closed into a rectangle that read as a table border).
 */
function measureRun(band: HTMLElement): Run | null {
  const mark = band.querySelector<SVGSVGElement>("[data-contact-mark]");
  if (!mark) return null;

  const b = band.getBoundingClientRect();
  // +0.5 puts a 1px stroke on a whole device pixel.
  const px = (n: number) => Math.round(n) + 0.5;

  const gutter = parseFloat(getComputedStyle(band).paddingLeft) || 24;
  const x0 = px(gutter / 2);
  const m = mark.getBoundingClientRect();
  const chinX = px(m.left - b.left + (m.width * (MARK_CHIN.x - MARK_BOX.x)) / MARK_BOX.width);
  const chinY = px(m.top - b.top + (m.height * (MARK_CHIN.y - MARK_BOX.y)) / MARK_BOX.height);

  return {
    w: Math.round(b.width),
    h: Math.round(b.height),
    d: `M${x0} 0V${chinY}H${chinX}`,
  };
}

/**
 * Creative 2 — Contact's band and scroll scene. Server markup arrives as
 * children; the scene finds it by data attribute.
 *
 *   trigger 1  band `top bottom → top 35%` (phone: `top 50%`): the orange rises
 *              from the bottom edge (clip-path), the H2 tracks in from 0.4
 *   trigger 2  band `top 35% → bottom bottom`: the cable's last run draws
 *              (0–0.35), the mark outline draws (0.30–0.80), the fill wipes
 *              up from the chin (0.85–0.95) — a hard edge, never a
 *              part-opacity black over orange
 *
 * Channels and CTA are never scrubbed. Static (server, reduced motion): a solid
 * band, the run drawn, the mark filled.
 */
export function ContactBand({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const bandRef = useRef<HTMLDivElement>(null);
  const nodeRef = useRef<HTMLDivElement>(null);
  const [run, setRun] = useState<Run | null>(null);

  useLayoutEffect(() => {
    const band = bandRef.current;
    if (!band) return;
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const next = measureRun(band);
        setRun((prev) =>
          prev && next && prev.d === next.d && prev.w === next.w && prev.h === next.h
            ? prev
            : next,
        );
      });
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(band);
    document.fonts.ready.then(update);
    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
    };
  }, []);

  const build =
    (branch: "desktop" | "mobile") =>
    ({ scope }: { scope: HTMLElement }) => {
      const h2 = scope.querySelector<HTMLElement>("[data-contact-split]");
      const cable = scope.querySelector<SVGPathElement>("[data-contact-run]");
      const outline = Array.from(
        scope.querySelectorAll<SVGPathElement>("[data-contact-outline] path"),
      );
      const wipe = scope.querySelector<SVGRectElement>("[data-contact-wipe]");
      const node = nodeRef.current;

      // Trigger 1 — the breaker. Child tweens default to 0.6 so the H2 spans
      // 0.4 → 1 of the clip's 0 → 1.
      const rise = gsap.timeline({
        defaults: { duration: 0.6, ease: "none" },
        scrollTrigger: {
          trigger: scope,
          start: "top bottom",
          end: branch === "desktop" ? "top 35%" : "top 50%",
          scrub: SCRUB,
        },
      });
      rise.fromTo(
        scope,
        { clipPath: "inset(100% 0% 0% 0%)" },
        { clipPath: "inset(0% 0% 0% 0%)", duration: 1 },
        0,
      );
      if (h2) {
        // Spread at 44px on a narrow measure jitters; the phone rises by line.
        addScrubText(
          rise,
          h2,
          branch === "desktop"
            ? { split: "chars", effect: "spread" }
            : { split: "lines", effect: "rise" },
          0.4,
        );
      }

      // Trigger 2 — the terminus.
      const setNode = (on: boolean) => {
        if (node) node.dataset.on = on ? "true" : "false";
      };
      const draw = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: scope,
          start: branch === "desktop" ? "top 35%" : "top 50%",
          end: "bottom bottom",
          scrub: SCRUB,
          // The node is state, not scrub: on as the run starts, off on the way
          // back above it.
          onEnter: () => setNode(true),
          onLeaveBack: () => setNode(false),
        },
      });
      if (cable) {
        draw.fromTo(cable, { drawSVG: "0%" }, { drawSVG: "100%", duration: 0.35 }, 0);
      }
      if (outline.length) {
        draw.fromTo(outline, { drawSVG: "0%" }, { drawSVG: "100%", duration: 0.5 }, 0.3);
      }
      if (wipe) {
        // The clip rect rises from the mark's foot to its crown.
        draw.fromTo(
          wipe,
          { attr: { y: MARK_BOX.y + MARK_BOX.height, height: 0 } },
          { attr: { y: MARK_BOX.y, height: MARK_BOX.height }, duration: 0.1 },
          0.85,
        );
      }
      // Pad to a full unit so the fill lands at 0.95, not at the end.
      draw.set({}, {}, 1);

      return () => setNode(false);
    };

  // Rebuild when the measured run changes, so DrawSVG reads the new length.
  useScrollScene(
    bandRef,
    { desktop: build("desktop"), mobile: build("mobile") },
    [run?.d],
  );

  return (
    <div ref={bandRef} className={cn("relative overflow-hidden", className)}>
      {/* Junction node — the run's last. Brand-black on the band, not orange:
          orange on orange is no signal. */}
      <div
        ref={nodeRef}
        aria-hidden="true"
        data-on="false"
        className="border-brand-black data-[on=true]:bg-brand-black pointer-events-none absolute top-0 z-10 size-2 -translate-x-1/2 rounded-none border transition-colors duration-250 motion-reduce:transition-none"
        style={{
          left: "calc(var(--gutter, clamp(1.5rem, 5vw, 4rem)) / 2)",
          transitionTimingFunction: STATE_EASE,
        }}
      />
      {run && (
        <svg
          aria-hidden="true"
          focusable="false"
          width={run.w}
          height={run.h}
          viewBox={`0 0 ${run.w} ${run.h}`}
          fill="none"
          className="pointer-events-none absolute inset-0 z-10"
        >
          <path
            data-contact-run=""
            d={run.d}
            strokeWidth={1}
            strokeLinejoin="miter"
            strokeLinecap="square"
            className="stroke-brand-black"
          />
        </svg>
      )}
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  COPY affordance                                                    */
/* ------------------------------------------------------------------ */

/** Mono `COPY` → `COPIED` for 1.6s. A state change, not decoration. */
export function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      return;
    }
    setCopied(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <>
      <button
        type="button"
        onClick={copy}
        aria-label={`Copy ${label.toLowerCase()}`}
        className="meta text-brand-black focus-visible:outline-brand-black relative shrink-0 cursor-pointer outline-offset-4 after:absolute after:-inset-3.5 after:content-[''] hover:underline hover:underline-offset-4 focus-visible:outline-2"
      >
        {copied ? "COPIED" : "COPY"}
      </button>
      <span role="status" className="sr-only">
        {copied ? `${label} copied` : ""}
      </span>
    </>
  );
}
