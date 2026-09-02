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
      className="bg-background relative"
    >
      {/* No seam: this band follows Services on the same `--background`, and
          the joint only appears where the colour changes. The light Approach
          band now comes after this one and carries its own seam. */}
      <div className="section-y">
        {/* The whole section shares one centred axis — eyebrow, heading and
            caption — on the client's call (2026-09-01). The text block keeps the
            page container; the marquee below is a sibling at section width, so
            the strip is cut by the viewport rather than by the container. A strip
            cut at both edges is symmetrical about the same axis by
            construction. */}
        <div className="section-x mx-auto max-w-7xl text-center">
          <Reveal direction="up" amount={0.2}>
            <p className="eyebrow">Platforms We Build On</p>
            {/* `max-w-none`, because the old 22ch cap wrapped this sentence at
                every width and the client asked for one line wherever one line
                fits (2026-09-01). Measured: the sentence sets to 914px at the
                60px ceiling — 15.2em — against 1152px of content inside
                `max-w-7xl` less the `section-x` gutter. Below 1280 both sides
                scale with the viewport (type at 4.5vw, content at 90vw), so the
                line needs 68vw of 90vw and still fits; it only wraps under about
                540px, where the type has hit its 32px floor. `text-balance` is
                for exactly that case — on the phone, and nowhere else. */}
            <h2 id="partners-heading" className="display-2 mt-6 text-balance">
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

            Moving: full-bleed to the viewport. The strip sits outside
            `max-w-7xl` on purpose — inside it, everything past 1280px cut the
            names at the container edge with page background either side, which
            reads as a clipped box rather than a strip. `w-full` on a section-level
            block does the whole job; no `w-screen` and no negative-margin trick,
            both of which buy a scrollbar the moment one appears.

            Reduced: a static row, inset to the same gutter as the heading. It
            borrows `.section-x` for that inset rather than restating the clamp,
            and `motion-safe:px-0` takes it back off when the strip scrolls — the
            utility layer outranks the component layer, so one class does the
            whole switch. That trick survives the move unchanged: the gutter it
            applies is the same clamp the text block gets, and the names are
            centred on the viewport axis, which is the container's axis too.

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
            strip is full-bleed and has no axis to join. It needs
            `motion-reduce:w-full` beside it to do anything: the list is a flex
            item, so it was sized to its content and centring five names inside
            their own bounding box moves nothing. Unwrapped, the row simply began
            at the gutter. Full width, the axis is real. */}
        <Reveal direction="up" delay={0.2} amount={0.1} className="mt-24 md:mt-28">
          <Marquee speed={45} fade className="section-x motion-safe:px-0">
            <ul className="flex list-none items-center motion-reduce:w-full motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:gap-x-12 motion-reduce:gap-y-5">
              {PARTNERS.map((name) => (
                <li key={name} className="flex items-center">
                  {/* On the phone the moving strip leaves the type scale, on the
                      client's call (2026-09-01): the names were to fill about
                      80% of the screen as they ride past, and `.display-2` bottoms
                      out at 32px, roughly a third of that. `16vw` rather than a px
                      size, so the proportion holds across phone widths instead of
                      landing at 80% on one handset.

                      Why 16 and not the 20 that would put the average name at a
                      literal 80vw: the names run 2.28em (Cisco) to 5.47em
                      (CommScope), a 2.4× spread, so no single size gives all five
                      the same share. 16vw sets the average name plus its gutters
                      at ~78vw of a 390 screen and keeps the longest one at 87vw —
                      readable whole at the moment it passes. At 20vw, "CommScope"
                      would be 123vw and cut at both edges at once, which is a name
                      nobody can read. Everything from `md` up is untouched.

                      The `min()` is the ceiling for the top of this range. `max-md`
                      runs to 767px, and 16vw of 767 is 123px of type in a 130px
                      strip — a phone rule applied to a tablet. 72px is 16vw of a
                      450px screen, so every real phone is still pure 16vw and only
                      the small tablets flatten out.

                      Leading has to come with the size: `.display-2` sets it at
                      size + 4px from the same clamp, and left alone the 36px line
                      box would guillotine a 62px glyph inside the strip's
                      `overflow-hidden`. `calc(1em+4px)` is that same rule written
                      so it follows a fluid size. */}
                  <span className="display-2 font-semibold text-muted-foreground motion-safe:px-10 motion-reduce:text-2xl motion-safe:max-md:text-[min(16vw,72px)] motion-safe:max-md:leading-[calc(1em+4px)] motion-safe:md:px-16 motion-reduce:lg:text-4xl">
                    {name}
                  </span>
                  {/* Muted, not orange. Five of these ride past in the strip
                      and none of them is an action; a repeating accent glyph
                      is decoration spending the signal budget.

                      6px against 32px type is 0.19em; against the phone strip's
                      62px it would be a speck, so it steps to 12px there and
                      holds the same ratio. Still on the 4-grid — an `em` value
                      would hold the ratio exactly and land off it. */}
                  <span
                    aria-hidden
                    className="size-1.5 rotate-45 bg-muted-foreground/50 motion-safe:max-md:size-3 motion-reduce:hidden"
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
