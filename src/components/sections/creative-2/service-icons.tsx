import type { ServiceIconKey } from "@/components/sections/creative-2/content";
import { cn } from "@/lib/utils";

/*
 * The eight service icons, drawn in the mark's own vocabulary: straight runs,
 * corners cut at 45° instead of curves, one even line weight. Each icon is a
 * list of paths drawn in order (the scene draws them in that order) plus one
 * small "signal" square, the icon's status light, which is the only orange.
 *
 * Shared frame: viewBox 0 0 120 90 (the plate's 4:3), icon held inside
 * x 20–100, y 10–80. Octagons stand in for circles.
 */

/** A chamfered rectangle: corners cut by `c`. */
const box = (x: number, y: number, w: number, h: number, c = 4) =>
  `M${x + c} ${y}H${x + w - c}L${x + w} ${y + c}V${y + h - c}L${x + w - c} ${y + h}H${x + c}L${x} ${y + h - c}V${y + c}Z`;

/** A regular-ish octagon of radius `r` around (cx, cy): the squared circle. */
const oct = (cx: number, cy: number, r: number) => {
  const k = Math.round(r * 0.4142 * 100) / 100;
  return `M${cx - k} ${cy - r}H${cx + k}L${cx + r} ${cy - k}V${cy + k}L${cx + k} ${cy + r}H${cx - k}L${cx - r} ${cy + k}V${cy - k}Z`;
};

interface IconDef {
  paths: string[];
  /** Top-left of the 4 × 4 signal square. */
  signal: [number, number];
}

const ICONS: Record<ServiceIconKey, IconDef> = {
  // A screen with a play mark, and a row of seats facing it.
  "home-cinema": {
    paths: [
      box(26, 12, 68, 40, 5),
      "M54 24L68 32L54 40Z",
      "M34 78V66L40 60H80L86 66V78",
      "M34 70H86",
      "M60 60V78",
    ],
    signal: [84, 44],
  },
  // A speaker: cabinet, tweeter, woofer, and sound leaving both sides.
  "multi-room-audio": {
    paths: [
      box(44, 12, 32, 66, 5),
      oct(60, 28, 6),
      oct(60, 54, 13),
      "M84 34L90 40V56L84 62",
      "M94 26L102 34V62L94 70",
      "M36 34L30 40V56L36 62",
      "M26 26L18 34V62L26 70",
    ],
    signal: [58, 52],
  },
  // A speaker on a post, the sun, and the pool's waterline.
  "outdoor-entertainment": {
    paths: [
      box(28, 22, 22, 30, 4),
      oct(39, 37, 6),
      "M39 52V68",
      oct(82, 26, 8),
      "M82 10V14M82 38V42M66 26H70M94 26H98",
      "M18 72H26L30 68H38L42 72H50L54 68H62L66 72H74L78 68H86L90 72H102",
      "M18 80H102",
    ],
    signal: [37, 35],
  },
  // A hub with four spokes, each ending in a device.
  automation: {
    paths: [
      box(48, 33, 24, 24, 5),
      "M60 33V20M60 57V70M48 45H32M72 45H88",
      box(56, 12, 8, 8, 2),
      box(56, 70, 8, 8, 2),
      box(24, 41, 8, 8, 2),
      box(88, 41, 8, 8, 2),
    ],
    signal: [58, 43],
  },
  // A pendant: cord, shade, the lamp, and light falling.
  "smart-lighting": {
    paths: [
      "M60 8V22",
      "M50 22H70L86 40V44H34V40Z",
      oct(60, 52, 6),
      "M42 58L32 72",
      "M60 64V80",
      "M78 58L88 72",
    ],
    signal: [58, 50],
  },
  // A window, its shade half down, and the pull cord.
  "smart-blinds": {
    paths: [
      box(30, 10, 60, 70, 5),
      "M30 20H90",
      "M34 28H86M34 36H86M34 44H86",
      "M34 50H86V54H34Z",
      "M80 54V66",
    ],
    signal: [78, 66],
  },
  // Three rising chevrons over the router and its ports.
  "wifi-networking": {
    paths: [
      "M52 40L60 34L68 40",
      "M44 32L60 20L76 32",
      "M36 24L60 6L84 24",
      box(30, 54, 60, 20, 4),
      "M38 80V74M82 80V74",
      "M64 64H70M74 64H80",
    ],
    signal: [40, 62],
  },
  // A camera on its wall bracket, and its field of view.
  surveillance: {
    paths: [
      "M18 40V80",
      "M18 58H32V48",
      box(26, 24, 54, 24, 5),
      oct(86, 36, 6),
      "M92 30L104 22",
      "M92 42L104 50",
    ],
    signal: [32, 30],
  },
};

/** Blueprint grid behind the icon, every 12 units. */
const GRID = Array.from({ length: 11 }, (_, i) => `M${i * 12} 0V90`)
  .concat(Array.from({ length: 8 }, (_, i) => `M0 ${i * 12 + 3}H120`))
  .join("");

/**
 * The icon for one service, filling the plate. Server markup is the finished
 * drawing; the Services scene draws it in through these hooks:
 *   data-icon-grid    the blueprint grid (fades in)
 *   data-icon-path    each line, in drawing order (DrawSVG)
 *   data-icon-signal  the orange status square (switches on last)
 */
export function ServiceIcon({
  icon,
  className,
}: {
  icon: ServiceIconKey;
  className?: string;
}) {
  const def = ICONS[icon];
  return (
    <svg
      viewBox="0 0 120 90"
      fill="none"
      aria-hidden="true"
      focusable="false"
      className={cn("block", className)}
    >
      <path
        data-icon-grid=""
        d={GRID}
        className="text-foreground/6"
        stroke="currentColor"
        vectorEffect="non-scaling-stroke"
      />
      <g
        className="text-foreground"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinejoin="miter"
        strokeLinecap="square"
      >
        {def.paths.map((d) => (
          <path
            key={d}
            data-icon-path=""
            d={d}
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </g>
      <rect
        data-icon-signal=""
        x={def.signal[0]}
        y={def.signal[1]}
        width={4}
        height={4}
        className="fill-primary motion-safe:animate-pulse"
      />
    </svg>
  );
}
