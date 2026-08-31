import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { Grain } from "@/components/motion-ui/grain";
import { MotionProvider } from "@/components/motion-ui/motion-provider";
import { ScrollProgress } from "@/components/motion-ui/scroll-progress";
import { SmoothScroll } from "@/components/motion-ui/smooth-scroll";

/**
 * Shell for the public marketing site.
 *
 * The styleguide keeps its own layout and its own theme toggle. The site itself is
 * single-theme by design — the dark system from the Figma spec — and takes its
 * variety from section-level contrast rather than from a light/dark switch.
 *
 * SmoothScroll sits here rather than per page, so every route under this layout
 * gets the same momentum: the main site, /new-construction, and each of the
 * alternative versions. It interpolates the native scroll position instead of
 * replacing it, so anchors, find-in-page and keyboard scrolling keep working, and
 * it disables itself entirely under prefers-reduced-motion and on touch.
 */
export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MotionProvider>
      <SmoothScroll>
        <Grain />
        <ScrollProgress />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </SmoothScroll>
    </MotionProvider>
  );
}
