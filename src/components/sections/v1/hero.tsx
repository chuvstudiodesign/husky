import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion-ui/reveal";
import { FoldText } from "@/components/motion-ui/fold-text";
import { SplitText } from "@/components/motion-ui/split-text";

const WHATSAPP = "https://api.whatsapp.com/send?phone=19548648005";

/**
 * Site 1 hero.
 *
 * The angular bracket is gone; the fixed half-mark now lives at the page level so
 * it persists past this section. Copy measure is widened so the lead paragraph
 * doesn't leave a single word stranded on its last line.
 */
export function Hero() {
  return (
    <section
      id="start"
      /* No viewport-height floor at all. It went 92svh → 76svh → gone, and the
         reason it had to go is that a `svh` floor makes the hero's dead space a
         function of the reader's monitor: at 900px tall, 76svh was under the
         content and harmless, but at 1600px it padded the section to 1216 and
         left 400px of empty backdrop between the CTA row and the stats — the
         void the client kept seeing, on a taller screen than the one it was
         tuned on.

         Height is now content plus padding, 716px, the same on every viewport.
         `flex items-center` went with it, because there is no longer any spare
         height to centre in, and `overflow-hidden` went too: the only thing it
         ever clipped was the orange pool. */
      className="bg-background relative"
    >
      {/* The orange pool that used to sit in this corner is gone. It was the
          seam between the hero and the stats band: `radial-gradient(circle, …)`
          defaults to `farthest-corner`, so on a 1008px square box the ray is
          713px, not the 504 the author was sizing against, and the tint was
          still live 72px past the section's bottom edge where `overflow-hidden`
          cut it off in a straight line across the full width.

          It was not worth fixing, because there was nothing to save. Measured
          at 1440x900: the pool's brightest pixel came to rgb(15,13,17) against
          a page of rgb(10,11,16) — five units of red at its peak, under 2% of
          the channel. Deleting the layer removes the seam at every viewport
          instead of at the ones we happened to test, and nothing visible goes
          with it. Client mandate, 2026-09-01.

          The half-mark sits at -z-10 behind all content; this z-30 is redundant but harmless.

          128 top, 128 bottom. The top figure is a floor, not a preference: the
          header is fixed at 80px and overlays the page, so anything under ~112
          puts the eyebrow behind it. The bottom one is the page's rhythm, not
          the hero's: paired with the stats strip's own 48px it makes exactly
          176px between the CTA row and the first numeral — one `.section-y`
          beat at 1440, the same step every other boundary on the page uses.
          The hero's internal air (32/40/48 between eyebrow, headline, lead and
          buttons) stays as tightened. */}
      {/* Below md the whole hero sits on one centred axis — eyebrow, headline,
          lead, CTA pair. Client reference, 2026-09-01 (Dovetail's phone hero).
          The desktop composition is untouched: `md:text-left` hands the block
          back to the left rail at 768, and every centring utility below is
          paired with an `md:` reset. */}
      <div className="section-x relative z-30 mx-auto w-full max-w-7xl pt-32 pb-32 text-center md:text-left">
        <Reveal direction="none" duration={0.8}>
          <p className="eyebrow">Luxury Smart Home Automation</p>
        </Reveal>

        {/* Two lines at every width. The accent phrase is held together with
            `whitespace-nowrap` so it can never split, which makes its rendered
            width — not the balancer — the thing that sets the phone size: the
            19-character phrase measures 7.92× the font size in Outfit, so it
            fits the column exactly when F = (100vw − 48) / 7.92, or 12.63vw
            − 6.06px. `12vw − 6px` sits just under that line and leaves 17–20px
            of slack at 360/390/414 — enough that a hinting difference cannot
            push it into a third line, close enough that the headline still
            reaches the gutter the way the reference does.

            This replaces the old `max-[420px]:text-4xl` step. A flat 36px was
            sized for the narrowest phone and then held all the way to 420,
            which left a 414 screen with a headline 20% narrower than its own
            column — the step-down was solving 360's problem on every phone.

            The 3.5rem ceiling is where the ramp meets `.display-1`'s own clamp:
            56px at 517px of viewport, and 57.6px when 7.5vw takes over at md.
            Leading is the class's own rule, size + 4px, so both `min()`s cross
            at the same width and the offset stays exact across the ramp. */}
        <h1 className="display-1 mx-auto mt-8 max-w-[16ch] text-balance max-md:text-[min(12vw_-_6px,3.5rem)] max-md:leading-[min(12vw_-_2px,3.75rem)] md:mx-0">
          <SplitText by="word" stagger={0.045} delay={0.05}>
            Smart homes,
          </SplitText>{" "}
          {/* No `text-primary` on the second line. A 104px sheet of #EC663D
              across half the headline is not a signal, it is the page's
              largest surface of the accent, and it left the eye nothing to
              follow to the button. The headline is neutral now; scale and
              weight carry the emphasis, which is what they are for.
              `whitespace-nowrap` stays — it is a wrapping constraint, and the
              reason the phrase can never split. */}
          <FoldText
            stagger={0.08}
            delay={0.24}
            className="whitespace-nowrap"
          >
            engineered quietly.
          </FoldText>
        </h1>

        <Reveal delay={0.3} className="mt-10">
          {/* Two measures, one rule: keep the rendered line inside the 45–75
              character band. `ch` is the advance of "0", wider than the average
              lowercase letter, so it runs about 1.48 rendered characters to the
              ch — 42ch is ~62 characters on the desktop, 30ch is ~43 on the
              phone.

              30 sits a couple of characters under the band's 45 floor, and it
              is the right trade here: that floor is a long-form reading rule
              and this is a three-sentence lead on a phone. What the tighter cap
              buys is the composition. 30ch renders 318px, within 2px of the
              headline's own line at 390, so the two centred blocks share an
              edge instead of the lead running wider than the line it supports.
              At 360 the column is narrower than the cap and wraps first — the
              cap is a ceiling, not a fixed width. */}
          <p className="lead mx-auto max-w-[30ch] md:mx-0 md:max-w-[42ch]">
            We design and install the systems that make a high-end home
            effortless, automation, cinema, lighting, sound, security, and the
            network underneath it all.
          </p>
        </Reveal>

        <Reveal delay={0.42} className="mt-12">
          {/* Below md the pair is a two-column grid, not a stack and not a
              flex row. Grid because the requirement is that the two buttons
              share the column exactly — half the usable width each, less half
              of one 12px gap — and a grid track does that arithmetic itself,
              where `flex-1` has to argue with the `shrink-0` the button's own
              base class sets. Each button takes `w-full` to fill its track,
              which is also what releases the fixed 176px box; the height stays
              the size variant's 48px, so the tap target is untouched.

              From md the container is the same flex row it always was and the
              buttons are back to 176px, so nothing about the desktop CTA row
              changes. */}
          <div className="grid grid-cols-2 gap-3 md:flex md:flex-row md:flex-wrap md:items-center md:gap-4">
            {/* No `Magnetic` wrapper. The CTA does not drift toward the cursor:
                a control that moves while you aim at it is the one place on a
                page where motion costs the reader something. Hover feedback
                stays, as a colour shift. Client mandate, 2026-09-01. */}
            <Button asChild size="lg" className="max-md:w-full">
              <a href={WHATSAPP} target="_blank" rel="noopener noreferrer">
                Talk to Us
              </a>
            </Button>
            <Button asChild size="lg" variant="outline" className="max-md:w-full">
              <a href="#services">What We Do</a>
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
