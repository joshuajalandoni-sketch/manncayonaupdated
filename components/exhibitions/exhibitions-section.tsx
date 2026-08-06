"use client";

import { Container, Section } from "@/components/section";
import { Drape, DrawnRule, Stagger, Strand } from "@/components/motion/reveal";
import {
  exhibitions,
  institutions,
  press,
  quotes,
} from "@/lib/exhibitions";

/**
 * Exhibitions & Recognition.
 *
 * Important without being boastful. The whole section is typographic: no
 * logos, no award emblems, no counters. A plain CV set well is what reads as
 * credible to a curator; a wall of logos reads as marketing.
 *
 * The quote gets a full band of its own because one good sentence, given room,
 * carries more weight than five crowded together.
 */

function KindTag({ kind }: { kind: string }) {
  return (
    <span className="text-eyebrow uppercase text-subtle">{kind}</span>
  );
}

export function ExhibitionsSection() {
  return (
    <Section id="exhibitions" tone="light" space="loose" bleed>
      <Container width="content">
        <Stagger className="flex flex-col gap-5">
          <Strand>
            <p className="flex items-center gap-3 text-eyebrow uppercase text-muted">
              <span aria-hidden className="h-px w-8 bg-hairline-strong" />
              Exhibitions and recognition
            </p>
          </Strand>
          <Strand>
            <h2 className="font-display text-h1 text-ink-strong">
              Selected shows
              <br />
              <em className="italic text-muted">and talks.</em>
            </h2>
          </Strand>
        </Stagger>

        {/* The record */}
        <Drape className="mt-14">
          <ul className="border-t border-hairline">
            {exhibitions.map((ex) => (
              <li
                key={`${ex.name}-${ex.venue}`}
                className="grid grid-cols-[3rem_1fr] items-baseline gap-x-5 gap-y-2 border-b border-hairline py-6 sm:grid-cols-[5rem_1fr_5rem] sm:gap-x-8"
              >
                <span
                  data-numeric
                  className="text-meta text-subtle"
                  title={ex.year ? undefined : "Year to be confirmed"}
                >
                  {ex.year ?? "—"}
                </span>

                <div className="flex flex-col gap-1">
                  <h3 className="font-display text-h4 text-ink-strong">
                    {ex.name}
                    {ex.subtitle ? (
                      <span className="text-muted"> · {ex.subtitle}</span>
                    ) : null}
                  </h3>
                  <p className="text-caption text-muted">
                    {ex.venue}
                    <span className="text-subtle"> · {ex.date}</span>
                  </p>
                </div>

                <span className="col-start-2 sm:col-start-3 sm:text-right">
                  <KindTag kind={ex.kind} />
                </span>
              </li>
            ))}
          </ul>
        </Drape>
      </Container>

      {/* The quote, given a band of its own */}
      {quotes.length ? (
        <div className="mt-(--spacing-section)">
          <Container width="content">
            <DrawnRule className="mb-14" />
            <Stagger className="flex flex-col gap-10">
              {quotes.map((q) => (
                <Strand key={q.source}>
                  <figure className="flex max-w-text flex-col gap-6">
                    <blockquote className="font-display text-lead leading-snug text-ink-strong">
                      <p>{q.text}</p>
                    </blockquote>
                    <figcaption className="flex items-center gap-3 text-eyebrow uppercase text-muted">
                      <span aria-hidden className="h-px w-8 bg-hairline-strong" />
                      {q.source}
                    </figcaption>
                  </figure>
                </Strand>
              ))}
            </Stagger>
          </Container>
        </div>
      ) : null}

      {/* Coverage and institutions, plainly */}
      <Container width="content">
        <div className="mt-(--spacing-section) grid gap-x-16 gap-y-12 border-t border-hairline pt-12 sm:grid-cols-2">
          <Drape>
            <div className="flex flex-col gap-5">
              <h3 className="text-eyebrow uppercase text-subtle">Coverage</h3>
              <ul className="flex flex-col gap-2.5">
                {press.map((p) => (
                  <li
                    key={p.outlet}
                    className="flex items-baseline justify-between gap-6 border-b border-hairline pb-2.5"
                  >
                    <span className="text-meta text-ink">{p.outlet}</span>
                    <span className="text-caption text-subtle">{p.medium}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Drape>

          <Drape delay={0.08}>
            <div className="flex flex-col gap-5">
              <h3 className="text-eyebrow uppercase text-subtle">
                Exhibited with
              </h3>
              <ul className="flex flex-col gap-2.5">
                {institutions.map((i) => (
                  <li
                    key={i}
                    className="border-b border-hairline pb-2.5 text-meta text-ink"
                  >
                    {i}
                  </li>
                ))}
              </ul>
            </div>
          </Drape>
        </div>
      </Container>
    </Section>
  );
}
