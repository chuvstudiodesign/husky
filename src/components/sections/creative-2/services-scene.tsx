"use client";

import { useRef } from "react";

import { CableSegment } from "@/components/motion-ui/cable-segment";
import { SCRUB, gsap } from "@/components/motion-ui/gsap-setup";
import { addScrubText } from "@/components/motion-ui/scrub-text";
import { useScrollScene } from "@/components/motion-ui/use-scroll-scene";

export interface ServicesSceneProps {
  /** Readout text per plate, in track order: `03 / 08 · SMART LIGHTING`. */
  readout: string[];
  children: React.ReactNode;
}

/** Scroll px per px of horizontal travel. Spec says 0.75 and "shorten
 *  Services first" (to 0.6) if the page runs long — but the spec's "track ≈
 *  300vw" is really ≈ 440vw once its own panel widths are summed (36 + 3×30 +
 *  8×30 + 28 + 12 gaps×4 + 15 trailing — covers at 30vw so the h3s hold one
 *  line at `.display-2`), so even 0.6 pins ≈ 350vh. 0.44 keeps the pin
 *  ≤ ≈ 260vh at 1440 × 900. */
const PIN_FACTOR = 0.44;

const all = <T extends Element = HTMLElement>(root: ParentNode, sel: string) =>
  Array.from(root.querySelectorAll<T & HTMLElement>(sel));

/**
 * One plate's reveal, on a 0–1 timeline: the panel wipes open (0 → 0.3) over
 * its blueprint grid, the icon's lines draw in drawing order (0.15 → 0.85),
 * and the orange signal switches on last (0.85 → 0.95).
 */
function addPlateReveal(tl: gsap.core.Timeline, plate: HTMLElement) {
  const q = gsap.utils.selector(plate);
  const paths = q("[data-icon-path]");
  const span = 0.7;
  const stagger = paths.length > 1 ? (span * 0.5) / (paths.length - 1) : 0;
  tl.fromTo(
    q("[data-plate-clip]"),
    { clipPath: "inset(0% 0% 100% 0%)" },
    { clipPath: "inset(0% 0% 0% 0%)", ease: "none", duration: 0.3 },
    0,
  )
    .fromTo(q("[data-icon-grid]"), { opacity: 0 }, { opacity: 1, ease: "none", duration: 0.4 }, 0)
    .fromTo(
      paths,
      { drawSVG: "0%" },
      { drawSVG: "100%", ease: "none", duration: span * 0.5, stagger },
      0.15,
    )
    .fromTo(
      q("[data-icon-signal]"),
      { scale: 0, transformOrigin: "50% 50%" },
      { scale: 1, ease: "none", duration: 0.1 },
      0.85,
    )
    .set({}, {}, 1);
}

/**
 * The animated shell of Services: the `<section>`, its cable segment, the pinned
 * readout, and the two scroll builds. The markup inside is server-rendered by
 * `services.tsx` and found here by data attribute.
 *
 * desktop (≥ md, motion allowed) — sets `data-mode="track"`, pins the section and
 *   scrubs the track sideways; every other tween hangs off that tween through
 *   `containerAnimation`.
 * mobile (< md, motion allowed) — the vertical stack stays; plates wipe open, their
 *   icons draw, and family titles spread in as they arrive. Nothing pins.
 * reduced motion — neither branch runs; the server stack stands.
 */
export function ServicesScene({ readout, children }: ServicesSceneProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const readoutRef = useRef<HTMLParagraphElement>(null);

  useScrollScene(sectionRef, {
    desktop: ({ scope }) => {
      scope.dataset.mode = "track";

      const track = scope.querySelector<HTMLElement>("[data-track]");
      const fill = scope.querySelector<HTMLElement>("[data-hcable-fill]");
      const head = scope.querySelector<HTMLElement>("[data-hcable-head]");
      if (!track || !fill || !head) return () => delete scope.dataset.mode;

      const plates = all(scope, "[data-plate]");
      const nodes = plates.map((p) =>
        p.querySelector<HTMLElement>("[data-plate-node]"),
      );

      // The track starts one gutter in; travel until its end sits one gutter
      // from the right edge. The track carries 15vw of right padding after the
      // CTA panel, so the CTA lands framed and then dwells before the unpin.
      const distance = () =>
        Math.max(0, track.offsetWidth + 2 * track.offsetLeft - window.innerWidth);

      // Plate left edges in track coordinates, re-read on every refresh.
      let lefts: number[] = [];
      const measure = () => {
        lefts = plates.map((p) => p.offsetLeft);
      };
      measure();

      let lastReadout = -1;
      const setFill = gsap.quickSetter(fill, "scaleX");
      const setHead = gsap.quickSetter(head, "x", "px");

      // Assigned below; ScrollTrigger may refresh (and so call onUpdate) while
      // the tween is still being created.
      let main: gsap.core.Tween | null = null;

      const onUpdate = () => {
        if (!main) return;
        const p = main.progress();
        setFill(p);
        setHead(p * ((fill.parentElement?.offsetWidth ?? 0) - head.offsetWidth));

        // Where each plate's left edge is on screen right now.
        const x = (gsap.getProperty(track, "x") as number) + track.offsetLeft;
        const vw = window.innerWidth;
        let nearest = 0;
        let best = Infinity;
        lefts.forEach((left, i) => {
          const screen = left + x;
          // Junction node: state, on once the plate's left passes 60%.
          const node = nodes[i];
          const on = screen <= vw * 0.6 ? "true" : "false";
          if (node && node.dataset.on !== on) node.dataset.on = on;
          const d = Math.abs(screen - vw / 2);
          if (d < best) {
            best = d;
            nearest = i;
          }
        });
        if (nearest !== lastReadout && readoutRef.current) {
          lastReadout = nearest;
          readoutRef.current.textContent = readout[nearest] ?? "";
        }
      };

      main = gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        onUpdate,
        scrollTrigger: {
          trigger: scope,
          start: "top top",
          end: () => "+=" + distance() * PIN_FACTOR,
          pin: true,
          scrub: SCRUB,
          invalidateOnRefresh: true,
          onRefresh: () => {
            measure();
            onUpdate();
          },
        },
      });

      onUpdate();
      const container = main;

      // Plates: the 1px frame is there from the start; the panel wipes open
      // inside it, then the icon draws itself line by line and its signal
      // switches on. Only past 60% does the text rise, so a half-drawn plate
      // reads as a drawing in progress, not a failed load.
      plates.forEach((plate) => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: plate,
            containerAnimation: container,
            start: "left 95%",
            end: "left 40%",
            scrub: SCRUB,
          },
        });
        addPlateReveal(tl, plate);
        tl.fromTo(
          plate.querySelector("[data-plate-text]"),
          { y: 24, opacity: 0 },
          { y: 0, opacity: 1, ease: "none", duration: 0.4 },
          0.6,
        );
      });

      // Family covers: the h3 tracks in.
      all(scope, "[data-cover]").forEach((cover) => {
        const title = cover.querySelector<HTMLElement>("[data-family-split]");
        if (!title) return;
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: cover,
            containerAnimation: container,
            start: "left 100%",
            end: "left 40%",
            scrub: SCRUB,
          },
        });
        addScrubText(tl, title, { split: "chars", effect: "spread" }, 0);
      });

      // Keyboard: keep focused content on screen by scrolling the page to the
      // pin position that brings it into view.
      const onFocus = (e: FocusEvent) => {
        const el = e.target as HTMLElement;
        const st = container.scrollTrigger;
        if (!st || !track.contains(el)) return;
        const r = el.getBoundingClientRect();
        if (r.left >= 0 && r.right <= window.innerWidth) return;
        const trackLeft = r.left - track.getBoundingClientRect().left;
        const d = distance() || 1;
        const p = gsap.utils.clamp(0, 1, (trackLeft - window.innerWidth * 0.25) / d);
        const y = st.start + p * (st.end - st.start);
        if (window.__lenis) window.__lenis.scrollTo(y, { immediate: true });
        else window.scrollTo(0, y);
      };
      track.addEventListener("focusin", onFocus);

      return () => {
        track.removeEventListener("focusin", onFocus);
        nodes.forEach((n) => n && (n.dataset.on = "false"));
        delete scope.dataset.mode;
      };
    },

    mobile: ({ scope }) => {
      all(scope, "[data-plate]").forEach((plate) => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: plate,
            start: "top 90%",
            end: "top 35%",
            scrub: SCRUB,
          },
        });
        addPlateReveal(tl, plate);
      });

      all(scope, "[data-cover]").forEach((cover) => {
        const title = cover.querySelector<HTMLElement>("[data-family-split]");
        if (!title) return;
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: cover,
            start: "top 90%",
            end: "top 50%",
            scrub: SCRUB,
          },
        });
        addScrubText(tl, title, { split: "chars", effect: "spread" }, 0);
      });
    },
  });

  return (
    <section
      ref={sectionRef}
      id="services"
      aria-labelledby="services-title"
      className="group/services section-x section-y bg-background relative data-[mode=track]:flex data-[mode=track]:h-svh data-[mode=track]:items-center data-[mode=track]:overflow-clip data-[mode=track]:pt-20 data-[mode=track]:pb-0"
    >
      <CableSegment pinTrigger={sectionRef} />
      {children}
      {/* Fixed-in-pin readout, track mode only. Decorative: the plates carry the
          same index and name as real text. */}
      <p
        ref={readoutRef}
        aria-hidden="true"
        className="meta absolute bottom-8 hidden in-data-[mode=track]:block"
        style={{ left: "var(--gutter, clamp(1.5rem, 5vw, 4rem))" }}
      >
        {readout[0]}
      </p>
    </section>
  );
}
