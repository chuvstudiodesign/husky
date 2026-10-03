import { Button } from "@/components/ui/button";
import { SERVICES } from "@/components/sections/creative-1/content";
import {
  ServicePlate,
  plateIndex,
} from "@/components/sections/creative-1/service-plate";
import { ServicesScene } from "@/components/sections/creative-1/services-scene";

/**
 * Creative 1 — Services `#services`. Walk through the house room by room.
 * Spec: `docs/creative-versions.md` §3.
 *
 * The server markup is the final, readable state: a vertical stack, each family
 * under a sticky header, plates in a 2-column grid from `md` up. On a motion-allowed
 * desktop the scene sets `data-mode="track"` and the same DOM becomes one horizontal
 * row that the pin scrubs sideways (every `in-data-[mode=track]:` class below).
 */
export function Services() {
  const total = SERVICES.families.reduce((n, f) => n + f.services.length, 0);
  const families = SERVICES.families.length;

  // Running service number across families, and the readout label per plate.
  let n = 0;
  const numbered = SERVICES.families.map((family) => ({
    family,
    services: family.services.map((service) => ({ service, index: ++n })),
  }));
  const readout = numbered.flatMap(({ services }) =>
    services.map(
      ({ service, index }) =>
        `${plateIndex(index, total)} · ${service.name.toUpperCase()}`,
    ),
  );

  return (
    <ServicesScene readout={readout}>
      <div
        data-track=""
        className="relative flex flex-col gap-24 in-data-[mode=track]:w-max in-data-[mode=track]:flex-row in-data-[mode=track]:items-start in-data-[mode=track]:gap-[4vw] in-data-[mode=track]:pr-[15vw]"
      >
        {/* Horizontal cable — 32px above the image tops, track mode only. Stops
            where the trailing room begins (the track's 15vw right padding). */}
        <div
          aria-hidden="true"
          className="bg-foreground/12 pointer-events-none absolute right-[15vw] left-0 -top-8 hidden h-px in-data-[mode=track]:block"
        >
          <div
            data-hcable-fill=""
            className="bg-foreground/48 absolute inset-0 origin-left"
          />
          <div
            data-hcable-head=""
            className="bg-primary absolute top-0 left-0 h-px w-6"
          />
        </div>

        {/* Panel 0 — intro */}
        <div className="flex flex-col gap-6 in-data-[mode=track]:w-[36vw] in-data-[mode=track]:shrink-0">
          <p className="eyebrow text-muted-foreground group-data-[powered]/services:text-foreground transition-colors duration-250 ease-[cubic-bezier(0.16,1,0.3,1)]">
            {SERVICES.eyebrow}
          </p>
          <h2 id="services-title" className="display-2 text-foreground max-w-[16ch]">
            {SERVICES.h2}
          </h2>
          <p className="lead max-w-[32ch]">{SERVICES.intro}</p>
        </div>

        {numbered.map(({ family, services }, fi) => (
          <div
            key={family.name}
            className="flex flex-col in-data-[mode=track]:contents"
          >
            {/* Family header — sticky in the stack (with a fade under its foot so
                the next h4 slides under it rather than being sliced), a cover
                panel on the track. On the track the cover carries no art: index
                and h3 straight on the dark ground, 30vw so "Entertainment" and
                "Infrastructure" hold one line at `.display-2` from 1024 up,
                the same height as a plate image, so the row reads light plates – dark cover – light plates. */}
            <div
              data-cover=""
              className="bg-background after:from-background sticky top-20 z-[5] pt-6 pb-4 after:pointer-events-none after:absolute after:inset-x-0 after:top-full after:h-8 after:bg-linear-to-b after:to-transparent in-data-[mode=track]:relative in-data-[mode=track]:top-auto in-data-[mode=track]:flex in-data-[mode=track]:h-[22.5vw] in-data-[mode=track]:w-[30vw] in-data-[mode=track]:shrink-0 in-data-[mode=track]:flex-col in-data-[mode=track]:justify-between in-data-[mode=track]:p-0 in-data-[mode=track]:after:hidden"
            >
              <p className="meta">{plateIndex(fi + 1, families)}</p>
              <h3 className="display-2 text-foreground in-data-[mode=track]:mt-3">
                <span className="sr-only">{family.name}</span>
                <span
                  aria-hidden="true"
                  data-family-split=""
                  className="block"
                >
                  {family.name}
                </span>
              </h3>
            </div>

            <div className="mt-8 grid gap-16 md:grid-cols-2 md:gap-x-8 in-data-[mode=track]:contents">
              {services.map(({ service, index }) => (
                <ServicePlate
                  key={service.name}
                  service={service}
                  index={index}
                  total={total}
                />
              ))}
            </div>
          </div>
        ))}

        {/* Final panel — CTA */}
        <div className="flex flex-col gap-6 in-data-[mode=track]:w-[28vw] in-data-[mode=track]:shrink-0">
          <p className="meta" aria-hidden="true">
            {`${plateIndex(total, total)} · ${SERVICES.endOfRun}`}
          </p>
          <Button asChild size="lg" className="w-auto self-start px-6 max-md:w-full max-md:self-stretch">
            <a
              href={SERVICES.cta.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {SERVICES.cta.label}
            </a>
          </Button>
        </div>
      </div>
    </ServicesScene>
  );
}

