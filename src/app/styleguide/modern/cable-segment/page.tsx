import { CableSegment } from "@/components/motion-ui/cable-segment";
import {
  A11yNotes,
  Anatomy,
  Demo,
  PropsTable,
  ShowcaseHeader,
  ShowcasePage,
  ShowcaseSection,
} from "@/components/styleguide/showcase";

function Band({ tone }: { tone: "dark" | "light" }) {
  const light = tone === "light";
  return (
    <div
      className={
        light
          ? "group bg-brand-light section-x relative flex h-[80vh] flex-col justify-center rounded-lg"
          : "group bg-background section-x relative flex h-[80vh] flex-col justify-center rounded-lg"
      }
    >
      <CableSegment tone={tone} />
      <p
        className={
          light
            ? "eyebrow text-navy-900 group-data-[powered]:text-brand-black transition-colors duration-250"
            : "eyebrow text-muted-foreground group-data-[powered]:text-foreground transition-colors duration-250"
        }
      >
        {light ? "Light band" : "Dark band"}
      </p>
      <p className={light ? "display-3 text-brand-black mt-4" : "display-3 mt-4"}>
        The fill scrubs from top center to bottom center.
      </p>
    </div>
  );
}

export default function CableSegmentPage() {
  return (
    <ShowcasePage>
      <ShowcaseHeader
        title="Cable Segment"
        description="One length of the page's cable run: a 1px track, a fill that scrubs with the section, an orange live head riding the leading edge, and a junction node that powers on when the head passes. Each section renders one in its left gutter; together they read as the scroll progress bar made physical."
        importPath={`import { CableSegment } from "@/components/motion-ui/cable-segment"`}
      />

      <ShowcaseSection title="Dark and light">
        <Demo
          note="Scroll slowly. Watch the node and the eyebrow switch on as the head passes."
          className="flex flex-col items-stretch gap-8 p-0"
          code={`<section className="group relative section-x">
  <CableSegment tone="dark" />
  <p className="eyebrow text-muted-foreground group-data-[powered]:text-foreground">…</p>
</section>`}
        >
          <Band tone="dark" />
          <Band tone="light" />
        </Demo>
      </ShowcaseSection>

      <ShowcaseSection title="Anatomy">
        <Anatomy parts={["root[aria-hidden]", "track", "fill (scaleY)", "head (y)", "node (data-on)"]} />
      </ShowcaseSection>

      <ShowcaseSection title="Props">
        <PropsTable
          rows={[
            { name: "tone", type: "\"dark\" | \"light\"", default: "\"dark\"", description: "foreground lines on dark; navy-900 lines on the brand-light band." },
            { name: "first", type: "boolean", default: "false", description: "First segment of the run: no junction node, the section draws the origin (the mark's chin)." },
            { name: "last", type: "boolean", default: "false", description: "Last segment: the live head fades once the fill completes, where the terminus drawing takes over." },
            { name: "pinTrigger", type: "RefObject<HTMLElement>", description: "The section's pinned element. The fill then tracks the pin's start/end. Without a pin (phones) it falls back to top/bottom center." },
            { name: "onPowerChange", type: "(on: boolean) => void", description: "Fires when the node switches. The parent also gets data-powered." },
            { name: "className / style", type: "string / CSSProperties", description: "Override placement, e.g. a shorter bottom." },
          ]}
        />
      </ShowcaseSection>

      <ShowcaseSection title="Accessibility">
        <A11yNotes
          notes={[
            "Decorative: aria-hidden and pointer-events: none.",
            "Server render and reduced motion: fully drawn at foreground/24 with the node outlined, never orange. It remains a static graphic device.",
            "The node is state, not scrub: a 250ms colour transition that reverses on scroll-up.",
            "Orange is only the moving point and the powered node, never the whole line.",
          ]}
        />
      </ShowcaseSection>
    </ShowcasePage>
  );
}
