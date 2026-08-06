"use client";

import { Container, Section } from "@/components/section";
import {
  processBeats,
  processClosing,
  processIntro,
  type ProcessBeat,
} from "@/lib/process";
import { MediaSlot } from "./media-slot";
import {
  Drape,
  DrawnRule,
  Stagger,
  Strand,
  WeaveReveal,
} from "@/components/motion/reveal";

/**
 * "Cut first. Then reweave."
 *
 * Built as a photographic essay with wall text, not a how-it-works explainer.
 * Two decisions carry that difference:
 *
 *   1. Scale changes between beats. The Cut breaks the container and runs edge
 *      to edge; the studio beat is small and quiet. A tech explainer keeps
 *      every step the same size because every step is equally instructional.
 *      Here the beats are not equally important, and the layout says so.
 *
 *   2. The signature WeaveReveal is rationed. It runs on the source paintings,
 *      the cut, the mid-weave still and the finished surface — the four moments
 *      where an image is becoming something else. The studio beat just fades.
 *
 * Mobile keeps every image full-width and keeps The Cut edge to edge. Nothing
 * is downgraded to a thumbnail on the way down.
 */

function BeatHeader({
  beat,
  size = "default",
  className = "",
}: {
  beat: ProcessBeat;
  size?: "default" | "large" | "quiet";
  className?: string;
}) {
  const lineClass =
    size === "large"
      ? "text-h1"
      : size === "quiet"
        ? "text-h3"
        : "text-h2";

  return (
    <div className={`flex flex-col gap-6 ${className}`}>
      <DrawnRule />
      <Stagger className="flex flex-col gap-5">
        <Strand>
          <p className="flex items-baseline gap-4 text-eyebrow uppercase text-subtle">
            <span data-numeric className="text-accent">
              {beat.n}
            </span>
            {beat.name}
          </p>
        </Strand>
        <Strand>
          <h3 className={`font-display ${lineClass} text-ink-strong`}>
            {beat.line}
          </h3>
        </Strand>
        <Strand>
          <p className="max-w-text text-body-lg leading-relaxed text-ink-soft">
            {beat.body}
          </p>
        </Strand>
      </Stagger>
    </div>
  );
}

function Beat({ beat }: { beat: ProcessBeat }) {
  switch (beat.layout) {
    /* 01 — Two paintings, side by side, both still intact. The second hangs
       lower so the pair reads as two objects rather than one diagram. */
    case "diptych":
      return (
        <Container width="wide">
          <BeatHeader beat={beat} />
          <div className="mt-14 grid grid-cols-1 items-start gap-8 sm:grid-cols-2 lg:gap-14">
            {beat.media.map((m, i) => (
              <figure
                key={m.label ?? i}
                className={i === 1 ? "sm:mt-20" : undefined}
              >
                <WeaveReveal bands={10}>
                  <MediaSlot
                    media={m}
                    sizes="(max-width: 640px) 100vw, 45vw"
                  />
                </WeaveReveal>
                <figcaption className="mt-4 text-caption text-muted">
                  {m.note}
                </figcaption>
              </figure>
            ))}
          </div>
        </Container>
      );

    /* 02 — The peak. Type at its largest, image edge to edge on every screen. */
    case "hero":
      return (
        <div>
          <Container width="wide">
            <BeatHeader beat={beat} size="large" />
          </Container>

          <div className="mt-16 w-full">
            <WeaveReveal bands={18}>
              <MediaSlot media={beat.media[0]} sizes="100vw" frame={false} />
            </WeaveReveal>
          </div>

          <Container width="wide">
            <Drape delay={0.15}>
              <p className="mt-5 text-caption text-muted">
                {beat.media[0].note}
              </p>
            </Drape>
          </Container>
        </div>
      );

    /* 03 — The clip and the still, held at equal weight. */
    case "pair":
      return (
        <Container width="wide">
          <BeatHeader beat={beat} />
          <div className="mt-14 grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
            <Drape>
              <figure>
                <MediaSlot
                  media={beat.media[0]}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <figcaption className="mt-4 text-caption text-muted">
                  {beat.media[0].note}
                </figcaption>
              </figure>
            </Drape>
            <figure>
              <WeaveReveal bands={12}>
                <MediaSlot
                  media={beat.media[1]}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </WeaveReveal>
              <figcaption className="mt-4 text-caption text-muted">
                Strips clipped and held in tension, the interlace half-built.
              </figcaption>
            </figure>
          </div>
        </Container>
      );

    /* 04 — The resolution. Centred, alone, given room. */
    case "solo":
      return (
        <Container width="content">
          <BeatHeader beat={beat} className="items-start" />
          <div className="mt-14">
            <WeaveReveal bands={20}>
              <MediaSlot
                media={beat.media[0]}
                sizes="(max-width: 1280px) 100vw, 78vw"
              />
            </WeaveReveal>
          </div>
        </Container>
      );

    /* 05 — Context, deliberately quieter than everything above it. */
    case "grid":
      return (
        <Container width="wide">
          <BeatHeader beat={beat} size="quiet" />
          <Stagger className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
            {beat.media.map((m, i) => (
              <Strand key={m.label ?? i}>
                <figure>
                  <MediaSlot
                    media={m}
                    sizes="(max-width: 1024px) 50vw, 25vw"
                  />
                  <figcaption className="mt-3 text-caption text-subtle">
                    {m.note}
                  </figcaption>
                </figure>
              </Strand>
            ))}
          </Stagger>
        </Container>
      );
  }
}

export function ProcessSection() {
  return (
    <Section id="process" tone="dark" space="loose" bleed>
      {/* Wall text */}
      <Container width="wide">
        <Stagger className="flex flex-col gap-6">
          <Strand>
            <p className="flex items-center gap-3 text-eyebrow uppercase text-muted">
              <span aria-hidden className="h-px w-8 bg-hairline-strong" />
              {processIntro.eyebrow}
            </p>
          </Strand>
          <Strand>
            <h2 className="font-display text-h1 text-ink-strong">
              {processIntro.title[0]}
              <br />
              <em className="italic text-accent">{processIntro.title[1]}</em>
            </h2>
          </Strand>
          <Strand>
            <p className="mt-2 max-w-text text-lead leading-snug text-ink-soft">
              {processIntro.wallText}
            </p>
          </Strand>
        </Stagger>
      </Container>

      {/* Beats */}
      <div className="mt-(--spacing-section) flex flex-col gap-(--spacing-section)">
        {processBeats.map((beat) => (
          <Beat key={beat.n} beat={beat} />
        ))}
      </div>

      {/* Closing */}
      <Container width="wide">
        <Drape className="mt-(--spacing-section)">
          <DrawnRule className="mb-10" />
          <p className="max-w-text font-display text-h3 italic text-ink-strong">
            {processClosing}
          </p>
        </Drape>
      </Container>
    </Section>
  );
}
