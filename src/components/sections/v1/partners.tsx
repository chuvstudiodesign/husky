import { Marquee } from "@/components/motion-ui/marquee";
import { Reveal } from "@/components/motion-ui/reveal";
import { SectionSeam } from "@/components/sections/section-seam";

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
      className="bg-background relative"
    >
      {/* Light back to dark, the return half of the pair that opened the
          Approach band, so the light interlude is bracketed by the same joint
          at both ends. */}
      <SectionSeam rise="fill-background" fall="fill-brand-light" />
      <div className="section-y mx-auto max-w-7xl">
        {/* The whole section shares one centred axis — eyebrow, heading and
            caption — on the client's call (2026-09-01). The marquee below stays
            full-bleed, which is what it was already doing: a strip cut at both
            edges is symmetrical about the same axis by construction. */}
        <div className="section-x text-center">
          <Reveal direction="up" amount={0.2}>
            <p className="eyebrow">Platforms We Build On</p>
            <h2
              id="partners-heading"
              className="display-2 mx-auto mt-6 max-w-[22ch] text-balance"
            >
              We install what we can stand behind.
            </h2>
          </Reveal>

          {/* [VERIFY: certification status and current brand list] — the bracket
              marker stays in source for the client review, never in the DOM.

              The caption sits with the heading, above the strip, on the
              client's call (2026-09-01): eyebrow, heading, caption, then the
              names. The spacing says the same thing the order does — 32px binds
              it to the heading it qualifies, and 96px (112 from md) sets the
              strip apart as the next movement.

              `max-w-none`, because the 46ch cap `.body-text` ships is right for
              a paragraph and wrong for a one-sentence caption, which it split
              across two lines at every width. At 98 characters the line
              measures ~700px against 1152px of container, so it sits on one
              line from about 780px up and wraps on its own below that.
              `text-balance` only does anything once it wraps, where it evens
              the rag on the phone. */}
          <Reveal direction="up" delay={0.1} amount={0.2}>
            {/* `.lead`, not `.body-text`: this paragraph now sits directly
                under the section heading, and the page holds one register for
                that position everywhere. */}
            <p className="lead mt-8 max-w-none text-center text-balance">
              Husky works with the leading platforms in the industry and is
              certified to work with their systems.
            </p>
          </Reveal>
        </div>

        {/* Two presentations of one list, chosen by the viewer's motion
            preference.

            Moving: full-bleed within the container. The strip runs past the text
            gutter and gets cut at the edges, which is what makes it read as a
            strip rather than a list.

            Reduced: a static row, inset to the same gutter as the heading. It
            borrows `.section-x` for that inset rather than restating the clamp,
            and `motion-safe:px-0` takes it back off when the strip scrolls — the
            utility layer outranks the component layer, so one class does the
            whole switch.

            The rest of the reduced-motion row follows from one fact: a strip
            that has stopped is a list, and a list that wraps cannot be separated
            by an inline glyph. The diamond only ever sits between two names
            while the row is one line; wrapped, it lands at the end of a row with
            nothing after it — the same dangling separator the moving strip left
            at the viewport edge. So under reduced motion the space does the
            separating, the padding that spaced the moving names comes off so the
            first name starts on the gutter, and the type steps down to a size
            five names actually fit at: 24px on a phone, 36px from lg. At the
            strip's own 60px they do not fit any width we ship.

            One thing the reduced row was missing: the axis. Everything above it
            — eyebrow, heading, caption — is centred, and a wrapped list ragging
            off the left gutter under a centred heading reads as two blocks
            rather than one section. `justify-center` puts the names back on the
            same axis, and it is scoped to `motion-reduce` because the moving
            strip is full-bleed and has no axis to join. */}
        <Reveal direction="up" delay={0.2} amount={0.1} className="mt-24 md:mt-28">
          <Marquee speed={45} fade className="section-x motion-safe:px-0">
            <ul className="flex list-none items-center motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:gap-x-12 motion-reduce:gap-y-5">
              {PARTNERS.map((name) => (
                <li key={name} className="flex items-center">
                  <span className="display-2 font-semibold text-muted-foreground/60 motion-safe:px-10 motion-reduce:text-2xl motion-safe:md:px-16 motion-reduce:lg:text-4xl">
                    {name}
                  </span>
                  {/* Muted, not orange. Five of these ride past in the strip
                      and none of them is an action; a repeating accent glyph
                      is decoration spending the signal budget. */}
                  <span
                    aria-hidden
                    className="size-1.5 rotate-45 bg-muted-foreground/50 motion-reduce:hidden"
                  />
                </li>
              ))}
            </ul>
          </Marquee>
        </Reveal>

      </div>
    </section>
  );
}
