import { Counter } from "@/components/motion-ui/counter";
import {
  A11yNotes, Anatomy, Demo, PropsTable,
  ShowcaseHeader, ShowcasePage, ShowcaseSection,
} from "@/components/styleguide/showcase";

export default function CounterPage() {
  return (
    <ShowcasePage>
      <ShowcaseHeader
        title="Counter"
        description="Counts up to a figure when it scrolls into view, easing out so it decelerates into the landing rather than stopping dead. Used in the home page credibility band."
        importPath={`import { Counter } from "@/components/motion-ui/counter"`}
      />

      <ShowcaseSection title="Variants">
        <Demo code={`<Counter value={20} suffix="+" />`}>
          <div className="grid w-full gap-10 sm:grid-cols-3">
            {[
              { v: 20, suffix: "+", label: "suffix" },
              { v: 98.6, decimals: 1, suffix: "%", label: "decimals" },
              { v: 5, label: "plain" },
            ].map((c) => (
              <div key={c.label}>
                <p className="font-display text-5xl leading-none font-bold tracking-[-0.02em]">
                  <Counter value={c.v} suffix={c.suffix} decimals={c.decimals} />
                </p>
                <p className="meta mt-3">{c.label}</p>
              </div>
            ))}
          </div>
        </Demo>
      </ShowcaseSection>

      <ShowcaseSection title="Anatomy">
        <Anatomy parts={["Counter"]} />
      </ShowcaseSection>

      <ShowcaseSection title="Props">
        <PropsTable
          rows={[
            { name: "value", type: "number", description: "The number to land on. Required." },
            { name: "duration", type: "number", default: "1.6", description: "Seconds the count takes." },
            { name: "prefix", type: "string", default: `""`, description: "Rendered before the number." },
            { name: "suffix", type: "string", default: `""`, description: "Rendered after the number, e.g. + or %." },
            { name: "decimals", type: "number", default: "0", description: "Decimal places shown throughout the count." },
          ]}
        />
      </ShowcaseSection>

      <ShowcaseSection title="Implementation">
        <p className="body-text">
          The running number is written straight to{" "}
          <code className="font-mono text-[12px]">textContent</code> rather than
          held in React state. A 60fps counter driving 90-plus renders would be
          pure waste; this keeps it out of React&apos;s update path entirely.
        </p>
        <p className="body-text mt-4">
          It also only winds back to zero for a counter the viewer has not
          reached. One already on screen at mount keeps its server-rendered
          value — resetting it would replace a correct number with a wrong one,
          and if the observer never fired it would stay wrong.
        </p>
      </ShowcaseSection>

      <ShowcaseSection title="Accessibility">
        <A11yNotes
          notes={[
            "The element carries the finished value as its aria-label and the animating span is aria-hidden, so assistive technology reads the result and never a moving number.",
            "The final value is server-rendered, so it is correct before hydration and correct with JavaScript disabled.",
            "Under prefers-reduced-motion the value is simply present, with no count.",
            "Only use it for figures that are genuinely true. An animated number draws attention to itself and invites scrutiny.",
          ]}
        />
      </ShowcaseSection>
    </ShowcasePage>
  );
}
