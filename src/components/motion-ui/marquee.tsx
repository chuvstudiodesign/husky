"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

export interface MarqueeProps extends React.ComponentProps<"div"> {
  /** Seconds for one full pass. Higher is slower. */
  speed?: number;
  /** Travel right instead of left. */
  reverse?: boolean;
  /** Stop while the pointer is over the strip. */
  pauseOnHover?: boolean;
  /** Fade the strip out at both edges instead of cutting it. */
  fade?: boolean;
}

/**
 * A continuously scrolling strip. Tiles its children across an even number of
 * copies and translates the track by exactly half, so the loop has no visible seam.
 *
 * **How many copies is measured, and that is the whole trick.** Two copies only
 * loop cleanly while one copy is at least as wide as the box: the track ends at
 * `2 × content`, the animation ends at `−1 × content`, so the tail of the track
 * lands at `content` — short of the box edge by `box − content`, which shows as
 * dead space on the right for the back half of every cycle. That was invisible
 * while the partners strip lived inside `max-w-7xl` (1152px of content against a
 * 1280px cap) and appeared the moment it went full-bleed: measured at a 2600px
 * viewport, one copy sets to 1685px and 882px of the strip ran empty. So the
 * count is `2 × ceil(box / content)` — enough copies that half the track always
 * covers the box — recomputed by a `ResizeObserver` that watches both the box and
 * the first copy. Watching the copy is not redundant: display type reflows when
 * the web font lands, and the first measurement happens before it does.
 *
 * Runs on a CSS animation rather than JS, so it still costs nothing per frame — the
 * observer fires on resize, not on tick. The duplicates are hidden from assistive
 * technology, and the whole thing stops when the viewer prefers reduced motion — an
 * endlessly moving band is a genuine problem for some readers, not a taste question.
 *
 * **Stopping the animation is not enough, and that was a real bug.** A stopped
 * marquee is still a `w-max` track twice the width of its own box: the second copy
 * is dead weight, the tail is clipped mid-glyph at the overflow edge, and the edge
 * mask fades content that is never going to move out from under it. Under reduced
 * motion the track therefore stops being a track — one copy, box width, wrapping,
 * no mask — so the strip renders as a static row. Children that lay their items out
 * in a row need `motion-reduce:flex-wrap` of their own; this component owns the box,
 * the caller owns what is in it.
 */
export function Marquee({
  speed = 40,
  reverse = false,
  pauseOnHover = true,
  fade = true,
  className,
  children,
  ...props
}: MarqueeProps) {
  const boxRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  // Two is the server's guess and the floor. Anything wider is measured on the
  // client, so the markup that ships is the markup that was already shipping.
  const [copies, setCopies] = useState(2);

  useEffect(() => {
    const box = boxRef.current;
    const copy = copyRef.current;
    if (!box || !copy) return;

    // A stopped strip has nothing to tile, so it keeps the two it shipped with
    // and the extra one stays hidden. The guard is self-correcting: turning the
    // preference off changes the first copy from box width back to content
    // width, which is a resize, which runs this again.
    const still = window.matchMedia("(prefers-reduced-motion: reduce)");

    const fit = () => {
      const content = copy.getBoundingClientRect().width;
      if (!content || still.matches) return;
      setCopies(2 * Math.max(1, Math.ceil(box.clientWidth / content)));
    };

    const observer = new ResizeObserver(fit);
    observer.observe(box);
    observer.observe(copy);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={boxRef}
      className={cn(
        "group/marquee relative flex w-full overflow-hidden",
        fade &&
          "[mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)] motion-reduce:[mask-image:none]",
        className,
      )}
      {...props}
    >
      <div
        className={cn(
          // 8px of clear air above and below the line box, and it is a bug fix
          // rather than styling. The strip has to clip horizontally — that is
          // what makes it a strip — and `overflow-hidden` clips both axes, so a
          // glyph whose ink runs past its own line box loses the difference.
          // The display scale sets leading at size + 4px, which leaves 2px of
          // half-leading per side and no room at all for a descender. Measured
          // on the partners strip, ink over line box: 2px at 390, 2px at 768,
          // 4px at 1024, 6px at 1440, and 2px at 1024/1440 for the static
          // reduced-motion row. 8px clears the worst of them with room left,
          // costs the box 16px, and keeps it on the 8-grid.
          "flex w-max shrink-0 py-2 animate-[husky-marquee_var(--marquee-duration)_linear_infinite]",
          reverse && "[animation-direction:reverse]",
          pauseOnHover && "group-hover/marquee:[animation-play-state:paused]",
          "motion-reduce:w-full motion-reduce:animate-none",
        )}
        style={
          { "--marquee-duration": `${speed}s` } as React.CSSProperties
        }
      >
        {/* Copy 0 is the real content and the ruler the rest are counted from.
            Every copy after it is a seam-hider, so it is hidden from assistive
            technology — and under reduced motion, where there is no loop and so
            nothing to hide, it is not rendered as anything at all. */}
        {Array.from({ length: copies }, (_, i) => (
          <div
            key={i}
            ref={i === 0 ? copyRef : undefined}
            aria-hidden={i > 0 || undefined}
            className={cn(
              "flex shrink-0 items-center",
              i === 0
                ? "motion-reduce:w-full motion-reduce:shrink"
                : "motion-reduce:hidden",
            )}
          >
            {children}
          </div>
        ))}
      </div>
    </div>
  );
}
