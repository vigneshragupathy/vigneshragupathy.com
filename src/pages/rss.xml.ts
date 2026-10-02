import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getPosts, SITE } from '../lib/content';

export async function GET(context: APIContext) {
  const posts = await getPosts();
  return rss({
    title: SITE.title,
    description: SITE.description,
    site: context.site!,
    items: posts.slice(0, 30).map((p) => ({
      title: p.data.title,
      pubDate: p.data.date,
      link: `/${p.id}/`,
      categories: p.data.tags,
      description: p.data.description,
    })),
    customData: '<language>en-us</language>',
  });
}
