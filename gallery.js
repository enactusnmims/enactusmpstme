/* Renders gallerySections (gallery-data.js) into #gSections. Self-contained, no globals besides gallerySections. */
(function () {
  var data = (typeof gallerySections !== 'undefined') ? gallerySections : [];
  var host = document.getElementById('gSections');
  if (!host || !data.length) return;

  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var ROTS = [-2, 1.5, -1, 2, -1.6, 1.1, -0.8, 1.8];
  var prints = [], firstImg = true;

  data.forEach(function (sec) {
    if (!sec.items || !sec.items.length) return;       /* no photos = no section */
    var portrait = sec.layout === 'portrait';
    var wrap = document.createElement('div');
    wrap.className = 'g-sec'; wrap.id = 'g-' + sec.id;
    wrap.innerHTML = (sec.title || sec.note) ? '<div class="g-sec-head"><h3 class="g-sec-title">' + (sec.title || '') +
      '</h3><p class="g-sec-note">' + esc(sec.note) + '</p></div>' : '';
    var board = document.createElement('div');
    board.className = 'g-board ' + (portrait ? 'g-board--portrait' : 'g-board--natural');

    sec.items.forEach(function (it, n) {
      var fig = document.createElement('figure');
      fig.className = 'g-print' + (portrait ? ' g-print--portrait' : '');
      fig.tabIndex = 0; fig.setAttribute('role', 'button');
      fig.setAttribute('aria-label', 'Open ' + it.caption);
      fig.dataset.full = it.full;
      fig.style.setProperty('--rot', ROTS[n % ROTS.length] + 'deg');
      fig.style.setProperty('--i', n);
      fig.innerHTML = '<img src="' + esc(it.thumb) + '" alt="' + esc(it.alt || it.caption) +
        '" width="' + it.w + '" height="' + it.h + '"' + (firstImg ? '' : ' loading="lazy"') +
        '><figcaption><b>' + esc(it.caption) + '</b><span>' + esc(it.meta) + '</span></figcaption>';
      firstImg = false;
      board.appendChild(fig); prints.push(fig);
    });
    wrap.appendChild(board); host.appendChild(wrap);

    /* drop-in, once per section */
    if (!reduce && 'IntersectionObserver' in window) {
      var ps = [].slice.call(board.children);
      ps.forEach(function (p) { p.classList.add('g-hold'); });
      new IntersectionObserver(function (e, o) {
        if (!e[0].isIntersecting) return;
        ps.forEach(function (p) { p.classList.remove('g-hold'); p.classList.add('g-drop'); });
        o.disconnect();
      }, { threshold: 0.08 }).observe(board);
    }
  });
  if (!prints.length) return;

  /* lightbox */
  var lb = document.createElement('div');
  lb.className = 'g-lb'; lb.hidden = true;
  lb.setAttribute('role', 'dialog'); lb.setAttribute('aria-modal', 'true'); lb.setAttribute('aria-label', 'Photo viewer');
  lb.innerHTML = '<button class="g-lb-btn g-lb-close" aria-label="Close">\u2715</button>' +
    '<button class="g-lb-btn g-lb-prev" aria-label="Previous photo">\u2039</button><img class="g-lb-img" alt="">' +
    '<button class="g-lb-btn g-lb-next" aria-label="Next photo">\u203A</button>' +
    '<div class="g-lb-cap"><b></b><span></span></div>';
  document.body.appendChild(lb);
  var img = lb.querySelector('.g-lb-img'), cap = lb.querySelector('.g-lb-cap'), cur = 0, opener = null;
  var btns = [].slice.call(lb.querySelectorAll('.g-lb-btn'));

  function show(i) {
    cur = (i + prints.length) % prints.length; var p = prints[cur];
    img.src = p.dataset.full; img.alt = p.querySelector('img').alt;
    img.style.animation = 'none'; void img.offsetWidth; img.style.animation = '';
    cap.querySelector('b').textContent = p.querySelector('b').textContent;
    var meta = p.querySelector('span').textContent;
    cap.querySelector('span').textContent = (cur + 1) + ' / ' + prints.length + (meta ? '  \u00B7  ' + meta : '');
  }
  function open(p) { opener = p; show(prints.indexOf(p)); lb.hidden = false; document.body.style.overflow = 'hidden'; btns[0].focus(); }
  function close() { lb.hidden = true; document.body.style.overflow = ''; if (opener) opener.focus(); }

  prints.forEach(function (p) {
    p.addEventListener('click', function () { open(p); });
    p.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(p); } });
  });
  btns[0].onclick = close; btns[1].onclick = function () { show(cur - 1); }; btns[2].onclick = function () { show(cur + 1); };
  lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
  document.addEventListener('keydown', function (e) {
    if (lb.hidden) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowLeft') show(cur - 1);
    else if (e.key === 'ArrowRight') show(cur + 1);
    else if (e.key === 'Tab') { var i = btns.indexOf(document.activeElement);
      e.preventDefault(); btns[(i + (e.shiftKey ? -1 : 1) + btns.length) % btns.length].focus(); }
  });
  var x0 = null;
  lb.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', function (e) { if (x0 === null) return;
    var d = e.changedTouches[0].clientX - x0; if (Math.abs(d) > 50) show(cur + (d < 0 ? 1 : -1)); x0 = null; });
})();
