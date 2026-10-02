#!/usr/bin/env python3
"""Migrate Hugo (PaperMod) content into this Astro site.

Usage: python3 scripts/migrate-hugo.py /path/to/hugo_repo

- Posts: content/posts/*.{md,markdown} -> src/content/posts/<slug>.md
  Slug is Hugo's URLize(title) so URLs stay /<slug>/. Verified against the
  Hugo repo's public/ folder when present.
- Books: content/books/*.md -> src/content/books/<filename>.md
- Static: static/images, static/diagrams -> public/
"""
import re, sys, shutil, unicodedata
from datetime import datetime, date
from pathlib import Path
import yaml

HUGO = Path(sys.argv[1]).resolve()
ROOT = Path(__file__).resolve().parent.parent
POSTS_OUT = ROOT / 'src/content/posts'
BOOKS_OUT = ROOT / 'src/content/books'

KEEP = set('.-_~+#@')

def urlize(title: str) -> str:
    """Approximation of Hugo's URLize: lowercase, spaces->hyphens, drop unsafe runes, collapse hyphens."""
    out = []
    for ch in title.strip().lower():
        if ch == ' ':
            out.append('-')
        elif ch.isalnum() or ch in KEEP or unicodedata.category(ch).startswith('M'):
            out.append(ch)
        # everything else dropped
    s = ''.join(out)
    s = re.sub(r'-{2,}', '-', s).strip('-')
    return s

def split_frontmatter(text: str):
    m = re.match(r'^\s*---\n(.*?)\n---\n?', text, re.S)
    if not m:
        raise ValueError('no frontmatter')
    return yaml.safe_load(m.group(1)) or {}, text[m.end():]

def to_iso(d) -> str:
    if isinstance(d, datetime):
        return d.strftime('%Y-%m-%dT%H:%M:%S')
    if isinstance(d, date):
        return d.strftime('%Y-%m-%d')
    s = str(d).strip()
    for fmt in ('%Y-%m-%d %H:%M:%S', '%Y-%m-%dT%H:%M:%S', '%Y-%m-%d'):
        try:
            return datetime.strptime(s, fmt).strftime('%Y-%m-%dT%H:%M:%S' if ' ' in s or 'T' in s else '%Y-%m-%d')
        except ValueError:
            pass
    raise ValueError(f'bad date {d!r}')

def fix_paths(s: str) -> str:
    return re.sub(r'(?:\.\./)+images/', '/images/', s)

def transform_body(body: str) -> str:
    b = body
    # Hugo shortcodes
    b = re.sub(r'\{\{<\s*newtabref\s+href="([^"]+)"\s+title="([^"]*)"\s*>\}\}',
               r'<a href="\1" target="_blank" rel="noopener">\2</a>', b)
    b = re.sub(r'\{\{%\s*lang\s+"en"\s*%\}\}\s*\n?', '', b)
    # Tamil block -> collapsible details so the content is preserved but hidden by default
    def ta(m):
        inner = m.group(1).strip('\n')
        return ('<details class="lang-ta">\n<summary>தமிழில் படிக்க · Read in Tamil</summary>\n\n'
                + inner + '\n\n</details>\n')
    b = re.sub(r'\{\{%\s*lang\s+"ta"\s*%\}\}(.*?)\{\{%\s*/lang\s*%\}\}', ta, b, flags=re.S)
    b = re.sub(r'\{\{%\s*/lang\s*%\}\}\s*\n?', '', b)
    # Ghost export markers
    b = re.sub(r'<!--kg-card-(?:begin|end): \w+-->', '', b)
    b = fix_paths(b)
    return b.strip() + '\n'

def dump_fm(fm: dict) -> str:
    return '---\n' + yaml.safe_dump(fm, allow_unicode=True, sort_keys=False, default_flow_style=False).strip() + '\n---\n\n'

def migrate_posts():
    built = set()
    pub = HUGO / 'public'
    if pub.is_dir():
        built = {p.name for p in pub.iterdir() if p.is_dir()}
    POSTS_OUT.mkdir(parents=True, exist_ok=True)
    for old in POSTS_OUT.glob('*'):
        old.unlink()
    n = 0; problems = []
    for src in sorted((HUGO / 'content/posts').iterdir()):
        if src.suffix not in ('.md', '.markdown'):
            continue
        fm, body = split_frontmatter(src.read_text(encoding='utf-8'))
        title = str(fm['title']).strip()
        slug = urlize(title)
        draft = bool(fm.get('draft', False))
        if built and not draft and slug not in built:
            problems.append(f'{src.name}: slug {slug!r} not found in Hugo public/')
        out = {'title': title, 'date': to_iso(fm['date'])}
        tags = fm.get('tags') or []
        out['tags'] = [str(t) for t in tags]
        if draft:
            out['draft'] = True
        if fm.get('featured'):
            out['featured'] = True
        cover = fm.get('cover') or {}
        if cover.get('image'):
            out['cover'] = fix_paths(cover['image'])
            if cover.get('alt'):
                out['coverAlt'] = cover['alt']
            if cover.get('hiddenInSingle') or cover.get('hidden'):
                out['coverHidden'] = True
        elif fm.get('image'):
            out['image'] = fix_paths(fm['image'])
        if fm.get('ShowToc') is False:
            out['toc'] = False
        if fm.get('comments') is False:
            out['comments'] = False
        (POSTS_OUT / f'{slug}.md').write_text(dump_fm(out) + transform_body(body), encoding='utf-8')
        n += 1
    print(f'posts: {n} written')
    for p in problems:
        print('  PROBLEM', p)
    return not problems

def migrate_books():
    BOOKS_OUT.mkdir(parents=True, exist_ok=True)
    for old in BOOKS_OUT.glob('*'):
        old.unlink()
    n = 0
    for src in sorted((HUGO / 'content/books').glob('*.md')):
        if src.name == '_index.md':
            continue
        fm, body = split_frontmatter(src.read_text(encoding='utf-8'))
        out = {'title': str(fm['title']).strip(), 'author': str(fm.get('author', '')).strip(), 'date': to_iso(fm['date'])}
        for k in ('subtitle', 'isbn', 'link', 'coverImage', 'summary', 'description'):
            if fm.get(k):
                out[k] = str(fm[k]).strip()
        (BOOKS_OUT / src.name).write_text(dump_fm(out) + transform_body(body), encoding='utf-8')
        n += 1
    print(f'books: {n} written')

def copy_static():
    for d in ('images', 'diagrams'):
        s = HUGO / 'static' / d
        if s.is_dir():
            shutil.copytree(s, ROOT / 'public' / d, dirs_exist_ok=True)
            print(f'static/{d} -> public/{d}')

if __name__ == '__main__':
    ok = migrate_posts()
    migrate_books()
    copy_static()
    sys.exit(0 if ok else 1)
