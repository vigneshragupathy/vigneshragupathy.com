import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'posts'>;
export type Book = CollectionEntry<'books'>;

/** Published posts: not draft, not future-dated (mirrors Hugo buildDrafts/buildFuture = false), newest first. */
export async function getPosts(): Promise<Post[]> {
  const now = Date.now();
  const posts = await getCollection('posts', ({ data }) => !data.draft && data.date.valueOf() <= now);
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export async function getBooks(): Promise<Book[]> {
  const books = await getCollection('books');
  return books.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export function tagCounts(posts: Post[]): Map<string, number> {
  const m = new Map<string, number>();
  for (const p of posts) for (const t of p.data.tags) m.set(t, (m.get(t) ?? 0) + 1);
  return new Map([...m].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])));
}

export function groupByYear<T extends { data: { date: Date } }>(items: T[]): [number, T[]][] {
  const m = new Map<number, T[]>();
  for (const it of items) {
    const y = it.data.date.getFullYear();
    if (!m.has(y)) m.set(y, []);
    m.get(y)!.push(it);
  }
  return [...m].sort((a, b) => b[0] - a[0]);
}

const LONG: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
const SHORT: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
export const fmtLong = (d: Date) => d.toLocaleDateString('en-GB', LONG);
export const fmtShort = (d: Date) => d.toLocaleDateString('en-GB', SHORT);
export const fmtMonth = (d: Date) => d.toLocaleDateString('en-GB', { month: 'short' });
export const fmtMonthYear = (d: Date) => d.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });

export function readingTime(body: string | undefined): number {
  const words = (body ?? '').replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

export const SITE = {
  title: 'Vignesh Ragupathy',
  description: 'Personal blog by Vignesh Ragupathy',
  author: 'Vignesh Ragupathy',
  ga: 'G-9F817WV8S6',
  disqus: 'vikkiblog',
  social: {
    linkedin: 'https://www.linkedin.com/in/vigneshragupathy/',
    github: 'https://github.com/vigneshragupathy',
  },
};
