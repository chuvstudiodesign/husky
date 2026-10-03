import { CableSegment } from "@/components/motion-ui/cable-segment";
import { ScrubText } from "@/components/motion-ui/scrub-text";
import { SpotlightFrame } from "@/components/motion-ui/spotlight-frame";
import { ServiceIcon } from "@/components/sections/creative-2/service-icons";
import { plateIndex } from "@/components/sections/creative-2/service-plate";
import { COLLABORATION } from "@/components/sections/creative-2/new-construction/content";
import { RoomsScene } from "@/components/sections/creative-2/new-construction/rooms-scene";

/**
 * Creative 2, New Construction — 5. Better spaces through collaboration. The
 * page's one dense section: three rooms as plates, in the Services plates'
 * construction (a drawn icon in a 4:3 spotlight frame, then mono index, title,
 * body), each under the icon of the service it grounds in.
 *
 * Server shell; the icons draw themselves through the client `RoomsScene`. The
 * title is an `h3` here (the Services plate's is an `h4` under a family `h3`),
 * which is why this is its own plate and not `ServicePlate`.
 */
export function Rooms() {
  const total = COLLABORATION.rooms.length;

  return (
    <section
      id={COLLABORATION.id}
      aria-labelledby="collaboration-title"
      className="group section-x section-y relative"
    >
      <CableSegment />

      <div className="lg:grid lg:grid-cols-12 lg:gap-x-12">
        <div className="lg:col-span-9">
          <p className="eyebrow text-muted-foreground group-data-[powered]:text-foreground transition-colors duration-250 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none">
            {COLLABORATION.eyebrow}
          </p>
          <h2 id="collaboration-title" className="display-2 mt-6">
            <ScrubText as="span" start="top 85%" end="top 55%" className="block">
              {COLLABORATION.h2}
            </ScrubText>
          </h2>
        </div>
      </div>

      <RoomsScene className="mt-16 grid gap-16 md:grid-cols-3 md:gap-x-6 lg:mt-24 lg:gap-x-12">
        {COLLABORATION.rooms.map((room, i) => (
          <li key={room.name} data-room="" className="flex flex-col gap-6">
            <SpotlightFrame
              className="bg-foreground/24"
              innerClassName="overflow-hidden"
            >
              <div className="bg-card aspect-[4/3]">
                <ServiceIcon icon={room.icon} className="size-full" />
              </div>
            </SpotlightFrame>

            <div className="flex flex-col gap-3">
              <p className="meta" aria-hidden="true">
                {plateIndex(i + 1, total)}
              </p>
              <h3 className="display-3 text-foreground">{room.name}</h3>
              <p className="body-text max-w-[40ch]">{room.body}</p>
            </div>
          </li>
        ))}
      </RoomsScene>
    </section>
  );
}
