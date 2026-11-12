/* global hexo */
'use strict';

const crypto = require('crypto');
const { stripHTML } = require('hexo-util');

// Graph geometry, in px. Keep in sync with --lane-gap / --lane-x0 / --dot-y in style.css.
const X0 = 10;
const GAP = 16;
const DOT_Y = 27;
const FORK_H = 26;
const laneX = col => X0 + col * GAP;

const CJK = /[㐀-鿿豈-﫿　-〿＀-￯]/g;

const toArray = q => (q ? (typeof q.toArray === 'function' ? q.toArray() : [...q]) : []);

function branchNames(theme) {
  return Object.keys(theme.branches || {});
}

function mainKey(theme) {
  return branchNames(theme)[0] || 'main';
}

// Lowercased match lists, cached per theme config object.
const matchCache = new WeakMap();
function matchers(theme) {
  if (!matchCache.has(theme)) {
    const branches = theme.branches || {};
    matchCache.set(theme, branchNames(theme).slice(1).map(name => ({
      name,
      words: new Set(((branches[name] && branches[name].match) || []).map(w => String(w).toLowerCase()))
    })));
  }
  return matchCache.get(theme);
}

// The branch (lane) a post is drawn on.
function laneKey(post, theme) {
  const names = toArray(post.tags).map(t => t.name.toLowerCase())
    .concat(toArray(post.categories).map(c => c.name.toLowerCase()));
  for (const m of matchers(theme)) {
    if (names.some(n => m.words.has(n))) return m.name;
  }
  return mainKey(theme);
}

function laneColor(theme, key) {
  const b = theme.branches && theme.branches[key];
  return (b && b.color) || 'other';
}

function hashOf(post) {
  return crypto.createHash('sha1').update(String(post.source || post.path)).digest('hex').slice(0, 7);
}

function plainText(html) {
  return stripHTML(html || '').replace(/\s+/g, ' ').trim();
}

function readingMinutes(content, speed = {}) {
  const text = plainText(content);
  const cjk = (text.match(CJK) || []).length;
  const words = (text.replace(CJK, ' ').match(/[A-Za-z0-9][A-Za-z0-9'_-]*/g) || []).length;
  const mins = cjk / (speed.cjk_chars_per_min || 300) + words / (speed.words_per_min || 220);
  return Math.max(1, Math.round(mins));
}

function charCount(content) {
  const text = plainText(content);
  const cjk = (text.match(CJK) || []).length;
  const words = (text.replace(CJK, ' ').match(/[A-Za-z0-9][A-Za-z0-9'_-]*/g) || []).length;
  return cjk + words;
}

// Build rows for a git-log style graph from a list of posts (newest first).
// Each category is a lane; the first configured lane is the main line and is
// always drawn. Side lanes fork off the main line below their oldest post and
// merge back above their newest post. A tag row is inserted at each year change.
function buildGraph(theme, posts) {
  const list = toArray(posts);
  const main = mainKey(theme);
  const keys = list.map(p => laneKey(p, theme));
  const first = {};
  const last = {};
  keys.forEach((k, i) => {
    if (!(k in first)) first[k] = i;
    last[k] = i;
  });

  const col = { [main]: 0 };
  const used = new Set([0]);
  let maxCol = 0;
  const rows = [];
  let prevYear = null;
  const mainColor = laneColor(theme, main);

  const passing = (i, exclude) => {
    const segs = [];
    for (const k of Object.keys(col)) {
      if (k === main || k === exclude) continue;
      if (first[k] < i && last[k] >= i && (exclude === undefined ? true : last[k] > i)) {
        segs.push({ x: col[k], color: laneColor(theme, k), kind: 'through' });
      }
    }
    return segs;
  };

  list.forEach((post, i) => {
    const k = keys[i];
    const year = post.date.year();

    if (year !== prevYear) {
      rows.push({
        type: 'tag',
        year,
        segs: [{ x: 0, color: mainColor, kind: 'through' }, ...passing(i)]
      });
      prevYear = year;
    }

    if (k !== main && first[k] === i) {
      let c = 1;
      while (used.has(c)) c++;
      used.add(c);
      col[k] = c;
      maxCol = Math.max(maxCol, c);
    }

    const color = laneColor(theme, k);
    const segs = [{ x: 0, color: mainColor, kind: 'through' }, ...passing(i, k)];
    const curves = [];

    if (k !== main) {
      const x = col[k];
      if (first[k] < i) {
        segs.push({ x, color, kind: 'top' });
      } else {
        const a = laneX(0);
        const b = laneX(x);
        curves.push({ color, d: `M${a} 0C${a} ${DOT_Y * 0.6} ${b} ${DOT_Y * 0.35} ${b} ${DOT_Y}` });
      }
      if (last[k] > i) {
        segs.push({ x, color, kind: 'bottom' });
      } else {
        const a = laneX(x);
        const b = laneX(0);
        const end = DOT_Y + FORK_H;
        curves.push({ color, d: `M${a} ${DOT_Y}C${a} ${DOT_Y + FORK_H * 0.65} ${b} ${DOT_Y + FORK_H * 0.4} ${b} ${end}` });
      }
      if (last[k] === i) used.delete(x);
    }

    rows.push({ type: 'commit', post, key: k, color, x: col[k], segs, curves, first: i === 0 });
  });

  return {
    rows,
    width: X0 * 2 + maxCol * GAP,
    svgHeight: DOT_Y + FORK_H
  };
}

hexo.extend.helper.register('commit_graph', function(posts) {
  return buildGraph(this.theme, posts);
});

hexo.extend.helper.register('commit_hash', hashOf);

hexo.extend.helper.register('lane_key', function(post) {
  return laneKey(post, this.theme);
});

hexo.extend.helper.register('main_branch', function() {
  return mainKey(this.theme);
});

hexo.extend.helper.register('branch_colors', function() {
  const out = {};
  branchNames(this.theme).forEach(n => { out[n] = laneColor(this.theme, n); });
  return out;
});

hexo.extend.helper.register('branch_path', name => `branches/${name}/`);

hexo.extend.helper.register('lane_color', function(key) {
  return laneColor(this.theme, key);
});

hexo.extend.helper.register('reading_minutes', function(content) {
  return readingMinutes(content, this.theme.reading_speed);
});

hexo.extend.helper.register('summary_text', (post, length = 90) => {
  const text = plainText(post.excerpt || post.content);
  return text.length > length ? text.slice(0, length).trimEnd() + '…' : text;
});

hexo.extend.helper.register('post_tags', post => toArray(post.tags));

hexo.extend.helper.register('related_posts', function(post, limit = 4) {
  const mine = new Set(toArray(post.tags).map(t => t.name));
  if (!mine.size) return [];
  const t0 = post.date.valueOf();
  return toArray(this.site.posts)
    .filter(p => p._id !== post._id)
    .map(p => ({ p, score: toArray(p.tags).filter(t => mine.has(t.name)).length }))
    .filter(x => x.score > 0)
    .sort((a, b) => b.score - a.score || Math.abs(a.p.date.valueOf() - t0) - Math.abs(b.p.date.valueOf() - t0))
    .slice(0, limit)
    .map(x => x.p);
});

hexo.extend.helper.register('sorted_tags', function() {
  return toArray(this.site.tags)
    .filter(t => t.length)
    .sort((a, b) => b.length - a.length || a.name.localeCompare(b.name));
});

hexo.extend.helper.register('lane_list', function() {
  const theme = this.theme;
  const counts = {};
  toArray(this.site.posts).forEach(p => {
    const k = laneKey(p, theme);
    counts[k] = (counts[k] || 0) + 1;
  });
  return branchNames(theme)
    .filter(k => counts[k])
    .map(k => ({ key: k, count: counts[k], color: laneColor(theme, k), path: `branches/${k}/` }));
});

hexo.extend.helper.register('post_heatmap', function() {
  const posts = toArray(this.site.posts);
  if (!posts.length) return { years: [], max: 0 };
  const startYear = Math.min(...posts.map(p => p.date.year()));
  const endYear = new Date().getFullYear();
  const grid = {};
  posts.forEach(p => {
    const key = `${p.date.year()}-${p.date.month()}`;
    grid[key] = (grid[key] || 0) + 1;
  });
  const years = [];
  let max = 0;
  for (let y = endYear; y >= startYear; y--) {
    const months = [];
    let total = 0;
    for (let m = 0; m < 12; m++) {
      const n = grid[`${y}-${m}`] || 0;
      total += n;
      max = Math.max(max, n);
      months.push({ month: m + 1, count: n, label: `${y}-${String(m + 1).padStart(2, '0')}` });
    }
    years.push({ year: y, months, total });
  }
  years.forEach(y => y.months.forEach(c => {
    c.level = c.count === 0 ? 0 : Math.min(4, Math.ceil((c.count / max) * 4));
  }));
  return { years, max };
});

hexo.extend.helper.register('blog_stats', function() {
  const theme = this.theme;
  const posts = toArray(this.site.posts);
  const byYear = {};
  let totalChars = 0;
  let longest = null;
  posts.forEach(p => {
    const y = p.date.year();
    const chars = charCount(p.content);
    totalChars += chars;
    byYear[y] = byYear[y] || { year: y, posts: 0, chars: 0 };
    byYear[y].posts++;
    byYear[y].chars += chars;
    if (!longest || chars > longest.chars) longest = { post: p, chars };
  });
  const years = Object.values(byYear).sort((a, b) => a.year - b.year);
  const maxPosts = Math.max(...years.map(y => y.posts));
  const maxChars = Math.max(...years.map(y => y.chars));
  years.forEach(y => {
    y.postPct = Math.round((y.posts / maxPosts) * 1000) / 10;
    y.charPct = Math.round((y.chars / maxChars) * 1000) / 10;
  });
  const busiest = years.reduce((a, b) => (b.posts > a.posts ? b : a), years[0]);
  const lanes = {};
  posts.forEach(p => {
    const k = laneKey(p, theme);
    lanes[k] = (lanes[k] || 0) + 1;
  });
  const branches = Object.keys(lanes)
    .sort((a, b) => lanes[b] - lanes[a])
    .map(k => ({ key: k, count: lanes[k], color: laneColor(theme, k), pct: Math.round((lanes[k] / posts.length) * 1000) / 10 }));
  return { total: posts.length, totalChars, years, busiest, longest, branches };
});

hexo.extend.helper.register('format_number', n => Number(n).toLocaleString('en-US'));

hexo.extend.helper.register('current_year', () => new Date().getFullYear());

hexo.extend.helper.register('group_by_year', posts => {
  const groups = [];
  toArray(posts).forEach(p => {
    const y = p.date.year();
    if (!groups.length || groups[groups.length - 1].year !== y) groups.push({ year: y, posts: [] });
    groups[groups.length - 1].posts.push(p);
  });
  return groups;
});

// Shared with generators.js
hexo.commitlog = { laneKey, mainKey, branchNames };

// Page numbers for the pager: first, last, and current ±1, with null for gaps.
hexo.extend.helper.register('pager_items', (current, total) => {
  const nums = [...new Set([1, total, current - 1, current, current + 1])]
    .filter(n => n >= 1 && n <= total)
    .sort((a, b) => a - b);
  const out = [];
  let prev = 0;
  nums.forEach(n => {
    if (n - prev > 1) out.push(null);
    out.push(n);
    prev = n;
  });
  return out;
});

hexo.extend.helper.register('pager_url', function(page, n) {
  const dir = this.config.pagination_dir || 'page';
  return this.url_for((page.base || '') + (n > 1 ? `${dir}/${n}/` : ''));
});

// Profile links from theme.social. Keys are display labels (GitHub, X, LinkedIn, …);
// the icon is picked from the lowercased label. Two special keys:
//   email: base64-encoded address (decoded in the browser on click)
//   rss: true to include the feed link
const KNOWN_ICONS = new Set(['github', 'x', 'linkedin']);
hexo.extend.helper.register('social_links', function() {
  const social = this.theme.social || {};
  const out = [];
  Object.keys(social).forEach(key => {
    const value = social[key];
    if (!value) return;
    const lower = key.toLowerCase();
    if (lower === 'email') out.push({ icon: 'email', encoded: String(value) });
    else if (lower === 'rss') out.push({ icon: 'rss', url: typeof value === 'string' ? value : '/atom.xml' });
    else out.push({ label: key, url: value, icon: KNOWN_ICONS.has(lower) ? lower : 'link' });
  });
  return out;
});

// Theme asset URL with a content fingerprint (?v=<hash>) so browsers and the
// GitHub Pages CDN never pair new HTML with a stale cached CSS/JS file.
const fs = require('fs');
const path = require('path');
const assetHashes = new Map();
hexo.extend.helper.register('asset_url', function(file) {
  if (!assetHashes.has(file)) {
    let v = '';
    try {
      const buf = fs.readFileSync(path.join(hexo.theme_dir, 'source', file));
      v = crypto.createHash('sha1').update(buf).digest('hex').slice(0, 10);
    } catch (e) { /* missing file: no fingerprint */ }
    assetHashes.set(file, v);
  }
  const v = assetHashes.get(file);
  return this.url_for('/' + file) + (v ? `?v=${v}` : '');
});

// Clear fingerprints when `hexo server` regenerates after a file change.
hexo.on('generateBefore', () => assetHashes.clear());
