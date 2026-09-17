"use client";
import { useEffect } from "react";

export function Probe() {
  useEffect(() => {
    const t = setTimeout(() => {
      for (let i = 0; i < 4; i++) {
        window.dispatchEvent(
          new PointerEvent("pointermove", {
            clientX: 560 + i,
            clientY: 183 + i,
            bubbles: true,
          }),
        );
      }
      setTimeout(() => {
        const spans = document.querySelectorAll<HTMLElement>("h1 span span");
        const weights = Array.from(spans).map(
          (s) => s.style.fontVariationSettings,
        );
        document.title = "RM=" + window.matchMedia("(prefers-reduced-motion: reduce)").matches + " N=" + spans.length + " W:" + weights.slice(0, 10).join("|") + " CS:" + (spans[3] ? getComputedStyle(spans[3]).fontVariationSettings + "/" + getComputedStyle(spans[3]).fontFamily : "-");
      }, 400);
    }, 1500);
    return () => clearTimeout(t);
  }, []);
  return null;
}
