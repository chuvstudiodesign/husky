import { STATS } from "@/components/sections/creative-2/content";
import { StatsScene } from "@/components/sections/creative-2/stats-scene";

/**
 * Creative 2 — Stats. An instrument calibrating: one measure line draws across the
 * light band and each figure reads out as the line's head passes it.
 *
 * The section is the light surface. Everything inside it — the pinned frame, the
 * cable segment, the readout — is the client scene; the server render is the
 * final, readable readout (fully drawn line, final figures).
 *
 * Spec: `docs/creative-versions.md` § 2.
 */
export function Stats() {
  return (
    <section
      id="stats"
      aria-labelledby="stats-title"
      /* The clip and the stacking context are desktop's, for the pinned
         readout. On the phone the stage sticks, and iOS Safari only keeps a
         sticky box on the compositor when no ancestor clips it on one axis:
         with `overflow-x-clip` here the stage was re-placed from the main
         thread a frame late and the whole band shook as it scrolled. The
         stage clips its own row there, as Services' does. */
      className="bg-brand-light relative md:isolate md:overflow-x-clip"
    >
      <h2 id="stats-title" className="sr-only">
        {STATS.srTitle}
      </h2>
      <StatsScene items={STATS.items} />
    </section>
  );
}
