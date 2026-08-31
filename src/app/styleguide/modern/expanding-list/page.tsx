import { ExpandingList } from "@/components/motion-ui/expanding-list";
import {
  A11yNotes, Anatomy, Demo, PropsTable,
  ShowcaseHeader, ShowcasePage, ShowcaseSection,
} from "@/components/styleguide/showcase";

const items = [
  { title: "Automation", summary: "The layer that ties everything together", body: "One system for lighting, climate, entertainment and security, tuned to how your household actually runs." },
  { title: "Home Cinema", summary: "A real theater, built into your home", body: "Whole-house surround, calibrated video, and AirPlay so the room is ready before anyone sits down." },
  { title: "Wi-Fi & Networking", summary: "The layer everything else depends on", body: "Every smart home is only as reliable as the network under it. We survey the house and hardwire what should never buffer." },
];

export default function ExpandingListPage() {
  return (
    <ShowcasePage>
      <ShowcaseHeader
        title="Expanding List"
        description="A numbered list whose rows open in place. The alternative — a grid of equal cards — gives every item the same weight and no way in."
        importPath={`import { ExpandingList } from "@/components/motion-ui/expanding-list"`}
      />

      <ShowcaseSection title="Default">
        <Demo note="One row open at a time" className="block">
          <ExpandingList items={items} />
        </Demo>
      </ShowcaseSection>

      <ShowcaseSection title="All closed">
        <Demo className="block">
          <ExpandingList items={items} defaultOpen={null} />
        </Demo>
      </ShowcaseSection>

      <ShowcaseSection title="Why a list">
        <p className="body-text text-sm">
          A numbered list is scannable at a glance, admits a long description
          without the layout fighting it, and reads as a specification rather than
          as marketing. For an integrator, that register is the point.
        </p>
        <p className="body-text mt-4 text-sm">
          The panel is height-animated with a{" "}
          <code className="font-mono text-[12px]">grid-template-rows: 0fr → 1fr</code>{" "}
          transition rather than a guessed max-height, so it is exact whatever the
          content length.
        </p>
      </ShowcaseSection>

      <ShowcaseSection title="Anatomy">
        <Anatomy parts={["ExpandingList"]} />
      </ShowcaseSection>

      <ShowcaseSection title="Props">
        <PropsTable
          rows={[
            { name: "items", type: "{ title, summary, body }[]", description: "The rows. Summary shows always; body is revealed." },
            { name: "defaultOpen", type: "number | null", default: "0", description: "Index open on first render. null starts all closed." },
          ]}
        />
      </ShowcaseSection>

      <ShowcaseSection title="Accessibility">
        <A11yNotes
          notes={[
            "Rows are real buttons carrying aria-expanded and aria-controls; the panel is a region labelled by its trigger.",
            "Each title sits inside an h3, so the list appears in a heading outline rather than as anonymous buttons.",
            "The plus rotates to a cross — the state is shape as well as position, not colour alone.",
            "Closed panels are still in the DOM. If you need find-in-page to reach the bodies, that is a point in this component's favour over conditional rendering.",
          ]}
        />
      </ShowcaseSection>
    </ShowcasePage>
  );
}
