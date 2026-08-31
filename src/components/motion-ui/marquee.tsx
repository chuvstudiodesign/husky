"use client";

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
 * A continuously scrolling strip. Duplicates its children once and translates the
 * pair by exactly half, so the loop has no visible seam.
 *
 * Runs on a CSS animation rather than JS, so it costs nothing per frame. The
 * duplicate is hidden from assistive technology, and the whole thing stops when the
 * viewer prefers reduced motion — an endlessly moving band is a genuine problem for
 * some readers, not a taste question.
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
  return (
    <div
      className={cn(
        "group/marquee relative flex w-full overflow-hidden",
        fade &&
          "[mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]",
        className,
      )}
      {...props}
    >
      <div
        className={cn(
          "flex w-max shrink-0 animate-[husky-marquee_var(--marquee-duration)_linear_infinite]",
          reverse && "[animation-direction:reverse]",
          pauseOnHover && "group-hover/marquee:[animation-play-state:paused]",
          "motion-reduce:animate-none",
        )}
        style={
          { "--marquee-duration": `${speed}s` } as React.CSSProperties
        }
      >
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}
