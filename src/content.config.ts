import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/** Keep the file name as the id verbatim (Astro's default slugifies, which would turn 18.04 into 1804). */
const rawId = ({ entry }: { entry: string }) => entry.replace(/\.(md|mdx)$/, '');

const posts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/posts', generateId: rawId }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    featured: z.boolean().default(false),
    cover: z.string().optional(),
    coverAlt: z.string().optional(),
    coverHidden: z.boolean().default(false),
    image: z.string().optional(),
    toc: z.boolean().default(true),
    comments: z.boolean().default(true),
    series: z.string().optional(),
    part: z.number().int().positive().optional(),
  }),
});

const books = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/books', generateId: rawId }),
  schema: z.object({
    title: z.string(),
    author: z.string().default(''),
    date: z.coerce.date(),
    subtitle: z.string().optional(),
    isbn: z.string().optional(),
    link: z.string().optional(),
    coverImage: z.string().optional(),
    summary: z.string().optional(),
    description: z.string().optional(),
  }),
});

export const collections = { posts, books };
