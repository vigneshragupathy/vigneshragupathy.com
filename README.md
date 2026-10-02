# vigneshragupathy.com

Personal site, built with [Astro](https://astro.build). Markdown/MDX content, React islands for interactive bits, five switchable themes with light/dark mode.

Currently deployed to <https://astro.vigneshragupathy.com> while the Hugo site is migrated. The previous Jekyll site lives on the `jekyll-legacy` branch (tag `jekyll-final`).

## Develop

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # static output in dist/
npm run preview    # serve dist/
```

## Layout

- `src/content/posts/` — posts (`.md` or `.mdx`). Frontmatter schema in `src/content.config.ts`.
- `src/components/` — Astro and React components usable from MDX.
- `src/layouts/` — `Base.astro` (shell, theme picker) and `Post.astro`.
- `src/styles/global.css` — shared rules and the default `paper` theme tokens.
- `src/styles/themes/` — one file per theme, scoped by `data-theme`; light and dark token sets each.
- `src/themes.ts` — theme registry used by the picker.

## Deploy

GitHub Actions (`.github/workflows/deploy.yml`) builds on push to `main` and deploys to GitHub Pages. Custom domain is set by `public/CNAME`.
