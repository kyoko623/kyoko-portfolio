# AIGC Short Film Portfolio — Design Spec

**Date:** 2026-05-23
**Owner:** Yifan Zhang
**Status:** Awaiting user approval before plan

---

## 1. Project Goal

A personal website that serves as both **archive and display** for Yifan Zhang's AIGC short films. Each film's complete material — script core, character designs (image + text), storyboard, workflow links/screenshots, and finished video — is kept together as it was made.

The site is a creator homepage, not a commercial portfolio. The audience is peers, future collaborators, and the creator's own future self.

## 2. Scope

**In scope:**
- Static website built from scratch
- 2 short films at launch, designed to scale to 10+ without architectural changes
- 4 content surfaces: Index (single-page), Film Detail (per film), and the About/Contact areas embedded in Index
- Bilingual-tolerant content (English-primary UI; content body may include Chinese)
- Cloudflare Pages deployment with custom domain support

**Out of scope (for v1):**
- CMS or admin UI — content is edited as MDX/Markdown files in git
- Blog or essay system
- Tag/category filters (not needed under ~10 films)
- Authentication, comments, analytics dashboards
- Independent About / Contact pages (they are sections of Index)
- Internationalization (i18n) framework — English copy is hand-authored
- Aggregated "Workflows" overview page — workflow lives inside each film

## 3. Decisions Summary

| Dimension | Decision |
|---|---|
| Positioning | Personal AIGC archive + display |
| Scale | 2 films at launch, designed to grow |
| Visual style | Pure Cargo / Brutalist (pure black & white, no accent color) |
| Film page layout | Long-page case study: 1 Hero + 5 anchored content sections + director sign-off + Next Film link |
| Language | English-primary; Chinese allowed in long-form body content |
| Video hosting | Vimeo embed (with no-track, white progress bar, no badge) |
| Workflow content | TapNow screenshots + external TapNow project link |
| Pages | Index (single-page with anchors) + Film Detail (per film) |
| Tech stack | Astro |
| Hosting | Cloudflare Pages |
| Signatures | Two handwritten signatures used in three places — see §6.4 |

## 4. Information Architecture

```
Index (/)
├── Hero          ← full-viewport, giant centered handwritten signature
├── Works         ← anchor #works, vertical list of films, one large cover each
├── About         ← anchor #info, centered long-form text + cursive sign-off
└── Contact       ← centered link list (Email, Instagram only)

/films/<slug>     ← long-page case study per film
├── Hero          ← title + meta + tagline + hero still
├── Core          ← anchor #core, centered long-form narrative
├── Characters    ← anchor #characters, image-left + text-right cards
├── Storyboard    ← anchor #storyboard, 3-column grid
├── Workflow      ← anchor #workflow, 2-column TapNow screenshots + outbound button
├── Watch         ← anchor #video, Vimeo embed as "finale"
├── Director      ← cursive signature sign-off
└── Next Film     ← navigation to next film
```

**Header nav (all pages):** A 3-column meta-bar (`Logo · Tagline · Information`) at top. On Index, "Information" anchors to `#info`. On Film Detail, the left column becomes `← All Works`.

**No standalone `/about` or `/contact` pages** — these are sections of the Index.

## 5. Visual Design System

### 5.1 Color

| Token | Hex | Use |
|---|---|---|
| BG | `#000000` | Page background |
| TEXT | `#F5F5F5` | Primary text |
| MUTED | `#888888` | Meta info, secondary text |
| INVERTED | swap of BG/TEXT | Hover state on links and cards |

No accent color. No shadows, gradients, rounded corners. Visual hierarchy comes from type scale, weight, casing, and inverted blocks.

### 5.2 Typography

**Font family (UI):** `Inter Tight` — installed locally via `@fontsource-variable/inter-tight`. Fallback stack: `-apple-system, "Helvetica Neue", Arial, sans-serif`.

**Type scale:**

| Role | Size | Weight | Tracking | Notes |
|---|---|---|---|---|
| Display Hero (film title) | `clamp(72px, 12vw, 160px)` | 900 | -0.04em | line-height 0.9 |
| Section Title | 48–72px | 800–900 | -0.04em | uppercase variant for some |
| Card Title | 32–56px | 800 | -0.03em | |
| Body | 14–17px | 400 | normal | line-height 1.6–1.7 |
| Body (callout / blockquote) | 22px | 400 italic | normal | left rule, indented |
| Meta | 11px | 500 | 0.12em | UPPERCASE |

**Signature fonts (placeholders for mockup only; replaced by real SVGs in build):**
- Block: `Permanent Marker` → real SVG of handwritten "ZHANG YIFAN"
- Cursive: `Caveat` → real SVG of cursive signature

### 5.3 Layout

- 12-column grid, 24px gutter
- Outer padding: 24px desktop, 16px mobile
- Section dividers: `1px solid #F5F5F5`
- All section content centered horizontally except the top meta-bar (3-column) and Hero peek row (3-column)
- Body text max-width: 60ch (centered)

### 5.4 Interactions

- Links default underlined; hover inverts (background ↔ text colors swap)
- Cards on hover invert their entire background
- No animations beyond opacity/color transitions (≤200ms)
- 4-corner white square markers on key image containers (Cargo-style visual anchors)

## 6. Page Designs

### 6.1 Index page (single page, vertical scroll)

**Hero (100vh):**
- Top meta bar (3 cols): `[■ YIFAN ZHANG] · [An Archive of AIGC Short Films · Est. 2024] · [Information →]`
- Center: giant handwritten **block signature** (the "ZHANG YIFAN" SVG), max-width 80% of viewport
- Below signature: small uppercase sub-label `— AIGC Short Films · Archive & Display —`
- Bottom: 3-col peek row `[■ 2026] · [First film title]Memory of a Light, AIGC Short Film · [More →]`
- Immediately below peek row: top half of first film's cover image visible (the "peek")

**Works section (`#works`):**
- Header strip: `① Works · Index | N / N`
- One large cover image per film (16:9), 1 column
- Below each cover: centered title (56px), centered meta (`year · duration · View →`)
- Hover: cover dims slightly (no full invert here — image is the focus)

**About section (`#info`):**
- Centered `About.` headline (72px)
- Centered body, max-width 60ch
- At the bottom of body: cursive signature sign-off — `— signed,` then the cursive SVG (~80px tall)

**Contact section:**
- Centered `Let's talk.` headline
- Bordered link list, max-width 600px, centered
- Items: `Email | kyouichizhang@outlook.com →`, `Instagram | @kyoko_zhang0623 →`
- (No phone number — explicit decision)
- Each row inverts on hover

**Footer:**
- 3-col: `© Yifan Zhang · 2026 | [cursive signature, small] | Built with Astro`

### 6.2 Film Detail page (`/films/<slug>`)

Vertical sections, each preceded by a section-anchor strip showing `①Core | #core`.

1. **Header**: `← All Works | Yifan Zhang | Information`. `← All Works` links to `/#works`; `Information` links to `/#info`.
2. **Hero**: meta line · `Memory of\na Light` (display hero) · italic tagline · hero still (16:9) with 4-corner markers
3. **Core**: `Core.` headline · long-form centered body, blockquote rendered with left rule + italic at 22px
4. **Characters**: `Characters.` headline · per character: image (3:4, left col) + text block (right col, 1.5fr) with `h3` name, `h4` subsection labels, and nested bullet lists supporting bold + nested ul
5. **Storyboard**: `Storyboard.` headline · 3-col grid of frames (16:9 each), each frame has top-left frame number and optional bottom caption in inverted block (white bg, black text)
6. **Workflow**: `Workflow.` headline · 2-col grid of TapNow screenshots (16:9) · centered `Open TapNow Project →` button (white outline, inverts on hover)
7. **Watch**: `Watch.` headline · Vimeo embed with custom params (see §7.3)
8. **Director sign-off**: centered, small `— Directed by` label · large cursive signature
9. **Next Film**: full-width link card · small `Next →` label · large title

### 6.3 Mobile adaptations

- Hero font scales via `clamp()` down to 80px minimum
- 3-col meta bars stack vertically with `flex-wrap`
- Characters grid: image stacks above text (1 column)
- Storyboard: 2 columns on tablet, 1 on phone
- Workflow: 1 column on phone
- Outer padding shrinks to 16px

### 6.4 Signature integration

| Where | Which signature | Implementation |
|---|---|---|
| Index Hero (giant) | Block "ZHANG YIFAN" SVG | `<Signature variant="block" />`, max-width 80% |
| Index About sign-off | Cursive SVG | `<Signature variant="cursive" size="md" />`, ~80px tall |
| Index Footer | Cursive SVG (small) | `<Signature variant="cursive" size="sm" />`, ~24px tall |
| Film Detail Director | Cursive SVG | `<Signature variant="cursive" size="lg" />`, ~72px tall |

All signatures are SVG files with `fill="currentColor"` so they automatically use `#F5F5F5` on the dark theme.

## 7. Technical Architecture

### 7.1 Stack

- **Framework:** Astro (latest stable). Static-first, ships near-zero JS.
- **Content:** MDX via `@astrojs/mdx` for rich film case studies.
- **Validation:** Zod schemas through Astro Content Collections.
- **Fonts:** `@fontsource-variable/inter-tight` (local, no CDN dependency).
- **Images:** Astro's built-in `<Image>` component (Sharp under the hood) for WebP/AVIF + responsive srcset.
- **Markdown rendering:** GFM (tables, strikethrough) via `remark-gfm`.

### 7.2 File structure

```
yifan-zhang-portfolio/
├── astro.config.mjs
├── package.json
├── tsconfig.json
├── public/
│   ├── favicon.svg
│   └── og-image.jpg
├── src/
│   ├── content/
│   │   ├── config.ts                          ← Zod schemas (films, site)
│   │   ├── films/
│   │   │   ├── memory-of-a-light.mdx
│   │   │   ├── memory-of-a-light/assets/      ← cover, hero, characters/, storyboard/, workflow/
│   │   │   ├── untitled-02.mdx
│   │   │   └── untitled-02/assets/
│   │   └── site/
│   │       ├── about.mdx
│   │       └── meta.ts                        ← email, IG handle, owner name
│   ├── assets/
│   │   └── signatures/
│   │       ├── block.svg
│   │       └── cursive.svg
│   ├── components/
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   ├── Signature.astro                    ← variant + size props
│   │   ├── Character.astro                    ← MDX-friendly
│   │   ├── Storyboard.astro                   ← grid wrapper
│   │   ├── Frame.astro                        ← single storyboard frame
│   │   ├── WorkflowGallery.astro
│   │   ├── VimeoEmbed.astro
│   │   ├── FilmCard.astro
│   │   └── SectionAnchor.astro
│   ├── layouts/
│   │   └── BaseLayout.astro
│   ├── pages/
│   │   ├── index.astro
│   │   └── films/[...slug].astro
│   └── styles/
│       └── global.css
└── README.md
```

### 7.3 Content schemas (`src/content/config.ts`)

```ts
import { defineCollection, z } from 'astro:content';

const films = defineCollection({
  type: 'content',
  schema: ({ image }) => z.object({
    title: z.string(),
    year: z.number(),
    duration: z.string(),           // "14:32"
    tagline: z.string(),
    order: z.number(),              // sort key (lower = earlier)
    cover: image(),
    heroImage: image().optional(),
    vimeoId: z.string(),
    vimeoHash: z.string().optional(),
    tapnow: z.object({
      link: z.string().url(),
      screenshots: z.array(image()).min(1),
    }),
    draft: z.boolean().default(false),
  }),
});

const site = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
  }),
});

export const collections = { films, site };
```

### 7.4 Vimeo embed defaults

`<VimeoEmbed>` produces:
```
https://player.vimeo.com/video/{vimeoId}?
  h={vimeoHash}&
  color=ffffff&
  byline=0&
  portrait=0&
  title=0&
  badge=0&
  dnt=1
```
Loaded `loading="lazy"`, `allow="autoplay; fullscreen; picture-in-picture"`, aspect-ratio 16:9.

### 7.5 Image optimization

- All schema-validated images go through Astro `<Image>`.
- Storyboard frames and character images: WebP, served at 2 resolutions (1x, 2x).
- Hero images: WebP + AVIF, served at 3 resolutions.
- TapNow screenshots: WebP, lossless-leaning (preserve UI text legibility).
- `alt` text required on every image at the component level (TypeScript-enforced).

### 7.6 SEO & social

- Per-film `<title>` and `<meta name="description">` from frontmatter.
- Open Graph: title, description, og:image. Film Detail uses the film's cover; Index falls back to `public/og-image.jpg`.
- Twitter Card: `summary_large_image`.
- `sitemap.xml` via `@astrojs/sitemap`.
- `robots.txt` allows all.

### 7.7 Accessibility

- Semantic HTML (`<article>`, `<section>`, `<nav>`, `<figure>` + `<figcaption>`).
- All images have `alt`.
- Color contrast: `#F5F5F5` on `#000000` ratio ≈ 19.3:1 — well above WCAG AAA (7:1).
- Focus styles preserved (no `outline: none`).
- Hover states must also work on keyboard focus.

## 8. Build & Deploy

| Stage | Tool | Notes |
|---|---|---|
| Dev | `npm run dev` | localhost:4321 |
| Build | `npm run build` | outputs `dist/` |
| Hosting | Cloudflare Pages | git push → auto build → deploy |
| Domain | Custom (TBD by owner) or `*.pages.dev` | Cloudflare DNS + automatic HTTPS |

**Performance targets:**
- Lighthouse Performance ≥ 95
- Lighthouse Accessibility ≥ 95
- Lighthouse Best Practices ≥ 95
- Lighthouse SEO ≥ 95
- First Contentful Paint < 1s on fast 3G simulation

## 9. Assets Owner Must Provide

| Asset | For | Notes |
|---|---|---|
| Block-letter handwritten signature | Hero | Convert to SVG (Inkscape/Illustrator, ~30s) |
| Cursive signature | Sign-offs, footer | Same |
| About long-form text (English) | About section | ~150-300 words |
| For each film: title, year, duration, tagline, cover image, hero still, character images + descriptions, storyboard images (optional captions), TapNow screenshots, TapNow project URL, Vimeo ID (+ optional hash) | Film Detail | All goes into a single MDX file |
| Domain (optional) | Cloudflare DNS | Falls back to `*.pages.dev` if none |

## 10. Open Questions / Future Considerations

- **Signature SVG conversion:** Owner to convert handwritten PNG → SVG. Plan stage will include a brief how-to if needed.
- **Vimeo Pro account:** Required only if the owner wants the cleanest player (recommendation: yes). Free Vimeo accounts work but show the Vimeo logo.
- **Tag/category system:** Not added in v1. If film count grows past ~10, revisit.
- **RSS feed:** Could be added trivially (`@astrojs/rss`) if owner wants. Not in v1.
- **Analytics:** Cloudflare Web Analytics is privacy-friendly and free. Can be added in 1 minute post-launch if owner wants.

---

## Approval

Owner reviews this document and signs off before the implementation plan is written. Changes are made inline by editing this file.
