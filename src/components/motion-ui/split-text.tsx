"use client";

import { Fragment, useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

export interface SplitTextProps {
  children: string;
  /** Split into words (default) or individual characters. */
  by?: "word" | "char";
  /** Seconds between each unit. */
  stagger?: number;
  /** Seconds before the first unit moves. */
  delay?: number;
  className?: string;
  /** Element to render. Use the real heading level — this is display text. */
  as?: "h1" | "h2" | "h3" | "p" | "span" | "div";
}

/**
 * Reveals a line of text unit by unit as it scrolls into view — each word (or
 * character) rising into place on a short stagger.
 *
 * Like `Reveal`, the hidden state is CSS behind `@media (scripting: enabled)`, so
 * a browser without scripting gets the server's readable text and nothing hides.
 *
 * The full string sits in a visually hidden span and every animated unit is
 * `aria-hidden`, so screen readers read a sentence rather than a pile of
 * fragments, and an `h1` rendered via `as` takes its name from that text.
 */
export function SplitText({
  children,
  by = "word",
  stagger = 0.05,
  delay = 0,
  className,
  as: Tag = "span",
}: SplitTextProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.setAttribute("data-revealed", "");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -5% 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const units = by === "word" ? children.split(" ") : Array.from(children);

  return (
    <Tag
      ref={ref as React.Ref<never>}
      data-split
      className={cn("inline", className)}
    >
      <span className="sr-only">{children}</span>
      {units.map((unit, i) =>
        // Char mode splits on every character, spaces included. A space has
        // nothing to animate and would collapse to nothing inside a mask, which
        // is what once ran "INTELLIGENT HOME" together.
        unit === " " ? (
          <Fragment key={`space-${i}`}> </Fragment>
        ) : (
          // The word space is a sibling of the mask, not content inside it. As a
          // child it had to be a non-breaking space to survive whitespace
          // trimming, and an NBSP is exactly what a headline must not contain: it
          // removes the line-break opportunity between the words, so a run like
          // "engineered quietly." became one unbreakable box that overflows a
          // narrow column instead of wrapping. Out here it is an ordinary space in
          // the heading's own text flow — it breaks, and it takes the heading's
          // letter-spacing like any other space.
          <Fragment key={`${unit}-${i}`}>
            <span
              aria-hidden
              data-split-mask
              className="inline-block overflow-hidden align-bottom"
            >
              <span
                data-split-unit
                className="inline-block"
                style={
                  {
                    "--split-delay": `${delay + i * stagger}s`,
                  } as React.CSSProperties
                }
              >
                {unit}
              </span>
            </span>
            {by === "word" && i < units.length - 1 ? " " : ""}
          </Fragment>
        ),
      )}
    </Tag>
  );
}
