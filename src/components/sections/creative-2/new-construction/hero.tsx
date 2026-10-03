import { CableSegment } from "@/components/motion-ui/cable-segment";
import { HERO } from "@/components/sections/creative-2/new-construction/content";

/**
 * Creative 2, New Construction — 1. Hero. A text hero: the thesis at display
 * scale, top left, and the sub at the foot of the frame on the page's second axis
 * (column 8, where every passage below sets its copy).
 *
 * Nothing here is scrubbed or hidden: it is the first viewport, so the server
 * HTML is what the visitor reads. The only motion is the cable, whose run starts
 * at this section's node, level with the eyebrow.
 */
export function Hero() {
  return (
    <section
      id="top"
      aria-labelledby="top-title"
      className="group section-x relative flex min-h-[88svh] flex-col pt-40 pb-24"
    >
      {/* The run's origin. `top` is the section's 160px top padding plus 4px, which
          centres the 8px node on the eyebrow's 16px line. */}
      <CableSegment style={{ top: "calc(10rem + 4px)" }} />

      <p className="eyebrow text-muted-foreground group-data-[powered]:text-foreground transition-colors duration-250 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none">
        {HERO.eyebrow}
      </p>

      <h1 id="top-title" className="display-1 mt-8">
        {HERO.h1Lines.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </h1>

      <div className="mt-auto pt-10 lg:grid lg:grid-cols-12 lg:gap-x-12">
        <p className="lead lg:col-span-5 lg:col-start-8">{HERO.lead}</p>
      </div>
    </section>
  );
}
