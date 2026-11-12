// LLM API Backend 面試實戰指南 — 導航高亮、copy 按鈕、語法高亮、閱讀進度
(function () {
  // 1. 語法高亮（CDN 載唔到都唔影響閱讀）
  if (window.hljs) {
    document.querySelectorAll('pre code').forEach(function (el) { window.hljs.highlightElement(el); });
  }

  // 2. Copy 按鈕
  document.querySelectorAll('pre').forEach(function (pre) {
    var wrap = pre.closest('.code-block') || pre;
    if (wrap === pre) { pre.style.position = 'relative'; }
    var btn = document.createElement('button');
    btn.className = 'copy-btn';
    btn.type = 'button';
    btn.textContent = 'Copy';
    btn.addEventListener('click', function () {
      var text = pre.querySelector('code') ? pre.querySelector('code').innerText : pre.innerText;
      var done = function () {
        btn.textContent = '已複製 ✓';
        btn.classList.add('copied');
        setTimeout(function () { btn.textContent = 'Copy'; btn.classList.remove('copied'); }, 1600);
      };
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(done, fallback);
      } else { fallback(); }
      function fallback() {
        var ta = document.createElement('textarea');
        ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
        document.body.appendChild(ta); ta.select();
        try { document.execCommand('copy'); done(); } catch (e) { btn.textContent = '複製失敗'; }
        document.body.removeChild(ta);
      }
    });
    wrap.appendChild(btn);
  });

  // 3. Nav 平滑滾動
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('nav a[href^="#"]'));
  navLinks.forEach(function (a) {
    a.addEventListener('click', function (e) {
      var target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.replaceState(null, '', a.getAttribute('href'));
    });
  });

  // 4. 當前章節高亮 + 閱讀進度 + 返回頂部
  var sections = navLinks
    .map(function (a) { return document.querySelector(a.getAttribute('href')); })
    .filter(Boolean);
  var progress = document.getElementById('progress');
  var toTop = document.getElementById('to-top');
  var navBar = document.querySelector('nav .container');
  var lastActive = null;

  function onScroll() {
    var y = window.scrollY;
    var current = sections.length ? sections[0].id : '';
    sections.forEach(function (s) { if (y >= s.offsetTop - 120) current = s.id; });
    if ((window.innerHeight + y) >= document.body.scrollHeight - 4 && sections.length) {
      current = sections[sections.length - 1].id;
    }
    if (current !== lastActive) {
      lastActive = current;
      navLinks.forEach(function (a) {
        var on = a.getAttribute('href') === '#' + current;
        a.classList.toggle('active', on);
        if (on && navBar && navBar.scrollWidth > navBar.clientWidth) {
          navBar.scrollTo({ left: a.offsetLeft - navBar.clientWidth / 2 + a.clientWidth / 2, behavior: 'smooth' });
        }
      });
    }
    var max = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) progress.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';
    if (toTop) toTop.classList.toggle('show', y > 600);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  if (toTop) toTop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
})();
