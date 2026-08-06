"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { artworks as allArtworks, type SeriesSlug } from "@/lib/artworks";
import { series as seriesMeta } from "@/lib/site";
import { ArtworkCard } from "./artwork-card";
import { Lightbox } from "./lightbox";

/**
 * Selected Works.
 *
 * Laid out as a considered grid rather than true masonry: works keep their real
 * aspect ratios, columns drift vertically against each other, and the
 * monumental pieces take two columns so scale survives the thumbnail. Row gaps
 * are deliberately larger than column gaps, which is what makes a wall of
 * images read as hung objects instead of a feed.
 */

const GRID_SIZES =
  "(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw";

type Filter = "all" | SeriesSlug;

/** Vertical drift per column, so no two columns share a baseline. */
const drift = ["", "lg:mt-20", "lg:mt-9"];

function useRevealed<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.05 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return { ref, shown };
}

function GridItem({
  children,
  column,
  order,
  span,
}: {
  children: React.ReactNode;
  column: number;
  order: number;
  span: boolean;
}) {
  const { ref, shown } = useRevealed<HTMLDivElement>();

  return (
    <div
      ref={ref}
      style={{
        transitionDelay: shown ? `calc(${order % 3} * var(--delay-thread))` : "0ms",
      }}
      className={[
        span ? "lg:col-span-2" : "",
        drift[column % drift.length],
        "transition-[opacity,transform] duration-drape ease-thread",
        shown ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>
  );
}

export function Gallery() {
  const [filter, setFilter] = useState<Filter>("all");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const counts = useMemo(() => {
    const map = new Map<SeriesSlug, number>();
    for (const a of allArtworks) map.set(a.series, (map.get(a.series) ?? 0) + 1);
    return map;
  }, []);

  const visible = useMemo(
    () =>
      filter === "all"
        ? allArtworks
        : allArtworks.filter((a) => a.series === filter),
    [filter]
  );

  // Filtering while the lightbox is open would desync the index.
  const changeFilter = useCallback((next: Filter) => {
    setOpenIndex(null);
    setFilter(next);
  }, []);

  const availableSeries = seriesMeta.filter((s) => counts.get(s.slug));
  const activeSeries = seriesMeta.find((s) => s.slug === filter);

  return (
    <>
      {/* Filter. Only rendered when there is genuinely more than one series. */}
      {availableSeries.length > 1 ? (
        <div className="mt-12 flex flex-col gap-5">
          <div
            role="group"
            aria-label="Filter by series"
            className="flex flex-wrap items-center gap-2"
          >
            {(
              [
                { slug: "all" as const, name: "All", count: allArtworks.length },
                ...availableSeries.map((s) => ({
                  slug: s.slug,
                  name: s.name,
                  count: counts.get(s.slug) ?? 0,
                })),
              ]
            ).map((s) => {
              const active = filter === s.slug;
              return (
                <button
                  key={s.slug}
                  type="button"
                  onClick={() => changeFilter(s.slug)}
                  aria-pressed={active}
                  className={[
                    "rounded-sm border px-4 py-2 text-caption transition-colors duration-base ease-weave",
                    active
                      ? "border-ink-strong bg-ink-strong text-background"
                      : "border-hairline text-ink-soft hover:border-hairline-strong hover:text-ink-strong",
                  ].join(" ")}
                >
                  {s.name}
                  <span
                    data-numeric
                    className={active ? "ml-2 text-background/55" : "ml-2 text-subtle"}
                  >
                    {s.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* The series statement, replacing the old boilerplate descriptions. */}
          <p
            aria-live="polite"
            className="max-w-measure text-caption leading-relaxed text-muted"
          >
            {activeSeries?.blurb ??
              "Eighteen surfaces across three series, each cut from two finished paintings."}
          </p>
        </div>
      ) : null}

      <div className="mt-16 grid grid-cols-1 items-start gap-x-8 gap-y-(--spacing-section-tight) sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-12">
        {visible.map((artwork, i) => (
          <GridItem
            key={artwork.slug}
            column={i}
            order={i}
            span={Boolean(artwork.monumental)}
          >
            {/* No `priority` anywhere in the grid: it sits below a full-height
                hero, so preloading these would compete with the actual LCP
                image for bandwidth on exactly the mobile connections that can
                least afford it. */}
            <ArtworkCard
              artwork={artwork}
              sizes={artwork.monumental ? "(max-width: 1280px) 100vw, 66vw" : GRID_SIZES}
              onOpen={() => setOpenIndex(i)}
            />
          </GridItem>
        ))}
      </div>

      {openIndex !== null ? (
        <Lightbox
          items={visible}
          index={openIndex}
          onClose={() => setOpenIndex(null)}
          onNavigate={setOpenIndex}
        />
      ) : null}
    </>
  );
}
