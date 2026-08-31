import { Magnetic } from "@/components/motion-ui/magnetic";
import { Button } from "@/components/ui/button";

const WHATSAPP_URL = "https://api.whatsapp.com/send?phone=19548648005";

/**
 * Contrast note — this band is `--primary` (#EC663D) in both themes.
 *
 * White on that orange measures 3.21:1, which only clears AA for large text. So the
 * h2 may stay white (it never renders below 32px bold), and everything else on the
 * band is forced to `--brand-black` (#090A0F), which measures 6.15:1 on orange.
 */
const ON_ORANGE = "text-[color:var(--brand-black)]";

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
 * Contact — the page's maximum-contrast moment and its conversion point.
 *
 * A full orange band, one dark primary action, and every channel as a real link.
 * No form: WhatsApp is the client's primary channel and the form is undecided.
 */
export function Contact() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="bg-primary"
    >
      <div className="section-x section-y mx-auto max-w-7xl">
        <p className={`eyebrow ${ON_ORANGE}`}>Get in touch</p>

        <h2
          id="contact-title"
          className="display-2 text-primary-foreground mt-6 max-w-3xl"
        >
          Tell us what you’re building.
        </h2>

        <p className={`lead ${ON_ORANGE} mt-8 max-w-xl`}>
          Whether it’s a full new build or a single room, start with a conversation.
          We’ll tell you honestly what the project needs.
        </p>

        <Magnetic strength={0.2} className="mt-10 block">
          <Button
            asChild
            className="h-12 bg-[color:var(--brand-black)] px-8 text-base text-primary-foreground hover:bg-[color:var(--brand-black)]/90 focus-visible:border-[color:var(--brand-black)] focus-visible:ring-[color:var(--brand-black)]/40"
          >
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
              Message Us on WhatsApp
            </a>
          </Button>
        </Magnetic>

        <ul className="mt-20 grid gap-x-10 gap-y-10 border-t border-[color:var(--brand-black)]/25 pt-10 sm:grid-cols-2 lg:mt-28 lg:grid-cols-4">
          {CHANNELS.map((channel) => (
            <li key={channel.label}>
              <a
                href={channel.href}
                {...(channel.external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className={`group flex flex-col gap-3 ${ON_ORANGE} rounded-lg outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[color:var(--brand-black)]`}
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
