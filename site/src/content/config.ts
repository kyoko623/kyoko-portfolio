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
      status: z.enum(['discarded', 'in-progress', 'completed']).default('in-progress'),
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
