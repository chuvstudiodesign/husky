import { FoldText } from "@/components/motion-ui/fold-text";
import {
  A11yNotes, Anatomy, Demo, PropsTable,
  ShowcaseHeader, ShowcasePage, ShowcaseSection,
} from "@/components/styleguide/showcase";

export default function FoldTextPage() {
  return (
    <ShowcasePage>
      <ShowcaseHeader
        title="Fold Text"
        description="A headline that folds into place, each word rotating up from flat. The heavier of the two headline treatments — one per page, not one per section."
        importPath={`import { FoldText } from "@/components/motion-ui/fold-text"`}
      />

      <ShowcaseSection title="Default">
        <Demo className="block">
          <p className="display-2 max-w-[16ch]">
            <FoldText stagger={0.08}>Smart homes, engineered quietly.</FoldText>
          </p>
        </Demo>
      </ShowcaseSection>

      <ShowcaseSection title="Stagger">
        <Demo className="block">
          <div className="flex w-full flex-col gap-10">
            {[0.04, 0.12].map((s) => (
              <div key={s}>
                <p className="meta mb-3">stagger {s}</p>
                <p className="display-3">
                  <FoldText stagger={s}>Intelligent home, quietly engineered</FoldText>
                </p>
              </div>
            ))}
          </div>
        </Demo>
      </ShowcaseSection>

      <ShowcaseSection title="Fold vs Split">
        <p className="body-text">
          <strong className="text-foreground">Split Text</strong> slides words up
          from behind a mask. <strong className="text-foreground">Fold Text</strong>{" "}
          rotates them around their bottom edge in 3D — the word starts lying flat,
          away from the reader, and swings upright.
        </p>
        <p className="body-text mt-4">
          The perspective lives on the wrapper rather than on each word, so the line
          shares one vanishing point and folds as a single sheet instead of as loose
          tiles. That detail is the difference between the effect looking designed
          and looking accidental.
        </p>
      </ShowcaseSection>

      <ShowcaseSection title="Anatomy">
        <Anatomy parts={["FoldText"]} />
      </ShowcaseSection>

      <ShowcaseSection title="Props">
        <PropsTable
          rows={[
            { name: "children", type: "string", description: "The headline. Plain string only." },
            { name: "stagger", type: "number", default: "0.07", description: "Seconds between each word." },
            { name: "delay", type: "number", default: "0", description: "Seconds before the first word moves." },
            { name: "as", type: `"h1" | "h2" | "h3" | "p" | "span" | "div"`, default: `"span"`, description: "Element rendered. Use the real heading level." },
          ]}
        />
      </ShowcaseSection>

      <ShowcaseSection title="Accessibility">
        <A11yNotes
          notes={[
            "The full string is the wrapper's aria-label and every word is aria-hidden, so a screen reader reads one headline rather than a list of words.",
            "The starting state is gated on html.js — without scripting the headline is readable in place.",
            "Under prefers-reduced-motion the words are upright and opaque with no transition.",
            "A 3D rotation is a strong movement. One instance per page, on the headline that matters.",
          ]}
        />
      </ShowcaseSection>
    </ShowcasePage>
  );
}
