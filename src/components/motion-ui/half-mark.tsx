"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";
import { HuskyMark } from "@/components/motion-ui/husky-mark";

/**
 * Sections the mark darkens over by default, keyed by element id.
 *
 * Only the light band. On every dark section the brand orange sits correctly, so
 * it stays; over the light grey Approach it loses its footing, and the card colour
 * turns the mark into a dark silhouette instead.
 *
 * Pass `darkOver={[]}` to switch the behaviour off entirely and keep the mark in
 * brand colour throughout.
 */
const DEFAULT_DARK_OVER = ["approach"];

export interface HalfMarkProps extends React.ComponentProps<"div"> {
  /** Viewport height the mark occupies at rest, on desktop. */
  height?: number;
  /** Viewport height it occupies at rest, on a phone. */
  mobileHeight?: number;
  /** Edge length of the docked badge, in pixels. */
  dockedSize?: number;
  /** Pixels of scroll before it docks or recedes. */
  threshold?: number;
  /**
   * Extra distance the resting mark drops below centre on a phone, as a
   * percentage of its own height. Applies only to the rest state — the docked
   * badge is pinned to the bottom-right corner and is unaffected. Defaults to
   * 0, so a caller has to ask for the drop.
   */
  mobileDrop?: number;
  /**
   * Element ids the mark repaints dark over. Pass `[]` to keep it in brand colour
   * for the whole page.
   */
  darkOver?: string[];
}

/**
 * The Husky wolf, bisected by the edge of the viewport, reacting to scroll.
 *
 * At rest the mark's horizontal centre sits exactly on the screen edge, so half the
 * face is visible and half runs off. It is fixed, so it holds that position while
 * the page scrolls past it.
 *
 * It renders from `lg` up only. On a phone there is nothing for it to be half of:
 * at rest it took the half of the hero the lead paragraph needed, and docked as a
 * corner badge it landed on the footer. Tablets lose it too, because the mark is
 * measured in `vh` while the copy column is capped in `ch` — at 768×1024 the wolf
 * grows with the height the text never uses and its ink runs under the hero lead.
 * The mobile props and the phone branches below are kept because callers still
 * pass them and the geometry is worth keeping written down, but nothing paints
 * below 1024px.
 *
 * Four behaviours are layered on top:
 *
 *   · **Docking.** Desktop has room to keep the mark where it is, so it stays put
 *     at full size and recedes to 10% — a watermark rather than a subject.
 *
 *   · **Exit.** From the third section down it is gone. The mark opens the page
 *     and then gets out of the way; past the second section the argument is
 *     carrying itself and the wolf is just ink on the copy. The fade runs 800ms
 *     on a symmetric ease, long enough that the boundary itself is invisible,
 *     and it reverses at the same line on the way up.
 *
 *   · **Colour.** The mark repaints as it passes over sections of different tone.
 *     The probe is the mark's own vertical centre, not the section entering the
 *     viewport, so the change fires exactly as the boundary crosses the middle of
 *     the wolf — and it is symmetric, so scrolling back up reverses it at the same
 *     line.
 *
 *   · **Mobile offset.** At rest on a phone the mark sits 10px below centre, which
 *     drops the ears clear of the headline. `mobileDrop` pushes it further down
 *     from there, in percent of the mark's own height — rest state only, so the
 *     docked badge in the corner keeps its position either way.
 *
 * Every state is written out per breakpoint rather than inherited, because a
 * half-specified variant silently keeps a value from the other branch — which is
 * exactly how the desktop mark once collapsed to badge size.
 *
 * Purely decorative and hidden from assistive technology, and it sits **behind
 * the page** — `-z-10`, a negative z-index, which is the only stacking value
 * that can do what the client asked for.
 *
 * The mandate is that the mark never paints over a word or a card in any state.
 * For a page-level fixed element that leaves exactly one option, because CSS
 * paints positioned descendants after in-flow content: at `z-index: 0`, `auto`,
 * or anything positive, the mark lands above every heading and every card on the
 * page, and the only thing holding it off the copy is whatever z-index each
 * section happened to put on its own wrapper. That is not a guarantee, it is a
 * streak — and the streak ended on the stats band, whose cards carry no z-index
 * at all. A negative z-index paints before in-flow content by definition, so the
 * guarantee stops depending on what any section remembers to do.
 *
 * The cost of going negative is that the mark also falls behind section
 * backgrounds, and an opaque `bg-background` would bury it. That is settled once
 * in globals.css rather than per section — see the `main section.bg-background`
 * rule there. It is the same colour as the page, so dropping the repaint costs
 * nothing and hands the layer back its visibility.
 *
 * Above it, in order: everything in the page's normal flow, the header at z-40,
 * the scroll progress bar at z-50, the grain at z-100.
 */
export function HalfMark({
  height = 78,
  mobileHeight = 49.4,
  dockedSize = 70,
  threshold = 8,
  mobileDrop = 0,
  darkOver = DEFAULT_DARK_OVER,
  className,
  style,
  ...props
}: HalfMarkProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [dark, setDark] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let frame = 0;

    // The mark locates the page itself rather than being told where it is: its
    // own parent is the element the sections are laid out in, on every route
    // that mounts it — the wrapper div on the home and site-1 pages, `main` on
    // /new-construction. `:scope > section` therefore reads the page's own
    // top-level sections and nothing nested inside them. Read once: sections
    // do not appear or disappear after mount, and re-querying on every frame
    // of a scroll for an answer that cannot change is work for nothing.
    const third = el.parentElement?.querySelectorAll(":scope > section")[2];

    const update = () => {
      frame = 0;
      setScrolled(window.scrollY > threshold);

      // Past the second section, the mark leaves. It is the brand's opening
      // statement, not a companion for the whole page, and by the third
      // section the copy has earned the screen to itself. The probe is the top
      // of the third section against the top of the viewport, so it fires the
      // instant the second section has fully left — and reverses on the same
      // line coming back up. A page with fewer than three sections (the
      // styleguide demos) keeps the mark throughout.
      setGone(!!third && third.getBoundingClientRect().top <= 0);

      // Which section is under the middle of the mark right now?
      const rect = el.getBoundingClientRect();
      const probe = rect.top + rect.height / 2;

      let over = false;
      for (const id of darkOver) {
        const section = document.getElementById(id);
        if (!section) continue;
        const s = section.getBoundingClientRect();
        if (probe >= s.top && probe < s.bottom) {
          over = true;
          break;
        }
      }
      setDark(over);
    };

    // Coalesce to one read per frame — scroll fires far faster than paint.
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
  }, [threshold, darkOver]);

  return (
    <div
      ref={ref}
      aria-hidden
      data-half-mark=""
      data-state={scrolled ? "docked" : "rest"}
      data-tone={dark ? "dark" : "brand"}
      data-visible={gone ? "false" : "true"}
      className={cn(
        "pointer-events-none fixed -z-10 select-none",
        // Desktop only, from lg up. A phone has no room for it: at rest the mark
        // ate the half of the hero the lead paragraph needed, and docked in the
        // corner it sat on top of the footer. The tablet band failed the same
        // test for a different reason — the mark is sized in vh and the copy is
        // capped in ch, so a tall narrow viewport (768×1024) grows the wolf while
        // the text column stays put and the ink crosses under the hero lead. A
        // decoration that costs the copy its measure is not decoration. The rest
        // and docked geometry below is kept as written; the md: variants it uses
        // simply have nothing to paint until lg.
        "hidden lg:block",
        "motion-reduce:transition-none",

        // Colour follows the section beneath, on its own shorter timing so the
        // repaint reads as a change of light rather than as a separate animation.
        dark ? "text-[color:var(--card)]" : "text-[color:var(--primary)]",
        // Only colour and opacity transition. From lg up — the only place the
        // mark paints — rest and docked share every geometric value, so there
        // is nothing else to animate and no `all` to catch it. Opacity gets
        // 800ms on a plain ease curve: it carries the exit past the second
        // section, and the exit is the one transition on this element with no
        // movement to read — nothing slides, nothing resizes, a large shape
        // simply stops being there. Anything quicker registers as a cut. The
        // curve is the symmetric ease rather than a sharp out-expo because the
        // fade has to be as gentle leaving as arriving: the same boundary is
        // crossed in both directions and neither crossing should announce
        // itself.
        "[transition-property:color,opacity] [transition-duration:350ms,800ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1),cubic-bezier(0.25,0.1,0.25,1)]",

        scrolled
          ? [
              // Phone — collapse into the bottom-right corner.
              "top-auto right-4 bottom-4 h-[var(--mark-docked)] translate-x-0 translate-y-0 opacity-100",
              // Desktop — hold position and size, recede to a watermark.
              "md:top-1/2 md:right-0 md:bottom-auto md:h-[var(--mark-h)] md:translate-x-1/2 md:-translate-y-1/2 md:opacity-10",
            ]
          : [
              // Phone at rest sits 10px below centre, then drops a further
              // --mark-drop of its own height; desktop stays centred.
              "top-1/2 right-0 bottom-auto h-[var(--mark-h-sm)] translate-x-1/2 -translate-y-[calc(50%-10px-var(--mark-drop))] opacity-100",
              "md:h-[var(--mark-h)] md:-translate-y-1/2",
            ],

        // Both breakpoints spelled out, so tailwind-merge drops the docked
        // `md:opacity-10` rather than letting it win at md and up. Opacity
        // only: the element keeps its place in the layer stack and its
        // `pointer-events-none`, so at zero it is inert rather than absent.
        // Under prefers-reduced-motion `motion-reduce:transition-none` above
        // removes the fade and the mark simply is not there — a decorative
        // layer is allowed to disappear; it is not allowed to animate at
        // someone who asked it not to.
        gone && "opacity-0 md:opacity-0",
        className,
      )}
      style={
        {
          "--mark-h": `${height}vh`,
          "--mark-h-sm": `${mobileHeight}vh`,
          "--mark-docked": `${dockedSize}px`,
          "--mark-drop": `${mobileDrop}%`,
          ...style,
        } as React.CSSProperties
      }
      {...props}
    >
      <HuskyMark className="h-full w-auto" />
    </div>
  );
}
