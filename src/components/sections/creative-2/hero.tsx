import Image, { getImageProps } from "next/image";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { RollText } from "@/components/motion-ui/roll-text";
import { HERO } from "@/components/sections/creative-2/content";
import { HeroScene } from "@/components/sections/creative-2/hero-scene";

/**
 * Creative 2 — Hero. A still dusk house behind a dark veil, seen through the
 * Husky mark cut out of it; scrolling grows the cut until the house fills the
 * screen. The house never moves; only the hole does.
 *
 * This file is the server shell: every word of copy and the CTAs render here, in
 * their final state, so the server HTML is the readable page. The pinned frame,
 * the veil and the photo are the client scene (`hero-scene.tsx`),
 * which addresses the copy through `data-hero` hooks.
 *
 * Spec: `docs/creative-versions.md` § 1.
 */
export function Hero() {
  // One URL for both placements (full-bleed on desktop, inside the window on
  // the phone), so the browser fetches the photo once.
  const photo = (
    <Image
      src={HERO.image.src}
      alt=""
      width={HERO.image.width}
      height={HERO.image.height}
      preload
      fetchPriority="high"
      sizes="100vw"
      data-scroll-scene-hero=""
      className="size-full object-cover object-[58%_55%]"
    />
  );
  const { props: phone } = getImageProps({
    src: HERO.image.src,
    alt: "",
    width: HERO.image.width,
    height: HERO.image.height,
    sizes: "100vw",
  });
  const photoPhone = (
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text -- getImageProps output
    <img {...phone} className="size-full object-cover" />
  );

  return (
    <section
      id="home"
      aria-labelledby="home-title"
      className="bg-background @container relative"
    >
      <HeroScene photo={photo} photoPhone={photoPhone}>
        <p
          data-hero="fade"
          className="eyebrow text-muted-foreground group-data-[powered]:text-foreground transition-colors duration-250 ease-[cubic-bezier(0.16,1,0.3,1)]"
        >
          {HERO.eyebrow}
        </p>

        <h1 id="home-title" className="display-1 mt-8">
          {HERO.h1Lines.map((line, i) => (
            <span key={line} data-hero-line={i} className="block">
              {line}
            </span>
          ))}
        </h1>

        <p data-hero="fade" className="lead hero-lead mt-10 max-w-[34ch]">
          {HERO.lead}
        </p>

        <div
          data-hero="fade"
          className="mt-12 flex flex-col gap-2 md:flex-row md:items-center md:gap-6"
        >
          <Button asChild size="lg" className="max-md:w-full md:w-auto md:px-6">
            <a
              href={HERO.primaryCta.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {HERO.primaryCta.label}
              <span className="sr-only"> (WhatsApp, opens in a new tab)</span>
              <ArrowRight
                aria-hidden="true"
                className="transition-transform duration-250 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/button:translate-x-1 group-focus-visible/button:translate-x-1 motion-reduce:transition-none"
              />
            </a>
          </Button>
          <a
            href={HERO.secondaryCta.href}
            className="group text-foreground focus-visible:ring-ring inline-flex h-12 items-center justify-center rounded-lg text-base font-medium outline-none focus-visible:ring-3 md:justify-start"
          >
            <RollText>{HERO.secondaryCta.label}</RollText>
          </a>
        </div>
      </HeroScene>
    </section>
  );
}
