import {
  A11yNotes, Anatomy, PropsTable,
  ShowcaseHeader, ShowcasePage, ShowcaseSection,
} from "@/components/styleguide/showcase";

export default function SectionIndexPage() {
  return (
    <ShowcasePage>
      <ShowcaseHeader
        title="Section Index"
        description="A scroll-spy index: a list of sections that marks which one is being read. Used in the fixed rail on /site-2."
        importPath={`import { SectionIndex } from "@/components/motion-ui/section-index"`}
      />

      <ShowcaseSection title="How the active row is chosen">
        <p className="body-text text-sm">
          By which section covers a probe line a third of the way down the
          viewport — not by whichever is &ldquo;most visible&rdquo;.
        </p>
        <p className="body-text mt-4 text-sm">
          That difference matters on a page with sections of wildly different
          heights. Scored by visible area, a short section between two tall ones
          would never win, and the index would skip it entirely. A probe line has
          no such bias: whatever is under it is what you are reading.
        </p>
        <p className="body-text mt-4 text-sm">
          See it working in the left rail on{" "}
          <code className="font-mono text-[12px]">/site-2</code>.
        </p>
      </ShowcaseSection>

      <ShowcaseSection title="The active marker">
        <p className="body-text text-sm">
          The active row takes the accent on its number, brightens its label, and
          grows a short rule to the right. Three signals, none of them colour
          alone — the rule alone would carry it in greyscale.
        </p>
      </ShowcaseSection>

      <ShowcaseSection title="Anatomy">
        <Anatomy parts={["SectionIndex"]} />
      </ShowcaseSection>

      <ShowcaseSection title="Props">
        <PropsTable
          rows={[
            { name: "items", type: "{ id, label }[]", description: "The sections, in document order. Each id must match a real element id on the page." },
          ]}
        />
      </ShowcaseSection>

      <ShowcaseSection title="Accessibility">
        <A11yNotes
          notes={[
            "A real nav landmark with an ordered list of real anchors, so it works with scripting off and is reachable from a landmark list.",
            "The active row carries aria-current, so assistive technology reports position rather than leaving it as a visual-only cue.",
            "Scroll reads are coalesced to one per frame with requestAnimationFrame — scroll fires far faster than paint, and without that it would run getBoundingClientRect dozens of times per frame.",
            "It reflects position; it never controls it. Anchors do the navigating, so keyboard and no-JS behaviour are unchanged.",
          ]}
        />
      </ShowcaseSection>
    </ShowcasePage>
  );
}
