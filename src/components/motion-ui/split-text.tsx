"use client";

import { useEffect, useRef } from "react";

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
 * Like `Reveal`, the hidden state is CSS behind an `html.js` guard, so the server
 * sends readable text and a failed or slow script never leaves a headline blank.
 *
 * The full string stays in the accessibility tree as one label, so screen readers
 * read a sentence rather than a pile of fragments.
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
      aria-label={children}
    >
      {units.map((unit, i) => (
        <span
          key={`${unit}-${i}`}
          aria-hidden
          className="inline-block overflow-hidden align-bottom"
        >
          <span
            data-split-unit
            className="inline-block"
            style={
              { "--split-delay": `${delay + i * stagger}s` } as React.CSSProperties
            }
          >
            {unit}
            {by === "word" && i < units.length - 1 ? " " : ""}
          </span>
        </span>
      ))}
    </Tag>
  );
}
