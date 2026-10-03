"use client";

import { useRef } from "react";

import { SCRUB, gsap } from "@/components/motion-ui/gsap-setup";
import { ScrubOdometer, addOdometer } from "@/components/motion-ui/scrub-odometer";
import { useScrollScene } from "@/components/motion-ui/use-scroll-scene";

const FIGURES = [
  { value: "20", suffix: "+", label: "YEARS OF INTEGRATION" },
  { value: "8", label: "SYSTEMS WE INSTALL" },
  { value: "5", label: "PARTNER PLATFORMS" },
];

export function OdometerDemo() {
  const ref = useRef<HTMLDListElement>(null);

  const build = () => {
    const root = ref.current;
    if (!root) return;
    const tl = gsap.timeline({
      scrollTrigger: { trigger: root, start: "top 85%", end: "top 35%", scrub: SCRUB },
    });
    root.querySelectorAll("[data-scrub-odometer]").forEach((el, i) => {
      addOdometer(tl, el, i * 0.15, 1);
    });
  };

  useScrollScene(ref, { desktop: build, mobile: build });

  return (
    <dl ref={ref} className="grid w-full grid-cols-1 gap-12 md:grid-cols-3">
      {FIGURES.map((f) => (
        <div key={f.label} className="flex flex-col-reverse gap-4">
          <dt className="eyebrow text-muted-foreground">{f.label}</dt>
          <dd>
            <ScrubOdometer value={f.value} suffix={f.suffix} className="display-1" />
          </dd>
        </div>
      ))}
    </dl>
  );
}
