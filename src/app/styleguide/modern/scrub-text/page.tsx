import { ScrubText } from "@/components/motion-ui/scrub-text";
import {
  A11yNotes,
  Anatomy,
  Demo,
  PropsTable,
  ShowcaseHeader,
  ShowcasePage,
  ShowcaseSection,
} from "@/components/styleguide/showcase";

export default function ScrubTextPage() {
  return (
    <ShowcasePage>
      <ShowcaseHeader
        title="Scrub Text"
        description="SplitText tied to the scrollbar rather than to a clock. Lines rise out of a mask, words brighten, or characters converge to fake tracking-in. Scroll back and it undoes itself, because the scroll position is the timeline."
        importPath={`import { ScrubText, addScrubText } from "@/components/motion-ui/scrub-text"`}
      />

      <ShowcaseSection title="In the first viewport">
        <Demo
          note="Left alone on purpose: nothing visible on load is hidden while JS arrives. Scroll for the live demos."
          className="block min-h-svh"
        >
          <ScrubText as="p" split="lines" effect="rise" className="display-2 max-w-[18ch]">
            Smart homes, engineered quietly.
          </ScrubText>
        </Demo>
      </ShowcaseSection>

      <ShowcaseSection title="Rise, by line">
        <Demo
          className="block py-24"
          code={`<ScrubText as="h2" split="lines" effect="rise" className="display-2">
  The best time to plan a smart home is before the walls close.
</ScrubText>`}
        >
          <ScrubText as="p" split="lines" effect="rise" className="display-2 max-w-[18ch]">
            The best time to plan a smart home is before the walls close.
          </ScrubText>
        </Demo>
      </ShowcaseSection>

      <ShowcaseSection title="Light, by word">
        <Demo
          className="block py-24"
          code={`<ScrubText split="words" effect="light" className="lead">…</ScrubText>`}
        >
          <ScrubText split="words" effect="light" className="lead max-w-[40ch]">
            Technology is infrastructure now. It belongs in the drawings alongside plumbing and electrical — not added after the drywall is up, at three times the cost and half the result.
          </ScrubText>
        </Demo>
      </ShowcaseSection>

      <ShowcaseSection title="Spread, by character">
        <Demo
          note="Tracking-in, faked with per-character x. letter-spacing is never animated."
          className="block py-24"
          code={`<ScrubText split="chars" effect="spread" className="display-1">Low Voltage</ScrubText>`}
        >
          <ScrubText split="chars" effect="spread" className="display-1">
            Engineered quietly.
          </ScrubText>
        </Demo>
      </ShowcaseSection>

      <ShowcaseSection title="Inside a pinned scene">
        <Demo
          className="block"
          code={`// Option A — imperative, inside the scene's own build:
useScrollScene(ref, {
  desktop: () => {
    const tl = gsap.timeline({ scrollTrigger: { trigger: ref.current, pin: true, scrub: SCRUB, end: "+=150%" } });
    addScrubText(tl, headingRef.current!, { split: "lines", effect: "rise" }, 0);
  },
});

// Option B — declarative: pass the scene's timeline once it exists.
// null means "a timeline is coming" — render static and wait.
<ScrubText as="h2" timeline={tl /* state, null until built */} position={0.2}>…</ScrubText>`}
        >
          <p className="body-text text-muted-foreground">
            In timeline mode ScrubText adds its tweens to the parent instead of owning a
            trigger, so a pinned scene can sequence it.
          </p>
        </Demo>
      </ShowcaseSection>

      <ShowcaseSection title="Anatomy">
        <Anatomy parts={["Tag", "span.sr-only (plain string)", "span[aria-hidden] (split copy)"]} />
      </ShowcaseSection>

      <ShowcaseSection title="Props">
        <PropsTable
          rows={[
            { name: "as", type: "\"h1\"…\"h6\" | \"p\" | \"span\" | \"div\"", default: "\"p\"", description: "Element rendered. Keep heading levels in order." },
            { name: "split", type: "\"lines\" | \"words\" | \"chars\"", default: "\"lines\"", description: "Unit that animates. Words and chars keep natural wrapping." },
            { name: "effect", type: "\"rise\" | \"light\" | \"spread\"", default: "\"rise\"", description: "rise: yPercent 100 → 0 in a mask, stagger 0.08. light: opacity 0.16 → 1, stagger 0.08. spread: x from ±(offset × 0.06em) and opacity 0 → 1." },
            { name: "start", type: "string", default: "\"top 80%\"", description: "ScrollTrigger start, own-trigger mode." },
            { name: "end", type: "string", default: "\"top 30%\"", description: "ScrollTrigger end, own-trigger mode." },
            { name: "trigger", type: "RefObject<HTMLElement>", description: "Element whose position drives the scrub. Defaults to the text." },
            { name: "timeline", type: "gsap.core.Timeline | null", description: "Add tweens to this timeline instead of owning a trigger. null = wait for it." },
            { name: "position", type: "gsap.Position", description: "Position within timeline." },
            { name: "children", type: "string", description: "Plain string only." },
          ]}
        />
      </ShowcaseSection>

      <ShowcaseSection title="Accessibility">
        <A11yNotes
          notes={[
            "The plain string is rendered once in an sr-only node; the split copy is aria-hidden, so the heading is announced as a sentence, never letter by letter.",
            "Server render and reduced motion show the plain final text. No branch runs, so no before state is ever set.",
            "In own-trigger mode, text that sits inside the first viewport is left alone. Hero type should be sequenced by its scene's timeline instead.",
            "Every tween is ease: \"none\" with SCRUB smoothing, so motion stays linear to scroll.",
          ]}
        />
      </ShowcaseSection>
    </ShowcasePage>
  );
}
