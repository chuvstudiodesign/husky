export interface NavItem {
  name: string;
  href: string;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

export const navigation: NavSection[] = [
  {
    title: "Foundation",
    items: [{ name: "Design Tokens", href: "/styleguide" }],
  },
  {
    title: "Modern",
    items: [
      { name: "Overview", href: "/styleguide/modern" },
      { name: "Reveal", href: "/styleguide/modern/reveal" },
      { name: "Split Text", href: "/styleguide/modern/split-text" },
      { name: "Counter", href: "/styleguide/modern/counter" },
      { name: "Marquee", href: "/styleguide/modern/marquee" },
      { name: "Spotlight Card", href: "/styleguide/modern/spotlight-card" },
      { name: "Magnetic", href: "/styleguide/modern/magnetic" },
      { name: "Half Mark", href: "/styleguide/modern/half-mark" },
      { name: "Smooth Scroll", href: "/styleguide/modern/smooth-scroll" },
      { name: "Parallax", href: "/styleguide/modern/parallax" },
      { name: "Text Reveal Scroll", href: "/styleguide/modern/text-reveal-scroll" },
      { name: "Image Reveal", href: "/styleguide/modern/image-reveal" },
      { name: "Fold Text", href: "/styleguide/modern/fold-text" },
      { name: "Section Index", href: "/styleguide/modern/section-index" },
      { name: "Expanding List", href: "/styleguide/modern/expanding-list" },
      { name: "Grain", href: "/styleguide/modern/grain" },
    ],
  },
  {
    title: "Components",
    items: [
      { name: "Accordion", href: "/styleguide/components/accordion" },
      { name: "Alert", href: "/styleguide/components/alert" },
      { name: "Alert Dialog", href: "/styleguide/components/alert-dialog" },
      { name: "Aspect Ratio", href: "/styleguide/components/aspect-ratio" },
      { name: "Attachment", href: "/styleguide/components/attachment" },
      { name: "Avatar", href: "/styleguide/components/avatar" },
      { name: "Badge", href: "/styleguide/components/badge" },
      { name: "Breadcrumb", href: "/styleguide/components/breadcrumb" },
      { name: "Bubble", href: "/styleguide/components/bubble" },
    ],
  },
];
