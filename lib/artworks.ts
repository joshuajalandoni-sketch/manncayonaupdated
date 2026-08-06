/**
 * The collection.
 *
 * Notes are rewritten per the audit: the old site pasted two boilerplate
 * sentences into every entry and opened eight of them with "New work added to
 * the collection." Every work here carries only its own sentence.
 *
 * `image` is intentionally optional. Until real high-res photography lands,
 * each work renders a generated weave plate built from its own dye pair.
 * When assets arrive, fill `image` and nothing else changes.
 */

export type SeriesSlug = "woven-portraits" | "narrative-weaves" | "studies";

export type ArtworkImage = {
  src: string;
  width: number;
  height: number;
  /** Tiny base64 LQIP. next/image renders it under the real file while loading. */
  blurDataURL?: string;
};

export type Artwork = {
  slug: string;
  title: string;
  /** Hiligaynon or Filipino sense of the title, where the title carries one. */
  meaning?: string;
  series: SeriesSlug;
  year: number;
  medium: string;
  dimensions: { w: number; h: number; unit: "cm" | "in" | "ft" };
  /** width / height. Drives grid layout without unit maths. */
  aspect: number;
  note: string;
  price?: number;
  available: boolean;
  /** Flags works that must not be shown at thumbnail parity with small ones. */
  monumental?: boolean;
  /** The two finished paintings this surface was cut from, when documented. */
  sources?: { label: string; image?: ArtworkImage }[];
  /** Two dyes from the palette, used for the generated plate. */
  dyes: [string, string];
  image?: ArtworkImage;
  /** Macro shot of the interlace. The audit's highest-priority missing asset. */
  detail?: ArtworkImage;
};

export const artworks: Artwork[] = [
  {
    slug: "the-witness",
    title: "The Witness",
    series: "woven-portraits",
    year: 2026,
    medium: "Acrylic on canvas, woven",
    dimensions: { w: 26, h: 34, unit: "cm" },
    aspect: 26 / 34,
    note: "One green eye holds the whole composition together. The rest of the face fractures around it, unwilling to look away.",
    price: 16999,
    available: true,
    dyes: ["var(--dagat-500)", "var(--ink-950)"],
  },
  {
    slug: "two-heroes",
    title: "Two Heroes",
    series: "narrative-weaves",
    year: 2026,
    medium: "Acrylic on canvas, woven",
    dimensions: { w: 26, h: 32, unit: "cm" },
    aspect: 26 / 32,
    note: "Jose Rizal and Andres Bonifacio, layered into a single red-and-teal weave. Two versions of the same struggle for independence.",
    price: 18999,
    available: true,
    sources: [
      { label: "Portrait of Jose Rizal, oil on canvas" },
      { label: "Portrait of Andres Bonifacio, oil on canvas" },
    ],
    dyes: ["var(--achuete-500)", "var(--dagat-500)"],
  },
  {
    slug: "hingabut",
    title: "Hingabut",
    meaning: "Hiligaynon: to gasp, to hold on",
    series: "narrative-weaves",
    year: 2026,
    medium: "Acrylic on canvas, woven",
    dimensions: { w: 4, h: 5, unit: "ft" },
    aspect: 4 / 5,
    note: "A crew straining against a storm, rendered at full scale. You do not lean in to this one; you stand back.",
    price: 21999,
    available: true,
    monumental: true,
    dyes: ["var(--tayum-500)", "var(--dagat-300)"],
  },
  {
    slug: "internal-embrace",
    title: "Internal Embrace",
    series: "narrative-weaves",
    year: 2026,
    medium: "Acrylic on canvas, woven",
    dimensions: { w: 30, h: 40, unit: "cm" },
    aspect: 30 / 40,
    note: "Two faces held in a single duotone field of blue. The weave makes literal what the title says in words: two held as one.",
    price: 18499,
    available: true,
    dyes: ["var(--tayum-500)", "var(--tayum-700)"],
  },
  {
    slug: "caravaggio",
    title: "Caravaggio",
    series: "woven-portraits",
    year: 2026,
    medium: "Acrylic on canvas, woven",
    dimensions: { w: 24, h: 32, unit: "cm" },
    aspect: 24 / 32,
    note: "Two figures caught mid-exchange, coins passing between them. A nod to the old master's taste for gamblers and cheats, rebuilt thread by thread.",
    price: 16499,
    available: true,
    dyes: ["var(--achuete-600)", "var(--ink-950)"],
  },
  {
    slug: "the-candle-mann",
    title: "The Candle-Mann",
    series: "narrative-weaves",
    year: 2024,
    medium: "Oil on canvas",
    dimensions: { w: 24, h: 36, unit: "cm" },
    aspect: 24 / 36,
    note: "A figure with a lit candle for a head, seated among ghostly onlookers and floating books. Candles lit the artist's childhood home when electricity could not; here that memory becomes myth.",
    price: 15999,
    available: true,
    dyes: ["var(--dulaw-500)", "var(--ink-950)"],
  },
  {
    slug: "charlie",
    title: "Charlie",
    series: "woven-portraits",
    year: 2026,
    medium: "Acrylic on canvas, woven",
    dimensions: { w: 28, h: 22, unit: "cm" },
    aspect: 28 / 22,
    note: "A wide-eyed stare frozen mid-blink, the weave breaking the expression into something closer to memory than photograph.",
    price: 14999,
    available: true,
    dyes: ["var(--dulaw-300)", "var(--ink-800)"],
  },
  {
    slug: "ancient-rat-race",
    title: "Ancient Rat Race",
    series: "narrative-weaves",
    year: 2026,
    medium: "Oil on canvas",
    dimensions: { w: 24, h: 36, unit: "cm" },
    aspect: 24 / 36,
    note: "A rooster squares up against a smaller bird. Rivalry as an old story, told again in every generation.",
    price: 19499,
    available: true,
    dyes: ["var(--achuete-500)", "var(--tayum-500)"],
  },
  {
    slug: "big-fish",
    title: "Big Fish",
    meaning: "Malaking Isda",
    series: "studies",
    year: 2026,
    medium: "Acrylic on canvas, woven",
    dimensions: { w: 22, h: 22, unit: "cm" },
    aspect: 1,
    note: "A wink at Iloilo's signature catch. Milkfish and man sharing a face, a cigarette, and a punchline.",
    price: 32000,
    available: true,
    dyes: ["var(--dagat-500)", "var(--dulaw-500)"],
  },
  {
    slug: "twin-study",
    title: "Twin Study",
    series: "woven-portraits",
    year: 2026,
    medium: "Acrylic on canvas, woven",
    dimensions: { w: 30, h: 40, unit: "cm" },
    aspect: 30 / 40,
    note: "Two profiles folded into one weave, green and orange trading places depending on where the light falls.",
    price: 15499,
    available: true,
    dyes: ["var(--dagat-500)", "var(--achuete-400)"],
  },
  {
    slug: "crown",
    title: "Crown",
    series: "woven-portraits",
    year: 2024,
    medium: "Oil on canvas",
    dimensions: { w: 24, h: 24, unit: "in" },
    aspect: 1,
    note: "A close, upward gaze beneath a crown of thorns, light concentrated on the face against a near-black ground.",
    price: 18999,
    available: true,
    dyes: ["var(--dulaw-500)", "var(--ink-950)"],
  },
  {
    slug: "turquoise-study",
    title: "Turquoise Study",
    series: "studies",
    year: 2026,
    medium: "Acrylic on canvas, woven",
    dimensions: { w: 32, h: 42, unit: "cm" },
    aspect: 32 / 42,
    note: "Warm skin tones cut through with unexpected turquoise. The weave doing the work of colour theory.",
    price: 17299,
    available: true,
    dyes: ["var(--dagat-300)", "var(--achuete-400)"],
  },
  {
    slug: "portrait-ii",
    title: "Portrait II",
    series: "woven-portraits",
    year: 2026,
    medium: "Acrylic on canvas, woven",
    dimensions: { w: 28, h: 40, unit: "cm" },
    aspect: 28 / 40,
    note: "A closer, quieter portrait. Teal and gold interlaced across a half-turned face.",
    price: 16999,
    available: true,
    dyes: ["var(--dagat-500)", "var(--dulaw-300)"],
  },
  {
    slug: "bahalana",
    title: "Bahalana",
    meaning: "Ilonggo: come what may",
    series: "narrative-weaves",
    year: 2026,
    medium: "Oil on canvas",
    dimensions: { w: 24, h: 30, unit: "cm" },
    aspect: 24 / 30,
    note: "A carabao shouldering the day's work, unbothered by what is ahead.",
    price: 12999,
    available: false,
    dyes: ["var(--dulaw-500)", "var(--canvas-500)"],
  },
  {
    slug: "third-eye",
    title: "Third Eye",
    series: "studies",
    year: 2023,
    medium: "Acrylic on canvas",
    dimensions: { w: 20, h: 20, unit: "in" },
    aspect: 1,
    note: "A surreal cat with a moonlit landscape reflected in one eye. Dream logic rendered in fur and folklore.",
    price: 14499,
    available: true,
    dyes: ["var(--tayum-300)", "var(--achuete-400)"],
  },
  {
    slug: "visitor",
    title: "Visitor",
    series: "studies",
    year: 2024,
    medium: "Oil on canvas",
    dimensions: { w: 18, h: 22, unit: "in" },
    aspect: 18 / 22,
    note: "A quiet, large-eyed figure emerging from shadow and firelight. Restraint over spectacle.",
    price: 13999,
    available: true,
    dyes: ["var(--achuete-500)", "var(--ink-950)"],
  },
  {
    slug: "study",
    title: "Study",
    series: "studies",
    year: 2026,
    medium: "Acrylic on canvas, woven",
    dimensions: { w: 28, h: 36, unit: "cm" },
    aspect: 28 / 36,
    note: "A quiet, unresolved figure study. Less about the subject than the act of looking.",
    price: 13999,
    available: true,
    dyes: ["var(--canvas-500)", "var(--ink-700)"],
  },
  {
    slug: "gesture",
    title: "Gesture",
    series: "studies",
    year: 2025,
    medium: "Acrylic on canvas, woven",
    dimensions: { w: 20, h: 28, unit: "cm" },
    aspect: 20 / 28,
    note: "A small, fast study. Economy of line held together by the weave.",
    price: 13499,
    available: true,
    dyes: ["var(--canvas-400)", "var(--ink-800)"],
  },
];

/* ── Formatting ─────────────────────────────────────────────────────────── */

const TO_CM = { cm: 1, in: 2.54, ft: 30.48 } as const;

/**
 * The old site mixed cm, in and ft freely across the collection. Metric is
 * primary, imperial parenthetical, so a curator can compare two works without
 * doing arithmetic.
 */
export function formatDimensions(d: Artwork["dimensions"]): string {
  const round = (n: number) => Math.round(n * 10) / 10;
  const wCm = round(d.w * TO_CM[d.unit]);
  const hCm = round(d.h * TO_CM[d.unit]);
  const wIn = Math.round(wCm / 2.54);
  const hIn = Math.round(hCm / 2.54);
  return `${wCm} × ${hCm} cm (${wIn} × ${hIn} in)`;
}

export function formatPrice(n: number): string {
  return `₱${n.toLocaleString("en-PH")}`;
}

export function artworkBySlug(slug: string): Artwork | undefined {
  return artworks.find((a) => a.slug === slug);
}
