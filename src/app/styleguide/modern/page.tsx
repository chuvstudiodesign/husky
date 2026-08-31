import Link from "next/link";

import {
  A11yNotes,
  ShowcaseHeader,
  ShowcasePage,
  ShowcaseSection,
} from "@/components/styleguide/showcase";

const components = [
  {
    name: "Reveal",
    href: "/styleguide/modern/reveal",
    line: "Fades and lifts a block into place the first time it scrolls into view.",
    from: "React Bits · Motion whileInView",
  },
  {
    name: "Split Text",
    href: "/styleguide/modern/split-text",
    line: "Reveals a headline word by word on a short stagger.",
    from: "React Bits SplitText · GSAP SplitText",
  },
  {
    name: "Counter",
    href: "/styleguide/modern/counter",
    line: "Counts up to a figure when it enters view, easing into the landing.",
    from: "React Bits CountUp",
  },
  {
    name: "Marquee",
    href: "/styleguide/modern/marquee",
    line: "A seamless scrolling strip, used for the partner platforms.",
    from: "Cult UI · Magic UI marquee",
  },
  {
    name: "Spotlight Card",
    href: "/styleguide/modern/spotlight-card",
    line: "A panel whose surface and border catch a highlight tracking the cursor.",
    from: "React Bits SpotlightCard",
  },
  {
    name: "Magnetic",
    href: "/styleguide/modern/magnetic",
    line: "Pulls a control a short distance toward the cursor, then springs back.",
    from: "Common in award-site interaction kits",
  },
  {
    name: "Half Mark",
    href: "/styleguide/modern/half-mark",
    line: "The Husky wolf bisected by the edge of the frame, fixed and reacting to scroll.",
    from: "Figma — 01 Logo System",
  },
  {
    name: "Smooth Scroll",
    href: "/styleguide/modern/smooth-scroll",
    line: "Momentum scrolling that interpolates the native position instead of replacing it.",
    from: "Lenis",
  },
  {
    name: "Parallax",
    href: "/styleguide/modern/parallax",
    line: "Drifts a child as its block passes through the viewport.",
    from: "Skiper UI parallax scenes",
  },
  {
    name: "Text Reveal Scroll",
    href: "/styleguide/modern/text-reveal-scroll",
    line: "A passage that brightens word by word as the reader scrolls through it.",
    from: "Skiper UI text reveal · GSAP ScrollTrigger",
  },
  {
    name: "Image Reveal",
    href: "/styleguide/modern/image-reveal",
    line: "Unmasks an image from one edge as it enters view.",
    from: "Skiper UI image reveal",
  },
  {
    name: "Fold Text",
    href: "/styleguide/modern/fold-text",
    line: "A headline folding into place, each word rotating up from flat.",
    from: "React Bits FoldText",
  },
  {
    name: "Grain",
    href: "/styleguide/modern/grain",
    line: "A few percent of film noise over the page, to stop dark surfaces banding.",
    from: "Editorial / print-inspired overlays",
  },
];

export default function ModernOverviewPage() {
  return (
    <ShowcasePage>
      <ShowcaseHeader
        title="Modern Components"
        description="Thirteen motion components built for the marketing site. Each takes a pattern from a contemporary React library and rebuilds it against the Husky token contract — so nothing here carries a colour, radius or typeface that isn't already in the design system."
        importPath={`import { Reveal } from "@/components/motion-ui/reveal"
// …each lives in its own file under src/components/motion-ui/`}
      />

      <ShowcaseSection title="The collection">
        <ul className="flex flex-col">
          {components.map((c, i) => (
            <li key={c.name}>
              <Link
                href={c.href}
                className="hover:bg-card group -mx-5 flex flex-col gap-2 rounded-lg px-5 py-7 transition-colors sm:flex-row sm:items-baseline sm:gap-8"
                style={i > 0 ? { borderTop: "1px solid var(--border)" } : {}}
              >
                <span className="display-3 group-hover:text-primary w-52 shrink-0 transition-colors">
                  {c.name}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="body-text block text-sm">{c.line}</span>
                  <span className="meta mt-2 block">{c.from}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </ShowcaseSection>

      <ShowcaseSection title="Two rules they all share">
        <div className="flex flex-col gap-8">
          <div className="bg-card rounded-lg border p-8">
            <p className="eyebrow">Rule 01</p>
            <h3 className="display-3 mt-4">
              Content is never withheld pending hydration.
            </h3>
            <p className="body-text mt-4 text-sm">
              The hidden starting state lives in CSS behind an{" "}
              <code className="font-mono text-[12px]">html.js</code> guard, and
              that class is set by a blocking inline script in the root layout.
              So the server sends fully visible markup: if scripts fail, are
              blocked, or simply haven&apos;t run, the text is there and
              readable. Only once JS is confirmed does anything hide — and it
              hides before first paint, so there is no flash either.
            </p>
            <p className="body-text mt-3 text-sm">
              This is the difference between a reveal animation and a page that
              is blank without JavaScript. Verified: the home page ships 3
              elements at{" "}
              <code className="font-mono text-[12px]">opacity:0</code> in its
              server HTML, all of them decorative overlays — down from 46 before
              this was fixed.
            </p>
          </div>

          <div className="bg-card rounded-lg border p-8">
            <p className="eyebrow">Rule 02</p>
            <h3 className="display-3 mt-4">
              Transform and opacity only, and reduced motion is respected.
            </h3>
            <p className="body-text mt-4 text-sm">
              Nothing animates a property that forces layout or paint, so every
              transition stays on the compositor. Where a component runs a loop
              or a per-frame update — the marquee, the counter — it writes to CSS
              custom properties or{" "}
              <code className="font-mono text-[12px]">textContent</code> rather
              than through React state, so moving the cursor or counting to
              twenty never triggers a render.
            </p>
            <p className="body-text mt-3 text-sm">
              Every component honours{" "}
              <code className="font-mono text-[12px]">
                prefers-reduced-motion
              </code>
              , and the site wraps the tree in{" "}
              <code className="font-mono text-[12px]">
                MotionConfig reducedMotion=&quot;user&quot;
              </code>{" "}
              as a floor beneath that.
            </p>
          </div>
        </div>
      </ShowcaseSection>

      <ShowcaseSection title="Accessibility">
        <A11yNotes
          notes={[
            "Decorative components — HalfMark, Grain, ScrollProgress — are aria-hidden and carry no semantics. Nothing depends on seeing them.",
            "SplitText keeps the whole string as an aria-label, so a screen reader reads a sentence rather than a pile of word fragments.",
            "Counter exposes the final value as its accessible name; assistive technology never reads a ticking number.",
            "Marquee is the one infinite loop in the system. It stops on hover and stops entirely under reduced motion — continuous movement is a genuine problem for vestibular sensitivity, not a taste question.",
            "Magnetic never gates anything: the child stays a real focusable button or link, and the effect is skipped for keyboard and touch.",
          ]}
        />
      </ShowcaseSection>
    </ShowcasePage>
  );
}
