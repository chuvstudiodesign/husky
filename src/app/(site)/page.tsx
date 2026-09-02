import type { Metadata } from "next";

import { HalfMark } from "@/components/motion-ui/half-mark";
import { Hero } from "@/components/sections/hero";
import { Stats } from "@/components/sections/stats";
import { Services } from "@/components/sections/services";
import { Approach } from "@/components/sections/approach";
import { Partners } from "@/components/sections/partners";
import { About } from "@/components/sections/about";
import { Contact } from "@/components/sections/contact";

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
 * One background for the whole page, and two deliberate exceptions:
 *   Hero        #090A0F  background
 *   Stats       #090A0F  background — the map photograph is its backdrop, and
 *                        it fades into this colour before it reaches the cards
 *   Services    #090A0F  background — the eight tiles are the cards
 *   Approach    #DFDFDF  brand light, the one bright band
 *   Partners    #090A0F  background
 *   About       #090A0F  background — the facts panel is the card
 *   Contact     #EC663D  primary, maximum contrast and the arrival
 *
 * The pulse comes from the two exceptions and from the section padding between
 * bands, not from alternating the backdrop every screen. Nothing is ruled: no
 * section on this page carries a hairline at its boundary.
 *
 * The half-mark is fixed at page level rather than inside the hero, so it persists
 * the whole way down and repaints dark as it crosses the light band.
 */
export default function HomePage() {
  return (
    <div className="relative">
      {/* On phones the resting mark drops 30% of its own height below centre,
          clearing the hero copy. The docked corner badge is unaffected. */}
      <HalfMark mobileDrop={30} />
      <Hero />
      <Stats />
      <Services />
      {/* Proof before process: the platform strip answers "who do they work
          with" right after the services make the claim, and the light Approach
          band then opens the planning argument with that proof behind it.
          Reordered 2026-09-02 on the landing-page structure review. */}
      <Partners />
      <Approach />
      <About />
      <Contact />
    </div>
  );
}
