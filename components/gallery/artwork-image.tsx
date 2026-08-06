import Image from "next/image";
import type { Artwork } from "@/lib/artworks";
import { WeavePlaceholder } from "./weave-placeholder";

/**
 * The single place that decides between real photography and a generated
 * plate. Every surface in the gallery goes through it, so the day assets land
 * there is exactly one file to reason about.
 */

function seedOf(slug: string) {
  return slug.split("").reduce((n, c) => n + c.charCodeAt(0), 0);
}

export function ArtworkImage({
  artwork,
  sizes,
  priority = false,
  strip = 12,
  className = "",
}: {
  artwork: Artwork;
  /** Required whenever the image fills a responsive box. */
  sizes: string;
  priority?: boolean;
  strip?: number;
  className?: string;
}) {
  const alt = `${artwork.title}, ${artwork.year}. ${artwork.medium}.`;

  if (!artwork.image) {
    return (
      <WeavePlaceholder
        dyes={artwork.dyes}
        strip={strip}
        seed={seedOf(artwork.slug)}
        className={className}
      />
    );
  }

  return (
    <Image
      src={artwork.image.src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      quality={90}
      placeholder={artwork.image.blurDataURL ? "blur" : "empty"}
      blurDataURL={artwork.image.blurDataURL}
      className={`object-cover ${className}`}
    />
  );
}
