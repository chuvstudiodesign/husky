"use client";

import { MotionConfig } from "motion/react";

/**
 * Applies one motion policy to the whole tree.
 *
 * `reducedMotion="user"` makes every Motion animation respect the OS setting
 * automatically, so individual components don't each have to remember to check.
 * The components still check anyway — this is the floor, not the only guard.
 *
 * Isolated in its own client component so the layouts that use it stay Server
 * Components; children pass straight through and are unaffected.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
