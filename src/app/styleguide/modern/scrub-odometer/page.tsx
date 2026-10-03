import {
  A11yNotes,
  Anatomy,
  Demo,
  PropsTable,
  ShowcaseHeader,
  ShowcasePage,
  ShowcaseSection,
} from "@/components/styleguide/showcase";

import { OdometerDemo } from "./demo";

export default function ScrubOdometerPage() {
  return (
    <ShowcasePage>
      <ShowcaseHeader
        title="Scrub Odometer"
        description="A figure whose digits roll into place with the scroll, like a meter being read. Each digit is a 0–9 strip in a one-line mask. The server renders the final number; a scene adds the roll to its own scrubbed timeline, so it is never time-based."
        importPath={`import { ScrubOdometer, addOdometer } from "@/components/motion-ui/scrub-odometer"`}
      />

      <ShowcaseSection title="In a scrubbed scene">
        <Demo
          note="Scroll. Each figure rolls up from 0, staggered, and rolls back on the way up."
          className="block py-24"
          code={`<ScrubOdometer value="20" suffix="+" className="display-1" />

// inside useScrollScene's build:
const tl = gsap.timeline({ scrollTrigger: { trigger, start: "top 85%", end: "top 35%", scrub: SCRUB } });
els.forEach((el, i) => addOdometer(tl, el, i * 0.15, 1));`}
        >
          <OdometerDemo />
        </Demo>
      </ShowcaseSection>

      <ShowcaseSection title="Anatomy">
        <Anatomy parts={["root", "span.sr-only (value + suffix)", "cell (overflow-hidden)", "strip 0–9 (yPercent)", "suffix"]} />
      </ShowcaseSection>

      <ShowcaseSection title="Props">
        <PropsTable
          caption="ScrubOdometer"
          rows={[
            { name: "value", type: "string", description: "The final figure. Digits become strips; anything else renders as-is." },
            { name: "suffix", type: "string", description: "Static trailing text, e.g. +." },
            { name: "className", type: "string", description: "Type class, e.g. display-1. Uses tabular-nums so digits never shift." },
          ]}
        />
        <div className="mt-8">
          <PropsTable
            caption="addOdometer(tl, el, position = 0, duration = 1)"
            rows={[
              { name: "tl", type: "gsap.core.Timeline", description: "A scrubbed timeline from the calling scene." },
              { name: "el", type: "Element", description: "The odometer root, or an ancestor holding exactly one." },
              { name: "position", type: "gsap.Position", default: "0", description: "Where in the timeline the roll starts." },
              { name: "duration", type: "number", default: "1", description: "Timeline-relative length of the roll." },
            ]}
          />
        </div>
      </ShowcaseSection>

      <ShowcaseSection title="Accessibility">
        <A11yNotes
          notes={[
            "The figure is read once, from an sr-only copy. The strips are aria-hidden.",
            "Server render and reduced motion: every strip already sits on its final digit.",
            "Not a client component. It can render in a Server Component; only the scene that calls addOdometer is client-side.",
          ]}
        />
      </ShowcaseSection>
    </ShowcasePage>
  );
}
