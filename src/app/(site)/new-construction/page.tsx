import type { Metadata } from "next";
import Link from "next/link";
import { Blinds, Clapperboard, Lightbulb } from "lucide-react";

import { Button } from "@/components/ui/button";
import { HalfMark } from "@/components/motion-ui/half-mark";
import { Magnetic } from "@/components/motion-ui/magnetic";
import { Reveal } from "@/components/motion-ui/reveal";
import { SpotlightCard } from "@/components/motion-ui/spotlight-card";
import { SplitText } from "@/components/motion-ui/split-text";

const WHATSAPP = "https://api.whatsapp.com/send?phone=19548648005";

export const metadata: Metadata = {
  title:
    "Building a New Home in Florida? Bring Your Integrator in Early, Husky Audio Video",
  description:
    "Why smart home technology belongs in the plans alongside plumbing and electrical, and what it costs to add it later. Guidance for South Florida builds.",
  openGraph: {
    title: "Building in Florida? Bring your integrator in early.",
    description:
      "Why smart home technology belongs in the plans alongside plumbing and electrical, and what it costs to add it later.",
    locale: "en_US",
    type: "article",
  },
};

const rooms = [
  {
    icon: Clapperboard,
    title: "Home cinema",
    body: "A theater is architecture before it's equipment. Seating distance, screen height, sightlines, where the projector hangs, how the room is treated acoustically, those are decisions made with the architect, not after the room is framed.",
  },
  {
    icon: Lightbulb,
    title: "Lighting and shading",
    body: "Lighting design and shade design are the same conversation. Where the light comes from, what the sun does to that room at 4pm, and how both are controlled without a wall of switches.",
  },
  {
    icon: Blinds,
    title: "Outdoor living",
    body: "Patios, pools and summer kitchens need power, network and audio planned with the landscape, before the hardscape goes down and the trenching is over.",
  },
];

/**
 * The philosophy page: one argument, paced across ten movements.
 *
 * The twelve sections in the copy doc are grouped here so the page reads as an
 * argument rather than a list — statements alternate with editorial passages, and
 * the two peaks (navy at the cost argument, orange at the close) carry the emphasis.
 */
export default function NewConstructionPage() {
  return (
    <>
      {/* Same fixed half-mark as site 1, but held in brand colour the whole way
          down: this page has one light band and the tone switch would fire once,
          which reads as a glitch rather than as a system. */}
      <HalfMark darkOver={[]} />

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="bg-background relative flex min-h-[78svh] items-center overflow-hidden">
        {/* z-30 keeps the headline above the fixed half-mark at z-20. */}
        <div className="section-x relative z-30 mx-auto w-full max-w-[1600px] pt-32 pb-20">
          <Reveal direction="none">
            <p className="eyebrow">Our Approach</p>
          </Reveal>
          <h1 className="display-1 mt-8 max-w-[15ch] text-balance">
            <SplitText by="word" stagger={0.045} delay={0.05}>
              Building in Florida?
            </SplitText>{" "}
            <SplitText
              by="word"
              stagger={0.05}
              delay={0.25}
              className="text-primary"
            >
              Bring your integrator in early.
            </SplitText>
          </h1>
          <Reveal delay={0.35} className="mt-10">
            <p className="lead max-w-[56ch]">
              The most expensive smart home is the one added after the drywall
              goes up. Here&apos;s how we think about planning a build, and why
              the timing matters more than the hardware.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── Statement: plan first ────────────────────────────── */}
      <section className="bg-background border-t">
        <div className="section-x section-y-lg mx-auto max-w-[1600px]">
          <Reveal>
            <h2 className="display-2 max-w-[20ch] text-balance">
              Plan the technology before you start building.
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="mt-10">
            <div className="body-text max-w-[58ch] space-y-5 text-base">
              <p>
                If you&apos;re building a new home in South Florida, don&apos;t
                wait until construction is underway to think about technology.
              </p>
              <p>
                Your integrator should be at the table with your architect, your
                builder, your interior designer and your landscape designer,
                while the plan is still on paper and changing it costs nothing
                but a conversation.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Editorial: infrastructure ────────────────────────── */}
      <section className="bg-card">
        <div className="section-x section-y mx-auto grid max-w-[1600px] gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24">
          <Reveal>
            <h2 className="display-2 max-w-[14ch] text-balance">
              Technology is part of the house now.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="body-text space-y-5 text-base lg:pt-3">
              <p>
                Thirty years ago, wiring a home meant power and a phone line.
                Today it means structured cabling, wireless coverage planned room
                by room, rack space with real ventilation, and enough conduit to
                carry whatever replaces today&apos;s hardware.
              </p>
              <p className="text-foreground">
                That belongs in the drawings, next to plumbing and electrical.
                Not in a change order.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Peak 1: the cost argument, on the brand light band ─── */}
      <section
        className="relative"
        style={{ background: "var(--brand-light)" }}
      >
        <div className="section-x section-y-lg relative mx-auto max-w-[1600px]">
          <Reveal direction="none">
            <p className="eyebrow text-[color:var(--husky-700)]">
              The cost of deciding late
            </p>
          </Reveal>
          <h2 className="display-2 mt-7 max-w-[19ch] text-balance text-[color:var(--navy-900)] md:text-6xl lg:text-7xl">
            <SplitText by="word" stagger={0.04} as="span">
              Every decision gets more expensive after the walls close.
            </SplitText>
          </h2>
          <Reveal delay={0.15} className="mt-12">
            <div className="max-w-[62ch] space-y-5 text-base leading-relaxed text-[color:var(--navy-800)]">
              <p className="text-xl text-[color:var(--navy-900)]">
                Open walls are free. Closed walls are demolition.
              </p>
              <p>
                A speaker that would have been flush-mounted becomes a box on a
                bracket. A camera that needed one cable run now needs a battery
                and a compromise. Shades that should have had a recessed pocket
                sit in a visible housing instead.
              </p>
              <p>
                None of it is impossible later. All of it is worse and costs
                more.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Collaboration: three rooms ───────────────────────── */}
      <section className="bg-background">
        <div className="section-x section-y mx-auto max-w-[1600px]">
          <Reveal>
            <p className="eyebrow">Design collaboration</p>
            <h2 className="display-2 mt-7 max-w-[18ch] text-balance">
              The best rooms come from people talking early.
            </h2>
          </Reveal>
          <ul className="mt-16 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {rooms.map((r, i) => (
              <li key={r.title}>
                <Reveal delay={i * 0.08}>
                  <SpotlightCard className="bg-card h-full p-8">
                    <r.icon
                      className="text-primary size-5"
                      strokeWidth={1.5}
                      aria-hidden
                    />
                    <h3 className="display-3 mt-6">{r.title}</h3>
                    <p className="body-text mt-4 text-sm">{r.body}</p>
                  </SpotlightCard>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Invisible + Florida, paired ──────────────────────── */}
      <section className="bg-card">
        <div className="section-x section-y mx-auto grid max-w-[1600px] gap-16 lg:grid-cols-2 lg:gap-24">
          <Reveal>
            <h2 className="display-2 max-w-[15ch] text-balance">
              The best system is the one you don&apos;t see.
            </h2>
            <div className="body-text mt-8 space-y-5 text-base">
              <p>
                Good integration disappears. Speakers sit flush. Racks live in a
                closet, not a living room. Keypads replace switch banks. The
                equipment does its work without asking for attention.
              </p>
              <p>
                That outcome is a planning decision, not a product decision.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.12}>
            <h2 className="display-2 max-w-[15ch] text-balance">
              Florida homes ask more of the equipment.
            </h2>
            <div className="body-text mt-8 space-y-5 text-base">
              <p>
                Heat, humidity, salt air and storm season are not edge cases here
               , they&apos;re the operating conditions.
              </p>
              <p>
                Outdoor gear has to be specified for it, not adapted to it. Racks
                need real ventilation. Equipment needs clean power and a plan for
                what happens when the grid doesn&apos;t cooperate. Coastal builds
                are harder on hardware than inland ones.
              </p>
              <p className="text-foreground">
                We&apos;ve been building in South Florida for over 20 years. The
                climate is part of every specification we write.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── The network ──────────────────────────────────────── */}
      <section className="bg-background border-t">
        <div className="section-x section-y mx-auto max-w-[1600px]">
          <Reveal>
            <p className="eyebrow">The layer underneath</p>
            <h2 className="display-2 mt-7 max-w-[16ch] text-balance">
              Everything depends on the network.
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="mt-10">
            <div className="body-text max-w-[62ch] space-y-5 text-base">
              <p>
                Automation, cameras, streaming, shades, climate, and everyone
                working from home all ride the same infrastructure. When the
                network is an afterthought, the whole system is unreliable and
                nobody can tell you why.
              </p>
              <p>
                We survey the house, place access points where coverage actually
                lands, and hardwire the things that should never buffer.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.2} className="mt-12">
            <ul className="flex flex-wrap gap-x-10 gap-y-3">
              {["Cisco", "Araknis", "Ubiquiti", "CommScope"].map((b) => (
                <li key={b} className="meta">
                  {b}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* ── Future-proofing + simplicity ─────────────────────── */}
      <section className="bg-card">
        <div className="section-x section-y mx-auto max-w-[1600px]">
          <Reveal>
            <h2 className="display-2 max-w-[22ch] text-balance">
              Open walls are the cheapest insurance you&apos;ll ever buy.
            </h2>
            <div className="body-text mt-8 max-w-[58ch] space-y-5 text-base">
              <p>
                Nobody knows what a living room will need in ten years. But we
                know how to leave room for it, conduit to the places that will
                matter, capacity beyond today&apos;s devices, and a rack with
                space left in it.
              </p>
              <p>
                Pulling a spare run during construction costs almost nothing.
                Pulling it afterwards means opening a finished wall.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.15} className="mt-24 border-t pt-16">
            <h2 className="display-2 max-w-[20ch] text-balance">
              The point of all of it is that it feels simple.
            </h2>
            <div className="body-text mt-8 max-w-[58ch] space-y-5 text-base">
              <p className="text-foreground text-xl">
                A house full of apps is not a smart home. It&apos;s a house full
                of apps.
              </p>
              <p>
                The measure of a good system is that anyone can walk in and use
                it, one remote, one keypad, one sentence. Guests included. That
                simplicity is engineered, and it&apos;s the hardest part of the
                job.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Builders ─────────────────────────────────────────── */}
      <section className="bg-background border-t">
        <div className="section-x section-y mx-auto grid max-w-[1600px] gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24">
          <Reveal>
            <h2 className="display-2 max-w-[16ch] text-balance">
              Builders who&apos;ve done this once, do it this way every time.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="body-text space-y-5 text-base lg:pt-3">
              <p>
                Early involvement means fewer change orders, no surprise conduit
                requests at framing, and no conversation about why the speaker
                can&apos;t go where the client wants it.
              </p>
              <p>We work alongside the trades rather than after them.</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Peak 2: the close, on orange ─────────────────────── */}
      <section className="bg-primary">
        <div className="section-x section-y mx-auto max-w-[1600px]">
          <Reveal direction="none">
            <p className="eyebrow text-[color:var(--brand-black)]">
              Start early
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="display-2 mt-7 max-w-[18ch] text-balance text-white">
              Start before construction begins.
            </h2>
          </Reveal>
          <Reveal delay={0.16} className="mt-8">
            <div className="max-w-[54ch] space-y-4 text-base leading-relaxed text-[color:var(--brand-black)]">
              <p>
                If your project is in design, or if the ground has broken and
                you&apos;re wondering whether it&apos;s too late, talk to us.
                Early is better, but useful is useful.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.24} className="mt-12">
            <div className="flex flex-wrap items-center gap-4">
              <Magnetic strength={0.2}>
                <Button
                  asChild
                  size="lg"
                  className="h-12 bg-[color:var(--brand-black)] px-7 text-[15px] text-white hover:bg-[color:var(--brand-black)]/85"
                >
                  <a href={WHATSAPP} target="_blank" rel="noopener noreferrer">
                    Start the Conversation
                  </a>
                </Button>
              </Magnetic>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-12 border-[color:var(--brand-black)]/35 bg-transparent px-7 text-[15px] text-[color:var(--brand-black)] hover:bg-[color:var(--brand-black)]/10 hover:text-[color:var(--brand-black)] dark:border-[color:var(--brand-black)]/35 dark:bg-transparent dark:hover:bg-[color:var(--brand-black)]/10"
              >
                <Link href="/#services">See Our Services</Link>
              </Button>
            </div>
          </Reveal>
          <Reveal delay={0.32} className="mt-16 border-t border-[color:var(--brand-black)]/25 pt-8">
            <p className="meta text-[color:var(--brand-black)]">
              Husky Audio Video · Boca Raton · Serving South Florida
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
