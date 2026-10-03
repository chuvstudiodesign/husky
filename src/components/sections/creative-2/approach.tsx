import Link from "next/link";

import { Button } from "@/components/ui/button";
import { ApproachScene } from "@/components/sections/creative-2/approach-plan";
import { APPROACH } from "@/components/sections/creative-2/content";

/**
 * Creative 2 — Approach. Before the walls close: a building section draws itself,
 * the wiring goes in orange, then the drywall closes over it and the device
 * points go out with it. Spec: `docs/creative-versions.md` §4.
 *
 * Server shell. The text column renders here, final and readable; the pinned
 * frame, cable and drawing are the client `ApproachScene`. Body and CTA are never
 * hidden or scrubbed — only the H2's split copy rises.
 */
export function Approach() {
  return (
    <section
      id="approach"
      aria-labelledby="approach-heading"
      className="relative"
    >
      <ApproachScene
        text={
          <>
            {/* Eyebrow: muted until the cable powers this section's node. */}
            <p className="eyebrow text-muted-foreground transition-colors duration-250 ease-[cubic-bezier(0.16,1,0.3,1)] group-data-[powered]:text-foreground motion-reduce:transition-none">
              {APPROACH.eyebrow}
            </p>

            <h2 id="approach-heading" className="display-2 mt-6">
              <span className="sr-only">{APPROACH.h2}</span>
              <span
                data-approach-heading=""
                aria-hidden="true"
                className="block"
              >
                {APPROACH.h2}
              </span>
            </h2>

            <div className="mt-8 flex flex-col gap-4">
              {APPROACH.body.map((p) => (
                <p
                  key={p}
                  className="body-text text-muted-foreground max-w-[44ch]"
                >
                  {p}
                </p>
              ))}
            </div>

            <div className="mt-12">
              <Button asChild variant="outline" className="w-auto px-6">
                <Link href={APPROACH.cta.href}>{APPROACH.cta.label}</Link>
              </Button>
            </div>
          </>
        }
      />
    </section>
  );
}
