"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";

export interface ServiceTab {
  name: string;
  description: string;
  /** Panel mock for this service, 1200 × 910. */
  image: string;
  alt: string;
  /** Rendered on the server so the icon set never reaches the client bundle. */
  icon: React.ReactNode;
}

/** One full turn of the progress bar before the next service takes over. */
const CYCLE_MS = 6000;

/* A background tab keeps its animation timeline running, so the clock also
   halts while the document is hidden. */
function subscribeVisibility(onChange: () => void) {
  document.addEventListener("visibilitychange", onChange);
  return () => document.removeEventListener("visibilitychange", onChange);
}
const isHidden = () => document.visibilityState === "hidden";

/**
 * The interactive half of a showcase card: a strip of tabs under the panel
 * selects which service the panel shows, and the tiles in the left column are
 * the long form of whatever the strip has selected.
 *
 * **The strip is the only control.** Tabs, keyboard, ids and the progress line
 * all live there, directly under the thing they change — a tab that sits beside
 * its panel rather than on it makes the reader guess which of the two columns
 * is driving. The tiles are a plain list: from `lg` the selected one takes a
 * `--muted` fill and the brighter border so the eye can pair panel with tile,
 * and nothing in that column is focusable. One set of tabs per panel, or a
 * screen reader is offered the same choice twice.
 *
 * **On a phone none of that exists.** The panel column is `hidden` below `lg` —
 * tabs, panel and progress bar with it — and the tiles are the whole section,
 * with no selected state to show. The state and the clock still mount, and
 * cost nothing: an unrendered column
 * never intersects, so the countdown is paused before it starts.
 *
 * The whole card interior is one island because the tabs and the panel share a
 * single piece of state. Everything around it — the section, its heading, the
 * copy, and the icons, which arrive already rendered as `ReactNode` — stays on
 * the server. The client bundle gets this file and nothing else from the
 * section.
 *
 * **The timer is the progress bar.** There is no `setInterval` shadowing an
 * animation and drifting out of step with it: the bar *is* the clock. One Web
 * Animations object scales it from 0 to 1 over six seconds, and its `finish`
 * event is what advances the tab, so what the reader sees and what the
 * component does cannot disagree. Pausing is `anim.pause()`, which is also why
 * hover, focus, scrolling out of view and a backgrounded tab are four lines
 * rather than a state machine. `transform` only, so it runs on the compositor.
 *
 * **Reduced motion.** No animation is created at all: nothing auto-advances,
 * and the bar sits at full width as a static marker of which tab is selected
 * (`motion-reduce:scale-x-100` in CSS, so the resting state is correct before
 * any JS runs and there is no frame where a full orange bar flashes). The panel
 * swap loses its crossfade and becomes instant. Tabs stay clickable and
 * keyboard-operable either way — the interaction is never what gets removed.
 *
 * **Every tab keeps its track.** The hairline under an inactive tab is the same
 * border token as the card outlines, so the strip shows the reader where the
 * countdown will run before it runs. A bar that only exists once it has started
 * moving is a countdown nobody sees begin; the accent is still spent once, on
 * the tab that is actually counting.
 *
 * **Why the bar is orange.** It is the one thing in the section that says
 * "here, now", which is exactly what the accent is for, and there is at most
 * one showcase card in a viewport at a time. The group label above it stays
 * muted so the card has one signal, not two.
 */
export function ServiceTabs({
  label,
  tabs,
}: {
  /** The family name — the group heading, and the tablist's accessible name. */
  label: string;
  tabs: ServiceTab[];
}) {
  const uid = useId();
  const tabId = (i: number) => `${uid}-tab-${i}`;
  const panelId = `${uid}-panel`;

  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [onScreen, setOnScreen] = useState(false);
  const hidden = useSyncExternalStore(
    subscribeVisibility,
    isHidden,
    () => false,
  );

  const reduced = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const animRef = useRef<Animation | null>(null);
  const buttonsRef = useRef<(HTMLButtonElement | null)[]>([]);
  // Starts halted: nothing should be counting down before the card is on screen.
  const haltedRef = useRef(true);

  const count = tabs.length;

  /* Only run the clock while the panel is actually being looked at, and the
     observed element is the panel column itself rather than the card. Below
     `lg` that column is `display: none`, a non-rendered element never
     intersects anything, so on a phone the countdown is paused from the first
     callback and never advances a tab nobody can see. */
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setOnScreen(entry.isIntersecting),
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /* The bar, and therefore the timer. Re-created on every change of tab, which
     is what resets the countdown when the reader picks one themselves. */
  useEffect(() => {
    if (reduced) return;
    const el = barRef.current;
    if (!el) return;
    /* The `scale` property, not `transform` — and that is a bug fix, not a
       preference. Tailwind v4's `scale-x-*` utilities compile to the individual
       `scale` property, and the used transform multiplies `scale` by
       `transform`: a resting `scale: 0%` under an animated `transform:
       scaleX(t)` comes out 0 × t = 0 at every frame, so the bar rendered at
       zero width the whole way through and nothing was ever visible. One
       property, one value, no composition. Still compositor-driven. */
    const anim = el.animate([{ scale: "0 1" }, { scale: "1 1" }], {
      duration: CYCLE_MS,
      easing: "linear",
      fill: "forwards",
    });
    anim.onfinish = () => setActive((i) => (i + 1) % count);
    if (haltedRef.current) anim.pause();
    animRef.current = anim;
    return () => {
      anim.cancel();
      animRef.current = null;
    };
  }, [active, count, reduced]);

  const halted = hovered || !onScreen || hidden;
  useEffect(() => {
    haltedRef.current = halted;
    const anim = animRef.current;
    if (!anim) return;
    if (halted) anim.pause();
    else anim.play();
  }, [halted]);

  /* Picking a tab always restarts its six seconds, including the tab that is
     already selected. `setActive` alone would not: React bails out of a
     same-value update, the effect above never re-runs, and a reader re-picking
     the service they are reading would watch the bar carry on and swap out from
     under them anyway. Rewinding the running animation is the same reset by the
     other route. */
  const select = useCallback(
    (i: number) => {
      if (i !== active) {
        setActive(i);
        return;
      }
      const anim = animRef.current;
      if (anim) anim.currentTime = 0;
    },
    [active],
  );

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      let next: number | null = null;
      if (e.key === "ArrowDown" || e.key === "ArrowRight")
        next = (active + 1) % count;
      else if (e.key === "ArrowUp" || e.key === "ArrowLeft")
        next = (active - 1 + count) % count;
      else if (e.key === "Home") next = 0;
      else if (e.key === "End") next = count - 1;
      if (next === null) return;
      e.preventDefault();
      select(next);
      buttonsRef.current[next]?.focus();
    },
    [active, count, select],
  );

  return (
    <div
      className="p-6 md:p-8"
      /* Hover and focus both hold the countdown: nobody should have the thing
         they are reading swapped out from under them. `FocusCapture` rather
         than `onFocus` so a focus anywhere inside the card counts. */
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setHovered(true)}
      onBlurCapture={() => setHovered(false)}
    >
      {/* Muted, not the section eyebrow's orange. This is the third label the
          eye meets in one viewport, and three orange labels is a pattern
          rather than a signal — the progress bar is where the accent goes.

          It sits above both columns rather than inside the left one, and that
          is what squares the card up: a label in the column pushed the tiles
          down by its own height while the panel beside them started at the top,
          so the two columns began and ended on four different lines. Out here
          it belongs to the card, and the tile stack and the panel share one top
          edge and one bottom edge. */}
      <h3 className="meta">{label}</h3>

      <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:gap-12">
        {/* `auto-rows-fr` is what makes the tiles in a family exactly equal, and
            it does it by measurement — the browser's, taken at the width
            actually being rendered. A hardcoded height is arithmetic done once
            at one width and wrong at every other, which is how the flat grid
            this replaced ended up clipping a line of text at 1024. Rows share
            the tallest row's height at every breakpoint, and the stack fills
            the column, so the last tile's bottom edge lands on the strip's.
            Nothing is clipped because nothing is capped. */}
        <ul role="list" className="grid auto-rows-fr gap-4">
          {tabs.map((tab, i) => {
            const selected = i === active;
            return (
              <li
                key={tab.name}
                /* Content, not a control. The strip under the panel is the
                   tablist, and below `lg` there is no panel for a tile to
                   select, so nothing here is focusable or clickable.

                   Every tile keeps the hairline. From `lg` the selected one
                   also fills `--muted` behind the brighter border — inside a
                   card light means raised (mandate in services.tsx's header) —
                   and the fill lands on one tile only, so the third surface
                   level the nesting rule tolerates never becomes a wall of
                   boxes. The strip below carries the colour; nothing up here
                   changes hue.

                   `justify-center` because `auto-rows-fr` gives every tile the
                   tallest row's height, and in the two-service families that is
                   the panel column's height split in two — 219px of tile around
                   92px of text. Top-aligned, the leftover 102px all pooled under
                   the last line and the tile read as half empty. Centred, the
                   block sits on the tile's midline and the slack is shared. It
                   is only the block that moves: the text keeps `text-left`, the
                   padding is untouched, and where the tiles are tight — the
                   three-service families, 25px of slack top and bottom — the
                   rule is a no-op. */
                className={cn(
                  "flex h-full flex-col justify-center rounded-lg border p-6 text-left",
                  "transition-colors duration-200",
                  selected && "lg:border-white/16 lg:bg-muted",
                )}
              >
                {/* Icon on the title's line rather than above it. In a stacked
                    column a row of glyphs down the left is a second list, and
                    the line box is 24px either way, so it costs no height. */}
                <div className="flex items-center gap-3">
                  {tab.icon}
                  <h4 className="display-3">{tab.name}</h4>
                </div>
                <p className="body-text mt-3">{tab.description}</p>
              </li>
            );
          })}
        </ul>

        {/* The panel is the contrast — a sheet of `--brand-light` against the
            card — so it needs no frame of its own, only the 4px the rest of the
            system rounds to. It keeps its one true aspect ratio rather than
            being cropped to fill the column: cropping a screenshot to fit is
            how a showcase starts looking like stock art.

            **Desktop only** (client, 2026-09-01). At 390 the column comes out
            292px wide, so a 1200 × 910 mock renders at a quarter scale and
            nothing drawn inside it can be read: the three of them were spending
            1116px of page — more than a phone screen — on a picture of a
            screenshot. The whole column goes,
            panel and strip together, and the tiles become the section on a
            phone. `hidden` and not `sr-only`: it takes the tablist, the
            tabpanel and every `role="tab"` in it out of the accessibility tree
            in one move, so there is no tab strip left to announce, nothing
            focusable behind a display that isn't there, and no `aria-controls`
            pointing at a panel that has no shape. The tiles are plain list
            items, so nothing below `lg` is left pointing at a panel that
            isn't there. */}
        {/* `self-center`: from `lg` to about 1200px the tiles wrap to three lines
            and outgrow the panel — 536px of tiles against 375px of panel and
            strip at 1024 — and a top-aligned panel left the slack pooled under
            the strip as a dead band. Centred, the panel sits on the tiles'
            midline and the slack splits. At 1440 and up the panel is the taller
            column and the tiles stretch to it, so the rule is a no-op there. */}
        <div ref={rootRef} className="hidden flex-col lg:flex lg:self-center">
          {/* Every mock is stacked in one box that already holds the 1200/910
            ratio, so the swap moves no layout at all — the crossfade is opacity
            on absolutely positioned siblings and the box never changes size. */}
          <div
            role="tabpanel"
            id={panelId}
            aria-labelledby={tabId(active)}
            className="relative aspect-[1200/910] w-full"
          >
            {tabs.map((tab, i) => (
              /* A plain `img`, not `next/image`: these are static SVGs served
               from /public, and the optimizer has nothing to resize, re-encode
               or lazily size for a vector. */
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                key={`${tab.image}-${i}`}
                src={tab.image}
                /* Only the visible mock is described. The other two are the same
                 picture waiting its turn, and three alt texts in the tree at
                 once would be read out as three images. */
                alt={i === active ? tab.alt : ""}
                aria-hidden={i !== active}
                width={1200}
                height={910}
                loading="lazy"
                decoding="async"
                className={cn(
                  "absolute inset-0 h-full w-full rounded-lg",
                  /* Half a second, eased at both ends. The swap is not an
                     entrance but a dissolve between two sheets of the same
                     grey, and an ease-out alone runs at full speed on the first
                     frame, which is the part that read as a cut. Opacity only,
                     so it stays on the compositor. */
                  "transition-opacity duration-500 ease-in-out motion-reduce:transition-none",
                  i === active ? "opacity-100" : "opacity-0",
                )}
              />
            ))}
          </div>

          {/* The tab strip, directly under what it changes. From `lg` up it is
            one column per service, so the tracks read as one ruler divided into
            equal parts and the running one is visibly a fraction of the whole.
            Names wrap rather than truncate, and `mt-auto` on the track keeps
            the hairlines on one line across items of unequal height.

            `mt-auto` on the strip itself does the same job one level up: it
            rides the foot of the column, so the strip's baseline and the last
            tile's bottom edge are the same line. `pt-6` is the floor on that
            gap for the case where the two columns come out the same height.

            It goes down with the column below `lg`, and it has no phone form of
            its own to fall back to: an earlier pass collapsed it to the dots of
            a slider, which was a control for a panel that no longer ships at
            that width. Nothing left to page through, nothing to indicate. */}
          <div
            role="tablist"
            aria-label={label}
            onKeyDown={onKeyDown}
            className={cn(
              "grid gap-4 pt-6 xl:mt-auto",
              count === 2 ? "grid-cols-2" : "grid-cols-3",
            )}
          >
            {tabs.map((tab, i) => {
              const selected = i === active;
              return (
                <button
                  key={tab.name}
                  ref={(el) => {
                    buttonsRef.current[i] = el;
                  }}
                  type="button"
                  role="tab"
                  id={tabId(i)}
                  aria-selected={selected}
                  aria-controls={panelId}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => select(i)}
                  /* Same string as the visible label beside it, so the icon
                     inside cannot end up part of the tab's accessible name. */
                  aria-label={tab.name}
                  /* The icons arrive from the server already carrying
                   `text-muted-foreground` at their 24px default, which is the
                   tile's size, not the strip's. Sized and re-coloured from here
                   so one icon element serves both places and the glyph follows
                   whatever the label is doing — which is why the running tab
                   goes orange in one stroke: label, glyph and fill are one
                   colour, and the tab that is counting is the only thing in the
                   card wearing it. */
                  className={cn(
                    /* `min-w-0` because a grid column's automatic minimum is
                       its content's min-content width, and three columns of
                       "Entertainment" plus the card padding come to within a
                       few pixels of a 390 viewport. Without it the strip is one
                       long service name away from widening the whole document
                       rather than wrapping. */
                    "flex h-full min-w-0 flex-col items-stretch justify-center",
                    "text-left outline-none",
                    "rounded-lg transition-colors duration-200",
                    "focus-visible:ring-ring focus-visible:ring-3",
                    "[&_svg]:size-4 [&_svg]:text-current",
                    selected
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <span className="flex items-start gap-2">
                    {tab.icon}
                    <span className="nav-text break-words">{tab.name}</span>
                  </span>

                  <span aria-hidden className="mt-auto block w-full pt-3">
                    {/* The track: a hairline the full width of the column, and
                        the bar that fills it left to right. */}
                    <span className="bg-border relative block h-0.5 w-full">
                      {selected ? (
                        <span
                          ref={barRef}
                          className="bg-primary absolute inset-0 origin-left scale-x-0 motion-reduce:scale-x-100"
                        />
                      ) : null}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
