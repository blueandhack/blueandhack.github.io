#!/usr/bin/env node
// Validate staged translations before they are imported (no Hexo, safe to run in parallel).
//   node tools/check-staging.mjs a.md b.md ...     (file names in source/_posts and tools/.staging)
// Checks: <title>/<body> format, non-empty title/body, <!-- more --> count, every URL kept,
// no Chinese left outside code (except the original's own CJK names in URLs/code).

import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const files = process.argv.slice(2);
let bad = 0;

const stripCode = s => s.replace(/```[\s\S]*?```/g, '').replace(/`[^`\n]*`/g, '');
for (const f of files) {
  const problems = [];
  const orig = fs.readFileSync(path.join(ROOT, 'source/_posts', f), 'utf8').split(/^---$/m).slice(2).join('---');
  const stagedPath = path.join(ROOT, 'tools/.staging', f);
  if (!fs.existsSync(stagedPath)) { console.log(`✗ ${f}: not staged`); bad++; continue; }
  const staged = fs.readFileSync(stagedPath, 'utf8');
  const m = staged.match(/^\s*<title>([\s\S]*?)<\/title>\s*<body>\n?([\s\S]*?)\n?<\/body>\s*$/);
  if (!m) problems.push('not in <title>…</title><body>…</body> format');
  else {
    const [, title, body] = m;
    if (!title.trim()) problems.push('empty title');
    if (!body.trim()) problems.push('empty body');
    const more = s => (s.match(/<!--\s*more\s*-->/g) || []).length;
    if (more(orig) !== more(body)) problems.push(`<!-- more --> count ${more(orig)} -> ${more(body)}`);
    const urls = s => new Set(s.match(/https?:\/\/[^\s)"'<>\]\u3000-\u303f\uff00-\uffef]+/g) || []);
    const missing = [...urls(orig)].filter(u => !body.includes(u));
    if (missing.length) problems.push(`missing URLs: ${missing.slice(0, 3).join(' , ')}`);
    const leftover = stripCode(body).replace(/https?:\/\/\S+/g, '').match(/[㐀-鿿]+/g);
    if (leftover) problems.push(`Chinese left in text (check it is intended): ${[...new Set(leftover)].slice(0, 5).join(' ')}`);
  }
  if (problems.length) { bad++; console.log(`✗ ${f}\n  - ${problems.join('\n  - ')}`); }
  else console.log(`✓ ${f}`);
}
process.exit(bad ? 1 : 0);
