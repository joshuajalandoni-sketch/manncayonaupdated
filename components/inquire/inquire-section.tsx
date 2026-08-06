"use client";

import { useId, useMemo, useState } from "react";
import { Container, Section } from "@/components/section";
import { Drape, DrawnRule, Stagger, Strand } from "@/components/motion/reveal";
import { artworks } from "@/lib/artworks";
import { site } from "@/lib/site";

/**
 * Inquire.
 *
 * The old site priced eighteen works and offered no way to ask about any of
 * them. This section is the fix, and it leads with the two things that
 * actually work today: a direct email address and an Instagram handle.
 *
 * The form composes a pre-filled mailto rather than posting anywhere, because
 * there is no backend yet and a form that silently discards a collector's
 * message is worse than no form. To move to a real endpoint later, replace
 * `handleSubmit` with a server action; every field name is already set up for
 * it and nothing else in the component needs to change.
 */

const PURPOSES = [
  "A work I saw on this site",
  "Available works and prices",
  "A studio visit",
  "Exhibition or curatorial enquiry",
  "Press or interview",
  "Something else",
] as const;

const fieldClass =
  "w-full rounded-sm border border-field-border bg-field px-4 py-3 text-meta text-ink placeholder:text-subtle transition-[border-color,background-color] duration-base ease-weave hover:border-hairline-strong focus:border-accent focus:outline-none";

export function InquireSection() {
  const uid = useId();
  const [purpose, setPurpose] = useState<string>(PURPOSES[0]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [work, setWork] = useState("");
  const [message, setMessage] = useState("");

  const availableCount = useMemo(
    () => artworks.filter((a) => a.available).length,
    []
  );

  const instagram = site.social.find((s) => s.label === "Instagram");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const subject = work ? `${purpose} — ${work}` : purpose;
    const body = [
      message,
      "",
      "—",
      name ? `From: ${name}` : null,
      email ? `Reply to: ${email}` : null,
      work ? `Work: ${work}` : null,
    ]
      .filter((l) => l !== null)
      .join("\n");

    window.location.href = `mailto:${site.contact.email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
  }

  return (
    <Section id="inquire" tone="light" space="loose" bleed>
      <Container width="content">
        <Stagger className="flex flex-col gap-5">
          <Strand>
            <p className="flex items-center gap-3 text-eyebrow uppercase text-muted">
              <span aria-hidden className="h-px w-8 bg-hairline-strong" />
              Inquire
            </p>
          </Strand>
          <Strand>
            <h2 className="font-display text-h1 text-ink-strong">
              Available
              <br />
              <em className="italic text-muted">works.</em>
            </h2>
          </Strand>
          <Strand>
            <p className="max-w-text text-body-lg text-ink-soft">
              <span data-numeric>{availableCount}</span> of{" "}
              <span data-numeric>{artworks.length}</span> works are currently
              available. Prices, full dimensions and condition notes on request.
              Works ship from Iloilo City, unframed unless noted.
            </p>
          </Strand>
        </Stagger>

        {/* Direct contact first. The form is the fallback, not the front door. */}
        <Drape className="mt-14">
          <div className="grid gap-x-12 gap-y-8 border-y border-hairline py-10 sm:grid-cols-3">
            <div className="flex flex-col gap-2">
              <span className="text-eyebrow uppercase text-subtle">Email</span>
              <a
                href={`mailto:${site.contact.email}`}
                className="link-weave w-fit font-display text-h4 text-ink-strong transition-colors duration-base ease-weave hover:text-accent"
              >
                {site.contact.email}
              </a>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-eyebrow uppercase text-subtle">
                Instagram
              </span>
              {instagram ? (
                <a
                  href={instagram.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-weave w-fit font-display text-h4 text-ink-strong transition-colors duration-base ease-weave hover:text-accent"
                >
                  @mann_cayona
                </a>
              ) : null}
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-eyebrow uppercase text-subtle">Phone</span>
              <a
                href={site.contact.phoneHref}
                data-numeric
                className="link-weave w-fit font-display text-h4 text-ink-strong transition-colors duration-base ease-weave hover:text-accent"
              >
                {site.contact.phone}
              </a>
            </div>
          </div>
        </Drape>

        <div className="mt-(--spacing-section) grid gap-x-16 gap-y-14 lg:grid-cols-[0.85fr_1.15fr]">
          {/* Who this is for, and the studio */}
          <div className="flex flex-col gap-10">
            <Drape>
              <div className="flex flex-col gap-6">
                <h3 className="text-eyebrow uppercase text-subtle">
                  Collectors
                </h3>
                <p className="text-meta leading-relaxed text-ink-soft">
                  Tell us which work, and whether you would like it framed.
                  Condition notes, a macro photograph of the weave and a
                  certificate of authenticity are sent before anything is
                  packed.
                </p>
              </div>
            </Drape>

            <Drape delay={0.06}>
              <div className="flex flex-col gap-6">
                <h3 className="text-eyebrow uppercase text-subtle">
                  Curators and institutions
                </h3>
                <p className="text-meta leading-relaxed text-ink-soft">
                  A CV, high-resolution files and a list of works currently
                  unassigned are available on request. Loans and commissions
                  are considered.
                </p>
              </div>
            </Drape>

            <Drape delay={0.12}>
              <div className="flex flex-col gap-5 border-t border-hairline pt-8">
                <h3 className="text-eyebrow uppercase text-subtle">
                  The studio
                </h3>
                <p className="font-display text-h4 text-ink-strong">
                  Tigbauan, Iloilo
                </p>
                <p className="max-w-measure text-meta leading-relaxed text-ink-soft">
                  A room in a house on the southern coast of Panay, forty
                  minutes down from Iloilo City. It is not a gallery and does
                  not pretend to be one. Visits are by appointment, and there
                  is usually something on the table mid-weave.
                </p>
              </div>
            </Drape>
          </div>

          {/* The form */}
          <Drape delay={0.08}>
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label
                  htmlFor={`${uid}-purpose`}
                  className="text-eyebrow uppercase text-subtle"
                >
                  I am writing about
                </label>
                <select
                  id={`${uid}-purpose`}
                  name="purpose"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  className={fieldClass}
                >
                  {PURPOSES.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor={`${uid}-name`}
                    className="text-eyebrow uppercase text-subtle"
                  >
                    Name
                  </label>
                  <input
                    id={`${uid}-name`}
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={fieldClass}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor={`${uid}-email`}
                    className="text-eyebrow uppercase text-subtle"
                  >
                    Email
                  </label>
                  <input
                    id={`${uid}-email`}
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={fieldClass}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor={`${uid}-work`}
                  className="text-eyebrow uppercase text-subtle"
                >
                  Work of interest
                </label>
                <input
                  id={`${uid}-work`}
                  name="work"
                  type="text"
                  placeholder="Title, or leave blank"
                  value={work}
                  onChange={(e) => setWork(e.target.value)}
                  className={fieldClass}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor={`${uid}-message`}
                  className="text-eyebrow uppercase text-subtle"
                >
                  Message
                </label>
                <textarea
                  id={`${uid}-message`}
                  name="message"
                  rows={6}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className={`${fieldClass} resize-y`}
                />
              </div>

              <div className="flex flex-col gap-3">
                <button
                  type="submit"
                  className="self-start rounded-sm bg-ink-strong px-8 py-3.5 text-meta text-background transition-colors duration-base ease-weave hover:bg-accent"
                  aria-describedby={`${uid}-note`}
                >
                  Compose inquiry
                </button>
                <p id={`${uid}-note`} className="text-caption text-subtle">
                  Opens your mail app with the details filled in, addressed to{" "}
                  {site.contact.email}. Nothing is sent until you send it.
                </p>
              </div>
            </form>
          </Drape>
        </div>

        <DrawnRule className="mt-(--spacing-section)" />
      </Container>
    </Section>
  );
}
