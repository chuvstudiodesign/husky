import Image from "next/image";
import { CircleCheck, Info, TriangleAlert, OctagonX } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { HuskyWordmark } from "@/components/motion-ui/husky-wordmark";

/* ------------------------------------------------------------------ */

function Section({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="mb-10">
        <p className="text-system text-primary mb-3 text-[10px]">{eyebrow}</p>
        <h2>{title}</h2>
      </div>
      {children}
    </section>
  );
}

function Swatch({ name, token }: { name: string; token: string }) {
  return (
    <div className="flex flex-col gap-3">
      <div
        className="h-20 w-full rounded-lg border"
        style={{ background: `var(${token})` }}
      />
      <div>
        <p className="text-[13px] font-medium">{name}</p>
        <p className="text-muted-foreground/70 mt-0.5 font-mono text-[10px]">
          {token}
        </p>
      </div>
    </div>
  );
}

function Scale({
  label,
  prefix,
}: {
  label: string;
  prefix: "husky" | "navy" | "grey";
}) {
  const steps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900] as const;
  return (
    <div>
      <p className="mb-4 text-[13px] font-medium">{label}</p>
      <div className="grid grid-cols-10 overflow-hidden rounded-lg">
        {steps.map((step) => (
          <div
            key={step}
            className="flex h-24 items-end p-2"
            style={{ background: `var(--${prefix}-${step})` }}
          >
            <span
              className={`font-mono text-[10px] ${
                step <= 400 ? "text-black/45" : "text-white/70"
              }`}
            >
              {step}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

export default function StyleguidePage() {
  const surfaces = [
    { name: "Background", hex: "#090A0F", token: "--background" },
    { name: "Card", hex: "#11131C", token: "--card" },
    { name: "Primary", hex: "#EC663D", token: "--primary" },
  ];

  const coreTokens = [
    { name: "Background", token: "--background" },
    { name: "Foreground", token: "--foreground" },
    { name: "Card", token: "--card" },
    { name: "Primary", token: "--primary" },
    { name: "Secondary", token: "--secondary" },
    { name: "Muted", token: "--muted" },
    { name: "Accent", token: "--accent" },
    { name: "Border", token: "--border" },
    { name: "Input", token: "--input" },
    { name: "Ring", token: "--ring" },
    { name: "Popover", token: "--popover" },
    { name: "Destructive", token: "--destructive" },
  ];

  const semantic = [
    { name: "Success", token: "--success" },
    { name: "Warning", token: "--warning" },
    { name: "Info", token: "--info" },
    { name: "Destructive", token: "--destructive" },
  ];

  const charts = [1, 2, 3, 4, 5].map((n) => ({
    name: `Chart ${n}`,
    token: `--chart-${n}`,
  }));

  const logos = [
    {
      src: "/brand/logo/husky-lockup-light.svg",
      label: "Primary on Navy",
      bg: "#15243D",
    },
    {
      src: "/brand/logo/husky-lockup-navy.svg",
      label: "Primary on Light",
      bg: "#FFFFFF",
    },
    {
      src: "/brand/logo/husky-lockup-orange.svg",
      label: "Orange on Gray",
      bg: "#DFDFDF",
    },
    {
      src: "/brand/logo/husky-lockup-navy.svg",
      label: "Navy on Gray",
      bg: "#DFDFDF",
    },
    {
      src: "/brand/icon/husky-mark-light.svg",
      label: "Mark on Charcoal",
      bg: "#11131C",
    },
    {
      src: "/brand/icon/husky-mark-light.svg",
      label: "Mark on Orange",
      bg: "#EC663D",
    },
  ];

  /* The scale documents itself: every row renders the production class from
     globals.css, so editing a token moves this page with it. The note is the
     role, never the numbers — a hand-copied "48 / −1%" is exactly what drifted
     away from the real values last time. */
  const typeScale = [
    {
      cls: "display-1",
      sample: "Engineered quietly.",
      note: "The page h1. Used once, in the hero.",
    },
    {
      cls: "display-2",
      sample: "One house that behaves.",
      note: "Every section h2.",
    },
    {
      cls: "display-3",
      sample: "Multi Room Audio",
      note: "Sub-headings inside a section: service names, panel titles.",
    },
    {
      cls: "lead",
      sample:
        "We design and install the systems that make a high-end home effortless, automation, cinema, lighting, sound and the network underneath it all.",
      note: "The one paragraph after a section heading. Carries its own colour and a 46ch measure.",
    },
    {
      cls: "body-text",
      sample:
        "Most homes accumulate technology one purchase at a time, and it shows. We design the whole system first, then install it, so everything answers to the same logic.",
      note: "Everything else. Owns size and leading — never pair it with text-sm or text-base.",
    },
    {
      cls: "nav-text",
      sample: "Systems · Approach · Platforms · Contact",
      note: "The chrome register: header links, the rail, the section index.",
    },
    {
      cls: "text-system",
      sample: "[ZONE_01] LIGHTS: 75% // AUDIO: ACTIVE",
      note: "Mono UI labels and technical annotations.",
    },
    {
      cls: "eyebrow",
      sample: "02 — Systems",
      note: "The mono label that opens every section.",
    },
    {
      cls: "meta",
      sample: "Boca Raton · Florida",
      note: "Mono captions, table labels, figure descriptors.",
    },
  ];

  const radii = [
    { name: "xs", cls: "rounded-xs", px: "2" },
    { name: "sm", cls: "rounded-sm", px: "3" },
    { name: "md", cls: "rounded-md", px: "4" },
    { name: "lg", cls: "rounded-lg", px: "4" },
    { name: "xl", cls: "rounded-xl", px: "4" },
    { name: "2xl", cls: "rounded-2xl", px: "4" },
  ];

  const shadows = [
    { name: "flat", token: "--shadow-flat" },
    { name: "subtle", token: "--shadow-subtle" },
    { name: "raised", token: "--shadow-raised" },
    { name: "overlay", token: "--shadow-overlay" },
  ];

  return (
    <div className="mx-auto max-w-6xl px-16 py-20">
      {/* Header */}
      <header className="mb-24">
        <div className="flex items-center gap-6">
          <Image
            src="/brand/icon/husky-mark-orange.svg"
            alt=""
            width={88}
            height={88}
            className="h-22 w-auto"
            priority
          />
          <HuskyWordmark className="h-10 w-auto" />
        </div>
        <h1 className="mt-14">Design Tokens</h1>
        <p className="text-muted-foreground mt-5 max-w-md text-[15px]">
          The foundation layer for Husky&apos;s luxury smart home interfaces.
        </p>
      </header>

      <div className="flex flex-col gap-28">
        {/* Surfaces */}
        <Section eyebrow="Foundation" title="Surfaces">
          <div className="grid gap-5 md:grid-cols-3">
            {surfaces.map((s) => (
              <div key={s.name} className="flex flex-col gap-4">
                <div
                  className="h-40 w-full rounded-lg border"
                  style={{ background: s.hex }}
                />
                <div className="flex items-baseline justify-between">
                  <span className="text-[15px] font-medium">{s.name}</span>
                  <span className="text-primary font-mono text-xs">
                    {s.hex}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Brand marks */}
        <Section eyebrow="Identity" title="Brand Marks">
          <div className="grid grid-cols-2 gap-5 md:grid-cols-3">
            {logos.map((logo) => (
              <div
                key={logo.label}
                className="overflow-hidden rounded-lg border"
              >
                <div
                  className="flex h-44 items-center justify-center p-10"
                  style={{ background: logo.bg }}
                >
                  <Image
                    src={logo.src}
                    alt={logo.label}
                    width={200}
                    height={130}
                    className="max-h-full w-auto object-contain"
                  />
                </div>
                <div className="bg-card border-t px-4 py-3">
                  <span className="text-system text-muted-foreground text-[10px]">
                    {logo.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Palette */}
        <Section eyebrow="Color" title="Palette">
          <div className="grid grid-cols-3 gap-x-6 gap-y-10 md:grid-cols-6">
            {coreTokens.map((t) => (
              <Swatch key={t.token} {...t} />
            ))}
          </div>
        </Section>

        {/* Scales */}
        <Section eyebrow="Color" title="Scales">
          <div className="flex flex-col gap-10">
            <Scale label="Husky Orange" prefix="husky" />
            <Scale label="Husky Navy" prefix="navy" />
            <Scale label="Grey" prefix="grey" />
          </div>
        </Section>

        {/* Semantic */}
        <Section eyebrow="Color" title="Semantic">
          <div className="flex flex-col gap-12">
            <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
              {semantic.map((t) => (
                <Swatch key={t.name} {...t} />
              ))}
            </div>
            <div className="grid grid-cols-3 gap-x-6 gap-y-10 md:grid-cols-5">
              {charts.map((t) => (
                <Swatch key={t.token} {...t} />
              ))}
            </div>
          </div>
        </Section>

        {/* Typography */}
        <Section eyebrow="Type" title="Typography">
          <div className="flex flex-col">
            {typeScale.map((row, i) => (
              <div
                key={row.cls}
                className={`grid grid-cols-[140px_1fr] items-baseline gap-8 py-9 ${
                  i > 0 ? "border-t" : ""
                }`}
              >
                <code className="text-primary font-mono text-[11px]">
                  .{row.cls}
                </code>
                <div className="min-w-0">
                  <p className={row.cls}>{row.sample}</p>
                  <p className="text-muted-foreground/60 mt-3 max-w-[52ch] font-mono text-[11px] leading-relaxed">
                    {row.note}
                  </p>
                </div>
              </div>
            ))}
            <div className="grid grid-cols-[140px_1fr] items-baseline gap-8 border-t py-9">
              <span className="text-system text-muted-foreground/70 text-[10px]">
                Outfit
              </span>
              <div>
                <p className="font-display text-2xl font-medium">
                  Aa Bb Cc Dd Ee Ff Gg Hh Ii Jj Kk Ll Mm Nn Oo Pp Qq Rr Ss Tt Uu
                  Vv Ww Xx Yy Zz
                </p>
                <p className="text-muted-foreground font-display mt-2 text-2xl">
                  0123456789
                </p>
                <div className="mt-6 flex items-baseline gap-7">
                  <span className="font-display text-sm font-normal">
                    Regular
                  </span>
                  <span className="font-display text-sm font-medium">
                    Medium
                  </span>
                  <span className="font-display text-sm font-bold">Bold</span>
                  <span className="font-display text-sm font-black">Black</span>
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* Radius & elevation */}
        <Section eyebrow="Form" title="Radius & Elevation">
          <div className="grid gap-16 md:grid-cols-2">
            <div>
              <p className="mb-6 text-[13px] font-medium">
                Radius
                <span className="text-muted-foreground/70 ml-3 font-mono text-[11px]">
                  4px ceiling
                </span>
              </p>
              <div className="grid grid-cols-3 gap-5">
                {radii.map((r) => (
                  <div key={r.name} className="flex flex-col gap-3">
                    <div
                      className={`bg-primary/12 border-primary/35 h-20 w-full border ${r.cls}`}
                    />
                    <p className="text-muted-foreground/70 font-mono text-[10px]">
                      {r.name} · {r.px}px
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-6 text-[13px] font-medium">Elevation</p>
              <div className="grid grid-cols-2 gap-5">
                {shadows.map((s) => (
                  <div key={s.name} className="flex flex-col gap-3">
                    <div
                      className="bg-card h-20 w-full rounded-lg border"
                      style={{ boxShadow: `var(${s.token})` }}
                    />
                    <p className="text-muted-foreground/70 font-mono text-[10px]">
                      {s.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Section>

        {/* Components */}
        <Section eyebrow="Library" title="Components">
          <div className="flex flex-col gap-14">
            <div>
              <p className="mb-5 text-[13px] font-medium">Button</p>
              <div className="flex flex-wrap items-center gap-3">
                <Button>Trigger</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="link">Link</Button>
                <Separator orientation="vertical" className="mx-2 h-6" />
                <Button size="sm">Small</Button>
                <Button size="lg">Large</Button>
                <Button disabled>Disabled</Button>
              </div>
            </div>

            <div>
              <p className="mb-5 text-[13px] font-medium">Badge</p>
              <div className="flex flex-wrap items-center gap-3">
                <Badge>Active</Badge>
                <Badge variant="secondary">Standby</Badge>
                <Badge variant="outline">Offline</Badge>
                <Badge variant="destructive">Fault</Badge>
                <Badge variant="ghost">Muted</Badge>
              </div>
            </div>

            <div>
              <p className="mb-5 text-[13px] font-medium">Card</p>
              <div className="grid gap-5 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Living Room Zone</CardTitle>
                    <CardDescription>Acoustic 4K Media</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4">
                      <div className="bg-background h-1 flex-1 overflow-hidden rounded-lg">
                        <div className="bg-primary h-full w-[78%]" />
                      </div>
                      <span className="font-mono text-[11px]">78%</span>
                    </div>
                  </CardContent>
                  <CardFooter className="justify-between">
                    <span className="text-system text-muted-foreground/70 text-[10px]">
                      East Wing
                    </span>
                    <span className="text-system text-[10px] text-[var(--success)]">
                      Online
                    </span>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Master Theater</CardTitle>
                    <CardDescription>Playstation 5 Pro</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4">
                      <div className="bg-background h-1 flex-1 overflow-hidden rounded-lg">
                        <div className="bg-muted-foreground h-full w-[45%]" />
                      </div>
                      <span className="text-muted-foreground font-mono text-[11px]">
                        45%
                      </span>
                    </div>
                  </CardContent>
                  <CardFooter className="justify-between">
                    <span className="text-system text-muted-foreground/70 text-[10px]">
                      Evening Ambience
                    </span>
                    <Button size="xs">Trigger</Button>
                  </CardFooter>
                </Card>
              </div>
            </div>

            <div>
              <p className="mb-5 text-[13px] font-medium">Alert</p>
              <div className="flex flex-col gap-3">
                <Alert>
                  <Info />
                  <AlertTitle>Firmware update available</AlertTitle>
                  <AlertDescription>
                    Controller v2.4 is ready to install.
                  </AlertDescription>
                </Alert>
                <Alert>
                  <CircleCheck className="text-[var(--success)]" />
                  <AlertTitle>All zones online</AlertTitle>
                  <AlertDescription>
                    12 of 12 zones reporting healthy.
                  </AlertDescription>
                </Alert>
                <Alert>
                  <TriangleAlert className="text-[var(--warning)]" />
                  <AlertTitle>Bandwidth threshold reached</AlertTitle>
                  <AlertDescription>
                    Three zones competing for uplink.
                  </AlertDescription>
                </Alert>
                <Alert variant="destructive">
                  <OctagonX />
                  <AlertTitle>Amplifier unreachable</AlertTitle>
                  <AlertDescription>
                    No response for 4 minutes.
                  </AlertDescription>
                </Alert>
              </div>
            </div>

            <div>
              <p className="mb-5 text-[13px] font-medium">Radio Group</p>
              <RadioGroup defaultValue="evening" className="gap-4">
                {[
                  { v: "morning", l: "Morning Wake" },
                  { v: "evening", l: "Evening Ambience" },
                  { v: "theater", l: "Theater Mode" },
                  { v: "away", l: "Away / Secure" },
                ].map((o) => (
                  <div key={o.v} className="flex items-center gap-3">
                    <RadioGroupItem value={o.v} id={o.v} />
                    <Label htmlFor={o.v} className="text-sm font-normal">
                      {o.l}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>
        </Section>
      </div>

      <footer className="text-system text-muted-foreground/50 mt-28 border-t pt-8 pb-4 text-[10px]">
        Husky — Design System
      </footer>
    </div>
  );
}
