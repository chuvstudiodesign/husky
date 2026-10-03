import Image from "next/image";

import { CursorLight } from "@/components/motion-ui/cursor-light";
import {
  A11yNotes,
  Anatomy,
  Demo,
  PropsTable,
  ShowcaseHeader,
  ShowcasePage,
  ShowcaseSection,
} from "@/components/styleguide/showcase";

export default function CursorLightPage() {
  return (
    <ShowcasePage>
      <ShowcaseHeader
        title="Cursor Light"
        description="The frame dims around the pointer, so the visitor reads a photograph with a torch. Position is written to CSS custom properties, never React state, and the overlay fades in only while the pointer is over it."
        importPath={`import { CursorLight } from "@/components/motion-ui/cursor-light"`}
      />

      <ShowcaseSection title="Over a photograph">
        <Demo
          note="Move the pointer across the image."
          className="block p-0"
          code={`<CursorLight radius={320} strength={0.5}>
  <Image src="/photos/estate-dusk-02.jpg" alt="…" fill className="object-cover" />
</CursorLight>`}
        >
          <CursorLight radius={320} strength={0.5} className="aspect-video overflow-hidden rounded-lg">
            <Image
              src="/photos/estate-dusk-02.jpg"
              alt="A Husky-integrated estate at dusk, interior and landscape lighting on"
              fill
              sizes="(min-width: 1024px) 960px, 100vw"
              className="object-cover"
            />
          </CursorLight>
        </Demo>
      </ShowcaseSection>

      <ShowcaseSection title="Anatomy">
        <Anatomy parts={["root (--mx, --my, --cl-on, --r, --strength)", "children", "overlay[aria-hidden]"]} />
      </ShowcaseSection>

      <ShowcaseSection title="Props">
        <PropsTable
          rows={[
            { name: "radius", type: "number", default: "320", description: "Radius of the lit circle, px." },
            { name: "strength", type: "number", default: "0.5", description: "Darkness of the surround, as brand-black alpha 0–1." },
            { name: "className", type: "string", description: "Sizing and clipping for the frame." },
          ]}
        />
      </ShowcaseSection>

      <ShowcaseSection title="Accessibility">
        <A11yNotes
          notes={[
            "Decorative. Nothing is hidden from a visitor who never moves a pointer: at rest the overlay is fully transparent.",
            "Off on (hover: none): no listeners are attached and the overlay is display: none.",
            "Only opacity transitions (250ms); the gradient follows the pointer directly without animation.",
          ]}
        />
      </ShowcaseSection>
    </ShowcasePage>
  );
}
