import { CableSegment } from "@/components/motion-ui/cable-segment";
import { PARTNERS } from "@/components/sections/creative-2/content";
import { PartnersRail } from "@/components/sections/creative-2/partners-rail";

/**
 * Creative 2 — Partners `#partners`. A quiet section: the five platform names pass
 * on one line at display scale, moved only by the scroll, and each fills in as it
 * crosses the centre of the viewport. Not pinned.
 *
 * Server shell; the rail is the client child (`partners-rail.tsx`).
 * Spec: `docs/creative-versions.md` § 5.
 */
export function Partners() {
  return (
    <section
      id="partners"
      aria-labelledby="partners-title"
      className="section-x section-y relative overflow-x-clip"
    >
      <CableSegment />

      <div className="grid gap-y-8 md:grid-cols-12 md:gap-x-6">
        <div className="md:col-span-6">
          <p className="eyebrow text-muted-foreground transition-colors duration-250 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none [[data-powered]_&]:text-foreground">
            {PARTNERS.eyebrow}
          </p>
          <h2 id="partners-title" className="display-2 mt-6">
            {PARTNERS.h2}
          </h2>
        </div>
        {/* [VERIFY: certification status and current brand list] — the marker
            stays in source for the client review, never in the DOM. */}
        <p className="body-text text-muted-foreground md:col-span-5 md:col-start-8 md:self-end">
          {PARTNERS.body}
        </p>
      </div>

      <div className="mt-24">
        <PartnersRail names={PARTNERS.names} />
      </div>
    </section>
  );
}
