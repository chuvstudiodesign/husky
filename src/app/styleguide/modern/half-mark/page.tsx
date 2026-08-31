import { HuskyMark } from "@/components/motion-ui/husky-mark";
import {
  A11yNotes,
  Anatomy,
  Demo,
  PropsTable,
  ShowcaseHeader,
  ShowcasePage,
  ShowcaseSection,
} from "@/components/styleguide/showcase";

/**
 * A stand-in for the real device.
 *
 * `HalfMark` is `position: fixed` and cut by the viewport edge, so it cannot be
 * shown inside a box. These demos reproduce the same treatment with `HuskyMark`
 * clipped by the container instead, which is what the page needs to communicate:
 * the mark's horizontal centre sits on the edge, so exactly half the face shows.
 */
function MarkPlate({
  opacity = 1,
  side = "right",
  tone = "brand",
  label,
}: {
  opacity?: number;
  side?: "right" | "left";
  tone?: "brand" | "dark";
  label: string;
}) {
  const ground = tone === "dark" ? "var(--brand-light)" : "var(--background)";
  const ink = tone === "dark" ? "var(--card)" : "var(--primary)";

  return (
    <div
      className="relative h-56 overflow-hidden rounded-lg border"
      style={{ background: ground }}
    >
      <div
        aria-hidden
        className={
          side === "right"
            ? "absolute top-1/2 right-0 h-[150%] -translate-y-1/2 translate-x-1/2"
            : "absolute top-1/2 left-0 h-[150%] -translate-y-1/2 -translate-x-1/2"
        }
        style={{ opacity, color: ink }}
      >
        <HuskyMark className="h-full w-auto" />
      </div>
      <span
        className="meta absolute bottom-4 left-4"
        style={tone === "dark" ? { color: "var(--navy-800)" } : undefined}
      >
        {label}
      </span>
    </div>
  );
}

export default function HalfMarkPage() {
  return (
    <ShowcasePage>
      <ShowcaseHeader
        title="Half Mark"
        description="The Husky wolf, bisected by the edge of the frame. This is the brand's structural graphic on the site — a large, quiet shape that gives a page depth without photography."
        importPath={`import { HalfMark } from "@/components/motion-ui/half-mark"
import { HuskyMark } from "@/components/motion-ui/husky-mark"`}
      />

      <ShowcaseSection title="The treatment">
        <Demo
          note="The mark's horizontal centre sits on the edge, so exactly half the face shows"
          className="block"
        >
          <MarkPlate label="50% cut, right edge" />
        </Demo>
      </ShowcaseSection>

      <ShowcaseSection title="Opacity">
        <Demo
          note="On the page it runs 1 at rest and 0.1 once scrolled"
          className="block"
        >
          <div className="grid w-full gap-4 md:grid-cols-3">
            <MarkPlate opacity={1} label="opacity 1" />
            <MarkPlate opacity={0.35} label="opacity 0.35" />
            <MarkPlate opacity={0.1} label="opacity 0.1" />
          </div>
        </Demo>
      </ShowcaseSection>

      <ShowcaseSection title="Side">
        <Demo note="Which edge the mark is cut against" className="block">
          <div className="grid w-full gap-4 md:grid-cols-2">
            <MarkPlate side="right" label="right" />
            <MarkPlate side="left" label="left" />
          </div>
        </Demo>
      </ShowcaseSection>

      <ShowcaseSection title="Tone">
        <Demo
          note="Brand orange on the dark grounds; the card colour over the one light band, where orange loses its footing"
          className="block"
        >
          <div className="grid w-full gap-4 md:grid-cols-2">
            <MarkPlate tone="brand" label="brand · on #090A0F" />
            <MarkPlate tone="dark" opacity={0.5} label="dark · on #DFDFDF" />
          </div>
        </Demo>
      </ShowcaseSection>

      <ShowcaseSection title="Behaviour on the page">
        <div className="flex flex-col gap-4">
          <div className="bg-card rounded-lg border p-7">
            <p className="meta">Desktop</p>
            <p className="body-text mt-3 text-sm">
              Holds its position and size, and recedes to 10% once the page
              scrolls. It becomes a watermark rather than a subject, so it can
              stay on screen the whole way down without competing with the copy.
            </p>
          </div>
          <div className="bg-card rounded-lg border p-7">
            <p className="meta">Phone</p>
            <p className="body-text mt-3 text-sm">
              There is no room to keep it, so on the first scroll it collapses
              into a 70px badge in the bottom-right corner and gets out of the
              way. At rest it sits 10px below centre, which drops the ears clear
              of the headline.
            </p>
          </div>
          <div className="bg-card rounded-lg border p-7">
            <p className="meta">Tone switching</p>
            <p className="body-text mt-3 text-sm">
              The probe is the mark&apos;s own vertical centre, not the section
              entering the viewport, so the repaint fires exactly as a boundary
              crosses the middle of the wolf. One condition governs it, so
              scrolling back up reverses at the same line. Pass{" "}
              <code className="font-mono text-[12px]">darkOver=&#123;[]&#125;</code>{" "}
              to hold brand colour for a whole page.
            </p>
          </div>
        </div>
      </ShowcaseSection>

      <ShowcaseSection title="Anatomy">
        <Anatomy parts={["HalfMark", "HuskyMark"]} />
      </ShowcaseSection>

      <ShowcaseSection title="Props">
        <PropsTable
          caption="HalfMark"
          rows={[
            {
              name: "height",
              type: "number",
              default: "78",
              description: "Viewport height it occupies at rest, on desktop, in vh.",
            },
            {
              name: "mobileHeight",
              type: "number",
              default: "49.4",
              description: "Viewport height at rest on a phone, in vh.",
            },
            {
              name: "dockedSize",
              type: "number",
              default: "70",
              description: "Edge length of the docked badge, in pixels.",
            },
            {
              name: "threshold",
              type: "number",
              default: "8",
              description: "Pixels of scroll before it docks or recedes.",
            },
            {
              name: "darkOver",
              type: "string[]",
              default: `["approach"]`,
              description:
                "Element ids the mark repaints dark over. Pass an empty array to keep it in brand colour throughout.",
            },
          ]}
        />
        <div className="mt-8">
          <PropsTable
            caption="HuskyMark"
            rows={[
              {
                name: "className",
                type: "string",
                description:
                  "The inline SVG. It paints with currentColor, so set the colour on it or on a parent — an <img> could not be recoloured, which is why this exists.",
              },
            ]}
          />
        </div>
      </ShowcaseSection>

      <ShowcaseSection title="Accessibility">
        <A11yNotes
          notes={[
            "Purely decorative. Both are aria-hidden and carry no semantics; nothing on the page depends on seeing them.",
            "HalfMark is fixed and pointer-events-none, so it never intercepts a click even where it overlaps content.",
            "It sits at z-20 — above the opaque section backgrounds, which would otherwise bury it, and below page copy at z-30. Keep copy left-aligned on any page that uses it.",
            "The transition is disabled under prefers-reduced-motion; the mark simply appears in its correct state.",
            "Because it overlays content near one edge, check text contrast there rather than assuming: at full opacity on a phone it will sit behind body copy.",
          ]}
        />
      </ShowcaseSection>
    </ShowcasePage>
  );
}
