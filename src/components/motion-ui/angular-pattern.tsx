import { cn } from "@/lib/utils";

export interface AngularPatternProps extends React.ComponentProps<"div"> {
  /** Overall opacity of the device, 0–1. */
  opacity?: number;
  /** Mirror it horizontally. */
  flip?: boolean;
}

/**
 * The brand's angular device — the 45° bracket from the Figma Pattern System
 * (page 04), the same geometry the Husky mark is built on.
 *
 * This is the site's structural graphic in place of photography: a large, quiet
 * shape that gives a section depth without competing with the type. Decorative
 * by definition, so it is hidden from assistive technology.
 */
export function AngularPattern({
  opacity = 1,
  flip = false,
  className,
  ...props
}: AngularPatternProps) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none select-none", className)}
      style={{ opacity }}
      {...props}
    >
      <svg
        viewBox="0 0 400 500"
        fill="none"
        preserveAspectRatio="xMidYMid meet"
        className={cn("size-full", flip && "-scale-x-100")}
      >
        <path
          d="M400 0 L400 90 L150 250 L400 410 L400 500 L60 283 L60 217 Z"
          fill="currentColor"
        />
      </svg>
    </div>
  );
}

/**
 * A faint 45° hatch, tiled. Gives an empty section a surface without adding an
 * image. Sits behind content at very low opacity — if you can see it clearly,
 * it's too strong.
 */
export function AngularHatch({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0", className)}
      style={{
        backgroundImage:
          "repeating-linear-gradient(135deg, currentColor 0 1px, transparent 1px 14px)",
      }}
      {...props}
    />
  );
}
