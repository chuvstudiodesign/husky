"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

export interface SectionIndexItem {
  id: string;
  label: string;
}

export interface SectionIndexProps extends React.ComponentProps<"nav"> {
  items: SectionIndexItem[];
}

/**
 * A scroll-spy index: a list of sections that marks which one is being read.
 *
 * The active section is decided by which one covers a probe line a third of the way
 * down the viewport, rather than by whichever is "most visible". That difference
 * matters on a page with sections of wildly different heights — a short section
 * between two tall ones would otherwise never win, and the index would skip it
 * entirely.
 *
 * It is a real `nav` with real links, so it works with scripting off and reads as
 * navigation to assistive technology. The active row carries `aria-current`.
 */
export function SectionIndex({ items, className, ...props }: SectionIndexProps) {
  const [active, setActive] = useState<string | null>(items[0]?.id ?? null);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const probe = window.innerHeight / 3;
      let current: string | null = null;

      for (const item of items) {
        const el = document.getElementById(item.id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= probe && rect.bottom > probe) {
          current = item.id;
          break;
        }
      }

      // Above the first section, keep the first row lit rather than none.
      if (!current) {
        const first = document.getElementById(items[0]?.id ?? "");
        if (first && first.getBoundingClientRect().top > probe) {
          current = items[0]?.id ?? null;
        }
      }

      setActive((prev) => (prev === current ? prev : current));
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [items]);

  return (
    <nav aria-label="Sections" className={cn(className)} {...props}>
      <ol className="flex flex-col">
        {items.map((item, i) => {
          const isActive = active === item.id;
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={isActive ? "true" : undefined}
                className="group flex items-baseline gap-4 py-2.5"
              >
                <span
                  className={cn(
                    "font-mono text-[10px] tabular-nums transition-colors duration-300",
                    isActive ? "text-primary" : "text-muted-foreground/40",
                  )}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  className={cn(
                    "text-[13px] transition-colors duration-300",
                    isActive
                      ? "text-foreground"
                      : "text-muted-foreground/50 group-hover:text-muted-foreground",
                  )}
                >
                  {item.label}
                </span>
                {/* The rule grows to mark the active row — a position indicator
                    that costs no colour and no extra element. */}
                <span
                  aria-hidden
                  className={cn(
                    "bg-primary ml-auto h-px transition-all duration-500",
                    isActive ? "w-8 opacity-100" : "w-0 opacity-0",
                  )}
                />
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
