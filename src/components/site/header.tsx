"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const WHATSAPP = "https://api.whatsapp.com/send?phone=19548648005";

const links = [
  { label: "Services", href: "/#services" },
  { label: "Approach", href: "/#approach" },
  { label: "About", href: "/#about" },
  { label: "New Construction", href: "/new-construction" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock the page while the mobile sheet is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition-all duration-500",
        scrolled
          ? "bg-background/80 border-b backdrop-blur-xl"
          : "border-b border-transparent",
      )}
    >
      <div className="section-x mx-auto flex h-20 max-w-[1600px] items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-3"
          aria-label="Husky Audio Video, home"
        >
          <Image
            src="/brand/icon/husky-mark-orange.svg"
            alt=""
            width={30}
            height={30}
            className="h-[30px] w-auto"
            priority
          />
          <span className="font-display text-lg leading-none font-bold tracking-tight">
            HUSKY
          </span>
        </Link>

        <nav className="hidden items-center gap-9 lg:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-muted-foreground hover:text-foreground text-[13px] transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Button asChild size="sm" className="hidden sm:inline-flex">
            <a href={WHATSAPP} target="_blank" rel="noopener noreferrer">
              Request a Consultation
            </a>
          </Button>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="hover:bg-muted -mr-2 rounded-lg p-2 lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* Mobile sheet */}
      <div
        className={cn(
          "bg-background fixed inset-x-0 top-20 bottom-0 z-40 transition-all duration-300 lg:hidden",
          open
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0",
        )}
      >
        <nav className="section-x flex flex-col gap-1 pt-8">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="font-display border-b py-5 text-2xl font-semibold tracking-tight"
            >
              {l.label}
            </Link>
          ))}
          <Button asChild size="lg" className="mt-8">
            <a href={WHATSAPP} target="_blank" rel="noopener noreferrer">
              Request a Consultation
            </a>
          </Button>
        </nav>
      </div>
    </header>
  );
}
