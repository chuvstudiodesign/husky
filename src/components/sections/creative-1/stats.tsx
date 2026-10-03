import { STATS } from "@/components/sections/creative-1/content";
import { StatsScene } from "@/components/sections/creative-1/stats-scene";

/**
 * Creative 1 — Stats. An instrument calibrating: one measure line draws across the
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
      className="bg-brand-light relative isolate overflow-x-clip"
    >
      <h2 id="stats-title" className="sr-only">
        {STATS.srTitle}
      </h2>
      <StatsScene items={STATS.items} />
    </section>
  );
}
