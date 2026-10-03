import Link from "next/link";
import { ArrowRight } from "lucide-react";

import {
  MARK_BOX,
  MARK_PATHS,
  MARK_VIEWBOX,
} from "@/components/motion-ui/husky-mark-paths";
import { RollText } from "@/components/motion-ui/roll-text";
import { Button } from "@/components/ui/button";
import { ContactBand } from "@/components/sections/creative-2/contact-scene";
import { CLOSE } from "@/components/sections/creative-2/new-construction/content";

/** The terminal mark, as in the home page's Contact: a 1px brand-black outline
 *  under a brand-black fill that the scene wipes up through a clip rect. Static:
 *  the rect covers the whole mark — filled. One instance on the page, so the clip
 *  id is fixed. */
function TerminalMark({ className }: { className?: string }) {
  return (
    <svg
      data-contact-mark=""
      viewBox={MARK_VIEWBOX}
      fill="none"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <defs>
        <clipPath id="c2-nc-close-fill-clip">
          <rect
            data-contact-wipe=""
            x={MARK_BOX.x}
            y={MARK_BOX.y}
            width={MARK_BOX.width}
            height={MARK_BOX.height}
          />
        </clipPath>
      </defs>
      <g
        data-contact-fill=""
        clipPath="url(#c2-nc-close-fill-clip)"
        className="fill-brand-black"
      >
        {MARK_PATHS.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
      <g data-contact-outline="" className="stroke-brand-black">
        {MARK_PATHS.map((d) => (
          <path key={d} d={d} vectorEffect="non-scaling-stroke" strokeWidth={1} />
        ))}
      </g>
    </svg>
  );
}

/**
 * Creative 2, New Construction — 12. Close. The same ending as the home page's
 * Contact: the orange band rises like a breaker thrown and the cable makes its
 * last turn into the Husky mark. It reuses that section's `ContactBand` scene,
 * which finds its parts by the `data-contact-*` hooks below.
 *
 * No channel list here (the copy has none), so there is no terminal row either:
 * from `md` up the mark sits beside the copy, on the band's bottom edge, and the
 * cable's last leg runs under the colophon. Below `md` it follows the copy.
 * Every piece of text on the band is brand-black (Rule 04).
 */
export function Close() {
  return (
    <section
      id={CLOSE.id}
      aria-labelledby="start-title"
      className="bg-background relative"
    >
      <ContactBand className="bg-primary text-brand-black section-x section-y-lg max-md:pb-0!">
        <div className="md:grid md:grid-cols-12 md:gap-x-12">
          <div className="md:col-span-7">
            <h2 id="start-title" className="display-1 text-brand-black">
              <span className="sr-only">{CLOSE.h2}</span>
              <span data-contact-split="" aria-hidden="true" className="block">
                {CLOSE.h2}
              </span>
            </h2>
            <p className="lead text-brand-black mt-8 max-w-[44ch]">
              {CLOSE.sub}
            </p>

            <div className="mt-12 flex flex-col gap-2 md:flex-row md:items-center md:gap-6">
              <Button
                asChild
                variant="outline"
                className="border-brand-black text-brand-black hover:bg-brand-black/10 hover:text-brand-black focus-visible:border-brand-black focus-visible:ring-brand-black/40 dark:border-brand-black dark:hover:bg-brand-black/10 w-full px-6 md:w-auto"
              >
                <a
                  href={CLOSE.primaryCta.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {CLOSE.primaryCta.label}
                  <span className="sr-only"> (WhatsApp, opens in a new tab)</span>
                  <ArrowRight
                    aria-hidden="true"
                    className="transition-transform duration-250 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/button:translate-x-1 group-focus-visible/button:translate-x-1 motion-reduce:transition-none"
                  />
                </a>
              </Button>
              <Link
                href={CLOSE.secondaryCta.href}
                className="group text-brand-black focus-visible:ring-brand-black/40 inline-flex h-12 items-center justify-center rounded-lg text-base font-medium outline-none focus-visible:ring-3 md:justify-start"
              >
                <RollText>{CLOSE.secondaryCta.label}</RollText>
              </Link>
            </div>

            <p className="meta text-brand-black mt-24">{CLOSE.colophon}</p>
          </div>
        </div>

        {/* <768 the mark follows the copy at 64vw, right-aligned, its empty foot
            cropped by the band's bottom edge. ≥768 it leaves the flow: bottom
            right, bleeding a quarter of its width off the edge. */}
        <div className="mt-24 md:mt-0">
          <TerminalMark className="ml-auto block h-auto w-[64vw] translate-y-[4%] md:absolute md:right-0 md:bottom-0 md:h-[48vh] md:w-auto md:translate-x-1/4 md:translate-y-0" />
        </div>
      </ContactBand>
    </section>
  );
}
