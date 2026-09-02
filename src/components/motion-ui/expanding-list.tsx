"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { cn } from "@/lib/utils";

export interface ExpandingListItem {
  title: string;
  summary: string;
  body: string;
}

export interface ExpandingListProps extends React.ComponentProps<"div"> {
  items: ExpandingListItem[];
  /** Index open on first render. Pass null for all closed. */
  defaultOpen?: number | null;
}

/**
 * A numbered list whose rows open in place.
 *
 * The alternative — a grid of equal cards — gives eight services the same weight
 * and no way in. A numbered list is scannable at a glance, admits a long
 * description without the layout fighting it, and reads as a specification rather
 * than as marketing. For an integrator, that register is the point.
 *
 * One row open at a time, so the page never becomes a wall. The open row is
 * marked by tone and by the rotated glyph, not by colour: the accent is spent on
 * actions now, and a list of eight state indicators is not an action.
 *
 * No rules between rows either. 32px of padding above and below each trigger is
 * the grouping, which is the same trade the About facts panel makes.
 *
 * Rows are real buttons with `aria-expanded` and `aria-controls`. The panel is
 * height-animated with a grid trick rather than max-height guessing, so the
 * transition is exact whatever the content length.
 */
export function ExpandingList({
  items,
  defaultOpen = 0,
  className,
  ...props
}: ExpandingListProps) {
  const [open, setOpen] = useState<number | null>(defaultOpen);

  return (
    <div className={cn("flex flex-col", className)} {...props}>
      {items.map((item, i) => {
        const isOpen = open === i;
        const panelId = `expanding-panel-${i}`;
        const buttonId = `expanding-trigger-${i}`;

        return (
          <div key={item.title}>
            <h3>
              <button
                type="button"
                id={buttonId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : i)}
                className="group flex w-full items-start gap-6 py-8 text-left md:gap-10"
              >
                <span
                  className={cn(
                    "mt-1 font-mono text-[11px] tabular-nums transition-colors duration-300",
                    isOpen ? "text-foreground" : "text-muted-foreground/40",
                  )}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>

                <span className="min-w-0 flex-1">
                  <span
                    className={cn(
                      "display-3 block transition-colors duration-300",
                      isOpen
                        ? "text-foreground"
                        : "text-foreground/85 group-hover:text-foreground",
                    )}
                  >
                    {item.title}
                  </span>
                  <span className="meta mt-2 block">{item.summary}</span>
                </span>

                {/* No `size-4` and no `strokeWidth`: 24x24 at 1.5 is the
                    system default, set once in globals.css. The 24px box
                    matches `.display-3`'s own 24px line box exactly, so the
                    `mt-1` that nudged the old 16px glyph onto the title's
                    baseline is gone too — at this size it aligns by itself. */}
                <Plus
                  aria-hidden
                  className={cn(
                    "shrink-0 transition-[color,rotate] duration-300",
                    isOpen
                      ? "text-foreground rotate-45"
                      : "text-muted-foreground/50 group-hover:text-foreground rotate-0",
                  )}
                />
              </button>
            </h3>

            {/* grid-template-rows 0fr -> 1fr animates to the content's real height,
                so nothing has to guess a max-height that later turns out wrong. */}
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              className={cn(
                "grid transition-[grid-template-rows,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
                isOpen
                  ? "grid-rows-[1fr] opacity-100"
                  : "grid-rows-[0fr] opacity-0",
              )}
            >
              <div className="overflow-hidden">
                {/* pl matches the number column above: gap + an 11px digit glyph. */}
                <p className="body-text pr-10 pb-8 pl-[calc(0.75rem+11px)] md:pl-[calc(1.75rem+11px)]">
                  {item.body}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
