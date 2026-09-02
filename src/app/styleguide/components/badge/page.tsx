import { Activity, CircleCheck, TriangleAlert, WifiOff } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  A11yNotes,
  Anatomy,
  Demo,
  PropsTable,
  ShowcaseHeader,
  ShowcasePage,
  ShowcaseSection,
} from "@/components/styleguide/showcase";

const variants = [
  "default",
  "secondary",
  "outline",
  "destructive",
  "ghost",
  "link",
] as const;

export default function BadgePage() {
  return (
    <ShowcasePage>
      <ShowcaseHeader
        title="Badge"
        description="A compact label for status, counts and categories. Reads as metadata attached to something else — never as a control."
        importPath={`import { Badge, badgeVariants } from "@/components/ui/badge"`}
      />

      <ShowcaseSection title="Variants">
        <Demo code={`<Badge variant="secondary">Standby</Badge>`}>
          {variants.map((v) => (
            <div key={v} className="flex flex-col items-start gap-3">
              <Badge variant={v}>
                {v === "default" ? "Active" : v[0].toUpperCase() + v.slice(1)}
              </Badge>
              <span className="text-muted-foreground/70 font-mono text-[10px]">
                {v}
              </span>
            </div>
          ))}
        </Demo>
      </ShowcaseSection>

      <ShowcaseSection title="With icon">
        <Demo
          note="An svg child is sized to 12px automatically"
          code={`<Badge><Activity /> Active</Badge>`}
        >
          <Badge>
            <Activity /> Active
          </Badge>
          <Badge variant="secondary">
            <CircleCheck /> Calibrated
          </Badge>
          <Badge variant="outline">
            <WifiOff /> Offline
          </Badge>
          <Badge variant="destructive">
            <TriangleAlert /> Fault
          </Badge>
        </Demo>
      </ShowcaseSection>

      <ShowcaseSection title="Semantic tinting">
        <Demo
          note="Reach for the semantic tokens when the built-in variants do not carry the meaning"
          code={`<Badge className="bg-[var(--success)] text-[var(--success-foreground)]">
  Online
</Badge>`}
        >
          <Badge className="bg-[var(--success)] text-[var(--success-foreground)]">
            Online
          </Badge>
          <Badge className="bg-[var(--warning)] text-[var(--warning-foreground)]">
            Degraded
          </Badge>
          <Badge className="bg-[var(--info)] text-[var(--info-foreground)]">
            Scheduled
          </Badge>
        </Demo>
      </ShowcaseSection>

      <ShowcaseSection title="As a link">
        <Demo
          note="asChild keeps the anchor semantics and picks up the hover styles"
          code={`<Badge asChild variant="outline">
  <a href="/zones/living">Living Room</a>
</Badge>`}
        >
          <Badge asChild variant="outline">
            <a href="#">Living Room</a>
          </Badge>
          <Badge asChild>
            <a href="#">East Wing</a>
          </Badge>
        </Demo>
      </ShowcaseSection>

      <ShowcaseSection title="In context">
        <Demo className="block">
          <div className="flex w-full flex-col gap-4">
            {[
              { z: "Living Room Zone", s: "Active", v: "default" as const },
              { z: "Master Theater", s: "Standby", v: "secondary" as const },
              { z: "Exterior & Pool", s: "Fault", v: "destructive" as const },
            ].map((r) => (
              <div
                key={r.z}
                className="flex items-center justify-between border-b pb-4 last:border-b-0 last:pb-0"
              >
                <span className="text-sm">{r.z}</span>
                <Badge variant={r.v}>{r.s}</Badge>
              </div>
            ))}
          </div>
        </Demo>
      </ShowcaseSection>

      <ShowcaseSection title="Anatomy">
        <Anatomy parts={["Badge", "badgeVariants"]} />
      </ShowcaseSection>

      <ShowcaseSection title="Props">
        <PropsTable
          rows={[
            {
              name: "variant",
              type: `"default" | "secondary" | "outline" | "destructive" | "ghost" | "link"`,
              default: `"default"`,
              description: "Visual tone.",
            },
            {
              name: "asChild",
              type: "boolean",
              default: "false",
              description:
                "Render the child element instead of a span — used to make a badge into a link.",
            },
            {
              name: "className",
              type: "string",
              description:
                "Merged via cn(). The place to apply semantic token colours.",
            },
          ]}
        />
        <p className="text-muted-foreground mt-5 text-[13px] leading-relaxed">
          Height is fixed at 20px. Corner radius resolves to the system 4px
          ceiling rather than a pill, per the brand&apos;s radius rule.
        </p>
      </ShowcaseSection>

      <ShowcaseSection title="Accessibility">
        <A11yNotes
          notes={[
            "A badge is not a button. If it needs to be clicked, use asChild with a real link or button so it is focusable and keyboard-operable.",
            "Status conveyed by colour must also be in the text — “Fault” carries the meaning, red alone does not.",
            "When a badge annotates a nearby element, tie them together with aria-describedby so the relationship survives linearisation.",
            "For counts that update live, put the badge inside an aria-live=\"polite\" region.",
          ]}
        />
      </ShowcaseSection>
    </ShowcasePage>
  );
}
