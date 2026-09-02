import * as React from "react"

import { cn } from "@/lib/utils"

interface DotPatternProps extends React.ComponentProps<"svg"> {
  /** Cell width in user units — the horizontal pitch of the grid. */
  width?: number
  /** Cell height in user units — the vertical pitch. */
  height?: number
  /** Offset of the whole tiling from the element's origin. */
  x?: number
  y?: number
  /** Dot centre within its cell. */
  cx?: number
  cy?: number
  /** Dot radius. */
  cr?: number
}

/**
 * A tiled dot grid, drawn as one SVG `<pattern>` and stamped across the box.
 *
 * The dots inherit `fill` from the `<svg>`, so colour is set with a utility on
 * `className` — `fill-current` by default, which means the primitive carries no
 * colour opinion of its own and picks up whatever the caller sets. The upstream
 * version shipped `fill-slate-500/50`; slate is not in the Husky palette, and a
 * default nobody in this codebase may use is worse than no default.
 *
 * No `useId`, and that is the whole reason this file has no `"use client"` at
 * the top. `useId` is a hook, hooks do not run in Server Components, and the
 * one thing it would buy — a unique `<pattern>` id — is not worth turning a
 * static decorative SVG into a hydrated client component. The id is a plain
 * prop instead.
 *
 * ponytail: one `id` per document. Two instances with the same id put two
 * `<pattern>` elements with the same id in the DOM, the first wins, and the
 * second silently borrows the first's geometry and fill. Fine while the site
 * has one dot layer per page — pass a distinct `id` the day it has two.
 */
function DotPattern({
  width = 24,
  height = 24,
  x = 0,
  y = 0,
  cx = 1,
  cy = 0.5,
  cr = 0.5,
  id = "dot-pattern",
  className,
  ...props
}: DotPatternProps) {
  return (
    <svg
      aria-hidden="true"
      data-slot="dot-pattern"
      className={cn(
        "pointer-events-none absolute inset-0 h-full w-full fill-current",
        className,
      )}
      {...props}
    >
      <defs>
        <pattern
          id={id}
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
          patternContentUnits="userSpaceOnUse"
          x={x}
          y={y}
        >
          <circle cx={cx} cy={cy} r={cr} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" strokeWidth={0} fill={`url(#${id})`} />
    </svg>
  )
}

export { DotPattern }
