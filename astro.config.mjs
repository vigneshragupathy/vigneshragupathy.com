// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import expressiveCode from 'astro-expressive-code';

// https://astro.build/config
export default defineConfig({
  site: 'https://vigneshragupathy.com',
  integrations: [
    react(),
    expressiveCode({
      themes: ['github-light', 'github-dark'],
      // Follow the site's own light/dark toggle (data-mode on <html>), not the OS setting.
      themeCssSelector: (theme) => `[data-mode='${theme.type}']`,
      useDarkModeMediaQuery: false,
      styleOverrides: {
        borderRadius: 'var(--radius)',
        borderColor: 'var(--border)',
        codeFontFamily: 'var(--font-mono)',
        codeFontSize: '0.88rem',
        uiFontFamily: 'var(--font)',
        frames: {
          shadowColor: 'transparent',
          editorActiveTabIndicatorTopColor: 'var(--accent)',
          terminalTitlebarDotsForeground: 'var(--accent)',
        },
      },
      defaultProps: { wrap: false },
    }),
    mdx(),
    sitemap(),
  ],
  redirects: {
    '/posts': '/blog',
    '/archives': '/blog',
  },
  markdown: {
    shikiConfig: { themes: { light: 'github-light', dark: 'github-dark' } },
  }
});