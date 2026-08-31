import { SpotlightCard } from "@/components/motion-ui/spotlight-card";
import {
  A11yNotes, Anatomy, Demo, PropsTable,
  ShowcaseHeader, ShowcasePage, ShowcaseSection,
} from "@/components/styleguide/showcase";

export default function SpotlightCardPage() {
  return (
    <ShowcasePage>
      <ShowcaseHeader
        title="Spotlight Card"
        description="A panel whose surface and border catch a soft highlight tracking the cursor. Used for the service tiles. Hover one to see it."
        importPath={`import { SpotlightCard } from "@/components/motion-ui/spotlight-card"`}
      />

      <ShowcaseSection title="Intensity">
        <Demo note="Move the pointer across each card" className="block">
          <div className="grid w-full gap-4 md:grid-cols-3">
            {[0.06, 0.1, 0.18].map((n) => (
              <SpotlightCard key={n} intensity={n} className="bg-background p-8">
                <p className="display-3">Living Room Zone</p>
                <p className="body-text mt-3 text-sm">
                  Four in-ceiling speakers driven by channels 1–4.
                </p>
                <p className="meta mt-6">intensity {n}</p>
              </SpotlightCard>
            ))}
          </div>
        </Demo>
      </ShowcaseSection>

      <ShowcaseSection title="Radius of the highlight">
        <Demo className="block">
          <div className="grid w-full gap-4 md:grid-cols-2">
            {[220, 600].map((s) => (
              <SpotlightCard key={s} size={s} className="bg-background p-8">
                <p className="display-3">Master Theater</p>
                <p className="meta mt-6">size {s}px</p>
              </SpotlightCard>
            ))}
          </div>
        </Demo>
      </ShowcaseSection>

      <ShowcaseSection title="Anatomy">
        <Anatomy parts={["SpotlightCard"]} />
      </ShowcaseSection>

      <ShowcaseSection title="Props">
        <PropsTable
          rows={[
            { name: "size", type: "number", default: "400", description: "Radius of the highlight in pixels." },
            { name: "intensity", type: "number", default: "0.1", description: "Peak strength of the surface wash, 0–1. Past about 0.2 it stops reading as light and starts reading as a glow." },
            { name: "className", type: "string", description: "Merged via cn(). Set the fill here — pass bg-background when the card sits inside a bg-card section, so surfaces never nest." },
          ]}
        />
      </ShowcaseSection>

      <ShowcaseSection title="Implementation">
        <p className="body-text text-sm">
          The pointer position is written straight to CSS custom properties on
          the node, so moving the mouse never triggers a React render — the whole
          effect runs in the compositor. Opacity is driven by{" "}
          <code className="font-mono text-[12px]">:hover</code> in CSS rather
          than by state, for the same reason.
        </p>
      </ShowcaseSection>

      <ShowcaseSection title="Accessibility">
        <A11yNotes
          notes={[
            "Purely decorative. Both highlight layers are aria-hidden and nothing depends on seeing them.",
            "The effect never appears for touch or keyboard users, so it must never be the only signal that something is interactive — give the card a real focus style if it is a link or button.",
            "It adds no role or semantics of its own. Put the heading, link and text inside as you would in any panel.",
          ]}
        />
      </ShowcaseSection>
    </ShowcasePage>
  );
}
