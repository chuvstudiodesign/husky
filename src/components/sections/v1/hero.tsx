import { ArrowDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Magnetic } from "@/components/motion-ui/magnetic";
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
      className="bg-background relative flex min-h-[92svh] items-center overflow-hidden"
    >
      {/* One soft pool of brand light behind the headline, so the corner has depth
          without a gradient wash across the whole section. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-1/4 -left-1/4 size-[70vw] rounded-full opacity-[0.07]"
        style={{
          background:
            "radial-gradient(circle, var(--primary) 0%, transparent 65%)",
        }}
      />

      {/* z-30 keeps the headline above the fixed half-mark at z-20. */}
      <div className="section-x relative z-30 mx-auto w-full max-w-[1600px] pt-32 pb-24">
        <Reveal direction="none" duration={0.8}>
          <p className="eyebrow">Luxury Smart Home Automation</p>
        </Reveal>

        <h1 className="display-1 mt-8 max-w-[16ch] text-balance">
          <SplitText by="word" stagger={0.045} delay={0.05}>
            Smart homes,
          </SplitText>{" "}
          <FoldText stagger={0.08} delay={0.24} className="text-primary">
            engineered quietly.
          </FoldText>
        </h1>

        <Reveal delay={0.3} className="mt-10">
          {/* Phones: half width, so the fixed half-mark at the right edge never
              runs under the copy. From sm up the mark is clear of the text and the
              measure opens to 62ch — wider than the class default, because at 52ch
              "all" fell alone onto the last line. */}
          <p className="lead max-w-[50%] sm:max-w-[62ch]">
            We design and install the systems that make a high-end home
            effortless, automation, cinema, lighting, sound, security, and the
            network underneath it all.
          </p>
        </Reveal>

        <Reveal delay={0.42} className="mt-12">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:flex-wrap sm:items-center">
            <Magnetic strength={0.2}>
              <Button asChild size="lg" className="h-12 px-7 text-[15px]">
                <a href={WHATSAPP} target="_blank" rel="noopener noreferrer">
                  Request a Consultation
                </a>
              </Button>
            </Magnetic>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 px-7 text-[15px]"
            >
              <a href="#services">See What We Do</a>
            </Button>
          </div>
        </Reveal>

        <Reveal delay={0.54} className="mt-24">
          <div className="flex items-center gap-4">
            <ArrowDown className="text-primary size-4" />
            <span className="meta">Boca Raton · Serving South Florida</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
