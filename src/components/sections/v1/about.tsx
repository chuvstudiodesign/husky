import { Reveal } from "@/components/motion-ui/reveal";

/**
 * Key facts, rendered as information design rather than decoration.
 *
 * There is no project photography yet, so the second column has to carry its weight
 * on content alone: a mono label, a value, and a hairline between them.
 */
const FACTS = [
  { label: "Founded", value: "20+ years of integration" },
  { label: "Based in", value: "Boca Raton, Florida" },
  { label: "Serving", value: "South Florida" },
  { label: "Focus", value: "High-end residential & commercial" },
  { label: "Platforms", value: "Cisco, Araknis, Ubiquiti, CommScope, Sonos" },
] as const;

/**
 * About — editorial split. The story on the left, verifiable facts on the right.
 *
 * Sits on `bg-card`; the facts panel drops back to `bg-background` so it separates
 * from the section without nesting a card inside a card.
 */
export function About() {
  return (
    <section
      id="about"
      aria-labelledby="about-title"
      className="bg-card text-card-foreground"
    >
      <div className="section-x section-y mx-auto max-w-7xl">
        <div className="grid items-stretch gap-16 lg:grid-cols-2">
          <Reveal>
            <p className="eyebrow">Who we are</p>
            <h2 id="about-title" className="display-2 mt-6 max-w-xl">
              A luxury technology integrator, based in Boca Raton.
            </h2>
            <div className="mt-8 max-w-[54ch] space-y-6">
              <p className="body-text max-w-none">
                We specialize in smart home technology, commercial control and
                automation, Wi-Fi, home cinema and audio/video distribution. For over
                20 years we’ve worked with high-end residential and commercial clients
                across South Florida.
              </p>
              <p className="body-text max-w-none">
                Training and continual improvement are part of our DNA, the platforms
                change every year, and staying current is the job.
              </p>
              <p className="body-text max-w-none">
                Our work makes a home safe, elegant, and genuinely easy to use. For
                home offices, the same enterprise-grade networking that runs a business
                runs the house.
              </p>
            </div>
          </Reveal>

          {/* h-full + flex-1 rows: the panel stretches to the full height of the
              editorial column beside it and distributes the five facts evenly,
              instead of ending short and leaving the grid looking broken. */}
          <Reveal delay={0.12} className="h-full">
            <dl className="border-border bg-background divide-border flex h-full flex-col divide-y rounded-lg border">
              {FACTS.map((fact) => (
                <div
                  key={fact.label}
                  className="flex flex-1 flex-col justify-center gap-2 px-6 py-6 sm:flex-row sm:items-center sm:justify-between sm:gap-10 md:px-8 md:py-7"
                >
                  {/* `.meta` ships at 75% muted, which measures 4.36:1 at 11px.
                      Restoring full `--muted-foreground` puts it at 7.03:1. */}
                  <dt className="meta text-muted-foreground shrink-0">
                    {fact.label}
                  </dt>
                  <dd className="display-3 text-balance sm:max-w-[62%] sm:text-right">
                    {fact.value}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
