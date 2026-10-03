import { SpotlightFrame } from "@/components/motion-ui/spotlight-frame";
import {
  A11yNotes,
  Anatomy,
  Demo,
  PropsTable,
  ShowcaseHeader,
  ShowcasePage,
  ShowcaseSection,
} from "@/components/styleguide/showcase";

const PLATES = [
  { name: "Home Cinema", body: "A real theater, built into your home." },
  { name: "Multi Room Audio", body: "Music in one room, or every room at once." },
];

export default function SpotlightFramePage() {
  return (
    <ShowcasePage>
      <ShowcaseHeader
        title="Spotlight Frame"
        description="A 1px frame whose border catches orange near the cursor, as if a live wire ran around the plate. Only the border lights; the surface stays put. Position is written to CSS custom properties, never React state."
        importPath={`import { SpotlightFrame } from "@/components/motion-ui/spotlight-frame"`}
      />

      <ShowcaseSection title="Plates">
        <Demo
          note="Move the pointer along the edges."
          className="grid grid-cols-1 gap-6 bg-background md:grid-cols-2"
          code={`<SpotlightFrame innerClassName="p-8">
  <h4 className="display-3">Home Cinema</h4>
  <p className="body-text text-muted-foreground">…</p>
</SpotlightFrame>`}
        >
          {PLATES.map((p) => (
            <SpotlightFrame key={p.name} innerClassName="flex flex-col gap-4 p-8">
              <p className="display-3">{p.name}</p>
              <p className="body-text text-muted-foreground">{p.body}</p>
            </SpotlightFrame>
          ))}
        </Demo>
      </ShowcaseSection>

      <ShowcaseSection title="Anatomy">
        <Anatomy parts={["frame (bg-border, p-px, 4px)", "overlay[aria-hidden] (radial primary)", "inset surface (bg-card, 3px)"]} />
      </ShowcaseSection>

      <ShowcaseSection title="Props">
        <PropsTable
          rows={[
            { name: "className", type: "string", description: "Outer frame: sizing, layout." },
            { name: "innerClassName", type: "string", default: "bg-card", description: "Inset surface. Override the fill if the frame sits on a card (two surface levels max)." },
            { name: "children", type: "ReactNode", description: "Content of the plate." },
          ]}
        />
      </ShowcaseSection>

      <ShowcaseSection title="Accessibility">
        <A11yNotes
          notes={[
            "Decorative. At rest, on touch and with no pointer, it is a plain 1px border.",
            "Off on (hover: none): no listener is attached and the overlay never shows.",
            "The 4px outer radius and 3px inset radius keep the corners concentric across the 1px gap.",
          ]}
        />
      </ShowcaseSection>
    </ShowcasePage>
  );
}
