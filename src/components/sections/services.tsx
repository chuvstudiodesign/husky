import {
  Blinds,
  Cctv,
  Clapperboard,
  Cpu,
  Lightbulb,
  Trees,
  Volume2,
  Wifi,
  type LucideIcon,
} from "lucide-react";

import { Reveal } from "@/components/motion-ui/reveal";
import { SpotlightCard } from "@/components/motion-ui/spotlight-card";

interface Service {
  name: string;
  description: string;
  icon: LucideIcon;
}

interface Family {
  label: string;
  services: Service[];
}

/* Eight services, grouped into three families. The grouping is structural:
   a flat grid of eight equal tiles gives the visitor no way in. */
const FAMILIES: Family[] = [
  {
    label: "Entertainment",
    services: [
      {
        name: "Home Cinema",
        description:
          "A real theater, built into your home. Whole-house surround, calibrated video, and AirPlay so the room is ready before anyone sits down.",
        icon: Clapperboard,
      },
      {
        name: "Multi Room Audio",
        description:
          "Music in one room, or every room at once. One button, or one sentence to your assistant.",
        icon: Volume2,
      },
      {
        name: "Outdoor Entertainment",
        description:
          "Audio and video built for the patio, the pool and the yard, specified for Florida weather, not adapted to it.",
        icon: Trees,
      },
    ],
  },
  {
    label: "Comfort & Control",
    services: [
      {
        name: "Automation",
        description:
          "The layer that ties everything together. One system for lighting, climate, entertainment and security, tuned to how your household actually runs.",
        icon: Cpu,
      },
      {
        name: "Smart Lighting",
        description:
          "Lighting and climate that follow the day rather than a switch. Better rooms, lower consumption, and a house that looks composed at every hour.",
        icon: Lightbulb,
      },
      {
        name: "Smart Blinds",
        description:
          "Motorized shades that open on a schedule or on command, quietly enough that you stop noticing them, which is the point.",
        icon: Blinds,
      },
    ],
  },
  {
    label: "Infrastructure & Security",
    services: [
      {
        name: "Wi-Fi & Networking",
        description:
          "Every smart home is only as reliable as the network under it. We survey the house, place access points where they actually work, and hardwire the things that should never buffer.",
        icon: Wifi,
      },
      {
        name: "Surveillance",
        description:
          "Cameras, intercom and access control you can reach from anywhere. See the property in real time, speak to the gate, unlock a door from the airport.",
        icon: Cctv,
      },
    ],
  },
];

/**
 * Services — the mid-tone band in the page's section-contrast rhythm.
 *
 * The section sits on `--card`, so the tiles step *down* to `--background`
 * rather than stacking a second card fill on the first (surface nesting rule).
 */
export function Services() {
  return (
    <section
      id="services"
      aria-labelledby="services-heading"
      className="bg-card"
    >
      <div className="section-x section-y mx-auto max-w-7xl">
        <Reveal>
          <p className="eyebrow">What we do</p>
          <h2
            id="services-heading"
            className="display-2 mt-6 max-w-[16ch] text-balance"
          >
            Eight systems. One house that behaves.
          </h2>
          <p className="lead mt-6">
            Most homes accumulate technology one purchase at a time, and it
            shows. We design the whole system first, then install it, so
            everything answers to the same logic and the same remote.
          </p>
        </Reveal>

        <div className="mt-20 space-y-14 md:mt-28 md:space-y-16">
          {FAMILIES.map((family) => (
            <div key={family.label}>
              <Reveal>
                <div className="flex items-center gap-5">
                  <h3 className="meta shrink-0">{family.label}</h3>
                  <span aria-hidden className="bg-border h-px flex-1" />
                </div>
              </Reveal>

              <ul className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {family.services.map((service, i) => (
                  <li key={service.name} className="h-full">
                    <Reveal delay={i * 0.06} className="h-full">
                      <SpotlightCard className="bg-background h-full p-7">
                        <service.icon
                          aria-hidden
                          className="text-primary size-5"
                          strokeWidth={1.5}
                        />
                        <h4 className="display-3 mt-5">{service.name}</h4>
                        <p className="body-text mt-2">{service.description}</p>
                      </SpotlightCard>
                    </Reveal>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
