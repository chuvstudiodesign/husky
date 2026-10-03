import { ArrowRight, ArrowUpRight } from "lucide-react";

import {
  MARK_BOX,
  MARK_PATHS,
  MARK_VIEWBOX,
} from "@/components/motion-ui/husky-mark-paths";
import { Button } from "@/components/ui/button";
import { CONTACT } from "@/components/sections/creative-1/content";
import {
  ContactBand,
  CopyButton,
} from "@/components/sections/creative-1/contact-scene";

/** Rows that get the `COPY` affordance. */
const COPYABLE = new Set(["Phone", "Email"]);

/** The terminal mark: a 1px brand-black outline under a brand-black fill. The
 *  scene draws the outline, then wipes the fill up through a clip rect (a hard
 *  edge, so there is never a part-opacity brown). Static: the rect covers the
 *  whole mark — filled. One instance on the page, so the clip id is fixed. */
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
        <clipPath id="c1-contact-fill-clip">
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
        clipPath="url(#c1-contact-fill-clip)"
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
 * Creative 1 — 8. Contact `#contact`. Power on: the orange band rises like a
 * breaker thrown, and the cable makes its last turn into the Husky mark, drawn
 * and then filled in brand-black. The end of the run.
 * Spec: `docs/creative-versions.md` §8.
 *
 * The band sits on a `bg-background` section, so before the clip rises the
 * uncovered part reads as the page backdrop. Every piece of text on the band is
 * brand-black (Rule 04). No form — that is an open client question.
 */
export function Contact() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="bg-background relative"
    >
      <ContactBand className="bg-primary text-brand-black section-x section-y-lg pb-0!">
        <div className="flex flex-col md:grid md:grid-cols-12 md:gap-x-12">
          {/* Columns 1–7 — the ask */}
          <div data-contact-copy="" className="md:col-span-7">
            <p className="eyebrow text-brand-black">{CONTACT.eyebrow}</p>
            <h2
              id="contact-title"
              data-contact-h2=""
              className="display-1 text-brand-black mt-6"
            >
              <span className="sr-only">{CONTACT.h2}</span>
              <span data-contact-split="" aria-hidden="true" className="block">
                {CONTACT.h2}
              </span>
            </h2>
            <p
              data-contact-sub=""
              className="lead text-brand-black mt-8 max-w-[44ch]"
            >
              {CONTACT.sub}
            </p>
            <Button
              asChild
              variant="outline"
              className="border-brand-black text-brand-black hover:bg-brand-black/10 hover:text-brand-black focus-visible:border-brand-black focus-visible:ring-brand-black/40 dark:border-brand-black dark:hover:bg-brand-black/10 mt-12 w-full px-6 md:w-auto"
            >
              <a
                href={CONTACT.cta.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {CONTACT.cta.label}
                <ArrowRight
                  aria-hidden="true"
                  className="transition-transform duration-250 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/button:translate-x-1 motion-reduce:transition-none"
                />
              </a>
            </Button>
          </div>

          {/* Columns 8–12 — the channels. Never scrubbed. */}
          <dl
            data-contact-list=""
            className="mt-16 flex flex-col gap-8 md:col-span-5 md:col-start-8 md:mt-0"
          >
            {CONTACT.channels.map((c) => (
              <div key={c.label}>
                <dt className="meta text-brand-black">{c.label}</dt>
                <dd className="body-text text-brand-black mt-1 flex max-w-none items-center justify-between gap-6">
                  <a
                    href={c.href}
                    {...(c.external
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    className="group/link focus-visible:outline-brand-black -my-2 inline-flex min-w-0 items-center gap-2 py-2 outline-offset-4 focus-visible:outline-2"
                  >
                    <span className="relative">
                      {c.value}
                      {/* 2px underline wipes in from the left. */}
                      <span
                        aria-hidden="true"
                        className="bg-brand-black absolute -bottom-0.5 left-0 h-0.5 w-full origin-left scale-x-0 transition-transform duration-250 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/link:scale-x-100 group-focus-visible/link:scale-x-100 motion-reduce:transition-none"
                      />
                    </span>
                    <ArrowUpRight
                      aria-hidden="true"
                      className="size-4 shrink-0 transition-transform duration-250 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/link:translate-x-1 group-focus-visible/link:translate-x-1 motion-reduce:transition-none"
                    />
                  </a>
                  {COPYABLE.has(c.label) && (
                    <CopyButton
                      value={
                        c.href.startsWith("mailto:") ? c.value : c.href.replace("tel:", "")
                      }
                      label={c.label}
                    />
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* The terminal row. ≥768 it is a 48vh spacer under the content and the
            mark sits on the band's bottom edge, bleeding a quarter of its width
            off the right (spec says ~60vh; 48vh trims the empty orange to its
            left, which the cable's last leg crosses). <768 the mark follows the
            list at 64vw, right-aligned, its empty foot cropped by the band's
            bottom edge. */}
        <div className="mt-24 md:mt-16 md:h-[48vh]">
          <TerminalMark className="ml-auto block h-auto w-[64vw] translate-y-[4%] md:absolute md:right-0 md:bottom-0 md:h-[48vh] md:w-auto md:translate-x-1/4 md:translate-y-0" />
        </div>
      </ContactBand>
    </section>
  );
}
