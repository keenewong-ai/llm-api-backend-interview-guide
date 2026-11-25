// LLM API Backend 面試實戰指南 — 課堂進度、copy 按鈕、語法高亮
(function () {
  var STORAGE_KEY = "llmInterviewGuide.completed.v1";
  var LESSONS = ["rate-limit", "streaming", "structured", "rag", "fallback", "caching", "gateway"];
  var TOTAL = LESSONS.length;

  function loadCompleted() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      var arr = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(arr)) arr = [];
      return arr.filter(function (id) { return LESSONS.indexOf(id) !== -1; });
    } catch (e) {
      return [];
    }
  }

  function saveCompleted(arr) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
  }

  function isDone(id) {
    return loadCompleted().indexOf(id) !== -1;
  }

  function setDone(id, done) {
    var arr = loadCompleted().filter(function (x) { return x !== id; });
    if (done) arr.push(id);
    saveCompleted(arr);
    return arr;
  }

  function doneCount() {
    return loadCompleted().length;
  }

  // 1. Syntax highlighting (CDN failure should not break reading)
  if (window.hljs) {
    document.querySelectorAll("pre code").forEach(function (el) {
      window.hljs.highlightElement(el);
    });
  }

  // 2. Copy buttons
  document.querySelectorAll("pre").forEach(function (pre) {
    var wrap = pre.closest(".code-block") || pre;
    if (wrap === pre) { pre.style.position = "relative"; }
    var btn = document.createElement("button");
    btn.className = "copy-btn";
    btn.type = "button";
    btn.textContent = "Copy";
    btn.addEventListener("click", function () {
      var text = pre.querySelector("code") ? pre.querySelector("code").innerText : pre.innerText;
      var done = function () {
        btn.textContent = "已複製 ✓";
        btn.classList.add("copied");
        setTimeout(function () { btn.textContent = "Copy"; btn.classList.remove("copied"); }, 1600);
      };
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(done, fallback);
      } else { fallback(); }
      function fallback() {
        var ta = document.createElement("textarea");
        ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
        document.body.appendChild(ta); ta.select();
        try { document.execCommand("copy"); done(); } catch (e) { btn.textContent = "複製失敗"; }
        document.body.removeChild(ta);
      }
    });
    wrap.appendChild(btn);
  });

  // 3. Nav smooth scroll for in-page anchors
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('nav a[href^="#"]'));
  navLinks.forEach(function (a) {
    a.addEventListener("click", function (e) {
      var target = document.querySelector(a.getAttribute("href"));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", a.getAttribute("href"));
    });
  });

  // 4. Current-section highlight + reading progress + back-to-top
  var sections = navLinks
    .map(function (a) { return document.querySelector(a.getAttribute("href")); })
    .filter(Boolean);
  var progress = document.getElementById("progress");
  var toTop = document.getElementById("to-top");
  var navBar = document.querySelector("nav .container");
  var lastActive = null;

  function onScroll() {
    var y = window.scrollY;
    var current = sections.length ? sections[0].id : "";
    sections.forEach(function (s) { if (y >= s.offsetTop - 120) current = s.id; });
    if ((window.innerHeight + y) >= document.body.scrollHeight - 4 && sections.length) {
      current = sections[sections.length - 1].id;
    }
    if (current !== lastActive) {
      lastActive = current;
      navLinks.forEach(function (a) {
        var on = a.getAttribute("href") === "#" + current;
        a.classList.toggle("active", on);
        if (on && navBar && navBar.scrollWidth > navBar.clientWidth) {
          navBar.scrollTo({ left: a.offsetLeft - navBar.clientWidth / 2 + a.clientWidth / 2, behavior: "smooth" });
        }
      });
    }
    var max = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) progress.style.width = (max > 0 ? (y / max) * 100 : 0) + "%";
    if (toTop) toTop.classList.toggle("show", y > 600);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll();
  if (toTop) toTop.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: "smooth" }); });

  // 5. Home page progress
  function renderHomeProgress() {
    var n = doneCount();
    var countEl = document.getElementById("progress-count");
    var fill = document.getElementById("progress-fill");
    var bar = document.getElementById("progress-bar");
    if (countEl) countEl.textContent = n + "/" + TOTAL;
    if (fill) fill.style.width = (n / TOTAL) * 100 + "%";
    if (bar) bar.setAttribute("aria-valuenow", String(n));
    document.querySelectorAll(".lesson-card[data-lesson]").forEach(function (card) {
      var id = card.getAttribute("data-lesson");
      card.classList.toggle("is-done", isDone(id));
    });
  }
  if (document.body.classList.contains("page-home")) {
    renderHomeProgress();
  }

  // 6. Lesson complete button (persisted in localStorage)
  function renderCompleteButtons(done) {
    document.querySelectorAll("[data-complete-btn]").forEach(function (btn) {
      btn.classList.toggle("is-done", done);
      btn.setAttribute("aria-pressed", done ? "true" : "false");
      btn.textContent = done ? "已完成 ✓（撳一下取消）" : "標記為已完成";
    });
  }

  var lessonId = document.body.getAttribute("data-lesson");
  if (lessonId && LESSONS.indexOf(lessonId) !== -1) {
    renderCompleteButtons(isDone(lessonId));
    document.querySelectorAll("[data-complete-btn]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var next = !isDone(lessonId);
        setDone(lessonId, next);
        renderCompleteButtons(next);
      });
    });
  }
})();

