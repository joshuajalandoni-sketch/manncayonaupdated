"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import type { ReactNode } from "react";

/**
 * The site's motion vocabulary. One file, used by every section.
 *
 * Three rules, taken from the design system and not negotiable:
 *   1. Nothing overshoots. Every curve below ends flat, because cloth settles
 *      and does not rebound.
 *   2. Nothing moves far. Travel is measured in tens of pixels, never hundreds.
 *   3. Everything is slow enough to read as deliberate rather than as an
 *      effect. If a reveal draws attention to itself, it has failed.
 *
 * `useReducedMotion` is honoured in every primitive: with it on, content is
 * simply present. No part of the site depends on an animation having run.
 */

/* Mirrors --ease-thread: a long expo settle. */
const THREAD = [0.16, 1, 0.3, 1] as const;
/* Mirrors --ease-draw: slow to start, for anything that behaves like a curtain. */
const DRAW = [0.33, 0, 0.13, 1] as const;

const VIEWPORT = { once: true, margin: "-12% 0px -12% 0px" } as const;

/* ── Drape ────────────────────────────────────────────────────────────────
   The default. A short rise with a long tail. Used for text and small media. */

export function Drape({
  children,
  delay = 0,
  y = 18,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: 1.0, delay, ease: THREAD }}
    >
      {children}
    </motion.div>
  );
}

/* ── Stagger ──────────────────────────────────────────────────────────────
   A parent that releases its children one thread at a time. */

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

const strand: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.95, ease: THREAD } },
};

export function Stagger({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={className}
      variants={reduce ? undefined : stagger}
      initial={reduce ? false : "hidden"}
      whileInView="show"
      viewport={VIEWPORT}
    >
      {children}
    </motion.div>
  );
}

export function Strand({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div className={className} variants={reduce ? undefined : strand}>
      {children}
    </motion.div>
  );
}

/* ── WeaveReveal ──────────────────────────────────────────────────────────
   The signature reveal, and the only one allowed to be noticed.

   The image sits under a row of vertical bands the colour of the ground.
   The bands lift in two passes: every even band first, then every odd one.
   That is the order a weaver actually works in, and it is why the reveal
   reads as an image being woven into place rather than as a wipe.

   Rationed on purpose. It runs where an image is becoming something else,
   and nowhere else. */

export function WeaveReveal({
  children,
  bands = 14,
  className = "",
  ground = "var(--background)",
}: {
  children: ReactNode;
  /** More bands reads finer. Below ~8 it stops looking like thread. */
  bands?: number;
  className?: string;
  /** Must match whatever sits behind, or the bands will be visible at rest. */
  ground?: string;
}) {
  const reduce = useReducedMotion();

  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={`relative overflow-hidden ${className}`}
      initial="hidden"
      whileInView="show"
      viewport={VIEWPORT}
    >
      {children}

      <div
        aria-hidden
        className="motion-veil pointer-events-none absolute inset-0 flex"
      >
        {Array.from({ length: bands }).map((_, i) => {
          // Even threads lift first, then the odd ones fill in behind them.
          const pass = i % 2;
          const withinPass = Math.floor(i / 2);
          const delay = pass * 0.3 + withinPass * 0.05;

          return (
            <motion.span
              key={i}
              className="h-full flex-1 origin-top"
              style={{ background: ground }}
              variants={{
                hidden: { scaleY: 1 },
                show: {
                  scaleY: 0,
                  transition: { duration: 1.15, delay, ease: DRAW },
                },
              }}
            />
          );
        })}
      </div>
    </motion.div>
  );
}

/* ── DrawnRule ────────────────────────────────────────────────────────────
   A hairline that draws itself across. Opens a beat or separates a movement. */

export function DrawnRule({ className = "" }: { className?: string }) {
  const reduce = useReducedMotion();

  return (
    <motion.span
      aria-hidden
      className={`block h-px origin-left bg-hairline-strong ${className}`}
      initial={reduce ? false : { scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={VIEWPORT}
      transition={{ duration: 1.3, ease: DRAW }}
    />
  );
}
