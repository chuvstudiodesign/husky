import { Marquee } from "@/components/motion-ui/marquee";
import {
  A11yNotes, Anatomy, Demo, PropsTable,
  ShowcaseHeader, ShowcasePage, ShowcaseSection,
} from "@/components/styleguide/showcase";

const brands = ["Cisco", "Araknis", "Ubiquiti", "CommScope", "Sonos"];

function Names() {
  return (
    <>
      {brands.map((b) => (
        <span key={b} className="display-3 text-muted-foreground/60 px-10">
          {b}
        </span>
      ))}
    </>
  );
}

export default function MarqueePage() {
  return (
    <ShowcasePage>
      <ShowcaseHeader
        title="Marquee"
        description="A continuously scrolling strip. Duplicates its children once and translates the pair by exactly half, so the loop has no visible seam. Used for the partner platforms, where no logo assets exist."
        importPath={`import { Marquee } from "@/components/motion-ui/marquee"`}
      />

      <ShowcaseSection title="Default">
        <Demo
          className="block px-0"
          code={`<Marquee speed={40}>
  {names}
</Marquee>`}
        >
          <Marquee speed={40}>
            <Names />
          </Marquee>
        </Demo>
      </ShowcaseSection>

      <ShowcaseSection title="Reversed and slower">
        <Demo className="block px-0" code={`<Marquee speed={70} reverse />`}>
          <Marquee speed={70} reverse>
            <Names />
          </Marquee>
        </Demo>
      </ShowcaseSection>

      <ShowcaseSection title="Without edge fade">
        <Demo className="block px-0" code={`<Marquee fade={false} />`}>
          <Marquee speed={40} fade={false}>
            <Names />
          </Marquee>
        </Demo>
      </ShowcaseSection>

      <ShowcaseSection title="Anatomy">
        <Anatomy parts={["Marquee"]} />
      </ShowcaseSection>

      <ShowcaseSection title="Props">
        <PropsTable
          rows={[
            { name: "speed", type: "number", default: "40", description: "Seconds for one full pass. Higher is slower." },
            { name: "reverse", type: "boolean", default: "false", description: "Travel right instead of left." },
            { name: "pauseOnHover", type: "boolean", default: "true", description: "Stop while the pointer is over the strip." },
            { name: "fade", type: "boolean", default: "true", description: "Dissolve at both edges instead of cutting. Almost always keep this on." },
          ]}
        />
      </ShowcaseSection>

      <ShowcaseSection title="Accessibility">
        <A11yNotes
          notes={[
            "This is the only infinite loop in the system, and it stops entirely under prefers-reduced-motion. Continuous movement is a real problem for vestibular sensitivity, not a preference.",
            "It also pauses on hover by default, so anyone can stop it to read.",
            "The duplicated half is aria-hidden, so the content is announced once rather than twice.",
            "Wrap genuine content — brand names are content — in a real list so it is announced as a set. Do not put anything here that a reader must catch, since it moves out of view.",
            "It runs on a CSS animation, not JS, so it costs nothing per frame.",
          ]}
        />
      </ShowcaseSection>
    </ShowcasePage>
  );
}
