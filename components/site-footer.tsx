import Link from "next/link";
import { navigation, site } from "@/lib/site";

/**
 * Quiet, archival close.
 *
 * Modelled on the colophon page of an exhibition catalogue rather than a
 * marketing footer: no CTA, no newsletter, no social icons. Just the record —
 * who, where, how to reach, and what the thing was made of. Small type,
 * generous air, a single hairline index.
 */

const year = new Date().getFullYear();

function Column({
  heading,
  children,
}: {
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-eyebrow uppercase text-subtle">{heading}</h3>
      <div className="flex flex-col gap-2.5">{children}</div>
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer
      data-tone="dark"
      className="texture-canvas relative mt-auto overflow-hidden"
    >
      {/* A field of warp threads, barely there, along the top edge. */}
      <div
        aria-hidden
        className="texture-warp pointer-events-none absolute inset-x-0 top-0 h-32 opacity-40 [mask-image:linear-gradient(to_bottom,black,transparent)]"
      />

      <div className="relative mx-auto max-w-wide px-(--spacing-gutter) pb-12 pt-(--spacing-section-tight)">
        {/* Wordmark as a quiet crown — the catalogue's spine, not a banner. */}
        <p
          aria-hidden
          className="font-display text-[clamp(2.5rem,11vw,9rem)] leading-none tracking-[-0.03em] text-ink-strong/12 select-none"
        >
          Mann Cayona
        </p>

        <hr className="rule-thread mt-(--spacing-section-tight) mb-14" />

        <div className="grid grid-cols-2 gap-x-8 gap-y-12 md:grid-cols-4">
          <Column heading="Contact">
            <a
              href={`mailto:${site.contact.email}`}
              className="link-weave w-fit text-meta text-ink transition-colors duration-base ease-weave hover:text-accent"
            >
              {site.contact.email}
            </a>
            <a
              href={site.contact.phoneHref}
              data-numeric
              className="link-weave w-fit text-meta text-ink transition-colors duration-base ease-weave hover:text-accent"
            >
              {site.contact.phone}
            </a>
          </Column>

          <Column heading="Studio">
            <p className="text-meta text-ink">{site.location.studio}</p>
            <p className="text-meta text-muted">
              {site.location.city}, {site.location.region}
            </p>
            <p className="text-caption text-subtle">Visits by appointment</p>
          </Column>

          <Column heading="Index">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="link-weave w-fit text-meta text-ink transition-colors duration-base ease-weave hover:text-accent"
              >
                {item.label}
              </Link>
            ))}
          </Column>

          <Column heading="Elsewhere">
            {site.social.map((s) => (
              <a
                key={s.href}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="link-weave w-fit text-meta text-ink transition-colors duration-base ease-weave hover:text-accent"
              >
                {s.label}
              </a>
            ))}
          </Column>
        </div>

        <hr className="rule-thread mt-16 mb-8" />

        <div className="flex flex-col gap-6 text-caption text-subtle md:flex-row md:items-baseline md:justify-between">
          <p>
            <span data-numeric>&copy; {year}</span> {site.name}. All works and
            images reproduced by permission of the artist.
          </p>
          {/* Colophon — the archival signature. */}
          <p className="max-w-sm text-pretty md:text-right">
            Set in Newsreader and Karla. Oil and acrylic on canvas, cut and
            rewoven by hand in {site.location.studio}.
          </p>
        </div>
      </div>
    </footer>
  );
}
