import { SplitText } from "@/components/motion-ui/split-text";
import {
  A11yNotes, Anatomy, Demo, PropsTable,
  ShowcaseHeader, ShowcasePage, ShowcaseSection,
} from "@/components/styleguide/showcase";

export default function SplitTextPage() {
  return (
    <ShowcasePage>
      <ShowcaseHeader
        title="Split Text"
        description="Reveals a headline unit by unit as it scrolls into view, each word rising from behind a mask. Reserved for display type — it is the site's loudest motion and loses its effect if used everywhere."
        importPath={`import { SplitText } from "@/components/motion-ui/split-text"`}
      />

      <ShowcaseSection title="By word">
        <Demo
          className="block"
          code={`<SplitText by="word" stagger={0.05} as="h2">
  Every decision gets more expensive
</SplitText>`}
        >
          <p className="display-2 max-w-[16ch]">
            <SplitText by="word" stagger={0.06}>
              Smart homes, engineered quietly.
            </SplitText>
          </p>
        </Demo>
      </ShowcaseSection>

      <ShowcaseSection title="By character">
        <Demo
          note="Heavier. Use for short strings only."
          className="block"
          code={`<SplitText by="char" stagger={0.02}>HUSKY</SplitText>`}
        >
          <p className="display-2">
            <SplitText by="char" stagger={0.03}>
              INTELLIGENT HOME
            </SplitText>
          </p>
        </Demo>
      </ShowcaseSection>

      <ShowcaseSection title="Anatomy">
        <Anatomy parts={["SplitText"]} />
      </ShowcaseSection>

      <ShowcaseSection title="Props">
        <PropsTable
          rows={[
            { name: "children", type: "string", description: "The text. Must be a plain string — the component splits it, so it cannot take nodes." },
            { name: "by", type: `"word" | "char"`, default: `"word"`, description: "Split granularity. Characters produce many more elements; keep those strings short." },
            { name: "stagger", type: "number", default: "0.05", description: "Seconds between each unit." },
            { name: "delay", type: "number", default: "0", description: "Seconds before the first unit moves." },
            { name: "as", type: `"h1" | "h2" | "h3" | "p" | "span" | "div"`, default: `"span"`, description: "Element rendered. Use the real heading level — this is display text, not decoration." },
          ]}
        />
      </ShowcaseSection>

      <ShowcaseSection title="Accessibility">
        <A11yNotes
          notes={[
            "The full string is set as aria-label on the wrapper and every fragment is aria-hidden, so a screen reader reads one sentence rather than a stream of disconnected words.",
            "As with Reveal, the hidden state is gated on html.js — the headline is readable without scripting.",
            "Under prefers-reduced-motion the whole line appears at once.",
            "Because it renders one span per unit, do not use it on body copy. A paragraph would produce hundreds of elements for no benefit.",
          ]}
        />
      </ShowcaseSection>
    </ShowcasePage>
  );
}
