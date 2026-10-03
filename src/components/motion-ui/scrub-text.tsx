"use client";

import { useRef, type RefObject } from "react";

import {
  SCRUB,
  SplitText,
  gsap,
} from "@/components/motion-ui/gsap-setup";
import { useScrollScene } from "@/components/motion-ui/use-scroll-scene";
import { cn } from "@/lib/utils";

export type ScrubSplit = "lines" | "words" | "chars";
export type ScrubEffect = "rise" | "light" | "spread";

export interface ScrubTextOptions {
  split?: ScrubSplit;
  effect?: ScrubEffect;
  /** "light" only: the unlit opacity the words start from. Default 0.16. */
  dim?: number;
}

type ScrubTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "div";

export interface ScrubTextProps extends ScrubTextOptions {
  as?: ScrubTag;
  /** ScrollTrigger start, when ScrubText owns its trigger. */
  start?: string;
  /** ScrollTrigger end, when ScrubText owns its trigger. */
  end?: string;
  /** Element whose scroll position drives the scrub. Defaults to the text itself. */
  trigger?: RefObject<HTMLElement | null>;
  /**
   * Sequence into a parent's timeline instead of owning a trigger (pinned scenes).
   * `undefined` = own trigger. `null` = "a timeline is coming": render static and
   * wait. Once a timeline arrives the tweens are added at `position`.
   */
  timeline?: gsap.core.Timeline | null;
  position?: gsap.Position;
  className?: string;
  children: string;
}

/** Rate at which split units stagger in, per spec. */
const STAGGER = 0.08;
/** Extra clip room below each rise mask, in em, so descenders (g, y, p) aren't
 *  cut off. Added as padding and cancelled by a negative margin: layout is unchanged. */
const MASK_DESCENT_EM = 0.18;
/** Per-unit offset for "spread", in em, multiplied by distance from centre. */
const SPREAD_EM = 0.06;

function splitConfig(split: ScrubSplit, effect: ScrubEffect): SplitText.Vars {
  // Words and chars still split into lines/words so wrapping stays natural.
  const type =
    split === "lines" ? "lines" : split === "words" ? "lines,words" : "words,chars";
  return {
    type,
    mask: effect === "rise" ? split : undefined,
    // The readable copy is the sr-only sibling; the split copy is aria-hidden.
    aria: "none",
  };
}

function unitsOf(self: SplitText, split: ScrubSplit) {
  return split === "lines" ? self.lines : split === "words" ? self.words : self.chars;
}

/**
 * Extends every SplitText mask downward by `MASK_DESCENT_EM` without moving
 * anything: padding grows the clip box, the matching negative margin cancels it.
 * Returns that extra depth in px (per the first mask's font size).
 */
export function padMasks(self: SplitText) {
  const masks = self.masks as HTMLElement[];
  if (!masks.length) return 0;
  for (const m of masks) {
    m.style.paddingBottom = `${MASK_DESCENT_EM}em`;
    m.style.marginBottom = `-${MASK_DESCENT_EM}em`;
  }
  const em = parseFloat(getComputedStyle(masks[0]).fontSize) || 16;
  return em * MASK_DESCENT_EM;
}

/**
 * Adds the scrubbed tweens for one split to `tl`. All tweens are linear
 * (`ease: "none"`) so motion maps 1:1 to scroll; the scrub value provides the feel.
 * `from` tweens render their start state immediately — call this only inside a
 * motion-allowed branch.
 */
export function addSplitTweens(
  tl: gsap.core.Timeline,
  self: SplitText,
  { split = "lines", effect = "rise", dim = 0.16 }: ScrubTextOptions,
  position?: gsap.Position,
) {
  const units = unitsOf(self, split);
  if (!units.length) return tl;

  if (effect === "rise") {
    // Start fully below the padded clip box, not just one line-height down.
    const pad = padMasks(self);
    tl.from(
      units,
      { yPercent: 100, y: pad, stagger: STAGGER, ease: "none" },
      position,
    );
  } else if (effect === "light") {
    tl.fromTo(
      units,
      { opacity: dim },
      { opacity: 1, stagger: STAGGER, ease: "none" },
      position,
    );
  } else {
    const host = units[0].parentElement ?? units[0];
    const em = parseFloat(getComputedStyle(host).fontSize) || 16;
    const mid = (units.length - 1) / 2;
    tl.from(
      units,
      {
        x: (i: number) => (i - mid) * SPREAD_EM * em,
        opacity: 0,
        ease: "none",
      },
      position,
    );
  }
  return tl;
}

/**
 * Imperative form for scenes that own their markup: split `target` and add its
 * tweens to `tl`. Returns the SplitText so the caller's context can revert it
 * (it is recorded automatically when called inside a gsap context / scene build).
 */
export function addScrubText(
  tl: gsap.core.Timeline,
  target: HTMLElement,
  options: ScrubTextOptions = {},
  position?: gsap.Position,
) {
  const self = SplitText.create(
    target,
    splitConfig(options.split ?? "lines", options.effect ?? "rise"),
  );
  addSplitTweens(tl, self, options, position);
  return self;
}

/** True when the element sits inside the first viewport at scroll 0. The motion
 *  contract forbids hiding anything there while waiting for JS. */
function inFirstViewport(el: HTMLElement) {
  return el.getBoundingClientRect().top + window.scrollY < window.innerHeight;
}

/**
 * P4 — SplitText, scrubbed to scroll.
 *
 *   rise    units rise out of a mask, yPercent 100 → 0, stagger 0.08
 *   light   units brighten, opacity `dim` (0.16) → 1, stagger 0.08
 *   spread  units converge on x from ±(offset × 0.06em) with opacity 0 → 1 —
 *           tracking-in, faked without animating letter-spacing
 *
 * Server render and reduced motion: the plain string, fully readable. The string
 * is read once by assistive tech (an sr-only copy); the visual split copy is
 * aria-hidden. With its own trigger, ScrubText does nothing for text inside the
 * first viewport — sequence those through a scene's `timeline` instead.
 */
export function ScrubText({
  as: Tag = "p",
  split = "lines",
  effect = "rise",
  start = "top 80%",
  end = "top 30%",
  trigger,
  timeline,
  position,
  className,
  children,
}: ScrubTextProps) {
  const rootRef = useRef<HTMLElement>(null);
  const splitRef = useRef<HTMLSpanElement>(null);

  const build = () => {
    const root = rootRef.current;
    const target = splitRef.current;
    if (!root || !target) return;

    // Parent timeline mode.
    if (timeline !== undefined) {
      if (!timeline) return;
      const self = SplitText.create(target, splitConfig(split, effect));
      addSplitTweens(timeline, self, { split, effect }, position);
      return () => self.revert();
    }

    // Own-trigger mode.
    const triggerEl = trigger?.current ?? root;
    if (inFirstViewport(triggerEl)) return;

    const self = SplitText.create(target, {
      ...splitConfig(split, effect),
      // Re-split on width change so lines stay true; SplitText swaps the returned
      // timeline for a fresh one at the same progress.
      autoSplit: split === "lines",
      onSplit(s) {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: triggerEl, start, end, scrub: SCRUB },
        });
        return addSplitTweens(tl, s, { split, effect });
      },
    });
    return () => self.revert();
  };

  useScrollScene(rootRef, { desktop: build, mobile: build }, [
    timeline,
    position,
    split,
    effect,
    start,
    end,
    children,
  ]);

  return (
    <Tag
      // The union of intrinsic elements makes ref typing awkward; every option is
      // an HTMLElement.
      ref={rootRef as RefObject<never>}
      className={cn(className)}
    >
      <span className="sr-only">{children}</span>
      <span ref={splitRef} aria-hidden="true" className="block">
        {children}
      </span>
    </Tag>
  );
}
