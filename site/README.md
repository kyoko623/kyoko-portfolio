# Yifan Zhang — AIGC Short Film Portfolio

An archive and display of AIGC short film work, built with Astro.

## Develop

```bash
cd site
npm install
npm run dev
```

Open http://localhost:4321.

## Build

```bash
npm run build
```

Outputs static site to `dist/`.

## Test

```bash
npm test
```

Runs Vitest on utility functions.

## Adding a new film

1. Create a new MDX file: `src/content/films/<slug>.mdx`
2. Create an assets folder beside it: `src/content/films/<slug>/assets/`
3. Add cover, hero, character images, storyboard frames, workflow screenshots
4. Fill frontmatter (see `memory-of-a-light.mdx` for reference)
5. `npm run build` validates everything — Zod schemas catch missing/wrong fields

Within the MDX body, import each image used in `<Character>` or `<Frame>` props as ES modules at the top of the body:

```mdx
import wandererImg from './<slug>/assets/characters/wanderer.jpg';

<Character name="..." image={wandererImg}>
...
</Character>
```

Don't pass string paths to those components — Astro's `<Image>` requires an `ImageMetadata` reference.

## Replacing placeholder signatures

The handwritten signature SVGs live at:

- `src/assets/signatures/block.svg` — used as the Hero giant text
- `src/assets/signatures/cursive.svg` — used in About sign-off, Footer, Film director sign-off

Replace each with the owner's actual handwritten signature, exported as SVG.
Keep `fill="currentColor"` (or no `fill` attribute at all) so the SVG adapts to the dark theme.

## Deploy

Push to GitHub. In Cloudflare Pages dashboard:

- Connect the repo
- Build command: `cd site && npm run build`
- Build output directory: `site/dist`
- Root directory: leave empty

Cloudflare Pages will auto-deploy on every push.

## Spec

The design spec for this site lives at `../docs/superpowers/specs/2026-05-23-aigc-film-portfolio-design.md`.
