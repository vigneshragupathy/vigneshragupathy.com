// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://astro.vigneshragupathy.com',
  integrations: [react(), mdx(), sitemap()],
  redirects: {
    '/posts': '/blog',
    '/archives': '/blog',
  },
  markdown: {
    shikiConfig: { themes: { light: 'github-light', dark: 'github-dark' } },
  }
});