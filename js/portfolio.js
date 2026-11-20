/* Benitha Ishimwe — portfolio interactions (no dependencies) */
(function () {
  'use strict';

  var root = document.documentElement;
  var GITHUB_USER = 'Benitish1';

  /* ---------- Theme toggle ---------- */
  var themeBtn = document.querySelector('.theme-toggle');
  var themeMeta = document.querySelector('meta[name="theme-color"]');
  function applyTheme(t) {
    root.setAttribute('data-theme', t);
    if (themeMeta) themeMeta.setAttribute('content', t === 'light' ? '#f6f6f3' : '#0b0d10');
  }
  applyTheme(root.getAttribute('data-theme') || 'dark');
  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      applyTheme(next);
      try { localStorage.setItem('theme', next); } catch (e) {}
    });
  }

  /* ---------- Header: scrolled state ---------- */
  var header = document.querySelector('.site-header');
  function onScroll() { header.classList.toggle('is-scrolled', window.scrollY > 8); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  var menuBtn = document.querySelector('.menu-toggle');
  var menu = document.getElementById('mobile-menu');
  function setMenu(open) {
    menu.classList.toggle('is-open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menuBtn.querySelector('use').setAttribute('href', open ? '#i-close' : '#i-menu');
  }
  if (menuBtn && menu) {
    menuBtn.addEventListener('click', function () { setMenu(!menu.classList.contains('is-open')); });
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
    window.addEventListener('resize', function () { if (window.innerWidth > 960) setMenu(false); });
  }

  /* ---------- Active nav link ---------- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-links a'));
  if ('IntersectionObserver' in window && navLinks.length) {
    var byId = {};
    navLinks.forEach(function (a) { byId[a.getAttribute('href').slice(1)] = a; });
    var navObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting && byId[en.target.id]) {
          navLinks.forEach(function (a) { a.classList.remove('is-active'); });
          byId[en.target.id].classList.add('is-active');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(byId).forEach(function (id) {
      var el = document.getElementById(id);
      if (el) navObs.observe(el);
    });
  }

  /* ---------- Reveal on scroll ---------- */
  var reveals = document.querySelectorAll('.reveal');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!('IntersectionObserver' in window) || reduce) {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var revObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-visible'); revObs.unobserve(en.target); }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (el) { revObs.observe(el); });
  }

  /* ---------- Project images: fade in when loaded ---------- */
  document.querySelectorAll('.project-media img').forEach(function (img) {
    var media = img.closest('.project-media');
    function done() { img.classList.remove('is-loading'); media.classList.add('is-loaded'); }
    if (img.complete && img.naturalWidth) done();
    else {
      img.addEventListener('load', done);
      img.addEventListener('error', function () { media.classList.add('is-loaded'); img.style.display = 'none'; });
    }
  });

  /* ---------- Project filter ---------- */
  var chips = Array.prototype.slice.call(document.querySelectorAll('.filter-bar .chip'));
  var cards = Array.prototype.slice.call(document.querySelectorAll('#projects .project-card'));
  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      var f = chip.getAttribute('data-filter');
      chips.forEach(function (c) {
        var on = c === chip;
        c.classList.toggle('is-active', on);
        c.setAttribute('aria-pressed', String(on));
      });
      cards.forEach(function (card) {
        var tags = (card.getAttribute('data-tags') || '').split(/\s+/);
        var show = f === 'all' || tags.indexOf(f) !== -1;
        card.classList.toggle('is-hidden', !show);
        if (show) card.classList.add('is-visible');
      });
    });
  });

  /* ---------- Toast + copy ---------- */
  var toast = document.getElementById('toast');
  var toastTimer;
  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove('show'); }, 2200);
  }
  document.querySelectorAll('.js-copy').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault(); e.stopPropagation();
      var text = btn.getAttribute('data-copy');
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () { showToast('Copied ' + text); }, function () { showToast(text); });
      } else {
        showToast(text);
      }
    });
  });

  /* ---------- GitHub: live repositories ---------- */
  var LANG_COLORS = {
    JavaScript: '#f1e05a', TypeScript: '#3178c6', Python: '#3572A5', Java: '#b07219',
    'C++': '#f34b7d', C: '#555555', HTML: '#e34c26', CSS: '#563d7c', SCSS: '#c6538c', PHP: '#4F5D95'
  };
  var grid = document.getElementById('repo-grid');
  var repoCount = document.getElementById('gh-repos');

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function timeAgo(iso) {
    var d = (Date.now() - new Date(iso).getTime()) / 86400000;
    if (d < 1) return 'today';
    if (d < 2) return 'yesterday';
    if (d < 30) return Math.floor(d) + ' days ago';
    if (d < 365) return Math.floor(d / 30) + ' mo ago';
    return Math.floor(d / 365) + ' yr ago';
  }
  function renderError() {
    grid.setAttribute('aria-busy', 'false');
    grid.innerHTML = '<div class="gh-error">Couldn\'t load repositories right now. ' +
      '<a href="https://github.com/' + GITHUB_USER + '?tab=repositories" target="_blank" rel="noopener">Browse them on GitHub →</a></div>';
  }
  function renderRepos(repos) {
    grid.setAttribute('aria-busy', 'false');
    if (!repos.length) return renderError();
    grid.innerHTML = repos.map(function (r) {
      var lang = r.language
        ? '<span><span class="lang-dot" style="background:' + (LANG_COLORS[r.language] || 'var(--muted)') + '"></span>' + esc(r.language) + '</span>'
        : '';
      var stars = r.stargazers_count ? '<span>★ ' + r.stargazers_count + '</span>' : '';
      var desc = r.description ? esc(r.description) : 'No description yet — open the repository for details.';
      var live = /^https?:\/\//.test(r.homepage || '')
        ? '<a class="repo-live" href="' + esc(r.homepage) + '" target="_blank" rel="noopener"><span class="live-dot"></span> Live demo</a>'
        : '';
      return '<div class="repo-card">' +
        '<a class="stretched" href="' + esc(r.html_url) + '" target="_blank" rel="noopener" aria-label="' + esc(r.name) + ' on GitHub"></a>' +
        '<span class="repo-name"><svg><use href="#i-repo"/></svg>' + esc(r.name) + '</span>' +
        '<span class="repo-desc">' + desc + '</span>' + live +
        '<span class="repo-meta">' + lang + stars + '<span>Updated ' + timeAgo(r.pushed_at) + '</span></span>' +
        '</div>';
    }).join('');
  }

  function loadGitHub() {
    if (!grid || !window.fetch) return;
    var api = 'https://api.github.com/users/' + GITHUB_USER;
    var ctrl = 'AbortController' in window ? new AbortController() : null;
    var timer = setTimeout(function () { if (ctrl) ctrl.abort(); }, 10000);
    var opts = ctrl ? { signal: ctrl.signal } : {};

    fetch(api, opts).then(function (r) { return r.ok ? r.json() : null; })
      .then(function (u) { if (u && typeof u.public_repos === 'number') {
        repoCount.textContent = u.public_repos;
        var st = document.getElementById('stat-repos');
        if (st) st.textContent = u.public_repos;
      } })
      .catch(function () {});

    fetch(api + '/repos?sort=pushed&per_page=12', opts)
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function (list) {
        clearTimeout(timer);
        var repos = list.filter(function (r) { return !r.fork && r.name !== 'portfolio'; }).slice(0, 6);
        renderRepos(repos);
      })
      .catch(function () { clearTimeout(timer); renderError(); });
  }

  // Only hit the API once the section is close to the viewport
  var ghSection = document.getElementById('github');
  if (ghSection && 'IntersectionObserver' in window) {
    var ghObs = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) { ghObs.disconnect(); loadGitHub(); }
    }, { rootMargin: '400px 0px' });
    ghObs.observe(ghSection);
  } else {
    loadGitHub();
  }

  /* ---------- Contact form (opens the visitor's mail client) ---------- */
  var form = document.getElementById('contact-form');
  if (form) {
    var status = document.getElementById('form-status');
    function setErr(input, msg) {
      var field = input.closest('.field');
      field.classList.toggle('has-error', !!msg);
      field.querySelector('.err').textContent = msg || '';
    }
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = form.elements.name, email = form.elements.email, message = form.elements.message;
      var ok = true;
      if (!name.value.trim()) { setErr(name, 'Please enter your name.'); ok = false; } else setErr(name);
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) { setErr(email, 'Please enter a valid email address.'); ok = false; } else setErr(email);
      if (message.value.trim().length < 10) { setErr(message, 'Please write a slightly longer message.'); ok = false; } else setErr(message);
      if (!ok) { status.className = 'form-status'; status.textContent = ''; return; }

      var subject = 'Portfolio enquiry from ' + name.value.trim();
      var body = message.value.trim() + '\n\n— ' + name.value.trim() + ' (' + email.value.trim() + ')';
      window.location.href = 'mailto:ibenitha36@gmail.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
      status.className = 'form-status ok';
      status.textContent = 'Opening your email app… If nothing happens, email ibenitha36@gmail.com directly.';
    });
    ['name', 'email', 'message'].forEach(function (n) {
      form.elements[n].addEventListener('input', function () { setErr(form.elements[n]); });
    });
  }

  var motionOK = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Hero: rotating words ---------- */
  var rot = document.querySelector('.rotator');
  if (rot && motionOK) {
    var words = rot.getAttribute('data-words').split('|');
    var wEl = rot.querySelector('.rotator-word');
    var wi = 0;
    setInterval(function () {
      wEl.classList.add('out');
      setTimeout(function () {
        wi = (wi + 1) % words.length;
        wEl.textContent = words[wi];
        wEl.classList.remove('out');
      }, 350);
    }, 2600);
  }

  /* ---------- Scroll progress bar ---------- */
  var bar = document.querySelector('.scroll-progress');
  if (bar) {
    var setProgress = function () {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.setProperty('--progress', h > 0 ? Math.min(1, window.scrollY / h) : 0);
    };
    window.addEventListener('scroll', setProgress, { passive: true });
    setProgress();
  }

  /* ---------- Cursor glow + card spotlight ---------- */
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (finePointer && motionOK) {
    var glow = document.querySelector('.cursor-glow');
    var raf = 0, cx = 0, cy = 0;
    document.addEventListener('pointermove', function (e) {
      cx = e.clientX; cy = e.clientY;
      if (!raf) raf = requestAnimationFrame(function () {
        raf = 0;
        if (glow) { glow.style.setProperty('--cx', cx + 'px'); glow.style.setProperty('--cy', cy + 'px'); glow.classList.add('on'); }
      });
    }, { passive: true });
    document.addEventListener('pointerleave', function () { if (glow) glow.classList.remove('on'); });

    document.querySelectorAll('.project-card, .app-card, .skill-card, .step, .info-card, .quote').forEach(function (card) {
      card.classList.add('spot');
      card.addEventListener('pointermove', function (e) {
        var r = card.getBoundingClientRect();
        card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        card.style.setProperty('--my', (e.clientY - r.top) + 'px');
      });
    });
  }

  /* ---------- Count-up stats ---------- */
  var counters = document.querySelectorAll('[data-count]');
  if (counters.length && 'IntersectionObserver' in window && motionOK) {
    var cObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        cObs.unobserve(en.target);
        var el = en.target, target = parseInt(el.textContent, 10) || parseInt(el.getAttribute('data-count'), 10);
        var start = performance.now(), dur = 1400;
        (function tick(now) {
          var t = Math.min(1, (now - start) / dur), eased = 1 - Math.pow(1 - t, 3);
          el.textContent = Math.round(target * eased);
          if (t < 1) requestAnimationFrame(tick);
        })(start);
      });
    }, { threshold: 0.6 });
    counters.forEach(function (c) { cObs.observe(c); });
  }

  /* ---------- Footer year ---------- */
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();
