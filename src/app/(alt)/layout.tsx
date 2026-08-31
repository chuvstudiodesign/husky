import { Grain } from "@/components/motion-ui/grain";
import { MotionProvider } from "@/components/motion-ui/motion-provider";
import { SmoothScroll } from "@/components/motion-ui/smooth-scroll";

/**
 * Shell for the alternative site versions that do not use the standard chrome.
 *
 * The approved site has a top header and a footer. Site 2 replaces both with a
 * fixed left rail, so it cannot nest inside that layout — a nested layout can add
 * to its parent but never remove from it. It gets its own group instead.
 *
 * What carries over is what is genuinely global: the motion policy, momentum
 * scrolling, and the grain that keeps large dark areas from banding.
 */
export default function AltLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MotionProvider>
      <SmoothScroll>
        <Grain />
        {children}
      </SmoothScroll>
    </MotionProvider>
  );
}
