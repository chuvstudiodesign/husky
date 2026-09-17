"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { HuskyWordmark } from "@/components/motion-ui/husky-wordmark";

const WHATSAPP = "https://api.whatsapp.com/send?phone=19548648005";

const links = [
  // Plain route link, not an anchor: the rest are hash targets on the home page
  // and this one has to work identically from /new-construction.
  { label: "Home", href: "/" },
  { label: "Services", href: "/#services" },
  { label: "Approach", href: "/#approach" },
  { label: "About", href: "/#about" },
  { label: "New Construction", href: "/new-construction" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // While the mobile sheet is open: lock the page, make what sits behind the
  // sheet inert so Tab cannot land there, and close on Escape. On close, focus
  // goes back to the toggle.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const behind = document.querySelectorAll("main, footer");
    behind.forEach((el) => el.toggleAttribute("inert", open));
    if (!open) return;
    const toggle = toggleRef.current;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      behind.forEach((el) => el.removeAttribute("inert"));
      toggle?.focus();
    };
  }, [open]);

  return (
    <header
      /* No rule under the scrolled bar. The tint and the blur already mark
         where the chrome ends and the page begins, and a hairline on top of
         them separates the same thing twice. Nothing here changes height
         between the two states, so there is no transparent placeholder border
         to hold either.

         The scrim thickens to 90% from `lg`, and the reason is measured, not
         taste. The bar is fixed, so it crosses the brand-light band on both
         pages, and at 80% the composite there is #343539 — against which the
         nav links (`--muted-foreground`, 12px) measure 4.35:1, under the 4.5
         floor for text that size. At 90% the composite is #1E1F22 and the same
         links measure 5.9:1. Over the two other surfaces the change is
         invisible: on #090A0F an 80/20 and a 90/10 mix of the same colour are
         the same colour, and on the orange band the links go 5.6:1 to 6.5:1.

         Scoped to `lg` because the failing pair only exists there — below it
         the nav collapses to the menu button and no small text sits on the
         scrim.

         The scrim is its own layer, not a class on <header>, and the reason is
         WebKit. `backdrop-filter` on an element makes it the containing block
         for its fixed-position descendants in Safari, so once the bar had
         scrolled and blurred, the mobile sheet below — `fixed top-20 bottom-0`
         — was measured against the 80px header instead of the viewport and
         collapsed to nothing. The menu opened at the top of the page and did
         nothing after the first 24px of scroll. A sibling layer blurs the same
         pixels and anchors nothing. */
      className="fixed inset-x-0 top-0 z-40"
    >
      <div
        aria-hidden
        className={cn(
          "absolute inset-0 -z-10 transition-[background-color,backdrop-filter] duration-300",
          scrolled && "bg-background/80 lg:bg-background/90 backdrop-blur-xl",
        )}
      />
      <div className="section-x mx-auto flex h-20 max-w-7xl items-center justify-between">
        {/* `h-11` — the mark is 30px and the wordmark's line box is smaller, so
            the link rendered a 30px target inside an 80px row. Forty-four is
            the floor for a standalone control and it changes nothing visually:
            the extra 14px is transparent, and the row is `items-center` so the
            logo stays where it was. */}
        <Link
          href="/"
          className="flex h-11 items-center gap-3"
          aria-label="Husky Audio Video, home"
        >
          {/* The mark is 308x372, not square. Declaring it square made Next warn
              that one dimension was being overridden by CSS, and would distort it
              anywhere the class did not apply.

              No `priority`: it emits a preload for a 6KB inline-simple SVG that
              the browser then reports as unused. The preload costs more than it
              saves at this size. */}
          <Image
            src="/brand/icon/husky-mark-orange.svg"
            alt=""
            width={25}
            height={30}
            className="h-[30px] w-auto"
          />
          <HuskyWordmark className="h-3.5 w-auto" />
        </Link>

        {/* Uppercase, on the client's call (2026-09-01), and scoped to this row
            rather than folded into `.nav-text`. The other three users of that
            class are on /site-2 — the rail's "Request a consultation" and its
            phone number, and the scroll-spy index — and none of them wants
            caps: a sentence-length link and a phone number both read worse
            shouted, and the index already pairs with `.meta`, which is mono
            uppercase, so uppercasing it too would put two caps registers in one
            column. 0.08em of tracking is what keeps the caps from closing up;
            em-based, so it is exempt from the 4px grid by the same clause the
            mono labels use. */}
        <nav className="hidden items-center gap-9 lg:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="nav-text text-muted-foreground hover:text-foreground uppercase tracking-[0.08em] transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {/* No size override: the 44x176 default box is the site's one CTA
              rectangle, and it clears the h-20 row with 18px either side.
              Outline at the top, where the hero CTA owns the orange; filled
              once the bar has scrolled — one filled orange element per
              viewport. */}
          <Button
            asChild
            variant={scrolled ? "default" : "outline"}
            className="hidden sm:inline-flex"
          >
            <a href={WHATSAPP} target="_blank" rel="noopener noreferrer">
              Talk to Us
              <span className="sr-only"> (WhatsApp, opens in a new tab)</span>
            </a>
          </Button>
          <button
            ref={toggleRef}
            type="button"
            onClick={() => setOpen((v) => !v)}
            /* size-11, not p-2. The icon went to the system's 24px, and 24 + 8
               either side is a 40px tap target — under the 44px the design
               system holds every standalone control to. A fixed 44px box with
               the icon centred hits the standard and keeps the row height. */
            className="hover:bg-muted -mr-2 flex size-11 items-center justify-center rounded-lg lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile sheet.
          `invisible` is not a duplicate of `opacity-0`. Opacity alone leaves
          five links and a CTA in the tab order behind a closed menu, so a
          keyboard user tabbing off the logo landed inside a panel they could
          not see. `visibility` takes them out, and it still fades: an
          interpolation to or from `visible` counts as visible for the whole
          duration, so the transition plays and the hidden state lands at the
          end of it.

          `overflow-y-auto` is the landscape case. The stack is ~480px and the
          sheet is `top-20 bottom-0`, which on a phone held sideways is under
          300px — without a scroller the CTA is simply unreachable. */}
      <div
        data-lenis-prevent
        className={cn(
          "bg-background fixed inset-x-0 top-20 bottom-0 z-40 overflow-y-auto transition-[opacity,visibility,translate] lg:hidden",
          open
            ? "pointer-events-auto visible translate-y-0 opacity-100 duration-300"
            : "pointer-events-none invisible -translate-y-2 opacity-0 duration-200",
        )}
      >
        {/* No hairlines between items. Five 24px display lines each sitting in
            40px of their own padding are already five things; ruling between
            them draws a table nobody asked for. The list is a stack of large
            type on empty background, which is what a phone menu should be. */}
        <nav className="section-x flex flex-col gap-1 pt-8 pb-10">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="font-display py-5 text-2xl font-semibold tracking-tight"
            >
              {l.label}
            </Link>
          ))}
          {/* Full width on a phone, the standard 176px box from sm. In a 342px
              column under five full-bleed display lines the fixed rectangle
              read as a chip dropped at the bottom left; stretched, it closes
              the stack. That argument runs out with the phone — the sheet is
              still the menu at 768, where the column is 692px and a button
              spanning all of it reads as a banner. The 48px height is untouched
              at both, so the target never changes.

              Written as `max-sm:w-full` rather than `w-full sm:w-44`, and the
              difference is not style: the size variant already ships `w-44`
              unprefixed, and a prefixed utility beats an unprefixed one, but
              two prefixed utilities fall back to the sheet's own order —
              `w-full sm:w-44` measured 691px at 768 with both rules live. One
              variant against the base is the form that resolves. */}
          {/* And from `sm` it does not ship at all. The header's own CTA
              appears at exactly that breakpoint and the sheet only covers
              from `top-20` down, so at 768 and 820 the open menu would hold
              two "Talk to Us" rectangles about 100px apart — the same link
              twice, and once the bar has scrolled two primary accents in one
              viewport against the one the system allows. Below `sm` the header button
              is hidden and this is the only route to the WhatsApp thread,
              which is why it stays there rather than going altogether. */}
          <Button asChild className="mt-8 max-sm:w-full sm:hidden">
            <a href={WHATSAPP} target="_blank" rel="noopener noreferrer">
              Talk to Us
              <span className="sr-only"> (WhatsApp, opens in a new tab)</span>
            </a>
          </Button>
        </nav>
      </div>
    </header>
  );
}
