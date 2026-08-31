import { FileAudio, FileText, Film, X } from "lucide-react";

import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentTitle,
} from "@/components/ui/attachment";
import { Spinner } from "@/components/ui/spinner";
import {
  A11yNotes,
  Anatomy,
  Demo,
  PropsTable,
  ShowcaseHeader,
  ShowcasePage,
  ShowcaseSection,
} from "@/components/styleguide/showcase";

export default function AttachmentPage() {
  return (
    <ShowcasePage>
      <ShowcaseHeader
        title="Attachment"
        description="A file chip for uploads, exports and documents. Carries its own lifecycle state so a queue can render idle, in-flight, failed and finished items from one component."
        importPath={`import {
  Attachment,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentContent,
  AttachmentTitle,
  AttachmentDescription,
  AttachmentActions,
  AttachmentAction,
  AttachmentTrigger,
} from "@/components/ui/attachment"`}
      />

      <ShowcaseSection title="Default">
        <Demo
          code={`<Attachment>
  <AttachmentMedia><FileText /></AttachmentMedia>
  <AttachmentContent>
    <AttachmentTitle>rack-schematic.pdf</AttachmentTitle>
    <AttachmentDescription>2.4 MB</AttachmentDescription>
  </AttachmentContent>
</Attachment>`}
        >
          <Attachment>
            <AttachmentMedia>
              <FileText />
            </AttachmentMedia>
            <AttachmentContent>
              <AttachmentTitle>rack-schematic.pdf</AttachmentTitle>
              <AttachmentDescription>2.4 MB</AttachmentDescription>
            </AttachmentContent>
          </Attachment>
        </Demo>
      </ShowcaseSection>

      <ShowcaseSection title="States">
        <Demo note='state="idle | uploading | processing | error | done"'>
          <div className="flex w-full flex-col gap-3">
            <Attachment state="idle">
              <AttachmentMedia>
                <FileText />
              </AttachmentMedia>
              <AttachmentContent>
                <AttachmentTitle>zone-map.dwg</AttachmentTitle>
                <AttachmentDescription>Queued</AttachmentDescription>
              </AttachmentContent>
            </Attachment>

            <Attachment state="uploading">
              <AttachmentMedia>
                <Spinner />
              </AttachmentMedia>
              <AttachmentContent>
                <AttachmentTitle>calibration-log.csv</AttachmentTitle>
                <AttachmentDescription>Uploading · 64%</AttachmentDescription>
              </AttachmentContent>
            </Attachment>

            <Attachment state="processing">
              <AttachmentMedia>
                <Spinner />
              </AttachmentMedia>
              <AttachmentContent>
                <AttachmentTitle>theater-sweep.wav</AttachmentTitle>
                <AttachmentDescription>Analysing</AttachmentDescription>
              </AttachmentContent>
            </Attachment>

            <Attachment state="error">
              <AttachmentMedia>
                <FileAudio />
              </AttachmentMedia>
              <AttachmentContent>
                <AttachmentTitle>pool-array.wav</AttachmentTitle>
                <AttachmentDescription>Upload failed</AttachmentDescription>
              </AttachmentContent>
            </Attachment>

            <Attachment state="done">
              <AttachmentMedia>
                <Film />
              </AttachmentMedia>
              <AttachmentContent>
                <AttachmentTitle>install-walkthrough.mp4</AttachmentTitle>
                <AttachmentDescription>128 MB</AttachmentDescription>
              </AttachmentContent>
            </Attachment>
          </div>
        </Demo>
      </ShowcaseSection>

      <ShowcaseSection title="Sizes">
        <Demo note='size="default | sm | xs"'>
          <div className="flex w-full flex-col gap-3">
            {(["default", "sm", "xs"] as const).map((s) => (
              <Attachment key={s} size={s}>
                <AttachmentMedia>
                  <FileText />
                </AttachmentMedia>
                <AttachmentContent>
                  <AttachmentTitle>rack-schematic.pdf</AttachmentTitle>
                  <AttachmentDescription>{s}</AttachmentDescription>
                </AttachmentContent>
              </Attachment>
            ))}
          </div>
        </Demo>
      </ShowcaseSection>

      <ShowcaseSection title="Orientation">
        <Demo note='orientation="horizontal | vertical"'>
          <div className="flex flex-wrap items-start gap-4">
            <Attachment orientation="vertical">
              <AttachmentMedia>
                <FileText />
              </AttachmentMedia>
              <AttachmentContent>
                <AttachmentTitle>zone-map.dwg</AttachmentTitle>
                <AttachmentDescription>1.1 MB</AttachmentDescription>
              </AttachmentContent>
            </Attachment>
            <Attachment orientation="vertical">
              <AttachmentMedia>
                <Film />
              </AttachmentMedia>
              <AttachmentContent>
                <AttachmentTitle>walkthrough.mp4</AttachmentTitle>
                <AttachmentDescription>128 MB</AttachmentDescription>
              </AttachmentContent>
            </Attachment>
          </div>
        </Demo>
      </ShowcaseSection>

      <ShowcaseSection title="With actions">
        <Demo
          code={`<AttachmentActions>
  <AttachmentAction aria-label="Remove"><X /></AttachmentAction>
</AttachmentActions>`}
        >
          <Attachment>
            <AttachmentMedia>
              <FileText />
            </AttachmentMedia>
            <AttachmentContent>
              <AttachmentTitle>rack-schematic.pdf</AttachmentTitle>
              <AttachmentDescription>2.4 MB</AttachmentDescription>
            </AttachmentContent>
            <AttachmentActions>
              <AttachmentAction aria-label="Remove attachment">
                <X />
              </AttachmentAction>
            </AttachmentActions>
          </Attachment>
        </Demo>
      </ShowcaseSection>

      <ShowcaseSection title="Group">
        <Demo note="AttachmentGroup lays a queue out as a wrapping row">
          <AttachmentGroup>
            {["rack-schematic.pdf", "zone-map.dwg", "sweep.wav"].map((f) => (
              <Attachment key={f} size="sm">
                <AttachmentMedia>
                  <FileText />
                </AttachmentMedia>
                <AttachmentContent>
                  <AttachmentTitle>{f}</AttachmentTitle>
                </AttachmentContent>
              </Attachment>
            ))}
          </AttachmentGroup>
        </Demo>
      </ShowcaseSection>

      <ShowcaseSection title="Anatomy">
        <Anatomy
          parts={[
            "AttachmentGroup",
            "Attachment",
            "AttachmentMedia",
            "AttachmentContent",
            "AttachmentTitle",
            "AttachmentDescription",
            "AttachmentActions",
            "AttachmentAction",
            "AttachmentTrigger",
          ]}
        />
      </ShowcaseSection>

      <ShowcaseSection title="Props">
        <PropsTable
          caption="Attachment"
          rows={[
            {
              name: "state",
              type: `"idle" | "uploading" | "processing" | "error" | "done"`,
              default: `"done"`,
              description:
                "Lifecycle state. idle draws a dashed border; error recolours the border and media well with the destructive token.",
            },
            {
              name: "size",
              type: `"default" | "sm" | "xs"`,
              default: `"default"`,
              description:
                "Scales padding, text and the media well together.",
            },
            {
              name: "orientation",
              type: `"horizontal" | "vertical"`,
              default: `"horizontal"`,
              description:
                "Horizontal is a row chip with a 40px well. Vertical stacks into a 96px tile with a full-width preview.",
            },
          ]}
        />
        <div className="mt-8">
          <PropsTable
            caption="AttachmentMedia / AttachmentTrigger"
            rows={[
              {
                name: "variant",
                type: `"icon" | "image"`,
                default: `"icon"`,
                description:
                  "On AttachmentMedia. image makes a nested img cover the well and fades it until state is done.",
              },
              {
                name: "asChild",
                type: "boolean",
                default: "false",
                description:
                  "On AttachmentTrigger. Renders your own element — a link, say — instead of a button.",
              },
            ]}
          />
        </div>
      </ShowcaseSection>

      <ShowcaseSection title="Accessibility">
        <A11yNotes
          notes={[
            "AttachmentAction is an icon-only button — always give it an aria-label describing the action and its target.",
            "State is conveyed by colour and border style, so keep the textual status in AttachmentDescription too.",
            "For a live upload queue, wrap the group in an aria-live=\"polite\" region so completions are announced.",
            "The root shows a focus-within ring, so keyboard users can see which chip holds focus.",
          ]}
        />
      </ShowcaseSection>
    </ShowcasePage>
  );
}
