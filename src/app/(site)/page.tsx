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
};

/**
 * The home page. This is "Creative 2 — Low Voltage", promoted to `/` on the
 * client's call (2026-10-03); its sections still live under
 * `components/sections/creative-2`. The earlier versions are archived at
 * `/site-v2` … `/site-v7`, out of the index.
 * Direction: `docs/creative-versions.md`.
 */
export default function HomePage() {
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
