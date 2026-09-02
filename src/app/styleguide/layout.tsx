"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";
import { navigation } from "./navigation";
import { HuskyWordmark } from "@/components/motion-ui/husky-wordmark";

export default function StyleguideLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen">
      <aside className="bg-card fixed top-0 left-0 flex h-screen w-72 flex-col overflow-y-auto border-r px-8 py-10">
        <Link href="/styleguide" className="flex items-center gap-4">
          <Image
            src="/brand/icon/husky-mark-orange.svg"
            alt=""
            width={44}
            height={44}
            className="h-11 w-auto shrink-0"
          />
          <HuskyWordmark className="h-5 w-auto" />
        </Link>

        <nav className="mt-14 flex flex-col gap-10">
          {navigation.map((section) => (
            <div key={section.title}>
              <h3 className="text-system text-muted-foreground/70 mb-4 text-[10px]">
                {section.title}
              </h3>
              {section.items.length === 0 ? (
                <p className="text-muted-foreground/40 text-xs">—</p>
              ) : (
                <ul className="flex flex-col gap-0.5">
                  {section.items.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={cn(
                          "-mx-3 block rounded-lg px-3 py-2 text-sm transition-colors",
                          pathname === item.href
                            ? "bg-primary text-primary-foreground font-medium"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted",
                        )}
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </nav>

        <div className="mt-auto pt-10">
          <ThemeToggle />
        </div>
      </aside>

      <main className="ml-72 flex-1">{children}</main>
    </div>
  );
}
