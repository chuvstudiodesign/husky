import Link from "next/link";

import { Reveal } from "@/components/motion-ui/reveal";
import { TextRevealScroll } from "@/components/motion-ui/text-reveal-scroll";
import { SplitText } from "@/components/motion-ui/split-text";
import { SectionSeam } from "@/components/sections/section-seam";
import { Button } from "@/components/ui/button";

/**
 * Approach — the page's high-contrast moment and the bridge to
 * `/new-construction`.
 *
 * Site 1 inverts this block: instead of dropping to navy it rises to the brand's
 * light grey, `--brand-light` (#DFDFDF). Against a page that is otherwise near
 * black, a light band is the largest tonal jump available, and it reads as a
 * printed page set into the screen.
 *
 * Because the surface is light, every foreground token here would be wrong — they
 * are all tuned for #090A0F. A light band takes black or navy and nothing else,
 * so all three registers are navy:
 *   navy-900 on #DFDFDF … 11.7:1   (headline)
 *   navy-800 on #DFDFDF … 6.7:1    (lead, and the eyebrow)
 *
 * The eyebrow used to be husky-700, a burnt orange at ~5:1. It passed on
 * contrast and failed on the rule: the only two hues a light band carries are
 * black and navy. navy-800 rather than navy-900 keeps it a step under the
 * headline, so the label still reads as subordinate to the line it introduces.
 *
 * Copy: docs/copy-home.md § 4.
 */
export function Approach() {
  return (
    <section
      id="approach"
      aria-label="Our approach"
      className="bg-brand-light relative isolate"
    >
      {/* Dark to light. The light band cuts up into the dark one instead of
          starting at a straight line — see `SectionSeam`. */}
      <SectionSeam rise="fill-brand-light" fall="fill-background" />
      <div className="section-x section-y-lg relative mx-auto max-w-7xl">
        <Reveal direction="up" amount={0.2}>
          <p className="eyebrow text-navy-800">Our Approach</p>
        </Reveal>

        {/* `block` is load-bearing, not decoration. SplitText renders
            `cn("inline", className)`, and on an inline box `max-width`,
            `margin-top` and `text-wrap: balance` are all inert — which is
            exactly what made this headline run 1107px on line one and drop
            "the walls close." onto a 370px line two. tailwind-merge drops the
            `inline` when a display utility follows it, so this one word turns
            the other three declarations back on.
            20ch caps the measure a little above the balanced line (~19ch), so
            the balancer is free to even the two lines instead of being forced
            by the container. */}
        <SplitText
          as="h2"
          by="word"
          className="display-2 text-navy-900 mt-4 block max-w-[20ch] text-balance"
        >
          The best time to plan a smart home is before the walls close.
        </SplitText>

        <Reveal direction="up" delay={0.1} amount={0.2}>
          {/* The body measure is still derived from the headline rather than
              chosen on its own — what changed is the target. It used to be
              three quarters of the headline block, which nested the body
              visibly inside it; the client wants the two right edges to line
              up instead, so the body now reaches the headline's own rag.

              Measured at 1440: the balanced H2's two lines end at x=872 and
              x=894, and the column starts at x=144. 894 − 144 = 750px. The
              lead renders at 24px, where 1ch of Geist is 15.91px, so 47ch is
              748px and lands the box 2px inside the longer headline line.
              (It was 56ch while the lead ceiling was 20px; the cap is in ch,
              so it tracks the character count and not the pixel target, and
              raising the lead to 24 pushed the same 56ch out to 891.)

              The first paragraph is the page's one scroll-linked passage. The
              reader lights the sentence as they read it, which paces the
              argument without breaking it into slides. Used once, deliberately. */}
          <div className="mt-12 flex flex-col gap-6">
            <TextRevealScroll className="lead text-navy-800 max-w-[47ch]">
              Technology is infrastructure now. It belongs in the drawings
              alongside plumbing and electrical, not added after the drywall is
              up, at three times the cost and half the result.
            </TextRevealScroll>
            <p className="lead text-navy-800 max-w-[47ch]">
              If you&rsquo;re building or renovating, bring us in while the plan
              is still on paper.
            </p>
          </div>

          <div className="mt-12">
            {/* `text-white` is not decoration: the default variant now ships a
                `text-brand-black` label, which is correct on its own orange fill
                and unreadable on this navy one. Override the fill, override the
                label. White on navy-900 measures 15.6:1. */}
            <Button
              asChild
              size="lg"
              className="bg-navy-900 hover:bg-navy-800 text-white"
            >
              <Link href="/new-construction">How We Plan</Link>
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
