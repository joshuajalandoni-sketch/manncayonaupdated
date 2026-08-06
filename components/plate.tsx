import type { ReactNode } from "react";

/**
 * A mounted plate — the reserved position for artwork.
 *
 * Until real photography lands, this is what stands in: a canvas-toned ground
 * with a hairline edge and a hung shadow. It is deliberately *not* a grey box.
 * The shell should read as a site awaiting images, not as an unfinished build.
 *
 * When photography arrives, swap the inner fill for <Image fill /> and keep
 * the frame, caption and ratio exactly as they are.
 */

const ratios = {
  portrait: "aspect-[4/5]",
  tall: "aspect-[3/4]",
  square: "aspect-square",
  landscape: "aspect-[4/3]",
  wide: "aspect-[16/10]",
  cinema: "aspect-[21/9]",
} as const;

export function Plate({
  ratio = "portrait",
  label,
  caption,
  className = "",
  children,
}: {
  ratio?: keyof typeof ratios;
  /** Short note on what belongs here — visible while the slot is empty. */
  label?: string;
  /** Permanent caption rendered beneath the plate. */
  caption?: ReactNode;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <figure className={`flex flex-col gap-3 ${className}`}>
      <div
        className={[
          "relative overflow-hidden rounded-xs bg-surface-sunken",
          "shadow-hang ring-1 ring-hairline",
          "transition-[transform,box-shadow] duration-slow ease-thread",
          ratios[ratio],
        ].join(" ")}
      >
        {/* Warp field — reads as raw, unpainted canvas. */}
        <div
          aria-hidden
          className="texture-warp absolute inset-0 opacity-50"
        />
        {children}
        {!children && label ? (
          <span className="absolute inset-0 flex items-center justify-center px-6 text-center text-eyebrow uppercase text-subtle">
            {label}
          </span>
        ) : null}
      </div>
      {caption ? (
        <figcaption className="text-caption text-muted">{caption}</figcaption>
      ) : null}
    </figure>
  );
}
