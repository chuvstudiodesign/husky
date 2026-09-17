import {
  A11yNotes, Anatomy, PropsTable,
  ShowcaseHeader, ShowcasePage, ShowcaseSection,
} from "@/components/styleguide/showcase";

export default function SmoothScrollPage() {
  return (
    <ShowcasePage>
      <ShowcaseHeader
        title="Smooth Scroll"
        description="Momentum scrolling, without hijacking the page. Wraps a route and interpolates the native scroll position, so the page carries inertia while everything people rely on keeps working."
        importPath={`import { SmoothScroll } from "@/components/motion-ui/smooth-scroll"`}
      />

      <ShowcaseSection title="Why not the usual approach">
        <p className="body-text">
          Most smooth-scroll libraries take scrolling over entirely, and break the
          things nobody thinks about until they are gone: anchor links, find-in-page,
          keyboard paging, the scrollbar itself. Lenis interpolates the real scroll
          position instead of replacing it, so all of that survives.
        </p>
        <p className="body-text mt-4">
          Try it on <code className="font-mono text-[12px]">/v2</code>, which is
          wrapped in it. The main site is not.
        </p>
      </ShowcaseSection>

      <ShowcaseSection title="What is switched off, and why">
        <div className="flex flex-col gap-4">
          {[
            ["Reduced motion", "If the viewer asked for less movement, momentum is exactly the kind they meant. Native scroll is restored entirely."],
            ["Touch", "Phones already have momentum, tuned by the OS. Re-implementing it in JS makes it worse, never better."],
            ["On unmount", "The instance is destroyed and the RAF loop cancelled, so navigating away leaves scrolling untouched."],
          ].map(([t, d]) => (
            <div key={t} className="bg-card rounded-lg border p-7">
              <p className="meta">{t}</p>
              <p className="body-text mt-3">{d}</p>
            </div>
          ))}
        </div>
      </ShowcaseSection>

      <ShowcaseSection title="Anatomy">
        <Anatomy parts={["SmoothScroll"]} />
      </ShowcaseSection>

      <ShowcaseSection title="Props">
        <PropsTable
          rows={[
            { name: "duration", type: "number", default: "1.1", description: "Seconds for the wheel's momentum to settle. Past ~1.5 the page starts feeling detached from the input." },
            { name: "wheelMultiplier", type: "number", default: "1", description: "Multiplier on wheel delta. Below 1 slows the page down." },
            { name: "children", type: "ReactNode", description: "The route. Mount it once, at page level." },
          ]}
        />
      </ShowcaseSection>

      <ShowcaseSection title="Accessibility">
        <A11yNotes
          notes={[
            "Disabled outright under prefers-reduced-motion — the component returns before Lenis is ever constructed.",
            "Keyboard scrolling, Home/End, Page Up/Down and find-in-page all continue to work, because the native scroll position is what is being interpolated.",
            "In-page anchors are routed through Lenis so they ease rather than jump, with an 80px offset for the fixed header.",
            "Never wrap a scrollable panel in this. It is for the document, once.",
          ]}
        />
      </ShowcaseSection>
    </ShowcasePage>
  );
}
