import type { Metadata } from "next";

import { HalfMark } from "@/components/motion-ui/half-mark-v3";
import { Hero } from "@/components/sections/v3/hero";
import { Stats } from "@/components/sections/v3/stats";
import { Services } from "@/components/sections/v3/services";
import { Approach } from "@/components/sections/v3/approach";
import { Partners } from "@/components/sections/v3/partners";
import { About } from "@/components/sections/v3/about";
import { Contact } from "@/components/sections/v3/contact";

export const metadata: Metadata = {
  title: "Husky Audio Video, Luxury Smart Home Automation in South Florida",
  description:
    "Custom smart home automation, home cinema, lighting, surveillance and networking for high-end homes across South Florida. Over 20 years of custom integration experience.",
  openGraph: {
    title: "Husky Audio Video, Luxury Smart Home Automation",
    description:
      "Custom smart home automation, home cinema, lighting, surveillance and networking for high-end homes across South Florida.",
    locale: "en_US",
    type: "website",
  },
};

/**
 * Section order is the argument: what we do, why you should believe it, the
 * systems, how we think, who we build on, who we are, how to reach us.
 *
 * The background alternates deliberately so the page has a pulse rather than one
 * uniform tone:
 *   Hero        #090A0F  background
 *   Stats       #090A0F  background, hairline-separated
 *   Services    #11131C  card
 *   Approach    #DFDFDF  brand light, the one bright band
 *   Partners    #090A0F  background
 *   About       #11131C  card
 *   Contact     #EC663D  primary, maximum contrast and the arrival
 *
 * The half-mark is fixed at page level rather than inside the hero, so it persists
 * the whole way down and repaints dark as it crosses the light band.
 */
export default function HomePage() {
  return (
    <div className="relative">
      <HalfMark />
      <Hero />
      <Stats />
      <Services />
      <Approach />
      <Partners />
      <About />
      <Contact />
    </div>
  );
}
