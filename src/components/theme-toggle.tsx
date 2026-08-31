"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * The `dark` class on <html> is the external store here — the root layout ships
 * with it applied, since #090A0F is the spec'd system backdrop (Figma 08 —
 * Section System, Rule 01). Light is the "on light / on grey" counterpart from
 * the logo sheet.
 */
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  return () => observer.disconnect();
}

const getSnapshot = () => document.documentElement.classList.contains("dark");
const getServerSnapshot = () => true;

export function ThemeToggle() {
  const isDark = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  function toggle() {
    document.documentElement.classList.toggle("dark", !isDark);
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggle}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      className="gap-2"
    >
      {isDark ? <Moon className="size-4" /> : <Sun className="size-4" />}
      <span className="text-system text-[11px]">{isDark ? "Dark" : "Light"}</span>
    </Button>
  );
}
