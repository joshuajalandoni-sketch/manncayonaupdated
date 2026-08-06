"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  type Artwork,
  formatDimensions,
  formatPrice,
} from "@/lib/artworks";
import { series as allSeries } from "@/lib/site";
import { ArtworkImage } from "./artwork-image";

/**
 * Full-screen examination view.
 *
 * Interaction model is "object under good light", not "photo carousel":
 *   - click / tap the surface to move in on the weave; click again to step back
 *   - pinch on touch, clamped, with drag-to-pan once magnified
 *   - Esc closes, arrows move through the collection
 *   - horizontal swipe navigates, but only at rest magnification, so panning a
 *     zoomed weave never throws you into the next work
 *
 * Zoom resets on navigation. Nothing about the caption moves while you look.
 */

const ZOOM = 2.6;
const MAX_ZOOM = 4;
const SWIPE_PX = 60;
const BANDS = 16;

/* Mirrors --ease-draw. */
const DRAW = [0.33, 0, 0.13, 1] as const;

type Pointer = { x: number; y: number };

export function Lightbox({
  items,
  index,
  onClose,
  onNavigate,
}: {
  items: Artwork[];
  index: number;
  onClose: () => void;
  onNavigate: (next: number) => void;
}) {
  const artwork = items[index];
  const uid = useId();
  const stageId = `${uid}-stage`;
  const reduce = useReducedMotion();

  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState<Pointer>({ x: 0, y: 0 });

  /* Provenance disclosure: the two finished paintings this surface was cut
     from. Two states that physically existed, and nothing in between — a
     continuum here would depict a stage of the process that never happened. */
  const [showSources, setShowSources] = useState(false);
  const [playBands, setPlayBands] = useState(false);

  const frameRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const restoreFocus = useRef<HTMLElement | null>(null);

  const pointers = useRef<Map<number, Pointer>>(new Map());
  const pinchStart = useRef<{ dist: number; scale: number } | null>(null);
  const dragStart = useRef<{ x: number; y: number; ox: number; oy: number } | null>(null);
  const moved = useRef(false);

  const zoomed = scale > 1.01;
  const sources = artwork.sources ?? [];
  const hasSources = sources.length > 0;

  const reset = useCallback(() => {
    setScale(1);
    setOffset({ x: 0, y: 0 });
  }, []);

  const toggleSources = useCallback(() => {
    reset();
    setShowSources((v) => {
      // Bands play only on the return trip, where an image is resolving back
      // into the woven surface. Going the other way is just a disclosure.
      setPlayBands(v);
      return !v;
    });
  }, [reset]);

  const go = useCallback(
    (delta: number) => {
      const next = (index + delta + items.length) % items.length;
      reset();
      setShowSources(false);
      setPlayBands(false);
      onNavigate(next);
    },
    [index, items.length, onNavigate, reset]
  );

  /* --- Scroll lock + focus custody ---------------------------------------
     Mount-only, deliberately. Sharing this effect with the key handler below
     would tie it to `go` and `showSources`, so every navigation and every
     provenance toggle would run the cleanup and hand focus back to the page
     behind the modal. */
  useEffect(() => {
    restoreFocus.current = document.activeElement as HTMLElement | null;
    dialogRef.current?.focus();

    const { body } = document;
    const prevOverflow = body.style.overflow;
    const prevPad = body.style.paddingRight;
    const gap = window.innerWidth - document.documentElement.clientWidth;
    body.style.overflow = "hidden";
    if (gap > 0) body.style.paddingRight = `${gap}px`;

    return () => {
      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPad;
      restoreFocus.current?.focus?.();
    };
  }, []);

  /* --- Keyboard ----------------------------------------------------------- */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Focus trap: a modal that lets Tab wander onto the page behind it is
      // only a modal for mouse users.
      if (e.key === "Tab") {
        const root = dialogRef.current;
        if (!root) return;
        const focusable = root.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        const active = document.activeElement;

        if (e.shiftKey && (active === first || active === root)) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && active === last) {
          e.preventDefault();
          first.focus();
        }
        return;
      }

      switch (e.key) {
        case "Escape":
          e.preventDefault();
          onClose();
          break;
        case "ArrowRight":
          e.preventDefault();
          go(1);
          break;
        case "ArrowLeft":
          e.preventDefault();
          go(-1);
          break;
        case "s":
        case "S":
          if (hasSources) {
            e.preventDefault();
            toggleSources();
          }
          break;
        case "+":
        case "=":
          if (!showSources) {
            e.preventDefault();
            setScale((s) => Math.min(MAX_ZOOM, s + 0.6));
          }
          break;
        case "-":
          if (!showSources) {
            e.preventDefault();
            setScale((s) => Math.max(1, s - 0.6));
          }
          break;
        case "0":
          e.preventDefault();
          reset();
          break;
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, hasSources, onClose, reset, showSources, toggleSources]);

  /* --- Clamp panning so the surface never floats away from its frame ----- */
  const clamp = useCallback((o: Pointer, s: number): Pointer => {
    const el = frameRef.current;
    if (!el) return o;
    const { width, height } = el.getBoundingClientRect();
    const maxX = Math.max(0, (width * s - width) / 2);
    const maxY = Math.max(0, (height * s - height) / 2);
    return {
      x: Math.min(maxX, Math.max(-maxX, o.x)),
      y: Math.min(maxY, Math.max(-maxY, o.y)),
    };
  }, []);

  /* --- Pointer handling: pinch, pan, swipe, click-to-zoom ---------------- */
  const onPointerDown = (e: React.PointerEvent) => {
    (e.target as Element).setPointerCapture?.(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    moved.current = false;

    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      pinchStart.current = { dist: Math.hypot(a.x - b.x, a.y - b.y), scale };
    } else {
      dragStart.current = {
        x: e.clientX,
        y: e.clientY,
        ox: offset.x,
        oy: offset.y,
      };
    }
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointers.current.size === 2 && pinchStart.current) {
      const [a, b] = [...pointers.current.values()];
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      const next = Math.min(
        MAX_ZOOM,
        Math.max(1, (dist / pinchStart.current.dist) * pinchStart.current.scale)
      );
      moved.current = true;
      setScale(next);
      setOffset((o) => clamp(o, next));
      return;
    }

    const start = dragStart.current;
    if (!start) return;
    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;
    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) moved.current = true;

    if (zoomed) {
      setOffset(clamp({ x: start.ox + dx, y: start.oy + dy }, scale));
    }
  };

  const onPointerUp = (e: React.PointerEvent) => {
    const start = dragStart.current;
    const wasSingle = pointers.current.size === 1;
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) pinchStart.current = null;

    if (!start || !wasSingle) {
      dragStart.current = null;
      return;
    }

    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;
    dragStart.current = null;

    if (!zoomed && Math.abs(dx) > SWIPE_PX && Math.abs(dx) > Math.abs(dy)) {
      go(dx < 0 ? 1 : -1);
      return;
    }

    if (!moved.current) {
      const el = frameRef.current;
      if (!el) return;
      if (zoomed) {
        reset();
      } else {
        const r = el.getBoundingClientRect();
        const px = e.clientX - (r.left + r.width / 2);
        const py = e.clientY - (r.top + r.height / 2);
        setScale(ZOOM);
        setOffset(clamp({ x: -px * ZOOM, y: -py * ZOOM }, ZOOM));
      }
    }
  };

  const seriesName =
    allSeries.find((s) => s.slug === artwork.series)?.name ?? artwork.series;

  const fade = { duration: reduce ? 0 : 0.35 };

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={`${artwork.title}, ${artwork.year}`}
      tabIndex={-1}
      data-tone="dark"
      className="fixed inset-0 z-[100] flex flex-col bg-background/98 backdrop-blur-xl outline-none animate-fade"
    >
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between gap-6 px-(--spacing-gutter) py-5">
        <span data-numeric className="text-eyebrow uppercase text-subtle">
          {String(index + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
        </span>

        <div className="flex items-center gap-6">
          {!showSources ? (
            <span className="hidden text-caption text-subtle sm:inline">
              {zoomed ? "Click to step back" : "Click the surface to move in"}
            </span>
          ) : null}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-eyebrow uppercase text-muted transition-colors duration-base ease-weave hover:text-ink-strong"
          >
            Close
          </button>
        </div>
      </div>

      {/* Stage */}
      <div
        id={stageId}
        className="relative flex min-h-0 flex-1 items-center justify-center px-(--spacing-gutter) pb-4"
      >
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Previous work"
          className="absolute left-2 z-10 hidden h-12 w-12 items-center justify-center text-muted transition-colors duration-base ease-weave hover:text-ink-strong md:flex"
        >
          <span aria-hidden className="text-h4">&#8592;</span>
        </button>

        <AnimatePresence mode="wait" initial={false}>
          {showSources ? (
            <motion.div
              key="sources"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={fade}
              className="grid h-full w-full max-w-5xl grid-cols-1 items-stretch gap-5 sm:grid-cols-2 sm:gap-8"
            >
              {sources.map((s) => (
                <figure key={s.label} className="flex min-h-0 flex-col gap-3">
                  <div className="relative min-h-0 flex-1 overflow-hidden rounded-xs bg-surface-sunken ring-1 ring-hairline">
                    {s.image ? (
                      <Image
                        src={s.image.src}
                        alt={s.label}
                        fill
                        // Contain, not cover: a source painting is evidence.
                        // Cropping it would defeat the point of showing it.
                        sizes="(max-width: 640px) 100vw, 45vw"
                        className="object-contain"
                      />
                    ) : (
                      <>
                        <div
                          aria-hidden
                          className="texture-warp absolute inset-0 opacity-45"
                        />
                        <span className="absolute inset-0 flex items-center justify-center px-6 text-center text-eyebrow uppercase text-subtle">
                          Source painting
                        </span>
                      </>
                    )}
                  </div>
                  <figcaption className="text-caption text-muted">
                    {s.label}
                  </figcaption>
                </figure>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="weave"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={fade}
              ref={frameRef}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
              style={{ aspectRatio: String(artwork.aspect), touchAction: "none" }}
              className={[
                "relative max-h-full w-auto max-w-full overflow-hidden select-none",
                "shadow-hang ring-1 ring-hairline",
                zoomed ? "cursor-zoom-out" : "cursor-zoom-in",
              ].join(" ")}
            >
              <div
                className="absolute inset-0 origin-center transition-transform duration-slow ease-thread"
                style={{
                  transform: `translate3d(${offset.x}px, ${offset.y}px, 0) scale(${scale})`,
                  transitionDuration: dragStart.current ? "0ms" : undefined,
                }}
              >
                <ArtworkImage
                  artwork={artwork}
                  sizes="(max-width: 768px) 100vw, 80vw"
                  priority
                  strip={16}
                />
              </div>

              {/* The weave closing back over the sources. Even threads lift
                  first, then the odd ones, same as everywhere else. */}
              {playBands && !reduce ? (
                <div
                  aria-hidden
                  className="motion-veil pointer-events-none absolute inset-0 flex"
                >
                  {Array.from({ length: BANDS }).map((_, i) => (
                    <motion.span
                      key={i}
                      className="h-full flex-1 origin-top"
                      style={{ background: "var(--background)" }}
                      initial={{ scaleY: 1 }}
                      animate={{ scaleY: 0 }}
                      transition={{
                        duration: 1.0,
                        delay: (i % 2) * 0.26 + Math.floor(i / 2) * 0.045,
                        ease: DRAW,
                      }}
                    />
                  ))}
                </div>
              ) : null}
            </motion.div>
          )}
        </AnimatePresence>

        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Next work"
          className="absolute right-2 z-10 hidden h-12 w-12 items-center justify-center text-muted transition-colors duration-base ease-weave hover:text-ink-strong md:flex"
        >
          <span aria-hidden className="text-h4">&#8594;</span>
        </button>
      </div>

      {/* Caption */}
      <div className="shrink-0 overflow-y-auto border-t border-hairline px-(--spacing-gutter) py-6">
        <div className="mx-auto flex max-w-content flex-col gap-x-12 gap-y-5 md:flex-row md:items-start md:justify-between">
          <div className="flex flex-col gap-2">
            <p className="text-eyebrow uppercase text-subtle">{seriesName}</p>
            <h2 className="font-display text-h3 text-ink-strong">
              {artwork.title}
              {artwork.meaning ? (
                <span className="ml-3 align-middle text-meta italic text-muted">
                  {artwork.meaning}
                </span>
              ) : null}
            </h2>
            <p className="max-w-measure text-caption leading-relaxed text-ink-soft">
              {artwork.note}
            </p>
          </div>

          <dl className="grid shrink-0 grid-cols-2 gap-x-10 gap-y-4 md:grid-cols-1 md:text-right">
            <div>
              <dt className="text-eyebrow uppercase text-subtle">Year</dt>
              <dd data-numeric className="text-caption text-ink">{artwork.year}</dd>
            </div>
            <div>
              <dt className="text-eyebrow uppercase text-subtle">Medium</dt>
              <dd className="text-caption text-ink">{artwork.medium}</dd>
            </div>
            <div>
              <dt className="text-eyebrow uppercase text-subtle">Dimensions</dt>
              <dd data-numeric className="text-caption text-ink">
                {formatDimensions(artwork.dimensions)}
              </dd>
            </div>
            <div>
              <dt className="text-eyebrow uppercase text-subtle">Availability</dt>
              <dd className="text-caption">
                {artwork.available ? (
                  <span className="text-ink">
                    Available
                    {artwork.price ? (
                      <span data-numeric className="text-muted">
                        {" "}
                        — {formatPrice(artwork.price)}
                      </span>
                    ) : null}
                  </span>
                ) : (
                  <span className="text-muted">Sold</span>
                )}
              </dd>
            </div>
          </dl>
        </div>

        {/* Provenance */}
        {hasSources ? (
          <div className="mx-auto mt-6 flex max-w-content flex-col gap-3 border-t border-hairline pt-5">
            <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
              <p className="text-eyebrow uppercase text-subtle">Cut from</p>
              <button
                type="button"
                onClick={toggleSources}
                aria-expanded={showSources}
                aria-controls={stageId}
                className="rounded-sm border border-hairline-strong px-4 py-1.5 text-caption text-ink transition-colors duration-base ease-weave hover:border-accent hover:text-accent"
              >
                {showSources ? "Show the weave" : "Show the two paintings"}
              </button>
            </div>

            <ul className="flex flex-wrap gap-x-8 gap-y-2">
              {sources.map((s) => (
                <li key={s.label} className="text-caption text-muted">
                  {s.label}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>

      {/* State change is visual only; say it out loud for screen readers. */}
      <p aria-live="polite" className="sr-only">
        {showSources
          ? `Showing the two paintings ${artwork.title} was cut from.`
          : `Showing ${artwork.title}, the woven surface.`}
      </p>
    </div>
  );
}
