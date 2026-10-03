import type { Metadata } from "next";

import { ScrollSceneRoot } from "@/components/motion-ui/scroll-scene-root";
import { META } from "@/components/sections/creative-2/content";
import { Hero } from "@/components/sections/creative-2/hero";
import { Stats } from "@/components/sections/creative-2/stats";
import { Services } from "@/components/sections/creative-2/services";
import { Approach } from "@/components/sections/creative-2/approach";
import { Partners } from "@/components/sections/creative-2/partners";
import { Showcase } from "@/components/sections/creative-2/showcase";
import { About } from "@/components/sections/creative-2/about";
import { Contact } from "@/components/sections/creative-2/contact";

export const metadata: Metadata = {
  title: META.title,
  description: META.description,
  openGraph: {
    title: META.ogTitle,
    description: META.ogDescription,
    locale: "en_US",
    type: "website",
  },
  // An alternative presentation of `/`; keep it out of the index.
  robots: { index: false },
};

/**
 * Creative 2 — Low Voltage, second pass. A copy of /creative-1 with the
 * client's first round of edits; /creative-1 stays as it was.
 * Direction: `docs/creative-versions.md`.
 */
export default function Creative2Page() {
  return (
    <ScrollSceneRoot>
      <Hero />
      <Stats />
      <Services />
      <Approach />
      <Partners />
      <Showcase />
      <About />
      <Contact />
    </ScrollSceneRoot>
  );
}
