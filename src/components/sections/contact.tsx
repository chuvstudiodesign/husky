import { SectionSeam } from "@/components/sections/section-seam";
import { Button } from "@/components/ui/button";

const WHATSAPP_URL = "https://api.whatsapp.com/send?phone=19548648005";

/**
 * Surface note — this band is `--primary` (#EC663D), one fixed tone in both
 * themes, so every colour on it is pinned rather than semantic. That is the same
 * contract `Approach` runs on `--brand-light`: a theme-invariant band cannot use
 * theme-reactive foregrounds.
 *
 * Orange background means black type, without exception. White on #EC663D
 * measures 3.21:1 — large-text AA only. #090A0F on the same orange measures
 * 6.15:1, which clears AA at every size on the band, so one value does the whole
 * section and hierarchy is carried by size and weight instead of by tone.
 *
 *   #090A0F on #EC663D … 6.15:1   eyebrow, heading, lead, labels, values,
 *                                 button labels and the focus ring
 */
const ON_ORANGE = "text-brand-black";

/**
 * The CTA on orange — the pre-navy pattern, restored.
 *
 * `bg-primary` on a `bg-primary` band is an invisible button, so the fill flips
 * to brand black and the label goes white with it. Rule 2 governs type sitting
 * on the orange surface; this label sits on a black surface, and follows that
 * one instead.
 *
 *   #090A0F panel on #EC663D … 6.15:1   the button against the band
 *   #FFFFFF label on #090A0F … 19.8:1   the label against the button
 *
 * The focus ring goes white for the same reason the fill went black: `--ring`
 * is the brand orange and would vanish against the band, and a black ring would
 * vanish against the button. White clears both — 3.21:1 on the orange, 19.8:1
 * on the black — where each of the other two clears only one.
 */
const ON_ORANGE_CTA =
  "bg-brand-black text-primary-foreground hover:bg-brand-black/90 focus-visible:border-white focus-visible:ring-white";

const CHANNELS = [
  {
    label: "WhatsApp",
    note: "Primary",
    value: "+1 954 864 8005",
    href: WHATSAPP_URL,
    external: true,
  },
  {
    label: "Phone",
    value: "+1 954 864 8005",
    href: "tel:+19548648005",
    external: false,
  },
  {
    label: "Email",
    value: "info@huskyautomation.com",
    href: "mailto:info@huskyautomation.com",
    external: false,
  },
  {
    label: "Studio",
    value: "4301 Oak Cir #26, Boca Raton, FL 33431",
    href: "https://goo.gl/maps/Qs29ngQRJVS6ptjc9",
    external: true,
  },
] as const;

/**
 * Contact — the page's arrival and its conversion point.
 *
 * Every band above this one is #090A0F or the single light interlude, so the
 * jump to a full sheet of orange is the page's one tonal event and it lands on
 * the thing the page is for. No hairline opens it: two surfaces that differ by
 * this much do not also need a rule drawn between them.
 *
 * Every channel is a real link. No form: WhatsApp is the client's primary channel
 * and the form is undecided.
 */
export function Contact() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className={`bg-primary ${ON_ORANGE} relative`}
    >
      {/* Dark to orange, the page's largest colour change. Orange rises into
          the dark band on the left, the dark descends into the orange on the
          right — see `SectionSeam`. */}
      <SectionSeam rise="fill-primary" fall="fill-background" />
      <div className="section-x section-y mx-auto max-w-7xl">
        <p className={`eyebrow ${ON_ORANGE}`}>Get in touch</p>

        <h2 id="contact-title" className="display-2 mt-6 max-w-3xl">
          Tell us what you’re building.
        </h2>

        <p className={`lead ${ON_ORANGE} mt-8 max-w-xl`}>
          Whether it’s a full new build or a single room, start with a conversation.
          We’ll tell you honestly what the project needs.
        </p>

        {/* No `Magnetic` wrapper. The CTA does not drift toward the cursor: a
            control that moves while you aim at it is the one place on a page
            where motion costs the reader something. Hover feedback stays, as a
            colour shift. Client mandate, 2026-09-01. */}
        <div className="mt-10">
          <Button asChild className={ON_ORANGE_CTA}>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
              Talk to Us
              <span className="sr-only"> (WhatsApp, opens in a new tab)</span>
            </a>
          </Button>
        </div>

        {/* No rule above this list: 112–144px of clear orange is already the
            boundary, and a hairline on top of it separates the same thing twice. */}
        {/* Four columns from `xl`, not `lg`, and the reason is a collision the
            desktop widths never show. The email is one unbreakable token:
            `info@huskyautomation.com` sets 238px at `.display-3`, and a quarter
            of this container is (0.9 × vw − 120) / 4, which only clears 238 from
            about 1191px up. At 1024 the column is 200px, so the address ran 38px
            past its own cell into the 40px gutter and stopped 2px short of the
            studio address beside it — the two read as one string. Two columns
            gives each channel 444px there, which is the same 2-up the page
            already uses from `sm` to `lg`, so nothing new is introduced; 1280
            and 1440 keep the 258px columns and the 4-up row untouched. */}
        <ul className="mt-28 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:mt-36 xl:grid-cols-4">
          {CHANNELS.map((channel) => (
            <li key={channel.label}>
              <a
                href={channel.href}
                {...(channel.external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                /* `focus-visible:outline-solid` is load-bearing. In Tailwind v4
                   `outline-none` sets `--tw-outline-style: none`, and
                   `outline-2` sets `outline-style: var(--tw-outline-style)` —
                   so the pair computed to a 2px outline with no style, which
                   draws nothing. These four links had no visible focus
                   indicator at all; restoring the style is what makes the
                   black one (6.15:1 on the band) actually appear. */
                className={`group focus-visible:outline-brand-black flex flex-col gap-3 rounded-lg outline-none focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-4 ${ON_ORANGE}`}
              >
                <span className={`meta ${ON_ORANGE}`}>
                  {channel.label}
                  {"note" in channel ? ` · ${channel.note}` : null}
                </span>
                <span className="display-3 underline-offset-4 group-hover:underline">
                  {channel.value}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
