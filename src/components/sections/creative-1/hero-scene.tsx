"use client";

import { useRef, type ComponentProps, type ReactNode } from "react";

import { CableSegment } from "@/components/motion-ui/cable-segment";
import { SCRUB, gsap } from "@/components/motion-ui/gsap-setup";
import {
  MARK_BOX,
  MARK_CHIN,
  MARK_MUZZLE,
  MARK_PATHS,
  MARK_VIEWBOX,
} from "@/components/motion-ui/husky-mark-paths";
import { useScrollScene } from "@/components/motion-ui/use-scroll-scene";
import { HERO } from "@/components/sections/creative-1/content";

const HERO_PHOTO = HERO.image;

/** Where the scale is anchored, as a percentage of the mark box. MARK_MUZZLE sits
 *  in the nose cut-out, so the camera flies *through* the nose: the hole grows
 *  into a window and layer B opens inside it. */
const ORIGIN_X = ((MARK_MUZZLE.x - MARK_BOX.x) / MARK_BOX.width) * 100;
const ORIGIN_Y = ((MARK_MUZZLE.y - MARK_BOX.y) / MARK_BOX.height) * 100;
const ORIGIN = `${ORIGIN_X}% ${ORIGIN_Y}%`;

/** Chin offset below the mark's centre, as a fraction of the mark's height. */
const CHIN_FROM_CENTRE =
  (MARK_CHIN.y - (MARK_BOX.y + MARK_BOX.height / 2)) / MARK_BOX.height;

/**
 * Photo A framing, in mark-box fractions. The photo (2.89:1) is laid out at
 * 1156 × 400 viewBox units with its point (0.66, 0.55) — the lit façade — on
 * (540, 560), the head's centre. 14 units of slack above and below the mark box
 * leave room for the ±12px pointer parallax.
 */
const PHOTO_A_W = 1156;
const PHOTO_A_H = PHOTO_A_W / (HERO_PHOTO.width / HERO_PHOTO.height);
const PHOTO_A = {
  left: ((540 - 0.66 * PHOTO_A_W - MARK_BOX.x) / MARK_BOX.width) * 100,
  top: ((560 - 0.55 * PHOTO_A_H - MARK_BOX.y) / MARK_BOX.height) * 100,
  width: (PHOTO_A_W / MARK_BOX.width) * 100,
  height: (PHOTO_A_H / MARK_BOX.height) * 100,
};

/** A linear scrub on `scale` reads as a lurch then a crawl (1 → 2 doubles the
 *  size in a tenth of the run, 10 → 11 adds a tenth). Exponential scale is what
 *  constant camera speed looks like, so the zoom maps `p` to `to^p`. */
const zoomEase = (to: number) => (p: number) => (Math.pow(to, p) - 1) / (to - 1);

/** Maps the mark's viewBox onto the 0–1 box of `clipPathUnits="objectBoundingBox"`. */
const CLIP_TRANSFORM = `scale(${1 / MARK_BOX.width} ${1 / MARK_BOX.height}) translate(${-MARK_BOX.x} ${-MARK_BOX.y})`;

/** Desktop zoom: the mark ends at 11× its resting size. */
const ZOOM = 11;
/** Solid muzzle around the nose cut-out, in viewBox units from MARK_MUZZLE:
 *  the muzzle's straight sides sit ±42 across, and they run straight to 19
 *  below the nose before the chin chamfers in. Layer B's window stays inside. */
const MUZZLE_HALF_W = 42;
const MUZZLE_HALF_H = 19;
/** Progress at which B's window leaves the muzzle and opens to the frame. */
const B_FULL_FROM = 0.52;
const B_FULL_SPAN = 0.14;

const HIDDEN = "inset(50% 50% 50% 50%)";
/** Phone: the mark's resting size grows at most 1.4×, and layer B stops short
 *  of the window's edges so the silhouette keeps a frame of page around it. */
const MOBILE_ZOOM = 1.4;
const MOBILE_B_END = "inset(8% 8% 8% 8%)";

/** Layout offsets of `el` inside `ancestor`, ignoring transforms. */
function offsetWithin(el: HTMLElement, ancestor: HTMLElement) {
  let x = 0;
  let y = 0;
  let node: HTMLElement | null = el;
  while (node && node !== ancestor) {
    x += node.offsetLeft;
    y += node.offsetTop;
    node = node.offsetParent as HTMLElement | null;
  }
  return { x, y };
}

/*
 * Geometry that both the static render and the scene depend on, in one place.
 *
 *   --c1-g        the .section-x gutter
 *   --c1-col      one of 12 grid columns (gap 1.5rem), from the container width
 *   --c1-mark-w   the mark window: 72svh tall, never wider than columns 8–12
 *   --c1-chin-*   MARK_CHIN in frame coordinates; the cable starts here
 *
 * Plus the one-time load: the outline draws (stroke-dashoffset, pathLength 1) over
 * 1.2s, photo A fades in from 0.8s, and the cable leaves the chin. CSS rather than
 * JS so it runs from first paint — nothing is hidden waiting for hydration — and
 * only under `prefers-reduced-motion: no-preference`.
 */
const SCENE_CSS = `
.c1-hero-frame { --c1-g: clamp(1.5rem, 5vw, 4rem); }
.c1-hero-mark { width: 80vw; }
/* 1px hairline in viewBox units (308 units across the window). Not
   non-scaling-stroke: that breaks the pathLength-based draw. */
.c1-hero-outline path { stroke-width: calc(${MARK_BOX.width} / 312); }
@media (min-width: 48rem) {
  .c1-hero-frame {
    --c1-col: calc((100cqw - 2 * var(--c1-g) - 16.5rem) / 12);
    --c1-mark-w: min(calc(5 * var(--c1-col) + 6rem), calc(72svh * ${MARK_BOX.width} / ${MARK_BOX.height}));
    --c1-mark-h: calc(var(--c1-mark-w) * ${MARK_BOX.height} / ${MARK_BOX.width});
    --c1-chin-x: calc(var(--c1-g) + 9.5 * var(--c1-col) + 13.5rem);
    --c1-chin-y: calc(50% + var(--c1-mark-h) * ${CHIN_FROM_CENTRE});
    --c1-run-y: calc(var(--c1-chin-y) + 2rem);
  }
  .c1-hero-mark { width: var(--c1-mark-w); }
  .c1-hero-outline path { stroke-width: calc(${MARK_BOX.width} / 520); }
}
@keyframes c1-hero-draw { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }
@keyframes c1-hero-fade { from { opacity: 0; } to { opacity: 1; } }
@keyframes c1-hero-grow { from { transform: scale(0); } to { transform: scale(1); } }
@media (prefers-reduced-motion: no-preference) {
  .c1-hero-outline path {
    stroke-dasharray: 1;
    animation: c1-hero-draw 1.2s cubic-bezier(0.16, 1, 0.3, 1) both;
  }
  .c1-hero-photo-a { animation: c1-hero-fade 0.6s ease-out 0.8s backwards; }
  .c1-hero-stub { animation: c1-hero-grow 0.3s ease-out 1s backwards; }
  .c1-hero-run { animation: c1-hero-grow 0.4s ease-out 1.3s backwards; }
}
`;

export interface HeroSceneProps {
  /** The server-rendered copy: eyebrow, h1 (`data-hero-line`), lead, CTAs. */
  children: ReactNode;
  /** Photo A, a next/image element (it carries `data-scroll-scene-hero`). */
  photoA: ReactNode;
  /** `<img>` props for photo B, from `getImageProps`. */
  photoB: ComponentProps<"img">;
}

/**
 * The hero's client scene: the pinned 100svh frame, the mark window, photo B and
 * the cable's first segment. All motion goes through `useScrollScene`, so under
 * reduced motion nothing here runs and the static two-column hero stands.
 */
export function HeroScene({ children, photoA, photoB }: HeroSceneProps) {
  const frameRef = useRef<HTMLDivElement>(null);

  useScrollScene(frameRef, {
    desktop: ({ scope: frame }) => {
      const q = gsap.utils.selector(frame);
      const group = q("[data-hero-mark-group]")[0] as HTMLElement | undefined;
      const layerB = q("[data-hero-b='desktop']")[0] as HTMLElement | undefined;
      const photoBImg = q("[data-hero-b='desktop'] img")[0] as
        | HTMLImageElement
        | undefined;
      const dim = q("[data-hero-dim]")[0];
      const photoAEl = q("[data-hero-photo-a]")[0];
      if (!group || !layerB || !photoBImg) return;

      gsap.set(group, { transformOrigin: ORIGIN });
      // Layer B's "before" state exists only in this branch.
      gsap.set(layerB, { visibility: "visible", clipPath: HIDDEN });
      // Decode B now, not on the frame where its window first opens.
      photoBImg.decode().catch(() => undefined);

      // The nose in frame coordinates, untransformed. The scale is anchored
      // there, so only the group's x/y ever move it.
      const geo = { nx: 0, ny: 0, w: 0, h: 0, unit: 1 };
      const measure = () => {
        const o = offsetWithin(group, frame);
        geo.nx = o.x + (group.offsetWidth * ORIGIN_X) / 100;
        geo.ny = o.y + (group.offsetHeight * ORIGIN_Y) / 100;
        geo.w = frame.clientWidth;
        geo.h = frame.clientHeight;
        geo.unit = group.offsetWidth / MARK_BOX.width;
      };
      measure();

      /*
       * Layer B's window. A rect centred on the nose, growing with the zoom
       * ((s − 1) / (ZOOM − 1) of the frame), but never past the solid muzzle
       * around the nose cut-out, so its edges stay hidden behind photo A's
       * strokes and the hole simply fills with the sharp photograph. From
       * B_FULL_FROM it blends out to the full frame.
       */
      const setB = () => {
        const s = gsap.getProperty(group, "scale") as number;
        const cx = geo.nx + (gsap.getProperty(group, "x") as number);
        const cy = geo.ny + (gsap.getProperty(group, "y") as number);
        const k = Math.max(0, (s - 1) / (ZOOM - 1));
        const hw = Math.min((geo.w / 2) * k, MUZZLE_HALF_W * geo.unit * s);
        const hh = Math.min((geo.h / 2) * k, MUZZLE_HALF_H * geo.unit * s);
        const f = gsap.utils.clamp(0, 1, (tl.progress() - B_FULL_FROM) / B_FULL_SPAN);
        const lerp = (a: number, b: number) => a + (b - a) * f;
        const top = lerp(cy - hh, 0);
        const left = lerp(cx - hw, 0);
        const bottom = lerp(geo.h - (cy + hh), 0);
        const right = lerp(geo.w - (cx + hw), 0);
        layerB.style.clipPath = `inset(${Math.max(0, top)}px ${Math.max(0, right)}px ${Math.max(0, bottom)}px ${Math.max(0, left)}px)`;
      };

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        onUpdate: setB,
        scrollTrigger: {
          trigger: frame,
          start: "top top",
          end: "+=150%",
          pin: true,
          scrub: SCRUB,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onRefresh: () => {
            measure();
            setB();
          },
        },
      });

      tl
        // 0 → 0.30  eyebrow, lead and CTA row lift away
        .to(q("[data-hero='fade']"), { y: -32, opacity: 0, duration: 0.3 }, 0)
        // 0 → 0.45  the two h1 lines part; fade from 0.25
        .to(q("[data-hero-line='0']"), { x: () => -0.14 * window.innerWidth, duration: 0.45 }, 0)
        .to(q("[data-hero-line='1']"), { x: () => 0.14 * window.innerWidth, duration: 0.45 }, 0)
        .to(q("[data-hero-line]"), { opacity: 0, duration: 0.2 }, 0.25)
        // 0 → 0.20  outline and the cable's chin connector
        .to(q("[data-hero-outline], [data-hero-connector]"), { opacity: 0, duration: 0.2 }, 0)
        // 0 → 0.60  fly through the mark, into the nose
        .fromTo(group, { scale: 1 }, { scale: ZOOM, ease: zoomEase(ZOOM), duration: 0.6 }, 0)
        // 0 → 0.45  …while the nose drifts to the frame's centre
        .fromTo(
          group,
          { x: 0, y: 0 },
          {
            x: () => geo.w / 2 - geo.nx,
            y: () => geo.h / 2 - geo.ny,
            ease: "sine.inOut",
            duration: 0.45,
          },
          0,
        )
        // 0.52 → 0.64  the strokes pass the camera as B opens to the frame
        .to(group, { opacity: 0, duration: 0.12 }, B_FULL_FROM)
        // B's photo settles while its window opens (the window itself: setB)
        .fromTo(photoBImg, { scale: 1.15 }, { scale: 1, duration: B_FULL_FROM + B_FULL_SPAN - 0.1 }, 0.1)
        // 0.70 → 1.00  dim for the hand-off to the light Stats band
        .fromTo(dim, { opacity: 0 }, { opacity: 0.55, duration: 0.3 }, 0.7);

      setB();

      // Pointer: photo A drifts ±12px against the cursor — a look through a window.
      if (!photoAEl || !window.matchMedia("(hover: hover)").matches) return;
      const toX = gsap.quickTo(photoAEl, "x", { duration: 0.6, ease: "power3.out" });
      const toY = gsap.quickTo(photoAEl, "y", { duration: 0.6, ease: "power3.out" });
      const onMove = (e: PointerEvent) => {
        const r = frame.getBoundingClientRect();
        toX(-((e.clientX - r.left) / r.width - 0.5) * 24);
        toY(-((e.clientY - r.top) / r.height - 0.5) * 24);
      };
      const onLeave = () => {
        toX(0);
        toY(0);
      };
      frame.addEventListener("pointermove", onMove);
      frame.addEventListener("pointerleave", onLeave);
      return () => {
        frame.removeEventListener("pointermove", onMove);
        frame.removeEventListener("pointerleave", onLeave);
      };
    },

    mobile: ({ scope: frame }) => {
      const q = gsap.utils.selector(frame);
      const win = q("[data-hero-window]")[0];
      const group = q("[data-hero-mark-group]")[0];
      const layerB = q("[data-hero-b='mobile']")[0];
      if (!win || !group || !layerB) return;

      gsap.set(group, { transformOrigin: ORIGIN });
      gsap.set(layerB, { visibility: "visible", clipPath: HIDDEN });

      gsap
        .timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: win,
            start: "top 80%",
            end: "bottom top",
            scrub: SCRUB,
          },
        })
        // Capped at 1.4 and stopping B at an 8% inset: past that the window
        // reads as a plain photo rectangle and the mark is lost.
        .fromTo(group, { scale: 1 }, { scale: MOBILE_ZOOM, ease: zoomEase(MOBILE_ZOOM), duration: 1 }, 0)
        // The mark stays at full strength: its ears, cheeks and jaw run past
        // B's 8% inset, so the silhouette frames the photo instead of
        // dissolving into a rectangle.
        .fromTo(layerB, { clipPath: HIDDEN }, { clipPath: MOBILE_B_END, duration: 0.6 }, 0);
    },
  });

  return (
    <div
      ref={frameRef}
      className="c1-hero-frame section-x group relative grid grid-cols-1 overflow-clip pt-28 pb-20 md:h-svh md:min-h-[42rem] md:grid-cols-12 md:content-center md:items-center md:gap-x-6 md:py-20"
    >
      <style>{SCENE_CSS}</style>

      {/* The mark's clip, in objectBoundingBox units so it fits any box. */}
      <svg aria-hidden="true" className="absolute size-0">
        <clipPath id="c1-hero-mark-clip" clipPathUnits="objectBoundingBox">
          {/* <clipPath> takes shapes only — no <g> — so each path carries the
              viewBox → unit-box transform itself. */}
          {MARK_PATHS.map((d) => (
            <path key={d} d={d} transform={CLIP_TRANSFORM} />
          ))}
        </clipPath>
      </svg>

      {/* Layer B (desktop): full-bleed, behind everything. Invisible until the
          desktop branch gives it its closed clip; never shown otherwise. */}
      <div
        aria-hidden="true"
        data-hero-b="desktop"
        className="invisible absolute inset-0 overflow-hidden max-md:hidden"
      >
        {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text -- getImageProps output */}
        <img
          {...photoB}
          className="absolute inset-0 size-full object-cover object-[68%_50%]"
        />
        <div data-hero-dim="" className="bg-background absolute inset-0 opacity-0" />
      </div>

      {/* Copy — columns 1–7 */}
      <div className="relative z-20 md:col-span-7">{children}</div>

      {/* Mark window — columns 8–12 */}
      <div className="relative z-10 mt-16 flex justify-center md:col-span-5 md:mt-0">
        <div
          data-hero-window=""
          className="c1-hero-mark relative aspect-[308/372] max-md:overflow-hidden"
        >
          {/* Layer B (phone): constrained to the window box. */}
          <div
            aria-hidden="true"
            data-hero-b="mobile"
            className="invisible absolute inset-0 md:hidden"
          >
            {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text -- getImageProps output */}
            <img
              {...photoB}
              sizes="80vw"
              className="absolute inset-0 size-full object-cover object-[64%_60%]"
            />
          </div>

          <div data-hero-mark-group="" className="absolute inset-0">
            {/* Photo A, clipped to the mark */}
            <div
              aria-hidden="true"
              className="absolute inset-0 [clip-path:url(#c1-hero-mark-clip)]"
            >
              <div
                data-hero-photo-a=""
                className="c1-hero-photo-a absolute"
                style={{
                  left: `${PHOTO_A.left}%`,
                  top: `${PHOTO_A.top}%`,
                  width: `${PHOTO_A.width}%`,
                  height: `${PHOTO_A.height}%`,
                }}
              >
                {photoA}
              </div>
            </div>

            {/* 1px outline over the photo */}
            <svg
              aria-hidden="true"
              data-hero-outline=""
              viewBox={MARK_VIEWBOX}
              className="c1-hero-outline text-foreground/24 absolute inset-0 size-full overflow-visible"
              fill="none"
            >
              {MARK_PATHS.map((d) => (
                <path
                  key={d}
                  d={d}
                  pathLength={1}
                  stroke="currentColor"
                />
              ))}
            </svg>
          </div>
        </div>
      </div>

      {/* Cable: from the chin, down 2rem, left to the gutter (desktop only). */}
      <div
        aria-hidden="true"
        data-hero-connector=""
        className="c1-hero-stub bg-foreground/24 pointer-events-none absolute z-10 h-8 w-px origin-top max-md:hidden"
        style={{ left: "var(--c1-chin-x)", top: "var(--c1-chin-y)" }}
      />
      <div
        aria-hidden="true"
        data-hero-connector=""
        className="c1-hero-run bg-foreground/24 pointer-events-none absolute z-10 h-px origin-right max-md:hidden"
        style={{
          left: "calc(var(--c1-g) / 2)",
          width: "calc(var(--c1-chin-x) - var(--c1-g) / 2 + 1px)",
          top: "var(--c1-run-y)",
        }}
      />
      <CableSegment
        first
        pinTrigger={frameRef}
        className="md:top-[var(--c1-run-y)]"
      />
    </div>
  );
}
