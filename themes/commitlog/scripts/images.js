/* global hexo */
'use strict';

// Post images: sizes, lazy loading, lighter inline copies, captions.
//
// Image facts come from source/_data/images.json, keyed by the path after the
// CDN host:
//   "images/2015/01/bye-2014/x.jpg": {
//     "w": 3552, "h": 2000,                       // the file the post links to
//     "src": "images/.../x-1280w.webp", "sw": 1280, "sh": 721,  // optional inline copy
//     "full": "images/.../x-big.jpg", "fw": 2048, "fh": 1536    // optional larger original
//   }
// Images not listed there still get lazy loading.

const CDN = 'https://cdn.blueandhack.com/';
const IMG = /<img\b[^>]*>/gi;
// A paragraph holding only images (plus whitespace or <br>).
const IMAGE_PARA = /<p>((?:\s|<br\s*\/?>)*<img\b[^>]*>(?:(?:\s|<br\s*\/?>)*<img\b[^>]*>)*(?:\s|<br\s*\/?>)*)<\/p>/gi;

const attr = (tag, name) => {
  const m = tag.match(new RegExp(`\\s${name}="([^"]*)"`, 'i'));
  return m ? m[1] : null;
};
const setAttr = (tag, name, value) => {
  const re = new RegExp(`\\s${name}="[^"]*"`, 'i');
  const pair = ` ${name}="${value}"`;
  return re.test(tag) ? tag.replace(re, pair) : tag.replace(/\s*\/?>$/, `${pair}>`);
};

const unescape = s => s.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');

function keyOf(src) {
  if (!src || !src.startsWith(CDN)) return null;
  try { return decodeURIComponent(src.slice(CDN.length).split(/[?#]/)[0]); } catch (e) { return null; }
}

// Alt text worth showing as a caption: not empty, generic, or just a filename.
function caption(alt, src) {
  const a = unescape(alt || '').trim();
  if (!a || /^(image|img|photo|picture|图片|图像|截图)$/i.test(a)) return '';
  if (/\.(jpe?g|png|gif|webp|bmp)$/i.test(a)) return '';
  if (/^[A-Za-z]*\d[\w-]*$/.test(a)) return '';              // p0204_0003, IMG_0029
  const stem = (keyOf(src) || src || '').split('/').pop().replace(/\.\w+$/, '')
    .replace(/-1280w$/, '').replace(/_thumb/i, '').replace(/-\d+x\d+$/, '').toLowerCase();
  if (a.toLowerCase() === stem) return '';
  return alt.trim();
}

function enhanceImg(tag, data, index) {
  const src = attr(tag, 'src');
  const key = keyOf(src);
  const e = key && data[key];
  let out = tag;
  if (e) {
    const inline = e.src ? { url: CDN + e.src, w: e.sw, h: e.sh } : { url: src, w: e.w, h: e.h };
    const full = e.full ? CDN + e.full : (e.src ? src : null);
    out = setAttr(out, 'src', inline.url);
    if (!attr(out, 'width')) out = setAttr(out, 'width', inline.w);
    if (!attr(out, 'height')) out = setAttr(out, 'height', inline.h);
    if (full) out = setAttr(out, 'data-full', full);
    if (e.full) out = setAttr(out, 'data-zoomable', '');
  }
  if (!attr(out, 'alt')) out = setAttr(out, 'alt', '');
  if (!attr(out, 'loading')) out = setAttr(out, 'loading', index === 0 ? 'eager' : 'lazy');
  if (!attr(out, 'decoding')) out = setAttr(out, 'decoding', 'async');
  return out;
}

function figure(img) {
  const cap = caption(attr(img, 'alt'), attr(img, 'src'));
  return `<figure class="figure">${img}${cap ? `<figcaption>${cap}</figcaption>` : ''}</figure>`;
}

hexo.extend.filter.register('after_post_render', function (post) {
  if (!post.content || !/<img\b/i.test(post.content)) return post;
  const data = (hexo.locals.get('data') || {}).images || {};
  let i = 0;
  let html = post.content.replace(IMG, tag => enhanceImg(tag, data, i++));
  html = html.replace(IMAGE_PARA, (whole, inner) => {
    const imgs = inner.match(IMG);
    if (imgs.length === 1) return figure(imgs[0]);
    return `<div class="figure-row">${imgs.map(figure).join('')}</div>`;
  });
  post.content = html;
  return post;
});

module.exports = { caption, keyOf };
