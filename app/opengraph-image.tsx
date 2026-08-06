import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const alt = `${site.name} — ${site.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Default share card, generated from the design tokens so the link preview and
 * the site cannot drift apart.
 *
 * The serif is fetched at build time. Google's CSS endpoint only serves TTF
 * (which satori can parse) to legacy user agents — modern ones get woff2.
 * If the fetch fails for any reason the card still renders, just in the
 * bundled fallback face; the build never breaks over a font.
 */
async function loadDisplayFont(text: string): Promise<ArrayBuffer | null> {
  try {
    const css = await fetch(
      `https://fonts.googleapis.com/css2?family=Newsreader:wght@400&text=${encodeURIComponent(
        text
      )}`,
      { headers: { "User-Agent": "Mozilla/5.0 (Windows NT 6.1)" } }
    ).then((r) => r.text());

    const url = css.match(/src:\s*url\((https:[^)]+)\)/)?.[1];
    if (!url) return null;
    return await fetch(url).then((r) => r.arrayBuffer());
  } catch {
    return null;
  }
}

export default async function Image() {
  const headline = site.name;
  const font = await loadDisplayFont(`${headline}${site.role}${site.tagline}`);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#f5f1e8",
          padding: "72px 80px",
          position: "relative",
        }}
      >
        {/* Warp field — the same vertical thread texture used on the site. */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            backgroundImage:
              "repeating-linear-gradient(90deg, rgba(110,101,83,0.16) 0px, rgba(110,101,83,0.16) 1px, transparent 1px, transparent 9px)",
          }}
        />

        {/* Dye swatches, in weave order. */}
        <div style={{ display: "flex", gap: 10 }}>
          {["#b75e38", "#be9245", "#2c4757", "#5c8f86"].map((c) => (
            <div key={c} style={{ width: 56, height: 6, background: c }} />
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              fontFamily: font ? "Display" : undefined,
              fontSize: 132,
              lineHeight: 0.92,
              letterSpacing: "-0.035em",
              color: "#14130f",
              display: "flex",
            }}
          >
            {headline}
          </div>
          <div
            style={{
              fontSize: 32,
              letterSpacing: "0.02em",
              color: "#6e6553",
              display: "flex",
              maxWidth: 820,
            }}
          >
            {site.tagline}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            fontSize: 22,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#948970",
            borderTop: "1px solid rgba(110,101,83,0.3)",
            paddingTop: 28,
          }}
        >
          <span>{site.role}</span>
          <span>{site.location.studio}</span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: font
        ? [{ name: "Display", data: font, style: "normal", weight: 400 }]
        : [],
    }
  );
}
