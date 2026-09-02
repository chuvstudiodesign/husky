import Image from "next/image";
import Link from "next/link";
import { HuskyWordmark } from "@/components/motion-ui/husky-wordmark";

const WHATSAPP = "https://api.whatsapp.com/send?phone=19548648005";

/* The 44px touch box, on every footer link below lg. `inline-block` is what
   makes the vertical padding count — padding on an inline box paints but does
   not enlarge the hit area — and `leading-5` pins the line at 20px so 20 + 12 +
   12 is exactly 44 rather than whatever the font happens to give.

   `lg:inline` puts the address link back the way it was on the desktop. Its
   `max-w-[24ch]` has never done anything, because `max-width` is inert on an
   inline box; switching to `inline-block` turned it on and wrapped the address
   onto two lines at every width. That is probably what its author meant, but it
   is not this pass's call to make, so above lg the box goes back to inline and
   the cap goes back to sleep. `leading-5` matches what `text-sm` already
   computes, so nothing else moves. */
const TAP = "inline-block py-3 leading-5 lg:inline lg:py-0";

const columns = [
  {
    title: "Services",
    links: [
      { label: "Entertainment", href: "/#entertainment" },
      { label: "Comfort & Control", href: "/#comfort-control" },
      { label: "Infrastructure & Security", href: "/#infrastructure-security" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/#about" },
      { label: "Our Approach", href: "/#approach" },
      { label: "New Construction", href: "/new-construction" },
    ],
  },
];

/**
 * No `border-t` on the footer, and none on the legal strip: every route that
 * renders this footer closes on the orange band, so the drop back to
 * `--background` marks that boundary, and 144px of clear space (112 below md)
 * marks the one before the copyright line. One separator per boundary — and a
 * hairline drawn between two surfaces that already differ is invisible work.
 *
 * Vertical room: 144px above and below the grid on md+ (112 on phones) and the
 * same 144 before the legal strip. Client, 2026-09-02: the footer was to grow
 * about 40% in height, from ~445px to ~620px at 1440; the padding carries all
 * of it so the columns and their 4-up rhythm stay where they were.
 */
export function Footer() {
  return (
    <footer className="bg-background">
      <div className="section-x mx-auto max-w-7xl py-28 md:py-36">
        {/* Four equal columns on the page's own 4-up rhythm — the same one the
            stats band and the contact channel list use, so at 1440 all three
            land on x = 144 / 442 / 740 / 1038. The old fr ratios made the
            footer the one 4-up on the page that didn't line up with the rest. */}
        <div className="grid gap-x-10 gap-y-14 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3">
              <Image
                src="/brand/icon/husky-mark-orange.svg"
                alt=""
                width={26}
                height={32}
                className="h-8 w-auto"
              />
              <HuskyWordmark className="h-3.5 w-auto" />
            </div>
            <p className="meta mt-4">Luxury Smart Home Automation</p>
            <p className="body-text mt-6 max-w-[34ch]">
              A luxury technology integrator based in Boca Raton, serving South
              Florida.
            </p>
          </div>

          {/* Tap targets, below lg only. A 14px link renders an 18px box, and
              at `gap-3` the pitch down the column was 30px — comfortable to
              read and too small to hit. `py-3` on a `leading-5` line makes the
              box exactly 44px, so the gap comes off and the padding does the
              spacing instead: same 44px pitch, every pixel of it live.

              From lg the footer is a four-column desktop block read with a
              cursor, so the padding comes off and a `gap-6` takes over: a 44px
              pitch between links, 32px from the column title to its first
              link (client, 2026-09-02 — more air between the items). `TAP` is
              shared with the contact column below so the two never drift
              apart. */}
          {columns.map((col) => (
            <div key={col.title}>
              <h2 className="meta">{col.title}</h2>
              <ul className="mt-8 flex flex-col lg:gap-6">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className={`text-muted-foreground hover:text-foreground text-sm transition-colors ${TAP}`}
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact. The one column set in `--foreground` rather than muted —
              title and every channel — on the client's call (2026-09-02): it is
              the footer's only actionable column, and white is how it is told
              apart from the two navigation lists. Hover is an underline, the
              same cue the Contact section's channels use, so no second colour
              enters the footer. */}
          <div>
            <h2 className="meta text-foreground">Contact</h2>
            <ul className="mt-8 flex flex-col text-sm lg:gap-6">
              <li>
                <a
                  href="tel:+19548648005"
                  className={`text-foreground underline-offset-4 hover:underline ${TAP}`}
                >
                  +1 954 864 8005
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@huskyautomation.com"
                  className={`text-foreground underline-offset-4 hover:underline ${TAP}`}
                >
                  info@huskyautomation.com
                </a>
              </li>
              <li>
                <a
                  href="https://goo.gl/maps/Qs29ngQRJVS6ptjc9"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-foreground max-w-[24ch] underline-offset-4 hover:underline ${TAP}`}
                >
                  4301 Oak Cir #26, Boca Raton, FL 33431
                </a>
              </li>
              {/* The three social links keep `gap-4` at every width: they sit
                  in a row, not a column, and 44px boxes side by side already
                  clear the 24px minimum spacing between adjacent targets. */}
              <li className="flex gap-4 lg:pt-2">
                <a
                  href="https://www.instagram.com/huskyautomation/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-foreground underline-offset-4 hover:underline ${TAP}`}
                >
                  Instagram
                </a>
                <a
                  href="https://www.facebook.com/Husky-Automation-103635438516376"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-foreground underline-offset-4 hover:underline ${TAP}`}
                >
                  Facebook
                </a>
                <a
                  href={WHATSAPP}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-foreground underline-offset-4 hover:underline ${TAP}`}
                >
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-28 flex flex-col justify-between gap-4 sm:flex-row md:mt-36">
          <p className="meta">
            © {new Date().getFullYear()} Husky Automation Corp
          </p>
          <p className="meta">Boca Raton · Florida</p>
        </div>
      </div>
    </footer>
  );
}
