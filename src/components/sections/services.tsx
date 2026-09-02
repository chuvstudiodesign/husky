import { existsSync } from "node:fs";
import { join } from "node:path";

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

import { BlueprintGrid } from "@/components/motion-ui/blueprint-grid";
import { Reveal } from "@/components/motion-ui/reveal";
import { ServiceTabs } from "@/components/sections/service-tabs";

interface Service {
  name: string;
  description: string;
  icon: LucideIcon;
  /** Per-service panel mock, 1200 × 910. Falls back to the family sheet. */
  image: string;
  alt: string;
}

interface Family {
  label: string;
  /** Anchor id on the card's `article`. */
  slug: string;
  /** The family sheet, and the fallback for any service mock not exported yet. */
  fallback: string;
  fallbackAlt: string;
  services: Service[];
}

/* Eight services, grouped into three families, one showcase card each.
   The grouping is structural: a flat grid of eight equal tiles gives the
   visitor no way in, and eight cards would be a gallery rather than an
   argument. Three cards is three claims, and inside each one the services take
   turns.

   Copy is verbatim from the flat grid this replaced — the layout changed, the
   words did not. */
const FAMILIES: Family[] = [
  {
    label: "Entertainment",
    slug: "entertainment",
    fallback: "/showcase/entertainment.svg",
    fallbackAlt:
      "A multi-room audio controller showing four zones — living room, kitchen, cinema and patio — with per-zone volume and playback state, beside a home cinema tile reading 7.2.4 calibrated and an outdoor zone tile rated IP65.",
    services: [
      {
        name: "Home Cinema",
        description:
          "A real theater built into your home: whole-house surround, calibrated video, and AirPlay ready before you sit down.",
        icon: Clapperboard,
        image: "/showcase/home-cinema.svg",
        alt: "A home cinema control panel: a calibrated 7.2.4 surround layout with screen, projector and seating positions laid out room by room.",
      },
      {
        name: "Multi Room Audio",
        description:
          "Music in one room, or every room at once. One button, or one sentence to your assistant.",
        icon: Volume2,
        image: "/showcase/multi-room-audio.svg",
        alt: "A multi-room audio controller listing four zones with independent volume levels and playback state, and one control that syncs them all.",
      },
      {
        name: "Outdoor Entertainment",
        description:
          "Audio and video built for the patio, the pool and the yard, specified for Florida weather, not adapted to it.",
        icon: Trees,
        image: "/showcase/outdoor-entertainment.svg",
        alt: "An outdoor zone panel covering the patio, pool and yard, with weather-rated IP65 speakers and per-zone levels.",
      },
    ],
  },
  {
    label: "Comfort & Control",
    slug: "comfort-control",
    fallback: "/showcase/comfort-control.svg",
    fallbackAlt:
      "A lighting scene panel with morning, evening, movie and away presets and per-room brightness levels, beside a climate tile holding 72 degrees and a smart blinds tile set to open at sunrise.",
    services: [
      {
        name: "Automation",
        description:
          "One system for lighting, climate, entertainment and security, tuned to how your household actually runs.",
        icon: Cpu,
        image: "/showcase/automation.svg",
        alt: "One control surface holding lighting scenes, climate and shades together, with morning, evening, movie and away presets.",
      },
      {
        name: "Smart Lighting",
        description:
          "Lighting and climate that follow the day rather than a switch. Better rooms, lower bills, a house composed at any hour.",
        icon: Lightbulb,
        image: "/showcase/smart-lighting.svg",
        alt: "A lighting panel with per-room brightness levels for living room, kitchen, bedroom and hallway, set to follow the day.",
      },
      {
        name: "Smart Blinds",
        description:
          "Motorized shades that open on a schedule or on command, quietly enough that you stop noticing them, which is the point.",
        icon: Blinds,
        image: "/showcase/smart-blinds.svg",
        alt: "A motorized shade panel showing a blind at 60 percent, scheduled to open at 7:30 with sunrise.",
      },
    ],
  },
  {
    label: "Infrastructure & Security",
    slug: "infrastructure-security",
    fallback: "/showcase/infrastructure.svg",
    fallbackAlt:
      "A network topology showing a 10-gigabit core rack wired to access points in the living room, patio, garage and office at 99.99 percent uptime, beside a live gate camera and an access panel listing the front gate, garage and front door as locked.",
    services: [
      {
        name: "Wi-Fi & Networking",
        description:
          "A smart home is only as reliable as the network under it. We survey the house and hardwire what should never buffer.",
        icon: Wifi,
        image: "/showcase/wifi-networking.svg",
        alt: "A network topology with a 10-gigabit core rack wired out to access points in the living room, patio, garage and office, at 99.99 percent uptime.",
      },
      {
        name: "Surveillance",
        description:
          "Cameras, intercom and access control from anywhere. Watch the property, speak to the gate, unlock a door from the airport.",
        icon: Cctv,
        image: "/showcase/surveillance.svg",
        alt: "A live gate camera view beside an access panel listing the front gate, garage and front door, each showing locked or closed.",
      },
    ],
  },
];

/* The per-service mocks are being exported separately from the family sheets,
   and the two jobs do not have to land in the same commit. Anything missing
   from /public falls back to its family sheet, so the section is always
   coherent: at worst the three tiles in a card select the same picture, at best
   each one selects its own, and nothing here changes when the files arrive.

   Server-side and module-scope, so it is one `stat` per file at build time and
   nothing at all at request time. */
function resolve(path: string, fallback: string) {
  return existsSync(join(process.cwd(), "public", path)) ? path : fallback;
}

/**
 * Services — three showcase cards on the site's one background.
 *
 * The section used to be a flat grid of eight equal tiles, which asked the
 * visitor to read eight things and told them nothing about which mattered. It
 * is three cards now, one per family: the services on the left, and on the
 * right a light panel showing the one currently selected actually running. The
 * tab strip under the panel advances on its own every six seconds behind a thin
 * progress line, and a click takes over. The claim and the evidence sit in the
 * same box, and the box demonstrates itself.
 *
 * **Surfaces — inside a card, elevation steps UP.** The band is `--background`
 * (#090A0F), the showcase card is `--card` (#11131C), and from `lg` the
 * selected service tile steps *lighter* again, to `--muted` (#1A1D29). This
 * supersedes the first build of the section, which stepped the tiles back down
 * to `--background`: on screen a darker fill inside a lighter one reads as a
 * hole punched in the panel, not as a tile sitting on it. Client mandate,
 * 2026-09-01 — inside a card, light means raised.
 *
 * `--muted` rather than a new token, because the surface rule already names it:
 * two levels of `--card` are the ceiling, and where a third is genuinely needed
 * it is a border or a subtle `--muted` fill. This is that case, and the
 * selected tile takes both. Measured, dark theme:
 *
 *   #1A1D29 tile on #11131C card … 1.12:1   the step that says "raised"
 *   #8E9BB0 body on #1A1D29      … 5.90:1   was 7.03 on the backdrop, still AA
 *   #FFFFFF title on #1A1D29     … 16.6:1
 *
 * The light theme's `--muted` equals its `--card`, so on light the tile would
 * read on its border alone. The site ships dark-only and the styleguide is
 * where light lives, so that is a note rather than a defect.
 *
 * **The orange.** One signal per viewport. Above the fold the section eyebrow
 * has it; inside a card the progress line has it, and there is only ever one
 * line running because there is only ever one card in view. Nothing else here
 * is orange — not the family labels, which are `.meta` muted, and not the
 * service icons, which are category markers rather than actions. The light
 * panels carry two small orange marks of their own, which is the whole reason
 * the rest of the card stays quiet.
 *
 * Only the card interiors are client components; the section, its heading, the
 * copy and the icons are all rendered here on the server. See `ServiceTabs`.
 */
export function Services() {
  return (
    <section
      id="services"
      aria-labelledby="services-heading"
      className="bg-background relative isolate"
    >
      {/* The drafting texture, scoped to this section and mounted nowhere else
          — no layout above this one carries a viewport-wide copy, so what
          renders here is the only dot grid on the page.

          `relative isolate` on the section is what makes the layer work at all:
          the grid sits at `-z-10`, and inside a stacking context that paints it
          above the section's own opaque `bg-background` and below every word,
          card and border in it. See `BlueprintGrid` for why paint order rather
          than a blend mode. */}
      <BlueprintGrid className="absolute" />
      {/* One reduced top step, and the only spacing exception on the site.
          Every other section is preceded by a full section, so `.section-y` on
          both sides reads as the rhythm. This one is preceded by the stats
          strip, which is a footnote to the hero rather than a section, and a
          full beat stacked on the strip's own padding made that one boundary
          visibly wider than every other.

          The clamp is `.section-y`'s own construction with a lower ceiling:
          identical 80px floor, 128px instead of 176px at the top, vw-driven in
          between. With the strip's 48px it closes to 176 — the same beat as
          the rest of the page. Bottom padding is untouched, so the step into
          Approach is the normal one. */}
      <div className="section-x section-y relative z-20 mx-auto max-w-7xl pt-[clamp(5rem,9vw,8rem)]">
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

        {/* Flex + gap rather than `space-y`, and the sticky stack is the whole
            reason. A sticky element is clamped so its *margin box* stays inside
            the containing block, and `space-y` puts a 64px bottom margin on
            every card but the last. Each of the first two therefore ran out of
            range 64px early, got shoved up while the third seated, and left
            their family label sticking out half-cut under the header. As a gap
            the 64px belongs to the container instead of the card, so all three
            travel the same distance and the only thing that shows above the
            last card is the 10px it is shorter than the other two — a deck
            edge, which is what a deck should look like. Same 56/64px rhythm
            either way. */}
        <div className="mt-20 flex flex-col gap-14 md:mt-28 md:gap-16">
          {FAMILIES.map((family, i) => (
            /* Sticky stack, desktop only. Each card pins 112px down — clear of
               the 80px fixed header with a 32px breath — and the next one
               scrolls up over it, so the three cards join into a deck instead
               of parading past. The cards are opaque `--card` on `--background`
               and every one of them is a positioned element, so DOM order alone
               puts the later card on top: no z-index anywhere, and the
               section's BlueprintGrid stays at -z-10 underneath.

               The sticky lives on the Reveal wrapper because sticky offsets are
               resolved against the *parent*, and the wrapper is the direct
               child of the flow container above. On the `article` it would
               stick inside a box its own size and never move. The `translate`
               the reveal animates is on this same element rather than an
               ancestor, which sticky tolerates; an ancestor transform, or any
               `overflow` but visible above here, would kill it silently.

               Below lg the cards scroll normally: a pinned card on a phone eats
               the whole viewport and there is no room left to see the next one
               arrive, which is the entire effect.

               That argument is about height, and width was the only thing
               guarding it — which is how it survived into the one place it
               was written to prevent. A tablet held sideways is 1024x768 or
               1180x820: `lg` is satisfied, but the narrow columns make the card
               648px tall, and pinned at 112 it runs to 760 in a 768 viewport.
               The reader gets a card filling the screen, held there for ~700px
               of scroll, with nothing of the next one showing — the phone
               failure at a desktop breakpoint. At 1440x900 the same card is
               564px and leaves 224px of the next one, which is the effect.

               So the height gets a condition of its own, and it is a media
               query rather than arithmetic because nothing in CSS can compare a
               card's height to the viewport's. 840px is where the devices
               separate: every tablet landscape (768, 820, 834) is under it and
               scrolls normally, every current laptop (900 and up) is over it and
               keeps the deck. Below the line the cards behave exactly as they do
               below `lg`, which is a shipped, reviewed state rather than a new
               one. */
            <Reveal
              key={family.label}
              delay={i * 0.06}
              className="lg:top-28 lg:[@media(min-height:52.5rem)]:sticky"
            >
              {/* The leading edge. A card riding up over the one behind it cut
                  a hard line across it, which read as a seam rather than as one
                  card passing in front of another, so each card casts a soft
                  shadow *upward* out of its top edge — the direction it travels
                  — onto whatever it is covering.

                  The colour is the page background at 80%, not black: against
                  the plain backdrop above the first card the shadow is the same
                  ink as the surface it falls on and disappears, and it only
                  becomes visible where there is a lighter card underneath to
                  darken. That is what buys a constant shadow with no scroll
                  listener and no state. `--background` rather than a hex, and
                  only the geometry is literal: the elevation tokens are all
                  cast downward and none of them describes this. Desktop only,
                  since nothing overlaps below lg.

                  `-mx-2`: the card overshoots the section's text axis by 8px on
                  each side. Client, 2026-09-01, with the alignment guide drawn
                  down the eyebrow — "o mesmo trabalho de extrapolar a largura
                  do card em 8px ou 12px aqui", the same correction already
                  applied to the stats picture in `MediaBand`.

                  8 here, 12 there, and the difference is the corner. The
                  picture is a 24px-radius block, so its edge curves away from
                  the axis over a long arc and 12 — half the radius — is the
                  standard compensation. This card is `rounded-lg`, 4px, so
                  almost none of the retreat is geometric: what makes it read as
                  indented is mass and contrast, a wide `--card` fill on
                  `--background` behind an 8%-white hairline, where the eye
                  settles the edge on the faint border rather than on the fill's
                  true boundary. Both were rendered at 1440 and looked at. 8
                  lands the fill on the axis; 12 pushes the border visibly past
                  the eyebrow's stem and trades an indent for an outdent. 8 is
                  also on the client's 8px grid.

                  Every width, not `lg` and up. Below the breakpoint the cards
                  are still inset from the viewport by `section-x` — 24px at
                  390 — so the correction just closes that gutter to 16, which
                  is a register the page already uses, and the rule stays one
                  rule instead of two.

                  On the `article`, never on the `Reveal` above it. The wrapper
                  is the sticky element and its offsets resolve against the flow
                  container; a margin on it would move the box sticky is clamped
                  inside. The article simply paints 8px wider than the wrapper
                  it fills, so pinning, the stack order and the upward shadow
                  are all untouched — the shadow is cast by this same box and
                  widens with it. Interior padding lives in `ServiceTabs` and
                  does not move: only the box grows.

                  The hairline is `lg:` only. Below it the fill and the family
                  label already group the tiles, and a border around bordered
                  tiles read as eight boxes inside three on a phone. */}
              <article
                id={family.slug}
                className="bg-card -mx-2 rounded-lg lg:border lg:shadow-[0_-12px_32px_-12px_color-mix(in_oklab,var(--background)_80%,transparent)]"
              >
                <ServiceTabs
                  label={family.label}
                  tabs={family.services.map((service) => {
                    const image = resolve(service.image, family.fallback);
                    return {
                      name: service.name,
                      description: service.description,
                      image,
                      alt:
                        image === service.image
                          ? service.alt
                          : family.fallbackAlt,
                      /* Rendered here rather than passed as a component: a
                         function cannot cross the server/client boundary, and
                         an element can. It also keeps the icon set out of the
                         client bundle entirely. */
                      icon: (
                        <service.icon
                          aria-hidden
                          className="text-muted-foreground shrink-0"
                        />
                      ),
                    };
                  })}
                />
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
