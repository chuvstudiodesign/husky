import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  A11yNotes,
  Anatomy,
  Demo,
  PropsTable,
  ShowcaseHeader,
  ShowcasePage,
  ShowcaseSection,
} from "@/components/styleguide/showcase";

const zones = [
  {
    v: "living",
    q: "Living Room Zone",
    a: "Four in-ceiling speakers driven by channels 1–4 of the East Wing rack. Acoustic calibration runs nightly at 03:00.",
  },
  {
    v: "theater",
    q: "Master Theater",
    a: "7.1 surround with a dedicated subwoofer channel. Sources switch through the matrix on scene trigger.",
  },
  {
    v: "exterior",
    q: "Exterior & Pool",
    a: "Weather-rated landscape array. Volume is capped after 22:00 by the quiet-hours schedule.",
  },
];

export default function AccordionPage() {
  return (
    <ShowcasePage>
      <ShowcaseHeader
        title="Accordion"
        description="A vertically stacked set of interactive headings that each reveal a section of content. Built on Radix Accordion."
        importPath={`import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion"`}
      />

      <ShowcaseSection title="Single">
        <Demo
          note='type="single" collapsible'
          className="block"
          code={`<Accordion type="single" collapsible defaultValue="living">
  <AccordionItem value="living">
    <AccordionTrigger>Living Room Zone</AccordionTrigger>
    <AccordionContent>Four in-ceiling speakers…</AccordionContent>
  </AccordionItem>
</Accordion>`}
        >
          <Accordion type="single" collapsible defaultValue="living">
            {zones.map((z) => (
              <AccordionItem key={z.v} value={z.v}>
                <AccordionTrigger>{z.q}</AccordionTrigger>
                <AccordionContent>{z.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Demo>
      </ShowcaseSection>

      <ShowcaseSection title="Multiple">
        <Demo
          note='type="multiple"'
          className="block"
          code={`<Accordion type="multiple" defaultValue={["living", "theater"]}>
  …
</Accordion>`}
        >
          <Accordion type="multiple" defaultValue={["living", "theater"]}>
            {zones.map((z) => (
              <AccordionItem key={z.v} value={z.v}>
                <AccordionTrigger>{z.q}</AccordionTrigger>
                <AccordionContent>{z.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Demo>
      </ShowcaseSection>

      <ShowcaseSection title="Disabled item">
        <Demo className="block">
          <Accordion type="single" collapsible>
            <AccordionItem value="a">
              <AccordionTrigger>Available zone</AccordionTrigger>
              <AccordionContent>This item responds normally.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="b" disabled>
              <AccordionTrigger>Offline zone</AccordionTrigger>
              <AccordionContent>Unreachable.</AccordionContent>
            </AccordionItem>
          </Accordion>
        </Demo>
      </ShowcaseSection>

      <ShowcaseSection title="Anatomy">
        <Anatomy
          parts={[
            "Accordion",
            "AccordionItem",
            "AccordionTrigger",
            "AccordionContent",
          ]}
        />
      </ShowcaseSection>

      <ShowcaseSection title="Props">
        <PropsTable
          caption="Accordion"
          rows={[
            {
              name: "type",
              type: `"single" | "multiple"`,
              description:
                "Whether one or several items can be open at the same time. Required.",
            },
            {
              name: "collapsible",
              type: "boolean",
              default: "false",
              description:
                "When type is single, allows closing the open item. Ignored for multiple.",
            },
            {
              name: "defaultValue",
              type: "string | string[]",
              description:
                "Initially open item(s) when the component is uncontrolled.",
            },
            {
              name: "value",
              type: "string | string[]",
              description: "Controlled open item(s). Pair with onValueChange.",
            },
            {
              name: "onValueChange",
              type: "(value) => void",
              description: "Fires when the open item(s) change.",
            },
            {
              name: "disabled",
              type: "boolean",
              default: "false",
              description: "Disables every item in the accordion.",
            },
          ]}
        />
        <div className="mt-8">
          <PropsTable
            caption="AccordionItem"
            rows={[
              {
                name: "value",
                type: "string",
                description: "Unique identifier for the item. Required.",
              },
              {
                name: "disabled",
                type: "boolean",
                default: "false",
                description: "Prevents this item from being opened or closed.",
              },
            ]}
          />
        </div>
      </ShowcaseSection>

      <ShowcaseSection title="Accessibility">
        <A11yNotes
          notes={[
            "Follows the WAI-ARIA Accordion pattern. Triggers are rendered as buttons inside a heading.",
            "Space or Enter toggles the focused item.",
            "Arrow Up / Arrow Down move focus between triggers; Home and End jump to the first and last.",
            "Each trigger carries aria-expanded and aria-controls pointing at its panel.",
            "Disabled items are skipped by keyboard navigation.",
          ]}
        />
      </ShowcaseSection>
    </ShowcasePage>
  );
}
