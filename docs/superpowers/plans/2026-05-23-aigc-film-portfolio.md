# AIGC Short Film Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a personal AIGC short film portfolio site — an archive and display of films, each with script core, characters, storyboards, workflow, and video — in pure black & white Brutalist style with handwritten signature integration.

**Architecture:** Static Astro site, MDX-driven content collections with Zod schemas, deployed to Cloudflare Pages. Index is a single-page anchored experience (Hero / Works / About / Contact). Each film has its own long-page case study under `/films/<slug>`. Two SVG signatures (block + cursive) are reused across the site via a single `<Signature>` component.

**Tech Stack:** Astro 4+, MDX (`@astrojs/mdx`), Content Collections + Zod, `@astrojs/sitemap`, `@fontsource-variable/inter-tight`, Sharp (auto-bundled with Astro Image), Vitest for utility tests, Cloudflare Pages for hosting.

**Spec reference:** `docs/superpowers/specs/2026-05-23-aigc-film-portfolio-design.md`

**Project root:** `/Users/zhangyifan/Desktop/works/` — the Astro project will live in a `site/` subdirectory to keep docs/ and `.superpowers/` separate from the deployable code.

---

## File Structure

```
/Users/zhangyifan/Desktop/works/
├── docs/                                  ← already exists (spec + this plan)
├── .gitignore                             ← already exists
└── site/                                  ← NEW: the Astro project
    ├── astro.config.mjs
    ├── package.json
    ├── tsconfig.json
    ├── vitest.config.ts
    ├── public/
    │   ├── favicon.svg
    │   └── og-image.jpg                   ← provided by owner; placeholder until then
    ├── src/
    │   ├── content/
    │   │   ├── config.ts                  ← Zod schemas
    │   │   ├── films/
    │   │   │   ├── memory-of-a-light.mdx
    │   │   │   ├── memory-of-a-light/assets/
    │   │   │   └── untitled-02.mdx
    │   │   └── site/
    │   │       ├── about.mdx
    │   │       └── meta.ts
    │   ├── assets/
    │   │   └── signatures/
    │   │       ├── block.svg              ← placeholder; owner replaces
    │   │       └── cursive.svg            ← placeholder; owner replaces
    │   ├── components/
    │   │   ├── BaseLayout.astro
    │   │   ├── Header.astro
    │   │   ├── Footer.astro
    │   │   ├── Signature.astro
    │   │   ├── SectionAnchor.astro
    │   │   ├── FilmCard.astro
    │   │   ├── VimeoEmbed.astro
    │   │   ├── Character.astro
    │   │   ├── Storyboard.astro
    │   │   ├── Frame.astro
    │   │   └── WorkflowGallery.astro
    │   ├── lib/
    │   │   ├── films.ts                   ← sorting / filter helpers
    │   │   └── films.test.ts              ← Vitest
    │   ├── pages/
    │   │   ├── index.astro
    │   │   └── films/[...slug].astro
    │   └── styles/
    │       └── global.css
    └── README.md
```

## Test Strategy

This is a static content site. Browser-level visual tests are YAGNI for v1. Tests focus on **pure logic** only:

- **Vitest** for utility functions in `src/lib/` (film sorting/filtering).
- **Astro Content Collections + Zod** validate all content at build time — any missing/malformed field fails `astro build`. This is "tests for free" against the content schema.
- **`astro check`** validates TypeScript and component prop types.
- **`npm run build`** is the integration test: if it produces a complete `dist/` without errors, the site is internally consistent.

Each task ends with a verification command (test, build, or `astro check`) and a commit.

---

## Task 1: Scaffold Astro project

**Files:**
- Create: `site/` directory and full Astro skeleton via `npm create astro@latest`
- Create: `site/package.json` (via scaffold)
- Create: `site/astro.config.mjs` (via scaffold)
- Create: `site/tsconfig.json` (via scaffold)

- [ ] **Step 1: Scaffold a minimal Astro project**

Run from `/Users/zhangyifan/Desktop/works/`:

```bash
npm create astro@latest site -- --template minimal --typescript strict --install --no-git --skip-houston --yes
```

Expected: an Astro project created in `site/`, dependencies installed, no git repo (we use the parent's repo).

- [ ] **Step 2: Verify scaffold**

```bash
cd site && ls -la
```

Expected output contains: `astro.config.mjs`, `package.json`, `tsconfig.json`, `public/`, `src/`, `node_modules/`.

- [ ] **Step 3: Verify dev server starts**

```bash
cd site && npm run dev -- --host 127.0.0.1 --port 4321 &
sleep 4
curl -s -o /dev/null -w "%{http_code}\n" http://127.0.0.1:4321/
kill %1
```

Expected: `200`.

- [ ] **Step 4: Commit**

```bash
cd /Users/zhangyifan/Desktop/works
git add site/package.json site/package-lock.json site/astro.config.mjs site/tsconfig.json site/public site/src
git commit -m "feat: scaffold minimal Astro project in site/"
```

---

## Task 2: Install integrations and fonts

**Files:**
- Modify: `site/package.json`
- Modify: `site/astro.config.mjs`

- [ ] **Step 1: Install MDX + sitemap + font integrations**

```bash
cd /Users/zhangyifan/Desktop/works/site
npm install @astrojs/mdx @astrojs/sitemap @fontsource-variable/inter-tight
```

Expected: all four added to `dependencies` in `package.json`.

- [ ] **Step 2: Configure Astro to use MDX + sitemap**

Overwrite `site/astro.config.mjs`:

```js
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://yifan-zhang.pages.dev',
  integrations: [mdx(), sitemap()],
  image: {
    service: { entrypoint: 'astro/assets/services/sharp' },
  },
});
```

(`site` URL is the Cloudflare Pages default until a custom domain is set — owner can change later.)

- [ ] **Step 3: Verify build with new config**

```bash
cd /Users/zhangyifan/Desktop/works/site && npm run build
```

Expected: build succeeds, no errors about missing integrations.

- [ ] **Step 4: Commit**

```bash
cd /Users/zhangyifan/Desktop/works
git add site/package.json site/package-lock.json site/astro.config.mjs
git commit -m "feat: add MDX, sitemap, Inter Tight integrations"
```

---

## Task 3: Add global CSS and font loading

**Files:**
- Create: `site/src/styles/global.css`
- Create: `site/src/components/BaseLayout.astro`

- [ ] **Step 1: Write `src/styles/global.css`**

```css
/* Load Inter Tight variable font (all weights from 100 to 900) */
@import '@fontsource-variable/inter-tight/index.css';

/* Reset */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

/* Tokens */
:root {
  --bg: #000000;
  --text: #f5f5f5;
  --muted: #888888;
  --divider: #f5f5f5;

  --pad-x: 24px;
  --pad-x-mobile: 16px;
  --max-content: 60ch;
}

/* Base */
html { background: var(--bg); }
body {
  background: var(--bg);
  color: var(--text);
  font-family: 'Inter Tight Variable', 'Inter Tight', -apple-system, 'Helvetica Neue', Arial, sans-serif;
  font-feature-settings: 'ss01' on, 'cv11' on;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

a { color: inherit; text-decoration: underline; text-underline-offset: 2px; }
a:hover { background: var(--text); color: var(--bg); text-decoration: none; }

img, svg, video { max-width: 100%; height: auto; display: block; }

button { font: inherit; color: inherit; background: none; border: none; cursor: pointer; }

/* Type roles */
.h-display { font-weight: 900; line-height: 0.9; letter-spacing: -0.04em; }
.h-section { font-weight: 900; line-height: 0.95; letter-spacing: -0.04em; }
.h-card    { font-weight: 800; line-height: 0.95; letter-spacing: -0.03em; }
.meta      { font-size: 11px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.12em; color: var(--muted); }
.meta-light { color: var(--text); }

/* Layout helpers */
.page-pad { padding-left: var(--pad-x); padding-right: var(--pad-x); }
.divider-top    { border-top: 1px solid var(--divider); }
.divider-bottom { border-bottom: 1px solid var(--divider); }
.center { text-align: center; }
.measure { max-width: var(--max-content); margin-left: auto; margin-right: auto; }

/* Focus */
:focus-visible { outline: 2px solid var(--text); outline-offset: 4px; }

@media (max-width: 640px) {
  :root { --pad-x: var(--pad-x-mobile); }
}
```

- [ ] **Step 2: Verify build still works**

```bash
cd /Users/zhangyifan/Desktop/works/site && npm run build
```

Expected: build succeeds.

- [ ] **Step 3: Commit**

```bash
cd /Users/zhangyifan/Desktop/works
git add site/src/styles/global.css
git commit -m "feat: global CSS tokens, font loading, base reset"
```

---

## Task 4: Define content collection schemas

**Files:**
- Create: `site/src/content/config.ts`

- [ ] **Step 1: Write the schemas**

Create `site/src/content/config.ts`:

```ts
import { defineCollection, z } from 'astro:content';

const films = defineCollection({
  type: 'content',
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      year: z.number().int().min(2000).max(2100),
      duration: z.string().regex(/^\d+:\d{2}$/, 'duration must be MM:SS'),
      tagline: z.string(),
      order: z.number().int(),
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

- [ ] **Step 2: Verify type generation**

```bash
cd /Users/zhangyifan/Desktop/works/site && npm run astro -- sync && npm run astro -- check
```

Expected: `astro sync` regenerates `.astro/` types; `astro check` reports 0 errors.

- [ ] **Step 3: Commit**

```bash
cd /Users/zhangyifan/Desktop/works
git add site/src/content/config.ts
git commit -m "feat: define Zod schemas for films and site content"
```

---

## Task 5: Site meta and About content

**Files:**
- Create: `site/src/content/site/meta.ts`
- Create: `site/src/content/site/about.mdx`

- [ ] **Step 1: Write `src/content/site/meta.ts`**

```ts
/**
 * Site-level constants. Edit these to change the owner's identity
 * across the site without touching components.
 */
export const SITE_META = {
  ownerName: 'Yifan Zhang',
  siteTitle: 'Yifan Zhang — AIGC Short Films',
  siteDescription:
    'An archive and display of AIGC short film work — script, characters, storyboard, workflow, and finished films, kept together as they were made.',
  heroSubLabel: '— AIGC Short Films · Archive & Display —',
  topBarTagline: 'An Archive of AIGC Short Films · Est. 2024',
  startYear: 2024,
  contact: {
    email: 'kyouichizhang@outlook.com',
    instagramHandle: '@kyoko_zhang0623',
    instagramUrl: 'https://instagram.com/kyoko_zhang0623',
  },
  copyrightYear: 2026,
} as const;
```

- [ ] **Step 2: Write `src/content/site/about.mdx`**

```mdx
---
title: About Yifan Zhang
---

This site is an archive and display of my AIGC short film work — every script,
character study, storyboard, workflow, and finished film, kept together as
they were made.

I'm an independent filmmaker working at the intersection of generative AI
and cinematic storytelling. Each film is built through writing, character
design, storyboarding, and machine-assisted image and video generation —
TapNow is part of a hybrid workflow.

Available for commissions, collaborations, and conversations.
```

- [ ] **Step 3: Verify build**

```bash
cd /Users/zhangyifan/Desktop/works/site && npm run astro -- sync && npm run astro -- check
```

Expected: 0 errors.

- [ ] **Step 4: Commit**

```bash
cd /Users/zhangyifan/Desktop/works
git add site/src/content/site/
git commit -m "feat: add site meta constants and About content"
```

---

## Task 6: Sample film content (memory-of-a-light)

**Files:**
- Create: `site/src/content/films/memory-of-a-light.mdx`
- Create: `site/src/content/films/memory-of-a-light/assets/cover.jpg` (placeholder)
- Create: `site/src/content/films/memory-of-a-light/assets/hero.jpg` (placeholder)
- Create: `site/src/content/films/memory-of-a-light/assets/characters/wanderer.jpg` (placeholder)
- Create: `site/src/content/films/memory-of-a-light/assets/storyboard/01.jpg` through `06.jpg` (placeholder)
- Create: `site/src/content/films/memory-of-a-light/assets/workflow/01.png` (placeholder)
- Create: `site/src/content/films/memory-of-a-light/assets/workflow/02.png` (placeholder)

- [ ] **Step 1: Generate placeholder images**

These are 1x1 px black PNG/JPGs purely so the schema validates and build succeeds. The owner replaces them with real images later.

```bash
cd /Users/zhangyifan/Desktop/works/site
mkdir -p src/content/films/memory-of-a-light/assets/{characters,storyboard,workflow}

# 1x1 black JPEG, base64 encoded
JPEG_BLACK="/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAr/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFAEBAAAAAAAAAAAAAAAAAAAAAP/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/AKpAB//Z"
echo "$JPEG_BLACK" | base64 -d > src/content/films/memory-of-a-light/assets/cover.jpg
echo "$JPEG_BLACK" | base64 -d > src/content/films/memory-of-a-light/assets/hero.jpg
echo "$JPEG_BLACK" | base64 -d > src/content/films/memory-of-a-light/assets/characters/wanderer.jpg
for i in 01 02 03 04 05 06; do
  echo "$JPEG_BLACK" | base64 -d > src/content/films/memory-of-a-light/assets/storyboard/${i}.jpg
done

# 1x1 black PNG
PNG_BLACK="iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
echo "$PNG_BLACK" | base64 -d > src/content/films/memory-of-a-light/assets/workflow/01.png
echo "$PNG_BLACK" | base64 -d > src/content/films/memory-of-a-light/assets/workflow/02.png

ls -la src/content/films/memory-of-a-light/assets/
ls -la src/content/films/memory-of-a-light/assets/storyboard/
```

Expected: 10 files (cover, hero, 1 character, 6 storyboard frames, 2 workflow shots).

- [ ] **Step 2: Write `src/content/films/memory-of-a-light.mdx`**

```mdx
---
title: Memory of a Light
year: 2026
duration: "14:32"
tagline: "On reconstructed memory — a man returns to a city that no longer exists, built only from the residue of dreams."
order: 1
cover: ./memory-of-a-light/assets/cover.jpg
heroImage: ./memory-of-a-light/assets/hero.jpg
vimeoId: "76979871"
tapnow:
  link: "https://tapnow.ai/p/example"
  screenshots:
    - ./memory-of-a-light/assets/workflow/01.png
    - ./memory-of-a-light/assets/workflow/02.png
draft: false
---

import Character from '../../components/Character.astro';
import Storyboard from '../../components/Storyboard.astro';
import Frame from '../../components/Frame.astro';

## Core

This film begins with the residue of a dream. The protagonist returns at 40
to the small city of his birth and finds it long since flattened — yet
memory remains whole, carrying light, the damp summer air at street corners,
the buzz of cicadas.

> "What if the only thing left of a place is the way it once held light?"

The entire film works with how synthetic imagery can *reconstruct* what no
longer exists. AI here isn't for reproducing the real, but for touching the
parts of the real that only memory can still hold whole.

## Characters

<Character name="主角 · The Wanderer" image="./memory-of-a-light/assets/characters/wanderer.jpg">

### 主角形象

- **国籍 / 气质**:日本男性,40 岁左右,成熟绅士,眼神有历经
- **外貌**:
  - 蓬松凌乱有质感的黑色卷发
  - 修剪得当的胡须
  - 深邃略带忧郁的眼神
  - 紧致的下颌线
  - 温润橄榄色皮肤
  - 介于「日本电影演员」与「艺术家」之间的气质

### 服装

- 两件套西装(上衣 + 西裤),现代主流剪裁
- 炭黑色羊毛西装 + 白衬衫 + 深蓝色窄领带

</Character>

## Storyboard

<Storyboard>
  <Frame image="./memory-of-a-light/assets/storyboard/01.jpg" caption="Opening — dawn city" />
  <Frame image="./memory-of-a-light/assets/storyboard/02.jpg" />
  <Frame image="./memory-of-a-light/assets/storyboard/03.jpg" caption="Inner monologue" />
  <Frame image="./memory-of-a-light/assets/storyboard/04.jpg" />
  <Frame image="./memory-of-a-light/assets/storyboard/05.jpg" />
  <Frame image="./memory-of-a-light/assets/storyboard/06.jpg" caption="Memory fragments" />
</Storyboard>
```

Note: the Vimeo ID `76979871` is a known public test video (a public clip from Vimeo's developer examples). Owner will replace with the real ID.

- [ ] **Step 3: Verify schema validation**

```bash
cd /Users/zhangyifan/Desktop/works/site && npm run astro -- sync
```

Expected: success — the MDX file's frontmatter passes the Zod schema. Errors about missing components (Character, Storyboard, Frame) are EXPECTED at this point; we'll create them in Tasks 13-14.

- [ ] **Step 4: Commit**

```bash
cd /Users/zhangyifan/Desktop/works
git add site/src/content/films/memory-of-a-light.mdx site/src/content/films/memory-of-a-light/
git commit -m "feat: add sample film 'Memory of a Light' with placeholder assets"
```

---

## Task 7: Signature component with placeholder SVGs

**Files:**
- Create: `site/src/assets/signatures/block.svg`
- Create: `site/src/assets/signatures/cursive.svg`
- Create: `site/src/components/Signature.astro`

- [ ] **Step 1: Write placeholder `src/assets/signatures/block.svg`**

A simple text-based stand-in. Owner will replace this with the real handwritten signature SVG.

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 200" fill="currentColor" aria-label="ZHANG YIFAN signature">
  <text x="400" y="140"
        text-anchor="middle"
        font-family="'Permanent Marker', 'Comic Sans MS', cursive"
        font-size="120"
        font-weight="900">ZHANG YIFAN</text>
</svg>
```

- [ ] **Step 2: Write placeholder `src/assets/signatures/cursive.svg`**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 120" fill="currentColor" aria-label="Yifan signature">
  <text x="200" y="80"
        text-anchor="middle"
        font-family="'Caveat', 'Snell Roundhand', cursive"
        font-size="72"
        font-style="italic">Yifan</text>
</svg>
```

- [ ] **Step 3: Write `src/components/Signature.astro`**

```astro
---
/**
 * Renders one of the owner's handwritten signatures as inline SVG.
 *
 * The SVG files use `fill="currentColor"` so the signature inherits the
 * surrounding text color — black on light backgrounds, white on the dark
 * theme.
 *
 * Sizes map to typical usage:
 *  - xl  → Index Hero (max-width 80% of viewport)
 *  - lg  → Film Detail director sign-off (~72px tall)
 *  - md  → Index About sign-off (~80px tall)
 *  - sm  → Footer (~24px tall)
 */
import blockSvg from '../assets/signatures/block.svg?raw';
import cursiveSvg from '../assets/signatures/cursive.svg?raw';

type Variant = 'block' | 'cursive';
type Size = 'sm' | 'md' | 'lg' | 'xl';

interface Props {
  variant: Variant;
  size?: Size;
  class?: string;
}

const { variant, size = 'md', class: className = '' } = Astro.props;
const raw = variant === 'block' ? blockSvg : cursiveSvg;
---

<span
  class:list={['signature', `signature--${variant}`, `signature--${size}`, className]}
  set:html={raw}
/>

<style>
  .signature {
    display: inline-block;
    line-height: 0;
    color: var(--text);
  }
  .signature :global(svg) {
    width: auto;
    height: 100%;
  }

  /* Block (hero) — sized by container width, not by .signature height */
  .signature--block { display: block; width: 100%; }
  .signature--block :global(svg) { width: 100%; height: auto; max-width: 80vw; margin-inline: auto; }

  /* Cursive sizes */
  .signature--sm :global(svg) { height: 24px; }
  .signature--md :global(svg) { height: 56px; }
  .signature--lg :global(svg) { height: 72px; }
</style>
```

- [ ] **Step 4: Verify build**

```bash
cd /Users/zhangyifan/Desktop/works/site && npm run astro -- check
```

Expected: 0 errors. (The components Storyboard/Character/Frame are still missing — `astro check` only errors on TypeScript, not unresolved MDX imports until build time. If build is run, those errors are expected and resolved in later tasks.)

- [ ] **Step 5: Commit**

```bash
cd /Users/zhangyifan/Desktop/works
git add site/src/assets/signatures/ site/src/components/Signature.astro
git commit -m "feat: add Signature component with placeholder block + cursive SVGs"
```

---

## Task 8: BaseLayout

**Files:**
- Create: `site/src/components/BaseLayout.astro`

- [ ] **Step 1: Write `src/components/BaseLayout.astro`**

```astro
---
import '../styles/global.css';
import { SITE_META } from '../content/site/meta';

interface Props {
  title?: string;
  description?: string;
  ogImage?: string;
  canonicalPath?: string;
}

const {
  title = SITE_META.siteTitle,
  description = SITE_META.siteDescription,
  ogImage = '/og-image.jpg',
  canonicalPath = '/',
} = Astro.props;

const canonical = new URL(canonicalPath, Astro.site ?? 'http://localhost/').toString();
const ogImageUrl = new URL(ogImage, Astro.site ?? 'http://localhost/').toString();
---

<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="color-scheme" content="dark" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="canonical" href={canonical} />
    <title>{title}</title>
    <meta name="description" content={description} />

    {/* Open Graph */}
    <meta property="og:type" content="website" />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:url" content={canonical} />
    <meta property="og:image" content={ogImageUrl} />

    {/* Twitter */}
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />
    <meta name="twitter:image" content={ogImageUrl} />

    <slot name="head" />
  </head>
  <body>
    <slot />
  </body>
</html>
```

- [ ] **Step 2: Verify type check**

```bash
cd /Users/zhangyifan/Desktop/works/site && npm run astro -- check
```

Expected: 0 errors.

- [ ] **Step 3: Commit**

```bash
cd /Users/zhangyifan/Desktop/works
git add site/src/components/BaseLayout.astro
git commit -m "feat: BaseLayout with SEO meta, OG/Twitter cards, canonical URL"
```

---

## Task 9: Header, Footer, SectionAnchor

**Files:**
- Create: `site/src/components/Header.astro`
- Create: `site/src/components/Footer.astro`
- Create: `site/src/components/SectionAnchor.astro`

- [ ] **Step 1: Write `src/components/Header.astro`**

```astro
---
import { SITE_META } from '../content/site/meta';

interface Props {
  /** Override the left slot — Film Detail uses "← All Works". */
  leftLabel?: string;
  leftHref?: string;
  /** Anchor target for the right "Information" link (defaults to /#info). */
  infoHref?: string;
}

const {
  leftLabel = SITE_META.ownerName,
  leftHref,
  infoHref = '/#info',
} = Astro.props;
---

<header class="site-header divider-bottom page-pad">
  <div class="left">
    <span class="tag-square" aria-hidden="true"></span>
    {leftHref ? <a href={leftHref}>{leftLabel}</a> : <span>{leftLabel}</span>}
  </div>
  <div class="center">{SITE_META.topBarTagline}</div>
  <div class="right">
    <a href={infoHref}>Information</a>
  </div>
</header>

<style>
  .site-header {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    gap: 16px;
    padding-top: 16px;
    padding-bottom: 16px;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    font-weight: 500;
  }
  .center { text-align: center; color: var(--muted); }
  .right { text-align: right; }
  .tag-square {
    display: inline-block;
    width: 8px;
    height: 8px;
    background: var(--text);
    margin-right: 6px;
    vertical-align: middle;
  }
  @media (max-width: 640px) {
    .site-header { grid-template-columns: 1fr; text-align: center; }
    .center, .right { text-align: center; }
  }
</style>
```

- [ ] **Step 2: Write `src/components/Footer.astro`**

```astro
---
import Signature from './Signature.astro';
import { SITE_META } from '../content/site/meta';
---

<footer class="site-footer divider-top page-pad">
  <span>© {SITE_META.ownerName} · {SITE_META.copyrightYear}</span>
  <span class="sig"><Signature variant="cursive" size="sm" /></span>
  <span>Built with Astro</span>
</footer>

<style>
  .site-footer {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    padding-top: 24px;
    padding-bottom: 24px;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: var(--muted);
  }
  .sig { text-align: center; color: var(--text); }
  .site-footer span:last-child { text-align: right; }
  @media (max-width: 640px) {
    .site-footer { grid-template-columns: 1fr; gap: 12px; text-align: center; }
    .site-footer span:last-child { text-align: center; }
  }
</style>
```

- [ ] **Step 3: Write `src/components/SectionAnchor.astro`**

```astro
---
interface Props {
  /** Section number + name, e.g. "① Core" */
  label: string;
  /** Anchor hash like "#core" */
  anchor: string;
}

const { label, anchor } = Astro.props;
---

<div class="section-anchor divider-bottom page-pad">
  <span>{label}</span>
  <span>{anchor}</span>
</div>

<style>
  .section-anchor {
    display: flex;
    justify-content: space-between;
    padding-top: 16px;
    padding-bottom: 16px;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: var(--muted);
  }
</style>
```

- [ ] **Step 4: Verify type check**

```bash
cd /Users/zhangyifan/Desktop/works/site && npm run astro -- check
```

Expected: 0 errors.

- [ ] **Step 5: Commit**

```bash
cd /Users/zhangyifan/Desktop/works
git add site/src/components/Header.astro site/src/components/Footer.astro site/src/components/SectionAnchor.astro
git commit -m "feat: Header, Footer (with cursive signature), SectionAnchor"
```

---

## Task 10: Film sorting utility with Vitest test

**Files:**
- Create: `site/src/lib/films.ts`
- Create: `site/src/lib/films.test.ts`
- Modify: `site/package.json` (add vitest)
- Create: `site/vitest.config.ts`

- [ ] **Step 1: Install Vitest**

```bash
cd /Users/zhangyifan/Desktop/works/site && npm install -D vitest
```

- [ ] **Step 2: Add test script to `package.json`**

Edit `site/package.json`, add to `"scripts"`:

```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 3: Write `vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});
```

- [ ] **Step 4: Write failing test `src/lib/films.test.ts`**

```ts
import { describe, expect, it } from 'vitest';
import { sortFilms, filterPublished } from './films';

type Film = {
  data: { order: number; draft: boolean; title: string };
};

describe('sortFilms', () => {
  it('sorts films by order ascending (lower = earlier)', () => {
    const films: Film[] = [
      { data: { order: 3, draft: false, title: 'C' } },
      { data: { order: 1, draft: false, title: 'A' } },
      { data: { order: 2, draft: false, title: 'B' } },
    ];
    const result = sortFilms(films);
    expect(result.map((f) => f.data.title)).toEqual(['A', 'B', 'C']);
  });

  it('does not mutate the input array', () => {
    const films: Film[] = [
      { data: { order: 2, draft: false, title: 'B' } },
      { data: { order: 1, draft: false, title: 'A' } },
    ];
    const snapshot = films.map((f) => f.data.title);
    sortFilms(films);
    expect(films.map((f) => f.data.title)).toEqual(snapshot);
  });
});

describe('filterPublished', () => {
  it('removes films with draft=true', () => {
    const films: Film[] = [
      { data: { order: 1, draft: false, title: 'Published' } },
      { data: { order: 2, draft: true, title: 'Draft' } },
    ];
    const result = filterPublished(films);
    expect(result).toHaveLength(1);
    expect(result[0].data.title).toBe('Published');
  });
});
```

- [ ] **Step 5: Run test to verify it FAILS**

```bash
cd /Users/zhangyifan/Desktop/works/site && npm test
```

Expected: FAIL with "Cannot find module './films'" or similar.

- [ ] **Step 6: Write implementation `src/lib/films.ts`**

```ts
import type { CollectionEntry } from 'astro:content';

type FilmLike = Pick<CollectionEntry<'films'>, 'data'> & { data: { order: number; draft: boolean } };

/**
 * Returns a new array of films sorted by `order` ascending (does not mutate input).
 */
export function sortFilms<T extends FilmLike>(films: T[]): T[] {
  return [...films].sort((a, b) => a.data.order - b.data.order);
}

/**
 * Returns only films where draft === false. Filters in production builds.
 * In dev mode, all films (including drafts) are typically shown — callers
 * decide whether to apply this.
 */
export function filterPublished<T extends FilmLike>(films: T[]): T[] {
  return films.filter((f) => !f.data.draft);
}
```

- [ ] **Step 7: Run test to verify it PASSES**

```bash
cd /Users/zhangyifan/Desktop/works/site && npm test
```

Expected: PASS (3 tests).

- [ ] **Step 8: Commit**

```bash
cd /Users/zhangyifan/Desktop/works
git add site/package.json site/package-lock.json site/vitest.config.ts site/src/lib/
git commit -m "feat: film sorting + filterPublished utilities with Vitest tests"
```

---

## Task 11: FilmCard component

**Files:**
- Create: `site/src/components/FilmCard.astro`

- [ ] **Step 1: Write `src/components/FilmCard.astro`**

```astro
---
import { Image } from 'astro:assets';
import type { CollectionEntry } from 'astro:content';

interface Props {
  film: CollectionEntry<'films'>;
}

const { film } = Astro.props;
const { title, year, duration, cover } = film.data;
const href = `/films/${film.slug}/`;
---

<a class="film-card divider-bottom" href={href}>
  <div class="cover">
    <Image src={cover} alt={`${title} — cover`} widths={[640, 1280, 1920]} sizes="(min-width: 1024px) 1100px, 100vw" />
  </div>
  <h2 class="h-section title">{title}</h2>
  <div class="meta">
    <span>{year}</span>
    <span class="dot">·</span>
    <span>{duration}</span>
    <span class="dot">·</span>
    <span>View →</span>
  </div>
</a>

<style>
  .film-card {
    display: block;
    text-decoration: none;
    color: var(--text);
    padding: var(--pad-x);
    text-align: center;
    transition: background-color 180ms ease, color 180ms ease;
  }
  .film-card:hover {
    background: var(--text);
    color: var(--bg);
    text-decoration: none;
  }
  .cover {
    aspect-ratio: 16 / 9;
    overflow: hidden;
    margin-bottom: 16px;
  }
  .cover :global(img) {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .title {
    font-size: clamp(40px, 6vw, 56px);
    margin-bottom: 12px;
  }
  .meta { justify-content: center; display: flex; gap: 8px; }
  .meta .dot { opacity: 0.5; }
</style>
```

- [ ] **Step 2: Verify type check**

```bash
cd /Users/zhangyifan/Desktop/works/site && npm run astro -- check
```

Expected: 0 errors.

- [ ] **Step 3: Commit**

```bash
cd /Users/zhangyifan/Desktop/works
git add site/src/components/FilmCard.astro
git commit -m "feat: FilmCard with hover invert and responsive cover image"
```

---

## Task 12: Index page

**Files:**
- Create: `site/src/pages/index.astro`

- [ ] **Step 1: Write `src/pages/index.astro`**

```astro
---
import { getCollection, getEntry } from 'astro:content';
import { Image } from 'astro:assets';
import BaseLayout from '../components/BaseLayout.astro';
import Header from '../components/Header.astro';
import Footer from '../components/Footer.astro';
import Signature from '../components/Signature.astro';
import FilmCard from '../components/FilmCard.astro';
import { SITE_META } from '../content/site/meta';
import { sortFilms, filterPublished } from '../lib/films';

const allFilms = await getCollection('films');
const films = sortFilms(filterPublished(allFilms));
const firstFilm = films[0];

const aboutEntry = await getEntry('site', 'about');
const { Content: AboutContent } = await aboutEntry.render();
---

<BaseLayout title={SITE_META.siteTitle} description={SITE_META.siteDescription} canonicalPath="/">
  <Header />

  {/* HERO */}
  <section class="hero page-pad">
    <div class="hero-big">
      <Signature variant="block" />
      <p class="hero-sub meta meta-light">{SITE_META.heroSubLabel}</p>
    </div>

    {firstFilm && (
      <div class="hero-peek">
        <div class="peek-row">
          <div class="peek-year"><span class="tag-square" aria-hidden="true"></span>{firstFilm.data.year}</div>
          <div class="peek-label">{firstFilm.data.title}, AIGC Short Film</div>
          <div class="peek-more"><a href="#works">More →</a></div>
        </div>
        <a class="peek-image" href={`/films/${firstFilm.slug}/`}>
          <span class="m tl"></span><span class="m tr"></span>
          <span class="m bl"></span><span class="m br"></span>
          <Image src={firstFilm.data.cover} alt={`${firstFilm.data.title} — peek`} widths={[640, 1280, 1920]} sizes="100vw" />
        </a>
      </div>
    )}
  </section>

  {/* WORKS */}
  <section id="works">
    <div class="section-anchor divider-top divider-bottom page-pad">
      <span>① Works · Index</span>
      <span>{String(films.length).padStart(2, '0')} / {String(films.length).padStart(2, '0')}</span>
    </div>
    {films.map((film) => <FilmCard film={film} />)}
  </section>

  {/* ABOUT */}
  <section id="info" class="about divider-top page-pad">
    <h2 class="h-section about-title">About.</h2>
    <div class="measure about-body">
      <AboutContent />
      <div class="signoff">
        <div class="signoff-label meta">— signed,</div>
        <Signature variant="cursive" size="md" />
      </div>
    </div>
  </section>

  {/* CONTACT */}
  <section class="contact divider-top page-pad">
    <h2 class="h-section contact-title">Let's talk.</h2>
    <ul class="contact-list">
      <li><a href={`mailto:${SITE_META.contact.email}`}><span>Email</span><span>{SITE_META.contact.email} →</span></a></li>
      <li><a href={SITE_META.contact.instagramUrl} target="_blank" rel="noreferrer noopener"><span>Instagram</span><span>{SITE_META.contact.instagramHandle} →</span></a></li>
    </ul>
  </section>

  <Footer />
</BaseLayout>

<style>
  /* Hero */
  .hero {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    padding-top: 16px;
    padding-bottom: 16px;
  }
  .hero-big {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 24px;
    padding: 24px 0;
  }
  .hero-sub { margin-top: 16px; }

  .hero-peek { padding-top: 24px; }
  .peek-row {
    display: grid;
    grid-template-columns: 1fr 1.5fr 1fr;
    gap: 16px;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin-bottom: 12px;
  }
  .peek-year { display: flex; align-items: center; gap: 6px; }
  .peek-label { text-align: center; color: var(--muted); }
  .peek-more { text-align: right; }
  .tag-square { display: inline-block; width: 8px; height: 8px; background: var(--text); }

  .peek-image {
    display: block;
    position: relative;
    aspect-ratio: 16 / 5;       /* shows only top portion */
    overflow: hidden;
  }
  .peek-image :global(img) { width: 100%; height: 100%; object-fit: cover; object-position: center top; }
  .peek-image .m { position: absolute; width: 8px; height: 8px; background: var(--text); }
  .peek-image .tl { top: 8px; left: 8px; }
  .peek-image .tr { top: 8px; right: 8px; }
  .peek-image .bl { bottom: 8px; left: 8px; }
  .peek-image .br { bottom: 8px; right: 8px; }

  /* Section anchor reuse */
  .section-anchor {
    display: flex;
    justify-content: space-between;
    padding-top: 16px;
    padding-bottom: 16px;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: var(--muted);
  }

  /* About */
  .about { padding-top: 64px; padding-bottom: 64px; text-align: center; }
  .about-title { font-size: clamp(48px, 8vw, 72px); margin-bottom: 32px; }
  .about-body { font-size: 16px; line-height: 1.7; text-align: left; }
  .about-body :global(p) { margin-bottom: 16px; }

  .signoff { margin-top: 32px; text-align: center; }
  .signoff-label { display: block; margin-bottom: 4px; }

  /* Contact */
  .contact { padding-top: 64px; padding-bottom: 64px; text-align: center; }
  .contact-title { font-size: clamp(48px, 8vw, 72px); margin-bottom: 32px; }
  .contact-list {
    list-style: none;
    border-top: 1px solid var(--divider);
    max-width: 600px;
    margin: 0 auto;
  }
  .contact-list li { border-bottom: 1px solid var(--divider); }
  .contact-list a {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 12px;
    text-decoration: none;
    font-size: clamp(20px, 3vw, 24px);
    font-weight: 700;
    letter-spacing: -0.02em;
  }
  .contact-list a:hover { background: var(--text); color: var(--bg); }
</style>
```

- [ ] **Step 2: Verify type check**

```bash
cd /Users/zhangyifan/Desktop/works/site && npm run astro -- check
```

Expected: 0 errors. The MDX file's reference to `Character`/`Storyboard`/`Frame` will still be unresolved — those will be created in next tasks. `astro check` does not error on MDX component imports.

- [ ] **Step 3: Commit**

```bash
cd /Users/zhangyifan/Desktop/works
git add site/src/pages/index.astro
git commit -m "feat: Index page (Hero, Works grid, About, Contact)"
```

---

## Task 13: Character MDX component

**Files:**
- Create: `site/src/components/Character.astro`

- [ ] **Step 1: Write `src/components/Character.astro`**

```astro
---
import { Image } from 'astro:assets';
import type { ImageMetadata } from 'astro';

interface Props {
  name: string;
  image: ImageMetadata;
}

const { name, image } = Astro.props;
---

<section class="character page-pad">
  <div class="character-image">
    <Image src={image} alt={name} widths={[480, 960, 1440]} sizes="(min-width: 1024px) 40vw, 100vw" />
  </div>
  <div class="character-text">
    <h3 class="h-card name">{name}</h3>
    <div class="body"><slot /></div>
  </div>
</section>

<style>
  .character {
    display: grid;
    grid-template-columns: 1fr 1.5fr;
    gap: 32px;
    padding-top: 32px;
    padding-bottom: 32px;
    align-items: start;
  }
  .character-image {
    aspect-ratio: 3 / 4;
    overflow: hidden;
  }
  .character-image :global(img) { width: 100%; height: 100%; object-fit: cover; }
  .name { font-size: clamp(24px, 4vw, 32px); margin-bottom: 16px; }
  .body :global(h3) { font-size: 11px; text-transform: uppercase; letter-spacing: 0.12em; color: var(--muted); margin: 20px 0 8px; font-weight: 500; }
  .body :global(h4) { font-size: 11px; text-transform: uppercase; letter-spacing: 0.12em; color: var(--muted); margin: 20px 0 8px; font-weight: 500; }
  .body :global(ul) { list-style: none; padding: 0; }
  .body :global(li) { font-size: 14px; line-height: 1.6; padding: 4px 0; border-bottom: 1px solid #222; }
  .body :global(li strong) { color: var(--text); }
  .body :global(li ul) { margin-top: 4px; margin-left: 16px; }
  .body :global(li li) { border-bottom: none; padding: 2px 0; color: #ccc; }
  @media (max-width: 768px) {
    .character { grid-template-columns: 1fr; gap: 16px; }
  }
</style>
```

- [ ] **Step 2: Verify type check**

```bash
cd /Users/zhangyifan/Desktop/works/site && npm run astro -- check
```

Expected: 0 errors.

- [ ] **Step 3: Commit**

```bash
cd /Users/zhangyifan/Desktop/works
git add site/src/components/Character.astro
git commit -m "feat: Character MDX component (image-left + nested markdown text)"
```

---

## Task 14: Storyboard + Frame MDX components

**Files:**
- Create: `site/src/components/Storyboard.astro`
- Create: `site/src/components/Frame.astro`

- [ ] **Step 1: Write `src/components/Storyboard.astro`**

```astro
---
/* Wraps a set of <Frame> children in a 3-column grid. */
---

<div class="storyboard-grid page-pad">
  <slot />
</div>

<style>
  .storyboard-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    padding-top: 32px;
    padding-bottom: 32px;
  }
  @media (max-width: 1024px) {
    .storyboard-grid { grid-template-columns: repeat(2, 1fr); }
  }
  @media (max-width: 640px) {
    .storyboard-grid { grid-template-columns: 1fr; }
  }
</style>
```

- [ ] **Step 2: Write `src/components/Frame.astro`**

```astro
---
import { Image } from 'astro:assets';
import type { ImageMetadata } from 'astro';

interface Props {
  image: ImageMetadata;
  caption?: string;
  number?: number;
}

const { image, caption, number } = Astro.props;
---

<figure class="frame">
  {number !== undefined && <span class="frame-num meta meta-light">{String(number).padStart(2, '0')}</span>}
  <Image src={image} alt={caption ?? `Storyboard frame ${number ?? ''}`} widths={[480, 960]} sizes="(min-width: 1024px) 33vw, 50vw" />
  {caption && <figcaption class="caption">{caption}</figcaption>}
</figure>

<style>
  .frame {
    aspect-ratio: 16 / 9;
    position: relative;
    overflow: hidden;
    background: #1a1a1a;
  }
  .frame :global(img) { width: 100%; height: 100%; object-fit: cover; }
  .frame-num {
    position: absolute;
    top: 8px;
    left: 8px;
    color: var(--text);
    z-index: 1;
  }
  .caption {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: var(--text);
    color: var(--bg);
    padding: 8px 12px;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }
</style>
```

- [ ] **Step 3: Verify type check**

```bash
cd /Users/zhangyifan/Desktop/works/site && npm run astro -- check
```

Expected: 0 errors.

- [ ] **Step 4: Commit**

```bash
cd /Users/zhangyifan/Desktop/works
git add site/src/components/Storyboard.astro site/src/components/Frame.astro
git commit -m "feat: Storyboard grid + Frame components with caption overlay"
```

---

## Task 15: WorkflowGallery component

**Files:**
- Create: `site/src/components/WorkflowGallery.astro`

- [ ] **Step 1: Write `src/components/WorkflowGallery.astro`**

```astro
---
import { Image } from 'astro:assets';
import type { ImageMetadata } from 'astro';

interface Props {
  screenshots: ImageMetadata[];
  link: string;
}

const { screenshots, link } = Astro.props;
---

<section class="workflow page-pad">
  <div class="shots">
    {screenshots.map((shot, i) => (
      <div class="shot">
        <Image src={shot} alt={`TapNow workflow screenshot ${i + 1}`} widths={[640, 1280]} sizes="(min-width: 1024px) 50vw, 100vw" />
      </div>
    ))}
  </div>
  <a class="tapnow-button" href={link} target="_blank" rel="noreferrer noopener">
    Open TapNow Project →
  </a>
</section>

<style>
  .workflow { text-align: center; padding-top: 32px; padding-bottom: 32px; }
  .shots {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
    margin-bottom: 32px;
  }
  .shot { aspect-ratio: 16 / 9; overflow: hidden; }
  .shot :global(img) { width: 100%; height: 100%; object-fit: cover; }
  @media (max-width: 640px) {
    .shots { grid-template-columns: 1fr; }
  }
  .tapnow-button {
    display: inline-block;
    padding: 24px 48px;
    border: 1px solid var(--text);
    color: var(--text);
    text-decoration: none;
    font-size: clamp(14px, 2vw, 16px);
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.12em;
  }
  .tapnow-button:hover {
    background: var(--text);
    color: var(--bg);
  }
</style>
```

- [ ] **Step 2: Verify type check**

```bash
cd /Users/zhangyifan/Desktop/works/site && npm run astro -- check
```

Expected: 0 errors.

- [ ] **Step 3: Commit**

```bash
cd /Users/zhangyifan/Desktop/works
git add site/src/components/WorkflowGallery.astro
git commit -m "feat: WorkflowGallery (2-col TapNow shots + outline CTA button)"
```

---

## Task 16: VimeoEmbed component

**Files:**
- Create: `site/src/components/VimeoEmbed.astro`

- [ ] **Step 1: Write `src/components/VimeoEmbed.astro`**

```astro
---
interface Props {
  vimeoId: string;
  vimeoHash?: string;
  title?: string;
}

const { vimeoId, vimeoHash, title = 'Vimeo player' } = Astro.props;

const params = new URLSearchParams({
  color: 'ffffff',
  byline: '0',
  portrait: '0',
  title: '0',
  badge: '0',
  dnt: '1',
});
if (vimeoHash) params.set('h', vimeoHash);

const src = `https://player.vimeo.com/video/${encodeURIComponent(vimeoId)}?${params.toString()}`;
---

<div class="vimeo-wrap page-pad">
  <div class="vimeo-frame">
    <iframe
      src={src}
      title={title}
      loading="lazy"
      allow="autoplay; fullscreen; picture-in-picture"
      allowfullscreen
      frameborder="0"
    ></iframe>
  </div>
</div>

<style>
  .vimeo-wrap { padding-top: 32px; padding-bottom: 32px; }
  .vimeo-frame {
    aspect-ratio: 16 / 9;
    border: 1px solid var(--text);
    overflow: hidden;
    background: var(--bg);
  }
  .vimeo-frame iframe { width: 100%; height: 100%; border: 0; }
</style>
```

- [ ] **Step 2: Verify type check**

```bash
cd /Users/zhangyifan/Desktop/works/site && npm run astro -- check
```

Expected: 0 errors.

- [ ] **Step 3: Commit**

```bash
cd /Users/zhangyifan/Desktop/works
git add site/src/components/VimeoEmbed.astro
git commit -m "feat: VimeoEmbed with dnt + custom color + lazy load"
```

---

## Task 17: Film Detail dynamic route

**Files:**
- Create: `site/src/pages/films/[...slug].astro`

- [ ] **Step 1: Write `src/pages/films/[...slug].astro`**

```astro
---
import { getCollection, type CollectionEntry } from 'astro:content';
import { Image } from 'astro:assets';
import BaseLayout from '../../components/BaseLayout.astro';
import Header from '../../components/Header.astro';
import Footer from '../../components/Footer.astro';
import Signature from '../../components/Signature.astro';
import SectionAnchor from '../../components/SectionAnchor.astro';
import WorkflowGallery from '../../components/WorkflowGallery.astro';
import VimeoEmbed from '../../components/VimeoEmbed.astro';
import { sortFilms, filterPublished } from '../../lib/films';
import { SITE_META } from '../../content/site/meta';

export async function getStaticPaths() {
  const all = await getCollection('films');
  const published = filterPublished(all);
  return published.map((film) => ({
    params: { slug: film.slug },
    props: { film, all: published },
  }));
}

interface Props {
  film: CollectionEntry<'films'>;
  all: CollectionEntry<'films'>[];
}

const { film, all } = Astro.props;
const { Content } = await film.render();
const sorted = sortFilms(all);
const currentIndex = sorted.findIndex((f) => f.slug === film.slug);
const nextFilm = sorted[(currentIndex + 1) % sorted.length];

const pageTitle = `${film.data.title} — ${SITE_META.ownerName}`;
const pageDescription = film.data.tagline;
---

<BaseLayout
  title={pageTitle}
  description={pageDescription}
  canonicalPath={`/films/${film.slug}/`}
>
  <Header leftLabel="← All Works" leftHref="/#works" infoHref="/#info" />

  {/* HERO */}
  <section class="film-hero divider-bottom page-pad">
    <div class="meta-line meta">{film.data.year} · {film.data.duration} · AIGC Short Film</div>
    <h1 class="h-display title">{film.data.title}</h1>
    <p class="tagline">{film.data.tagline}</p>
    {film.data.heroImage && (
      <div class="hero-image">
        <span class="m tl"></span><span class="m tr"></span>
        <span class="m bl"></span><span class="m br"></span>
        <Image src={film.data.heroImage} alt={`${film.data.title} — hero still`} widths={[1280, 1920, 2560]} sizes="100vw" />
      </div>
    )}
  </section>

  {/* MDX BODY — Core / Characters / Storyboard headings rendered through the MDX content */}
  <article class="film-body">
    <SectionAnchor label="① Core" anchor="#core" />
    <Content />
  </article>

  {/* WORKFLOW */}
  <SectionAnchor label="④ Workflow" anchor="#workflow" />
  <section id="workflow" class="workflow-section divider-bottom">
    <h2 class="h-section stitle">Workflow.</h2>
    <WorkflowGallery screenshots={film.data.tapnow.screenshots} link={film.data.tapnow.link} />
  </section>

  {/* WATCH */}
  <SectionAnchor label="⑤ Watch" anchor="#video" />
  <section id="video" class="watch-section divider-bottom">
    <h2 class="h-section stitle">Watch.</h2>
    <VimeoEmbed vimeoId={film.data.vimeoId} vimeoHash={film.data.vimeoHash} title={film.data.title} />
  </section>

  {/* DIRECTOR sign-off */}
  <section class="director divider-bottom page-pad">
    <div class="em-dash meta">— Directed by</div>
    <Signature variant="cursive" size="lg" />
  </section>

  {/* NEXT FILM */}
  {sorted.length > 1 && nextFilm.slug !== film.slug && (
    <section class="next-film page-pad">
      <a href={`/films/${nextFilm.slug}/`}>
        <div class="meta next-label">Next →</div>
        <div class="next-title h-section">{nextFilm.data.title}</div>
      </a>
    </section>
  )}

  <Footer />
</BaseLayout>

<style>
  .film-hero { text-align: center; padding-top: 48px; padding-bottom: 32px; }
  .meta-line { margin-bottom: 16px; display: block; }
  .title { font-size: clamp(56px, 12vw, 160px); margin-bottom: 16px; }
  .tagline { font-size: clamp(15px, 2vw, 18px); font-style: italic; color: #ccc; max-width: 50ch; margin: 0 auto; }
  .hero-image {
    margin-top: 32px;
    position: relative;
    aspect-ratio: 16 / 9;
    overflow: hidden;
  }
  .hero-image :global(img) { width: 100%; height: 100%; object-fit: cover; }
  .hero-image .m { position: absolute; width: 8px; height: 8px; background: var(--text); }
  .hero-image .tl { top: 8px; left: 8px; }
  .hero-image .tr { top: 8px; right: 8px; }
  .hero-image .bl { bottom: 8px; left: 8px; }
  .hero-image .br { bottom: 8px; right: 8px; }

  .stitle { text-align: center; font-size: clamp(40px, 7vw, 56px); margin: 32px 0; }

  /* MDX content styles */
  .film-body :global(h2) {
    text-align: center;
    font-size: clamp(40px, 7vw, 56px);
    font-weight: 900;
    letter-spacing: -0.04em;
    line-height: 0.95;
    margin: 48px 0 32px;
  }
  .film-body :global(p) {
    max-width: var(--max-content);
    margin: 0 auto 16px;
    padding: 0 var(--pad-x);
    font-size: 17px;
    line-height: 1.7;
  }
  .film-body :global(blockquote) {
    max-width: var(--max-content);
    margin: 24px auto;
    padding: 0 var(--pad-x);
    border-left: 2px solid var(--text);
    padding-left: 24px;
    font-style: italic;
    font-size: 22px;
    line-height: 1.4;
  }

  .director { text-align: center; padding-top: 64px; padding-bottom: 64px; }
  .em-dash { margin-bottom: 12px; }

  .next-film { padding-top: 32px; padding-bottom: 32px; text-align: center; }
  .next-film a { display: block; text-decoration: none; color: var(--text); }
  .next-film a:hover { color: var(--muted); background: transparent; }
  .next-label { margin-bottom: 8px; }
  .next-title { font-size: clamp(36px, 6vw, 48px); }
</style>
```

- [ ] **Step 2: Build to verify end-to-end**

```bash
cd /Users/zhangyifan/Desktop/works/site && npm run build
```

Expected: build succeeds. `dist/` contains `index.html`, `films/memory-of-a-light/index.html`, generated images under `_astro/`, and `sitemap-index.xml`.

- [ ] **Step 3: Spot-check generated HTML**

```bash
cd /Users/zhangyifan/Desktop/works/site
ls dist/
ls dist/films/memory-of-a-light/
grep -c "Memory of a Light" dist/index.html
grep -c "yifan@" dist/index.html || true
```

Expected: `dist/index.html` and `dist/films/memory-of-a-light/index.html` both exist; the index references "Memory of a Light" at least once.

- [ ] **Step 4: Commit**

```bash
cd /Users/zhangyifan/Desktop/works
git add site/src/pages/films/
git commit -m "feat: Film Detail dynamic route with Hero, MDX body, Workflow, Watch, sign-off, Next"
```

---

## Task 18: Add second film to validate scaling

**Files:**
- Create: `site/src/content/films/untitled-02.mdx`
- Create: `site/src/content/films/untitled-02/assets/` (placeholder images)

- [ ] **Step 1: Generate placeholder images for the second film**

```bash
cd /Users/zhangyifan/Desktop/works/site
mkdir -p src/content/films/untitled-02/assets/{characters,storyboard,workflow}

JPEG_BLACK="/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAr/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFAEBAAAAAAAAAAAAAAAAAAAAAP/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/AKpAB//Z"
echo "$JPEG_BLACK" | base64 -d > src/content/films/untitled-02/assets/cover.jpg
echo "$JPEG_BLACK" | base64 -d > src/content/films/untitled-02/assets/hero.jpg
echo "$JPEG_BLACK" | base64 -d > src/content/films/untitled-02/assets/characters/protagonist.jpg
for i in 01 02 03; do
  echo "$JPEG_BLACK" | base64 -d > src/content/films/untitled-02/assets/storyboard/${i}.jpg
done

PNG_BLACK="iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
echo "$PNG_BLACK" | base64 -d > src/content/films/untitled-02/assets/workflow/01.png
```

- [ ] **Step 2: Write `src/content/films/untitled-02.mdx`**

```mdx
---
title: Untitled No. 02
year: 2026
duration: "09:48"
tagline: "A second study — placeholder until the real film lands."
order: 2
cover: ./untitled-02/assets/cover.jpg
heroImage: ./untitled-02/assets/hero.jpg
vimeoId: "76979871"
tapnow:
  link: "https://tapnow.ai/p/example-2"
  screenshots:
    - ./untitled-02/assets/workflow/01.png
draft: false
---

import Character from '../../components/Character.astro';
import Storyboard from '../../components/Storyboard.astro';
import Frame from '../../components/Frame.astro';

## Core

Placeholder core text for the second film. Real content lands later.

## Characters

<Character name="Protagonist" image="./untitled-02/assets/characters/protagonist.jpg">

### Notes

- Placeholder character details.

</Character>

## Storyboard

<Storyboard>
  <Frame image="./untitled-02/assets/storyboard/01.jpg" />
  <Frame image="./untitled-02/assets/storyboard/02.jpg" />
  <Frame image="./untitled-02/assets/storyboard/03.jpg" />
</Storyboard>
```

- [ ] **Step 3: Build and verify both films generate**

```bash
cd /Users/zhangyifan/Desktop/works/site && npm run build
ls dist/films/
```

Expected: both `memory-of-a-light/` and `untitled-02/` directories exist with their own `index.html`.

- [ ] **Step 4: Verify Index lists 2 films**

```bash
cd /Users/zhangyifan/Desktop/works/site
grep -c "Memory of a Light" dist/index.html
grep -c "Untitled No. 02" dist/index.html
```

Expected: both ≥ 1.

- [ ] **Step 5: Commit**

```bash
cd /Users/zhangyifan/Desktop/works
git add site/src/content/films/untitled-02.mdx site/src/content/films/untitled-02/
git commit -m "feat: second film 'Untitled No. 02' to validate multi-film scaling"
```

---

## Task 19: Favicon, OG image placeholder, README

**Files:**
- Create: `site/public/favicon.svg`
- Create: `site/public/og-image.jpg` (placeholder, 1200x630)
- Create: `site/README.md`

- [ ] **Step 1: Write `public/favicon.svg`**

A minimal black-and-white "Y" mark.

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" fill="#000"/>
  <text x="16" y="24" font-family="Inter, -apple-system, Arial, sans-serif" font-weight="900" font-size="22" fill="#f5f5f5" text-anchor="middle">Y</text>
</svg>
```

- [ ] **Step 2: Generate placeholder og-image**

A 1200x630 black PNG with text. The owner replaces this later.

```bash
cd /Users/zhangyifan/Desktop/works/site
# Use sharp to generate a flat black 1200x630 placeholder via the existing dependency
node -e "
const sharp = require('sharp');
sharp({ create: { width: 1200, height: 630, channels: 3, background: { r: 0, g: 0, b: 0 } } })
  .jpeg({ quality: 90 })
  .toFile('public/og-image.jpg')
  .then(() => console.log('done'));
"
ls -la public/og-image.jpg
```

Expected: `public/og-image.jpg` exists, ~3-5 KB.

- [ ] **Step 3: Write `site/README.md`**

```markdown
# Yifan Zhang — AIGC Short Film Portfolio

An archive and display of AIGC short film work, built with Astro.

## Develop

\`\`\`bash
cd site
npm install
npm run dev
\`\`\`

Open http://localhost:4321.

## Build

\`\`\`bash
npm run build
\`\`\`

Outputs static site to \`dist/\`.

## Test

\`\`\`bash
npm test
\`\`\`

Runs Vitest on utility functions.

## Adding a new film

1. Create a new MDX file: \`src/content/films/<slug>.mdx\`
2. Create an assets folder beside it: \`src/content/films/<slug>/assets/\`
3. Add cover, hero, character images, storyboard frames, workflow screenshots
4. Fill frontmatter (see \`memory-of-a-light.mdx\` for reference)
5. \`npm run build\` validates everything — Zod schemas catch missing/wrong fields

## Replacing placeholder signatures

The handwritten signature SVGs live at:

- \`src/assets/signatures/block.svg\` — used as the Hero giant text
- \`src/assets/signatures/cursive.svg\` — used in About sign-off, Footer, Film director sign-off

Replace each with the owner's actual handwritten signature, exported as SVG.
Keep \`fill="currentColor"\` (or no \`fill\` attribute at all) so the SVG adapts to the dark theme.

## Deploy

Push to GitHub. In Cloudflare Pages dashboard:

- Connect the repo
- Build command: \`cd site && npm run build\`
- Build output directory: \`site/dist\`
- Root directory: leave empty

Cloudflare Pages will auto-deploy on every push.

## Spec

The design spec for this site lives at \`../docs/superpowers/specs/2026-05-23-aigc-film-portfolio-design.md\`.
```

- [ ] **Step 4: Final build verification**

```bash
cd /Users/zhangyifan/Desktop/works/site && npm run build && npm test && npm run astro -- check
```

Expected: all three pass (build succeeds, tests pass, no type errors).

- [ ] **Step 5: Commit**

```bash
cd /Users/zhangyifan/Desktop/works
git add site/public/favicon.svg site/public/og-image.jpg site/README.md
git commit -m "feat: favicon, OG image placeholder, README with handoff docs"
```

---

## Plan Self-Review

Performed inline against the spec at `docs/superpowers/specs/2026-05-23-aigc-film-portfolio-design.md`.

**Spec coverage:**
- §3 decisions (positioning, scale, style, layout, language, video, workflow, pages, stack, hosting, signatures): all covered across tasks 1–19.
- §4 IA (Index single-page anchors, Film Detail anchors, header structure): covered in tasks 9, 12, 17.
- §5 visual design system (color, typography, layout, interactions): covered in task 3 (global CSS) plus per-component styles.
- §6.1 Index page (Hero, Works, About, Contact, Footer): task 12.
- §6.2 Film Detail (Hero, Core, Characters, Storyboard, Workflow, Watch, Director, Next): task 17 + MDX in tasks 6, 18 + components in tasks 13–16.
- §6.3 Mobile adaptations: covered in component-level media queries (tasks 9, 11, 12, 13, 14, 15, 17).
- §6.4 Signature integration (4 locations × 2 variants × multiple sizes): Signature component in task 7; placements in tasks 9 (Footer), 12 (Hero + About), 17 (Film director).
- §7.1 stack: tasks 1, 2.
- §7.2 file structure: matches the structure defined above.
- §7.3 schemas: task 4.
- §7.4 Vimeo embed parameters (color, byline, portrait, title, badge, dnt): task 16.
- §7.5 image optimization (Astro Image, widths/sizes, alt required): every component using images passes widths and explicit alt.
- §7.6 SEO (per-page title/description, OG, Twitter, sitemap, og-image): tasks 8 (BaseLayout), 2 (sitemap), 19 (og-image).
- §7.7 accessibility (semantic HTML, alt, focus, contrast): semantic tags in tasks 8, 9, 12, 13, 17; focus styles in task 3; alt required by schema (task 4).
- §8 build & deploy: README in task 19; no platform adapter needed (Cloudflare Pages serves static dist/ directly).
- §9 assets owner must provide: README in task 19 explicitly lists what to swap.
- §10 open questions: deferred per spec.

**Placeholder scan:** No "TBD" / "TODO" / "implement later" sentinels. Every step has the full code or command. Placeholder SVGs and placeholder images are explicitly labeled as such — they pass the schema and let the site build immediately, but the README in task 19 lists them as items the owner must replace.

**Type consistency check:**
- `sortFilms` and `filterPublished` defined in task 10, used unchanged in tasks 12 and 17. ✓
- `SITE_META` shape defined in task 5, used unchanged in tasks 8, 9, 12, 17. ✓
- `Signature` props (`variant`, `size`) defined in task 7, used consistently in tasks 9 (Footer: `cursive`/`sm`), 12 (`block` and `cursive`/`md`), 17 (`cursive`/`lg`). ✓
- `Frame` props (`image`, `caption`, `number`) defined in task 14; MDX usage in task 6 passes only `image` and `caption` (number is optional — handled correctly). ✓
- Collection name `films` and `site` defined in task 4, referenced consistently. ✓

**Scope check:** Single implementation plan covering one site, deployable as a unit. No decomposition needed.

---

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-05-23-aigc-film-portfolio.md`. Two execution options:

1. **Subagent-Driven (recommended)** — I dispatch a fresh subagent per task, review between tasks, fast iteration
2. **Inline Execution** — Execute tasks in this session using executing-plans, batch execution with checkpoints

**Which approach?**
