"use client";

import {
  useCallback,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";

import { CableSegment } from "@/components/motion-ui/cable-segment";
import { MQ, SCRUB, SplitText, gsap } from "@/components/motion-ui/gsap-setup";
import { padMasks } from "@/components/motion-ui/scrub-text";
import { useScrollScene } from "@/components/motion-ui/use-scroll-scene";
import { APPROACH } from "@/components/sections/creative-2/content";
import { cn } from "@/lib/utils";

/* ================================================================== */
/*  Geometry — a two-storey building section, viewBox 0 0 800 600     */
/* ================================================================== */
/*
 * Everything sits on an 8-unit grid except the stair (14 × 20, eight risers from
 * slab to the deck's underside) and the roof (slope 1:2, underside passing through
 * the top plate's outer corners at 152 / 648).
 *
 *   y  38 ridge (roof top)          x 112 / 688  eave fascia
 *   y 176–184 top plate             x 152 / 648  plate + slab ends
 *   y 184–328 upper floor           x 160 / 632  outer stud pairs (+8)
 *   y 328–344 floor deck            x 312 / 488  inner stud pairs (+8)
 *   y 344–504 ground floor
 *   y 504–520 slab, y 520 ground line
 */

type Stud = number;
const STUDS: Stud[] = [160, 312, 488, 632];
const FLOOR_1 = { top: 344, bottom: 504 };
const FLOOR_2 = { top: 184, bottom: 328 };

const studPair = (x: number, top: number, bottom: number) =>
  `M${x} ${top}V${bottom}M${x + 8} ${top}V${bottom}`;

/** Structure, in draw order: ground, slab, floors, studs, roof, stair. 14 paths. */
const STRUCTURE: string[] = [
  // Ground line
  "M24 520H776",
  // Slab on grade
  "M152 504H648V520H152Z",
  // Floor deck between storeys
  "M152 328H648V344H152Z",
  // Top plate / upper ceiling
  "M152 176H648V184H152Z",
  // Studs, ground floor then upper floor, left to right
  ...STUDS.map((x) => studPair(x, FLOOR_1.top, FLOOR_1.bottom)),
  ...STUDS.map((x) => studPair(x, FLOOR_2.top, FLOOR_2.bottom)),
  // Pitched roof with fascia returns: underside 1:2 through the plate corners
  "M112 196L400 52L688 196V182L400 38L112 182Z",
  // Stair: eight 20-unit risers, 14-unit treads, slab to the deck opening
  "M504 504V484H518V464H532V444H546V424H560V404H574V384H588V364H602V344",
];

/** The panel the run starts from, ground floor, left bay. */
const PANEL = "M180 432H204V472H180Z";

/**
 * The wiring, as consecutive segments of one run. Split only so each segment can
 * be drawn in sequence — branches can't be expressed as one continuous stroke.
 * Lengths are exact (rectilinear), used to give each segment its share of time.
 */
const WIRING: { d: string; length: number }[] = [
  // Panel up into the ground-floor ceiling, east through the studs
  { d: "M192 432V352H400", length: 80 + 208 },
  // Drop to the ground-floor wall point
  { d: "M400 352V424", length: 72 },
  // On east
  { d: "M400 352H528", length: 128 },
  // Drop to the stair point
  { d: "M528 352V400", length: 48 },
  // East, up through the deck, back west in the upper ceiling
  { d: "M528 352H576V196H400", length: 48 + 156 + 176 },
  // Drop to the upper wall point
  { d: "M400 196V256", length: 60 },
  // West through the outer wall, out under the eave
  { d: "M400 196H136", length: 264 },
];
const WIRING_LENGTH = WIRING.reduce((sum, s) => sum + s.length, 0);

/** Walls: between the outer studs' inner faces, one per floor. */
const WALL_LEFT = 168;
const WALL_RIGHT = 632;
/** The finished face sits 4 units inside the wall. */
const FACE_INSET = 4;
const WALLS = [FLOOR_1, FLOOR_2].map((f) => ({
  x: WALL_LEFT,
  y: f.top,
  width: WALL_RIGHT - WALL_LEFT,
  height: f.bottom - f.top,
}));

/**
 * Device points in path order. `face` is the x of the nearest finished wall face
 * (the eave point is outside, so its nearest face is the exterior at 160).
 */
const NODES: { x: number; y: number; face: number }[] = [
  { x: 256, y: 352, face: WALL_LEFT + FACE_INSET }, // ground-floor ceiling
  { x: 400, y: 424, face: WALL_LEFT + FACE_INSET }, // ground-floor wall midpoint
  { x: 528, y: 400, face: WALL_RIGHT - FACE_INSET }, // stair
  { x: 400, y: 256, face: WALL_LEFT + FACE_INSET }, // upper wall midpoint
  { x: 264, y: 196, face: WALL_LEFT + FACE_INSET }, // upper ceiling
  { x: 136, y: 196, face: STUDS[0] }, // outside, under the eave
];
const NODE = 8;

/* ================================================================== */
/*  The drawing                                                        */
/* ================================================================== */

/**
 * `ApproachPlan` — the inline SVG. Server markup is the **rough-in** frame:
 * structure, orange wiring and device points, walls not yet closed (clipped to
 * nothing). That is also the reduced-motion state. The scene animates it from
 * blank to closed.
 *
 * Layers, bottom to top: structure → wiring → walls → device points.
 * All strokes are 1px screen pixels (`vector-effect` must be the attribute, not
 * CSS — DrawSVG reads it to measure lengths correctly).
 */
export function ApproachPlan({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 800 600"
      fill="none"
      aria-hidden="true"
      focusable="false"
      className={cn("block overflow-visible", className)}
    >
      {/* Ridge to ground spans y 38–520; drop it 20 so the margins match. */}
      <g transform="translate(0 20)">
        <g
          data-plan="structure"
          className="text-foreground/56"
          stroke="currentColor"
        >
          {STRUCTURE.map((d) => (
            <path key={d} d={d} vectorEffect="non-scaling-stroke" />
          ))}
          <path data-plan="panel" d={PANEL} vectorEffect="non-scaling-stroke" />
        </g>

        <g data-plan="wiring" className="stroke-primary">
          {WIRING.map((s) => (
            <path
              key={s.d}
              d={s.d}
              data-length={s.length}
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </g>

        {WALLS.map((w) => (
          <g
            key={w.y}
            data-plan="wall"
            // Rough-in: the drywall hasn't gone up yet.
            style={{ clipPath: "inset(100% 0% 0% 0%)" }}
          >
            <rect
              x={w.x}
              y={w.y}
              width={w.width}
              height={w.height}
              className="fill-card"
            />
            <rect
              x={w.x + FACE_INSET}
              y={w.y + FACE_INSET}
              width={w.width - FACE_INSET * 2}
              height={w.height - FACE_INSET * 2}
              className="text-foreground/24"
              stroke="currentColor"
              vectorEffect="non-scaling-stroke"
            />
          </g>
        ))}

        <g data-plan="nodes">
          {NODES.map((n) => (
            <g key={`${n.x}-${n.y}`} data-plan="node" className="group/node">
              {/* Leader to the nearest finished wall face — hover only. */}
              <path
                d={`M${n.x} ${n.y}H${n.face}`}
                className="text-foreground/48 opacity-0 transition-opacity duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/node:opacity-100 motion-reduce:transition-none"
                stroke="currentColor"
                vectorEffect="non-scaling-stroke"
              />
              <rect
                x={n.x - NODE / 2}
                y={n.y - NODE / 2}
                width={NODE}
                height={NODE}
                className="fill-primary origin-center transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] [transform-box:fill-box] group-hover/node:scale-150 motion-reduce:transition-none"
              />
              {/* Hit area: an 8-unit square is ~8px at desktop — too small to find. */}
              <rect
                x={n.x - 12}
                y={n.y - 12}
                width={24}
                height={24}
                fill="transparent"
                pointerEvents="all"
              />
            </g>
          ))}
        </g>
      </g>
    </svg>
  );
}

/* ================================================================== */
/*  The scene                                                          */
/* ================================================================== */

type Status = keyof typeof APPROACH.plan.status;

const statusAt = (p: number): Status =>
  p < 0.4 ? "plan" : p < 0.68 ? "roughIn" : "closed";

const subscribeDesktop = (cb: () => void) => {
  const mq = window.matchMedia(MQ.motionDesktop);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};

/** Adds the drawing's tweens to `tl`, positions in timeline progress (0–1). */
function addPlanTweens(tl: gsap.core.Timeline, svg: SVGSVGElement) {
  const q = gsap.utils.selector(svg);
  const structure = q<SVGPathElement>(
    '[data-plan="structure"] > path:not([data-plan="panel"])',
  );
  const panel = q<SVGPathElement>('[data-plan="panel"]');
  const wiringGroup = q<SVGGElement>('[data-plan="wiring"]');
  const wires = q<SVGPathElement>('[data-plan="wiring"] > path');
  const walls = q<SVGGElement>('[data-plan="wall"]');
  const nodes = q<SVGGElement>('[data-plan="node"]');

  // 0.00 → 0.40  structure, stagger 0.02 in source order. The ground line is
  // already a fifth drawn at 0, so the frame never opens on an empty drawing.
  const stagger = 0.02;
  const each = 0.4 - stagger * (structure.length - 1);
  const [ground, ...rest] = structure;
  tl.fromTo(
    ground,
    { drawSVG: "0% 20%" },
    { drawSVG: "100%", duration: each, ease: "none" },
    0,
  );
  tl.fromTo(
    rest,
    { drawSVG: "0%" },
    { drawSVG: "100%", duration: each, stagger, ease: "none" },
    stagger,
  );

  // 0.38 → 0.40  the panel, so the run has somewhere to start
  tl.fromTo(
    panel,
    { drawSVG: "0%" },
    { drawSVG: "100%", duration: 0.02, ease: "none" },
    0.38,
  );

  // 0.40 → 0.65  wiring, segment by segment, time shared by length
  let at = 0.4;
  wires.forEach((wire) => {
    const share = (0.25 * Number(wire.dataset.length)) / WIRING_LENGTH;
    tl.fromTo(
      wire,
      { drawSVG: "0%" },
      { drawSVG: "100%", duration: share, ease: "none" },
      at,
    );
    at += share;
  });

  // 0.45 → 0.68  device points, in path order
  tl.fromTo(
    nodes,
    { scale: 0, transformOrigin: "50% 50%" },
    { scale: 1, duration: 0.08, stagger: 0.03, ease: "none" },
    0.45,
  );

  // 0.68 → 0.90  drywall rises bottom to top, ground floor first
  const [groundWall, upper] = walls;
  tl.fromTo(
    groundWall,
    { clipPath: "inset(100% 0% 0% 0%)" },
    { clipPath: "inset(0% 0% 0% 0%)", duration: 0.14, ease: "none" },
    0.68,
  );
  tl.fromTo(
    upper,
    { clipPath: "inset(100% 0% 0% 0%)" },
    { clipPath: "inset(0% 0% 0% 0%)", duration: 0.14, ease: "none" },
    0.76,
  );

  // 0.70 → 0.90  belt and braces: the run fades behind the drywall
  tl.fromTo(
    wiringGroup,
    { opacity: 1 },
    { opacity: 0, duration: 0.2, ease: "none" },
    0.7,
  );

  // 0.90 → 0.97  the walls are closed: the device points go out with them,
  // last placed first, so the finished house reads clean
  tl.fromTo(
    nodes,
    { opacity: 1 },
    {
      opacity: 0,
      scale: 0,
      duration: 0.05,
      stagger: { each: 0.004, from: "end" },
      ease: "none",
      immediateRender: false,
    },
    0.9,
  );

  // 0.97 → 1.00  hold
  tl.set({}, {}, 1);
}

/** Splits the H2 into masked lines and rises them on `tl` between `from` and
 *  `to` (timeline positions). Re-splits on width change. */
function addHeadingRise(
  tl: gsap.core.Timeline,
  target: HTMLElement,
  from: number,
  to: number,
) {
  return SplitText.create(target, {
    type: "lines",
    mask: "lines",
    aria: "none",
    autoSplit: true,
    onSplit(self) {
      // Room below each mask for descenders; lines start below that room too.
      const pad = padMasks(self);
      const lineStagger = 0.08;
      const span = to - from;
      const each = Math.max(
        span - lineStagger * (self.lines.length - 1),
        span / 2,
      );
      const stagger =
        self.lines.length > 1 ? (span - each) / (self.lines.length - 1) : 0;
      return tl.from(
        self.lines,
        { yPercent: 100, y: pad, duration: each, stagger, ease: "none" },
        from,
      );
    },
  });
}

export interface ApproachSceneProps {
  /** The server-rendered text column. Must contain one element marked
   *  `data-approach-heading` — the aria-hidden copy of the H2 that gets split. */
  text: ReactNode;
}

/**
 * The animated part of Approach: the pinned frame, the cable segment and the
 * drawing with its annotations. The text column arrives server-rendered.
 *
 *   ≥ md, motion   pin the frame for 160vh; one scrubbed timeline drives the
 *                  drawing and the status label. The H2 rises on its own
 *                  trigger as the frame approaches, finished before the pin.
 *   < md, motion   no pin; the drawing's timeline scrubs on the drawing's own
 *                  passage, and the H2 has its own trigger.
 *   reduced        nothing builds — the rough-in frame stands.
 */
export function ApproachScene({ text }: ApproachSceneProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const figureRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<Status>("roughIn");
  const statusRef = useRef<Status>("roughIn");

  const pinned = useSyncExternalStore(
    subscribeDesktop,
    () => window.matchMedia(MQ.motionDesktop).matches,
    () => false,
  );

  const updateStatus = useCallback((p: number) => {
    const next = statusAt(p);
    if (next === statusRef.current) return;
    statusRef.current = next;
    setStatus(next);
  }, []);

  const resetStatus = useCallback(() => {
    statusRef.current = "roughIn";
    setStatus("roughIn");
  }, []);

  useScrollScene(frameRef, {
    desktop: ({ scope }) => {
      const svg = figureRef.current?.querySelector("svg");
      const heading = scope.querySelector<HTMLElement>(
        "[data-approach-heading]",
      );
      if (!svg) return;

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: scope,
          start: "top top",
          end: "+=160%",
          pin: true,
          scrub: SCRUB,
          invalidateOnRefresh: true,
          onUpdate: (self) => updateStatus(self.progress),
          onRefresh: (self) => updateStatus(self.progress),
        },
      });
      addPlanTweens(tl, svg);

      // The H2 rises on the approach, before the pin, so it is already in place
      // when the frame locks — the pinned scene never opens on a hole.
      let split: SplitText | null = null;
      if (heading) {
        const htl = gsap.timeline({
          scrollTrigger: {
            trigger: scope,
            start: "top 75%",
            end: "top 20%",
            scrub: SCRUB,
          },
        });
        split = addHeadingRise(htl, heading, 0, 1);
      }

      return () => {
        split?.revert();
        resetStatus();
      };
    },

    mobile: ({ scope }) => {
      const figure = figureRef.current;
      const svg = figure?.querySelector("svg");
      const heading = scope.querySelector<HTMLElement>(
        "[data-approach-heading]",
      );
      if (!svg || !figure) return;

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: figure,
          start: "top 75%",
          end: "bottom 25%",
          scrub: SCRUB,
          invalidateOnRefresh: true,
          onUpdate: (self) => updateStatus(self.progress),
          onRefresh: (self) => updateStatus(self.progress),
        },
      });
      addPlanTweens(tl, svg);

      let split: SplitText | null = null;
      if (heading) {
        const htl = gsap.timeline({
          scrollTrigger: {
            trigger: heading,
            start: "top 85%",
            end: "top 40%",
            scrub: SCRUB,
          },
        });
        split = addHeadingRise(htl, heading, 0, 1);
      }

      return () => {
        split?.revert();
        resetStatus();
      };
    },
  });

  const statusLabel = APPROACH.plan.status[status];

  return (
    <div
      ref={frameRef}
      className="group section-x section-y relative md:flex md:h-svh md:items-center md:py-16"
    >
      <CableSegment pinTrigger={pinned ? frameRef : undefined} />

      <div className="grid w-full gap-12 md:grid-cols-12 md:items-center md:gap-x-8">
        <div className="md:col-span-5">{text}</div>

        <div className="md:col-span-7">
          {/* Phone: a single status label above the drawing. */}
          <p className="meta mb-4 md:hidden">{statusLabel}</p>

          <div
            ref={figureRef}
            className="relative mx-auto aspect-[4/3] w-full md:max-w-[96svh]"
          >
            <ApproachPlan className="absolute inset-0 size-full" />
            {/* Corner annotations — labels of the drawing's state. */}
            <p className="meta absolute top-0 left-0 hidden md:block">
              {APPROACH.plan.section}
            </p>
            <p className="meta absolute top-0 right-0 hidden md:block">
              {statusLabel}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
