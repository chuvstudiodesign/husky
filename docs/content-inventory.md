# Content inventory — Husky Automation (huskyautomation.com)
Extracted 2026-08-30 from http://www.huskyautomation.com

## Method notes
The site is a **single HTML page** (`index.html`) with in-page anchor sections. The nav bar links to `#start`, `#services`, `#about`, `#contact` on the same document — there are no separate URLs for Home / Services / About / Contact. Attempts to fetch `/about`, `/about.html`, `/services`, `/services.html`, `/contact`, `/contact.html` all returned 404. So "pages" below are sections of one document, in DOM order. Content is server-rendered (static HTML), not client-rendered — full text was retrievable via a plain `curl` request.

## Site map
- Nav: Home (`#start`) · Our Services (`#services`) · About Us (`#about`) · Contact (`#contact`) · "Budget Request" button (WhatsApp link)
- Section: Home / hero (`#start`)
- Section: Our Services (`#services`) — 8 service tiles, each opens a modal with a longer description
- Section: About Us (`#about`)
- Section: Contact (`#contact`) — address, mail, phone, Instagram, Facebook
- Footer

## Page: Home (hero section, `#start`)
### Smart Homes
(H1)

Body copy (verbatim):
> When technology knocks on your door.

CTA button: **Get Started** (scrolls to `#services`)

## Page: Our Services (`#services`)
### Our Services
(H2 section title)

Section is a grid of 8 clickable tiles (icon + H5 label). Clicking opens a modal with an image and a paragraph of body copy. Verbatim H5 labels and modal copy below (see also the Services table).

## Page: About Us (`#about`)
### About Us
(H2)

Body copy (verbatim, two paragraphs):

> We are a luxury technology systems integrator specializing in **Smart Home** technology, commercial control, automation, Wi-Fi, Movie Theater, and audio/video distribution solutions. Our firm has over 20 years of experience with high-end residential and commercial customers in South Florida. Training and continual improvement are part of our DNA. Our **Smart Home** solutions make your home safe, elegant, fun, and easy to use.

> Home offices can experience increased productivity through enterprise-grade technology improvements, and residents can elevate their home experience through automation and intelligent networking. **Husk Automation** works with the leading brands in the business, like Cisco, Araknis, Ubiquiti, CommScope, and Sonos, and is certified to work with their systems.

CTA link: **Access our Digital Card** → https://cartaodigital.me/huskyautomation/ (external, opens in new tab; digital business card — not fetched/verified as part of this scope, flagged below)

Note: source HTML literally reads "**Husk Automation**" (missing the "y") in the second About paragraph — verbatim typo, flagged below.

## Page: Contact (`#contact`)
### Contact
(H2)

Four contact tiles, each verbatim:

- **Where?** — "4301 Oak Cir #26, Boca Raton, FL 33431" (linked to Google Maps: https://goo.gl/maps/Qs29ngQRJVS6ptjc9)
- **Mail** — "Send a message" (mailto:info@huskyautomation.com)
- **Call Us** — "+1-954-864-8005" (tel:+1-954-864-8005)
- **Instagram** — "@huskyautomation" (https://www.instagram.com/huskyautomation/)
- **Facebook** — "huskyautomation" (https://www.facebook.com/Husky-Automation-103635438516376)

No contact form exists on the page — contact is via mailto/tel/social links and the WhatsApp "Budget Request" button only. No hours of operation are published anywhere on the site.

## Footer
- "Husky Automation 2021" (heading — appears to be a copyright/year stamp, now stale, see flags)
- "Husky Automation Corp" (small text — legal entity name)
- "Powered by Oxe Digital" (https://oxe.digital) — site builder credit, boilerplate, likely not to be carried over

## Services
| Service | Description as written |
|---|---|
| Automation | **Husky Automation** is committed to making your life easier by customizing your home. Our **Smart Home** is designed to be more efficient and secure while maintaining your personal touch and tailored to your need. Besides saving time and money, having a **Smart Home** also enhances your house quality and protection. At **Husky Automation**, we proudly provide top-of-the-line **Smart Home** products and complete electrical installation, either using house electricians or using our national network of partners. Our **Smart Home** products aim to improve enjoyment and comfort. |
| Home Cinema | Recreate the theater environment in your own home! **Husky Automation** can provide your family with the most pleasing movie experience. Enjoy a whole-home surround sound system and impeccable video with AirPlay capabilities. |
| Outdoor Entertainment | Make the most of the warmer months and bring your garden and patio to life with an outdoor audiovisual system designed for you. Have friends over for a barbeque, throw a party under the stars, or relax in your backyard; **Husky Automation** lets you set the tone for any outdoor entertaining with your favorite movies and music. |
| Smart Lighting | **Husky Automation** helps you to improve your home with a lighting and climate control system that matches your lifestyle and presents you with accessibility, energy conservation, and security, creating a quiet and beautiful environment. |
| Surveillance | Surveillance systems are some of our most requested services. **Husky Automation** offers installation, maintenance, and monitoring of surveillance systems. Being able to view your property in real-time, lock and unlock doors, as well as the ability to speak to people at your door, gate, or guesthouse using the intercom feature, brings us peace of mind. |
| Wi-Fi | Due to increased demands for connectivity, we all have become subject to the internet and Wi-Fi, whether for work, kid's homework, or just a browse on social media or YouTube. **Husky Automation** determines the best locations for wireless access points and designs hardwired connections for TVs that use them for streaming sites and desktop computers. |
| Multi Room Audio | Easily stream music anywhere in your house, pressing only one button or just talking to your artificial intelligence. **Husky Automation** helps you to play music in any room you would like, or all of them at once! |
| Smart Blinds | Being able to open all motorized window shades at once or even set up a timer, so the shades close or open automatically, is one of **Husky Automation's** favorite elements of a **Smart Home**. Motorized blinds roll up and down so quietly and effortlessly that they will surely make your life more pleasant. |

Tile labels vs. modal titles are identical for each service, except "Multi Room Audio" is labeled with icon `alt="Audio"` (minor inconsistency, not content-bearing).

Meta-level service framing (from `<meta name="description">`, not shown to visitors but reflects the company's own summary — useful for rebuild copy):
> "We are a full-service custom, luxury technology systems integrator specializing in smart home technology, commercial control and automation, Wi-Fi, Movie Theathers and audio/video distribution solutions." (note: "Theathers" is a typo in the source for "Theaters")

Meta keywords tag: automation, home cinema, outdoor entertainment, smart lighting, surveillance, wifi, multi room audio, smart blinds

## Credibility assets
- **Years in business**: "Our firm has over 20 years of experience with high-end residential and commercial customers in South Florida." (About section) — NEEDS CLIENT VERIFICATION before republishing; no founding date given to cross-check.
- **Service territory**: South Florida (explicitly named); office address is Boca Raton, FL.
- **Brands carried / certified to work with**: "Cisco, Araknis, Ubiquiti, CommScope, and Sonos" — About section states Husky "is certified to work with their systems." No specific certification names, badge, or authorized-dealer logos are shown in text; NEEDS CLIENT VERIFICATION (which certifications, current status, any additional brands not listed).
- **National network of partners**: mentioned only in the Automation service description ("complete electrical installation, either using house electricians or using our national network of partners") — no further detail given.
- **Number of installations**: not stated anywhere on the site.
- **Awards**: none stated anywhere on the site.
- **Superlative/marketing claims to verify before reuse**: "full-service" (meta description), "luxury technology systems integrator" (About + meta description), "leading brands in the business" (About), "most requested services" (Surveillance description) — all unverified/unsourced superlatives.
- **Legal entity name**: "Husky Automation Corp" (footer) — only place a formal legal name appears. No license numbers, insurance info, or regulatory disclaimers found anywhere on the site.

## Contact
- **Address**: 4301 Oak Cir #26, Boca Raton, FL 33431 (linked to Google Maps: https://goo.gl/maps/Qs29ngQRJVS6ptjc9)
- **Phone**: +1-954-864-8005 (tel: link, labeled "Call Us")
- **Email**: info@huskyautomation.com (mailto: link, labeled "Mail" / "Send a message")
- **WhatsApp**: https://api.whatsapp.com/send?phone=19548648005 (used for the primary "Budget Request" CTA button, present in the nav bar, not in the contact section)
- **Instagram**: @huskyautomation — https://www.instagram.com/huskyautomation/
- **Facebook**: huskyautomation — https://www.facebook.com/Husky-Automation-103635438516376
- **Hours of operation**: not published anywhere on the site.
- **Contact form**: none exists; no form fields to capture.
- **Digital business card**: https://cartaodigital.me/huskyautomation/ (linked from About section as "Access our Digital Card") — third-party service, not fetched as part of this scope; may contain additional/duplicate contact info worth checking.

## Calls to action
- **"Budget Request"** — nav bar button, links to WhatsApp chat (https://api.whatsapp.com/send?phone=19548648005)
- **"Get Started"** — hero button, scrolls to `#services`
- **"Access our Digital Card"** — About section link, opens https://cartaodigital.me/huskyautomation/
- **"Where?" / "Mail" / "Call Us" / "Instagram" / "Facebook"** — contact section tile labels, each functioning as a click-through CTA to maps/mailto/tel/social
- Modal **"Close"** buttons on each service modal (utility UI, not marketing copy)

## Gaps and flags
- **Site is a single page**: Home, Services, About, and Contact requested as separate "pages" are actually one HTML document with anchor sections. Flag for whoever scoped the rebuild as multi-page — confirm whether the new Next.js site should also be a single page or should be split into real routes.
- **Typo — "Husk Automation"**: second About paragraph reads "Husk Automation" (missing "y") in the source. Verbatim per instructions, but flagged as a likely error to fix, not preserve.
- **Typo — "Theathers"**: meta description reads "Movie Theathers" (should be "Theaters"). Not customer-facing visible text, but worth noting since it may get reused as page-description copy.
- **"20 years of experience" claim**: no supporting detail (founding year, project count) anywhere on the site. Needs client verification before republishing, and ideally a specific founding year for credibility.
- **Brand/certification claims**: "certified to work with their systems" (Cisco, Araknis, Ubiquiti, CommScope, Sonos) is asserted with no certification names, dates, or badges. Needs client verification — confirm current authorized-dealer/certification status and whether the brand list is current.
- **No number-of-installations, no awards, no license numbers, no insurance/compliance disclaimers found anywhere on the site.** If the client wants these on the new site, they'll need to supply them — nothing to extract here.
- **Footer year "Husky Automation 2021"**: reads as a static copyright stamp, now stale (current year 2026). Flag as boilerplate/dated, needs updating rather than carrying over verbatim.
- **"Powered by Oxe Digital" footer credit**: boilerplate from the previous site builder; client should decide whether to carry any attribution forward (unlikely, since this is a rebuild).
- **Digital business card link** (https://cartaodigital.me/huskyautomation/): not part of the requested crawl scope (external third-party domain), but linked prominently from About. Flag for the client/team to check its contents in case it holds additional contact info, reviews, or credentials not present on the main site.
- **Icon images carry only labels already captured in text** (Automation, Home Cinema, Outdoor Entertainment, Smart Lighting, Surveillance, Wi-Fi, Multi Room Audio, Smart Blinds icons; also a generic "About us" image, and social icons). No information exists only inside these images — all are decorative/duplicative of the adjacent text, so nothing flagged as image-only content requiring an asset.
- **og:image** (https://huskyautomation.com/assets/images/og-husky.png): social-share image, not inspected for embedded text; flag only if the rebuild needs a replacement social-share graphic.
- **No hours of operation and no contact form** exist on the current site — both are common on service-business sites; client should decide whether to add these to the new build.
- **Minor inconsistency**: the "Multi Room Audio" service tile's icon has `alt="Audio"` rather than "Multi Room Audio" — not content-bearing, just noted for completeness.
