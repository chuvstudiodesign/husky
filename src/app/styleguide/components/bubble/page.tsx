import { Bubble, BubbleContent, BubbleGroup, BubbleReactions } from "@/components/ui/bubble";
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
  "muted",
  "tinted",
  "outline",
  "ghost",
  "destructive",
] as const;

export default function BubblePage() {
  return (
    <ShowcasePage>
      <ShowcaseHeader
        title="Bubble"
        description="A conversation bubble for chat and assistant transcripts. Alignment marks who is speaking; variant carries the tone."
        importPath={`import {
  BubbleGroup,
  Bubble,
  BubbleContent,
  BubbleReactions,
} from "@/components/ui/bubble"`}
      />

      <ShowcaseSection title="Conversation">
        <Demo
          note="align start for the other party, end for the current user"
          className="block"
          code={`<BubbleGroup>
  <Bubble variant="muted">
    <BubbleContent>Which zone should I arm?</BubbleContent>
  </Bubble>
  <Bubble align="end">
    <BubbleContent>Exterior and pool, please.</BubbleContent>
  </Bubble>
</BubbleGroup>`}
        >
          <BubbleGroup className="w-full">
            <Bubble variant="muted">
              <BubbleContent>
                Good evening. Which zones should I arm before you leave?
              </BubbleContent>
            </Bubble>
            <Bubble align="end">
              <BubbleContent>Exterior and pool, please.</BubbleContent>
            </Bubble>
            <Bubble variant="muted">
              <BubbleContent>
                Done — both are armed. The theater is still drawing power from
                the amp; want me to shut it down as well?
              </BubbleContent>
            </Bubble>
            <Bubble align="end">
              <BubbleContent>Yes, shut it down.</BubbleContent>
            </Bubble>
          </BubbleGroup>
        </Demo>
      </ShowcaseSection>

      <ShowcaseSection title="Variants">
        <Demo className="block">
          <div className="flex w-full flex-col gap-4">
            {variants.map((v) => (
              <div key={v} className="flex items-center gap-5">
                <span className="text-muted-foreground/70 w-20 shrink-0 font-mono text-[10px]">
                  {v}
                </span>
                <Bubble variant={v}>
                  <BubbleContent>Zone armed and reporting.</BubbleContent>
                </Bubble>
              </div>
            ))}
          </div>
        </Demo>
      </ShowcaseSection>

      <ShowcaseSection title="Reactions">
        <Demo
          note="Absolutely positioned; side and align control which corner"
          className="block"
          code={`<Bubble variant="muted">
  <BubbleContent>Calibration finished.</BubbleContent>
  <BubbleReactions>👍 2</BubbleReactions>
</Bubble>`}
        >
          <BubbleGroup className="w-full gap-8">
            <Bubble variant="muted">
              <BubbleContent>
                Calibration finished across all twelve zones.
              </BubbleContent>
              <BubbleReactions>👍 2</BubbleReactions>
            </Bubble>
            <Bubble align="end">
              <BubbleContent>Perfect, thanks.</BubbleContent>
              <BubbleReactions align="start">🎉</BubbleReactions>
            </Bubble>
          </BubbleGroup>
        </Demo>
      </ShowcaseSection>

      <ShowcaseSection title="Interactive content">
        <Demo
          note="asChild turns the bubble body into a button or link, with hover states wired up"
          className="block"
          code={`<Bubble variant="outline">
  <BubbleContent asChild>
    <button>Open the zone report</button>
  </BubbleContent>
</Bubble>`}
        >
          <BubbleGroup className="w-full">
            <Bubble variant="outline">
              <BubbleContent asChild>
                <button type="button">Open the zone report →</button>
              </BubbleContent>
            </Bubble>
          </BubbleGroup>
        </Demo>
      </ShowcaseSection>

      <ShowcaseSection title="Anatomy">
        <Anatomy
          parts={["BubbleGroup", "Bubble", "BubbleContent", "BubbleReactions"]}
        />
      </ShowcaseSection>

      <ShowcaseSection title="Props">
        <PropsTable
          caption="Bubble"
          rows={[
            {
              name: "variant",
              type: `"default" | "secondary" | "muted" | "tinted" | "outline" | "ghost" | "destructive"`,
              default: `"default"`,
              description:
                "Tone of the bubble body. tinted derives a soft wash from the primary token and adapts per theme.",
            },
            {
              name: "align",
              type: `"start" | "end"`,
              default: `"start"`,
              description:
                "Which side the bubble sits on. end reads as the current user.",
            },
          ]}
        />
        <div className="mt-8">
          <PropsTable
            caption="BubbleContent / BubbleReactions"
            rows={[
              {
                name: "asChild",
                type: "boolean",
                default: "false",
                description:
                  "On BubbleContent. Render a button or anchor as the body and inherit the interactive styles.",
              },
              {
                name: "side",
                type: `"top" | "bottom"`,
                default: `"bottom"`,
                description: "On BubbleReactions. Vertical anchor edge.",
              },
              {
                name: "align",
                type: `"start" | "end"`,
                default: `"end"`,
                description: "On BubbleReactions. Horizontal anchor edge.",
              },
            ]}
          />
        </div>
        <p className="text-muted-foreground mt-5 text-[13px] leading-relaxed">
          Bubbles cap at 80% of the container width, except{" "}
          <code className="font-mono text-[12px]">ghost</code>, which spans the
          full width and drops its padding and background.
        </p>
      </ShowcaseSection>

      <ShowcaseSection title="Accessibility">
        <A11yNotes
          notes={[
            "Alignment and colour are the only cues to authorship, and neither survives a screen reader — label each turn with the speaker's name, visibly or via visually hidden text.",
            "For a live transcript, wrap the group in an aria-live=\"polite\" region so incoming turns are announced without stealing focus.",
            "Reactions are absolutely positioned and can overlap adjacent bubbles — increase the group gap when you use them.",
            "When BubbleContent is interactive via asChild, keep it a real button or anchor so it stays focusable and keyboard-operable.",
          ]}
        />
      </ShowcaseSection>
    </ShowcasePage>
  );
}
