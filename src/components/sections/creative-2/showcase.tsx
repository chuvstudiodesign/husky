import { ShowcaseScene } from "@/components/sections/creative-2/showcase-scene";

/**
 * Creative 2 — Showcase `#showcase`. "Technology you stop noticing." The house
 * first appears annotated with its systems, like a drawing; then the annotations
 * undraw and the lights come up until only the house is left.
 *
 * The section pins (≥ md, motion allowed), so the section element itself is owned
 * by the client scene (`showcase-scene.tsx`); copy comes from `content.ts`.
 * Spec: `docs/creative-versions.md` § 6.
 */
export function Showcase() {
  return <ShowcaseScene />;
}
