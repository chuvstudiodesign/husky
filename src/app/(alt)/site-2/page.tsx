import type { Metadata } from "next";
import Link from "next/link";

import { ExpandingList } from "@/components/motion-ui/expanding-list";
import { FoldText } from "@/components/motion-ui/fold-text";
import { Reveal } from "@/components/motion-ui/reveal";
import { TextRevealScroll } from "@/components/motion-ui/text-reveal-scroll";
import { Rail } from "@/components/site/rail";

const WHATSAPP = "https://api.whatsapp.com/send?phone=19548648005";

export const metadata: Metadata = {
  title: "Husky Audio Video, Luxury Smart Home Automation in South Florida",
  description:
    "Custom smart home automation, home cinema, lighting, surveillance and networking for high-end homes across South Florida.",
  robots: { index: false, follow: false },
};

const SERVICES = [
  {
    title: "Automation",
    summary: "The layer that ties everything together",
    body: "One system for lighting, climate, entertainment and security, tuned to how your household actually runs. Most homes accumulate technology one purchase at a time, and it shows. We design the whole system first, then install it, so everything answers to the same logic and the same remote.",
  },
  {
    title: "Home Cinema",
    summary: "A real theater, built into your home",
    body: "Whole-house surround, calibrated video, and AirPlay so the room is ready before anyone sits down. A theater is architecture before it is equipment: seating distance, screen height, sightlines and acoustic treatment are decisions made with the architect, not after the room is framed.",
  },
  {
    title: "Smart Lighting",
    summary: "Light that follows the day, not a switch",
    body: "Lighting and climate that follow the day rather than a switch. Better rooms, lower consumption, and a house that looks composed at every hour. Where the light comes from and what the sun does to that room at four in the afternoon are the same conversation.",
  },
  {
    title: "Multi Room Audio",
    summary: "One room, or every room at once",
    body: "Music in one room, or every room at once. One button, or one sentence to your assistant. The measure of a good system is that anyone can walk in and use it, guests included.",
  },
  {
    title: "Outdoor Entertainment",
    summary: "Built for Florida, not adapted to it",
    body: "Audio and video built for the patio, the pool and the yard, specified for Florida weather rather than adapted to it. Heat, humidity, salt air and storm season are not edge cases here, they are the operating conditions.",
  },
  {
    title: "Smart Blinds",
    summary: "Motorized shades on a schedule",
    body: "Motorized shades that open on a schedule or on command, quietly enough that you stop noticing them, which is the point. Where they need a recessed pocket, that is a decision made while the walls are still open.",
  },
  {
    title: "Wi-Fi & Networking",
    summary: "The layer everything else depends on",
    body: "Every smart home is only as reliable as the network under it. We survey the house, place access points where they actually work, and hardwire the things that should never buffer. When the network is an afterthought, the whole system is unreliable and nobody can tell you why.",
  },
  {
    title: "Surveillance",
    summary: "See the property from anywhere",
    body: "Cameras, intercom and access control you can reach from anywhere. See the property in real time, speak to the gate, unlock a door from the airport.",
  },
];

const FACTS = [
  ["Founded", "20+ years of integration"],
  ["Based in", "Boca Raton, Florida"],
  ["Serving", "South Florida"],
  ["Focus", "High-end residential & commercial"],
  ["Platforms", "Cisco, Araknis, Ubiquiti, CommScope, Sonos"],
];

/**
 * Site 2 — the editorial variant.
 *
 * A different premise from the main site, not a rearrangement of it. The page is
 * treated as a document rather than a scroll narrative: a fixed index on the left,
 * one column of numbered sections on the right, no cards anywhere. Separation is
 * hairlines and space.
 *
 * That register suits an integrator better than a brochure does. The services are
 * the richest thing the company has, and a numbered specification lets all eight
 * be scanned at once and read in depth without the layout fighting either.
 */
export default function Site2Page() {
  return (
    <div className="min-h-screen">
      <Rail />

      <main className="lg:pl-80">
        <div className="mx-auto max-w-[880px] px-6 pt-28 pb-32 md:px-12 lg:pt-0">
          {/* ── 01 Introduction ─────────────────────────────── */}
          <section id="intro" className="flex min-h-[86svh] flex-col justify-center">
            <Reveal direction="none">
              <p className="eyebrow">01 — Introduction</p>
            </Reveal>
            <h1 className="display-1 mt-8 text-balance">
              <FoldText stagger={0.06}>Smart homes, engineered quietly.</FoldText>
            </h1>
            <Reveal delay={0.3} className="mt-10">
              <p className="lead max-w-[54ch]">
                We design and install the systems that make a high-end home
                effortless, automation, cinema, lighting, sound, security, and
                the network underneath it all.
              </p>
            </Reveal>
            <Reveal delay={0.42} className="mt-14">
              <dl className="grid grid-cols-2 gap-x-10 gap-y-8 sm:grid-cols-4">
                {[
                  ["South Florida", "Service area"],
                  ["20+", "Years"],
                  ["8", "Systems"],
                  ["5", "Platforms"],
                ].map(([v, l]) => (
                  <div key={l}>
                    <dd className="font-display text-2xl leading-none font-semibold tracking-tight">
                      {v}
                    </dd>
                    <dt className="meta mt-3">{l}</dt>
                  </div>
                ))}
              </dl>
            </Reveal>
          </section>

          {/* ── 02 Systems ──────────────────────────────────── */}
          <section id="services" className="pt-32">
            <Reveal>
              <p className="eyebrow">02 — Systems</p>
              <h2 className="display-2 mt-7 max-w-[16ch] text-balance">
                Eight systems. One house that behaves.
              </h2>
              <p className="body-text mt-8 max-w-[58ch] text-base">
                Most homes accumulate technology one purchase at a time, and it
                shows. Select a system to read the specification.
              </p>
            </Reveal>
            <Reveal delay={0.1} className="mt-14">
              <ExpandingList items={SERVICES} />
            </Reveal>
          </section>

          {/* ── 03 Approach ─────────────────────────────────── */}
          <section id="approach" className="pt-32">
            <Reveal>
              <p className="eyebrow">03 — Approach</p>
              <h2 className="display-2 mt-7 max-w-[18ch] text-balance">
                The best time to plan a smart home is before the walls close.
              </h2>
            </Reveal>
            <div className="mt-12 max-w-[60ch]">
              <TextRevealScroll className="lead max-w-none">
                Technology is infrastructure now. It belongs in the drawings
                alongside plumbing and electrical, not added after the drywall is
                up, at three times the cost and half the result.
              </TextRevealScroll>
            </div>
            <Reveal delay={0.1} className="mt-8">
              <p className="body-text max-w-[60ch] text-base">
                If you are building or renovating, bring us in while the plan is
                still on paper.
              </p>
              <Link
                href="/new-construction"
                className="text-primary hover:text-husky-400 mt-8 inline-block text-[15px] transition-colors"
              >
                Read how we plan a build →
              </Link>
            </Reveal>
          </section>

          {/* ── 04 Platforms ────────────────────────────────── */}
          <section id="partners" className="pt-32">
            <Reveal>
              <p className="eyebrow">04 — Platforms</p>
              <h2 className="display-2 mt-7 max-w-[16ch] text-balance">
                We install what we can stand behind.
              </h2>
            </Reveal>
            <Reveal delay={0.1} className="mt-12">
              <ol className="flex flex-col">
                {["Cisco", "Araknis", "Ubiquiti", "CommScope", "Sonos"].map(
                  (brand, i) => (
                    <li
                      key={brand}
                      className="flex items-baseline gap-8 border-t py-6 last:border-b"
                    >
                      <span className="text-muted-foreground/40 font-mono text-[11px] tabular-nums">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="font-display text-2xl font-medium tracking-tight md:text-3xl">
                        {brand}
                      </span>
                    </li>
                  ),
                )}
              </ol>
              <p className="body-text mt-8 max-w-[58ch] text-sm">
                Husky works with the leading platforms in the industry and is
                certified to work with their systems.
              </p>
            </Reveal>
          </section>

          {/* ── 05 Practice ─────────────────────────────────── */}
          <section id="about" className="pt-32">
            <Reveal>
              <p className="eyebrow">05 — Practice</p>
              <h2 className="display-2 mt-7 max-w-[16ch] text-balance">
                A luxury technology integrator, based in Boca Raton.
              </h2>
            </Reveal>
            <Reveal delay={0.1} className="mt-10">
              <div className="body-text max-w-[60ch] space-y-6 text-base">
                <p>
                  We specialize in smart home technology, commercial control and
                  automation, Wi-Fi, home cinema and audio/video distribution.
                  For over 20 years we have worked with high-end residential and
                  commercial clients across South Florida.
                </p>
                <p>
                  Training and continual improvement are part of our DNA, the
                  platforms change every year, and staying current is the job.
                </p>
                <p>
                  Our work makes a home safe, elegant, and genuinely easy to use.
                  For home offices, the same enterprise-grade networking that
                  runs a business runs the house.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.16} className="mt-14">
              <dl className="flex flex-col">
                {FACTS.map(([label, value]) => (
                  <div
                    key={label}
                    className="flex flex-col gap-1 border-t py-5 last:border-b sm:flex-row sm:items-baseline sm:justify-between sm:gap-10"
                  >
                    <dt className="meta shrink-0">{label}</dt>
                    <dd className="text-[15px] sm:text-right">{value}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </section>

          {/* ── 06 Contact ──────────────────────────────────── */}
          <section id="contact" className="pt-32">
            <Reveal>
              <p className="eyebrow">06 — Contact</p>
              <h2 className="display-2 mt-7 max-w-[16ch] text-balance">
                Tell us what you are building.
              </h2>
              <p className="lead mt-8 max-w-[52ch]">
                Whether it is a full new build or a single room, start with a
                conversation. We will tell you honestly what the project needs.
              </p>
            </Reveal>
            <Reveal delay={0.1} className="mt-12">
              <ul className="flex flex-col">
                {[
                  ["WhatsApp", "+1 954 864 8005", WHATSAPP, true],
                  ["Phone", "+1 954 864 8005", "tel:+19548648005", false],
                  [
                    "Email",
                    "info@huskyautomation.com",
                    "mailto:info@huskyautomation.com",
                    false,
                  ],
                  [
                    "Studio",
                    "4301 Oak Cir #26, Boca Raton, FL 33431",
                    "https://goo.gl/maps/Qs29ngQRJVS6ptjc9",
                    true,
                  ],
                ].map(([label, value, href, external]) => (
                  <li key={label as string} className="border-t last:border-b">
                    <a
                      href={href as string}
                      {...(external
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                      className="group flex flex-col gap-1 py-6 sm:flex-row sm:items-baseline sm:justify-between sm:gap-10"
                    >
                      <span className="meta shrink-0">{label as string}</span>
                      <span className="group-hover:text-primary text-[15px] transition-colors sm:text-right">
                        {value as string}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={0.2} className="mt-20 border-t pt-8">
              <div className="flex flex-col justify-between gap-3 sm:flex-row">
                <p className="meta">
                  © {new Date().getFullYear()} Husky Automation Corp
                </p>
                <p className="meta">Boca Raton · Florida</p>
              </div>
            </Reveal>
          </section>
        </div>
      </main>
    </div>
  );
}
