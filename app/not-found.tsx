import type { Metadata } from "next";
import Link from "next/link";
import { navigation } from "@/lib/site";

export const metadata: Metadata = {
  title: "Not found",
  robots: { index: false, follow: true },
};

/**
 * 404, in the language of the work rather than the language of an error page.
 * No status code shouted in 200px type, no "Oops".
 */
export default function NotFound() {
  return (
    <div
      data-tone="light"
      className="texture-canvas relative flex min-h-svh flex-col justify-center overflow-hidden py-(--spacing-section)"
    >
      <div
        aria-hidden
        className="texture-warp pointer-events-none absolute inset-0 opacity-45 [mask-image:radial-gradient(105%_80%_at_50%_0%,black,transparent_72%)]"
      />

      <div className="relative mx-auto w-full max-w-content px-(--spacing-gutter)">
        <p className="flex items-center gap-3 text-eyebrow uppercase text-muted">
          <span aria-hidden className="h-px w-8 bg-hairline-strong" />
          <span data-numeric>404</span>
        </p>

        <h1 className="mt-8 max-w-[16ch] font-display text-h1 text-ink-strong">
          This thread
          <br />
          <em className="italic text-accent">runs out here.</em>
        </h1>

        <p className="mt-6 max-w-measure text-body-lg text-ink-soft">
          The page you are looking for was cut and never rewoven. Everything
          that survived is below.
        </p>

        <nav aria-label="Site" className="mt-14 border-t border-hairline">
          <ul>
            {navigation.map((item) => (
              <li key={item.href} className="border-b border-hairline">
                <Link
                  href={item.href}
                  className="group flex items-baseline justify-between gap-6 py-5 transition-colors duration-base ease-weave hover:text-accent"
                >
                  <span className="font-display text-h4 text-ink-strong transition-colors duration-base ease-weave group-hover:text-accent">
                    {item.label}
                  </span>
                  <span
                    aria-hidden
                    className="text-meta text-subtle transition-transform duration-base ease-weave group-hover:translate-x-1"
                  >
                    &#8594;
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}
