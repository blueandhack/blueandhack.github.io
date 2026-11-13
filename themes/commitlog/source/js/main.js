/* commitlog theme — interactions. No dependencies. */
(function () {
  'use strict';

  var cfgEl = document.getElementById('cl-config');
  var CFG = cfgEl ? JSON.parse(cfgEl.textContent) : { links: {}, i18n: {}, lanes: {} };
  var T = CFG.i18n || {};
  var root = document.documentElement;
  var isMac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }
  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function laneVar(cat) {
    var color = (CFG.lanes && CFG.lanes[cat]) || 'other';
    return 'var(--lane-' + color + ')';
  }

  /* ---------- Modifier key label ---------- */
  $$('[data-mod-key]').forEach(function (k) { k.textContent = isMac ? '⌘ K' : 'Ctrl K'; });

  /* ---------- Theme ---------- */
  function currentTheme() {
    if (root.dataset.theme) return root.dataset.theme;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  function toggleTheme() {
    var next = currentTheme() === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    try { localStorage.setItem('cl-theme', next); } catch (e) {}
    if (typeof syncThemeColor === 'function') syncThemeColor();
    if (window.DISQUS && disqusLoaded) {
      try { window.DISQUS.reset({ reload: true }); } catch (e) {}
    }
  }

  /* ---------- Data ---------- */
  var postsPromise = null;
  function loadPosts() {
    if (!postsPromise) {
      postsPromise = fetch(CFG.postsIndex).then(function (r) { return r.json(); }).catch(function () { return []; });
    }
    return postsPromise;
  }
  var searchPromise = null;
  function loadSearch() {
    if (!searchPromise) {
      searchPromise = fetch(CFG.searchIndex)
        .then(function (r) { return r.json(); })
        .then(function (list) {
          return list.map(function (p) {
            var text = String(p.content || '').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ')
              .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'")
              .replace(/\s+/g, ' ').trim();
            return { url: p.url, title: p.title, text: text, lower: text.toLowerCase() };
          });
        })
        .catch(function () { return []; });
    }
    return searchPromise;
  }

  function randomPost() {
    loadPosts().then(function (posts) {
      if (!posts.length) return;
      var here = location.pathname;
      var pick;
      do { pick = posts[Math.floor(Math.random() * posts.length)]; } while (posts.length > 1 && pick.u === here);
      location.href = pick.u;
    });
  }

  /* ---------- Command palette ---------- */
  var palette = $('#palette');
  var pInput = palette && $('.palette__input', palette);
  var pList = palette && $('.palette__list', palette);
  var pStatus = palette && $('.palette__status', palette);
  var pItems = [];
  var pIndex = 0;
  var pSeq = 0;

  var commands = [
    { label: T.go_home, run: function () { location.href = CFG.links.home; } },
    { label: T.go_archive, run: function () { location.href = CFG.links.archive; } },
    { label: T.go_tags, run: function () { location.href = CFG.links.tags; } },
    { label: T.go_stats, run: function () { location.href = CFG.links.stats; } },
    { label: T.go_about, run: function () { location.href = CFG.links.about; } },
    { label: T.random, run: randomPost },
    { label: T.toggle_theme, run: function () { toggleTheme(); }, keep: true },
    { label: T.rss, run: function () { location.href = CFG.rss; } },
    { label: T.shortcuts, run: function () { openShortcuts(); } }
  ];

  function highlight(text, q) {
    var frag = document.createDocumentFragment();
    if (!q) { frag.appendChild(document.createTextNode(text)); return frag; }
    var i = text.toLowerCase().indexOf(q);
    if (i < 0) { frag.appendChild(document.createTextNode(text)); return frag; }
    frag.appendChild(document.createTextNode(text.slice(0, i)));
    frag.appendChild(el('mark', null, text.slice(i, i + q.length)));
    frag.appendChild(document.createTextNode(text.slice(i + q.length)));
    return frag;
  }

  function addGroup(label) {
    var li = el('li', 'palette__group', label);
    li.setAttribute('role', 'presentation');
    pList.appendChild(li);
  }

  function addItem(opts) {
    var li = el('li', 'palette__item');
    li.id = 'pi-' + pItems.length;
    li.setAttribute('role', 'option');
    if (opts.color) li.style.setProperty('--c', opts.color);
    var sw = el('span', 'palette__swatch' + (opts.command ? ' palette__swatch--cmd' : ''));
    var body = el('span', 'palette__body');
    var title = el('span', 'palette__title');
    title.appendChild(highlight(opts.title, opts.q));
    body.appendChild(title);
    if (opts.snippet) {
      var sn = el('span', 'palette__snippet');
      sn.appendChild(highlight(opts.snippet, opts.q));
      body.appendChild(sn);
    }
    li.appendChild(sw);
    li.appendChild(body);
    li.appendChild(el('span', 'palette__aside', opts.aside || ''));
    var idx = pItems.length;
    li.addEventListener('mousemove', function () { if (pIndex !== idx) select(idx); });
    li.addEventListener('click', function () { activate(idx); });
    pList.appendChild(li);
    pItems.push({ node: li, run: opts.run, keep: opts.keep });
  }

  function select(i) {
    if (!pItems.length) return;
    pIndex = (i + pItems.length) % pItems.length;
    pItems.forEach(function (it, j) { it.node.setAttribute('aria-selected', j === pIndex ? 'true' : 'false'); });
    var cur = pItems[pIndex].node;
    pInput.setAttribute('aria-activedescendant', cur.id);
    cur.scrollIntoView({ block: 'nearest' });
  }

  function activate(i) {
    var it = pItems[i];
    if (!it) return;
    if (!it.keep) palette.close();
    it.run();
  }

  function postItem(p, q) {
    return {
      title: p.t, q: q, aside: p.d, color: laneVar(p.c),
      run: function () { location.href = p.u; }
    };
  }

  function renderPalette() {
    var seq = ++pSeq;
    var raw = pInput.value.trim();
    var q = raw.toLowerCase();
    loadPosts().then(function (posts) {
      if (seq !== pSeq) return;
      pList.textContent = '';
      pItems = [];
      pStatus.textContent = '';

      var cmdMatches = commands.filter(function (c) { return !q || c.label.toLowerCase().indexOf(q) > -1; });

      if (!q) {
        addGroup(T.posts);
        posts.slice(0, 6).forEach(function (p) { addItem(postItem(p, '')); });
        addGroup(T.commands);
        cmdMatches.forEach(function (c) { addItem({ title: c.label, command: true, run: c.run, keep: c.keep }); });
        select(0);
        return;
      }

      var scored = [];
      posts.forEach(function (p) {
        var t = p.t.toLowerCase();
        var et = p.e ? p.e.t.toLowerCase() : '';
        var s = 0;
        var en = false;
        if (t.indexOf(q) === 0) s = 100;
        else if (t.indexOf(q) > -1) s = 80;
        else if (et && et.indexOf(q) > -1) { s = 75; en = true; }
        else if (p.g.some(function (g) { return g.toLowerCase() === q; })) s = 60;
        else if (p.g.some(function (g) { return g.toLowerCase().indexOf(q) > -1; }) || p.c.indexOf(q) > -1) s = 40;
        else if (p.d.indexOf(q) === 0) s = 30;
        if (s) scored.push({ p: p, s: s, en: en });
      });
      scored.sort(function (a, b) { return b.s - a.s || (a.p.d < b.p.d ? 1 : -1); });
      var seen = {};
      if (scored.length) {
        addGroup(T.posts);
        scored.slice(0, 12).forEach(function (x) {
          seen[x.p.u] = true;
          if (x.p.e) seen[x.p.e.u] = true;
          if (x.en) {
            addItem({
              title: x.p.e.t, q: q, aside: 'EN ' + x.p.d, color: laneVar(x.p.c),
              run: function () { location.href = x.p.e.u; }
            });
          } else {
            addItem(postItem(x.p, q));
          }
        });
      }
      if (cmdMatches.length) {
        addGroup(T.commands);
        cmdMatches.forEach(function (c) { addItem({ title: c.label, q: q, command: true, run: c.run, keep: c.keep }); });
      }
      select(0);

      if (q.length < 2) {
        if (!pItems.length) pStatus.textContent = T.empty;
        return;
      }
      pStatus.textContent = T.loading;
      var byUrl = {};
      posts.forEach(function (p) {
        byUrl[p.u] = p;
        if (p.e) byUrl[p.e.u] = { d: 'EN ' + p.d, c: p.c };
      });
      loadSearch().then(function (index) {
        if (seq !== pSeq) return;
        pStatus.textContent = '';
        var hits = [];
        index.forEach(function (doc) {
          if (seen[doc.url]) return;
          var at = doc.lower.indexOf(q);
          if (at < 0) return;
          var start = Math.max(0, at - 18);
          var snippet = (start ? '…' : '') + doc.text.slice(start, at + q.length + 40);
          hits.push({ doc: doc, snippet: snippet });
        });
        if (hits.length) {
          addGroup(T.fulltext);
          hits.slice(0, 12).forEach(function (h) {
            var meta = byUrl[h.doc.url] || {};
            addItem({
              title: h.doc.title, snippet: h.snippet, q: q, aside: meta.d || '',
              color: laneVar(meta.c),
              run: function () { location.href = h.doc.url; }
            });
          });
          if (pIndex === 0) select(0);
        }
        if (!pItems.length) pStatus.textContent = T.empty;
      });
    });
  }

  function openPalette() {
    if (!palette) return;
    if (palette.open) { pInput.select(); return; }
    closeDialogs();
    palette.showModal();
    pInput.value = '';
    renderPalette();
    pInput.focus();
    loadSearch();
  }

  if (palette) {
    pInput.addEventListener('input', renderPalette);
    pInput.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown' || (e.ctrlKey && e.key === 'n')) { e.preventDefault(); select(pIndex + 1); }
      else if (e.key === 'ArrowUp' || (e.ctrlKey && e.key === 'p')) { e.preventDefault(); select(pIndex - 1); }
      else if (e.key === 'Enter') { e.preventDefault(); activate(pIndex); }
    });
    palette.addEventListener('click', function (e) { if (e.target === palette) palette.close(); });
  }

  /* ---------- Color palettes (remembered per browser) ---------- */
  var PALETTES = CFG.palettes || [];
  function currentPalette() { return root.dataset.palette || PALETTES[0]; }
  function syncThemeColor() {
    var paper = getComputedStyle(root).getPropertyValue('--paper').trim();
    $$('meta[name="theme-color"]').forEach(function (m) { m.setAttribute('content', paper); });
  }
  function setPalette(name) {
    if (PALETTES.indexOf(name) < 0) return;
    if (name === PALETTES[0]) delete root.dataset.palette; else root.dataset.palette = name;
    try { localStorage.setItem('cl-palette', name); } catch (e) {}
    $$('.palette-option').forEach(function (b) {
      b.setAttribute('aria-checked', b.getAttribute('data-palette-value') === name ? 'true' : 'false');
    });
    syncThemeColor();
  }
  $$('.palette-option').forEach(function (b) {
    b.setAttribute('aria-checked', b.getAttribute('data-palette-value') === currentPalette() ? 'true' : 'false');
    b.addEventListener('click', function () {
      setPalette(b.getAttribute('data-palette-value'));
      var menu = document.getElementById('palette-menu');
      if (menu && menu.hidePopover) menu.hidePopover();
    });
  });
  PALETTES.forEach(function (name) {
    var label = (T.color || 'Color') + ': ' + ((T.paletteNames || {})[name] || name);
    commands.splice(commands.length - 2, 0, { label: label, run: function () { setPalette(name); }, keep: true });
  });
  if (root.dataset.palette || root.dataset.theme) syncThemeColor();

  /* ---------- Shortcuts dialog ---------- */
  var shortcuts = $('#shortcuts');
  function openShortcuts() {
    if (!shortcuts) return;
    closeDialogs();
    shortcuts.showModal();
  }
  if (shortcuts) shortcuts.addEventListener('click', function (e) { if (e.target === shortcuts) shortcuts.close(); });

  function closeDialogs() { $$('dialog[open]').forEach(function (d) { d.close(); }); }

  /* ---------- Buttons with data-action ---------- */
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-action]');
    if (!b) return;
    var a = b.getAttribute('data-action');
    if (a === 'palette') openPalette();
    else if (a === 'theme') toggleTheme();
    else if (a === 'random') randomPost();
  });

  /* ---------- List selection (j / k / Enter) ---------- */
  var rows = $$('[data-row]');
  var rowIndex = -1;
  function selectRow(i) {
    if (!rows.length) return;
    rowIndex = Math.max(0, Math.min(rows.length - 1, i));
    rows.forEach(function (r, j) { r.classList.toggle('is-selected', j === rowIndex); });
    rows[rowIndex].scrollIntoView({ block: 'nearest', behavior: reduceMotion ? 'auto' : 'smooth' });
  }

  /* ---------- Keyboard ---------- */
  var gPending = 0;
  function isTyping(t) {
    return t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName));
  }
  document.addEventListener('keydown', function (e) {
    if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
      e.preventDefault();
      if (palette && palette.open) palette.close(); else openPalette();
      return;
    }
    if (e.metaKey || e.ctrlKey || e.altKey || isTyping(e.target) || $('dialog[open]')) return;

    var k = e.key;
    if (gPending && Date.now() - gPending < 1200) {
      gPending = 0;
      var dest = { h: CFG.links.home, a: CFG.links.archive, t: CFG.links.tags, s: CFG.links.stats, b: CFG.links.about }[k];
      if (dest) { e.preventDefault(); location.href = dest; }
      return;
    }
    switch (k) {
      case '/': e.preventDefault(); openPalette(); break;
      case '?': e.preventDefault(); openShortcuts(); break;
      case 'g': gPending = Date.now(); break;
      case 't': toggleTheme(); break;
      case 'r': randomPost(); break;
      case 'j':
        if (rows.length) { e.preventDefault(); selectRow(rowIndex + 1); }
        else window.scrollBy({ top: 120, behavior: reduceMotion ? 'auto' : 'smooth' });
        break;
      case 'k':
        if (rows.length) { e.preventDefault(); selectRow(rowIndex - 1); }
        else window.scrollBy({ top: -120, behavior: reduceMotion ? 'auto' : 'smooth' });
        break;
      case 'Enter':
        if (rowIndex > -1 && rows[rowIndex]) {
          var link = $('[data-row-link]', rows[rowIndex]);
          if (link) { e.preventDefault(); link.click(); }
        }
        break;
      case 'h': { var older = $('[data-older]'); if (older) older.click(); break; }
      case 'l': { var newer = $('[data-newer]'); if (newer) newer.click(); break; }
    }
  });

  /* ---------- On this day ---------- */
  var otd = $('[data-on-this-day]');
  if (otd) {
    loadPosts().then(function (posts) {
      var now = new Date();
      var year = now.getFullYear();
      var dayOfYear = function (m, d) { return Math.round((Date.UTC(2001, m - 1, d) - Date.UTC(2001, 0, 1)) / 864e5); };
      var today = dayOfYear(now.getMonth() + 1, now.getDate());
      var pick = function (range) {
        return posts.filter(function (p) {
          var y = +p.d.slice(0, 4);
          if (y >= year) return false;
          var dist = Math.abs(dayOfYear(+p.d.slice(5, 7), +p.d.slice(8, 10)) - today);
          return Math.min(dist, 365 - dist) <= range;
        });
      };
      var found = pick(0);
      if (!found.length) found = pick(3);
      if (!found.length) found = pick(7);
      if (!found.length) return;
      var list = $('.on-this-day__list', otd);
      found.slice(0, 5).forEach(function (p) {
        var li = el('li');
        var t = el('time', null, p.d);
        t.setAttribute('datetime', p.d);
        var a = el('a', null, p.t);
        a.href = p.u;
        li.appendChild(t);
        li.appendChild(a);
        list.appendChild(li);
      });
      otd.hidden = false;
    });
  }

  /* ---------- Reading progress ---------- */
  var bar = $('.progress__bar');
  var prose = $('.is-post [data-prose]');
  if (bar && prose) {
    var ticking = false;
    var update = function () {
      ticking = false;
      var r = prose.getBoundingClientRect();
      var total = r.height - window.innerHeight * 0.6;
      var p = total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 1;
      bar.style.setProperty('--p', p.toFixed(4));
    };
    window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    update();
  }

  /* ---------- TOC active section ---------- */
  var tocLinks = $$('.toc a[href^="#"]');
  if (tocLinks.length && 'IntersectionObserver' in window) {
    var map = {};
    tocLinks.forEach(function (a) { map[decodeURIComponent(a.getAttribute('href').slice(1))] = a; });
    var heads = Object.keys(map).map(function (id) { return document.getElementById(id); }).filter(Boolean);
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          tocLinks.forEach(function (a) { a.classList.remove('is-active'); });
          var a = map[en.target.id];
          if (a) a.classList.add('is-active');
        }
      });
    }, { rootMargin: '-15% 0px -70% 0px' });
    heads.forEach(function (h) { io.observe(h); });
  }

  /* ---------- Code blocks ---------- */
  $$('.prose figure.highlight').forEach(function (fig) {
    var lang = (fig.className.split(/\s+/)[1] || '').replace('plaintext', 'text');
    var table = $('table', fig);
    if (!table) return;
    var scroll = el('div', 'table-scroll');
    table.parentNode.insertBefore(scroll, table);
    scroll.appendChild(table);
    var barEl = el('div', 'code-bar');
    barEl.appendChild(el('span', null, lang || 'code'));
    var btn = el('button', 'code-bar__copy', T.copy);
    btn.type = 'button';
    btn.addEventListener('click', function () {
      var lines = $$('td.code .line', fig).map(function (l) { return l.textContent; });
      var text = lines.length ? lines.join('\n') : ($('td.code', fig) || fig).textContent;
      var done = function () {
        btn.textContent = T.copied;
        btn.classList.add('is-done');
        setTimeout(function () { btn.textContent = T.copy; btn.classList.remove('is-done'); }, 1600);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, function () {});
      } else {
        var ta = el('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy'); done(); } catch (e) {}
        document.body.removeChild(ta);
      }
    });
    barEl.appendChild(btn);
    fig.insertBefore(barEl, fig.firstChild);
  });

  /* ---------- Image lightbox ---------- */
  var lightbox = $('#lightbox');
  if (lightbox) {
    var lbImg = $('.lightbox__img', lightbox);
    var lbCaption = $('[data-lb-caption]', lightbox);
    var lbCount = $('[data-lb-count]', lightbox);
    var lbOrig = $('[data-lb-orig]', lightbox);
    var lbPrev = $('[data-lb-prev]', lightbox);
    var lbNext = $('[data-lb-next]', lightbox);
    var IMG_LINK = /\.(jpe?g|png|gif|webp|avif|svg)(\?.*)?$/i;
    var lbItems = [];
    var lbIndex = 0;

    // The full-size source for an inline image, or null if it isn't viewable.
    var fullSrc = function (img) {
      var link = img.closest('a');
      if (link) return IMG_LINK.test(link.href) ? link.href : null;
      return img.getAttribute('data-full') || img.currentSrc || img.src;
    };
    var captionOf = function (img) {
      var fig = img.closest('figure');
      var cap = fig && fig.querySelector('figcaption');
      return cap ? cap.textContent : '';
    };
    var preload = function (i) {
      var it = lbItems[i];
      if (it) { var p = new Image(); p.src = fullSrc(it); }
    };
    var show = function (i) {
      var n = lbItems.length;
      lbIndex = (i + n) % n;
      var img = lbItems[lbIndex];
      var src = fullSrc(img);
      lightbox.classList.add('is-loading');
      lbImg.onload = function () { lightbox.classList.remove('is-loading'); };
      lbImg.onerror = function () {
        lightbox.classList.remove('is-loading');
        if (lbImg.src !== img.src) lbImg.src = img.src;   // fall back to the inline copy
      };
      lbImg.src = src;
      lbImg.alt = img.alt || '';
      lbCaption.textContent = captionOf(img);
      lbCount.textContent = n > 1 ? (lbIndex + 1) + ' / ' + n : '';
      lbOrig.href = src;
      lightbox.classList.toggle('is-single', n < 2);
      preload(lbIndex + 1);
      preload(lbIndex - 1);
    };

    document.addEventListener('click', function (e) {
      var img = e.target.closest('.prose img');
      if (!img || !fullSrc(img)) return;
      e.preventDefault();
      var prose = img.closest('.prose');
      lbItems = Array.prototype.filter.call(prose.querySelectorAll('img'), function (el) { return fullSrc(el); });
      show(lbItems.indexOf(img));
      lightbox.showModal();
    });
    lbPrev.addEventListener('click', function () { show(lbIndex - 1); });
    lbNext.addEventListener('click', function () { show(lbIndex + 1); });
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox || e.target === lbImg || e.target.classList.contains('lightbox__stage')) lightbox.close();
    });
    lightbox.addEventListener('keydown', function (e) {
      if (lbItems.length < 2) return;
      if (e.key === 'ArrowLeft' || e.key === 'h' || e.key === 'k') { e.preventDefault(); show(lbIndex - 1); }
      if (e.key === 'ArrowRight' || e.key === 'l' || e.key === 'j') { e.preventDefault(); show(lbIndex + 1); }
    });
    var touchX = null;
    lightbox.addEventListener('touchstart', function (e) { touchX = e.touches.length === 1 ? e.touches[0].clientX : null; }, { passive: true });
    lightbox.addEventListener('touchend', function (e) {
      if (touchX === null || lbItems.length < 2) return;
      var dx = e.changedTouches[0].clientX - touchX;
      touchX = null;
      if (Math.abs(dx) > 50) show(lbIndex + (dx < 0 ? 1 : -1));
    });
    lightbox.addEventListener('close', function () { lbImg.removeAttribute('src'); });
  }

  /* ---------- Disqus (loads on demand) ---------- */
  var disqusLoaded = false;
  var thread = $('[data-disqus]');
  function loadDisqus() {
    if (disqusLoaded || !thread || !CFG.disqus) return;
    disqusLoaded = true;
    thread.textContent = '';
    window.disqus_config = function () {
      this.page.url = thread.getAttribute('data-url');
      this.page.identifier = thread.getAttribute('data-identifier');
      this.page.title = thread.getAttribute('data-title');
    };
    var s = document.createElement('script');
    s.src = 'https://' + CFG.disqus + '.disqus.com/embed.js';
    s.setAttribute('data-timestamp', String(+new Date()));
    s.async = true;
    document.body.appendChild(s);
  }
  if (thread) {
    var lb = $('[data-load-comments]', thread);
    if (lb) lb.addEventListener('click', loadDisqus);
    if ('IntersectionObserver' in window) {
      var dio = new IntersectionObserver(function (entries) {
        if (entries.some(function (en) { return en.isIntersecting; })) { dio.disconnect(); loadDisqus(); }
      }, { rootMargin: '600px 0px' });
      dio.observe(thread);
    }
  }

  /* ---------- Email (stored base64-encoded, assembled on demand) ---------- */
  function decodeEmail(node) {
    try { return atob(node.getAttribute('data-email')); } catch (e) { return ''; }
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest('[data-email]');
    if (!a) return;
    var addr = decodeEmail(a);
    if (!addr) return;
    e.preventDefault();
    location.href = 'mailto:' + addr;
  });
  // On the Links page, reveal the address once a person interacts with the card.
  $$('[data-email]').forEach(function (a) {
    var slot = $('[data-email-text]', a);
    if (!slot) return;
    var show = function () { slot.textContent = decodeEmail(a); };
    a.addEventListener('pointerenter', show, { once: true });
    a.addEventListener('focus', show, { once: true });
  });

  /* ---------- Comment counts (Disqus count-data, one request per page) ---------- */
  var countEls = $$('[data-comments]');
  if (CFG.disqus && countEls.length) {
    var byId = {};
    countEls.forEach(function (el) {
      var id = el.getAttribute('data-comments');
      (byId[id] = byId[id] || []).push(el);
    });
    window.DISQUSWIDGETS = window.DISQUSWIDGETS || {};
    window.DISQUSWIDGETS.displayCount = function (data) {
      (data && data.counts || []).forEach(function (c) {
        var n = Number(c.comments) || 0;
        if (!n) return;
        (byId[c.id] || []).forEach(function (el) {
          var label = n === 1 ? T.commentOne : String(T.commentMany).replace('{n}', n);
          var span = $('span', el);
          span.textContent = el.hasAttribute('data-comments-bare') ? String(n) : label;
          el.setAttribute('aria-label', label);
          el.hidden = false;
          var meta = el.closest('[data-comment-meta]');
          if (meta) meta.hidden = false;
        });
      });
    };
    var loadCounts = function () {
      var qs = Object.keys(byId).map(function (id) { return '1=' + encodeURIComponent(id); }).join('&');
      var s = document.createElement('script');
      s.src = 'https://' + CFG.disqus + '.disqus.com/count-data.js?' + qs;
      s.async = true;
      document.body.appendChild(s);
    };
    if ('requestIdleCallback' in window) requestIdleCallback(loadCounts, { timeout: 2500 });
    else setTimeout(loadCounts, 800);
  }

  /* ---------- 404 ---------- */
  var missing = $('[data-missing-path]');
  if (missing) missing.textContent = location.pathname;
})();
