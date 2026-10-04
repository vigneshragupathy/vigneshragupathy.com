# vigneshragupathy.com

Personal site, built with [Astro](https://astro.build). Markdown/MDX content, React islands for interactive bits, five switchable themes with light/dark mode.

Deployed to <https://vigneshragupathy.com>. The previous Jekyll site lives on the `jekyll-legacy` branch (tag `jekyll-final`).

## Develop

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # static output in dist/
npm run preview    # serve dist/
```

Or run it in the background and manage it:

```bash
scripts/blog.sh start            # astro dev, hot reload
scripts/blog.sh start preview    # build, then serve dist/
scripts/blog.sh status
scripts/blog.sh logs -f
scripts/blog.sh restart
scripts/blog.sh stop
```

## Content

- Posts live at `/<slug>/` (same URLs as the old Hugo site). Slug = file name in `src/content/posts/`.
- Drafts (`draft: true`) and future-dated posts are excluded from the build, like Hugo.
- Books live at `/books/<slug>/`, listed as a year timeline on `/books/`.
- `scripts/migrate-hugo.py <hugo repo>` regenerates posts, books and `public/images` from the Hugo repo. Run it only if you change content there; otherwise edit files here directly.

## Layout

- `src/content/posts/` — posts (`.md` or `.mdx`). Frontmatter schema in `src/content.config.ts`.
- `src/components/` — Astro and React components usable from MDX.
- `src/layouts/` — `Base.astro` (shell, theme picker) and `Post.astro`.
- `src/styles/global.css` — shared rules and the default `paper` theme tokens.
- `src/styles/themes/` — one file per theme, scoped by `data-theme`; light and dark token sets each.
- `src/themes.ts` — theme registry used by the picker.
- `src/lib/content.ts` — collection queries, date helpers, site constants (GA, Disqus, social).
- Search is Pagefind, indexed after `astro build` (see the `build` script). Comments are Disqus, loaded lazily.

## Deploy

GitHub Actions (`.github/workflows/deploy.yml`) builds on push to `main` and deploys to GitHub Pages. Custom domain is set by `public/CNAME`.
