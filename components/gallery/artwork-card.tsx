"use client";

import { type Artwork, formatDimensions } from "@/lib/artworks";
import { ArtworkImage } from "./artwork-image";

/**
 * One hung work.
 *
 * Hover does two things at once: a slow raking-light sweep travels across the
 * surface, and the label rises into the lower edge. The sweep is the point.
 * It is what a woven object does when you tilt it toward a window, and it is
 * the difference between a thumbnail and something you want to walk closer to.
 *
 * Below `md` there is no hover, so the label is simply always present.
 */

export function ArtworkCard({
  artwork,
  onOpen,
  sizes,
  priority = false,
}: {
  artwork: Artwork;
  onOpen: () => void;
  sizes: string;
  priority?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={`${artwork.title}, ${artwork.year}. Open full view.`}
      className="group block w-full cursor-zoom-in text-left"
    >
      <div
        style={{ aspectRatio: String(artwork.aspect) }}
        className="relative overflow-hidden rounded-xs shadow-lift ring-1 ring-hairline transition-[box-shadow,transform] duration-slow ease-thread group-hover:-translate-y-1 group-hover:shadow-hang group-focus-visible:-translate-y-1"
      >
        <div className="absolute inset-0 transition-transform duration-weave ease-thread group-hover:scale-[1.025]">
          <ArtworkImage
            artwork={artwork}
            sizes={sizes}
            priority={priority}
            strip={artwork.monumental ? 16 : 11}
          />
        </div>

        {/* Raking light. Travels once, slowly, on approach. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 -left-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/14 to-transparent transition-[left] duration-weave ease-loom group-hover:left-[150%]"
        />

        {/* Scrim, tied to the label so it never dims the work at rest. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/70 via-black/25 to-transparent opacity-100 transition-opacity duration-slow ease-weave md:opacity-0 md:group-hover:opacity-100 md:group-focus-visible:opacity-100"
        />

        {artwork.available ? null : (
          <span className="absolute top-4 right-4 rounded-xs bg-black/45 px-2.5 py-1 text-eyebrow uppercase text-white/80 backdrop-blur-sm">
            Sold
          </span>
        )}

        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col gap-1 p-5 opacity-100 transition-[opacity,transform] duration-slow ease-thread md:translate-y-2 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 md:group-focus-visible:translate-y-0 md:group-focus-visible:opacity-100">
          <span className="font-display text-h4 leading-tight text-white">
            {artwork.title}
          </span>
          {/* Opacities kept high enough to clear 4.5:1 against the scrim.
              Label text over an image has to be legible on the worst frame,
              not the average one. */}
          <span data-numeric className="text-caption text-white/80">
            {artwork.year}
          </span>
          {/* Scale, because a 4 x 5 ft canvas and a 24 cm one must never read
              as the same object at grid size. */}
          <span data-numeric className="text-caption text-white/70">
            {formatDimensions(artwork.dimensions)}
          </span>
        </div>
      </div>
    </button>
  );
}
