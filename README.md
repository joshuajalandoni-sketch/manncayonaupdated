# Mann Cayona — Woven Paintings

Next.js 16 + React 19 + Tailwind v4. Paste this whole folder into your repo.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
```

```bash
npm run build    # production build
npm start        # serve the production build
```

## Deploy

Push to GitHub, then import the repo on Vercel. No configuration needed — it
detects Next.js, runs `npm install && npm run build`, and serves it.

Or from this folder: `npx vercel`

**Before deploying**, set the real domain in `lib/site.ts`:

```ts
url: "https://manncayona.vercel.app",   // drives Open Graph + sitemap URLs
```

## The images are not here yet

Every artwork currently renders a generated CSS weave placeholder. The site is
structurally finished and will look unfinished until real photography is added.
Your original images live in `reference/old-site.html` as embedded base64.

### Adding artwork photography

Drop files in `public/work/`, then fill the `image` field in `lib/artworks.ts`:

```ts
{
  slug: "hingabut",
  // ...
  image: { src: "/work/hingabut.jpg", width: 2400, height: 3000 },
  detail: { src: "/work/hingabut-detail.jpg", width: 2400, height: 2400 },
}
```

That is the only change needed. `components/gallery/artwork-image.tsx` switches
from the placeholder to `next/image` automatically.

### Adding process photography

Drop files in `public/process/` and fill the `image` field on the matching beat
in `lib/process.ts`. The hand-weaving loop goes in the same place as `clip`:

```ts
clip: { src: "/process/weaving-loop.mp4", poster: "/process/weaving-poster.jpg" }
```

### Adding the portrait and studio shots

`public/studio/`, referenced from `lib/about.ts`.

## Where the content lives

All copy is in `lib/`, separate from layout. You can rewrite any of it without
touching a component.

| File | Contains |
|---|---|
| `lib/site.ts` | Name, contact, navigation, series definitions |
| `lib/artworks.ts` | All 18 works: titles, dimensions, prices, notes |
| `lib/process.ts` | The Process essay copy and its media slots |
| `lib/about.ts` | Artist text and the hablon / patadyong section |
| `lib/exhibitions.ts` | Exhibition record, press, quotes |

## Still outstanding

- **The blade photograph** — Process beat 02, the single most important missing image
- **The hand-weaving loop** — 20–40s, silent, no cuts
- **Photography for all 18 works**, plus macro shots of the interlace
- **The two source paintings** (Rizal, Bonifacio) for the provenance reveal
- **Exhibition years** — six of seven are missing, shown as `—` in `lib/exhibitions.ts`
- **A form backend** — the inquiry form composes a mailto; swap `handleSubmit`
  in `components/inquire/inquire-section.tsx` for a server action when ready

## Notes

- `reference/old-site.html` is the previous single-file site, kept for the
  embedded images only. Safe to delete once assets are extracted.
- `node_modules/` and `.next/` are intentionally absent. They regenerate on
  `npm install` and `npm run build`.
