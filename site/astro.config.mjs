import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://yifan-zhang.pages.dev',
  integrations: [mdx(), sitemap()],
  image: {
    service: { entrypoint: 'astro/assets/services/sharp' },
  },
  legacy: {
    collectionsBackwardsCompat: true,
  },
});
