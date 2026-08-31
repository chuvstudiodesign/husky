import { Reveal } from "@/components/motion-ui/reveal";
import {
  A11yNotes, Anatomy, Demo, PropsTable,
  ShowcaseHeader, ShowcasePage, ShowcaseSection,
} from "@/components/styleguide/showcase";

const directions = ["up", "down", "left", "right", "none"] as const;

export default function RevealPage() {
  return (
    <ShowcasePage>
      <ShowcaseHeader
        title="Reveal"
        description="Fades and lifts a block into place the first time it scrolls into view. The workhorse of the site — almost every section is wrapped in one."
        importPath={`import { Reveal } from "@/components/motion-ui/reveal"`}
      />

      <ShowcaseSection title="Directions">
        <Demo
          note="repeat is on here so the demo replays as you scroll past"
          className="block"
          code={`<Reveal direction="up" delay={0.1}>
  <p>Content</p>
</Reveal>`}
        >
          <div className="grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {directions.map((d, i) => (
              <Reveal key={d} direction={d} delay={i * 0.08} repeat>
                <div className="bg-background flex h-28 items-center justify-center rounded-lg border">
                  <span className="meta">{d}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </Demo>
      </ShowcaseSection>

      <ShowcaseSection title="Stagger">
        <Demo note="Space siblings with delay={i * 0.08}" className="block">
          <div className="flex w-full flex-col gap-3">
            {[0, 1, 2, 3].map((i) => (
              <Reveal key={i} delay={i * 0.1} repeat>
                <div className="bg-background flex h-14 items-center rounded-lg border px-5">
                  <span className="meta">delay {(i * 0.1).toFixed(1)}s</span>
                </div>
              </Reveal>
            ))}
          </div>
        </Demo>
      </ShowcaseSection>

      <ShowcaseSection title="Anatomy">
        <Anatomy parts={["Reveal"]} />
      </ShowcaseSection>

      <ShowcaseSection title="Props">
        <PropsTable
          rows={[
            { name: "direction", type: `"up" | "down" | "left" | "right" | "none"`, default: `"up"`, description: "Which way the element travels in from. none fades without moving." },
            { name: "delay", type: "number", default: "0", description: "Seconds before it starts. Use to stagger siblings." },
            { name: "duration", type: "number", default: "0.6", description: "Seconds the movement takes." },
            { name: "amount", type: "number", default: "0.15", description: "Fraction of the element that must be visible before it fires." },
            { name: "repeat", type: "boolean", default: "false", description: "Replay on every entry instead of only the first. Useful in a styleguide, rarely on a real page." },
          ]}
        />
      </ShowcaseSection>

      <ShowcaseSection title="Accessibility">
        <A11yNotes
          notes={[
            "The hidden state is gated on html.js, so with scripting unavailable the content renders visible. Nothing is lost when JS fails.",
            "Under prefers-reduced-motion the element appears immediately with no travel.",
            "The transition is pure CSS; IntersectionObserver only flips one attribute, so nothing runs on the main thread per frame.",
            "Avoid wrapping an entire page in one Reveal — if it never enters view at the configured threshold, a large region stays hidden.",
          ]}
        />
      </ShowcaseSection>
    </ShowcasePage>
  );
}
