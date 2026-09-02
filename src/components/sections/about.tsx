import { Reveal } from "@/components/motion-ui/reveal";
import { SectionSeam } from "@/components/sections/section-seam";

/**
 * Key facts, rendered as information design rather than decoration.
 *
 * There is no project photography yet, so the second column has to carry its weight
 * on content alone: a mono label and a value, grouped by space.
 */
const FACTS = [
  { label: "Experience", value: "20+ years of integration" },
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
      className="bg-background relative"
    >
      {/* Light back to dark: the return half of the pair that opened the
          Approach band directly above, so the light interlude is bracketed by
          the same joint at both ends — see `SectionSeam`. */}
      <SectionSeam rise="fill-background" fall="fill-brand-light" />
      <div className="section-x section-y mx-auto max-w-7xl">
        {/* 1.25 / 0.75, not 1 / 1. Two reasons, and they point the same way:
            the editorial column carries three times the content of the facts
            panel, and the lead's ceiling moved to 24px, which at an even split
            pushed the first paragraph from three rendered lines to four. 680px
            of text column puts it back at three without cutting a fact out of
            the copy — the alternative was trimming the specialty list, and the
            list is the point of the paragraph. */}
        {/* The 1.25/0.75 split is a 1280-and-up ratio and it collapses at the
            breakpoint that introduces it. At 1024 it hands the panel 322px, the
            value column inside it is capped at 62% of 256, and every fact wraps:
            "High-end residential & commercial" over three ragged right-aligned
            lines, the platform list over four. The panel grows to 656px against
            410px of editorial copy, so the section lists hard to the right with
            a quarter-screen void under the prose.

            1.1/1 through the `lg` band puts the panel back at ~410px — the
            width it has at 1440 — so the values wrap the way they were designed
            to and the two columns come out within ~60px of each other. The
            heading takes a fourth line at 450px, which is the trade and the
            cheap side of it. `xl` restores the shipped ratio, so 1280 and 1440
            are untouched. */}
        <div className="grid items-stretch gap-16 lg:grid-cols-[1.1fr_1fr] xl:grid-cols-[1.25fr_0.75fr]">
          <Reveal>
            {/* No `text-primary`: `.eyebrow` already resolves to `--primary`
                in the dark theme. The override was left over from when this
                band was navy and is dead weight now. */}
            <p className="eyebrow">Who we are</p>
            <h2 id="about-title" className="display-2 mt-6 max-w-xl">
              A luxury technology integrator, based in Boca Raton.
            </h2>
            {/* Two paragraphs, both `.lead` on the same 43ch measure, so the
                pair reads as one block with one wrap width — about three lines
                for the first at 1440, about four for the second. Every
                fact from the three it replaces survives: the specialty list,
                the tenure, the territory, the client type, the platform churn,
                and the enterprise networking. [VERIFY: "over 20 years" — the
                figure is carried over from the existing site, not new.] */}
            {/* No cap on the wrapper. The wrapper's font is 16px and the
                paragraphs render at 20px on the desktop, so a ch cap set here
                would be measured in the wrong font. Each paragraph carries its
                own, in its own ch. */}
            <div className="mt-8 space-y-6">
              {/* Both paragraphs are `.lead` (client, 2026-09-02: the second
                  must carry the same weight as the first). Elsewhere on the
                  site the deeper paragraph drops to `.body-text`; this pair is
                  the one place it doesn't.

                  The column is 544px at 1440 (half of the 1088px grid), which
                  at 20px holds about 60 characters a line, so three lines is
                  roughly a 155-character budget and the first paragraph is
                  written to it. Every fact from the three paragraphs this
                  replaces is still here; what went is the connective
                  tissue. */}
              <p className="lead max-w-[43ch]">
                For over 20 years we’ve built smart home, commercial control,
                Wi-Fi, cinema and audio/video systems for high-end South Florida
                homes and businesses.
              </p>
              <p className="lead max-w-[43ch]">
                The platforms change every year, and staying current is the job.
                Our work makes a home safe, elegant, and genuinely easy to use,
                with the same enterprise-grade networking a business runs on.
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
