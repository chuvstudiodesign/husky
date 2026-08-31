import type { Metadata } from "next";
import { Geist, Geist_Mono, Outfit } from "next/font/google";
import "./globals.css";

/* Primary display typeface — geometric, structural, robust.
   Used for high-end luxury headings. (Figma 03 — Typography) */
const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
  display: "swap",
});

/* Secondary body typeface — optimized for digital screens and technical system text. */
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

/* System mono — technical UI metas and labels. */
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Husky — Luxury Smart Home Automation",
  description:
    "Husky Audio Video. Personalized luxury smart home experiences across South Florida.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`dark ${outfit.variable} ${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
      data-scroll-behavior="smooth"
    >
      <head>
        {/*
          Marks that scripting is available, before first paint.

          Scroll-reveal hides its starting state behind `html.js`, so the server's
          markup is fully visible and stays that way if scripts are blocked, fail,
          or simply haven't run. Because this runs synchronously in <head>, the
          class lands before the first paint — so when JS *is* present there is no
          flash of visible-then-hidden content either.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.classList.add('js')`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
