import { cn } from "@/lib/utils";

/**
 * A fixed film-grain layer over the whole page.
 *
 * Flat dark surfaces band badly on wide-gamut displays — you get visible steps in
 * any large area of near-black. A few percent of noise breaks the banding up and,
 * as a side effect, gives the page the texture of print rather than of a screen.
 *
 * Generated inline with SVG turbulence, so it costs no network request. Keep it
 * under about 4% — if you can see grain, it's too strong.
 */
export function Grain({
  opacity = 0.035,
  className,
  ...props
}: React.ComponentProps<"div"> & { opacity?: number }) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none fixed inset-0 z-[100] mix-blend-overlay",
        className,
      )}
      style={{
        opacity,
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E")`,
      }}
      {...props}
    />
  );
}
