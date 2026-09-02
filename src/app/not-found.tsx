import type { Metadata } from "next";
import Link from "next/link";

import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Page not found · Husky Audio Video",
};

/**
 * 404 — the one page that renders outside the `(site)` group, because an
 * unmatched URL never enters a route group. It carries the site chrome itself:
 * Header and Footer are plain components with no dependency on the motion
 * provider or the smooth-scroll wrapper, so nothing here animates and nothing
 * is missing. Same eyebrow / display-2 / lead stack as every band on the site,
 * one action, no decoration.
 */
export default function NotFound() {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-lg focus:bg-background focus:px-4 focus:py-3 focus:text-foreground focus:outline-none focus-visible:ring-3 focus-visible:ring-ring"
      >
        Skip to content
      </a>
      <Header />
      <main id="main" className="bg-background flex flex-1 items-center">
        <div className="section-x section-y mx-auto w-full max-w-7xl pt-40">
          <p className="eyebrow">404</p>
          <h1 className="display-2 mt-6 max-w-[18ch] text-balance">
            This page isn&rsquo;t wired in.
          </h1>
          <p className="lead mt-6 max-w-[42ch]">
            The address may have changed, or the link was never connected.
            Everything else is where it should be.
          </p>
          <div className="mt-10">
            <Button asChild size="lg">
              <Link href="/">Back home</Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
