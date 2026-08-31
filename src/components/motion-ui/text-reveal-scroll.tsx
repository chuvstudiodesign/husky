"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import type { MotionValue } from "motion/react";

import { cn } from "@/lib/utils";

export interface TextRevealScrollProps {
  children: string;
  className?: string;
  /** Opacity of a word before it is reached. */
  from?: number;
}

function Word({
  children,
  progress,
  range,
  from,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
  from: number;
}) {
  const opacity = useTransform(progress, range, [from, 1]);
  return (
    <motion.span style={{ opacity }} className="inline-block">
      {children}&nbsp;
    </motion.span>
  );
}

/**
 * A passage that brightens word by word as it is scrolled through.
 *
 * Unlike an entrance animation, this is scroll-*linked*: the reader's position
 * drives it directly, so scrolling back up dims the words again. That coupling is
 * the whole effect — it makes the reader feel like they are lighting the sentence
 * as they read it, and it paces a long statement without breaking it into slides.
 *
 * Best on a single strong passage per page. Used on more than one, the device stops
 * being a moment and becomes a tic.
 *
 * The text stays a normal string in the DOM, so it is selectable, searchable and
 * read as one sentence. Under reduced motion every word is simply at full opacity.
 */
export function TextRevealScroll({
  children,
  className,
  from = 0.15,
}: TextRevealScrollProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    // Starts when the block is a third up the viewport, finishes at the middle,
    // so the reader is looking at the words as they light rather than after.
    offset: ["start 0.85", "start 0.35"],
  });

  const words = children.split(" ");

  if (reduced) {
    return <p className={cn(className)}>{children}</p>;
  }

  return (
    <p ref={ref} className={cn("flex flex-wrap", className)}>
      {words.map((word, i) => {
        const start = i / words.length;
        const end = (i + 1) / words.length;
        return (
          <Word
            key={`${word}-${i}`}
            progress={scrollYProgress}
            range={[start, end]}
            from={from}
          >
            {word}
          </Word>
        );
      })}
    </p>
  );
}
