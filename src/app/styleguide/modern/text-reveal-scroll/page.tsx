import { TextRevealScroll } from "@/components/motion-ui/text-reveal-scroll";
import {
  A11yNotes, Anatomy, Demo, PropsTable,
  ShowcaseHeader, ShowcasePage, ShowcaseSection,
} from "@/components/styleguide/showcase";

export default function TextRevealScrollPage() {
  return (
    <ShowcasePage>
      <ShowcaseHeader
        title="Text Reveal Scroll"
        description="A passage that brightens word by word as it is scrolled through. Scroll-linked, not triggered: the reader's position drives it directly, so scrolling back up dims the words again."
        importPath={`import { TextRevealScroll } from "@/components/motion-ui/text-reveal-scroll"`}
      />

      <ShowcaseSection title="Default">
        <Demo note="Scroll slowly through the passage" className="block">
          <TextRevealScroll className="display-3 max-w-[40ch] leading-relaxed">
            Technology is infrastructure now. It belongs in the drawings alongside
            plumbing and electrical, not added after the drywall is up, at three
            times the cost and half the result.
          </TextRevealScroll>
        </Demo>
      </ShowcaseSection>

      <ShowcaseSection title="Starting opacity">
        <Demo className="block">
          <div className="flex w-full flex-col gap-12">
            {[0.05, 0.15, 0.35].map((f) => (
              <div key={f}>
                <p className="meta mb-4">from {f}</p>
                <TextRevealScroll from={f} className="body-text max-w-[46ch]">
                  Every smart home is only as reliable as the network under it.
                </TextRevealScroll>
              </div>
            ))}
          </div>
        </Demo>
      </ShowcaseSection>

      <ShowcaseSection title="Use it once">
        <p className="body-text">
          The coupling to scroll position is the whole effect: it makes the reader
          feel like they are lighting the sentence as they read it, and it paces a
          long statement without breaking it into slides. Used on more than one
          passage per page, the device stops being a moment and becomes a tic.
        </p>
      </ShowcaseSection>

      <ShowcaseSection title="Anatomy">
        <Anatomy parts={["TextRevealScroll"]} />
      </ShowcaseSection>

      <ShowcaseSection title="Props">
        <PropsTable
          rows={[
            { name: "children", type: "string", description: "The passage. Must be a plain string — the component splits it on spaces." },
            { name: "from", type: "number", default: "0.15", description: "Opacity of a word before it is reached. Below ~0.1 the passage reads as missing rather than dim." },
          ]}
        />
      </ShowcaseSection>

      <ShowcaseSection title="Accessibility">
        <A11yNotes
          notes={[
            "The text stays a normal string in the DOM, so it is selectable, searchable and read as one sentence.",
            "Under prefers-reduced-motion the component renders a plain paragraph at full opacity — no splitting, no motion values.",
            "Dimmed words fall below contrast minimums while unreached. That is acceptable here because the state is transient and driven by the reader, but do not use this for anything someone might need to read out of order.",
            "Keep passages short. A long block means most of it sits dim while the reader is at one end.",
          ]}
        />
      </ShowcaseSection>
    </ShowcasePage>
  );
}
