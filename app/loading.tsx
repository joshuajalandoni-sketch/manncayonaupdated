/**
 * Loading state.
 *
 * The old site held a hard 2.9 second loader in front of the artwork. This is
 * the opposite: it appears only if something is genuinely slow, and it holds
 * the page's ground colour and monogram so arriving at content is a fade
 * rather than a flash.
 *
 * The rule sweeps rather than fills. A progress bar would be a promise about
 * duration that nothing here can keep. Under reduced motion the global rule in
 * globals.css stops the sweep; the monogram and the announced status carry the
 * meaning on their own.
 */
export default function Loading() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-svh flex-col items-center justify-center gap-8 bg-background"
    >
      <span className="font-display text-h3 tracking-tight text-ink-strong opacity-70">
        MC
      </span>

      <span
        aria-hidden
        className="relative block h-px w-32 overflow-hidden bg-hairline"
      >
        <span className="absolute inset-y-0 left-0 w-1/3 animate-sweep bg-accent" />
      </span>

      <span className="sr-only">Loading</span>
    </div>
  );
}
