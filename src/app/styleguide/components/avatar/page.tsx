import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  A11yNotes,
  Anatomy,
  Demo,
  PropsTable,
  ShowcaseHeader,
  ShowcasePage,
  ShowcaseSection,
} from "@/components/styleguide/showcase";

const team = [
  { initials: "LZ", name: "Lead integrator" },
  { initials: "MR", name: "Field technician" },
  { initials: "AC", name: "Systems designer" },
  { initials: "DP", name: "Project manager" },
];

export default function AvatarPage() {
  return (
    <ShowcasePage>
      <ShowcaseHeader
        title="Avatar"
        description="An image element with a text fallback, for representing a person or a device owner. Falls back cleanly when the image is missing or slow."
        importPath={`import {
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarBadge,
} from "@/components/ui/avatar"`}
      />

      <ShowcaseSection title="Default">
        <Demo
          code={`<Avatar>
  <AvatarImage src="/avatar.jpg" alt="Lead integrator" />
  <AvatarFallback>LZ</AvatarFallback>
</Avatar>`}
        >
          <div className="flex items-center gap-8">
            <div className="flex flex-col items-center gap-3">
              <Avatar size="lg">
                <AvatarImage
                  src="/brand/icon/husky-mark-orange.svg"
                  alt="Husky system account"
                  className="bg-card p-1"
                />
                <AvatarFallback>HK</AvatarFallback>
              </Avatar>
              <span className="text-muted-foreground/70 font-mono text-[10px]">
                image
              </span>
            </div>
            <div className="flex flex-col items-center gap-3">
              <Avatar size="lg">
                <AvatarImage src="/does-not-exist.png" alt="Lead integrator" />
                <AvatarFallback>LZ</AvatarFallback>
              </Avatar>
              <span className="text-muted-foreground/70 font-mono text-[10px]">
                fallback
              </span>
            </div>
          </div>
          <p className="text-muted-foreground text-[13px]">
            When the source fails or is omitted, AvatarFallback takes over.
          </p>
        </Demo>
      </ShowcaseSection>

      <ShowcaseSection title="Sizes">
        <Demo note='size="sm" (24px) · default (32px) · "lg" (40px)'>
          <div className="flex items-end gap-6">
            {(["sm", "default", "lg"] as const).map((s) => (
              <div key={s} className="flex flex-col items-center gap-3">
                <Avatar size={s}>
                  <AvatarFallback>LZ</AvatarFallback>
                </Avatar>
                <span className="text-muted-foreground/70 font-mono text-[10px]">
                  {s}
                </span>
              </div>
            ))}
          </div>
        </Demo>
      </ShowcaseSection>

      <ShowcaseSection title="Badge">
        <Demo
          note="Presence or status indicator, anchored to the avatar"
          code={`<Avatar size="lg">
  <AvatarFallback>LZ</AvatarFallback>
  <AvatarBadge className="bg-[var(--success)]" />
</Avatar>`}
        >
          <div className="flex items-center gap-8">
            <div className="flex flex-col items-center gap-3">
              <Avatar size="lg">
                <AvatarFallback>LZ</AvatarFallback>
                <AvatarBadge className="bg-[var(--success)]" />
              </Avatar>
              <span className="text-muted-foreground/70 font-mono text-[10px]">
                online
              </span>
            </div>
            <div className="flex flex-col items-center gap-3">
              <Avatar size="lg">
                <AvatarFallback>MR</AvatarFallback>
                <AvatarBadge className="bg-[var(--warning)]" />
              </Avatar>
              <span className="text-muted-foreground/70 font-mono text-[10px]">
                away
              </span>
            </div>
            <div className="flex flex-col items-center gap-3">
              <Avatar size="lg">
                <AvatarFallback>AC</AvatarFallback>
                <AvatarBadge className="bg-muted-foreground" />
              </Avatar>
              <span className="text-muted-foreground/70 font-mono text-[10px]">
                offline
              </span>
            </div>
          </div>
        </Demo>
      </ShowcaseSection>

      <ShowcaseSection title="Group">
        <Demo
          note="Overlapping stack with an overflow count"
          code={`<AvatarGroup>
  <Avatar><AvatarFallback>LZ</AvatarFallback></Avatar>
  <Avatar><AvatarFallback>MR</AvatarFallback></Avatar>
  <AvatarGroupCount>+6</AvatarGroupCount>
</AvatarGroup>`}
        >
          <AvatarGroup>
            {team.map((m) => (
              <Avatar key={m.initials}>
                <AvatarFallback>{m.initials}</AvatarFallback>
              </Avatar>
            ))}
            <AvatarGroupCount>+6</AvatarGroupCount>
          </AvatarGroup>
        </Demo>
      </ShowcaseSection>

      <ShowcaseSection title="Anatomy">
        <Anatomy
          parts={[
            "Avatar",
            "AvatarImage",
            "AvatarFallback",
            "AvatarBadge",
            "AvatarGroup",
            "AvatarGroupCount",
          ]}
        />
      </ShowcaseSection>

      <ShowcaseSection title="Props">
        <PropsTable
          caption="Avatar"
          rows={[
            {
              name: "size",
              type: `"sm" | "default" | "lg"`,
              default: `"default"`,
              description: "24px, 32px or 40px square.",
            },
          ]}
        />
        <div className="mt-8">
          <PropsTable
            caption="AvatarImage / AvatarFallback"
            rows={[
              {
                name: "src",
                type: "string",
                description: "On AvatarImage. The image URL.",
              },
              {
                name: "alt",
                type: "string",
                description:
                  "On AvatarImage. Describe the person, not the picture.",
              },
              {
                name: "delayMs",
                type: "number",
                description:
                  "On AvatarFallback. Waits before showing the fallback, so a fast image does not cause a flash of initials.",
              },
            ]}
          />
        </div>
      </ShowcaseSection>

      <ShowcaseSection title="Accessibility">
        <A11yNotes
          notes={[
            "AvatarImage needs alt text naming the person. If the avatar sits next to their name already, an empty alt avoids reading the name twice.",
            "Fallback initials are decorative to a screen reader — they carry no meaning without the alt text or adjacent label.",
            "AvatarBadge is colour-only. Pair it with text or a title attribute so status is not conveyed by hue alone.",
            "In a group, give the container an accessible name describing the set, and make the overflow count readable as text.",
          ]}
        />
      </ShowcaseSection>
    </ShowcasePage>
  );
}
