import { Grain } from "@/components/motion-ui/grain";
import {
  A11yNotes, Anatomy, Demo, PropsTable,
  ShowcaseHeader, ShowcasePage, ShowcaseSection,
} from "@/components/styleguide/showcase";

export default function GrainPage() {
  return (
    <ShowcasePage>
      <ShowcaseHeader
        title="Grain"
        description="A few percent of film noise over the whole page. Flat dark surfaces band badly on wide-gamut displays; noise breaks the banding up and, as a side effect, gives the page the texture of print rather than of a screen."
        importPath={`import { Grain } from "@/components/motion-ui/grain"`}
      />

      <ShowcaseSection title="Strength">
        <Demo
          note="The site ships 0.035. The exaggerated sample shows what it is doing."
          className="block"
        >
          <div className="grid w-full gap-4 md:grid-cols-3">
            {[0.035, 0.09, 0.2].map((o) => (
              <div
                key={o}
                className="bg-background relative h-44 overflow-hidden rounded-lg border"
              >
                <Grain opacity={o} className="absolute inset-0 z-0" />
                <span className="meta absolute bottom-4 left-4">
                  opacity {o}
                </span>
              </div>
            ))}
          </div>
        </Demo>
      </ShowcaseSection>

      <ShowcaseSection title="Usage">
        <p className="body-text text-sm">
          Mounted once, in the site layout — not per section. It is{" "}
          <code className="font-mono text-[12px]">position: fixed</code> and
          spans the viewport, so one instance covers the whole page as it
          scrolls.
        </p>
        <p className="body-text mt-4 text-sm">
          Generated inline with SVG turbulence, so it costs no network request.
          Keep it under about 4% — if you can see grain, it is too strong.
        </p>
      </ShowcaseSection>

      <ShowcaseSection title="Anatomy">
        <Anatomy parts={["Grain"]} />
      </ShowcaseSection>

      <ShowcaseSection title="Props">
        <PropsTable
          rows={[
            { name: "opacity", type: "number", default: "0.035", description: "Strength of the noise. Above ~0.05 it reads as texture rather than as a correction." },
            { name: "className", type: "string", description: "Merged via cn(). Override the positioning if you need it scoped to a container rather than the viewport." },
          ]}
        />
      </ShowcaseSection>

      <ShowcaseSection title="Accessibility">
        <A11yNotes
          notes={[
            "aria-hidden and pointer-events: none — it sits above the page visually but is invisible to assistive technology and never intercepts a click.",
            "It uses mix-blend-overlay, so it lightens dark areas very slightly. At 3.5% the effect on text contrast is negligible, but re-check any ratio that was already borderline.",
            "It is static, not animated. Animated grain is a common effect and a bad one — it flickers, costs frames, and is genuinely unpleasant for some viewers.",
          ]}
        />
      </ShowcaseSection>
    </ShowcasePage>
  );
}
