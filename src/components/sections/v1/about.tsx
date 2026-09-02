import { Reveal } from "@/components/motion-ui/reveal";

/**
 * Key facts, rendered as information design rather than decoration.
 *
 * There is no project photography yet, so the second column has to carry its weight
 * on content alone: a mono label and a value, grouped by space.
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
 * Sits on `--background`, like every full-width band on the site bar the light
 * interlude and the orange close. The facts panel rises to `bg-card` — the one
 * elevated surface in the section, and the only thing that separates it from the
 * page is its own fill. Page backdrop → card is two levels, which is what the
 * surface rule allows.
 *
 * Nothing here is pinned any more. The band is theme-reactive again, so the type
 * goes back to semantic tokens: `--foreground` for the heading, the `.body-text`
 * default for the prose.
 */
export function About() {
  return (
    <section
      id="about"
      aria-labelledby="about-title"
      className="bg-background"
    >
      <div className="section-x section-y mx-auto max-w-7xl">
        {/* 1.25 / 0.75, not 1 / 1. Two reasons, and they point the same way:
            the editorial column carries three times the content of the facts
            panel, and the lead's ceiling moved to 24px, which at an even split
            pushed the first paragraph from three rendered lines to four. 680px
            of text column puts it back at three without cutting a fact out of
            the copy — the alternative was trimming the specialty list, and the
            list is the point of the paragraph. */}
        <div className="grid items-stretch gap-16 lg:grid-cols-[1.25fr_0.75fr]">
          <Reveal>
            {/* No `text-primary`: `.eyebrow` already resolves to `--primary`
                in the dark theme. The override was left over from when this
                band was navy and is dead weight now. */}
            <p className="eyebrow">Who we are</p>
            <h2 id="about-title" className="display-2 mt-6 max-w-xl">
              A luxury technology integrator, based in Boca Raton.
            </h2>
            {/* Two paragraphs, three rendered lines each at 1440 — the pair
                reads as two even blocks rather than as a 4/2/3 stagger. Every
                fact from the three it replaces survives: the specialty list,
                the tenure, the territory, the client type, the platform churn,
                and the enterprise networking. [VERIFY: "over 20 years" — the
                figure is carried over from the existing site, not new.] */}
            {/* No cap on the wrapper any more. A single `54ch` here was fine
                while both paragraphs were 16px, but they are two sizes now and
                one cap in the parent's font means two different measures in the
                children's. Each paragraph carries its own, in its own ch. */}
            <div className="mt-8 space-y-6">
              {/* First paragraph is `.lead`, because it is the one directly
                  under the heading and the page holds a single register there.
                  The second drops to `.body-text`, the register every deeper
                  paragraph on the site uses.

                  Length is measured, not guessed. The column is 544px at 1440
                  (half of the 1088px grid), which at 20px holds about 60
                  characters a line, so three lines is roughly a 155-character
                  budget — 163 already spilled to four. Every fact from the
                  three paragraphs this replaces is still here; what went is the
                  connective tissue, and the heading directly above supplies the
                  subject this line reads off. */}
              <p className="lead max-w-[43ch]">
                Smart home technology, commercial control and automation, Wi-Fi,
                cinema and audio/video for high-end South Florida homes and
                businesses, for over 20 years.
              </p>
              <p className="body-text max-w-[54ch]">
                The platforms change every year, and staying current is the job.
                Our work makes a home safe, elegant, and genuinely easy to use,
                with the same enterprise-grade networking that runs a business
                running the house.
              </p>
            </div>
          </Reveal>

          {/* h-full + flex-1 rows: the panel stretches to the full height of the
              editorial column beside it and distributes the five facts evenly,
              instead of ending short and leaving the grid looking broken. */}
          {/* No outer border and no `divide-y`. The panel is read as a panel
              because it is filled, not because it is outlined, and the five rows
              are read as five rows because of the air between them. Row padding
              went 24/28 → 24/32 when the rules came out: with a hairline doing
              the separating, 28px of half-gap was enough; without one, the gap
              itself is the grouping, so it steps up to a full 8-grid magnitude
              and the panel's internal rhythm is 24px at the phone and 32px from
              md. */}
          <Reveal delay={0.12} className="h-full">
            <dl className="bg-card flex h-full flex-col rounded-lg">
              {FACTS.map((fact) => (
                <div
                  key={fact.label}
                  className="flex flex-1 flex-col justify-center gap-2 px-6 py-6 sm:flex-row sm:items-center sm:justify-between sm:gap-10 md:px-8 md:py-8"
                >
                  {/* `.meta` ships at 75% muted, which measures 4.36:1 at 11px.
                      Restoring full `--muted-foreground` puts it at 7.03:1. */}
                  <dt className="meta text-muted-foreground shrink-0">
                    {fact.label}
                  </dt>
                  {/* `.display-3` ships at 1.2 leading, which is right for a
                      one-line panel title and wrong for the two values that
                      wrap: at 20px it puts consecutive baselines 24px apart and
                      the descenders of one line nearly touch the ascenders of
                      the next. 1.4 opens it to 28px — `leading-snug` (1.375)
                      gave 27.5, the last off-grid line-height on the site. */}
                  <dd className="display-3 text-balance leading-[1.4] sm:max-w-[62%] sm:text-right">
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
