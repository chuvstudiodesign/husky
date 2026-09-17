"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

export interface StickyStep {
  /** The step's name. Carries the meaning — the number never does it alone. */
  title: string;
  /** One paragraph of detail. */
  body: string;
}

export interface StickyStepsProps
  extends Omit<React.ComponentProps<"div">, "children"> {
  steps: StickyStep[];
}

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * A pinned instrument panel with content stepping past it.
 *
 * On `lg` and up the left column holds a large step readout — `03 / 05`, the
 * current title, a progress rail — and stays put via CSS `position: sticky` while
 * the right column's steps scroll through. That pairing of a fixed panel and
 * advancing content is the whole "how it works" idea in one section.
 *
 * **The pin is CSS, not JavaScript.** No ScrollTrigger, no wheel interception, no
 * scroll hijack. `position: sticky` is native, survives a failed script, and never
 * fights a trackpad, a screen reader's caret movement or a `Find on page` jump.
 * The only thing JS decides is *which* step is current.
 *
 * That decision is one `getBoundingClientRect` pass per step, coalesced to a single
 * `requestAnimationFrame` per scroll burst: the active step is the last one whose
 * top has crossed a probe line at 42% of the viewport. React state changes at most
 * once per step — five renders for a five-step section — so the scroll handler is
 * never in React's update path.
 *
 * Below `lg` the sticky column is not rendered at all. A pinned panel on a 390px
 * screen is dead weight: it eats half the viewport to repeat information the list
 * already carries. The list keeps its inline numbers and reads as a plain
 * numbered walkthrough, which is what a phone wants.
 *
 * **Dimming is done with colour tokens, not opacity.** Fading an inactive
 * paragraph to 40% would drop `--muted-foreground` body copy under the 4.5:1 floor.
 * Instead the active step's title steps up from `--muted-foreground` to
 * `--foreground` and its rule turns `--primary`; body copy never changes contrast.
 * The dim reads clearly and stays legible for someone who simply hasn't scrolled
 * there yet.
 *
 * The dim itself lives in CSS behind `@media (scripting: enabled)`, so with no JS
 * every step renders at full strength rather than permanently greyed with no way
 * to activate it. Reduced motion needs no branch here: the global
 * `prefers-reduced-motion` rule collapses the colour transitions to an instant
 * swap, and the markup is byte-identical either way.
 */
export function StickySteps({ steps, className, ...props }: StickyStepsProps) {
  const [active, setActive] = useState(0);
  const itemsRef = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    let frame = 0;

    const measure = () => {
      frame = 0;
      // The probe sits a little above centre so a step becomes current as it
      // arrives at reading position, not after it has passed.
      const probe = window.innerHeight * 0.42;
      let next = 0;
      const items = itemsRef.current;

      for (let i = 0; i < items.length; i += 1) {
        const el = items[i];
        if (!el) continue;
        if (el.getBoundingClientRect().top <= probe) next = i;
      }

      setActive((prev) => (prev === next ? prev : next));
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [steps.length]);

  if (steps.length === 0) return null;

  const current = steps[Math.min(active, steps.length - 1)];

  return (
    <div
      className={cn("grid gap-14 lg:grid-cols-12 lg:gap-16", className)}
      {...props}
    >
      {/* The pinned readout. Everything in it is a restatement of the list, so it
          is hidden from assistive technology rather than read twice. */}
      <div className="hidden lg:col-span-5 lg:block" aria-hidden>
        <div className="sticky top-[18vh]">
          <p className="meta">Process</p>

          <div className="mt-5 flex items-baseline gap-3">
            <span
              key={`n-${active}`}
              data-step-readout
              className="text-foreground font-mono text-7xl leading-none font-medium tabular-nums"
            >
              {pad(active + 1)}
            </span>
            <span className="text-muted-foreground font-mono text-xl leading-none tabular-nums">
              / {pad(steps.length)}
            </span>
          </div>

          <p
            key={`t-${active}`}
            data-step-readout
            className="display-2 mt-7 max-w-[12ch]"
          >
            {current.title}
          </p>

          {/* Progress rail — the one orange signal in the section. */}
          <div className="mt-10 flex gap-1">
            {steps.map((step, i) => (
              <span
                key={step.title}
                className={cn(
                  "h-px flex-1 transition-colors duration-200 ease-out",
                  i <= active ? "bg-primary" : "bg-border",
                )}
              />
            ))}
          </div>
        </div>
      </div>

      <ol className="flex flex-col gap-16 lg:col-span-7 lg:gap-28">
        {steps.map((step, i) => (
          <li
            key={step.title}
            ref={(el) => {
              itemsRef.current[i] = el;
            }}
            data-sticky-step
            data-active={i === active ? "" : undefined}
          >
            <div className="flex items-center gap-4">
              {/* Decorative: the ordered list already conveys the sequence. */}
              <span
                data-step-index
                aria-hidden
                className="meta text-muted-foreground"
              >
                {pad(i + 1)}
              </span>
              <span data-step-rule className="bg-border h-px flex-1" />
            </div>

            <h3 data-step-title className="display-3 text-foreground mt-6">
              {step.title}
            </h3>
            <p className="body-text mt-4">{step.body}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
