# Yifan Zhang — AIGC Short Film Portfolio

An archive and display of AIGC short film work, built with Astro.

## Quick start

```bash
cd site
npm install
npm run dev          # http://localhost:4321
npm run build        # static output → site/dist
npm test             # Vitest on utility functions
```

## Replacing the placeholder assets

The site builds and runs immediately because every required asset has a 1×1
black placeholder. To make it real, swap each file at its exact path.

### Check what is still a placeholder

From the repo root:

```bash
./scripts/check-placeholders.sh        # list only placeholders
./scripts/check-placeholders.sh --all  # also list real assets
```

Any file smaller than 300 bytes is considered placeholder.

### Per-film asset paths

For each film at `src/content/films/<slug>.mdx`, drop real images into the
sibling `<slug>/assets/` directory at the paths the MDX references. Keep
filenames identical to what is already there (the MDX imports them by name).

**`zutomayo/assets/`** — 13 images:

| Slot | Path | Used for | Suggested size |
|---|---|---|---|
| Cover | `cover.jpg` | Index Works grid + Hero peek + OG | 1920 × 1080 |
| Hero | `hero.jpg` | Film Detail page hero still | 2560 × 1440 |
| Character | `characters/wanderer.jpg` | Character card portrait | 1440 × 1920 (3:4) |
| Storyboard | `storyboard/01.jpg` … `06.jpg` | Storyboard grid (3 cols) | 1280 × 720 each |
| Workflow | `workflow/01.png`, `02.png` | TapNow screenshots | as captured |
| Discarded | `discarded/01.jpg`, `02.jpg` | 废案 frames (faded grid) | 1280 × 720 each |

**`the-greatest/assets/`** — 7 images: same shape, scale to your film's needs.

After dropping files, run `npm run build` — Astro will optimize them into
WebP at multiple resolutions and validate every path in the Zod schema.

### Per-film frontmatter to update

In `src/content/films/<slug>.mdx`, update:

- `title`, `year`, `duration`, `tagline`, `order`
- `vimeoId` (and `vimeoHash` if the Vimeo video is unlisted/private)
- `tapnow.link` (the real TapNow project URL)

### Replacing signatures

The handwritten signature SVGs live at:

- `src/assets/signatures/block.svg` — Hero giant text
- `src/assets/signatures/cursive.svg` — About signoff, Footer, Film director sign-off

These are already converted from `signatures-source/*.png` using potrace. If
you re-export the source PNGs, re-run the conversion:

```bash
cd signatures-source
for f in block cursive; do
  magick "$f.png" -flatten -alpha remove -background white -threshold 50% "$f.pbm"
  potrace "$f.pbm" -s -o "$f.svg" --tight --turdsize 40
done
# (then manually re-add aria-label and switch fill="#000000" to fill="currentColor")
```

The committed SVGs use `fill="currentColor"` so they inherit the site's
foreground color automatically. Keep that attribute on any replacement.

## Adding a new film

1. Create the MDX: `src/content/films/<slug>.mdx`
2. Create assets folder: `src/content/films/<slug>/assets/`
3. Inside `assets/`, mirror the per-film layout above (cover, hero, characters/,
   storyboard/, workflow/, discarded/ if you want a 废案 section)
4. Copy frontmatter from an existing film and adjust
5. Inside the MDX body, **import each character / storyboard / discarded image
   as an ES module** at the top — Astro's `<Image>` component requires
   `ImageMetadata`, not string paths:

```mdx
import wandererImg from './<slug>/assets/characters/wanderer.jpg';
import sb01 from './<slug>/assets/storyboard/01.jpg';

<Character name="..." image={wandererImg}>
...
</Character>

<Storyboard>
  <Frame image={sb01} caption="..." />
</Storyboard>
```

6. Run `npm run build` — the Zod schema catches missing or wrong fields.

### 废案 / Discarded frames (optional)

Add a `## 废案 · Discarded Frames` section in the MDX with `<Storyboard
variant="discarded">` — frames render at 0.55 opacity with a "废案" label
in the top-right corner.

```mdx
import dc01 from './<slug>/assets/discarded/01.jpg';

## 废案 · Discarded Frames

<Storyboard variant="discarded">
  <Frame image={dc01} caption="Cut for pacing" />
</Storyboard>
```

## Deploy

Push to GitHub. In Cloudflare Pages dashboard:

- Connect the repo `kyoko623/kyoko-portfolio`
- Production branch: `main`
- Framework preset: `Astro`
- **Root directory: `site`** (this is the key field — package.json lives here)
- Build command: `npm run build`
- Build output directory: `dist`

Cloudflare Pages will auto-deploy on every push to `main`.

## Spec

The design spec is at `../docs/superpowers/specs/2026-05-23-aigc-film-portfolio-design.md`.
