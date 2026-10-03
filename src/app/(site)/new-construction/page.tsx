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
};

/**
 * New Construction. The philosophy page in the Low Voltage language of the
 * home page (promoted from `/creative-2/new-construction`, 2026-10-03; earlier
 * versions are archived at `/new-construction-v2` and `-v3`): its type, its cable run down the gutter, its orange close.
 * A text page, so the motion budget is light: nothing pins, nothing scrolls
 * sideways. Copy: `docs/copy-new-construction.md`, all twelve sections in order.
 *
 * Surfaces: dark, one brand-light band at the cost argument, orange at the close.
 * Passages alternate `stack` and `split` so the page has a beat.
 */
export default function NewConstructionPage() {
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
