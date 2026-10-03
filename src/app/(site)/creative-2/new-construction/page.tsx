import type { Metadata } from "next";

import { ScrollSceneRoot } from "@/components/motion-ui/scroll-scene-root";
import { Close } from "@/components/sections/creative-2/new-construction/close";
import {
  BUILDERS,
  COST,
  FLORIDA,
  FUTURE,
  INFRASTRUCTURE,
  INVISIBLE,
  META,
  NETWORK,
  PLAN,
  SIMPLICITY,
} from "@/components/sections/creative-2/new-construction/content";
import { Hero } from "@/components/sections/creative-2/new-construction/hero";
import { Passage } from "@/components/sections/creative-2/new-construction/passage";
import { Rooms } from "@/components/sections/creative-2/new-construction/rooms";

export const metadata: Metadata = {
  title: META.title,
  description: META.description,
  openGraph: {
    title: META.ogTitle,
    description: META.ogDescription,
    locale: "en_US",
    type: "article",
  },
  // An alternative presentation of `/new-construction`; keep it out of the index.
  robots: { index: false },
};

/**
 * Creative 2 — New Construction. The philosophy page in the Low Voltage language
 * of `/creative-2`: its type, its cable run down the gutter, its orange close.
 * A text page, so the motion budget is light: nothing pins, nothing scrolls
 * sideways. Copy: `docs/copy-new-construction.md`, all twelve sections in order.
 *
 * Surfaces: dark, one brand-light band at the cost argument, orange at the close.
 * Passages alternate `stack` and `split` so the page has a beat.
 */
export default function Creative2NewConstructionPage() {
  return (
    <ScrollSceneRoot>
      <Hero />
      <Passage copy={PLAN} layout="stack" />
      <Passage copy={INFRASTRUCTURE} />
      <Passage copy={COST} tone="light" />
      <Rooms />
      <Passage copy={INVISIBLE} />
      <Passage copy={FLORIDA} layout="stack" />
      <Passage copy={NETWORK} />
      <Passage copy={FUTURE} layout="stack" />
      <Passage copy={SIMPLICITY} />
      <Passage copy={BUILDERS} layout="stack" />
      <Close />
    </ScrollSceneRoot>
  );
}
