import { cn } from "@/lib/utils";

export interface RollTextProps {
  as?: "span" | "div" | "p";
  className?: string;
  children: string;
}

const CHAR =
  "inline-block transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] [transition-delay:calc(var(--i)*12ms)] motion-reduce:transition-none " +
  // Trigger on its own hover, or on any ancestor marked `group` (a link, a button).
  "group-hover/roll:-translate-y-full group-hover:-translate-y-full group-focus-visible:-translate-y-full motion-reduce:translate-y-0!";

function Chars({ text }: { text: string }) {
  return (
    <>
      {Array.from(text).map((ch, i) => (
        <span
          key={i}
          className={CHAR}
          style={{ "--i": i } as React.CSSProperties}
        >
          {ch}
        </span>
      ))}
    </>
  );
}

/**
 * P9 — label that rolls up on hover.
 *
 * The label is drawn twice inside a one-line mask; on hover both copies move
 * `yPercent -100`, staggered per char at 12ms over 300ms. CSS only (a `--i` per
 * char), so it is a Server Component.
 *
 * Assistive tech reads the label once, from an sr-only copy; both visual copies are
 * aria-hidden (a per-char split read aloud can come out letter by letter).
 * Reduced motion: no roll.
 */
export function RollText({ as: Tag = "span", className, children }: RollTextProps) {
  return (
    <Tag
      className={cn(
        "group/roll relative inline-flex overflow-hidden whitespace-pre",
        className,
      )}
    >
      <span className="sr-only">{children}</span>
      <span aria-hidden="true" className="inline-flex">
        <Chars text={children} />
      </span>
      <span aria-hidden="true" className="absolute inset-x-0 top-full inline-flex">
        <Chars text={children} />
      </span>
    </Tag>
  );
}
