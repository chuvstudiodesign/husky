import { Parallax } from "@/components/motion-ui/parallax";
import {
  A11yNotes, Anatomy, Demo, PropsTable,
  ShowcaseHeader, ShowcasePage, ShowcaseSection,
} from "@/components/styleguide/showcase";

export default function ParallaxPage() {
  return (
    <ShowcasePage>
      <ShowcaseHeader
        title="Parallax"
        description="Drifts its child as the block passes through the viewport. Scroll-linked rather than triggered, so it tracks position continuously and reverses when scrolling back."
        importPath={`import { Parallax } from "@/components/motion-ui/parallax"`}
      />

      <ShowcaseSection title="Distance">
        <Demo note="Scroll the page to see them separate" className="block">
          <div className="grid w-full gap-4 md:grid-cols-3">
            {[-30, -70, -140].map((d) => (
              <div key={d} className="bg-background h-64 overflow-hidden rounded-lg border">
                <Parallax distance={d} className="h-full">
                  <div className="flex h-[130%] items-center justify-center">
                    <span className="meta">distance {d}</span>
                  </div>
                </Parallax>
              </div>
            ))}
          </div>
        </Demo>
      </ShowcaseSection>

      <ShowcaseSection title="Getting it right">
        <p className="body-text text-sm">
          Parallax is easy to overdo. The rule that keeps it from looking cheap: the
          further something is meant to feel, the <em>less</em> it should move
          relative to the page. Forty to eighty pixels across a full pass is plenty.
          Anything that visibly races the scroll reads as a gimmick rather than as
          depth.
        </p>
        <p className="body-text mt-4 text-sm">
          Give the child more height than its frame — around 120% — so the drift
          never exposes an edge.
        </p>
      </ShowcaseSection>

      <ShowcaseSection title="Anatomy">
        <Anatomy parts={["Parallax"]} />
      </ShowcaseSection>

      <ShowcaseSection title="Props">
        <PropsTable
          rows={[
            { name: "distance", type: "number", default: "-60", description: "Pixels of drift across the full pass. Negative moves against the scroll, which reads as further away." },
            { name: "axis", type: `"y" | "x"`, default: `"y"`, description: "Drift vertically or horizontally." },
          ]}
        />
      </ShowcaseSection>

      <ShowcaseSection title="Accessibility">
        <A11yNotes
          notes={[
            "Under prefers-reduced-motion the drift is zero and the child sits still.",
            "Only transform animates, so it stays on the compositor.",
            "Never parallax text a reader must follow — motion under the eye while reading is disorienting. Use it on imagery and decoration.",
          ]}
        />
      </ShowcaseSection>
    </ShowcasePage>
  );
}
