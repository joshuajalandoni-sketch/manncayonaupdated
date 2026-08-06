"use client";

import Image from "next/image";
import { useReducedMotion } from "motion/react";
import { WeavePlaceholder } from "@/components/gallery/weave-placeholder";
import type { ProcessMedia } from "@/lib/process";

/**
 * One reserved position in the essay.
 *
 * Resolves, in order: a looping clip, a still, a generated weave, or an empty
 * plate. The empty plate is styled to read as a held position in a sequence
 * rather than as a missing file, because this section will be seen before the
 * photography exists.
 *
 * The clip branch is the slot for the hand-weaving loop. It is deliberately
 * silent and unchromed: a moving photograph, not a video player.
 */

const ratioClass: Record<NonNullable<ProcessMedia["ratio"]>, string> = {
  portrait: "aspect-[4/5]",
  square: "aspect-square",
  landscape: "aspect-[4/3]",
  wide: "aspect-[16/10]",
  cinema: "aspect-[21/9]",
  panorama: "aspect-[2.4/1]",
};

export function MediaSlot({
  media,
  sizes,
  priority = false,
  /** Off for full-bleed media, where an edge treatment would be visible. */
  frame = true,
  className = "",
}: {
  media: ProcessMedia;
  sizes: string;
  priority?: boolean;
  frame?: boolean;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const ratio = ratioClass[media.ratio ?? "landscape"];

  return (
    <div
      className={[
        "relative overflow-hidden bg-surface-sunken",
        // Set as a whole rather than overridden downstream: conflicting
        // Tailwind utilities resolve by CSS source order, not class order.
        frame ? "rounded-xs ring-1 ring-hairline" : "",
        ratio,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {media.clip ? (
        <video
          className="absolute inset-0 h-full w-full object-cover"
          poster={media.clip.poster}
          // A looping process clip is illustration, not content to control.
          // Under reduced motion it stops being decorative and gets controls.
          autoPlay={!reduce}
          loop
          muted
          playsInline
          controls={Boolean(reduce)}
          preload="metadata"
          aria-label={media.alt}
        >
          <source src={media.clip.src} type={media.clip.type ?? "video/mp4"} />
        </video>
      ) : media.image ? (
        <Image
          src={media.image.src}
          alt={media.alt}
          fill
          sizes={sizes}
          priority={priority}
          quality={90}
          placeholder={media.image.blurDataURL ? "blur" : "empty"}
          blurDataURL={media.image.blurDataURL}
          className="object-cover"
        />
      ) : media.weave ? (
        <WeavePlaceholder dyes={media.weave} strip={media.strip ?? 14} seed={7} />
      ) : (
        <>
          <div aria-hidden className="texture-warp absolute inset-0 opacity-45" />
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(115% 90% at 22% 10%, rgba(255,252,244,0.05), transparent 62%)",
            }}
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-8 text-center">
            <span className="text-eyebrow uppercase text-muted">
              {media.label ?? "Reserved"}
            </span>
            {media.note ? (
              <span className="max-w-[34ch] text-caption text-subtle">
                {media.note}
              </span>
            ) : null}
          </div>
        </>
      )}
    </div>
  );
}
