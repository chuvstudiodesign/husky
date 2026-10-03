import { CableSegment } from "@/components/motion-ui/cable-segment";
import { ScrubText } from "@/components/motion-ui/scrub-text";
import type { PassageCopy } from "@/components/sections/creative-2/new-construction/content";
import { cn } from "@/lib/utils";

export interface PassageProps {
  copy: PassageCopy;
  /**
   * `split`  heading in columns 1–6, copy beside it in columns 8–12.
   * `stack`  heading across columns 1–9, copy under it in columns 8–12.
   * Both set the copy on the same axis, so the page keeps two vertical edges.
   */
  layout?: "split" | "stack";
  /** `light` is the brand-light band: navy type, the cable's light tone. */
  tone?: "dark" | "light";
}

/**
 * Creative 2, New Construction — one text passage: eyebrow, H2 and its
 * paragraphs. Ten of the page's twelve sections are this component.
 *
 * Motion is the page's whole budget in two devices: the cable segment fills down
 * the gutter and powers the eyebrow, and the H2's lines rise out of a mask,
 * scrubbed, finishing before the heading reaches mid-screen. Paragraphs are never
 * scrubbed or hidden. Below `lg` the grid is one column.
 *
 * Server render and reduced motion: the plain heading, the cable fully drawn.
 */
export function Passage({
  copy,
  layout = "split",
  tone = "dark",
}: PassageProps) {
  const light = tone === "light";
  const split = layout === "split";
  const titleId = `${copy.id}-title`;

  return (
    <section
      id={copy.id}
      aria-labelledby={titleId}
      className={cn(
        "group section-x relative",
        // The light band is the page's one peak before the close; it gets the
        // larger padding, as the surface change is its only separator.
        light ? "bg-brand-light section-y-lg" : "section-y",
      )}
    >
      <CableSegment tone={tone} />

      <div className="lg:grid lg:grid-cols-12 lg:gap-x-12">
        <div className={split ? "lg:col-span-6" : "lg:col-span-9"}>
          {/* Eyebrow: muted until the cable powers this section's node. On the
              light band it is navy from the start (light carries black or navy
              only, and there is no dimmer navy that still clears AA). */}
          <p
            className={cn(
              "eyebrow",
              light
                ? "text-navy-900"
                : "text-muted-foreground group-data-[powered]:text-foreground transition-colors duration-250 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none",
            )}
          >
            {copy.eyebrow}
          </p>
          <h2
            id={titleId}
            className={cn("display-2 mt-6", light && "text-navy-900")}
          >
            <ScrubText as="span" start="top 85%" end="top 55%" className="block">
              {copy.h2}
            </ScrubText>
          </h2>
        </div>

        {/* `lg:pt-10` is the eyebrow's 16px line plus the H2's `mt-6`, so in the
            split the first paragraph starts level with the heading. */}
        <div
          className={cn(
            "mt-12 flex flex-col gap-6 lg:col-span-5 lg:col-start-8",
            split ? "lg:mt-0 lg:pt-10" : "lg:mt-16",
          )}
        >
          {copy.body.map(({ text, verify }, i) => (
            // [VERIFY] items are retained and flagged, not removed; the marker
            // stays in source (`content.ts`), never in the visible copy.
            <p
              key={text}
              data-verify={verify ? "" : undefined}
              className={cn(
                // The paragraph under a heading is `.lead`, the rest `.body-text`.
                i === 0 ? "lead" : "body-text",
                light && (i === 0 ? "text-navy-900" : "text-navy-800"),
              )}
            >
              {text}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
