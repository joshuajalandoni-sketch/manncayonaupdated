"use client";

import { Container, Section } from "@/components/section";
import { Plate } from "@/components/plate";
import { Drape, DrawnRule, Stagger, Strand } from "@/components/motion/reveal";
import {
  aboutFacts,
  aboutIntro,
  aboutMedia,
  lineage,
  practice,
  pullQuote,
} from "@/lib/about";

/**
 * About / The Weave.
 *
 * Two movements with a rule between them: the practice, then the lineage.
 * The portrait sticks alongside the first movement on wide screens and simply
 * leads on narrow ones, so the reading column is never squeezed to make room
 * for an image.
 */

export function AboutSection() {
  return (
    <Section id="about" tone="surface" space="loose" bleed>
      {/* Movement one: the practice */}
      <Container width="content">
        <div className="grid gap-x-16 gap-y-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Drape>
              <Plate
                ratio="portrait"
                label={aboutMedia.portrait.label}
                caption={aboutMedia.portrait.note}
              />
            </Drape>
          </div>

          <div className="flex flex-col gap-8">
            <Stagger className="flex flex-col gap-5">
              <Strand>
                <p className="flex items-center gap-3 text-eyebrow uppercase text-muted">
                  <span aria-hidden className="h-px w-8 bg-hairline-strong" />
                  {aboutIntro.eyebrow}
                </p>
              </Strand>
              <Strand>
                <h2 className="font-display text-h1 text-ink-strong">
                  {aboutIntro.title[0]}
                  <br />
                  <em className="italic">{aboutIntro.title[1]}</em>
                </h2>
              </Strand>
            </Stagger>

            <Stagger className="flex max-w-text flex-col gap-6 text-body-lg text-ink-soft">
              {practice.map((p, i) => (
                <Strand key={i}>
                  <p>{p}</p>
                </Strand>
              ))}
            </Stagger>

            <Drape delay={0.1}>
              <blockquote className="my-2 border-l border-accent pl-6 font-display text-lead italic text-ink-strong">
                {pullQuote}
              </blockquote>
            </Drape>

            <Drape delay={0.05}>
              <dl className="mt-2 grid grid-cols-1 gap-x-10 gap-y-6 border-t border-hairline pt-8 sm:grid-cols-2">
                {aboutFacts.map((f) => (
                  <div key={f.label} className="flex flex-col gap-1.5">
                    <dt className="text-eyebrow uppercase text-subtle">
                      {f.label}
                    </dt>
                    <dd className="text-meta text-ink">{f.value}</dd>
                  </div>
                ))}
              </dl>
            </Drape>
          </div>
        </div>
      </Container>

      {/* Movement two: the lineage */}
      <Container width="content">
        <div className="mt-(--spacing-section)">
          <DrawnRule className="mb-14" />

          <div className="grid gap-x-16 gap-y-12 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="flex flex-col gap-8">
              <Stagger className="flex flex-col gap-5">
                <Strand>
                  <p className="text-eyebrow uppercase text-subtle">
                    {lineage.eyebrow}
                  </p>
                </Strand>
                <Strand>
                  <h3 className="font-display text-h2 text-ink-strong">
                    <em className="italic">{lineage.title}</em>
                  </h3>
                </Strand>
              </Stagger>

              <Stagger className="flex max-w-text flex-col gap-6 text-body-lg text-ink-soft">
                {lineage.paragraphs.map((p, i) => (
                  <Strand key={i}>
                    <p>{p}</p>
                  </Strand>
                ))}
              </Stagger>

              <Drape delay={0.1}>
                <p className="max-w-text border-t border-hairline pt-8 font-display text-lead italic text-ink-strong">
                  {lineage.closing}
                </p>
              </Drape>
            </div>

            <div className="lg:pt-16">
              <Drape>
                <Plate
                  ratio="tall"
                  label={aboutMedia.studio.label}
                  caption={aboutMedia.studio.note}
                />
              </Drape>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
