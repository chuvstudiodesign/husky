"use client";

import { useRef, useSyncExternalStore } from "react";

import { CableSegment } from "@/components/motion-ui/cable-segment";
import {
  MQ,
  SCRUB,
  ScrollTrigger,
  gsap,
} from "@/components/motion-ui/gsap-setup";
import { ScrubOdometer } from "@/components/motion-ui/scrub-odometer";
import { addScrubText } from "@/components/motion-ui/scrub-text";
import { useScrollScene } from "@/components/motion-ui/use-scroll-scene";
import type { Stat } from "@/components/sections/creative-2/content";
import { cn } from "@/lib/utils";

/*
 * Timeline units. The spec writes the scene in progress fractions (windows of
 * 0.20); the shared text helper tweens for 0.5 units, so the whole scene is laid
 * out at 2.5× and one 0.20 window is exactly one helper tween long.
 */
const UNIT = 2.5;
const WINDOW = 0.2 * UNIT;
/** The line draws over 0 → 0.80; 0.80 → 1.00 is the hold. */
const DRAW = 0.8 * UNIT;
const TOTAL = 1 * UNIT;
/** A column's tick snaps up at its window start: a short scrubbed tween. */
const TICK = 0.03 * UNIT;
/** A figure fades up over the first part of its window, as its roll begins, so
 *  no column ever shows a row of zero placeholders ahead of the head. */
const REVEAL = WINDOW * 0.3;

/** Phone: scroll px per px of the row's sideways travel, as in Services. */
const STICK_FACTOR = 0.8;

const VISIBLE = "inset(0% 0% 0% 0%)";
const HIDDEN_RIGHT = "inset(0% 100% 0% 0%)";

/** Desktop motion branch, as React state, so the cable only follows the pin
 *  where a pin exists. Server snapshot: no pin. */
function subscribeDesktop(cb: () => void) {
  const mq = window.matchMedia(MQ.motionDesktop);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}
function useMotionDesktop() {
  return useSyncExternalStore(
    subscribeDesktop,
    () => window.matchMedia(MQ.motionDesktop).matches,
    () => false,
  );
}

/**
 * Rolls every digit strip in `el` from 0 to its target. A strip whose target is 0
 * in a multi-digit figure ("20") makes one full turn, 0 → 9 → 0, so every digit
 * visibly reads out. Mirrors `addOdometer` (which tweens a 0-target strip by
 * nothing) and adds the full turn the spec asks for.
 */
function addFigureRoll(
  tl: gsap.core.Timeline,
  el: Element,
  position: number,
  duration: number,
) {
  const strips = el.querySelectorAll<HTMLElement>("[data-odometer-strip]");
  strips.forEach((strip) => {
    const d = Number(strip.dataset.odometerStrip);
    if (d === 0 && strips.length > 1) {
      // 0 … 9 across the window, then the wrap back to 0 as it closes.
      tl.fromTo(
        strip,
        { y: 0, yPercent: 0 },
        { yPercent: -90, duration: duration * 0.9, ease: "none" },
        position,
      ).set(strip, { yPercent: 0 }, position + duration);
    } else {
      tl.fromTo(
        strip,
        { y: 0, yPercent: 0 },
        { yPercent: -d * 10, duration, ease: "none" },
        position,
      );
    }
  });
}

/** The same roll, timed — hover feedback, not scroll. */
function playFigureRoll(el: Element) {
  const strips = el.querySelectorAll<HTMLElement>("[data-odometer-strip]");
  strips.forEach((strip) => {
    const d = Number(strip.dataset.odometerStrip);
    const turn = d === 0 && strips.length > 1;
    gsap.fromTo(
      strip,
      { y: 0, yPercent: 0 },
      {
        yPercent: turn ? -90 : -d * 10,
        duration: turn ? 0.54 : 0.6,
        ease: turn ? "none" : "power3.out",
        overwrite: "auto",
        onComplete: turn
          ? () => {
              gsap.set(strip, { yPercent: 0 });
            }
          : undefined,
      },
    );
  });
}

/** The written figure ("South Florida"), one word per line. */
function WordFigure({ value }: { value: string }) {
  return (
    <span data-stat-wipe="" className="block">
      <span className="sr-only">{value}</span>
      <span aria-hidden="true" className="block">
        {value.split(" ").map((word) => (
          <span key={word} className="block">
            {word}
          </span>
        ))}
      </span>
    </span>
  );
}

export interface StatsSceneProps {
  items: readonly Stat[];
}

/**
 * The readout. Desktop (motion): the frame pins for 100vh while the measure line
 * draws left to right and each column reads out in its 0.20 window. Phone
 * (motion): the same row, one figure wide; the stage sticks while the row is
 * scrubbed sideways and each cell draws its rule, figure and label as it arrives.
 * Reduced motion: no scene is built and the server render — final figures, fully
 * drawn line — is the layout.
 */
export function StatsScene({ items }: StatsSceneProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const motionDesktop = useMotionDesktop();

  useScrollScene(frameRef, {
    desktop: ({ scope }) => {
      const line = scope.querySelector<HTMLElement>("[data-stats-line]");
      const fill = scope.querySelector<HTMLElement>("[data-stats-fill]");
      const head = scope.querySelector<HTMLElement>("[data-stats-head]");
      const cols = Array.from(
        scope.querySelectorAll<HTMLElement>("[data-stats-col]"),
      );
      if (!line || !fill || !head) return;

      scope.dataset.live = "";

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: scope,
          start: "top top",
          // Shortened from +=100%: the band is the page's quiet moment, not a
          // long hold on an empty field.
          end: "+=70%",
          pin: true,
          scrub: SCRUB,
          invalidateOnRefresh: true,
        },
      });

      tl.fromTo(
        fill,
        { scaleX: 0 },
        { scaleX: 1, duration: DRAW, transformOrigin: "left center" },
        0,
      ).fromTo(
        head,
        { x: 0 },
        { x: () => line.offsetWidth - head.offsetWidth, duration: DRAW },
        0,
      );

      cols.forEach((col, i) => {
        const at = i * WINDOW;
        const tick = col.querySelector("[data-stats-tick]");
        const wipe = col.querySelector('[data-fig="lg"] [data-stat-wipe]');
        const odo = col.querySelector('[data-fig="lg"] [data-scrub-odometer]');
        const suffix = odo?.querySelector(
          ":scope > [aria-hidden] > :last-child:not(.relative)",
        );
        const label = col.querySelector<HTMLElement>("[data-stats-label]");

        if (tick) {
          tl.fromTo(tick, { scaleY: 0 }, { scaleY: 1, duration: TICK }, at);
        }
        if (wipe) {
          tl.fromTo(
            wipe,
            { clipPath: HIDDEN_RIGHT },
            { clipPath: VISIBLE, duration: WINDOW },
            at,
          );
        }
        if (odo) {
          // Hidden (autoAlpha 0, rendered immediately) until the head reaches
          // this column, then revealed as it rolls.
          tl.fromTo(
            odo,
            { autoAlpha: 0 },
            { autoAlpha: 1, duration: REVEAL },
            at,
          );
          addFigureRoll(tl, odo, at, WINDOW);
        }
        if (suffix) {
          // The "+" lands as the roll closes.
          tl.fromTo(
            suffix,
            { opacity: 0 },
            { opacity: 1, duration: WINDOW * 0.2 },
            at + WINDOW * 0.8,
          );
        }
        if (label)
          addScrubText(tl, label, { split: "chars", effect: "spread" }, at);
      });

      // Hold: nothing moves for the last 20%, so the readout can be read.
      tl.to({}, { duration: TOTAL - tl.duration() }, tl.duration());

      // Hover: re-run a column's figure once, as a timed state tween. Only once
      // the readout has finished, so it never fights the scrub.
      const offs = cols.map((col) => {
        const onEnter = () => {
          if (tl.progress() < 0.8) return;
          const odo = col.querySelector(
            '[data-fig="lg"] [data-scrub-odometer]',
          );
          const wipe = col.querySelector('[data-fig="lg"] [data-stat-wipe]');
          if (odo) playFigureRoll(odo);
          if (wipe) {
            gsap.fromTo(
              wipe,
              { clipPath: HIDDEN_RIGHT },
              {
                clipPath: VISIBLE,
                duration: 0.6,
                ease: "power3.out",
                overwrite: "auto",
              },
            );
          }
        };
        col.addEventListener("pointerenter", onEnter);
        return () => col.removeEventListener("pointerenter", onEnter);
      });

      return () => {
        offs.forEach((off) => off());
        delete scope.dataset.live;
      };
    },

    mobile: ({ scope }) => {
      const stage = scope.querySelector<HTMLElement>("[data-stats-stage]");
      const track = scope.querySelector<HTMLElement>("[data-stats-track]");
      const cells = Array.from(
        scope.querySelectorAll<HTMLElement>("[data-stats-col]"),
      );
      if (!stage || !track) return;

      // The same row the desktop reads, on a screen one figure wide: the frame
      // is made tall, its stage sticks, and the row is scrubbed sideways under
      // one continuous rule. Sticky, not a pin, as in Services.
      scope.dataset.mode = "track";
      const distance = () =>
        Math.max(
          0,
          track.offsetWidth + 2 * track.offsetLeft - window.innerWidth,
        );
      const size = () => {
        scope.style.height = `${stage.offsetHeight + distance() * STICK_FACTOR}px`;
      };
      size();
      ScrollTrigger.addEventListener("refreshInit", size);

      const main = gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: scope,
          start: "top top",
          end: () => "+=" + distance() * STICK_FACTOR,
          scrub: SCRUB,
          invalidateOnRefresh: true,
        },
      });

      cells.forEach((cell) => {
        const rule = cell.querySelector("[data-stats-rule]");
        const wipe = cell.querySelector('[data-fig="sm"] [data-stat-wipe]');
        const odo = cell.querySelector('[data-fig="sm"] [data-scrub-odometer]');
        const suffix = odo?.querySelector(
          ":scope > [aria-hidden] > :last-child:not(.relative)",
        );
        const label = cell.querySelector<HTMLElement>("[data-stats-label]");

        // A cell already on screen when the band arrives reads out as the band
        // rises into view; the rest read out as the row brings them in.
        const onScreen = cell.offsetLeft < window.innerWidth * 0.85;
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: onScreen
            ? { trigger: scope, start: "top 70%", end: "top 15%", scrub: SCRUB }
            : {
                trigger: cell,
                containerAnimation: main,
                start: "left 90%",
                end: "left 35%",
                scrub: SCRUB,
              },
        });
        if (rule) {
          tl.fromTo(
            rule,
            { scaleX: 0 },
            { scaleX: 1, duration: WINDOW, transformOrigin: "left center" },
            0,
          );
        }
        if (wipe) {
          tl.fromTo(
            wipe,
            { clipPath: HIDDEN_RIGHT },
            { clipPath: VISIBLE, duration: WINDOW },
            0,
          );
        }
        if (odo) {
          tl.fromTo(
            odo,
            { autoAlpha: 0 },
            { autoAlpha: 1, duration: REVEAL },
            0,
          );
          addFigureRoll(tl, odo, 0, WINDOW);
        }
        if (suffix) {
          tl.fromTo(
            suffix,
            { opacity: 0 },
            { opacity: 1, duration: WINDOW * 0.2 },
            WINDOW * 0.8,
          );
        }
        if (label)
          addScrubText(tl, label, { split: "chars", effect: "spread" }, 0);
      });

      return () => {
        ScrollTrigger.removeEventListener("refreshInit", size);
        scope.style.height = "";
        delete scope.dataset.mode;
      };
    },
  });

  return (
    <div
      ref={frameRef}
      className="group/stats section-x section-y relative max-md:data-[mode=track]:py-0 md:h-svh md:py-0"
    >
      <CableSegment
        tone="light"
        pinTrigger={motionDesktop ? frameRef : undefined}
      />

      {/* On the phone, in track mode, this is the sticky screen; it reaches
          into both gutters so the row is clipped at the screen's edge. */}
      <div
        data-stats-stage=""
        className="relative h-full max-md:in-data-[mode=track]:sticky max-md:in-data-[mode=track]:top-0 max-md:in-data-[mode=track]:-mx-6 max-md:in-data-[mode=track]:flex max-md:in-data-[mode=track]:h-svh max-md:in-data-[mode=track]:items-center max-md:in-data-[mode=track]:overflow-clip max-md:in-data-[mode=track]:px-6"
      >
        {/* Measure line (desktop): a navy-900/24 track, a /48 fill and, while a
            motion branch runs, the orange draw head riding the fill's end. */}
        <div
          data-stats-line=""
          aria-hidden="true"
          className="absolute inset-x-0 top-1/2 hidden h-px md:block"
        >
          <div className="bg-navy-900/24 absolute inset-0" />
          <div
            data-stats-fill=""
            className="bg-navy-900/48 absolute inset-0 origin-left"
          />
          <div
            data-stats-head=""
            className="bg-primary absolute top-1/2 left-0 hidden h-4 w-0.5 -translate-y-1/2 group-data-[live]/stats:block"
          />
        </div>

        <dl
          data-stats-track=""
          className="grid grid-cols-2 gap-x-6 gap-y-12 max-md:in-data-[mode=track]:flex max-md:in-data-[mode=track]:w-max max-md:in-data-[mode=track]:items-end max-md:in-data-[mode=track]:gap-0 md:h-full md:grid-cols-[repeat(4,1fr)] md:grid-rows-2 md:gap-x-8 md:gap-y-0"
        >
          {items.map((s, i) => (
            <div
              key={s.label}
              data-stats-col=""
              className={cn(
                // Track mode on the phone: 64vw, no gap, so the per-cell rules
                // butt into one line and the next figure shows at the edge.
                "group/col relative flex flex-col max-md:in-data-[mode=track]:w-[64vw] max-md:in-data-[mode=track]:shrink-0 md:row-span-2 md:grid md:grid-rows-subgrid",
                i === 0 && "col-span-2 md:col-span-1",
              )}
            >
              {/* Column tick (desktop), on the line at the column's left edge.
                  Hover lights it orange — a state, by opacity. */}
              <span
                data-stats-tick=""
                aria-hidden="true"
                className="bg-navy-900/48 absolute top-1/2 left-0 hidden h-4 w-px -translate-y-1/2 md:block"
              >
                <span className="bg-primary absolute inset-0 opacity-0 transition-opacity duration-250 ease-[cubic-bezier(0.16,1,0.3,1)] md:group-hover/col:opacity-100" />
              </span>

              <dt className="eyebrow text-brand-black order-3 mt-4 md:order-none md:row-start-2 md:mt-0 md:self-start md:pt-4">
                <span className="sr-only">{s.label}</span>
                <span data-stats-label="" aria-hidden="true" className="block">
                  {s.label}
                </span>
                {/* [VERIFY] when `s.verify`: flagged in content.ts, as on `/`. */}
              </dt>

              {/* The figure renders once per branch: `sm` below md, `lg` from md.
                  Both are display-1 (the band is the page's quiet moment, so the
                  phone steps up from display-2 too); the copies stay separate
                  because each motion branch scopes to its own through `data-fig`.
                  The other copy is display:none, out of the accessibility tree. */}
              <dd className="text-navy-900 order-1 md:order-none md:row-start-1 md:self-end md:pb-6">
                {(["sm", "lg"] as const).map((size) => (
                  <span
                    key={size}
                    data-fig={size}
                    className={cn(
                      "block",
                      size === "sm"
                        ? "display-1 md:hidden"
                        : "display-1 hidden md:block",
                    )}
                  >
                    {s.numeric ? (
                      <ScrubOdometer value={s.value} suffix={s.suffix} />
                    ) : (
                      <WordFigure value={s.value} />
                    )}
                  </span>
                ))}
              </dd>

              {/* Per-cell rule (phone). */}
              <span
                aria-hidden="true"
                className="relative order-2 mt-4 block h-px md:hidden"
              >
                <span className="bg-navy-900/24 absolute inset-0" />
                <span
                  data-stats-rule=""
                  className="bg-navy-900/48 absolute inset-0 origin-left"
                />
              </span>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
