import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Page shell                                                         */
/* ------------------------------------------------------------------ */

export function ShowcaseHeader({
  title,
  description,
  importPath,
}: {
  title: string;
  description: string;
  importPath: string;
}) {
  return (
    <header className="mb-20">
      <p className="text-system text-primary mb-3 text-[10px]">Component</p>
      <h1 className="font-display text-6xl leading-none font-bold tracking-[-0.025em]">
        {title}
      </h1>
      <p className="text-muted-foreground mt-5 max-w-xl text-[15px] leading-relaxed">
        {description}
      </p>
      <pre className="bg-card text-muted-foreground mt-8 overflow-x-auto rounded-lg border px-4 py-3 font-mono text-[12px]">
        {importPath}
      </pre>
    </header>
  );
}

export function ShowcaseSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="font-display mb-8 text-[26px] leading-none font-semibold tracking-[-0.02em]">
        {title}
      </h2>
      {children}
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Demo block — preview + optional source                             */
/* ------------------------------------------------------------------ */

export function Demo({
  label,
  note,
  code,
  className,
  children,
}: {
  label?: string;
  note?: string;
  code?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4">
      {(label || note) && (
        <div className="flex items-baseline gap-4">
          {label && <p className="text-[13px] font-medium">{label}</p>}
          {note && (
            <p className="text-muted-foreground/70 font-mono text-[11px]">
              {note}
            </p>
          )}
        </div>
      )}
      <div
        className={cn(
          "bg-card flex flex-wrap items-center gap-6 rounded-lg border p-8",
          className,
        )}
      >
        {children}
      </div>
      {code && (
        <pre className="text-muted-foreground overflow-x-auto rounded-lg border px-4 py-3 font-mono text-[11px] leading-relaxed">
          {code}
        </pre>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Props table                                                        */
/* ------------------------------------------------------------------ */

export interface PropRow {
  name: string;
  type: string;
  default?: string;
  description: string;
}

export function PropsTable({
  rows,
  caption,
}: {
  rows: PropRow[];
  caption?: string;
}) {
  return (
    <div className="flex flex-col gap-3">
      {caption && (
        <p className="text-system text-muted-foreground/70 text-[10px]">
          {caption}
        </p>
      )}
      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full min-w-[640px] border-collapse text-left">
          <thead>
            <tr className="bg-card border-b">
              {["Prop", "Type", "Default", "Description"].map((h) => (
                <th
                  key={h}
                  className="text-system text-muted-foreground/70 px-4 py-3 text-[10px] font-normal"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.name} className="border-b last:border-b-0">
                <td className="text-primary px-4 py-3 align-top font-mono text-[12px] whitespace-nowrap">
                  {r.name}
                </td>
                <td className="text-muted-foreground px-4 py-3 align-top font-mono text-[11px]">
                  {r.type}
                </td>
                <td className="text-muted-foreground/70 px-4 py-3 align-top font-mono text-[11px] whitespace-nowrap">
                  {r.default ?? "—"}
                </td>
                <td className="px-4 py-3 align-top text-[13px] leading-relaxed">
                  {r.description}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Anatomy + accessibility                                            */
/* ------------------------------------------------------------------ */

export function Anatomy({ parts }: { parts: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {parts.map((p) => (
        <code
          key={p}
          className="bg-card text-muted-foreground rounded-lg border px-2.5 py-1.5 font-mono text-[11px]"
        >
          {p}
        </code>
      ))}
    </div>
  );
}

export function A11yNotes({ notes }: { notes: string[] }) {
  return (
    <ul className="flex flex-col gap-3">
      {notes.map((n) => (
        <li
          key={n}
          className="text-muted-foreground flex gap-3 text-[13px] leading-relaxed"
        >
          <span className="bg-primary mt-[7px] size-1 shrink-0 rounded-full" />
          {n}
        </li>
      ))}
    </ul>
  );
}

/* ------------------------------------------------------------------ */
/*  Page wrapper                                                       */
/* ------------------------------------------------------------------ */

export function ShowcasePage({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-5xl px-16 py-20">
      <div className="flex flex-col gap-24">{children}</div>
    </div>
  );
}
