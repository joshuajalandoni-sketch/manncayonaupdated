import { Section, SectionHeading } from "@/components/section";
import { Gallery } from "@/components/gallery/gallery";
import { ArtworkImage } from "@/components/gallery/artwork-image";
import { ProcessSection } from "@/components/process/process-section";
import { AboutSection } from "@/components/about/about-section";
import { ExhibitionsSection } from "@/components/exhibitions/exhibitions-section";
import { InquireSection } from "@/components/inquire/inquire-section";
import { artworkBySlug, artworks, formatDimensions } from "@/lib/artworks";
import { exhibitions } from "@/lib/exhibitions";
import { site } from "@/lib/site";

/**
 * Page in the redesigned IA order:
 *   Threshold -> Work -> The Cut -> The Weave -> Exhibitions -> Inquire
 *
 * Nav order matches scroll order exactly. No section sets its own padding.
 */

const anchor = artworkBySlug("the-witness") ?? artworks[0];

/* ── 1. Threshold ─────────────────────────────────────────────────────────── */

function Threshold() {
  return (
    <section
      id="threshold"
      data-section="threshold"
      data-tone="dark"
      className="relative flex min-h-svh flex-col justify-end overflow-hidden"
    >
      {/* The anchor work, full bleed. It is the first and loudest thing, and
          the page's LCP image — the only one marked priority. */}
      <div className="absolute inset-0">
        <ArtworkImage
          artwork={anchor}
          sizes="100vw"
          priority
          strip={22}
          className="scale-105"
        />
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/40"
      />

      <div className="relative mx-auto w-full max-w-wide px-(--spacing-gutter) pb-16 md:pb-20">
        {/* The page's h1. The artist's name is in the nav and in structured
            data; the statement is what the page is actually about. */}
        <h1 className="max-w-[22ch] font-display text-h1 leading-[1.06] text-white animate-rise">
          Each piece is a thread in the larger fabric of{" "}
          <em className="italic">Ilonggo resilience.</em>
        </h1>

        <p className="sr-only">
          {site.name}, woven paintings. {site.description}
        </p>

        <div className="mt-12 flex items-end justify-between gap-8 border-t border-white/20 pt-5">
          <span className="flex items-center gap-3 text-eyebrow uppercase text-white/70">
            <span aria-hidden className="h-px w-8 bg-white/35" />
            Scroll
          </span>
          <span className="text-right text-caption text-white/70">
            {anchor.title}, <span data-numeric>{anchor.year}</span>
          </span>
        </div>
      </div>
    </section>
  );
}

/* ── 2. Work ──────────────────────────────────────────────────────────────── */

function Work() {
  return (
    <Section id="work" tone="light" width="wide" space="loose">
      <SectionHeading
        eyebrow="Selected works"
        title={
          <>
            Eighteen surfaces,
            <br />
            <em className="italic text-muted">thirty-six paintings.</em>
          </>
        }
        lede="Each piece is completed in full before it is cut, carrying its entire history, every brushstroke, into the final weave."
      />
      <Gallery />
    </Section>
  );
}

/* ── Structured data ──────────────────────────────────────────────────────
   Person lives in layout.tsx. These describe the page's own contents: the
   collection as an ItemList of VisualArtwork, and the exhibition record as
   events. Only exhibitions with a confirmed year are emitted — a dateless
   Event is invalid, and guessing one would put a fabricated date in a
   machine-readable feed. */

function StructuredData() {
  const collection = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Woven Paintings",
    numberOfItems: artworks.length,
    itemListElement: artworks.map((a, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "VisualArtwork",
        name: a.title,
        creator: { "@type": "Person", name: site.name },
        dateCreated: String(a.year),
        artMedium: a.medium,
        artform: "Painting",
        size: formatDimensions(a.dimensions),
        abstract: a.note,
        ...(a.price
          ? {
              offers: {
                "@type": "Offer",
                price: a.price,
                priceCurrency: "PHP",
                availability: a.available
                  ? "https://schema.org/InStock"
                  : "https://schema.org/SoldOut",
              },
            }
          : {}),
      },
    })),
  };

  const events = exhibitions
    .filter((e) => e.year)
    .map((e) => ({
      "@context": "https://schema.org",
      "@type": "ExhibitionEvent",
      name: e.subtitle ? `${e.name} — ${e.subtitle}` : e.name,
      startDate: String(e.year),
      location: { "@type": "Place", name: e.venue },
      performer: { "@type": "Person", name: site.name },
    }));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collection) }}
      />
      {events.map((e) => (
        <script
          key={e.name}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(e) }}
        />
      ))}
    </>
  );
}

export default function Home() {
  return (
    <>
      <Threshold />
      <Work />
      <ProcessSection />
      <AboutSection />
      <ExhibitionsSection />
      <InquireSection />
      <StructuredData />
    </>
  );
}
