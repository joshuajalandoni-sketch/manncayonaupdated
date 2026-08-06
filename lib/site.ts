/**
 * Single source of truth for identity, navigation and contact.
 * Nav order here IS scroll order on the page — the audit found the old site
 * broke that contract, so it is enforced from one array.
 */

export const site = {
  name: "Mann Cayona",
  role: "Woven Paintings",
  tagline: "Two paintings entered this room. One surface left it.",
  description:
    "Mann Cayona cuts finished oil paintings into strips and reweaves them by hand in Tigbauan, Iloilo — two canvases interlaced into a single, irreversible surface.",
  locale: "en_PH",
  url: "https://manncayona.vercel.app",
  location: {
    city: "Iloilo City",
    region: "Philippines",
    studio: "Tigbauan, Iloilo",
  },
  contact: {
    email: "mancayona@gmail.com",
    phone: "0938 838 6671",
    phoneHref: "tel:+639388386671",
  },
  social: [
    { label: "Instagram", href: "https://www.instagram.com/mann_cayona/" },
    { label: "Facebook", href: "https://www.facebook.com/mann.cayona" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/man-cayona-065750227/" },
  ],
} as const;

export type NavItem = {
  label: string;
  href: string;
  /** Rendered as the single action in the bar. */
  action?: boolean;
};

export const navigation: NavItem[] = [
  { label: "Work", href: "/#work" },
  { label: "Process", href: "/#process" },
  { label: "About", href: "/#about" },
  { label: "Exhibitions", href: "/#exhibitions" },
  { label: "Inquire", href: "/#inquire", action: true },
];

/** The three real series, replacing the old flat grid + "Recent Works" bin. */
export const series = [
  {
    slug: "woven-portraits",
    name: "Woven Portraits",
    blurb:
      "A single face, cut and returned to itself. What survives the weave is not likeness but the memory of looking.",
  },
  {
    slug: "narrative-weaves",
    name: "Narrative Weaves",
    blurb:
      "Two stories forced to share one surface. Rizal and Bonifacio. A rooster and a smaller bird. Neither yields.",
  },
  {
    slug: "studies",
    name: "Studies",
    blurb:
      "Small, fast, unresolved. The loom does not require permission to begin.",
  },
] as const;
