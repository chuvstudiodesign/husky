import Link from "next/link";

import { HuskyMark } from "@/components/motion-ui/husky-mark";
import { SectionIndex } from "@/components/motion-ui/section-index";
import { HuskyWordmark } from "@/components/motion-ui/husky-wordmark";

const WHATSAPP = "https://api.whatsapp.com/send?phone=19548648005";

const SECTIONS = [
  { id: "intro", label: "Introduction" },
  { id: "services", label: "Systems" },
  { id: "approach", label: "Approach" },
  { id: "partners", label: "Platforms" },
  { id: "about", label: "Practice" },
  { id: "contact", label: "Contact" },
];

/**
 * The fixed left rail.
 *
 * It replaces the top header entirely. On a document-shaped page this is the
 * better trade: the reader always knows where they are, the index is legible
 * rather than compressed into a nav bar, and the whole top of the page is freed
 * for content.
 *
 * Below `lg` it collapses to a slim top bar — a fixed 320px column would take a
 * phone's entire width, and a scroll-spy index nobody can see is dead weight.
 */
export function Rail() {
  return (
    <>
      {/* Desktop rail.

          No `border-r`. The 320px of empty column and the 64px gutter the
          content keeps clear of it are the separation; a vertical hairline down
          the whole viewport is a second one drawn over the first, and it is the
          most conspicuous rule on the site because it never ends. */}
      <aside className="fixed top-0 left-0 z-30 hidden h-screen w-80 flex-col justify-between px-10 py-12 lg:flex">
        <div>
          <Link href="/" className="flex items-center gap-3">
            <HuskyMark className="text-primary h-8 w-auto" />
            <HuskyWordmark className="h-3.5 w-auto" />
          </Link>
          <p className="meta mt-4">Luxury Smart Home Automation</p>
        </div>

        <SectionIndex items={SECTIONS} className="-ml-1" />

        <div className="flex flex-col gap-3">
          <a
            href={WHATSAPP}
            target="_blank"
            rel="noopener noreferrer"
            className="nav-text text-primary hover:text-husky-400 transition-colors"
          >
            Request a consultation
          </a>
          <a
            href="tel:+19548648005"
            className="nav-text text-muted-foreground hover:text-foreground transition-colors"
          >
            +1 954 864 8005
          </a>
          <p className="meta mt-2">Boca Raton · South Florida</p>
        </div>
      </aside>

      {/* Phone bar */}
      {/* Same as the main header's scrolled state: the tint and the blur mark
          the edge of the chrome, so the hairline under it is redundant. */}
      <header className="bg-background/85 fixed inset-x-0 top-0 z-30 backdrop-blur-xl lg:hidden">
        <div className="flex h-16 items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-3">
            <HuskyMark className="text-primary h-6 w-auto" />
            <HuskyWordmark className="h-3 w-auto" />
          </Link>
          <a
            href={WHATSAPP}
            target="_blank"
            rel="noopener noreferrer"
            className="nav-text text-primary"
          >
            Consultation
          </a>
        </div>
      </header>
    </>
  );
}
