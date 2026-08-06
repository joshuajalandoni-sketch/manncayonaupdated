/**
 * Exhibitions & Recognition.
 *
 * Presented as a CV, not as a trophy case. The old site ran a logo marquee
 * headed "As Featured In & Supported By" that mixed real local credits with
 * Capital One, The New York Times, Google Arts & Culture and DeviantArt. That
 * reads as inflation to the exact audience this section exists for, and it
 * discounted the genuine ILOMOCA and broadcast credits by association. Only
 * outlets and institutions corroborated by the exhibition record below are
 * listed here.
 *
 * `year` is missing on most entries because the source site never recorded it.
 * Rendering an em dash keeps the gap visible and trivially fillable rather
 * than quietly inventing dates.
 */

export type ExhibitionKind = "Group" | "Solo" | "Fair" | "Talk";

export type Exhibition = {
  name: string;
  /** Translation or subtitle, where the title carries one. */
  subtitle?: string;
  venue: string;
  /** As recorded. Year unknown for most; see note above. */
  date: string;
  year?: number;
  kind: ExhibitionKind;
};

export const exhibitions: Exhibition[] = [
  {
    name: "Cebu Art Fair",
    venue: "Ayala Center Cebu, Booth G1",
    date: "30 Aug – 1 Sep",
    year: 2024,
    kind: "Fair",
  },
  {
    name: "Samo-Samo",
    subtitle: "Linangan sa Iloilo",
    venue: "ILOMOCA, Festive Walk Parade, Mandurriao",
    date: "10 Jan – 5 Feb",
    kind: "Group",
  },
  {
    name: "Kabug-Usan Sang Laragway",
    subtitle: "Anatomy of an Image",
    venue: "Thrive Art Gallery, The Shops at Atira, Ayala Malls",
    date: "16 May",
    kind: "Group",
  },
  {
    name: "Pangámot",
    venue: "Balay Sueño, Jaro, Iloilo City",
    date: "14 Mar",
    kind: "Group",
  },
  {
    name: "Pang aLima",
    subtitle: "Disenyo Tigbaueño 6.1",
    venue: "Tagatig's 5th Anniversary, Sol y Mar Beach Resort",
    date: "11 Oct",
    kind: "Group",
  },
  {
    name: "Disenyo Tigbaueño 4.0",
    subtitle: "Bilidhon Nga Hiyas",
    venue: "Saludan Festival, Sol y Mar Beach Resort, Tigbauan",
    date: "9 – 31 Oct",
    kind: "Group",
  },
  {
    name: "Patikim",
    subtitle: "Panel talk",
    venue: "Samo-Samo, ILOMOCA, Mandurriao",
    date: "20 Dec",
    kind: "Talk",
  },
];

export type PressItem = { outlet: string; medium: string };

export const press: PressItem[] = [
  { outlet: "ABS-CBN", medium: "Broadcast" },
  { outlet: "TV5", medium: "Broadcast" },
  { outlet: "Philippine Daily Inquirer", medium: "Print" },
  { outlet: "Aksyon Radyo Iloilo", medium: "Radio" },
  { outlet: "Vice", medium: "Digital" },
];

export const institutions: string[] = [
  "Iloilo Museum of Contemporary Art (ILOMOCA)",
  "Thrive Art Projects",
];

/**
 * One real quote. Room is deliberately left for more — add entries here and
 * the layout handles them without changes. Nothing is placeheld in the UI,
 * because an invented pull quote on an artist's site is worse than one quote.
 */
export type Quote = { text: string; source: string };

export const quotes: Quote[] = [
  {
    text: "Manman's weave art doesn't just honor tradition — it electrifies it. Every thread feels alive, every piece a quiet revolution in texture and form.",
    source: "Vice",
  },
];
