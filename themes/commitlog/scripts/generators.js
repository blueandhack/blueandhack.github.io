/* global hexo */
'use strict';

const toArray = q => (q ? (typeof q.toArray === 'function' ? q.toArray() : [...q]) : []);

// Lightweight post index used by the command palette, "On this day" and random post.
hexo.extend.generator.register('commitlog_posts_json', function(locals) {
  const root = this.config.root || '/';
  const theme = this.theme.config;
  const english = new Map();
  locals.pages.toArray().forEach(pg => {
    if (pg.layout === 'translation' && pg.original) english.set(pg.original, pg);
  });
  const posts = locals.posts.sort('-date').toArray().map(p => {
    const entry = {
      t: p.title,
      u: root + p.path,
      d: p.date.format('YYYY-MM-DD'),
      c: hexo.commitlog.laneKey(p, theme),
      g: toArray(p.tags).map(t => t.name)
    };
    const en = english.get(p.source);
    if (en) entry.e = { t: en.title, u: root + en.path };
    return entry;
  });
  return { path: 'posts.json', data: JSON.stringify(posts) };
});

// One page per branch: /branches/<name>/
hexo.extend.generator.register('commitlog_branches', function(locals) {
  const theme = this.theme.config;
  const groups = {};
  locals.posts.sort('-date').toArray().forEach(p => {
    const k = hexo.commitlog.laneKey(p, theme);
    (groups[k] = groups[k] || []).push(p);
  });
  return hexo.commitlog.branchNames(theme)
    .filter(name => groups[name])
    .map(name => ({
      path: `branches/${name}/index.html`,
      layout: ['branch'],
      data: { title: name, type: 'branch', branch: name, posts: groups[name] }
    }));
});

hexo.extend.generator.register('commitlog_stats', () => ({
  path: 'stats/index.html',
  layout: ['stats'],
  data: { title: 'Stats', type: 'stats' }
}));

hexo.extend.generator.register('commitlog_404', () => ({
  path: '404.html',
  layout: ['404'],
  data: { title: '404', type: 'notfound' }
}));
