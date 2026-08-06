import type { ElementType, ReactNode } from "react";

/**
 * The layout contract for the whole site.
 *
 * Every section on every page goes through this component, so vertical rhythm
 * and horizontal inset are defined in exactly one place. Sections never set
 * their own padding.
 */

type Width = "prose" | "text" | "content" | "wide" | "full";
type Space = "none" | "tight" | "default" | "loose";
type Tone = "light" | "dark" | "surface";

const widths: Record<Width, string> = {
  prose: "max-w-measure",
  text: "max-w-text",
  content: "max-w-content",
  wide: "max-w-wide",
  full: "max-w-none",
};

const spaceY: Record<Space, string> = {
  none: "",
  tight: "py-(--spacing-section-tight)",
  default: "py-(--spacing-section)",
  loose: "py-(--spacing-section-loose)",
};

export function Container({
  width = "content",
  className = "",
  children,
}: {
  width?: Width;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={`mx-auto w-full px-(--spacing-gutter) ${widths[width]} ${className}`}>
      {children}
    </div>
  );
}

export function Section({
  as: Tag = "section",
  id,
  tone,
  width = "content",
  space = "default",
  bleed = false,
  className = "",
  containerClassName = "",
  children,
}: {
  as?: ElementType;
  id?: string;
  /** Omit to inherit the surrounding tone. "dark" inverts every semantic token. */
  tone?: Tone;
  width?: Width;
  space?: Space;
  /** Skip the container entirely, for full-bleed media. */
  bleed?: boolean;
  className?: string;
  containerClassName?: string;
  children: ReactNode;
}) {
  const toneAttr =
    tone === "dark" ? "dark" : tone === "light" ? "light" : undefined;

  return (
    <Tag
      id={id}
      data-tone={toneAttr}
      data-section={id}
      className={[
        "relative w-full",
        spaceY[space],
        tone === "surface" ? "bg-surface" : "",
        // Every ground plane carries the paper tooth. Large flat fills should
        // never read as flat digital colour.
        "texture-canvas",
        // Sections own their scroll offset so anchor jumps land correctly.
        id ? "scroll-mt-24" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {bleed ? (
        children
      ) : (
        <Container width={width} className={containerClassName}>
          {children}
        </Container>
      )}
    </Tag>
  );
}

/**
 * The small tracked label that sits above a section heading.
 * Carries a short thread-rule so it reads as a woven marker, not a form label.
 */
export function Eyebrow({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p
      className={`flex items-center gap-3 text-eyebrow text-muted uppercase ${className}`}
    >
      <span aria-hidden className="h-px w-8 bg-hairline-strong" />
      {children}
    </p>
  );
}

/**
 * Section heading. `lede` is the one paragraph allowed to sit directly under
 * a heading; everything else goes in the body below.
 */
export function SectionHeading({
  eyebrow,
  title,
  lede,
  align = "start",
  className = "",
}: {
  eyebrow?: string;
  title: ReactNode;
  lede?: ReactNode;
  align?: "start" | "center";
  className?: string;
}) {
  return (
    <header
      className={[
        "flex flex-col gap-5",
        align === "center" ? "items-center text-center" : "items-start",
        className,
      ].join(" ")}
    >
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <h2 className="text-h2 font-display text-ink-strong">{title}</h2>
      {lede ? (
        <p className="max-w-measure text-body-lg text-ink-soft">{lede}</p>
      ) : null}
    </header>
  );
}
