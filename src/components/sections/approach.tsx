import Link from "next/link";

import { Reveal } from "@/components/motion-ui/reveal";
import { SplitText } from "@/components/motion-ui/split-text";
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
 * are all tuned for #090A0F. Type is set in brand navy instead:
 *   navy-900 on #DFDFDF … 12.5:1   (headline and body)
 *   husky-600 on #DFDFDF … 3.8:1   (eyebrow, large-label use only)
 *
 * Copy: docs/copy-home.md § 4.
 */
export function Approach() {
  return (
    <section
      id="approach"
      aria-label="Our approach"
      className="relative isolate"
      style={{ background: "var(--brand-light)" }}
    >
      <div className="section-x section-y-lg relative mx-auto max-w-7xl">
        <Reveal direction="up" amount={0.2}>
          <p className="eyebrow text-[color:var(--husky-700)]">Our Approach</p>
        </Reveal>

        <SplitText
          as="h2"
          by="word"
          className="display-2 mt-6 max-w-[18ch] text-balance text-[color:var(--navy-900)] md:text-6xl lg:text-7xl"
        >
          The best time to plan a smart home is before the walls close.
        </SplitText>

        <Reveal direction="up" delay={0.1} amount={0.2}>
          {/* 66ch rather than the class default — at the narrower measure
              "paper" fell alone onto the last line. */}
          <div className="mt-10 flex max-w-[66ch] flex-col gap-6">
            <p className="lead max-w-none text-[color:var(--navy-800)]">
              Technology is infrastructure now. It belongs in the drawings
              alongside plumbing and electrical, not added after the drywall is
              up, at three times the cost and half the result.
            </p>
            <p className="lead max-w-none text-[color:var(--navy-800)]">
              If you&rsquo;re building or renovating, bring us in while the plan
              is still on paper.
            </p>
          </div>

          <div className="mt-12">
            <Button
              asChild
              size="lg"
              className="h-11 bg-[color:var(--navy-900)] px-6 text-white hover:bg-[color:var(--navy-800)] dark:bg-[color:var(--navy-900)] dark:hover:bg-[color:var(--navy-800)]"
            >
              <Link href="/new-construction">Read How We Plan a Build</Link>
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
