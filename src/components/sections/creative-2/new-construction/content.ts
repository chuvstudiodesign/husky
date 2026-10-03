/**
 * Creative 2, New Construction — every string on the page, in one place.
 *
 * Source: `docs/copy-new-construction.md`, verbatim, with the Creative 2 house
 * rule applied (every em dash in the copy is a comma, client order). Eyebrows are
 * the copy doc's own section names. `[VERIFY]` items are flagged with
 * `verify: true` and stay in the copy until the client confirms them; the two
 * `[NEEDS CLIENT]` notes (a builder testimonial, a named list of cities) are
 * requests to the client, not copy, and render nothing.
 *
 * Sections import from here; no string is retyped in a component.
 */

import {
  WHATSAPP,
  type Cta,
  type ServiceIconKey,
} from "@/components/sections/creative-2/content";

/** The Creative 2 home. Every link back to the home page targets it, never `/`. */
export const HOME = "/";

export interface Paragraph {
  text: string;
  verify?: boolean;
}

export interface PassageCopy {
  /** Section id, and the stem of its heading id. */
  id: string;
  eyebrow: string;
  /** A `\n` is an authored line break, honoured from `lg` up only; below it
   *  the heading wraps on its own (see `passage.tsx`). */
  h2: string;
  body: readonly Paragraph[];
}

/* ------------------------------------------------------------------ */
/*  Meta                                                               */
/* ------------------------------------------------------------------ */

export const META = {
  title:
    "Building a New Home in Florida? Bring Your Integrator in Early, Husky Audio Video",
  description:
    "Why smart home technology belongs in the plans alongside plumbing and electrical, and what it costs to add it later. Guidance for South Florida builds.",
  ogTitle: "Building in Florida? Bring your integrator in early.",
  ogDescription:
    "Why smart home technology belongs in the plans alongside plumbing and electrical, and what it costs to add it later.",
} as const;

/* ------------------------------------------------------------------ */
/*  1. Hero                                                            */
/* ------------------------------------------------------------------ */

export const HERO = {
  eyebrow: "OUR APPROACH",
  /** Two authored lines; render each as its own block. */
  h1Lines: ["Building in Florida?", "Bring your integrator in early."] as const,
  lead: "The most expensive smart home is the one added after the drywall goes up. Here's how we think about planning a build, and why the timing matters more than the hardware.",
} as const;

/* ------------------------------------------------------------------ */
/*  2. Plan before you build                                           */
/* ------------------------------------------------------------------ */

export const PLAN = {
  id: "plan",
  eyebrow: "PLAN BEFORE YOU BUILD",
  h2: "Plan the technology before\nyou start building.",
  body: [
    {
      text: "If you're building a new home in South Florida, don't wait until construction is underway to think about technology.",
    },
    {
      text: "Your integrator should be at the table with your architect, your builder, your interior designer and your landscape designer, while the plan is still on paper and changing it costs nothing but a conversation.",
    },
  ],
} as const satisfies PassageCopy;

/* ------------------------------------------------------------------ */
/*  3. Technology is infrastructure                                    */
/* ------------------------------------------------------------------ */

export const INFRASTRUCTURE = {
  id: "infrastructure",
  eyebrow: "TECHNOLOGY IS INFRASTRUCTURE",
  h2: "Technology is part of the house now, not an accessory to it.",
  body: [
    {
      text: "Thirty years ago, wiring a home meant power and a phone line. Today it means structured cabling, wireless coverage planned room by room, rack space with real ventilation, and enough conduit to carry whatever replaces today's hardware.",
    },
    {
      text: "That belongs in the drawings, next to plumbing and electrical. Not in a change order.",
    },
  ],
} as const satisfies PassageCopy;

/* ------------------------------------------------------------------ */
/*  4. The cost of deciding late                                       */
/* ------------------------------------------------------------------ */

export const COST = {
  id: "cost",
  eyebrow: "THE COST OF DECIDING LATE",
  h2: "Every decision gets more expensive after the walls close.",
  body: [
    { text: "Open walls are free. Closed walls are demolition." },
    {
      text: "A speaker that would have been flush-mounted becomes a box on a bracket. A camera that needed one cable run now needs a battery and a compromise. Shades that should have had a recessed pocket sit in a visible housing instead.",
    },
    {
      text: "None of it is impossible later. All of it is worse and costs more.",
    },
  ],
} as const satisfies PassageCopy;

/* ------------------------------------------------------------------ */
/*  5. Better spaces through collaboration                             */
/* ------------------------------------------------------------------ */

export interface Room {
  /** h3 */
  name: string;
  body: string;
  /** Which drawn icon fills the plate (creative-2 `service-icons.tsx`). The
   *  service each room grounds in, per the copy doc's provenance table. */
  icon: ServiceIconKey;
}

export const COLLABORATION = {
  id: "collaboration",
  eyebrow: "BETTER SPACES THROUGH COLLABORATION",
  h2: "The best rooms come from people talking early.",
  rooms: [
    {
      name: "Home cinema",
      body: "A theater is architecture before it's equipment. Seating distance, screen height, sightlines, where the projector hangs, how the room is treated acoustically, those are decisions made with the architect, not after the room is framed.",
      icon: "home-cinema",
    },
    {
      name: "Lighting and shading",
      body: "Lighting design and shade design are the same conversation. Where the light comes from, what the sun does to that room at 4pm, and how both are controlled without a wall of switches.",
      icon: "smart-lighting",
    },
    {
      name: "Outdoor living",
      body: "Patios, pools and summer kitchens need power, network and audio planned with the landscape, before the hardscape goes down and the trenching is over.",
      icon: "outdoor-entertainment",
    },
  ] satisfies Room[],
} as const;

/* ------------------------------------------------------------------ */
/*  6. Technology can be invisible                                     */
/* ------------------------------------------------------------------ */

export const INVISIBLE = {
  id: "invisible",
  eyebrow: "TECHNOLOGY CAN BE INVISIBLE",
  h2: "The best system is the one you don't see.",
  body: [
    {
      text: "Good integration disappears. Speakers sit flush. Racks live in a closet, not a living room. Keypads replace switch banks. The equipment does its work without asking for attention.",
    },
    { text: "That outcome is a planning decision, not a product decision." },
  ],
} as const satisfies PassageCopy;

/* ------------------------------------------------------------------ */
/*  7. Florida specifics                                               */
/* ------------------------------------------------------------------ */

export const FLORIDA = {
  id: "florida",
  eyebrow: "FLORIDA SPECIFICS",
  h2: "Florida homes ask more\nof the equipment.",
  body: [
    {
      text: "Heat, humidity, salt air and storm season are not edge cases here, they're the operating conditions.",
    },
    {
      text: "Outdoor gear has to be specified for it, not adapted to it. Racks need real ventilation. Equipment needs clean power and a plan for what happens when the grid doesn't cooperate. Coastal builds are harder on hardware than inland ones.",
    },
    {
      /** [VERIFY] "over 20 years" */
      text: "We've been building in South Florida for over 20 years. The climate is part of every specification we write.",
      verify: true,
    },
  ],
} as const satisfies PassageCopy;

/* ------------------------------------------------------------------ */
/*  8. The network underneath                                          */
/* ------------------------------------------------------------------ */

export const NETWORK = {
  id: "network",
  eyebrow: "THE NETWORK UNDERNEATH",
  h2: "Everything depends on the network.",
  body: [
    {
      text: "Automation, cameras, streaming, shades, climate, and everyone working from home all ride the same infrastructure. When the network is an afterthought, the whole system is unreliable and nobody can tell you why.",
    },
    {
      /** [VERIFY: certification status] */
      text: "We survey the house, place access points where coverage actually lands, and hardwire the things that should never buffer. We build on Cisco, Araknis, Ubiquiti and CommScope.",
      verify: true,
    },
  ],
} as const satisfies PassageCopy;

/* ------------------------------------------------------------------ */
/*  9. Future-proofing                                                 */
/* ------------------------------------------------------------------ */

export const FUTURE = {
  id: "future-proofing",
  eyebrow: "FUTURE-PROOFING",
  h2: "Open walls are the cheapest insurance you'll ever buy.",
  body: [
    {
      text: "Nobody knows what a living room will need in ten years. But we know how to leave room for it, conduit to the places that will matter, capacity beyond today's devices, and a rack with space left in it.",
    },
    {
      text: "Pulling a spare run during construction costs almost nothing. Pulling it afterwards means opening a finished wall.",
    },
  ],
} as const satisfies PassageCopy;

/* ------------------------------------------------------------------ */
/*  10. Simplicity is the goal                                         */
/* ------------------------------------------------------------------ */

export const SIMPLICITY = {
  id: "simplicity",
  eyebrow: "SIMPLICITY IS THE GOAL",
  h2: "The point of all of it is that it feels simple.",
  body: [
    {
      text: "A house full of apps is not a smart home. It's a house full of apps.",
    },
    {
      text: "The measure of a good system is that anyone can walk in and use it, one remote, one keypad, one sentence. Guests included. That simplicity is engineered, and it's the hardest part of the job.",
    },
  ],
} as const satisfies PassageCopy;

/* ------------------------------------------------------------------ */
/*  11. Why builders bring us in early                                 */
/* ------------------------------------------------------------------ */

/** [NEEDS CLIENT] A builder or architect testimonial, or the name of a firm Husky
 *  works with regularly, would go here. Nothing renders until the client sends it. */
export const BUILDERS = {
  id: "builders",
  eyebrow: "WHY BUILDERS BRING US IN EARLY",
  h2: "Builders and designers who've done this once, do it this way every time.",
  body: [
    {
      text: "Early involvement means fewer change orders, no surprise conduit requests at framing, and no conversation about why the speaker can't go where the client wants it.",
    },
    { text: "We work alongside the trades rather than after them." },
  ],
} as const satisfies PassageCopy;

/* ------------------------------------------------------------------ */
/*  12. Close                                                          */
/* ------------------------------------------------------------------ */

/** [NEEDS CLIENT] A named list of cities served would go in this close. Until
 *  then the colophon says "South Florida", as the copy does. */
export const CLOSE = {
  id: "start",
  h2: "Start before construction begins.",
  sub: "If your project is in design, or if the ground has broken and you're wondering whether it's too late, talk to us. Early is better, but useful is useful.",
  colophon: "Husky Audio Video · Boca Raton · serving South Florida",
  primaryCta: {
    label: "Start the Conversation",
    href: WHATSAPP,
    external: true,
  } satisfies Cta,
  secondaryCta: {
    label: "See Our Services",
    href: `${HOME}#services`,
  } satisfies Cta,
} as const;
