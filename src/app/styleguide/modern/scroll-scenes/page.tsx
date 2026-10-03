import {
  A11yNotes,
  Anatomy,
  Demo,
  PropsTable,
  ShowcaseHeader,
  ShowcasePage,
  ShowcaseSection,
} from "@/components/styleguide/showcase";

import { MarkDrawDemo } from "./demo";

export default function ScrollScenesPage() {
  return (
    <ShowcasePage>
      <ShowcaseHeader
        title="Scroll Scenes"
        description="The foundation every scroll-linked section builds on: one GSAP setup (P1), one hook that builds a scene per motion branch (P2), one page-level root that keeps ScrollTrigger in step with Lenis and settles layout (P3), and the Husky mark's geometry as shared constants (P6). Sections never call ScrollTrigger.create themselves."
        importPath={`import { registerGsap, SCRUB, MQ } from "@/components/motion-ui/gsap-setup"
import { useScrollScene } from "@/components/motion-ui/use-scroll-scene"
import { ScrollSceneRoot } from "@/components/motion-ui/scroll-scene-root"
import { MARK_VIEWBOX, MARK_HEAD_D, MARK_JAW_D, MARK_CHIN, MARK_MUZZLE } from "@/components/motion-ui/husky-mark-paths"`}
      />

      <ShowcaseSection title="A scene, end to end">
        <Demo
          note="Scroll: the mark draws itself, then the chin node lights. Under reduced motion it stays fully drawn and the branch reads static."
          className="block"
          code={`const ref = useRef<HTMLDivElement>(null);

useScrollScene(ref, {
  desktop: () => {
    gsap.timeline({
      scrollTrigger: { trigger: ref.current, start: "top 80%", end: "bottom 40%", scrub: SCRUB },
    })
      .fromTo("[data-mark-path]", { drawSVG: "0%" }, { drawSVG: "100%", ease: "none" });
  },
  mobile: /* same, or a lighter version */,
});

<svg viewBox={MARK_VIEWBOX}>
  {MARK_PATHS.map((d) => <path data-mark-path d={d} fill="none" stroke="currentColor" />)}
</svg>`}
        >
          <MarkDrawDemo />
        </Demo>
      </ShowcaseSection>

      <ShowcaseSection title="P1 · gsap-setup">
        <PropsTable
          rows={[
            { name: "registerGsap()", type: "() => void", description: "Registers ScrollTrigger, SplitText, DrawSVGPlugin and useGSAP once, and sets ScrollTrigger.config({ ignoreMobileResize: true }). Idempotent; no-op on the server." },
            { name: "SCRUB", type: "0.3", description: "Scrub smoothing for every scrubbed tween. Lenis already smooths the wheel." },
            { name: "MQ.motionDesktop", type: "string", description: "(min-width: 768px) and (prefers-reduced-motion: no-preference)" },
            { name: "MQ.motionMobile", type: "string", description: "(max-width: 767.98px) and (prefers-reduced-motion: no-preference)" },
            { name: "STATE_EASE", type: "string", description: "cubic-bezier(0.16, 1, 0.3, 1), the curve for 250ms state changes. Scrubbed tweens use ease: \"none\"." },
            { name: "scheduleRefresh()", type: "() => void", description: "Coalesces refresh requests into one ScrollTrigger.sort() + refresh() on the next frame." },
            { name: "gsap, ScrollTrigger, SplitText, DrawSVGPlugin, useGSAP", type: "re-exports", description: "Import from here so registration is guaranteed." },
          ]}
        />
      </ShowcaseSection>

      <ShowcaseSection title="P2 · useScrollScene">
        <PropsTable
          rows={[
            { name: "scope", type: "RefObject<HTMLElement | null>", description: "Scene root. Selector strings inside build are scoped to it." },
            { name: "build.desktop", type: "(ctx) => void | cleanup", description: "Runs when MQ.motionDesktop matches." },
            { name: "build.mobile", type: "(ctx) => void | cleanup", description: "Runs when MQ.motionMobile matches. Omit it and phones get the static layout." },
            { name: "ctx", type: "{ scope, branch, context }", description: "The scope element, which branch matched, and the gsap.matchMedia context." },
            { name: "deps", type: "unknown[]", default: "[]", description: "Values that force a full revert and rebuild. The latest build closures are always used." },
          ]}
        />
      </ShowcaseSection>

      <ShowcaseSection title="P3 · ScrollSceneRoot">
        <PropsTable
          rows={[
            { name: "children", type: "ReactNode", description: "The page's sections. Renders no element of its own." },
            { name: "heroSelector", type: "string", default: "\"[data-scroll-scene-hero]\"", description: "Images to decode before the first full refresh. Put data-scroll-scene-hero on the hero image." },
          ]}
        />
      </ShowcaseSection>

      <ShowcaseSection title="P6 · husky-mark-paths">
        <PropsTable
          rows={[
            { name: "MARK_VIEWBOX", type: "\"386 354 308 372\"", description: "The source SVG's viewBox." },
            { name: "MARK_HEAD_D", type: "string", description: "Head, muzzle and left jaw, verbatim from husky-mark-orange.svg." },
            { name: "MARK_JAW_D", type: "string", description: "The right jaw (a polygon in the source), as path data." },
            { name: "MARK_PATHS", type: "[head, jaw]", description: "Both, in drawing order." },
            { name: "MARK_CHIN", type: "{ x: 540, y: 708 }", description: "Lowest node, where the cable run starts." },
            { name: "MARK_MUZZLE", type: "{ x: 540, y: 668 }", description: "Muzzle centre." },
            { name: "MARK_BOX", type: "{ x, y, width, height }", description: "The viewBox as numbers." },
          ]}
        />
      </ShowcaseSection>

      <ShowcaseSection title="Anatomy">
        <Anatomy parts={["ScrollSceneRoot", "useScrollScene", "registerGsap", "MARK_*"]} />
      </ShowcaseSection>

      <ShowcaseSection title="Motion contract">
        <A11yNotes
          notes={[
            "The server-rendered HTML is the final, readable state. A scene may set a before state only inside a motion branch, and only below the first viewport.",
            "Under prefers-reduced-motion: reduce neither branch matches. Nothing pins, nothing scrubs, nothing is hidden.",
            "Animate transform, opacity and clip-path, and stroke-dashoffset through DrawSVG on SVG. Never filter, layout properties or letter-spacing.",
            "Builds wait for document.fonts.ready, because split lines and measured heights depend on real fonts.",
            "Lenis drives native scroll; ScrollSceneRoot also forwards its scroll event to ScrollTrigger.update so scrubs read the interpolated position on the same frame.",
          ]}
        />
      </ShowcaseSection>
    </ShowcasePage>
  );
}
