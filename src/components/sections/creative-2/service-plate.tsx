import { RollText } from "@/components/motion-ui/roll-text";
import { SpotlightFrame } from "@/components/motion-ui/spotlight-frame";
import type { Service } from "@/components/sections/creative-2/content";
import { ServiceIcon } from "@/components/sections/creative-2/service-icons";

export interface ServicePlateProps {
  service: Service;
  /** 1-based position across all eight services. */
  index: number;
  total: number;
}

/** `01 / 08` */
export function plateIndex(index: number, total: number) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(index)} / ${pad(total)}`;
}

/**
 * One service "plate": the service's drawn icon in a 4:3 spotlight frame, then the
 * mono index, the `h4` and the body.
 *
 * Server Component. The Services scene finds its moving parts by data attribute:
 *   data-plate        the plate (trigger)
 *   data-plate-clip   wipes open inside the standing 1px frame, clip-path inset(0 0 100% 0) → inset(0)
 *   data-plate-media  settles, scale 1.12 → 1 (inside the clip)
 *   data-icon-*       the icon's grid, lines and signal (see service-icons.tsx)
 *   data-plate-text   rises, y 24 → 0 / opacity 0 → 1, from 60% of the wipe (track only)
 *   data-plate-node   the junction on the horizontal cable (track mode only)
 *
 * The hover zoom lives on the icon itself, one element below the scrubbed scale,
 * so CSS and GSAP never write the same transform.
 */
export function ServicePlate({ service, index, total }: ServicePlateProps) {
  return (
    <article
      data-plate=""
      className="group relative flex flex-col gap-6 in-data-[mode=track]:w-[30vw] in-data-[mode=track]:shrink-0"
    >
      {/* Junction on the horizontal cable, 32px above the image top. */}
      <span
        aria-hidden="true"
        data-plate-node=""
        data-on="false"
        className="border-foreground/24 bg-background data-[on=true]:border-primary data-[on=true]:bg-primary absolute -top-9 left-0 hidden size-2 rounded-none border transition-colors duration-250 ease-[cubic-bezier(0.16,1,0.3,1)] in-data-[mode=track]:block"
      />

      {/* The 1px foreground/24 frame stands from the start; the clip lives
          inside it, so an unrevealed plate is an empty frame, not a blank. */}
      <SpotlightFrame
        className="bg-foreground/24"
        innerClassName="overflow-hidden"
      >
        <div
          data-plate-clip=""
          className="relative aspect-[4/3] overflow-hidden rounded-sm"
        >
          <div
            data-plate-media=""
            className="bg-card absolute inset-0 flex items-center justify-center"
          >
            <ServiceIcon
              icon={service.icon}
              className="size-full transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04] motion-reduce:transition-none"
            />
          </div>
        </div>
      </SpotlightFrame>

      <div data-plate-text="" className="flex flex-col gap-3">
        <p className="meta">{plateIndex(index, total)}</p>
        <h4 className="display-3 text-foreground">
          <RollText>{service.name}</RollText>
        </h4>
        <p className="body-text max-w-[40ch]">{service.body}</p>
      </div>
    </article>
  );
}
