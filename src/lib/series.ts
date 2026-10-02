import { getCollection } from 'astro:content';
import { getPosts, type Post } from './content';

/** Series registry. Planned parts have no post yet and show as "coming soon". */
export const SERIES: Record<string, { title: string; blurb: string; planned: { part: number; title: string }[] }> = {
  'istio-hands-on': {
    title: 'Istio Hands-on',
    blurb: 'Learn Kubernetes service mesh with Istio by running the commands, one topic per part.',
    planned: [
      { part: 10, title: 'Multi-Cluster Setup' },
      { part: 11, title: 'Troubleshooting Istio' },
    ],
  },
};

export interface SeriesEntry { part: number; title: string; slug?: string; current?: boolean }

/** All entries of a series: published posts (with slug) plus planned parts, sorted by part number. */
export async function seriesEntries(id: string, currentSlug?: string): Promise<SeriesEntry[]> {
  const publishedIds = new Set((await getPosts()).map((p) => p.id));
  // Every post that belongs to the series, including drafts and future-dated ones: those show as "coming soon".
  const all = (await getCollection('posts', ({ data }) => data.series === id && !!data.part)) as Post[];
  const entries: SeriesEntry[] = all.map((p) => ({
    part: p.data.part!,
    title: shortTitle(p),
    slug: publishedIds.has(p.id) ? p.id : undefined,
    current: p.id === currentSlug,
  }));
  const have = new Set(entries.map((e) => e.part));
  const planned = (SERIES[id]?.planned ?? []).filter((e) => !have.has(e.part));
  return [...entries, ...planned].sort((a, b) => a.part - b.part);
}

/** "Istio Hands-on Part 3 - Understanding X" -> "Understanding X" */
export function shortTitle(p: Post): string {
  return p.data.title.replace(/^.*?Part\s+\d+\s*[-–:]\s*/i, '');
}
