#!/usr/bin/env node
// Dead-link checker and fixer for source/_posts.
//
//   node tools/links.mjs            check every external link and image, write tools/.links-report.json
//   node tools/links.mjs --fix      check, then repair dead ones in place:
//                                     - link/image with an Internet Archive snapshot -> snapshot URL
//                                       (closest to the post's date; images use the raw `im_` form)
//                                     - dead link without a snapshot -> plain text (link removed)
//                                     - dead image without a snapshot -> removed (alt text kept)
//                                     - Flash <embed> players -> short note (no browser plays Flash)
//
// Links already pointing at web.archive.org are skipped. Results for URLs that were
// checked recently are cached in tools/.links-cache.json so re-runs are fast.

import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const POSTS = path.join(ROOT, 'source/_posts');
const REPORT = path.join(ROOT, 'tools/.links-report.json');
const CACHE = path.join(ROOT, 'tools/.links-cache.json');
const FIX = process.argv.includes('--fix');
const CACHE_DAYS = 14;
const UA = 'Mozilla/5.0 (compatible; blog-link-checker/1.0)';

// Hosts that only ever served the site's own content; never "fix" these.
const OWN_HOSTS = new Set(['blueandhack.com', 'www.blueandhack.com', 'cdn.blueandhack.com']);
const PARKING = /(hugedomains|sedo|dan\.com|afternic|parkingcrew|bodis|domainmarket|above\.com|undeveloped|domainnamesales|sedoparking|parklogic|buydomains)/i;
const IMG_EXT = /\.(png|jpe?g|gif|webp|bmp|svg)(\?|#|$)/i;

// ---- link extraction -------------------------------------------------------

const PATTERNS = [
  // markdown image / link: ![alt](url "title") or [text](url)
  { kind: 'md', re: /(!?)\[(?!!\[)([^\]]*)\]\(\s*<?(https?:\/\/[^)\s>]+)>?(?:\s+"[^"]*")?\s*\)/g },
  // <a href="url">text</a>
  { kind: 'a', re: /<a\b[^>]*?\bhref\s*=\s*["'](https?:\/\/[^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi },
  // <img src="url" ...>
  { kind: 'img', re: /<img\b[^>]*?\bsrc\s*=\s*["'](https?:\/\/[^"']+)["'][^>]*>/gi },
  // <embed src="...swf"> (Flash players)
  { kind: 'embed', re: /<embed\b[^>]*?\bsrc\s*=\s*["'](https?:\/\/[^"']+)["'][^>]*>(?:\s*<\/embed>)?/gi },
  // <https://autolink>
  { kind: 'auto', re: /<(https?:\/\/[^>\s]+)>/g }
];

function extract(text) {
  const found = [];
  const taken = [];
  for (const { kind, re } of PATTERNS) {
    re.lastIndex = 0;
    let m;
    while ((m = re.exec(text))) {
      const start = m.index;
      const end = start + m[0].length;
      if (taken.some(([s, e]) => start < e && end > s)) continue; // already inside an earlier match
      let url;
      let isImage;
      if (kind === 'md') { url = m[3]; isImage = m[1] === '!'; }
      else if (kind === 'a') { url = m[1]; isImage = false; }
      else if (kind === 'img') { url = m[1]; isImage = true; }
      else if (kind === 'embed') { url = m[1]; isImage = false; }
      else { url = m[1]; isImage = IMG_EXT.test(url); }
      found.push({ kind, start, end, raw: m[0], url, isImage, groups: m.slice(1) });
      taken.push([start, end]);
    }
  }
  return found.sort((a, b) => a.start - b.start);
}

function postDate(text) {
  const m = text.match(/^date:\s*(\d{4})-(\d{1,2})-(\d{1,2})/m);
  return m ? `${m[1]}${m[2].padStart(2, '0')}${m[3].padStart(2, '0')}` : '20100101';
}

const hostOf = u => { try { return new URL(u).hostname.toLowerCase(); } catch { return ''; } };
function siteOf(host) {
  const parts = host.split('.');
  const twoLevel = /^(com|net|org|gov|edu)\.(cn|hk|tw|uk|au)$/.test(parts.slice(-2).join('.'));
  return parts.slice(twoLevel ? -3 : -2).join('.');
}

// ---- checking --------------------------------------------------------------

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function probe(url, expectImage) {
  try {
    const res = await fetch(url, {
      redirect: 'follow',
      signal: AbortSignal.timeout(15000),
      headers: { 'user-agent': UA, accept: expectImage ? 'image/*,*/*;q=0.5' : 'text/html,*/*;q=0.8' }
    });
    const type = res.headers.get('content-type') || '';
    try { await res.body?.cancel(); } catch {}
    return { status: res.status, final: res.url, type };
  } catch (e) {
    return { status: 0, final: url, type: '', error: (e.cause && e.cause.code) || e.name || 'error' };
  }
}

function verdict(url, r, expectImage) {
  if (r.status === 0) return ['dead', `unreachable (${r.error})`];
  if ([404, 410].includes(r.status)) return ['dead', `HTTP ${r.status}`];
  if (r.status >= 500) return ['dead', `HTTP ${r.status}`];
  if ([401, 403, 405, 429, 451].includes(r.status)) return ['uncertain', `HTTP ${r.status} (may block bots)`];
  if (r.status >= 400) return ['dead', `HTTP ${r.status}`];
  const fromHost = hostOf(url);
  const toHost = hostOf(r.final);
  if (PARKING.test(toHost) || PARKING.test(r.final)) return ['dead', `domain parked/for sale (${toHost})`];
  // Images may legitimately move to a CDN on another domain; what matters is that an image comes back.
  if (expectImage && /^image\//i.test(r.type)) return ['ok', `HTTP ${r.status}`];
  if (siteOf(fromHost) !== siteOf(toHost)) return ['dead', `now redirects to another site (${toHost})`];
  const fromPath = new URL(url).pathname + new URL(url).search;
  const toPath = new URL(r.final).pathname + new URL(r.final).search;
  if (fromPath.length > 1 && (toPath === '/' || toPath === '')) return ['dead', 'redirects to the home page'];
  if (expectImage && r.type && !/^image\//i.test(r.type)) return ['dead', `not an image any more (${r.type.split(';')[0]})`];
  return ['ok', `HTTP ${r.status}`];
}

async function check(url, expectImage) {
  let r = await probe(url, expectImage);
  let [v, why] = verdict(url, r, expectImage);
  if (v === 'dead' && (r.status === 0 || r.status >= 500)) { // retry transient failures once
    await sleep(1500);
    r = await probe(url, expectImage);
    [v, why] = verdict(url, r, expectImage);
  }
  return { verdict: v, reason: why, status: r.status, final: r.final };
}

async function pool(items, size, fn) {
  const out = new Array(items.length);
  let i = 0;
  await Promise.all(Array.from({ length: size }, async () => {
    while (i < items.length) { const k = i++; out[k] = await fn(items[k], k); }
  }));
  return out;
}

// ---- Internet Archive ------------------------------------------------------

async function snapshot(url, timestamp) {
  const api = `https://archive.org/wayback/available?url=${encodeURIComponent(url)}&timestamp=${timestamp}`;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(api, { headers: { 'user-agent': UA }, signal: AbortSignal.timeout(20000) });
      if (res.status === 429) { await sleep(5000); continue; }
      const j = await res.json();
      const s = j.archived_snapshots && j.archived_snapshots.closest;
      if (s && s.available && String(s.status).startsWith('2')) return s.timestamp;
      return null;
    } catch { await sleep(2000); }
  }
  return null;
}

// ---- main ------------------------------------------------------------------

const files = fs.readdirSync(POSTS).filter(f => f.endsWith('.md')).sort();
const docs = files.map(f => {
  const text = fs.readFileSync(path.join(POSTS, f), 'utf8');
  return { file: f, text, date: postDate(text), links: extract(text) };
});

const uses = new Map(); // url -> { isImage, earliest date }
for (const d of docs) {
  for (const l of d.links) {
    if (OWN_HOSTS.has(hostOf(l.url)) && !/[?&]p=\d+/.test(l.url)) continue;
    if (hostOf(l.url) === 'web.archive.org') continue;
    const u = uses.get(l.url) || { isImage: l.isImage, date: d.date, files: new Set(), kind: l.kind };
    u.isImage = u.isImage || l.isImage;
    if (d.date < u.date) u.date = d.date;
    u.files.add(d.file);
    uses.set(l.url, u);
  }
}

const cache = fs.existsSync(CACHE) ? JSON.parse(fs.readFileSync(CACHE, 'utf8')) : {};
const fresh = r => r && Date.now() - r.checkedAt < CACHE_DAYS * 864e5;
const urls = [...uses.keys()];
console.log(`Checking ${urls.length} external URLs in ${files.length} posts…`);

const results = {};
let done = 0;
await pool(urls, 12, async url => {
  const u = uses.get(url);
  let r;
  if (u.kind === 'embed' && /\.swf(\?|$)/i.test(url)) r = { verdict: 'dead', reason: 'Flash player (unsupported by all browsers)', status: -1 };
  else if (OWN_HOSTS.has(hostOf(url))) r = { verdict: 'dead', reason: 'old WordPress URL on this site', status: -1 };
  else if (fresh(cache[url])) r = cache[url];
  else r = await check(url, u.isImage);
  r.checkedAt = r.checkedAt || Date.now();
  results[url] = r;
  cache[url] = r;
  if (++done % 25 === 0) process.stdout.write(`  ${done}/${urls.length}\n`);
});
fs.writeFileSync(CACHE, JSON.stringify(cache, null, 1));

const dead = urls.filter(u => results[u].verdict === 'dead');
const uncertain = urls.filter(u => results[u].verdict === 'uncertain');
console.log(`\nOK ${urls.length - dead.length - uncertain.length}, uncertain ${uncertain.length}, dead ${dead.length}`);

// Find archive snapshots for dead links/images (not Flash, not own WordPress URLs).
if (FIX || process.argv.includes('--archive')) {
  console.log('Looking up Internet Archive snapshots…');
  for (const url of dead) {
    const r = results[url];
    if (r.reason.startsWith('Flash')) continue;
    if (r.archive === undefined || !fresh(cache[url])) {
      r.archive = await snapshot(url, uses.get(url).date);
      cache[url] = r;
      await sleep(400);
    }
  }
  fs.writeFileSync(CACHE, JSON.stringify(cache, null, 1));
}

const report = urls.map(u => ({ url: u, ...results[u], isImage: uses.get(u).isImage, files: [...uses.get(u).files] }))
  .filter(x => x.verdict !== 'ok')
  .sort((a, b) => a.verdict.localeCompare(b.verdict) || a.url.localeCompare(b.url));
fs.writeFileSync(REPORT, JSON.stringify(report, null, 1));
console.log(`Report: ${path.relative(ROOT, REPORT)}`);

if (!FIX) process.exit(0);

// ---- apply fixes -----------------------------------------------------------

const FLASH_NOTE = '*（这里原本是一段 Flash 视频，现在已无法播放。）*';
const archiveUrl = (url, ts, isImage) => `https://web.archive.org/web/${ts}${isImage ? 'im_' : ''}/${url}`;
const stripTags = s => s.replace(/<[^>]+>/g, '').trim();
const changes = { archived: 0, unlinked: 0, removedImages: 0, flash: 0 };

for (const d of docs) {
  let text = d.text;
  // Replace from the end so earlier offsets stay valid.
  for (const l of [...d.links].reverse()) {
    const r = results[l.url];
    if (!r || r.verdict !== 'dead') continue;
    let replacement;
    if (l.kind === 'embed') { replacement = FLASH_NOTE; changes.flash++; }
    else if (r.archive) {
      // Rewrite only the link target; visible text (which may be the old URL) stays as written.
      const target = archiveUrl(l.url, r.archive, l.isImage);
      if (l.kind === 'md') replacement = l.raw.replace(/\]\(\s*<?[^)\s>]+/, m => m.replace(l.url, target));
      else replacement = l.raw.replace(/(\b(?:href|src)\s*=\s*["'])[^"']+/i, (m, attr) => attr + target).replace(/^<https?:\/\/[^>\s]+>$/, `<${target}>`);
      changes.archived++;
    } else if (l.isImage) {
      const alt = l.kind === 'md' ? l.groups[1] : ((l.raw.match(/\balt\s*=\s*["']([^"']*)["']/i) || [])[1] || '');
      replacement = alt.trim();
      changes.removedImages++;
    } else {
      replacement = l.kind === 'md' ? l.groups[1] : l.kind === 'a' ? stripTags(l.groups[1]) : l.url.replace(/^https?:\/\//, '');
      changes.unlinked++;
    }
    text = text.slice(0, l.start) + replacement + text.slice(l.end);
  }
  if (text !== d.text) fs.writeFileSync(path.join(POSTS, d.file), text);
}
console.log('Fixed:', changes);
