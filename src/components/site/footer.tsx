import Image from "next/image";
import Link from "next/link";

const WHATSAPP = "https://api.whatsapp.com/send?phone=19548648005";

const columns = [
  {
    title: "Services",
    links: [
      { label: "Automation", href: "/#services" },
      { label: "Home Cinema", href: "/#services" },
      { label: "Smart Lighting", href: "/#services" },
      { label: "Wi-Fi & Networking", href: "/#services" },
      { label: "Surveillance", href: "/#services" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/#about" },
      { label: "Our Approach", href: "/#approach" },
      { label: "New Construction", href: "/new-construction" },
      { label: "Design System", href: "/styleguide" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-background border-t">
      <div className="section-x mx-auto max-w-[1600px] py-20">
        <div className="grid gap-14 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3">
              <Image
                src="/brand/icon/husky-mark-orange.svg"
                alt=""
                width={32}
                height={32}
                className="h-8 w-auto"
              />
              <span className="font-display text-xl leading-none font-bold tracking-tight">
                HUSKY
              </span>
            </div>
            <p className="meta mt-4">Luxury Smart Home Automation</p>
            <p className="body-text mt-6 max-w-[34ch] text-sm">
              A luxury technology integrator based in Boca Raton, serving South
              Florida.
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h2 className="meta">{col.title}</h2>
              <ul className="mt-5 flex flex-col gap-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact */}
          <div>
            <h2 className="meta">Contact</h2>
            <ul className="mt-5 flex flex-col gap-3 text-sm">
              <li>
                <a
                  href="tel:+19548648005"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  +1 954 864 8005
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@huskyautomation.com"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  info@huskyautomation.com
                </a>
              </li>
              <li>
                <a
                  href="https://goo.gl/maps/Qs29ngQRJVS6ptjc9"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground max-w-[24ch] transition-colors"
                >
                  4301 Oak Cir #26, Boca Raton, FL 33431
                </a>
              </li>
              <li className="flex gap-4 pt-2">
                <a
                  href="https://www.instagram.com/huskyautomation/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Instagram
                </a>
                <a
                  href="https://www.facebook.com/Husky-Automation-103635438516376"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Facebook
                </a>
                <a
                  href={WHATSAPP}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col justify-between gap-4 border-t pt-8 sm:flex-row">
          <p className="meta">
            © {new Date().getFullYear()} Husky Automation Corp
          </p>
          <p className="meta">Boca Raton · Florida</p>
        </div>
      </div>
    </footer>
  );
}
