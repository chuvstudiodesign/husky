import Image from "next/image";

import { ImageReveal } from "@/components/motion-ui/image-reveal";
import {
  A11yNotes, Anatomy, Demo, PropsTable,
  ShowcaseHeader, ShowcasePage, ShowcaseSection,
} from "@/components/styleguide/showcase";

const directions = ["up", "down", "left", "right"] as const;

export default function ImageRevealPage() {
  return (
    <ShowcasePage>
      <ShowcaseHeader
        title="Image Reveal"
        description="Unmasks its child as it scrolls into view, wiping from one edge. A photograph that fades in reads as a page still loading; one that is unmasked reads as a frame opening on something already there."
        importPath={`import { ImageReveal } from "@/components/motion-ui/image-reveal"`}
      />

      <ShowcaseSection title="Direction">
        <Demo note="The edge the mask retreats toward" className="block">
          <div className="grid w-full gap-4 md:grid-cols-2">
            {directions.map((d) => (
              <ImageReveal key={d} direction={d} className="rounded-lg border">
                <div className="relative h-48">
                  <Image
                    src="/photos/estate-dusk-02.jpg"
                    alt="An estate at dusk with landscape lighting on"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                  <span className="meta absolute bottom-4 left-4 text-white">
                    {d}
                  </span>
                </div>
              </ImageReveal>
            ))}
          </div>
        </Demo>
      </ShowcaseSection>

      <ShowcaseSection title="Anatomy">
        <Anatomy parts={["ImageReveal"]} />
      </ShowcaseSection>

      <ShowcaseSection title="Props">
        <PropsTable
          rows={[
            { name: "direction", type: `"up" | "down" | "left" | "right"`, default: `"up"`, description: "Which edge the mask retreats toward." },
            { name: "duration", type: "number", default: "1.1", description: "Seconds the unmask takes. Slower than a fade on purpose — the deliberateness is the point." },
            { name: "delay", type: "number", default: "0", description: "Seconds before it starts." },
          ]}
        />
      </ShowcaseSection>

      <ShowcaseSection title="Accessibility">
        <A11yNotes
          notes={[
            "The hidden state is gated on html.js, so with scripting unavailable the image is simply visible.",
            "Under prefers-reduced-motion the clip is removed and the image appears in place.",
            "clip-path animates on the compositor, so it costs nothing per frame.",
            "Alt text belongs on the image inside, not on the wrapper — this component adds no semantics.",
          ]}
        />
      </ShowcaseSection>
    </ShowcasePage>
  );
}
