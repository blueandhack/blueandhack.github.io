#!/usr/bin/env node
// Translate Chinese posts into English with Claude.
//
//   yarn translate                    translate every post that is new or changed since its last translation
//   yarn translate --dry-run          show what would be translated, without calling the API
//   yarn translate --only a.md,b.md   translate just these posts (file names in source/_posts)
//   yarn translate --max 10           translate at most 10 posts this run
//   yarn translate --force            re-translate even if up to date or edited by hand
//
// Each English version is written to source/en/<same path as the original>.md, e.g.
//   source/_posts/10-10-2023.md  ->  source/en/notes-of-life/2023/10/10/10-10-2023.md
// and is served at /en/notes-of-life/2023/10/10/10-10-2023.html.
//
// Posts that are already in English are skipped. A translation records a hash of the
// original (`source_hash`) and of its own body (`translation_hash`), so:
//   - unchanged originals are never re-translated (no cost),
//   - edited originals are re-translated,
//   - translations you polished by hand are never overwritten (unless --force).
//
// Credentials: ANTHROPIC_API_KEY (or ANTHROPIC_AUTH_TOKEN / an `ant auth login` profile).

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import Hexo from 'hexo';
import Anthropic from '@anthropic-ai/sdk';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const OUT_DIR = path.join(ROOT, 'source/en');
const MODEL = 'claude-opus-5-5';
const PRICE = { input: 4, output: 20 }; // USD per million tokens (Claude Opus 5.5), for the cost estimate
const CONCURRENCY = 4;

const args = process.argv.slice(2);
const flag = name => args.includes(name);
const option = name => { const i = args.indexOf(name); return i > -1 ? args[i + 1] : undefined; };
const DRY = flag('--dry-run');
const FORCE = flag('--force');
const MAX = option('--max') ? Number(option('--max')) : Infinity;
const ONLY = option('--only') ? new Set(option('--only').split(',').map(s => s.trim())) : null;

const sha1 = s => crypto.createHash('sha1').update(s).digest('hex');

// ---- language detection ----------------------------------------------------

const CJK = /[㐀-鿿豈-﫿]/g;
function chineseShare(markdown) {
  const text = markdown
    .replace(/```[\s\S]*?```/g, '')
    .replace(/https?:\/\/\S+/g, '')
    .replace(/<[^>]+>/g, '');
  const cjk = (text.match(CJK) || []).length;
  const words = (text.match(/[A-Za-z]{2,}/g) || []).length;
  return cjk / Math.max(1, cjk + words);
}

// ---- existing translations -------------------------------------------------

function readFrontMatter(file) {
  const raw = fs.readFileSync(file, 'utf8');
  const m = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) return { meta: {}, body: raw };
  const meta = {};
  for (const line of m[1].split('\n')) {
    const kv = line.match(/^(\w+):\s*(.*)$/);
    if (kv) meta[kv[1]] = kv[2].replace(/^"(.*)"$/, '$1');
  }
  return { meta, body: m[2] };
}

// ---- prompt ----------------------------------------------------------------

const SYSTEM = `You translate posts from a personal Chinese blog into English for English-speaking readers. The blog (blueandhack) was written between 2010 and 2023 by a programmer who grew up in China and later moved to the US: diary entries, notes on life, school and work, and early tutorials about WordPress, PHP, C and Linux.

Write natural, idiomatic English that keeps the author's voice: casual, personal, sometimes sentimental, sometimes joking. Translate the meaning rather than word by word. Render Chinese idioms, internet slang and wordplay with natural English equivalents, and add a few words of context only where an English reader would otherwise be lost. Keep the first person.

Write people's Chinese names in pinyin, and well-known places, companies and products by their usual English names. Leave online handles and nicknames as they are.

The post is Markdown with some inline HTML. Keep its structure exactly: the same paragraphs, headings, lists, blockquotes, tables and line breaks, and the <!-- more --> marker in the same place. Translate link text and image alt text, but copy every URL, file path, HTML tag and attribute unchanged. Copy code blocks and inline code exactly as written, including any Chinese inside them. Do not add notes, a summary or a translator's preface.

Reply in exactly this format and nothing else:
<title>the English title</title>
<body>
the translated Markdown
</body>`;

// ---- API -------------------------------------------------------------------

let client;
function api() {
  if (!client) client = new Anthropic({ maxRetries: 4 });
  return client;
}

const usage = { input: 0, output: 0 };

async function translate(post) {
  const stream = api().beta.messages.stream({
    model: MODEL,
    max_tokens: 64000,
    output_config: { effort: 'medium' },
    // If a safety classifier declines the request, re-run it on Anthropic's recommended fallback model.
    betas: ['server-side-fallback-2026-07-01'],
    fallbacks: 'default',
    system: SYSTEM,
    messages: [{
      role: 'user',
      content: `<original_title>${post.title}</original_title>\n<original_body>\n${post._content.trim()}\n</original_body>`
    }]
  });
  const message = await stream.finalMessage();

  usage.input += (message.usage.input_tokens || 0) + (message.usage.cache_creation_input_tokens || 0) + (message.usage.cache_read_input_tokens || 0);
  usage.output += message.usage.output_tokens || 0;

  if (message.stop_reason === 'refusal') throw new Error('the model declined to translate this post');
  if (message.stop_reason === 'max_tokens') throw new Error('the translation was cut off (post too long)');

  const text = message.content.filter(b => b.type === 'text').map(b => b.text).join('');
  const m = text.match(/<title>([\s\S]*?)<\/title>\s*<body>\n?([\s\S]*?)\n?<\/body>\s*$/);
  if (!m) throw new Error('reply was not in the expected <title>/<body> format');
  const title = m[1].trim();
  const body = m[2].replace(/\s+$/, '') + '\n';

  // Sanity checks: nothing structural should be lost in translation.
  const warnings = [];
  const more = s => (s.match(/<!--\s*more\s*-->/g) || []).length;
  if (more(post._content) !== more(body)) warnings.push('<!-- more --> marker count changed');
  const urls = s => new Set(s.match(/https?:\/\/[^\s)"'<>\]]+/g) || []);
  const missing = [...urls(post._content)].filter(u => !body.includes(u));
  if (missing.length) warnings.push(`URLs missing in translation: ${missing.slice(0, 3).join(', ')}`);
  return { title, body, warnings, model: message.model };
}

// ---- main ------------------------------------------------------------------

const hexo = new Hexo(ROOT, { silent: true });
await hexo.init();
await hexo.load();
const posts = hexo.locals.get('posts').sort('-date').toArray();

const plan = [];
const counts = { english: 0, upToDate: 0, edited: 0, todo: 0 };
for (const post of posts) {
  const file = path.basename(post.source);
  if (ONLY && !ONLY.has(file)) continue;
  if (chineseShare(post._content) < 0.3) { counts.english++; continue; }

  const out = path.join(OUT_DIR, post.path.replace(/\.html$/, '') + '.md');
  const sourceHash = sha1(post.raw);
  let reason = 'new';
  if (fs.existsSync(out)) {
    const { meta, body } = readFrontMatter(out);
    const handEdited = meta.translation_hash && meta.translation_hash !== sha1(body);
    if (meta.source_hash === sourceHash && !FORCE) { counts.upToDate++; continue; }
    if (handEdited && !FORCE) {
      counts.edited++;
      console.warn(`! ${file}: original changed, but its translation was edited by hand. Kept as is (use --force to re-translate).`);
      continue;
    }
    reason = meta.source_hash === sourceHash ? 'forced' : 'original changed';
  }
  plan.push({ post, file, out, sourceHash, reason });
}

// Translations whose original no longer exists.
const known = new Set(posts.map(p => path.join(OUT_DIR, p.path.replace(/\.html$/, '') + '.md')));
const orphans = [];
(function walk(dir) {
  if (!fs.existsSync(dir)) return;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (p.endsWith('.md') && !known.has(p)) orphans.push(path.relative(ROOT, p));
  }
})(OUT_DIR);

const queue = plan.slice(0, MAX);
counts.todo = queue.length;
console.log(`Posts: ${counts.english} already in English, ${counts.upToDate} up to date, ${counts.edited} kept (edited by hand), ${plan.length} to translate${plan.length > queue.length ? ` (this run: ${queue.length}, --max)` : ''}.`);
if (orphans.length) console.log(`Translations without an original (delete them if the post was removed):\n  ${orphans.join('\n  ')}`);

if (DRY || !queue.length) {
  for (const t of queue) console.log(`  would translate ${t.file} (${t.reason}) -> ${path.relative(ROOT, t.out)}`);
  await hexo.exit();
  process.exit(0);
}

let failed = 0;
let next = 0;
await Promise.all(Array.from({ length: Math.min(CONCURRENCY, queue.length) }, async () => {
  while (next < queue.length) {
    const t = queue[next++];
    const started = Date.now();
    try {
      const { title, body, warnings, model } = await translate(t.post);
      const front = [
        '---',
        `title: ${JSON.stringify(title)}`,
        `date: ${t.post.date.format('YYYY-MM-DD HH:mm:ss')}`,
        'layout: translation',
        'lang: en',
        `original: ${JSON.stringify(t.post.source)}`,
        `source_hash: ${t.sourceHash}`,
        `translation_hash: ${sha1(body)}`,
        `translated_by: ${model}`,
        '---',
        ''
      ].join('\n');
      fs.mkdirSync(path.dirname(t.out), { recursive: true });
      fs.writeFileSync(t.out, front + body);
      console.log(`✓ ${t.file} -> ${title} (${((Date.now() - started) / 1000).toFixed(0)}s)`);
      for (const w of warnings) console.warn(`  ! ${w}`);
    } catch (err) {
      failed++;
      if (err instanceof Anthropic.AuthenticationError) {
        console.error('✗ No valid Claude API credentials. Set ANTHROPIC_API_KEY (or run `ant auth login`) and try again.');
        process.exit(1);
      }
      console.error(`✗ ${t.file}: ${err.message}`);
    }
  }
}));

const cost = (usage.input * PRICE.input + usage.output * PRICE.output) / 1e6;
console.log(`\nDone: ${queue.length - failed} translated, ${failed} failed. Tokens: ${usage.input} in, ${usage.output} out (about $${cost.toFixed(2)}).`);
await hexo.exit();
process.exit(failed ? 1 : 0);
