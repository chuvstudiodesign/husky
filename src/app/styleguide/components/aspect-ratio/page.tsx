import Image from "next/image";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import {
  A11yNotes,
  Anatomy,
  Demo,
  PropsTable,
  ShowcaseHeader,
  ShowcasePage,
  ShowcaseSection,
} from "@/components/styleguide/showcase";

const ratios = [
  { label: "21 / 9", value: 21 / 9, note: "Cinemascope" },
  { label: "16 / 9", value: 16 / 9, note: "Display / video" },
  { label: "4 / 3", value: 4 / 3, note: "Legacy panel" },
  { label: "1 / 1", value: 1, note: "Tile" },
];

export default function AspectRatioPage() {
  return (
    <ShowcasePage>
      <ShowcaseHeader
        title="Aspect Ratio"
        description="Locks its children into a fixed width-to-height ratio. Keeps media grids from reflowing while images load."
        importPath={`import { AspectRatio } from "@/components/ui/aspect-ratio"`}
      />

      <ShowcaseSection title="Ratios">
        <div className="flex flex-col gap-8">
          {ratios.map((r) => (
            <Demo key={r.label} label={r.label} note={r.note} className="block">
              <AspectRatio
                ratio={r.value}
                className="bg-muted overflow-hidden rounded-lg border"
              >
                <div className="flex size-full items-center justify-center">
                  <span className="text-system text-muted-foreground text-[11px]">
                    {r.label}
                  </span>
                </div>
              </AspectRatio>
            </Demo>
          ))}
        </div>
      </ShowcaseSection>

      <ShowcaseSection title="With an image">
        <Demo
          note="Pair with object-cover so the image fills without distorting"
          className="block"
          code={`<AspectRatio ratio={16 / 9} className="overflow-hidden rounded-lg border">
  <Image src="/photos/estate-dusk-01.jpg" alt="" fill className="object-cover" />
</AspectRatio>`}
        >
          <AspectRatio
            ratio={16 / 9}
            className="overflow-hidden rounded-lg border"
          >
            <Image
              src="/photos/estate-dusk-01.jpg"
              alt="A Husky-integrated estate at dusk"
              fill
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
            />
          </AspectRatio>
        </Demo>
      </ShowcaseSection>

      <ShowcaseSection title="In a grid">
        <Demo
          note="Ratio is preserved as the column width changes"
          className="block"
        >
          <div className="grid w-full grid-cols-3 gap-4">
            {["Living", "Theater", "Pool"].map((z) => (
              <AspectRatio
                key={z}
                ratio={1}
                className="bg-muted overflow-hidden rounded-lg border"
              >
                <div className="flex size-full items-end p-3">
                  <span className="text-system text-muted-foreground text-[10px]">
                    {z}
                  </span>
                </div>
              </AspectRatio>
            ))}
          </div>
        </Demo>
      </ShowcaseSection>

      <ShowcaseSection title="Anatomy">
        <Anatomy parts={["AspectRatio"]} />
      </ShowcaseSection>

      <ShowcaseSection title="Props">
        <PropsTable
          rows={[
            {
              name: "ratio",
              type: "number",
              default: "1",
              description:
                "Width divided by height. Write it as a division — 16 / 9 — rather than a decimal, so the intent stays readable.",
            },
            {
              name: "className",
              type: "string",
              description:
                "Applied to the inner wrapper. Put overflow-hidden and the radius here.",
            },
            {
              name: "children",
              type: "ReactNode",
              description:
                "Absolutely positioned to fill the box. Images need fill plus object-cover.",
            },
          ]}
        />
      </ShowcaseSection>

      <ShowcaseSection title="Accessibility">
        <A11yNotes
          notes={[
            "Purely presentational — it adds no role or semantics of its own.",
            "Reserving the box before media loads prevents layout shift, which helps anyone tracking a moving target on the page.",
            "Alt text belongs on the image inside, not on the ratio wrapper.",
          ]}
        />
      </ShowcaseSection>
    </ShowcasePage>
  );
}
