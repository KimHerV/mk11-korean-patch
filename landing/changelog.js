// ── Changelog page logic ─────────────────────────────────────
// Shares the i18n system from content.js (window.MK11_CONTENT).
// Loads window.MK11_CHANGELOG, renders versions, and reacts to locale toggle.

(function () {
  var _locale = (function () {
    try { return localStorage.getItem('mk11_lang') || 'kr'; } catch (e) { return 'kr'; }
  })();

  function _t(key) {
    var raw = window.MK11_CONTENT && window.MK11_CONTENT[key];
    if (raw == null) return '';
    if (typeof raw === 'string') return raw;
    return raw[_locale] !== undefined ? raw[_locale] : raw.kr;
  }

  function pick(val) {
    if (val == null) return '';
    if (typeof val === 'string') return val;
    return val[_locale] !== undefined ? val[_locale] : (val.kr || '');
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c];
    });
  }

  function applyI18n() {
    if (!window.MK11_CONTENT) return;
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var v = _t(el.dataset.i18n);
      if (v !== '') el.innerHTML = v;
    });
    document.documentElement.lang = _locale === 'kr' ? 'ko' : 'en';
  }

  function setLocale(locale) {
    _locale = locale;
    try { localStorage.setItem('mk11_lang', locale); } catch (e) {}
    applyI18n();
    renderChangelog(); // re-render version content for the new locale
    var label = document.getElementById('lang-label');
    if (label) label.textContent = locale === 'en' ? 'EN' : 'KR';
  }

  // ── Version rendering ───────────────────────────────────────
  var _changelogData = null;

  function renderVersion(v, isLatest) {
    var title    = escapeHtml(pick(v.title));
    var lead     = escapeHtml(pick(v.lead));
    var ghLink   = v.github_release || '#';

    // install_note: string → single <p>, array → <ul><li>...</li></ul>
    var installRaw = pick(v.install_note);
    var installHtml = '';
    if (Array.isArray(installRaw)) {
      installHtml = '<ul class="cl-install-list">' + installRaw.map(function (item) {
        return '<li>' + escapeHtml(item) + '</li>';
      }).join('') + '</ul>';
    } else if (installRaw) {
      installHtml = '<p>' + escapeHtml(installRaw) + '</p>';
    }

    var highlightsHtml = (v.highlights || []).map(function (h) {
      var hTitle = escapeHtml(pick(h.title));
      var items  = pick(h.items) || [];
      var itemsHtml = (Array.isArray(items) ? items : []).map(function (it) {
        return '<li>' + escapeHtml(it) + '</li>';
      }).join('');
      return '<div class="cl-highlight">' +
               '<h3 class="cl-highlight-title">' + hTitle + '</h3>' +
               '<ul class="cl-highlight-items">' + itemsHtml + '</ul>' +
             '</div>';
    }).join('');

    var openAttr  = isLatest ? ' open' : '';
    var labelGh   = _locale === 'en' ? 'GitHub Release →' : 'GitHub Release 보기 →';
    var labelInst = _locale === 'en' ? 'Installation' : '설치 안내';

    return '<details class="cl-version" name="cl-versions"' + openAttr + '>' +
             '<summary class="cl-version-summary">' +
               '<div class="cl-version-meta">' +
                 '<span class="cl-version-tag">v' + escapeHtml(v.version) + '</span>' +
                 '<span class="cl-version-sep">·</span>' +
                 '<span class="cl-version-date">' + escapeHtml(v.date) + '</span>' +
               '</div>' +
               '<h2 class="cl-version-title">' + title + '</h2>' +
             '</summary>' +
             '<div class="cl-version-body">' +
               '<p class="cl-lead">' + lead + '</p>' +
               '<div class="cl-highlights">' + highlightsHtml + '</div>' +
               (installHtml ? '<div class="cl-install"><h4>' + labelInst + '</h4>' + installHtml + '</div>' : '') +
               '<p class="cl-gh"><a href="' + escapeHtml(ghLink) + '" target="_blank" rel="noopener">' + labelGh + '</a></p>' +
             '</div>' +
           '</details>';
  }

  function renderChangelog() {
    if (!_changelogData) return;
    var listEl = document.getElementById('changelog-list');
    if (!listEl) return;
    listEl.innerHTML = _changelogData.map(function (v, i) {
      return renderVersion(v, i === 0);
    }).join('');
    attachExclusiveAccordion(listEl);
    attachScrollAnimations();
  }

  // Exclusive accordion fallback for browsers without details[name=...] support.
  // When one details opens, close the others in the same group.
  function attachExclusiveAccordion(root) {
    var items = root.querySelectorAll('details.cl-version');
    items.forEach(function (d) {
      d.addEventListener('toggle', function () {
        if (!d.open) return;
        items.forEach(function (other) {
          if (other !== d && other.open) other.open = false;
        });
      });
    });
  }

  // Scroll entrance animations: mirrors landing's IntersectionObserver pattern.
  // Adds .anim-watch / .anim-visible from animations.css to header + version cards
  // + highlight groups. Idempotent (skips elements already watched).
  function attachScrollAnimations() {
    if (!window.IntersectionObserver) return;

    var selectors = [
      '.changelog-hero',
      '.cl-version',
      '.cl-highlight',
      '.cl-install',
      '.cl-gh'
    ];
    var targets = [];
    selectors.forEach(function (sel) {
      document.querySelectorAll(sel).forEach(function (el) {
        if (!el.classList.contains('anim-watch')) {
          el.classList.add('anim-watch');
          targets.push(el);
        }
      });
    });
    if (!targets.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('anim-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -32px 0px' });

    targets.forEach(function (el) { observer.observe(el); });
  }

  // ── Init ────────────────────────────────────────────────────
  function init() {
    applyI18n();

    var label = document.getElementById('lang-label');
    if (label) label.textContent = _locale === 'en' ? 'EN' : 'KR';

    var ltBtn = document.getElementById('lang-toggle-btn');
    if (ltBtn) {
      ltBtn.addEventListener('click', function () {
        setLocale(_locale === 'kr' ? 'en' : 'kr');
      });
    }

    // Inline JS data (file:// compatible, no fetch required)
    if (window.MK11_CHANGELOG && Array.isArray(window.MK11_CHANGELOG)) {
      _changelogData = window.MK11_CHANGELOG;
      renderChangelog();
    } else {
      var listEl = document.getElementById('changelog-list');
      if (listEl) {
        listEl.innerHTML = '<p class="cl-error">' +
          (_locale === 'en' ? 'Changelog data not loaded.' : '체인지로그 데이터를 불러올 수 없습니다.') +
          '</p>';
      }
      console.error('MK11_CHANGELOG not found');
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}());
