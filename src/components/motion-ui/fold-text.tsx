"use client";

import { Fragment, useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

export interface FoldTextProps {
  children: string;
  /** Seconds between each word. */
  stagger?: number;
  /** Seconds before the first word moves. */
  delay?: number;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p" | "span" | "div";
}

/**
 * A headline that folds into place, each word rotating up from flat.
 *
 * Where `SplitText` slides words up behind a mask, this rotates them around their
 * bottom edge in 3D — the word starts lying flat, away from the reader, and swings
 * upright. It is the heavier of the two treatments, so it belongs on one headline
 * per page, not on every section.
 *
 * The perspective lives on the wrapper rather than each word, so the whole line
 * shares one vanishing point and folds as a single sheet instead of as loose tiles.
 *
 * Like every reveal here, the starting state is gated behind
 * `@media (scripting: enabled)`: the server sends a readable headline, and only a
 * browser with scripting hides anything. The full string sits in a visually hidden
 * span, so the heading keeps its name.
 */
export function FoldText({
  children,
  stagger = 0.07,
  delay = 0,
  className,
  as: Tag = "span",
}: FoldTextProps) {
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
      { threshold: 0.25, rootMargin: "0px 0px -5% 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const words = children.split(" ");

  return (
    <Tag
      ref={ref as React.Ref<never>}
      data-fold
      className={cn("inline", className)}
      style={{ perspective: "800px" }}
    >
      <span className="sr-only">{children}</span>
      {words.map((word, i) => (
        // The space is a sibling of the word, not a child: inside an
        // `inline-block` it is trailing whitespace and gets trimmed away, which
        // runs the whole headline together.
        <Fragment key={`${word}-${i}`}>
          <span
            data-fold-unit
            aria-hidden
            className="inline-block origin-bottom"
            style={{ "--fold-delay": `${delay + i * stagger}s` } as React.CSSProperties}
          >
            {word}
          </span>
          {i < words.length - 1 ? " " : ""}
        </Fragment>
      ))}
    </Tag>
  );
}
