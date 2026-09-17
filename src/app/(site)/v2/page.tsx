import type { Metadata } from "next";

import { HalfMark } from "@/components/motion-ui/half-mark";
import { Hero } from "@/components/sections/v1/hero";
import { Stats } from "@/components/sections/v1/stats";
import { Services } from "@/components/sections/v1/services";
import { Approach } from "@/components/sections/v1/approach";
import { Partners } from "@/components/sections/v1/partners";
import { Showcase } from "@/components/sections/v1/showcase";
import { About } from "@/components/sections/v1/about";
import { Contact } from "@/components/sections/v1/contact";

export const metadata: Metadata = {
  title: "Husky Audio Video, Luxury Smart Home Automation in South Florida",
  description:
    "Custom smart home automation, home cinema, lighting, surveillance and networking for high-end homes across South Florida.",
  robots: { index: false, follow: false },
};

/**
 * Site 1 — the animated variant.
 *
 * Same structure and visual language as the main site; what changes is how much of
 * it moves. Held to one device per section so the page reads as composed rather
 * than as a demo reel:
 *
 *   Hero      FoldText on the accent line
 *   Stats     service area leads, then tenure
 *   Approach  the one scroll-linked passage, lit word by word
 *   Showcase  the page's single photograph, unmasked and drifting
 *
 * Momentum scrolling now comes from the shared site layout rather than from here,
 * so every route gets it.
 */
export default function Site1Page() {
  return (
    <div className="relative">
      <HalfMark />
      <Hero />
      <Stats />
      <Services />
      <Approach />
      <Partners />
      <Showcase />
      <About />
      <Contact />
    </div>
  );
}
