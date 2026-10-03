import type { Metadata } from "next";

import { ScrollSceneRoot } from "@/components/motion-ui/scroll-scene-root";
import { META } from "@/components/sections/creative-1/content";
import { Hero } from "@/components/sections/creative-1/hero";
import { Stats } from "@/components/sections/creative-1/stats";
import { Services } from "@/components/sections/creative-1/services";
import { Approach } from "@/components/sections/creative-1/approach";
import { Partners } from "@/components/sections/creative-1/partners";
import { Showcase } from "@/components/sections/creative-1/showcase";
import { About } from "@/components/sections/creative-1/about";
import { Contact } from "@/components/sections/creative-1/contact";

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
 * Creative 1 — Low Voltage. The page wires the house as you scroll.
 * Direction: `docs/creative-versions.md`.
 */
export default function Creative1Page() {
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
