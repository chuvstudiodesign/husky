import Image from "next/image";

import { ImageReveal } from "@/components/motion-ui/image-reveal";
import { Parallax } from "@/components/motion-ui/parallax";
import { Reveal } from "@/components/motion-ui/reveal";

/**
 * The page's one photograph.
 *
 * Cropped hard to a wide band rather than shown whole: a strip reads as a
 * considered detail, where a full frame in the middle of a page reads as stock.
 * The image is oversized inside its frame and drifts on a slow parallax, so the
 * crop shifts a little as the band passes — enough to feel alive, not enough to
 * notice as an effect.
 *
 * It unmasks upward on entry instead of fading, so it reads as a frame opening on
 * something already there.
 */
export function Showcase() {
  return (
    <section aria-label="Our work" className="bg-background border-t">
      <div className="section-x section-y mx-auto max-w-[1600px]">
        <Reveal>
          <p className="eyebrow">The result</p>
          <h2 className="display-2 mt-7 max-w-[18ch] text-balance">
            Technology you stop noticing.
          </h2>
        </Reveal>

        <ImageReveal
          direction="up"
          duration={1.2}
          className="mt-14 rounded-lg border"
        >
          <div className="relative h-[42vh] min-h-[280px] overflow-hidden lg:h-[52vh]">
            <Parallax distance={-70} className="absolute inset-0">
              {/* Taller than the frame so the parallax drift never exposes an
                  edge. The height has to be explicit rather than a percentage:
                  Parallax's inner wrapper is auto-height, so a percentage would
                  resolve against zero and collapse the image. */}
              <div className="relative h-[52vh] min-h-[348px] w-full lg:h-[64vh]">
                <Image
                  src="/photos/estate-dusk-01.jpg"
                  alt="A Husky-integrated estate at dusk, interior and landscape lighting on"
                  fill
                  sizes="100vw"
                  className="object-cover"
                />
              </div>
            </Parallax>

            {/* A short scrim at the foot only, so the caption stays legible without
                flattening the photograph. */}
            <div
              aria-hidden
              className="absolute inset-x-0 bottom-0 h-32"
              style={{
                background:
                  "linear-gradient(to top, var(--background), transparent)",
              }}
            />
            <p className="meta absolute bottom-5 left-6">
              Boca Raton · Lighting, audio and surveillance
            </p>
          </div>
        </ImageReveal>
      </div>
    </section>
  );
}
