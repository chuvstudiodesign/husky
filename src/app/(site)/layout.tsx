import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { Grain } from "@/components/motion-ui/grain";
import { MotionProvider } from "@/components/motion-ui/motion-provider";
import { ScrollProgress } from "@/components/motion-ui/scroll-progress";

/**
 * Shell for the public marketing site.
 *
 * The styleguide keeps its own layout and its own theme toggle. The site itself is
 * single-theme by design — the dark system from the Figma spec — and takes its
 * variety from section-level contrast rather than from a light/dark switch.
 */
export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MotionProvider>
      <Grain />
      <ScrollProgress />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </MotionProvider>
  );
}
