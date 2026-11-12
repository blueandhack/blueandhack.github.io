# commitlog

A Hexo theme that renders a blog as a git history. The home page is a commit
graph: every post is a commit, each branch is a colored lane, and every year
boundary is a release tag (`v2010`, `v2011`, …).

No build step and no runtime dependencies: Nunjucks templates (rendered by
Hexo core), one CSS file, one vanilla JS file.

## Features

- **Commit graph** on the home, tag, category and branch pages, with lanes that
  fork from and merge back into the main line.
- **Branches** (`/branches/<name>/`) group posts by tag. Configure them under
  `branches` in `_config.yml`: the first branch is the main line; a post joins
  the first other branch whose `match` list contains one of its tags or
  categories.
- **Command palette** (`Ctrl/⌘ K` or `/`): search titles, tags and full post
  text, plus commands (navigation, random post, theme, RSS, shortcuts).
- **Keyboard shortcuts**: `j`/`k` move through lists, `Enter` opens, `h`/`l`
  older/newer post, `g h|a|t|s|b` go to log/archive/tags/stats/about, `t` theme,
  `r` random post, `?` help.
- **Archive** with a posts-per-month heatmap and a year timeline.
- **On this day**: posts written around today's date in earlier years.
- **Stats page** (`/stats/`): posts and characters per year, posts per branch.
- **Color palettes**: readers pick Ink, Forest, Plum, Ember or Mono from the
  header (or the command palette); each has light and dark variants with all
  text colors at 4.5:1 contrast or better, and the choice is remembered in the
  browser. Configure the list with `palettes` in `_config.yml`.
- **Reading tools**: light/dark theme, reading progress bar, table of contents
  (for posts with headings), reading time that counts Chinese characters,
  older/newer navigation, related posts by shared tags.
- **Code and media**: language label and copy button on code blocks, image
  lightbox, a 404 page.
- **Comments** via Disqus, loaded only when the reader scrolls near them.
- **English UI by default**; `languages/zh-CN.yml` is included. Set
  `language` in the site `_config.yml` to switch.

## Site requirements

- `hexo-generator-searchdb` (full-text search in the palette)
- `hexo-generator-feed` (RSS link)
- `archive_generator.per_page: 0` is recommended so the archive is one page.

## Overrides

Put site-specific values in `_config.commitlog.yml` at the site root, e.g.:

```yaml
disqus:
  shortname: your-shortname
google_analytics: G-XXXXXXXXXX
```

## English translations

`tools/translate.mjs` (run with `yarn translate`) writes English versions of
Chinese posts to `source/en/<same file name>.md` as pages with `layout: translation`
and a `permalink` of `en/<original path>`.
The theme then:

- serves them at `/en/<original path>` and links the two versions both ways
  ("Read in English" / "中文原文"), with `hreflang` alternates for search engines;
- shows an `EN` link on graph rows that have a translation;
- keeps translations out of the graph, archive, tags, stats and RSS feed;
- lets the command palette find posts by their English titles;
- shares the original post's Disqus thread on the English page.

Posts already written in English are never translated.
