"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

import { cn } from "@/lib/utils";

export interface ColumnGuidesProps extends React.ComponentProps<"div"> {
  /** Number of columns drawn. */
  columns?: number;
  /** How many carry a travelling band at once. */
  active?: number;
  /** Seconds for one band to fall the full height. */
  duration?: number;
  /** Seconds between reshuffles of which columns are active. */
  interval?: number;
}

/**
 * The layout grid, made visible — hairline columns with a light slowly falling
 * down a few of them.
 *
 * Most decorative backgrounds are applied *to* a layout. This one is the layout:
 * the same column rhythm the content sits on, exposed as structure. That is why it
 * suits an integrator — it reads as a drawing, a plan view, rather than as
 * ornament, and it costs nothing conceptually because the grid was already there.
 *
 * The bands travel over a very long duration and the active set is reshuffled on
 * an interval, so nothing ever loops visibly. Keep the opacity low enough that the
 * effect registers as instrumentation rather than glow — if you notice it moving,
 * it is too strong.
 *
 * Decorative and aria-hidden. Under reduced motion the columns render static:
 * the grid is the point, the movement is a bonus.
 */
export function ColumnGuides({
  columns = 12,
  active = 3,
  duration = 14,
  interval = 6,
  className,
  ...props
}: ColumnGuidesProps) {
  // Index plus its stagger, decided together in the effect. Rolling the delay
  // during render is impure and re-rolls on every re-render.
  const [lit, setLit] = useState<{ column: number; delay: number }[]>([]);

  useEffect(() => {
    const pick = () => {
      const pool = Array.from({ length: columns }, (_, i) => i);
      // Fisher-Yates, then take the first `active`.
      for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
      }
      setLit(
        pool.slice(0, active).map((column) => ({
          column,
          delay: Math.random() * 3,
        })),
      );
    };

    pick();
    const id = setInterval(pick, interval * 1000);
    return () => clearInterval(id);
  }, [columns, active, interval]);

  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 flex overflow-hidden",
        className,
      )}
      {...props}
    >
      {Array.from({ length: columns }, (_, i) => (
        <div
          key={i}
          className="relative h-full flex-1 border-r last:border-r-0"
        >
          <AnimatePresence>
            {lit.some((l) => l.column === i) && (
              <motion.div
                initial={{ y: "-110%" }}
                animate={{ y: "110%" }}
                exit={{ opacity: 0 }}
                transition={{
                  duration,
                  ease: "linear",
                  delay: lit.find((l) => l.column === i)?.delay ?? 0,
                }}
                className="absolute inset-x-0 h-1/3 motion-reduce:hidden"
                style={{
                  background:
                    "linear-gradient(to bottom, transparent, color-mix(in oklch, var(--primary) 9%, transparent), transparent)",
                }}
              />
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
