import {
  CircleCheck,
  Info,
  OctagonX,
  TriangleAlert,
  WifiOff,
} from "lucide-react";

import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  A11yNotes,
  Anatomy,
  Demo,
  PropsTable,
  ShowcaseHeader,
  ShowcasePage,
  ShowcaseSection,
} from "@/components/styleguide/showcase";

export default function AlertPage() {
  return (
    <ShowcasePage>
      <ShowcaseHeader
        title="Alert"
        description="A static, inline callout for information that needs attention but does not interrupt the flow. For blocking confirmations use Alert Dialog instead."
        importPath={`import {
  Alert,
  AlertTitle,
  AlertDescription,
  AlertAction,
} from "@/components/ui/alert"`}
      />

      <ShowcaseSection title="Variants">
        <div className="flex flex-col gap-8">
          <Demo
            label="Default"
            className="block"
            code={`<Alert>
  <Info />
  <AlertTitle>Firmware update available</AlertTitle>
  <AlertDescription>Controller v2.4 is ready to install.</AlertDescription>
</Alert>`}
          >
            <Alert>
              <Info />
              <AlertTitle>Firmware update available</AlertTitle>
              <AlertDescription>
                Controller v2.4 is ready to install on the East Wing rack.
              </AlertDescription>
            </Alert>
          </Demo>

          <Demo
            label="Destructive"
            className="block"
            code={`<Alert variant="destructive">
  <OctagonX />
  <AlertTitle>Amplifier unreachable</AlertTitle>
  <AlertDescription>No response for 4 minutes.</AlertDescription>
</Alert>`}
          >
            <Alert variant="destructive">
              <OctagonX />
              <AlertTitle>Amplifier unreachable</AlertTitle>
              <AlertDescription>
                Master Theater amp has not responded for 4 minutes.
              </AlertDescription>
            </Alert>
          </Demo>
        </div>
      </ShowcaseSection>

      <ShowcaseSection title="Semantic tinting">
        <Demo
          note="Colour the icon with a semantic token — the surface stays neutral"
          className="block"
          code={`<Alert>
  <CircleCheck className="text-[var(--success)]" />
  <AlertTitle>All zones online</AlertTitle>
</Alert>`}
        >
          <div className="flex w-full flex-col gap-3">
            <Alert>
              <CircleCheck className="text-[var(--success)]" />
              <AlertTitle>All zones online</AlertTitle>
              <AlertDescription>
                12 of 12 zones reporting healthy telemetry.
              </AlertDescription>
            </Alert>
            <Alert>
              <TriangleAlert className="text-[var(--warning)]" />
              <AlertTitle>Bandwidth threshold reached</AlertTitle>
              <AlertDescription>
                Three 4K streams are competing for uplink.
              </AlertDescription>
            </Alert>
            <Alert>
              <Info className="text-[var(--info)]" />
              <AlertTitle>Scheduled maintenance</AlertTitle>
              <AlertDescription>
                Calibration runs tonight at 03:00.
              </AlertDescription>
            </Alert>
          </div>
        </Demo>
      </ShowcaseSection>

      <ShowcaseSection title="With action">
        <Demo
          note="AlertAction pins to the top-right corner"
          className="block"
          code={`<Alert>
  <WifiOff />
  <AlertTitle>Zone dropped off the network</AlertTitle>
  <AlertDescription>Pool array lost its uplink.</AlertDescription>
  <AlertAction>
    <Button size="xs" variant="outline">Retry</Button>
  </AlertAction>
</Alert>`}
        >
          <Alert>
            <WifiOff />
            <AlertTitle>Zone dropped off the network</AlertTitle>
            <AlertDescription>
              The exterior pool array lost its uplink at 21:14.
            </AlertDescription>
            <AlertAction>
              <Button size="xs" variant="outline">
                Retry
              </Button>
            </AlertAction>
          </Alert>
        </Demo>
      </ShowcaseSection>

      <ShowcaseSection title="Title only">
        <Demo className="block">
          <Alert>
            <CircleCheck className="text-[var(--success)]" />
            <AlertTitle>Scene applied — Evening Ambience</AlertTitle>
          </Alert>
        </Demo>
      </ShowcaseSection>

      <ShowcaseSection title="Anatomy">
        <Anatomy
          parts={["Alert", "AlertTitle", "AlertDescription", "AlertAction"]}
        />
      </ShowcaseSection>

      <ShowcaseSection title="Props">
        <PropsTable
          caption="Alert"
          rows={[
            {
              name: "variant",
              type: `"default" | "destructive"`,
              default: `"default"`,
              description:
                "Visual tone. Destructive recolours the title, description and icon with the destructive token.",
            },
            {
              name: "className",
              type: "string",
              description: "Merged onto the root element via cn().",
            },
          ]}
        />
        <p className="text-muted-foreground mt-5 text-[13px] leading-relaxed">
          An <code className="font-mono text-[12px]">svg</code> placed as a
          direct child is picked up automatically and laid out in its own
          column — no wrapper element needed.
        </p>
      </ShowcaseSection>

      <ShowcaseSection title="Accessibility">
        <A11yNotes
          notes={[
            "Alert is a passive region. For messages that appear dynamically, add role=\"alert\" so screen readers announce them.",
            "Do not use for content that requires a response — that is Alert Dialog's job.",
            "Never rely on colour alone: the icon and the title text should both carry the meaning.",
            "Destructive on the card surface measures 4.92:1, above the 4.5:1 minimum for body text.",
          ]}
        />
      </ShowcaseSection>
    </ShowcasePage>
  );
}
