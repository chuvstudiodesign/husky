import { Counter } from "@/components/motion-ui/counter";
import { Reveal } from "@/components/motion-ui/reveal";

const stats = [
  { value: 20, suffix: "+", label: "Years of integration", numeric: true },
  { display: "South Florida", label: "Service area", numeric: false },
  { value: 8, suffix: "", label: "Systems we install", numeric: true },
  { value: 5, suffix: "", label: "Partner platforms", numeric: true },
] as const;

/**
 * The credibility band. Sits directly under the hero on the same surface, separated
 * only by a hairline — so it reads as a footnote to the headline rather than as a
 * new section competing with it.
 */
export function Stats() {
  return (
    <section className="bg-background border-t">
      <div className="section-x mx-auto max-w-[1600px]">
        <dl className="grid grid-cols-2 lg:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal
              key={s.label}
              delay={i * 0.08}
              className="border-b py-10 not-last:lg:border-r even:border-l lg:even:border-l-0 lg:py-14"
            >
              <div className="px-6 lg:px-10">
                <dd
                  className={
                    s.numeric
                      ? "font-display text-4xl leading-none font-bold tracking-[-0.02em] lg:text-5xl"
                      : // The one non-numeric figure sits a step down, so a
                        // two-word value doesn't out-weigh the digits beside it.
                        "font-display text-primary text-2xl leading-none font-bold tracking-[-0.02em] lg:text-3xl"
                  }
                >
                  {s.numeric ? (
                    <Counter value={s.value} suffix={s.suffix} />
                  ) : (
                    <span>{s.display}</span>
                  )}
                </dd>
                <dt className="meta mt-4">{s.label}</dt>
              </div>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}
