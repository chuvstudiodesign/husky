import { RollText } from "@/components/motion-ui/roll-text";
import { Button } from "@/components/ui/button";
import {
  A11yNotes,
  Anatomy,
  Demo,
  PropsTable,
  ShowcaseHeader,
  ShowcasePage,
  ShowcaseSection,
} from "@/components/styleguide/showcase";

export default function RollTextPage() {
  return (
    <ShowcasePage>
      <ShowcaseHeader
        title="Roll Text"
        description="A hover label that rolls: the text is drawn twice in a one-line mask and both copies lift by one line, staggered 12ms per character over 300ms. Pure CSS, so it costs nothing until hovered and runs in a Server Component."
        importPath={`import { RollText } from "@/components/motion-ui/roll-text"`}
      />

      <ShowcaseSection title="On a link and a button">
        <Demo
          note="Hover, or tab to focus."
          code={`<a className="group …"><RollText>See What We Do</RollText></a>

<Button asChild><a className="group"><RollText>Request a Consultation</RollText></a></Button>`}
        >
          <a href="#" className="group nav-text text-foreground focus-visible:outline-none">
            <RollText>See What We Do</RollText>
          </a>
          <Button asChild>
            <a href="#" className="group">
              <RollText>Request a Consultation</RollText>
            </a>
          </Button>
        </Demo>
      </ShowcaseSection>

      <ShowcaseSection title="Mono label">
        <Demo code={`<RollText className="eyebrow">Talk Through Your Project</RollText>`}>
          <RollText className="eyebrow">Talk Through Your Project</RollText>
        </Demo>
      </ShowcaseSection>

      <ShowcaseSection title="Anatomy">
        <Anatomy parts={["root.group/roll (mask)", "span.sr-only", "copy 1[aria-hidden]", "copy 2[aria-hidden] (top: 100%)", "char (--i)"]} />
      </ShowcaseSection>

      <ShowcaseSection title="Props">
        <PropsTable
          rows={[
            { name: "as", type: "\"span\" | \"div\" | \"p\"", default: "\"span\"", description: "Element rendered." },
            { name: "children", type: "string", description: "The label. Plain string only." },
            { name: "className", type: "string", description: "Type class for the label." },
          ]}
        />
      </ShowcaseSection>

      <ShowcaseSection title="Accessibility">
        <A11yNotes
          notes={[
            "The label is announced once, from an sr-only copy. Both visual copies are aria-hidden, so per-character spans are never read letter by letter.",
            "Triggers on its own hover, on any ancestor with the group class, and on group focus-visible, so keyboard users see the same roll.",
            "Reduced motion: no roll, the label stays put.",
          ]}
        />
      </ShowcaseSection>
    </ShowcasePage>
  );
}
