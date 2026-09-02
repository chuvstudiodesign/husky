import type { Metadata } from "next";
import Link from "next/link";
import { Blinds, Clapperboard, Lightbulb } from "lucide-react";

import { Button } from "@/components/ui/button";
import { HalfMark } from "@/components/motion-ui/half-mark";
import { Reveal } from "@/components/motion-ui/reveal";
import { SpotlightCard } from "@/components/motion-ui/spotlight-card";
import { SplitText } from "@/components/motion-ui/split-text";
import { SectionSeam } from "@/components/sections/section-seam";

const WHATSAPP = "https://api.whatsapp.com/send?phone=19548648005";

/**
 * The close band is `--primary` (#EC663D), one fixed tone in both themes, so
 * every colour on it is pinned rather than semantic — the same contract the
 * light band above runs on.
 *
 * Orange background means black type, without exception. White on #EC663D
 * measures 3.21:1, large-text AA only; #090A0F measures 6.15:1 and clears AA at
 * every size, so one value does the whole band and hierarchy comes from size and
 * weight rather than tone.
 */
const ON_ORANGE = "text-brand-black";

/**
 * The primary CTA — the pre-navy pattern, restored.
 *
 * `bg-primary` on a `bg-primary` band is an invisible button, so the fill flips
 * to brand black and the label goes white with it. Rule 2 governs type sitting
 * on the orange surface; this label sits on a black surface, and follows that
 * one instead.
 *
 *   #090A0F panel on #EC663D … 6.15:1   the button against the band
 *   #FFFFFF label on #090A0F … 19.8:1   the label against the button
 *
 * The focus ring goes white because `--ring` is the brand orange and would
 * vanish against the band, and a black ring would vanish against the button.
 * White clears both — 3.21:1 on the orange, 19.8:1 on the black.
 */
const ON_ORANGE_CTA =
  "bg-brand-black text-primary-foreground hover:bg-brand-black/90 focus-visible:border-white focus-visible:ring-white";

/**
 * The plain text action beside it. It has no fill, so its label really is on
 * orange and Rule 2 applies directly: black label, black hover wash, and a
 * black focus ring at 6.5:1 on the band.
 */
const ON_ORANGE_GHOST = `${ON_ORANGE} hover:bg-brand-black/10 hover:text-brand-black dark:hover:bg-brand-black/10 focus-visible:border-brand-black focus-visible:ring-brand-black`;

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
    body: "A theater is architecture before it's equipment. Seating distance, screen height, sightlines, where the projector hangs, how the room is treated acoustically, all decided with the architect.",
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
        {/* The half-mark sits at -z-10 behind all content; this z-30 is redundant but harmless. */}
        <div className="section-x relative z-30 mx-auto w-full max-w-7xl pt-32 pb-20">
          <Reveal direction="none">
            <p className="eyebrow">Our Approach</p>
          </Reveal>
          <h1 className="display-1 mt-8 max-w-[15ch]">
            <SplitText by="word" stagger={0.045} delay={0.05}>
              Building in Florida?
            </SplitText>{" "}
            {/* Neutral, like the home hero's second line. The headline is the
                largest surface on the page and the accent has no business
                covering it — the eye should land here on scale and then be
                pulled to the one orange thing in the viewport. */}
            <SplitText by="word" stagger={0.05} delay={0.25}>
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
      {/* No border-t: the hero's own bottom padding plus this section's
          section-y-lg is the separator. One per boundary. */}
      <section className="bg-background">
        <div className="section-x section-y-lg mx-auto max-w-7xl">
          <Reveal>
            <h2 className="display-2 max-w-[20ch]">
              Plan the technology before you start building.
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="mt-10">
            {/* The paragraph directly under a heading is `.lead` everywhere on
                the site; the ones after it are `.body-text`. Two registers, in
                fixed positions, so no section invents a third. */}
            <div className="body-text max-w-[58ch] space-y-5">
              <p className="lead max-w-none">
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
      <section className="bg-background">
        <div className="section-x section-y mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24">
          <Reveal>
            <h2 className="display-2 max-w-[14ch]">
              Technology is part of the house now.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="body-text space-y-5 lg:pt-3">
              <p className="lead max-w-none">
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
      <section className="bg-brand-light relative">
        {/* Dark to light — the same interlock the home page uses at its own
            light band. See `SectionSeam`. */}
        <SectionSeam rise="fill-brand-light" fall="fill-background" />
        {/* Two columns from `lg`, on the same 0.9/1.1 split the two editorial
            sections above and below already use — this is the page's one light
            band and it was the only peak still running as a single left column.
            Measured at 1440 the copy stopped at x=780 and left 660px of bare
            grey; at 1920 it stopped at x=1020 and left 900. A band that is two
            thirds empty does not read as emphasis, it reads as a section that
            failed to load, and the home page's equivalent light band avoids it
            by filling the right column with the portrait.

            Nothing about the argument moves: heading first, prose second, same
            copy, same order. `gap-12` is the stacked value and it is exactly
            the `mt-12` the prose carried before, so below `lg` the rendering is
            unchanged to the pixel.

            `lg:pt-14` is the `lg:pt-3` the other two two-column sections use,
            plus the 44px this one's left column spends on an eyebrow they do
            not have — 16 of line box and 28 of `mt-7`. Without it the prose
            started 12px under the eyebrow and 32px over the headline, level
            with neither, which is the near-miss that reads as a mistake rather
            than as a second column. At 56 the lead's cap lands about 9px under
            the headline's, which is where it lands in those two sections. */}
        <div className="section-x section-y-lg relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24">
          <div>
            <Reveal direction="none">
              {/* The band is light, so the eyebrow's dark-theme orange (2.96:1
                  here) is overridden. navy-800, not the old husky-700: a light
                  band carries black or navy and nothing else, and the burnt
                  orange was the last hue on it that was neither. 6.7:1 on
                  #DFDFDF, and a step under the navy-900 headline it introduces —
                  the same pairing the home page's Approach band uses. */}
              <p className="eyebrow text-navy-800">The cost of deciding late</p>
            </Reveal>
            <h2 className="display-2 mt-7 max-w-[19ch] text-navy-900">
              <SplitText by="word" stagger={0.04} as="span">
                Every decision gets more expensive after the walls close.
              </SplitText>
            </h2>
          </div>
          <Reveal delay={0.15} className="lg:pt-14">
            <div className="body-text text-navy-800 max-w-[62ch] space-y-5">
              <p className="lead text-navy-900 max-w-none">
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
      <section className="bg-background relative">
        {/* Light back to dark, closing the band above. */}
        <SectionSeam rise="fill-background" fall="fill-brand-light" />
        <div className="section-x section-y mx-auto max-w-7xl">
          <Reveal>
            <p className="eyebrow">Design collaboration</p>
            <h2 className="display-2 mt-7 max-w-[18ch]">
              The best rooms come from people talking early.
            </h2>
          </Reveal>
          <ul className="mt-16 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {rooms.map((r, i) => (
              <li key={r.title}>
                <Reveal delay={i * 0.08} className="lg:h-full">
                  {/* One fixed height for the group at every breakpoint, so the
                      third card doesn't sit shorter than the pair above it in
                      the 2-up layout. h-full only equalises within a row.

                      One value is not enough, because the grid goes 3-up at
                      `lg` while the container is still narrow. Measured at
                      1024 the card comes out 297px wide, the longest body wraps
                      to seven lines, and the content needs 350px in a box
                      declared 320 — `SpotlightCard` is `overflow-hidden`, so
                      the last line rendered 3px off the bottom border with its
                      32px of padding gone and the next line would have been cut
                      outright. 384 clears it with the same slack the 1440 build
                      already carries on its shorter cards.

                      Through the `lg` band the height stops being a number at
                      all. `li` is a stretched grid item, the `Reveal` inside it
                      takes the row's height, and the card takes the Reveal's, so
                      the row measures the tallest card and the other two match
                      it — 350px at 1024, 322px from about 1100 up, and never
                      one pixel less than the copy needs. A fixed value cannot
                      do that across a band where the card goes from 297px wide
                      to 373: 384 clears 1024 and leaves 151px of dead tile at
                      1279, and anything smaller clips again at the bottom end.
                      `xl` restores the flat 320 the desktop build was reviewed
                      at, so 1280 and 1440 render exactly what they rendered
                      before. */}
                  <SpotlightCard className="bg-card h-80 p-8 lg:h-full xl:h-80">
                    {/* No size and no strokeWidth: 24x24 at 1.5 is the system
                        default now, set once in globals.css. Muted, not
                        `text-primary`: card icons are category markers, and
                        three of them in a row is a pattern, not a signal. */}
                    <r.icon className="text-muted-foreground" aria-hidden />
                    <h3 className="display-3 mt-6">{r.title}</h3>
                    <p className="body-text mt-4">{r.body}</p>
                  </SpotlightCard>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Invisible + Florida, paired ──────────────────────── */}
      <section className="bg-background">
        <div className="section-x section-y mx-auto grid max-w-7xl gap-16 lg:grid-cols-2 lg:gap-24">
          <Reveal>
            <h2 className="display-2 max-w-[15ch]">
              The best system is the one you don&apos;t see.
            </h2>
            <div className="body-text mt-8 space-y-5">
              <p className="lead max-w-none">
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
            <h2 className="display-2 max-w-[15ch]">
              Florida homes ask more of the equipment.
            </h2>
            <div className="body-text mt-8 space-y-5">
              <p className="lead max-w-none">
                Heat, humidity, salt air and storm season are not edge cases
                here, they&apos;re the operating conditions.
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
      <section className="bg-background">
        <div className="section-x section-y mx-auto max-w-7xl">
          <Reveal>
            <p className="eyebrow">The layer underneath</p>
            <h2 className="display-2 mt-7 max-w-[16ch]">
              Everything depends on the network.
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="mt-10">
            <div className="body-text max-w-[62ch] space-y-5">
              <p className="lead max-w-none">
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
      <section className="bg-background">
        <div className="section-x section-y mx-auto max-w-7xl">
          <Reveal>
            <h2 className="display-2 max-w-[22ch]">
              Open walls are the cheapest insurance you&apos;ll ever buy.
            </h2>
            <div className="body-text mt-8 max-w-[58ch] space-y-5">
              <p className="lead max-w-none">
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

          {/* Whitespace alone divides the two movements — the hairline that
              used to sit here doubled a separator the gap already made.

              Which means the gap has to be readable as smaller than the one
              between sections, and through the tablet band it was not. Section
              padding is fluid (`.section-y`, 12.5vw between the 80 and 176px
              stops) while this is a fixed 160: at 1440 the boundary either side
              of this section is 352px against 179 of rendered gap here, a clean
              half, but at 820 the section boundary has shrunk to 205 and 179 is
              87% of it — the two breaks measure the same and the reader cannot
              tell whether "The point of all of it" opens a new section or
              continues this one. 112 at `md` restores the ratio (0.58 at 768,
              0.44 at 1023) and is a step the page already uses. `lg` puts 160
              back, so 1280 and 1440 are untouched; below `md` the value is left
              where it was reviewed. */}
          <Reveal delay={0.15} className="mt-40 md:mt-28 lg:mt-40">
            <h2 className="display-2 max-w-[20ch]">
              The point of all of it is that it feels simple.
            </h2>
            <div className="body-text mt-8 max-w-[58ch] space-y-5">
              <p className="lead text-foreground max-w-none">
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
      <section className="bg-background">
        <div className="section-x section-y mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24">
          <Reveal>
            <h2 className="display-2 max-w-[16ch]">
              Builders who&apos;ve done this once, do it this way every time.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="body-text space-y-5 lg:pt-3">
              <p className="lead max-w-none">
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
      {/* The page's one tonal event, and it lands on the thing the page is for.
          Everything above is #090A0F bar the single light band, so the close
          needs no rule to open it — the surface change is the boundary. */}
      <section className={`bg-primary ${ON_ORANGE} relative`}>
        {/* Dark to orange, the page's one tonal event. */}
        <SectionSeam rise="fill-primary" fall="fill-background" />
        <div className="section-x section-y mx-auto max-w-7xl">
          <Reveal direction="none">
            <p className={`eyebrow ${ON_ORANGE}`}>Start early</p>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="display-2 mt-7 max-w-[18ch]">
              Start before construction begins.
            </h2>
          </Reveal>
          <Reveal delay={0.16} className="mt-8">
            <p className={`lead max-w-[54ch] ${ON_ORANGE}`}>
              If your project is in design, or if the ground has broken and
              you&apos;re wondering whether it&apos;s too late, talk to us.
              Early is better, but useful is useful.
            </p>
          </Reveal>
          <Reveal delay={0.24} className="mt-12">
            <div className="flex flex-wrap items-center gap-4">
              {/* On orange both buttons need the full override set: the
                  primary one because `bg-primary` on a `bg-primary` band is not
                  a button, the secondary one because its label sits on the band
                  itself. No `Magnetic` wrapper on either — see the hero
                  sections. Client mandate, 2026-09-01: buttons do not move on
                  hover. */}
              <Button asChild className={ON_ORANGE_CTA}>
                <a href={WHATSAPP} target="_blank" rel="noopener noreferrer">
                  Talk to Us
                </a>
              </Button>
              <Button asChild variant="ghost" className={ON_ORANGE_GHOST}>
                <Link href="/#services">Our Services</Link>
              </Button>
            </div>
          </Reveal>
          {/* No hairline over the colophon. 96px of clear orange is the
              separator; the rule that used to sit here drew a second one. */}
          <Reveal delay={0.32} className="mt-24">
            <p className={`meta ${ON_ORANGE}`}>
              Husky Audio Video · Boca Raton · Serving South Florida
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
