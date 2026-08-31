import { AngularHatch, AngularPattern } from "@/components/motion-ui/angular-pattern";
import {
  A11yNotes, Anatomy, Demo, PropsTable,
  ShowcaseHeader, ShowcasePage, ShowcaseSection,
} from "@/components/styleguide/showcase";

export default function AngularPatternPage() {
  return (
    <ShowcasePage>
      <ShowcaseHeader
        title="Angular Pattern"
        description="The brand's 45° bracket, taken from the Figma Pattern System — the same geometry the Husky mark is built on. It is the site's structural graphic in place of photography."
        importPath={`import {
  AngularPattern,
  AngularHatch,
} from "@/components/motion-ui/angular-pattern"`}
      />

      <ShowcaseSection title="Opacity">
        <Demo
          note="On the site it sits at 0.05–0.08 — structure, not image"
          className="block"
        >
          <div className="grid w-full gap-4 md:grid-cols-3">
            {[0.05, 0.15, 0.4].map((o) => (
              <div
                key={o}
                className="bg-background relative h-52 overflow-hidden rounded-lg border"
              >
                <AngularPattern
                  className="text-primary absolute top-1/2 -right-[10%] h-[140%] w-[70%] -translate-y-1/2"
                  opacity={o}
                />
                <span className="meta absolute bottom-4 left-4">
                  opacity {o}
                </span>
              </div>
            ))}
          </div>
        </Demo>
      </ShowcaseSection>

      <ShowcaseSection title="Flipped">
        <Demo className="block">
          <div className="bg-background relative h-52 overflow-hidden rounded-lg border">
            <AngularPattern
              className="text-primary absolute top-1/2 -left-[10%] h-[140%] w-[45%] -translate-y-1/2"
              opacity={0.14}
              flip
            />
            <span className="meta absolute right-4 bottom-4">flip</span>
          </div>
        </Demo>
      </ShowcaseSection>

      <ShowcaseSection title="Hatch">
        <Demo
          note="A faint 45° tile. Gives an empty section a surface without an image."
          className="block"
        >
          <div className="bg-card relative h-40 overflow-hidden rounded-lg border">
            <AngularHatch className="text-white/[0.04]" />
            <span className="meta absolute bottom-4 left-4">AngularHatch</span>
          </div>
        </Demo>
      </ShowcaseSection>

      <ShowcaseSection title="Anatomy">
        <Anatomy parts={["AngularPattern", "AngularHatch"]} />
      </ShowcaseSection>

      <ShowcaseSection title="Props">
        <PropsTable
          rows={[
            { name: "opacity", type: "number", default: "1", description: "Overall opacity. On the real pages this runs 0.05–0.08 — if you can read it as a shape, it is competing with the type." },
            { name: "flip", type: "boolean", default: "false", description: "Mirror horizontally, so the bracket can open the other way." },
            { name: "className", type: "string", description: "Position and size it here. Colour comes from currentColor, so set text-primary or similar." },
          ]}
        />
      </ShowcaseSection>

      <ShowcaseSection title="Accessibility">
        <A11yNotes
          notes={[
            "Purely decorative and aria-hidden. It carries no information and nothing depends on seeing it.",
            "Colour comes from currentColor, so it inherits whatever text colour its container sets — keep it behind content and never let it reduce text contrast.",
            "Because it is an inline SVG with no fetch, it costs no request and scales cleanly at any size.",
          ]}
        />
      </ShowcaseSection>
    </ShowcasePage>
  );
}
