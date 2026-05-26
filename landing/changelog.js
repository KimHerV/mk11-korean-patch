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
    renderFilterChips();
    renderChangelog();
    var label = document.getElementById('lang-label');
    if (label) label.textContent = locale === 'en' ? 'EN' : 'KR';
  }

  // ── Filter state (read ?tag= from URL on init) ─────────────
  var _activeTag = (function () {
    try { return new URLSearchParams(window.location.search).get('tag') || 'all'; }
    catch (e) { return 'all'; }
  }());

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

    var tagLabels = { translation: { kr: '번역', en: 'Translation' }, security: { kr: '보안', en: 'Security' }, platform: { kr: '플랫폼', en: 'Platform' } };
    var entryChipsHtml = (v.tags || []).map(function (tag) {
      var info = tagLabels[tag];
      if (!info) return '';
      return '<button class="cl-entry-chip" data-tag="' + escapeHtml(tag) + '" type="button">' +
               escapeHtml(_locale === 'en' ? info.en : info.kr) + '</button>';
    }).join('');
    var tagsMetaHtml = entryChipsHtml
      ? '<span class="cl-version-sep cl-tags-sep">·</span><span class="cl-entry-chips">' + entryChipsHtml + '</span>'
      : '';

    return '<details class="cl-version reveal" name="cl-versions"' + openAttr + '>' +
             '<summary class="cl-version-summary">' +
               '<div class="cl-version-meta">' +
                 '<span class="cl-version-tag">v' + escapeHtml(v.version) + '</span>' +
                 '<span class="cl-version-sep">·</span>' +
                 '<span class="cl-version-date">' + escapeHtml(v.date) + '</span>' +
                 tagsMetaHtml +
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

  function renderFilterChips() {
    var filterEl = document.getElementById('changelog-filter');
    if (!filterEl) return;
    var chips = [
      { tag: 'all',         kr: '전체',   en: 'All'         },
      { tag: 'translation', kr: '번역',   en: 'Translation' },
      { tag: 'security',    kr: '보안',   en: 'Security'    },
      { tag: 'platform',    kr: '플랫폼', en: 'Platform'    }
    ];
    filterEl.innerHTML = chips.map(function (c) {
      var active = _activeTag === c.tag ? ' cl-chip--active' : '';
      var label  = escapeHtml(_locale === 'en' ? c.en : c.kr);
      return '<button class="cl-chip' + active + '" data-tag="' + c.tag + '">' + label + '</button>';
    }).join('');
    filterEl.querySelectorAll('.cl-chip').forEach(function (btn) {
      btn.addEventListener('click', function () {
        _activeTag = btn.dataset.tag;
        if (window.history && window.history.replaceState) {
          var url = new URL(window.location.href);
          if (_activeTag === 'all') { url.searchParams.delete('tag'); }
          else { url.searchParams.set('tag', _activeTag); }
          window.history.replaceState({}, '', url.toString());
        }
        renderFilterChips();
        renderChangelog();
      });
    });
  }

  function renderChangelog() {
    if (!_changelogData) return;
    var listEl = document.getElementById('changelog-list');
    if (!listEl) return;
    var filtered = _activeTag === 'all'
      ? _changelogData
      : _changelogData.filter(function (v) { return v.tags && v.tags.indexOf(_activeTag) !== -1; });
    if (!filtered.length) {
      listEl.innerHTML = '<p class="cl-error">' +
        (_locale === 'en' ? 'No entries found.' : '항목이 없습니다.') + '</p>';
      return;
    }
    listEl.innerHTML = filtered.map(function (v, i) {
      return renderVersion(v, i === 0);
    }).join('');
    attachExclusiveAccordion(listEl);
    attachScrollAnimations();
    listEl.querySelectorAll('.cl-entry-chip').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        _activeTag = btn.dataset.tag;
        if (window.history && window.history.replaceState) {
          var url = new URL(window.location.href);
          url.searchParams.set('tag', _activeTag);
          window.history.replaceState({}, '', url.toString());
        }
        renderFilterChips();
        renderChangelog();
      });
    });
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

  function attachScrollAnimations() {
    if (window.IntersectionObserver) runCardScrollAnimations();
  }

  // Cards: skip the first one and its children entirely so the v1.1 card
  // is visible from the moment the page loads, even when the hero-mini
  // pushes it below the fold on mobile.
  function runCardScrollAnimations() {
    var targets = [];
    function watch(el) {
      if (el && !el.classList.contains('anim-watch')) {
        el.classList.add('anim-watch');
        targets.push(el);
      }
    }

    var versions = document.querySelectorAll('.cl-version');
    versions.forEach(function (card, idx) {
      if (idx === 0) return;
      watch(card);
      card.querySelectorAll('.cl-highlight, .cl-install, .cl-gh').forEach(watch);
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
      renderFilterChips();
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
