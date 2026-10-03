"use client";

import { useEffect, useRef, type ReactNode } from "react";

import { CableSegment } from "@/components/motion-ui/cable-segment";
import { SCRUB, gsap } from "@/components/motion-ui/gsap-setup";
import {
  MARK_BOX,
  MARK_CHIN,
  MARK_PATHS,
  MARK_VIEWBOX,
} from "@/components/motion-ui/husky-mark-paths";
import { useScrollScene } from "@/components/motion-ui/use-scroll-scene";
import { HERO } from "@/components/sections/creative-2/content";

const HERO_PHOTO = HERO.image;

/**
 * Where the zoom is anchored: the largest solid block of the mark, the chin
 * under the nose. The mark is a cut-out here, so scaling about a point inside
 * that block only ever grows the hole; it never sweeps a band of the mark
 * across the camera. Half-extents are the block's, in viewBox units, measured
 * from the path (a 1.6:1 rectangle that stays inside the fill).
 */
const ZOOM_AT = { x: 535, y: 695 } as const;
const ZOOM_HALF_W = 17;
const ZOOM_HALF_H = 10;
const ORIGIN_X = ((ZOOM_AT.x - MARK_BOX.x) / MARK_BOX.width) * 100;
const ORIGIN_Y = ((ZOOM_AT.y - MARK_BOX.y) / MARK_BOX.height) * 100;

/** Chin offset below the mark's centre, as a fraction of the mark's height. */
const CHIN_FROM_CENTRE =
  (MARK_CHIN.y - (MARK_BOX.y + MARK_BOX.height / 2)) / MARK_BOX.height;

/**
 * Phone photo framing. The photo fills the stage's height at its own 2.89:1 and
 * is slid so that its point 0.66 across, the lit façade, sits on the stage's
 * centre line, which is where the mark is.
 */
const PHOTO_PHONE: React.CSSProperties = {
  aspectRatio: `${HERO_PHOTO.width} / ${HERO_PHOTO.height}`,
  left: "50%",
  transform: "translateX(-66%)",
};

/**
 * The veil: one dark sheet with the mark cut out of it (even-odd), reaching
 * far past the window on every side so it covers the whole frame. The photo
 * stands still behind it; only the sheet moves, so the house is seen through
 * a growing mark-shaped hole.
 */
const REACH = 4000;
const VEIL_D = `M${MARK_BOX.x - REACH} ${MARK_BOX.y - REACH}H${MARK_BOX.x + MARK_BOX.width + REACH}V${MARK_BOX.y + MARK_BOX.height + REACH}H${MARK_BOX.x - REACH}Z${MARK_PATHS.join("")}`;

/** A linear scrub on `scale` reads as a lurch then a crawl. Exponential scale
 *  is what constant camera speed looks like, so the zoom maps `p` to `to^p`. */
const zoomEase = (to: number) => (p: number) =>
  (Math.pow(to, p) - 1) / (to - 1);

/** Scales the veil by `s` about ZOOM_AT, then moves it `x`/`y` (viewBox units). */
function setCamera(
  el: Element,
  { s, x, y }: { s: number; x: number; y: number },
) {
  el.setAttribute(
    "transform",
    `translate(${ZOOM_AT.x + x} ${ZOOM_AT.y + y}) scale(${s}) translate(${-ZOOM_AT.x} ${-ZOOM_AT.y})`,
  );
}

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

/** Phone: how far the stage stays stuck while the hole grows, in lvh. */
const MOBILE_TRAVEL = 140;

/** The zoom anchor in `box` pixels, and how far the veil must scale for the
 *  solid chin block, centred, to cover `box`. */
const zoomGeometry = () => ({ ox: 0, oy: 0, w: 0, h: 0, unit: 1, zoom: 20 });

function measureZoom(
  geo: ReturnType<typeof zoomGeometry>,
  win: HTMLElement,
  box: HTMLElement,
) {
  const o = offsetWithin(win, box);
  geo.unit = win.offsetWidth / MARK_BOX.width;
  geo.ox = o.x + (win.offsetWidth * ORIGIN_X) / 100;
  geo.oy = o.y + (win.offsetHeight * ORIGIN_Y) / 100;
  geo.w = box.clientWidth;
  geo.h = box.clientHeight;
  geo.zoom =
    1.1 *
    Math.max(
      geo.w / 2 / (ZOOM_HALF_W * geo.unit),
      geo.h / 2 / (ZOOM_HALF_H * geo.unit),
    );
}

/*
 * Geometry that both the static render and the scene depend on, in one place.
 *
 *   --c2-g        the .section-x gutter
 *   --c2-col      one of 12 grid columns (gap 1.5rem), from the container width
 *   --c2-mark-w   the mark window: 72svh tall, never wider than columns 8–12
 *   --c2-chin-*   MARK_CHIN in frame coordinates; the cable starts here
 *
 * Phone, motion allowed: the track is 240lvh tall and the stage sticks inside it
 * for 140lvh while the hole grows (the scene below scrubs it). Sticky rather
 * than a ScrollTrigger pin: a pin is positioned from scroll events, which a
 * phone delivers late, and it shudders. The track is pulled up under the copy
 * so the mark rests 4rem below the CTAs, as it does without the stage. `lvh`,
 * so the stage still covers the screen once the browser's bars retract.
 *
 * The intro's "before" state lives here too, keyed on `data-intro="pending"`,
 * which the server renders. It holds the outline undrawn, the photo dark and
 * the cable unlaid until the intro (JS, below) plays it. Only under
 * `prefers-reduced-motion: no-preference`, and the copy is never part of it.
 */
const SCENE_CSS = `
.c2-hero-frame { --c2-g: clamp(1.5rem, 5vw, 4rem); }
.c2-hero-mark { width: 80vw; }
/* 1px hairline in viewBox units (308 units across the window). Not
   non-scaling-stroke: that breaks the pathLength-based draw. */
.c2-hero-outline path { stroke-width: calc(${MARK_BOX.width} / 312); }
@media (min-width: 48rem) {
  .c2-hero-frame {
    --c2-col: calc((100cqw - 2 * var(--c2-g) - 16.5rem) / 12);
    --c2-mark-w: min(calc(5 * var(--c2-col) + 6rem), calc(72svh * ${MARK_BOX.width} / ${MARK_BOX.height}));
    --c2-mark-h: calc(var(--c2-mark-w) * ${MARK_BOX.height} / ${MARK_BOX.width});
    --c2-chin-x: calc(var(--c2-g) + 9.5 * var(--c2-col) + 13.5rem);
    --c2-chin-y: calc(50% + var(--c2-mark-h) * ${CHIN_FROM_CENTRE});
    --c2-run-y: calc(var(--c2-chin-y) + 2rem);
  }
  .c2-hero-mark { width: var(--c2-mark-w); }
  .c2-hero-outline path { stroke-width: calc(${MARK_BOX.width} / 520); }
}
@media (max-width: 47.99rem) and (prefers-reduced-motion: no-preference) {
  .c2-hero-frame { padding-bottom: 0; }
  .c2-hero-track {
    height: ${100 + MOBILE_TRAVEL}lvh;
    margin-top: calc(4rem - 50lvh + 40vw * ${MARK_BOX.height} / ${MARK_BOX.width});
  }
  .c2-hero-stage {
    position: sticky;
    top: 0;
    height: 100lvh;
    margin-inline: calc(-1 * var(--c2-g));
    align-items: center;
    overflow: clip;
  }
}
.c2-hero-outline path { stroke-dasharray: 1; stroke-opacity: 0.24; }
@media (prefers-reduced-motion: no-preference) {
  [data-intro="pending"] .c2-hero-outline path { stroke-dashoffset: 1; }
  [data-intro="pending"] [data-hero-photo] { opacity: 0; }
  [data-intro="pending"] [data-hero-connector] { transform: scale(0); }
}
`;

/** If the photo or fonts stall, the intro plays anyway after this long. */
const INTRO_TIMEOUT = 2500;

export interface HeroSceneProps {
  /** The server-rendered copy: eyebrow, h1 (`data-hero-line`), lead, CTAs. */
  children: ReactNode;
  /** The full-bleed photo (desktop), a next/image element carrying
   *  `data-scroll-scene-hero`. */
  photo: ReactNode;
  /** The same photo for the phone window. */
  photoPhone: ReactNode;
}

/**
 * The hero's client scene: the pinned 100svh frame, the mark cut out of a dark
 * veil over a still photograph, and the cable's first segment.
 *
 * Intro (once per load): the outline draws itself bright, then settles to a
 * hairline while the house fades up inside the mark, then the cable drops
 * from the chin. It waits for the fonts, the photo's decode and the scroll
 * scene's pin, so nothing restarts it or plays it unseen behind hydration.
 *
 * Scroll: the veil scales about the chin, so the mark-shaped hole grows over
 * the still house until it is the whole frame. On desktop the frame is pinned
 * for it; on the phone the mark's stage sticks instead (see SCENE_CSS).
 */
export function HeroScene({ children, photo, photoPhone }: HeroSceneProps) {
  const frameRef = useRef<HTMLDivElement>(null);

  // --- Intro -------------------------------------------------------------
  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;
    const done = () => {
      frame.dataset.intro = "done";
    };
    // Reduced motion, or the page restored below the hero: no intro.
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      window.scrollY > frame.offsetHeight
    ) {
      done();
      return;
    }

    let cancelled = false;
    let intro: gsap.core.Timeline | null = null;
    const q = gsap.utils.selector(frame);

    const play = () => {
      if (cancelled || intro) return;
      const paths = q(".c2-hero-outline path");
      const photos = q("[data-hero-photo]");
      const connectors = q("[data-hero-connector]");

      // Take over the CSS "before" state with inline styles, then let the
      // stylesheet go. Inline styles survive the pin moving the frame.
      gsap.set(paths, { strokeDashoffset: 1 });
      gsap.set(photos, { opacity: 0 });
      gsap.set(connectors, { scale: 0 });
      // Drawn bright, so the line reads; it settles to the hairline after.
      gsap.set(paths, { strokeOpacity: 0.9 });
      done();

      intro = gsap
        .timeline({
          onComplete: () => {
            gsap.set([...paths, ...photos, ...connectors], {
              clearProps: "strokeDashoffset,strokeOpacity,opacity,transform",
            });
          },
        })
        // The line: head first, then the jaw, one continuous stroke of the pen.
        .to(paths, {
          strokeDashoffset: 0,
          duration: 1.8,
          ease: "power2.inOut",
          stagger: 0.35,
        })
        // The house comes up inside the finished line…
        .to(photos, { opacity: 1, duration: 1.1, ease: "power1.out" }, "-=0.5")
        // …as the line settles back to its hairline.
        .to(
          paths,
          { strokeOpacity: 0.24, duration: 1.1, ease: "power1.out" },
          "<",
        )
        // The cable leaves the chin: down, then out to the gutter.
        .to(
          connectors[0] ?? [],
          { scale: 1, duration: 0.3, ease: "power2.out" },
          "-=0.7",
        )
        .to(
          connectors[1] ?? [],
          { scale: 1, duration: 0.45, ease: "power2.out" },
          ">-0.05",
        );
    };

    const img = frame.querySelector<HTMLImageElement>(
      "[data-scroll-scene-hero]",
    );
    const ready = Promise.all([
      document.fonts.ready,
      img?.decode().catch(() => undefined),
    ]).then(
      // Two frames: the scroll scene's pin (built on fonts.ready) is in place.
      () =>
        new Promise<void>((r) =>
          requestAnimationFrame(() => requestAnimationFrame(() => r())),
        ),
    );
    void ready.then(play);
    const fallback = window.setTimeout(play, INTRO_TIMEOUT);

    return () => {
      cancelled = true;
      window.clearTimeout(fallback);
      intro?.kill();
      done();
    };
  }, []);

  // --- Scroll --------------------------------------------------------------
  useScrollScene(frameRef, {
    desktop: ({ scope: frame }) => {
      const q = gsap.utils.selector(frame);
      const win = q("[data-hero-window]")[0] as HTMLElement | undefined;
      const zoom = q("[data-hero-zoom]")[0] as Element | undefined;
      const dim = q("[data-hero-dim]")[0];
      const photoMove = q("[data-hero-photo-move]")[0];
      if (!win || !zoom) return;

      const geo = zoomGeometry();
      const measure = () => measureZoom(geo, win, frame);
      measure();

      // The veil's camera, in viewBox units. Applied as an SVG transform
      // attribute (vector, so the cut's edge stays sharp at any scale);
      // GSAP's svgOrigin mis-measures a path this large.
      const cam = { s: 1, x: 0, y: 0 };
      const apply = () => setCamera(zoom, cam);

      gsap
        .timeline({
          defaults: { ease: "none" },
          onUpdate: apply,
          scrollTrigger: {
            trigger: frame,
            start: "top top",
            end: "+=150%",
            pin: true,
            scrub: SCRUB,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onRefresh: measure,
          },
        })
        // 0 → 0.30  eyebrow, lead and CTA row lift away
        .to(q("[data-hero='fade']"), { y: -32, opacity: 0, duration: 0.3 }, 0)
        // 0 → 0.45  the two h1 lines part; fade from 0.25
        .to(
          q("[data-hero-line='0']"),
          { x: () => -0.14 * window.innerWidth, duration: 0.45 },
          0,
        )
        .to(
          q("[data-hero-line='1']"),
          { x: () => 0.14 * window.innerWidth, duration: 0.45 },
          0,
        )
        .to(q("[data-hero-line]"), { opacity: 0, duration: 0.2 }, 0.25)
        // 0 → 0.20  outline and the cable's chin connector
        .to(
          q("[data-hero-outline], [data-hero-connector]"),
          { opacity: 0, duration: 0.2 },
          0,
        )
        // 0 → 0.60  the hole grows over the still house until it is the frame
        .fromTo(
          cam,
          { s: 1 },
          {
            s: () => (measure(), geo.zoom),
            ease: (p: number) => zoomEase(geo.zoom)(p),
            duration: 0.6,
          },
          0,
        )
        // 0 → 0.45  …while the chin drifts to the frame's centre (viewBox units)
        .fromTo(
          cam,
          { x: 0, y: 0 },
          {
            x: () => (geo.w / 2 - geo.ox) / geo.unit,
            y: () => (geo.h / 2 - geo.oy) / geo.unit,
            ease: "sine.inOut",
            duration: 0.45,
          },
          0,
        )
        // 0.70 → 1.00  dim for the hand-off to the light Stats band
        .fromTo(dim, { opacity: 0 }, { opacity: 0.55, duration: 0.3 }, 0.7);

      // Pointer: the house drifts ±12px against the cursor, a look through a
      // window. Only the photo layer moves; the mark stays put.
      const reset = () => zoom.removeAttribute("transform");
      if (!photoMove || !window.matchMedia("(hover: hover)").matches)
        return reset;
      const toX = gsap.quickTo(photoMove, "x", {
        duration: 0.6,
        ease: "power3.out",
      });
      const toY = gsap.quickTo(photoMove, "y", {
        duration: 0.6,
        ease: "power3.out",
      });
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
        zoom.removeAttribute("transform");
      };
    },

    mobile: ({ scope: frame }) => {
      const q = gsap.utils.selector(frame);
      const track = q("[data-hero-track]")[0] as HTMLElement | undefined;
      const stage = q("[data-hero-stage]")[0] as HTMLElement | undefined;
      const win = q("[data-hero-window]")[0] as HTMLElement | undefined;
      const zoom = q("[data-hero-zoom]")[0] as Element | undefined;
      const dim = q("[data-hero-dim-phone]")[0];
      if (!track || !stage || !win || !zoom) return;

      const geo = zoomGeometry();
      const measure = () => measureZoom(geo, win, stage);
      measure();

      const cam = { s: 1, x: 0, y: 0 };
      gsap
        .timeline({
          defaults: { ease: "none" },
          onUpdate: () => setCamera(zoom, cam),
          scrollTrigger: {
            // The stage is stuck for exactly this stretch: from the track's
            // top reaching the screen's to its foot reaching the stage's.
            trigger: track,
            start: "top top",
            end: () => `+=${track.offsetHeight - stage.offsetHeight}`,
            scrub: SCRUB,
            invalidateOnRefresh: true,
            onRefresh: measure,
          },
        })
        // 0 → 0.12  the copy still on screen above the mark clears the photo
        .to(
          q("[data-hero='fade'], [data-hero-line]"),
          { opacity: 0, duration: 0.12 },
          0,
        )
        // 0 → 0.15  outline
        .to(q("[data-hero-outline]"), { opacity: 0, duration: 0.15 }, 0)
        // 0 → 0.70  the hole grows over the still house until it is the screen
        .fromTo(
          cam,
          { s: 1 },
          {
            s: () => (measure(), geo.zoom),
            ease: (p: number) => zoomEase(geo.zoom)(p),
            duration: 0.7,
          },
          0,
        )
        // 0 → 0.50  …while the chin drifts to the stage's centre
        .fromTo(
          cam,
          { x: 0, y: 0 },
          {
            x: () => (geo.w / 2 - geo.ox) / geo.unit,
            y: () => (geo.h / 2 - geo.oy) / geo.unit,
            ease: "sine.inOut",
            duration: 0.5,
          },
          0,
        )
        // 0.80 → 1.00  dim for the hand-off to the light Stats band
        .fromTo(dim, { opacity: 0 }, { opacity: 0.55, duration: 0.2 }, 0.8);
      return () => zoom.removeAttribute("transform");
    },
  });

  return (
    <div
      ref={frameRef}
      data-intro="pending"
      className="c2-hero-frame section-x group relative grid grid-cols-1 overflow-clip pt-28 pb-20 md:h-svh md:min-h-[42rem] md:grid-cols-12 md:content-center md:items-center md:gap-x-6 md:py-20"
    >
      <style>{SCENE_CSS}</style>
      {/* Without JS there is no intro to play: show the finished hero. */}
      <noscript>
        <style>{`[data-intro="pending"] .c2-hero-outline path { stroke-dashoffset: 0 !important; } [data-intro="pending"] [data-hero-photo] { opacity: 1 !important; } [data-intro="pending"] [data-hero-connector] { transform: none !important; }`}</style>
      </noscript>

      {/* The house (desktop): full-bleed and still, behind the veil. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 overflow-hidden max-md:hidden"
      >
        <div data-hero-photo="" className="absolute inset-0">
          <div data-hero-photo-move="" className="absolute -inset-4">
            {photo}
          </div>
        </div>
        <div
          data-hero-dim=""
          className="bg-background absolute inset-0 opacity-0"
        />
      </div>

      {/* Copy — columns 1–7 */}
      <div className="relative z-20 md:col-span-7">{children}</div>

      {/* Mark window — columns 8–12. On the phone the track and the stage give
          the mark a screen-high sticky box of its own; from md the stage
          dissolves and the window is the track's only child. */}
      <div
        data-hero-track=""
        className="c2-hero-track relative z-10 mt-16 md:col-span-5 md:mt-0 md:flex md:justify-center"
      >
        <div
          data-hero-stage=""
          className="c2-hero-stage relative flex justify-center md:contents"
        >
          {/* The house (phone): still, behind the veil, across the stage. */}
          <div
            aria-hidden="true"
            data-hero-photo=""
            className="absolute inset-0 md:hidden"
          >
            <div className="absolute inset-y-0" style={PHOTO_PHONE}>
              {photoPhone}
            </div>
            <div
              data-hero-dim-phone=""
              className="bg-background absolute inset-0 opacity-0"
            />
          </div>

          <div
            data-hero-window=""
            className="c2-hero-mark relative aspect-[308/372]"
          >
            {/* The veil with the mark cut out, and the 1px outline on the cut. */}
            <svg
              aria-hidden="true"
              viewBox={MARK_VIEWBOX}
              className="absolute inset-0 size-full overflow-visible"
            >
              <g data-hero-zoom="">
                <path
                  d={VEIL_D}
                  fillRule="evenodd"
                  className="fill-background"
                />
                <g
                  data-hero-outline=""
                  className="c2-hero-outline text-foreground"
                  fill="none"
                >
                  {MARK_PATHS.map((d) => (
                    <path key={d} d={d} pathLength={1} stroke="currentColor" />
                  ))}
                </g>
              </g>
            </svg>
          </div>
        </div>
      </div>

      {/* Cable: from the chin, down 2rem, left to the gutter (desktop only). */}
      <div
        aria-hidden="true"
        data-hero-connector=""
        className="bg-foreground/24 pointer-events-none absolute z-10 h-8 w-px origin-top max-md:hidden"
        style={{ left: "var(--c2-chin-x)", top: "var(--c2-chin-y)" }}
      />
      <div
        aria-hidden="true"
        data-hero-connector=""
        className="bg-foreground/24 pointer-events-none absolute z-10 h-px origin-right max-md:hidden"
        style={{
          left: "calc(var(--c2-g) / 2)",
          width: "calc(var(--c2-chin-x) - var(--c2-g) / 2 + 1px)",
          top: "var(--c2-run-y)",
        }}
      />
      <CableSegment
        first
        pinTrigger={frameRef}
        className="md:top-[var(--c2-run-y)]"
      />
    </div>
  );
}
