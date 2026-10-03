/**
 * Creative 2 — every string on the page, in one place.
 *
 * Source: `docs/copy-home.md`, verbatim. Two blocks come from the approved `/` page
 * instead (they trace back to the inventory): the fourth stat, `8 / Systems we
 * install`, and the Showcase block. `[VERIFY]` items are flagged with `verify: true`
 * and stay in the copy until the client confirms them.
 *
 * Sections import from here; no string is retyped in a component.
 */

export const WHATSAPP = "https://api.whatsapp.com/send?phone=19548648005";

export interface Cta {
  label: string;
  href: string;
  external?: boolean;
}

/* ------------------------------------------------------------------ */
/*  Meta                                                               */
/* ------------------------------------------------------------------ */

export const META = {
  title: "Husky Audio Video, Luxury Smart Home Automation in South Florida",
  description:
    "Custom smart home automation, home cinema, lighting, surveillance and networking for high-end homes across South Florida. Over 20 years of custom integration experience.",
  ogTitle: "Husky Audio Video, Luxury Smart Home Automation",
  ogDescription:
    "Custom smart home automation, home cinema, lighting, surveillance and networking for high-end homes across South Florida.",
} as const;

/* ------------------------------------------------------------------ */
/*  1. Hero  #home                                                     */
/* ------------------------------------------------------------------ */

export const HERO = {
  eyebrow: "LUXURY SMART HOME AUTOMATION",
  /** Two authored lines; render each as its own block. */
  h1Lines: ["Smart homes,", "engineered quietly."] as const,
  lead: "We design and install the systems that make a high-end home effortless, automation, cinema, lighting, sound, security and the network underneath it all. Boca Raton, serving South Florida.",
  primaryCta: {
    label: "Request a Consultation",
    href: WHATSAPP,
    external: true,
  } satisfies Cta,
  secondaryCta: { label: "See What We Do", href: "#services" } satisfies Cta,
  image: {
    src: "/photos/estate-dusk-01.jpg",
    /** Intrinsic size of the file. */
    width: 2132,
    height: 738,
  },
} as const;

/* ------------------------------------------------------------------ */
/*  2. Stats  #stats                                                   */
/* ------------------------------------------------------------------ */

export interface Stat {
  /** The figure as authored. */
  value: string;
  /** Static text after the figure ("+"). */
  suffix?: string;
  label: string;
  /** Whether `value` is a number that can roll on an odometer. */
  numeric: boolean;
  verify?: boolean;
}

export const STATS = {
  /** sr-only h2, keeps heading levels in order. */
  srTitle: "Husky at a glance",
  /** Order per site-versions-plan. `8` comes from the approved `/` page. */
  items: [
    { value: "South Florida", label: "SERVICE AREA", numeric: false },
    {
      value: "20",
      suffix: "+",
      label: "YEARS OF INTEGRATION",
      numeric: true,
      verify: true,
    },
    { value: "8", label: "SYSTEMS WE INSTALL", numeric: true },
    { value: "5", label: "PARTNER PLATFORMS", numeric: true },
  ] satisfies Stat[],
} as const;

/* ------------------------------------------------------------------ */
/*  3. Services  #services                                             */
/* ------------------------------------------------------------------ */

/** The drawn icon per service (`service-icons.tsx`). */
export type ServiceIconKey =
  | "home-cinema"
  | "multi-room-audio"
  | "outdoor-entertainment"
  | "automation"
  | "smart-lighting"
  | "smart-blinds"
  | "wifi-networking"
  | "surveillance";

export interface Service {
  /** h4 */
  name: string;
  body: string;
  /** Which drawn icon fills the plate (`service-icons.tsx`). */
  icon: ServiceIconKey;
}

export interface ServiceFamily {
  /** h3 */
  name: string;
  /** `public/showcase/<cover>.svg` */
  cover: string;
  services: Service[];
}

export const SERVICES = {
  eyebrow: "WHAT WE DO",
  h2: "Eight systems. One house that behaves.",
  intro:
    "Most homes accumulate technology one purchase at a time, and it shows. We design the whole system first, then install it, so everything answers to the same logic and the same remote.",
  families: [
    {
      name: "Entertainment",
      cover: "entertainment",
      services: [
        {
          name: "Home Cinema",
          body: "A real theater, built into your home. Whole-house surround, calibrated video, and AirPlay so the room is ready before anyone sits down.",
          icon: "home-cinema",
        },
        {
          name: "Multi Room Audio",
          body: "Music in one room, or every room at once. One button, or one sentence to your assistant.",
          icon: "multi-room-audio",
        },
        {
          name: "Outdoor Entertainment",
          body: "Audio and video built for the patio, the pool and the yard, specified for Florida weather, not adapted to it.",
          icon: "outdoor-entertainment",
        },
      ],
    },
    {
      name: "Comfort & Control",
      cover: "comfort-control",
      services: [
        {
          name: "Automation",
          body: "The layer that ties everything together. One system for lighting, climate, entertainment and security, tuned to how your household actually runs.",
          icon: "automation",
        },
        {
          name: "Smart Lighting",
          body: "Lighting and climate that follow the day rather than a switch. Better rooms, lower consumption, and a house that looks composed at every hour.",
          icon: "smart-lighting",
        },
        {
          name: "Smart Blinds",
          body: "Motorized shades that open on a schedule or on command, quietly enough that you stop noticing them, which is the point.",
          icon: "smart-blinds",
        },
      ],
    },
    {
      name: "Infrastructure & Security",
      cover: "infrastructure",
      services: [
        {
          name: "Wi-Fi & Networking",
          body: "Every smart home is only as reliable as the network under it. We survey the house, place access points where they actually work, and hardwire the things that should never buffer.",
          icon: "wifi-networking",
        },
        {
          name: "Surveillance",
          body: "Cameras, intercom and access control you can reach from anywhere. See the property in real time, speak to the gate, unlock a door from the airport.",
          icon: "surveillance",
        },
      ],
    },
  ] satisfies ServiceFamily[],
  cta: {
    label: "Talk Through Your Project",
    href: WHATSAPP,
    external: true,
  } satisfies Cta,
  /** Mono annotation on the track's last panel (creative-versions.md §3, not
   *  copy-home.md — an instrument label, not marketing copy). */
  endOfRun: "END OF RUN",
} as const;

/* ------------------------------------------------------------------ */
/*  4. Approach  #approach                                             */
/* ------------------------------------------------------------------ */

export const APPROACH = {
  eyebrow: "OUR APPROACH",
  h2: "The best time to plan a smart home is before the walls close.",
  body: [
    "Technology is infrastructure now. It belongs in the drawings alongside plumbing and electrical, not added after the drywall is up, at three times the cost and half the result.",
    "If you're building or renovating, bring us in while the plan is still on paper.",
  ] as const,
  cta: {
    label: "Read How We Plan a Build",
    href: "/new-construction",
  } satisfies Cta,
  /** Drawing annotations — labels of the drawing's state, not claims. From the
   *  Creative 1 spec (`docs/creative-versions.md` §4), not `copy-home.md`. */
  plan: {
    section: "SECTION A–A",
    status: {
      plan: "PLAN",
      roughIn: "ROUGH-IN",
      closed: "CLOSED",
    },
  },
} as const;

/* ------------------------------------------------------------------ */
/*  5. Partners  #partners                                             */
/* ------------------------------------------------------------------ */

export const PARTNERS = {
  eyebrow: "PLATFORMS WE BUILD ON",
  h2: "We install what we can stand behind.",
  body: "Husky works with the leading platforms in the industry and is certified to work with their systems.",
  /** [VERIFY: certification status and current brand list] */
  verify: true,
  names: ["Cisco", "Araknis", "Ubiquiti", "CommScope", "Sonos"] as const,
} as const;

/* ------------------------------------------------------------------ */
/*  6. Showcase  #showcase  (from the approved `/` page)               */
/* ------------------------------------------------------------------ */

export const SHOWCASE = {
  eyebrow: "The result",
  h2: "Technology you stop noticing.",
  caption: "Boca Raton · Lighting, audio and surveillance",
  image: {
    src: "/photos/estate-dusk-02.jpg",
    alt: "A Husky-integrated estate at dusk, interior and landscape lighting on",
  },
  /** Exactly the three words of the caption. No new claims. */
  annotations: ["LIGHTING", "AUDIO", "SURVEILLANCE"] as const,
} as const;

/* ------------------------------------------------------------------ */
/*  7. About  #about                                                   */
/* ------------------------------------------------------------------ */

export const ABOUT = {
  eyebrow: "WHO WE ARE",
  h2: "A luxury technology integrator, based in Boca Raton.",
  body: [
    {
      text: "We specialize in smart home technology, commercial control and automation, Wi-Fi, home cinema and audio/video distribution. For over 20 years we've worked with high-end residential and commercial clients across South Florida.",
      verify: true,
    },
    {
      text: "Training and continual improvement are part of our DNA, the platforms change every year, and staying current is the job.",
      verify: false,
    },
    {
      text: "Our work makes a home safe, elegant, and genuinely easy to use. For home offices, the same enterprise-grade networking that runs a business runs the house.",
      verify: false,
    },
  ] as const,
} as const;

/* ------------------------------------------------------------------ */
/*  8. Contact  #contact                                               */
/* ------------------------------------------------------------------ */

export interface Channel {
  label: string;
  value: string;
  href: string;
  external: boolean;
  primary?: boolean;
}

export const CONTACT = {
  eyebrow: "GET IN TOUCH",
  h2: "Tell us what you're building.",
  sub: "Whether it's a full new build or a single room, start with a conversation. We'll tell you honestly what the project needs.",
  channels: [
    {
      label: "WhatsApp",
      value: "+1 954 864 8005",
      href: WHATSAPP,
      external: true,
      primary: true,
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
    {
      label: "Instagram",
      value: "@huskyautomation",
      href: "https://www.instagram.com/huskyautomation/",
      external: true,
    },
    {
      label: "Facebook",
      value: "huskyautomation",
      href: "https://www.facebook.com/Husky-Automation-103635438516376",
      external: true,
    },
  ] satisfies Channel[],
  cta: {
    label: "Message Us on WhatsApp",
    href: WHATSAPP,
    external: true,
  } satisfies Cta,
} as const;
