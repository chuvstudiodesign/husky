import { Marquee } from "@/components/motion-ui/marquee";
import { Reveal } from "@/components/motion-ui/reveal";

/** Copy: docs/copy-home.md § 5. Order is the order in the inventory. */
const PARTNERS = [
  "Cisco",
  "Araknis",
  "Ubiquiti",
  "CommScope",
  "Sonos",
] as const;

/**
 * Partners — the quiet section that follows the loudest one. Back on the
 * `#090A0F` backdrop, so the navy block reads as the page's single tonal spike.
 *
 * We have no logo assets (docs/copy-home.md marks them [NEEDS ASSET]), so the
 * names are typeset rather than faked into pseudo-logos: one display size, one
 * muted tone, a primary diamond between each. A type-set strip reads as
 * deliberate; a row of invented marks reads as a placeholder.
 */
export function Partners() {
  return (
    <section
      id="partners"
      aria-labelledby="partners-heading"
      className="bg-background"
    >
      <div className="section-y mx-auto max-w-7xl">
        <div className="section-x">
          <Reveal direction="up" amount={0.2}>
            <p className="eyebrow">Platforms We Build On</p>
            <h2 id="partners-heading" className="display-2 mt-6 text-balance">
              We install what we can stand behind.
            </h2>
          </Reveal>
        </div>

        {/* Full-bleed within the container: the strip should run past the text
            gutter, which is what makes it read as a strip rather than a list. */}
        <Reveal direction="up" delay={0.1} amount={0.1} className="mt-16 md:mt-20">
          <Marquee speed={45} fade>
            <ul className="flex list-none items-center">
              {PARTNERS.map((name) => (
                <li key={name} className="flex items-center">
                  <span className="display-2 px-10 font-semibold text-muted-foreground/60 md:px-16">
                    {name}
                  </span>
                  <span
                    aria-hidden
                    className="size-1.5 rotate-45 bg-primary/60"
                  />
                </li>
              ))}
            </ul>
          </Marquee>
        </Reveal>

        <div className="section-x">
          {/* [VERIFY: certification status and current brand list] — the bracket
              marker stays in source for the client review, never in the DOM. */}
          <p className="body-text mx-auto mt-14 text-center">
            Husky works with the leading platforms in the industry and is
            certified to work with their systems.
          </p>
        </div>
      </div>
    </section>
  );
}
