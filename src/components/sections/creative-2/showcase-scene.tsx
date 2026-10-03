"use client";

import Image from "next/image";
import { useRef } from "react";

import { CableSegment } from "@/components/motion-ui/cable-segment";
import { CursorLight } from "@/components/motion-ui/cursor-light";
import { SCRUB, gsap } from "@/components/motion-ui/gsap-setup";
import { addScrubText } from "@/components/motion-ui/scrub-text";
import { useScrollScene } from "@/components/motion-ui/use-scroll-scene";
import { SHOWCASE } from "@/components/sections/creative-2/content";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  The plate — image and annotations share one coordinate system      */
/* ------------------------------------------------------------------ */

/** Source pixels of `estate-dusk-02.jpg`. The annotation geometry is in these units. */
const IMG_W = 2132;
const IMG_H = 737;

/** Horizontal anchor of the cover crop. The house sits right of centre in the 21:9
 *  source; 80% keeps it in frame from 16:10 desktops down to the 4:5 phone frame
 *  (visible band ≈ 0.59–0.85 of the width at its narrowest). */
const CROP_X = 0.8;

/**
 * The plate is the image at its own aspect ratio, sized and positioned to cover
 * the frame exactly as `object-fit: cover; object-position: 80% 50%` would. The
 * frame is a size container, so this is pure CSS. Because the image and the
 * annotation layer both live in the plate, the annotation coordinates (source
 * pixels) land on the same spot of the photo at every viewport.
 */
const PLATE_W = `max(100cqw, calc(100cqh * ${IMG_W} / ${IMG_H}))`;
const PLATE_STYLE: React.CSSProperties = {
  width: PLATE_W,
  aspectRatio: `${IMG_W} / ${IMG_H}`,
  left: `calc((100cqw - ${PLATE_W}) * ${CROP_X})`,
  top: "50%",
};

interface Annotation {
  label: (typeof SHOWCASE.annotations)[number];
  /** Node on the photo, in source px. */
  node: [number, number];
  /** Elbow, then the free end where the label chip starts. */
  path: [number, number][];
}

/** Placed on the actual photo: a landscape-light pool on the front hedge, the lit
 *  upper-right window, and the rake of the main gable. All three sit inside the
 *  narrowest visible band (the phone's 4:5 crop). */
const ANNOTATIONS: Annotation[] = [
  {
    label: SHOWCASE.annotations[0], // LIGHTING
    node: [1587, 548],
    path: [
      [1587, 470],
      [1690, 470],
    ],
  },
  {
    label: SHOWCASE.annotations[1], // AUDIO
    node: [1635, 335],
    path: [
      [1635, 262],
      [1720, 262],
    ],
  },
  {
    label: SHOWCASE.annotations[2], // SURVEILLANCE
    node: [1340, 219],
    path: [
      [1340, 130],
      [1420, 130],
    ],
  },
];

const pct = ([x, y]: [number, number]) => ({
  left: `${(x / IMG_W) * 100}%`,
  top: `${(y / IMG_H) * 100}%`,
});

const STATE = "duration-250 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none";

/* ------------------------------------------------------------------ */
/*  Scene                                                              */
/* ------------------------------------------------------------------ */

/**
 * Showcase scene. Server render (and no-JS) is the final state of the scroll
 * story: the house lit (overlay 0.10), desktop annotations gone, phone nodes and
 * legend present, heading and caption readable.
 *
 *   ≥ md, motion   section pins for 140vh: frame opens, leaders draw to their
 *                  labels, hold, undraw, the lights come up, the H2 rises.
 *   < md, motion   no pin: frame opens, numbered nodes appear (and stay), lights
 *                  come up; the H2 rises on its own trigger.
 *   reduced        photo framed at full width, overlay 0.10, no annotations,
 *                  text below.
 */
export function ShowcaseScene() {
  const sectionRef = useRef<HTMLElement>(null);

  useScrollScene(sectionRef, {
    desktop: ({ scope }) => {
      const q = gsap.utils.selector(scope);
      const frame = q("[data-frame]")[0] as HTMLElement;
      const img = q("[data-img]")[0] as HTMLElement;
      const dim = q("[data-dim]")[0] as HTMLElement;
      const layer = q("[data-annotations]")[0] as HTMLElement;
      const h2 = q("[data-h2]")[0] as HTMLElement;
      const caption = q("[data-caption]")[0] as HTMLElement;
      const eyebrow = q("[data-eyebrow]")[0] as HTMLElement;
      const lines = q("[data-leader]");
      const nodes = q("[data-node]");
      const chips = q("[data-chip]");

      // CursorLight's root is the plate's parent; the gate is read by its
      // overlay (the root's last child).
      const lightRoot = q("[data-plate]")[0]?.parentElement ?? undefined;

      gsap.set(layer, { visibility: "visible" });

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: scope,
          start: "top top",
          end: "+=140%",
          pin: true,
          scrub: SCRUB,
          invalidateOnRefresh: true,
        },
      });

      // 0.00 → 0.15 — the frame opens onto the house, still dim.
      tl.fromTo(
        frame,
        { clipPath: "inset(10% 8% 10% 8%)" },
        { clipPath: "inset(0% 0% 0% 0%)", duration: 0.15 },
        0,
      )
        .fromTo(img, { scale: 1.08 }, { scale: 1, duration: 0.15 }, 0)
        .fromTo(dim, { opacity: 0.55 }, { opacity: 0.55, duration: 0.15 }, 0);

      // The torch is live while the drawing shows; it fades with "lights on".
      if (lightRoot) {
        tl.fromTo(
          lightRoot,
          { "--cl-gate": 1 },
          { "--cl-gate": 0, duration: 0.2 },
          0.6,
        );
      }

      // 0.08 → 0.35 — leaders draw node → label, nodes pop, chips wipe in.
      // Each of the three runs 0.15, staggered 0.06, so the set spans 0.27.
      tl.fromTo(
        lines,
        { drawSVG: "0% 0%" },
        { drawSVG: "0% 100%", duration: 0.15, stagger: 0.06 },
        0.08,
      )
        .fromTo(
          nodes,
          { scale: 0 },
          { scale: 1, duration: 0.15, stagger: 0.06 },
          0.08,
        )
        .fromTo(
          chips,
          { clipPath: "inset(0% 100% 0% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 0.15, stagger: 0.06 },
          0.08,
        );

      // 0.35 → 0.60 — hold. The fully annotated drawing is the point of the
      // section, so it gets a quarter of the pin (~315px of scroll at 900 tall).
      // 0.60 → 0.75 — undraw from the label back to the node.
      tl.to(
        chips,
        { clipPath: "inset(0% 100% 0% 0%)", duration: 0.09, stagger: 0.03 },
        0.6,
      )
        .to(lines, { drawSVG: "0% 0%", duration: 0.09, stagger: 0.03 }, 0.6)
        .to(nodes, { scale: 0, duration: 0.09, stagger: 0.03 }, 0.6);

      // 0.60 → 0.80 — lights on.
      tl.to(dim, { opacity: 0.1, duration: 0.2 }, 0.6);

      // 0.72 → 0.92 — eyebrow and H2 arrive together (no orphan eyebrow
      // during the hold), the H2 rising line by line; caption 0.90 → 0.98.
      const rise = gsap.timeline({ defaults: { ease: "none" } });
      addScrubText(rise, h2, { split: "lines", effect: "rise" }, 0);
      rise.duration(0.2);
      tl.fromTo(eyebrow, { opacity: 0 }, { opacity: 1, duration: 0.08 }, 0.72)
        .add(rise, 0.72)
        .fromTo(caption, { opacity: 0 }, { opacity: 1, duration: 0.08 }, 0.9);

      // Pin the timeline's length to exactly 1, so positions read as progress.
      tl.set({}, {}, 1);
    },

    mobile: ({ scope }) => {
      const q = gsap.utils.selector(scope);
      const frame = q("[data-frame]")[0] as HTMLElement;
      const img = q("[data-img]")[0] as HTMLElement;
      const dim = q("[data-dim]")[0] as HTMLElement;
      const marks = q("[data-mark]");
      const h2 = q("[data-h2]")[0] as HTMLElement;

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: frame,
          start: "top 85%",
          end: "bottom 20%",
          scrub: SCRUB,
        },
      });
      tl.fromTo(
        frame,
        { clipPath: "inset(10% 8% 10% 8%)" },
        { clipPath: "inset(0% 0% 0% 0%)", duration: 0.2 },
        0,
      )
        .fromTo(img, { scale: 1.08 }, { scale: 1, duration: 0.2 }, 0)
        // Nodes appear and stay: the legend below refers to them.
        .fromTo(
          marks,
          { scale: 0 },
          { scale: 1, duration: 0.2, stagger: 0.05 },
          0.2,
        )
        .fromTo(dim, { opacity: 0.55 }, { opacity: 0.1, duration: 0.4 }, 0.5)
        .set({}, {}, 1);

      // The H2 below the photo rises on its own trigger.
      const rise = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: h2,
          start: "top 90%",
          end: "top 55%",
          scrub: SCRUB,
        },
      });
      addScrubText(rise, h2, { split: "lines", effect: "rise" }, 0);
    },
  });

  return (
    <section
      ref={sectionRef}
      id="showcase"
      aria-labelledby="showcase-title"
      className={cn(
        "section-x section-y relative isolate",
        // ≥ md with motion: a full-bleed 100svh frame, pinned.
        "md:motion-safe:h-svh md:motion-safe:py-0",
      )}
    >
      <CableSegment pinTrigger={sectionRef} className="z-30" />

      {/* Frame. Phone: 4:5 inside the gutter. ≥ md with motion: full bleed.
          ≥ md reduced: the photo at its own 21:9, full content width. */}
      <div
        data-frame=""
        className={cn(
          "relative aspect-4/5 overflow-hidden [container-type:size]",
          "md:aspect-[2132/737] md:motion-safe:absolute md:motion-safe:inset-0 md:motion-safe:aspect-auto",
        )}
      >
        <CursorLight
          radius={320}
          strength={0.5}
          // Gated by `--cl-gate`: 0 at rest (the house is already lit), tweened
          // 1 → 0 by the desktop timeline as the lights come up.
          className="absolute inset-0 [--cl-gate:0] [&>:last-child]:opacity-[calc(var(--cl-on)*var(--cl-gate))]"
        >
          <div
            data-plate=""
            className="absolute -translate-y-1/2"
            style={PLATE_STYLE}
          >
            <div data-img="" className="absolute inset-0">
              <Image
                src={SHOWCASE.image.src}
                alt={SHOWCASE.image.alt}
                fill
                sizes="(min-width: 768px) 200vw, 320vw"
                quality={90}
                className="object-cover"
              />
            </div>

            {/* Dim overlay — final state 0.10, "lights on". */}
            <div
              data-dim=""
              aria-hidden="true"
              className="bg-background absolute inset-0 opacity-10"
            />

            {/* Desktop annotation layer: leaders, nodes, label chips. Hidden in
                the server render (its final state is undrawn); the motion
                build makes it visible and draws it from zero. */}
            <div
              data-annotations=""
              aria-hidden="true"
              className="invisible absolute inset-0 z-20 hidden md:motion-safe:block"
            >
              <svg
                viewBox={`0 0 ${IMG_W} ${IMG_H}`}
                preserveAspectRatio="none"
                className="absolute inset-0 size-full overflow-visible"
              >
                {ANNOTATIONS.map((a) => (
                  <polyline
                    key={a.label}
                    data-leader=""
                    points={[a.node, ...a.path].map((p) => p.join(",")).join(" ")}
                    fill="none"
                    vectorEffect="non-scaling-stroke"
                    className="stroke-foreground/72"
                    strokeWidth={1}
                  />
                ))}
              </svg>
              {ANNOTATIONS.map((a) => (
                <span
                  key={`node-${a.label}`}
                  data-node=""
                  className="bg-foreground absolute -mt-1 -ml-1 size-2 rounded-none"
                  style={pct(a.node)}
                />
              ))}
              {ANNOTATIONS.map((a) => (
                <span
                  key={`chip-${a.label}`}
                  data-chip=""
                  className="text-system bg-background text-foreground absolute -translate-y-1/2 rounded-md px-2 py-1 whitespace-nowrap"
                  style={pct(a.path[a.path.length - 1])}
                >
                  {a.label}
                </span>
              ))}
            </div>

            {/* Phone: numbered nodes, keyed to the legend below. */}
            <div
              aria-hidden="true"
              className="absolute inset-0 z-20 md:hidden motion-reduce:hidden"
            >
              {ANNOTATIONS.map((a, i) => (
                <span
                  key={`mark-${a.label}`}
                  data-mark=""
                  className="text-system bg-background text-foreground border-foreground/72 absolute -mt-3 -ml-3 grid size-6 place-items-center rounded-none border"
                  style={pct(a.node)}
                >
                  {i + 1}
                </span>
              ))}
            </div>
          </div>
        </CursorLight>
      </div>

      {/* Scrim at the foot of the full-bleed frame only. */}
      <div
        aria-hidden="true"
        className="from-background/72 pointer-events-none absolute inset-x-0 bottom-0 z-10 hidden h-2/5 bg-linear-to-t to-transparent md:motion-safe:block"
      />

      {/* Phone legend. */}
      <ol
        aria-hidden="true"
        className="text-system text-foreground mt-4 flex flex-wrap gap-x-4 gap-y-2 md:hidden motion-reduce:hidden"
      >
        {ANNOTATIONS.map((a, i) => (
          <li key={`legend-${a.label}`} className="flex gap-2">
            <span className="text-foreground">{i + 1}</span>
            {a.label}
          </li>
        ))}
      </ol>

      {/* Text block. Phone and reduced: below the photo. ≥ md with motion:
          bottom-left, over the scrim. */}
      <div
        className={cn(
          "relative z-20 mt-12",
          "md:motion-safe:absolute md:motion-safe:px-[inherit] md:motion-safe:inset-x-0 md:motion-safe:bottom-0 md:motion-safe:mt-0 md:motion-safe:pb-16",
        )}
      >
        <p
          data-eyebrow=""
          className={cn(
            "eyebrow text-muted-foreground md:motion-safe:text-foreground transition-colors [[data-powered]_&]:text-foreground",
            STATE,
          )}
        >
          {SHOWCASE.eyebrow}
        </p>
        <h2 id="showcase-title" className="display-1 mt-6">
          <span className="sr-only">{SHOWCASE.h2}</span>
          <span data-h2="" aria-hidden="true" className="block">
            {SHOWCASE.h2}
          </span>
        </h2>
        <p data-caption="" className="meta mt-6">
          {SHOWCASE.caption}
        </p>
      </div>
    </section>
  );
}
