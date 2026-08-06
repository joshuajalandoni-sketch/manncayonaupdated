import type { CSSProperties } from "react";

/**
 * Generated weave plate.
 *
 * Stands in for photography that does not exist yet, and does it in the
 * language of the work rather than as a grey box: a true plain weave, warp
 * over weft on alternating cells, with the gaps between strips left visible.
 *
 * Because the interlace is drawn at a fixed strip size in CSS, scaling the
 * element up in the lightbox magnifies the weave the way leaning toward a
 * physical canvas does. That behaviour survives the swap to real assets,
 * where the detail crop takes over the same job.
 */

export function WeavePlaceholder({
  dyes,
  strip = 12,
  seed = 0,
  className = "",
}: {
  dyes: [string, string];
  /** Strip width in px. Larger reads coarser, like a wider-set loom. */
  strip?: number;
  /** Shifts the weave so no two plates line up identically. */
  seed?: number;
  className?: string;
}) {
  const s = `${strip}px`;
  const s2 = `${strip * 2}px`;
  const offset = `${seed % strip}px`;

  const vars = {
    "--warp": dyes[0],
    "--weft": dyes[1],
    "--s": s,
    "--s2": s2,
  } as CSSProperties;

  return (
    <div
      aria-hidden
      className={`absolute inset-0 overflow-hidden bg-[var(--ink-950)] ${className}`}
      style={vars}
    >
      {/* Weft: horizontal strips, laid down first. */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "repeating-linear-gradient(180deg, var(--weft) 0 var(--s), transparent var(--s) var(--s2))",
          backgroundPosition: `0 ${offset}`,
        }}
      />

      {/* Warp: vertical strips, masked to a checkerboard so they pass over the
          weft on alternating cells and under it on the rest. */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, var(--warp) 0 var(--s), transparent var(--s) var(--s2))",
          backgroundPosition: `${offset} 0`,
          maskImage:
            "repeating-conic-gradient(#000 0% 25%, transparent 0% 50%)",
          maskSize: "var(--s2) var(--s2)",
          WebkitMaskImage:
            "repeating-conic-gradient(#000 0% 25%, transparent 0% 50%)",
          WebkitMaskSize: "var(--s2) var(--s2)",
        }}
      />

      {/* Thread depth: a hairline shadow along one edge of every strip. */}
      <div
        className="absolute inset-0 opacity-40 mix-blend-multiply"
        style={{
          backgroundImage: `
            repeating-linear-gradient(90deg, rgba(0,0,0,0.55) 0 1px, transparent 1px var(--s)),
            repeating-linear-gradient(180deg, rgba(0,0,0,0.45) 0 1px, transparent 1px var(--s))
          `,
        }}
      />

      {/* Studio light: a high window to the upper left, falling off to a
          shadowed lower right. This is what makes the plate read as an object
          in a room rather than a flat fill. */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(120% 95% at 18% 8%, rgba(255,252,244,0.34), rgba(255,252,244,0.06) 45%, transparent 70%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(130% 110% at 78% 100%, rgba(10,9,7,0.42), transparent 62%)",
        }}
      />
    </div>
  );
}
