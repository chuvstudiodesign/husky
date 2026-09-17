import { StickySteps } from "@/components/motion-ui/sticky-steps";
import {
  A11yNotes,
  Anatomy,
  PropsTable,
  ShowcaseHeader,
  ShowcasePage,
  ShowcaseSection,
} from "@/components/styleguide/showcase";

const steps = [
  {
    title: "Consultation",
    body: "We walk the property with you and the architect, map every room against how it will actually be lived in, and agree what the system has to do before a single cable is specified.",
  },
  {
    title: "Design",
    body: "Rack elevations, conduit runs, speaker placement and control layouts are drawn to the same tolerance as the millwork, then issued as a set your builder can hold us to.",
  },
  {
    title: "Pre-wire",
    body: "We are on site while the walls are open, pulling and terminating to spec, labelling both ends, and photographing every run so the as-built record survives the drywall.",
  },
  {
    title: "Integration",
    body: "Equipment is racked, addressed and burned in off site, then installed, tuned and programmed room by room until every scene behaves the way it was described.",
  },
  {
    title: "Handover",
    body: "You are shown the system in your own house, not in a demo suite, and we stay on call — remote monitoring, firmware, and a technician who already knows your rack.",
  },
];

export default function StickyStepsPage() {
  return (
    <ShowcasePage>
      <ShowcaseHeader
        title="Sticky Steps"
        description="A pinned readout on the left, steps scrolling past it on the right. The pin is CSS position: sticky — no ScrollTrigger, no wheel interception. Scroll this page to watch the readout advance."
        importPath={`import { StickySteps } from "@/components/motion-ui/sticky-steps"`}
      />

      <ShowcaseSection title="In use">
        <StickySteps steps={steps} />
      </ShowcaseSection>

      <ShowcaseSection title="Anatomy">
        <Anatomy parts={["StickySteps"]} />
      </ShowcaseSection>

      <ShowcaseSection title="Props">
        <PropsTable
          rows={[
            {
              name: "steps",
              type: "{ title: string; body: string }[]",
              description:
                "The steps, in order. Required. Titles carry the meaning — the number never does it alone.",
            },
            {
              name: "className",
              type: "string",
              description: "Merged onto the grid wrapper.",
            },
          ]}
        />
      </ShowcaseSection>

      <ShowcaseSection title="Implementation">
        <p className="body-text text-sm">
          The pin is native CSS. The only thing JavaScript decides is which step
          is current: one{" "}
          <code className="font-mono text-[12px]">getBoundingClientRect</code>{" "}
          pass per step, coalesced to a single{" "}
          <code className="font-mono text-[12px]">requestAnimationFrame</code>{" "}
          per scroll burst, picking the last step whose top has crossed a probe
          line at 42% of the viewport. State changes once per step, so a
          five-step section costs five renders for an entire page of scrolling.
        </p>
        <p className="body-text mt-4 text-sm">
          Below <code className="font-mono text-[12px]">lg</code> the sticky
          column is not rendered at all. A pinned panel on a 390px screen eats
          half the viewport to repeat what the list already says; the list keeps
          its inline numbers and reads as a plain numbered walkthrough.
        </p>
        <p className="body-text mt-4 text-sm">
          The dim is a colour swap between two real tokens, not an opacity fade.
          Fading an inactive step to 40% would drop its body copy under the
          4.5:1 floor for a reader who has simply not scrolled there yet.
        </p>
      </ShowcaseSection>

      <ShowcaseSection title="Accessibility">
        <A11yNotes
          notes={[
            "The steps are a real ordered list of real h3 headings, so the sequence and the structure both survive without sight of the numbers.",
            "The visible step numbers are aria-hidden — the ordered list already conveys order, and no step is identified by its number alone.",
            "The sticky readout is a restatement of the list, so it is aria-hidden rather than read twice.",
            "The dim lives behind @media (scripting: enabled). With no JavaScript every step renders at full strength, because nothing could ever un-dim it.",
            "Under prefers-reduced-motion the colour transitions collapse to an instant swap and the readout does not re-enter. The markup is identical either way — nothing branches on useReducedMotion.",
          ]}
        />
      </ShowcaseSection>
    </ShowcasePage>
  );
}
