"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { navigation, site } from "@/lib/site";

/**
 * Fixed navigation with directional auto-hide.
 *
 * The rules, in priority order:
 *   1. Always visible within the first 96px  — you can never lose the nav at rest.
 *   2. Hides when scrolling down past 160px  — the artwork gets the full frame.
 *   3. Reappears the instant you scroll up   — intent to navigate is honoured.
 *   4. Never hides while the mobile panel is open, or while keyboard focus is
 *      inside the bar. A nav that slides away mid-tab is a trap.
 *
 * Direction is measured against an accumulated delta rather than raw scrollTop,
 * so trackpad jitter and momentum wobble don't flicker the bar.
 */

const SHOW_ALWAYS_ABOVE = 96;
const HIDE_AFTER = 160;
const DELTA = 8;

export function SiteNav({
  /**
   * Tone of the first section, so the bar can invert while it floats over the
   * hero. Passed rather than measured: reading it on mount would render one
   * frame of dark-on-dark before correcting itself.
   */
  heroTone = "dark",
}: {
  heroTone?: "dark" | "light";
} = {}) {
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  const lastY = useRef(0);
  const ticking = useRef(false);
  const focusWithin = useRef(false);
  const navRef = useRef<HTMLElement>(null);

  /* --- Directional show / hide ------------------------------------------ */
  useEffect(() => {
    lastY.current = window.scrollY;

    const evaluate = () => {
      const y = window.scrollY;
      const delta = y - lastY.current;

      setScrolled(y > 24);

      if (Math.abs(delta) < DELTA) {
        ticking.current = false;
        return;
      }

      if (open || focusWithin.current || y < SHOW_ALWAYS_ABOVE) {
        setHidden(false);
      } else if (delta > 0 && y > HIDE_AFTER) {
        setHidden(true);
      } else if (delta < 0) {
        setHidden(false);
      }

      lastY.current = y;
      ticking.current = false;
    };

    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(evaluate);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [open]);

  /* --- Active section ---------------------------------------------------- */
  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>("[data-section]");
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id || null);
      },
      // Bias the "current" section toward the upper third of the viewport.
      { rootMargin: "-20% 0px -60% 0px", threshold: 0 }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  /* --- Mobile panel: scroll lock + escape -------------------------------- */
  useEffect(() => {
    if (!open) return;

    const { body } = document;
    const prevOverflow = body.style.overflow;
    const prevPad = body.style.paddingRight;
    const gap = window.innerWidth - document.documentElement.clientWidth;

    body.style.overflow = "hidden";
    if (gap > 0) body.style.paddingRight = `${gap}px`;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);

    return () => {
      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPad;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const isActive = useCallback(
    (href: string) => active !== null && href === `/#${active}`,
    [active]
  );

  return (
    <>
      {/* Keyboard users reach the content without tabbing the whole bar. */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60] focus:bg-surface-raised focus:px-4 focus:py-2 focus:text-meta focus:text-ink-strong focus:shadow-lift"
      >
        Skip to content
      </a>

      <header
        ref={navRef}
        onFocusCapture={() => {
          focusWithin.current = true;
          setHidden(false);
        }}
        onBlurCapture={() => {
          focusWithin.current = false;
        }}
        data-hidden={hidden || undefined}
        // While transparent over a dark hero the bar inverts its own tokens,
        // so the wordmark, links and menu rules stay legible without any of
        // them knowing what they are sitting on.
        data-tone={!scrolled && !open && heroTone === "dark" ? "dark" : undefined}
        className={[
          "fixed inset-x-0 top-0 z-50",
          "transition-[transform,background-color,border-color,backdrop-filter]",
          "duration-slow ease-thread",
          "data-hidden:-translate-y-full",
          scrolled || open
            ? "border-b border-hairline bg-background/85 backdrop-blur-md backdrop-saturate-150"
            : "border-b border-transparent bg-transparent",
        ].join(" ")}
      >
        <nav
          aria-label="Primary"
          className="mx-auto flex max-w-wide items-center justify-between gap-8 px-(--spacing-gutter) py-5 md:py-6"
        >
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="group flex shrink-0 flex-col leading-none"
          >
            <span className="font-display text-[1.0625rem] tracking-[-0.01em] text-ink-strong">
              {site.name}
            </span>
            <span className="mt-1 text-eyebrow uppercase text-muted transition-colors duration-base ease-weave group-hover:text-accent">
              {site.role}
            </span>
          </Link>

          {/* Desktop */}
          <ul className="hidden items-center gap-9 md:flex">
            {navigation.map((item) =>
              item.action ? null : (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? "true" : undefined}
                    className={[
                      "link-weave text-meta transition-colors duration-base ease-weave",
                      isActive(item.href)
                        ? "text-ink-strong"
                        : "text-ink-soft hover:text-ink-strong",
                    ].join(" ")}
                  >
                    {item.label}
                  </Link>
                </li>
              )
            )}
            {navigation
              .filter((i) => i.action)
              .map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="inline-flex items-center rounded-sm border border-accent/45 px-5 py-2 text-meta text-accent transition-[background-color,color,border-color] duration-base ease-weave hover:border-accent hover:bg-accent hover:text-background"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
          </ul>

          {/* Mobile trigger — two rules that cross into an X, not a hamburger. */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            className="relative z-10 -mr-2 flex h-10 w-10 shrink-0 items-center justify-center md:hidden"
          >
            <span className="relative block h-3 w-6">
              <span
                className={[
                  "absolute left-0 block h-px w-full bg-ink-strong transition-transform duration-base ease-loom",
                  open ? "top-1/2 rotate-45" : "top-0",
                ].join(" ")}
              />
              <span
                className={[
                  "absolute left-0 block h-px w-full bg-ink-strong transition-transform duration-base ease-loom",
                  open ? "top-1/2 -rotate-45" : "top-full",
                ].join(" ")}
              />
            </span>
          </button>
        </nav>

        {/* Mobile panel */}
        <div
          id="mobile-nav"
          data-open={open || undefined}
          // Collapsed to zero height but still in the layout, so without this
          // the links stay in the tab order and keyboard focus disappears into
          // an invisible menu.
          inert={!open}
          className={[
            "grid overflow-hidden md:hidden",
            "transition-[grid-template-rows,opacity] duration-slow ease-thread",
            open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
          ].join(" ")}
        >
          <div className="min-h-0">
            <ul className="flex flex-col gap-1 px-(--spacing-gutter) pb-10 pt-2">
              {navigation.map((item, i) => (
                <li
                  key={item.href}
                  style={{
                    transitionDelay: open
                      ? `calc(${i} * var(--delay-thread))`
                      : "0ms",
                  }}
                  className={[
                    "border-b border-hairline transition-[opacity,transform] duration-slow ease-thread",
                    open
                      ? "translate-y-0 opacity-100"
                      : "translate-y-2 opacity-0",
                  ].join(" ")}
                >
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={[
                      "block py-4 font-display text-h4",
                      item.action ? "text-accent" : "text-ink-strong",
                    ].join(" ")}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </header>
    </>
  );
}
