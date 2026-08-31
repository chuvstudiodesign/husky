import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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

export default function AlertDialogPage() {
  return (
    <ShowcasePage>
      <ShowcaseHeader
        title="Alert Dialog"
        description="A modal that interrupts the user and expects a response. Reserve it for consequential, hard-to-undo actions — resetting a rack, wiping a scene, dropping a zone."
        importPath={`import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"`}
      />

      <ShowcaseSection title="Default">
        <Demo
          note="Click the trigger to open"
          code={`<AlertDialog>
  <AlertDialogTrigger asChild>
    <Button variant="outline">Reset rack</Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Reset the East Wing rack?</AlertDialogTitle>
      <AlertDialogDescription>
        All zones will drop for roughly 90 seconds.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction>Reset</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>`}
        >
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline">Reset rack</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Reset the East Wing rack?</AlertDialogTitle>
                <AlertDialogDescription>
                  All twelve zones will drop for roughly 90 seconds while the
                  controller reboots. Active playback will not resume
                  automatically.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction>Reset</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </Demo>
      </ShowcaseSection>

      <ShowcaseSection title="Destructive action">
        <Demo
          note="Style the confirm button, not the dialog"
          code={`<AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
  Delete scene
</AlertDialogAction>`}
        >
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Delete scene</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Delete “Evening Ambience”?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  This macro is referenced by two schedules. Deleting it removes
                  those triggers as well. This cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Keep scene</AlertDialogCancel>
                <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Delete scene
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </Demo>
      </ShowcaseSection>

      <ShowcaseSection title="Anatomy">
        <Anatomy
          parts={[
            "AlertDialog",
            "AlertDialogTrigger",
            "AlertDialogPortal",
            "AlertDialogOverlay",
            "AlertDialogContent",
            "AlertDialogHeader",
            "AlertDialogMedia",
            "AlertDialogTitle",
            "AlertDialogDescription",
            "AlertDialogFooter",
            "AlertDialogCancel",
            "AlertDialogAction",
          ]}
        />
      </ShowcaseSection>

      <ShowcaseSection title="Props">
        <PropsTable
          caption="AlertDialog (root)"
          rows={[
            {
              name: "open",
              type: "boolean",
              description: "Controlled open state. Pair with onOpenChange.",
            },
            {
              name: "onOpenChange",
              type: "(open: boolean) => void",
              description: "Fires when the dialog opens or closes.",
            },
            {
              name: "defaultOpen",
              type: "boolean",
              default: "false",
              description: "Initial state when uncontrolled.",
            },
          ]}
        />
        <div className="mt-8">
          <PropsTable
            caption="AlertDialogTrigger / Cancel / Action"
            rows={[
              {
                name: "asChild",
                type: "boolean",
                default: "false",
                description:
                  "Merge props onto the child instead of rendering a button. Use it to trigger from your own Button.",
              },
            ]}
          />
        </div>
      </ShowcaseSection>

      <ShowcaseSection title="Accessibility">
        <A11yNotes
          notes={[
            "Renders with role=\"alertdialog\" and traps focus inside the content while open.",
            "Focus moves to AlertDialogCancel on open — the safe choice is the default.",
            "Escape closes the dialog and returns focus to the trigger.",
            "Unlike Dialog, clicking the overlay does not dismiss it — the user must choose explicitly.",
            "AlertDialogTitle is required; it is wired to aria-labelledby. AlertDialogDescription feeds aria-describedby.",
          ]}
        />
      </ShowcaseSection>
    </ShowcasePage>
  );
}
