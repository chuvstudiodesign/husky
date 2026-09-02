import { ArrowDown } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * The arrow at the head of the hero's location strip, drifting downward on a
 * loop instead of standing still.
 *
 * It replaces a static `ArrowDown` and keeps its exact footprint — 16px box,
 * brand orange — so swapping it in moves nothing else on the line. The wrapper
 * is what holds the space; the arrow inside travels on `transform` and `opacity`
 * only, so the loop stays on the compositor and never touches layout.
 *
 * No client boundary: the whole thing is a CSS keyframe. Under
 * `prefers-reduced-motion` the animation is dropped and the arrow renders as the
 * plain static icon it used to be, in the same place.
 */
export function ScrollCue({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      aria-hidden
      className={cn(
        "text-primary inline-flex size-4 shrink-0 items-center justify-center",
        className,
      )}
      {...props}
    >
      <ArrowDown className="size-4 animate-[husky-scroll-cue_1.9s_ease-in-out_infinite] motion-reduce:animate-none" />
    </span>
  );
}
