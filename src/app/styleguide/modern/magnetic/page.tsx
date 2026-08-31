import { Button } from "@/components/ui/button";
import { Magnetic } from "@/components/motion-ui/magnetic";
import {
  A11yNotes, Anatomy, Demo, PropsTable,
  ShowcaseHeader, ShowcasePage, ShowcaseSection,
} from "@/components/styleguide/showcase";

export default function MagneticPage() {
  return (
    <ShowcasePage>
      <ShowcaseHeader
        title="Magnetic"
        description="Pulls its child a short distance toward the cursor while the pointer is over it, then springs back on exit. Used on the primary calls to action."
        importPath={`import { Magnetic } from "@/components/motion-ui/magnetic"`}
      />

      <ShowcaseSection title="Strength">
        <Demo note="Hover each button" className="gap-10">
          {[0.15, 0.25, 0.45].map((s) => (
            <div key={s} className="flex flex-col items-center gap-4">
              <Magnetic strength={s}>
                <Button size="lg" className="h-12 px-7">
                  Request a Consultation
                </Button>
              </Magnetic>
              <span className="meta">strength {s}</span>
            </div>
          ))}
        </Demo>
      </ShowcaseSection>

      <ShowcaseSection title="Anatomy">
        <Anatomy parts={["Magnetic"]} />
      </ShowcaseSection>

      <ShowcaseSection title="Props">
        <PropsTable
          rows={[
            { name: "strength", type: "number", default: "0.25", description: "How far the element follows the cursor, as a fraction of the offset. Keep it low — past about 0.4 it stops feeling precise and starts feeling loose." },
            { name: "children", type: "ReactNode", description: "The control. Keep it a real button or link; this wrapper adds no semantics." },
          ]}
        />
      </ShowcaseSection>

      <ShowcaseSection title="Accessibility">
        <A11yNotes
          notes={[
            "The child stays a normal focusable element underneath — the wrapper never intercepts activation, so keyboard and screen-reader users reach it exactly as they would without it.",
            "Disabled entirely under prefers-reduced-motion.",
            "The effect is pointer-only, so it must be decoration rather than the only affordance signalling that something is a control.",
            "Do not wrap large hit targets. A control that drifts away from where the user aimed is worse than one that stays put.",
          ]}
        />
      </ShowcaseSection>
    </ShowcasePage>
  );
}
