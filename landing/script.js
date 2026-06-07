// ── i18n ──────────────────────────────────────────────────────
var _locale = (function () {
  try { return localStorage.getItem('mk11_lang') || 'kr'; } catch (e) { return 'kr'; }
})();

function _t(key) {
  var raw = window.MK11_CONTENT && window.MK11_CONTENT[key];
  if (raw == null) return undefined;
  if (typeof raw === 'string') return raw;
  var v = raw[_locale];
  return v !== undefined ? v : raw.kr;
}

function applyI18n() {
  if (!window.MK11_CONTENT) return;

  document.querySelectorAll('[data-i18n]').forEach(function (el) {
    var v = _t(el.dataset.i18n);
    if (v !== undefined) el.innerHTML = v;
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
    var v = _t(el.dataset.i18nPlaceholder);
    if (v !== undefined) el.placeholder = v;
  });
  document.querySelectorAll('[data-i18n-label]').forEach(function (el) {
    var v = _t(el.dataset.i18nLabel);
    if (v === undefined) return;
    // <optgroup> needs its `label` attribute set to render the visible heading;
    // other elements (e.g. carousel figures) read dataset.label instead.
    if (el.tagName === 'OPTGROUP') el.label = v;
    else el.dataset.label = v;
  });
  document.querySelectorAll('[data-i18n-title]').forEach(function (el) {
    var v = _t(el.dataset.i18nTitle);
    if (v !== undefined) el.title = v;
  });

  document.documentElement.lang = _locale === 'kr' ? 'ko' : 'en';
  document.querySelectorAll('.lang-btn').forEach(function (btn) {
    btn.classList.toggle('active', btn.dataset.lang === _locale);
  });

  window._i18n = { t: _t, locale: _locale };
}

function setLocale(locale) {
  _locale = locale;
  try { localStorage.setItem('mk11_lang', locale); } catch (e) {}
  applyI18n();
  var label = document.getElementById('lang-label');
  if (label) label.textContent = locale === 'en' ? 'EN' : 'KR';
}

applyI18n();

// ── Language toggle (single globe button) ────────────────────
(function () {
  var btn = document.getElementById('lang-toggle-btn');
  if (!btn) return;

  btn.addEventListener('click', function () {
    var next = (typeof _locale !== 'undefined' ? _locale : 'kr') === 'kr' ? 'en' : 'kr';
    setLocale(next);
  });

  // Hide toggle while the announcement banner is visible; show once scrolled past.
  // Use html.has-banner (set synchronously by head inline script) as the signal —
  // banner.hidden is still true at this point in execution.
  var banner = document.getElementById('site-banner');
  if (banner && document.documentElement.classList.contains('has-banner') && 'IntersectionObserver' in window) {
    btn.style.opacity = '0';
    btn.style.pointerEvents = 'none';
    var obs = new IntersectionObserver(function (entries) {
      var visible = entries[0].isIntersecting;
      btn.style.opacity = visible ? '0' : '1';
      btn.style.pointerEvents = visible ? 'none' : '';
    }, { threshold: 0 });
    obs.observe(banner);
  }
}());

// ── Fetch installer cumulative download count ────────────────
// Source: stats Worker /public endpoint. Worker counts GUI .exe and CLI .zip
// together as install events. Each channel's download button href resolves
// independently from GitHub's latest-release asset list.
async function fetchReleaseStats() {
  try {
    const res = await fetch('https://mk11-stats.elka2love.workers.dev/public');
    if (res.ok) {
      const { total_installs } = await res.json();
      if (typeof total_installs === 'number' && total_installs > 0) {
        const formatted = total_installs.toLocaleString('ko-KR');
        const countEl = document.getElementById('download-count');
        const totalEl = document.getElementById('total-downloads');
        if (countEl) countEl.textContent = formatted;
        if (totalEl) totalEl.textContent = formatted;
      }
    }
  } catch (_) { /* fail silently */ }

  try {
    const res = await fetch('https://api.github.com/repos/KimHerV/mk11-korean-patch/releases/latest');
    if (!res.ok) return;
    const data = await res.json();
    const assets = data.assets || [];

    window._mk11DirectUrls = window._mk11DirectUrls || {};

    const guiAsset = assets.find(a => a.name === 'MK11-Korean-Patch-Setup.exe');
    if (guiAsset) {
      window._mk11DirectUrls.gui = guiAsset.browser_download_url;
    }

    const cliAsset = assets.find(a => a.name === 'MK11-Korean-Patch-CLI-Setup.zip');
    if (cliAsset) {
      window._mk11DirectUrls.cli = cliAsset.browser_download_url;
    }

    // Update the visible CTA button for whichever channel is currently active.
    const action = document.querySelector('.install-action');
    const activeCh = action ? (action.getAttribute('data-active-channel') || 'gui') : 'gui';
    const ctaBtn = document.getElementById('download-btn');
    if (ctaBtn && window._mk11DirectUrls[activeCh]) {
      ctaBtn.href = window._mk11DirectUrls[activeCh];
    }

    const versionEl = document.getElementById('download-version');
    if (versionEl && data.tag_name) versionEl.textContent = data.tag_name;
    const versionElCli = document.getElementById('download-version-cli');
    if (versionElCli && data.tag_name) versionElCli.textContent = data.tag_name;
    const footerVersion = document.getElementById('footer-version');
    if (footerVersion && data.tag_name) footerVersion.textContent = data.tag_name;
  } catch (_) { /* fail silently */ }
}

// ── Character Picker ───────────────────────────────────────────
const CHARS = [
  { code:'SHT', kr:'섕 쑹',        en:'Shang Tsung'  },
  { code:'SHA', kr:'샤오 칸',      en:'Shao Kahn'    },
  { code:'FRO', kr:'프로스트',     en:'Frost'        },
  { code:'NIT', kr:'나이트울프',   en:'Nightwolf'    },
  { code:'JOK', kr:'조커',         en:'Joker'        },
  { code:'JOH', kr:'조니 케이지',  en:'Johnny Cage'  },
  { code:'SON', kr:'소냐 블레이드',en:'Sonya Blade'  },
  { code:'CAS', kr:'캐시 케이지',  en:'Cassie Cage'  },
  { code:'JAX', kr:'잭스',         en:'Jax'          },
  { code:'SPA', kr:'스폰',         en:'Spawn'        },
  { code:'SCO', kr:'스콜피온',     en:'Scorpion'     },
  { code:'NOO', kr:'눕 사이보트',  en:'Noob Saibot'  },
  { code:'BAR', kr:'바라카',       en:'Baraka'       },
  { code:'RAI', kr:'라이덴',       en:'Raiden'       },
  { code:'JAC', kr:'재키 브릭스',  en:'Jacqui Briggs'},
  { code:'SUB', kr:'서브제로',     en:'Sub-Zero'     },
  { code:'KAN', kr:'케이노',       en:'Kano'         },
  { code:'KAB', kr:'카발',         en:'Kabal'        },
  { code:'LIU', kr:'리우 캉',      en:'Liu Kang'     },
  { code:'KIT', kr:'키타나',       en:'Kitana'       },
  { code:'KUN', kr:'쿵 라오',      en:'Kung Lao'     },
  { code:'JAD', kr:'제이드',       en:'Jade'         },
  { code:'ROB', kr:'로보캅',       en:'RoboCop'      },
  { code:'SKA', kr:'스칼렛',       en:'Skarlet'      },
  { code:'ERR', kr:'에론 블랙',    en:'Erron Black'  },
  { code:'DVO', kr:'드보라',       en:"D'Vorah"      },
  { code:'KOT', kr:'코탈 칸',      en:'Kotal Kahn'   },
  { code:'SHE', kr:'쉬바',         en:'Sheeva'       },
  { code:'RAM', kr:'람보',         en:'Rambo'        },
  { code:'TRM', kr:'터미네이터',   en:'Terminator'   },
  { code:'TER', kr:'게라스',       en:'Geras'        },
  { code:'KOL', kr:'콜렉터',       en:'Kollector'    },
  { code:'SIN', kr:'신델',         en:'Sindel'       },
  { code:'MIL', kr:'밀리나',       en:'Mileena'      },
  { code:'CET', kr:'세트리온',     en:'Cetrion'      },
  { code:'FUJ', kr:'푸진',         en:'Fujin'        },
  { code:'RAN', kr:'레인',         en:'Rain'         },
];

(function () {
  const picker     = document.getElementById('char-picker');
  const grid       = document.getElementById('char-grid');
  const backdrop   = document.getElementById('char-picker-backdrop');
  const closeBtn   = document.getElementById('char-picker-close');
  const categoryEl = document.getElementById('category');
  const charRow    = document.getElementById('char-row');
  const nicknameEl = document.getElementById('nickname');

  if (!picker || !grid) return;

  const slots = {
    a: { btn: document.getElementById('char-btn-a'), text: document.getElementById('char-btn-a-text'), input: document.getElementById('character_a'), placeholderKey: 'feedback.char_placeholder_a' },
    b: { btn: document.getElementById('char-btn-b'), text: document.getElementById('char-btn-b-text'), input: document.getElementById('character_b'), placeholderKey: 'feedback.char_placeholder_b' },
  };

  // ── Init grid cards ──────────────────────────────────────────
  CHARS.forEach(function (c) {
    const card = document.createElement('div');
    card.className = 'char-card';
    card.dataset.code = c.code;
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');

    const img = document.createElement('img');
    img.src = 'assets/characters/' + c.code + '.png';
    img.alt = c.kr;
    img.loading = 'lazy';

    const name = document.createElement('div');
    name.className = 'char-card-name';
    name.textContent = _locale === 'kr' ? c.kr : c.en;

    card.appendChild(img);
    card.appendChild(name);
    card.addEventListener('click', function () { handleCardClick(c); });
    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleCardClick(c); }
    });
    grid.appendChild(card);
  });

  // ── State machine ─────────────────────────────────────────────
  // Click rules:
  //   click "me" badge card     → reset A and B (restart selection)
  //   click "opponent" badge    → reset B only
  //   click empty card, no A   → assign as A
  //   click empty card, A set  → assign as B (replaces existing B)
  function handleCardClick(c) {
    var aCode = slots.a.input.value;
    var bCode = slots.b.input.value;

    if (c.code === aCode) {
      // "나" 카드 재클릭 → 전체 초기화
      _clearSlotRaw('b');
      _clearSlotRaw('a');
      slots.b.btn.disabled = true;
      _setRequiredPending(false);
    } else if (c.code === bCode) {
      // re-click "opponent" card → reset B, restore required state
      _clearSlotRaw('b');
      _setRequiredPending(true);
    } else if (!aCode) {
      // no A: assign as A, mark B required
      _setSlot('a', c);
      slots.b.btn.disabled = false;
      _setRequiredPending(true);
    } else {
      // A set: assign as B, clear required state
      _setSlot('b', c);
      _setRequiredPending(false);
    }
    updateBadges();
    updateStatus();
  }

  function _setSlot(slot, c) {
    var s = slots[slot];
    var name = _locale === 'kr' ? c.kr : c.en;
    s.input.value = c.code;
    s.text.textContent = name;
    s.btn.classList.add('has-value');
    var preview = s.btn.querySelector('.char-preview-img');
    if (!preview) {
      preview = document.createElement('img');
      preview.className = 'char-preview-img';
      s.btn.insertBefore(preview, s.btn.firstChild);
    }
    preview.src = 'assets/characters/' + c.code + '.png';
    preview.alt = name;
  }

  function _setRequiredPending(on) {
    var btn = slots.b.btn;
    if (on) {
      // remove class, force reflow, re-add to restart animation
      btn.classList.remove('required-pending');
      void btn.offsetWidth;
      btn.classList.add('required-pending');
    } else {
      btn.classList.remove('required-pending');
    }
  }

  function _clearSlotRaw(slot) {
    var s = slots[slot];
    s.input.value = '';
    s.text.textContent = _t(s.placeholderKey) || (slot === 'a' ? '내 캐릭터' : '상대 캐릭터');
    s.btn.classList.remove('has-value');
    var preview = s.btn.querySelector('.char-preview-img');
    if (preview) preview.remove();
  }

  // ── Status bar update ────────────────────────────────────────
  var cpsNameA = document.getElementById('cps-name-a');
  var cpsSlotA = document.getElementById('cps-slot-a');
  var cpsNameB = document.getElementById('cps-name-b');
  var cpsSlotB = document.getElementById('cps-slot-b');

  function updateStatus() {
    var aCode = slots.a.input.value;
    var bCode = slots.b.input.value;
    var cA = aCode ? CHARS.find(function(x){ return x.code === aCode; }) : null;
    var cB = bCode ? CHARS.find(function(x){ return x.code === bCode; }) : null;
    var loc = _locale === 'kr' ? 'kr' : 'en';

    if (cA) {
      cpsNameA.textContent = cA[loc];
      cpsSlotA.classList.add('filled');
    } else {
      cpsNameA.textContent = '—';
      cpsSlotA.classList.remove('filled');
    }

    if (cB) {
      cpsNameB.textContent = cB[loc];
      cpsSlotB.classList.add('filled');
      cpsSlotB.classList.remove('cps-pending');
    } else {
      cpsNameB.textContent = cA ? '선택 필요' : '—';
      cpsSlotB.classList.remove('filled');
      if (cA) {
        cpsSlotB.classList.remove('cps-pending');
        void cpsSlotB.offsetWidth;
        cpsSlotB.classList.add('cps-pending');
      } else {
        cpsSlotB.classList.remove('cps-pending');
      }
    }
  }

  // ── Badge render ─────────────────────────────────────────────
  function updateBadges() {
    var aCode = slots.a.input.value;
    var bCode = slots.b.input.value;
    var badgeLabels = { a: _locale === 'kr' ? '나' : 'Me', b: _locale === 'kr' ? '상대' : 'Opp' };

    grid.querySelectorAll('.char-card').forEach(function (card) {
      var code = card.dataset.code;
      var isA = code === aCode;
      var isB = code === bCode;

      card.classList.toggle('selected-a', isA);
      card.classList.toggle('selected-b', isB);

      var badge = card.querySelector('.char-badge');
      if (isA || isB) {
        if (!badge) {
          badge = document.createElement('div');
          card.appendChild(badge);
        }
        badge.className = 'char-badge char-badge--' + (isA ? 'a' : 'b');
        badge.textContent = badgeLabels[isA ? 'a' : 'b'];
      } else if (badge) {
        badge.remove();
      }
    });
  }

  // ── Confirm button ───────────────────────────────────────────
  var confirmBtn = document.getElementById('char-picker-confirm');
  if (confirmBtn) confirmBtn.addEventListener('click', closePicker);

  // ── Dialog open/close ────────────────────────────────────────
  function openPicker() {
    updateBadges();
    updateStatus();
    picker.hidden = false;
    requestAnimationFrame(function () { picker.classList.add('is-open'); });
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  function closePicker() {
    if (!picker.classList.contains('is-open')) return;
    picker.classList.remove('is-open');
    document.body.style.overflow = '';
    setTimeout(function () { picker.hidden = true; }, 260);
  }

  function updateCharRow() {
    var show = categoryEl && categoryEl.value === 'ingame';
    if (charRow) charRow.hidden = !show;
    if (!show) {
      _clearSlotRaw('a');
      _clearSlotRaw('b');
      slots.b.btn.disabled = true;
      _setRequiredPending(false);
      updateBadges();
      updateStatus();
    }
  }

  if (categoryEl) categoryEl.addEventListener('change', updateCharRow);

  // both buttons open the same dialog
  slots.a.btn.addEventListener('click', openPicker);
  slots.b.btn.addEventListener('click', openPicker);
  backdrop.addEventListener('click', closePicker);
  closeBtn.addEventListener('click', closePicker);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && picker.classList.contains('is-open')) closePicker();
  });

  // ── i18n refresh hook ────────────────────────────────────────
  var _origApply = window.applyI18n;
  window.applyI18n = function () {
    if (_origApply) _origApply();

    grid.querySelectorAll('.char-card').forEach(function (card) {
      var c = CHARS.find(function (x) { return x.code === card.dataset.code; });
      if (c) card.querySelector('.char-card-name').textContent = _locale === 'kr' ? c.kr : c.en;
    });

    ['a', 'b'].forEach(function (slot) {
      var s = slots[slot];
      if (s.input.value) {
        var c = CHARS.find(function (x) { return x.code === s.input.value; });
        if (c) s.text.textContent = _locale === 'kr' ? c.kr : c.en;
      } else {
        s.text.textContent = _t(s.placeholderKey) || (slot === 'a' ? '내 캐릭터' : '상대 캐릭터');
      }
    });

    updateBadges();

    // nickname: reset to current locale default if empty or left as the other locale's default
    if (nicknameEl) {
      var _nnDefaults = ['익명', 'Anonymous'];
      if (!nicknameEl.value || _nnDefaults.indexOf(nicknameEl.value) !== -1) {
        nicknameEl.value = _t('feedback.nickname_default') || '익명';
      }
    }
    document.querySelectorAll('[data-i18n-default]').forEach(function (el) {
      if (!el.value) el.value = _t(el.dataset.i18nDefault) || '';
    });
  };
})();

// ── Sub-category ──────────────────────────────────────────────
(function () {
  var SUBS = {
    story: [
      { val: 'story_mk11',      key: 'feedback.sub_story_mk11'      },
      { val: 'story_aftermath', key: 'feedback.sub_story_aftermath'  },
      { val: 'story_ending',    key: 'feedback.sub_story_ending'     },
    ],
    items: [
      { val: 'items_gear',    key: 'feedback.sub_items_gear'    },
      { val: 'items_skin',    key: 'feedback.sub_items_skin'    },
      { val: 'items_ability', key: 'feedback.sub_items_ability' },
    ],
  };

  var categoryEl = document.getElementById('category');
  var subRow     = document.getElementById('subcategory-row');
  var subSelect  = document.getElementById('subcategory');

  if (!categoryEl || !subRow || !subSelect) return;

  function rebuildSubs(cat) {
    // remove existing options except placeholder
    while (subSelect.options.length > 1) subSelect.remove(1);
    var opts = SUBS[cat] || [];
    opts.forEach(function (o) {
      var el = document.createElement('option');
      el.value = o.val;
      el.textContent = _t(o.key) || o.val;
      subSelect.appendChild(el);
    });
  }

  function updateSubRow() {
    var cat = categoryEl.value;
    var hasSubs = !!SUBS[cat];
    subRow.hidden = !hasSubs;
    if (hasSubs) {
      rebuildSubs(cat);
      subSelect.selectedIndex = 0;
    }
  }

  categoryEl.addEventListener('change', updateSubRow);

  // refresh option text on locale change
  var _origApply = window.applyI18n;
  window.applyI18n = function () {
    if (_origApply) _origApply();
    var cat = categoryEl && categoryEl.value;
    if (cat && SUBS[cat]) rebuildSubs(cat);
    // placeholder
    if (subSelect.options[0]) {
      subSelect.options[0].textContent = _t('feedback.opt_sub_placeholder') || '세부 항목 선택';
    }
  };
})();

// ── Inline field errors ───────────────────────────────────────
function _setFieldError(id, msg) {
  var el = document.getElementById(id);
  if (el) el.textContent = msg || '';
}
function _clearFieldError(id) { _setFieldError(id, ''); }

(function () {
  var cat = document.getElementById('category');
  var sug = document.getElementById('suggestion');
  if (cat) cat.addEventListener('change', function () {
    _clearFieldError('error-category');
    cat.classList.remove('is-error');
  });
  if (sug) sug.addEventListener('input', function () {
    _clearFieldError('error-suggestion');
    sug.classList.remove('is-error');
  });
})();

// ── Support fields show/hide ──────────────────────────────────
(function () {
  var catEl         = document.getElementById('category');
  var origRow       = document.getElementById('original-row');
  var supportFields = document.getElementById('support-fields');
  var checklistEl   = document.getElementById('support-checklist');
  var sysinfoRow    = document.getElementById('sysinfo-row');
  var labelNormal   = document.querySelector('label[for="suggestion"] .label-normal');
  var labelSupport  = document.querySelector('label[for="suggestion"] .label-support');
  if (!catEl) return;

  function toggleSupportFields(isSupport) {
    if (origRow)       origRow.hidden       = isSupport;
    if (supportFields) supportFields.hidden = !isSupport;
    if (checklistEl)   checklistEl.hidden   = !isSupport;
    if (sysinfoRow)    sysinfoRow.hidden    = !isSupport;
    if (labelNormal)   labelNormal.hidden   = isSupport;
    if (labelSupport)  labelSupport.hidden  = !isSupport;
    var sugEl = document.getElementById('suggestion');
    if (sugEl) sugEl.placeholder = isSupport
      ? (_t('support.placeholder_symptom') || '어떤 문제가 발생했는지 구체적으로 설명해주세요.')
      : (_t('feedback.placeholder_suggestion') || '어색한 부분, 오역, 개선 제안 등을 자유롭게 작성해주세요.');
  }

  catEl.addEventListener('change', function () {
    toggleSupportFields(catEl.value === 'support');
  });
})();

// ── Support: auto-fill OS/GPU ─────────────────────────────────
(function () {
  var btn = document.getElementById('btn-autofill');
  if (!btn) return;
  btn.addEventListener('click', async function () {
    var osEl  = document.getElementById('s-os');
    var gpuEl = document.getElementById('s-gpu');
    if (navigator.userAgentData && navigator.userAgentData.getHighEntropyValues) {
      try {
        var ua = await navigator.userAgentData.getHighEntropyValues(['platform', 'platformVersion', 'bitness']);
        if (osEl) {
          var bits = ua.bitness ? ' (' + ua.bitness + '-bit)' : '';
          osEl.value = ((ua.platform || '') + ' ' + (ua.platformVersion || '') + bits).trim();
        }
      } catch (e) {}
    } else if (osEl && !osEl.value) {
      var m = navigator.userAgent.match(/Windows NT ([\d.]+)/);
      if (m) osEl.value = 'Windows NT ' + m[1];
    }
    if (gpuEl) {
      try {
        var canvas = document.createElement('canvas');
        var gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (gl) {
          var ext = gl.getExtension('WEBGL_debug_renderer_info');
          if (ext) gpuEl.value = gl.getParameter(ext.UNMASKED_RENDERER_WEBGL);
        }
      } catch (e) {}
    }
  });
})();

// ── Toast ─────────────────────────────────────────────────────
var _toastTimer = null;
function showToast(msg) {
  var t = document.getElementById('mk11-toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('toast--show');
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(function () {
    t.classList.remove('toast--show');
  }, 3000);
}

// ── Support: copy crash-dump path ────────────────────────────
(function () {
  var btn = document.getElementById('btn-copy-path');
  if (!btn) return;
  btn.addEventListener('click', function () {
    navigator.clipboard.writeText('%LOCALAPPDATA%\\MK11').then(function () {
      showToast(_t('support.toast_copy_path') || '경로가 복사되었습니다. 탐색기 주소창에 붙여넣기 하세요.');
    });
  });
})();

// ── Support: checklist counter ────────────────────────────────
(function () {
  var IDS = ['check-lang', 'check-av', 'check-reinstall', 'check-admin', 'check-deps'];
  var counter = document.getElementById('check-counter');
  if (!counter) return;
  function update() {
    var n = IDS.filter(function (id) {
      var el = document.getElementById(id);
      return el && el.checked;
    }).length;
    counter.textContent = n + '/' + IDS.length;
    counter.classList.toggle('all-checked', n === IDS.length);
  }
  IDS.forEach(function (id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('change', update);
  });
})();

// ── Platform "other" show/hide + copy-path button visibility ─
(function () {
  var platEl    = document.getElementById('s-platform');
  var otherRow  = document.getElementById('platform-other-row');
  var copyWrap  = document.getElementById('copy-path-wrap');
  if (!platEl || !otherRow) return;
  var WIN_PLATFORMS = ['steam_win', 'epic', 'xbox_gamepass'];
  function syncPlatform() {
    var v = platEl.value;
    var isOther = v === 'other';
    otherRow.hidden = !isOther;
    if (!isOther) {
      var inp = document.getElementById('s-platform-other');
      if (inp) inp.value = '';
    }
    if (copyWrap) copyWrap.hidden = !WIN_PLATFORMS.includes(v);
  }
  platEl.addEventListener('change', syncPlatform);
})();

// ── Feedback form submit ──────────────────────────────────────
const FEEDBACK_ENDPOINT = 'https://mk11-feedback.elka2love.workers.dev';

document.getElementById('feedback-form')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const form   = e.target;
  const btn    = document.getElementById('submit-btn');
  const result = document.getElementById('form-result');
  const catEl  = document.getElementById('category');
  const sugEl  = document.getElementById('suggestion');

  // custom inline validation
  let hasError = false;

  if (!form.category.value) {
    _setFieldError('error-category', _t('feedback.err_category') || '번역 파트를 선택해주세요.');
    catEl?.classList.add('is-error');
    hasError = true;
  } else {
    _clearFieldError('error-category');
    catEl?.classList.remove('is-error');
  }

  if (form.category.value === 'ingame' && (!form.character_a?.value || !form.character_b?.value)) {
    _setFieldError('error-chars', _t('feedback.msg_chars_required') || '두 캐릭터를 모두 선택해주세요.');
    hasError = true;
  } else {
    _clearFieldError('error-chars');
  }

  if (!form.suggestion.value.trim()) {
    _setFieldError('error-suggestion', _t('feedback.err_suggestion') || '피드백 내용을 입력해주세요.');
    sugEl?.classList.add('is-error');
    hasError = true;
  } else {
    _clearFieldError('error-suggestion');
    sugEl?.classList.remove('is-error');
  }

  if (form.category.value === 'support') {
    const checks = ['check-lang', 'check-av', 'check-reinstall', 'check-admin', 'check-deps'];
    const allChecked = checks.every(id => document.getElementById(id)?.checked);
    if (!allChecked) {
      _setFieldError('error-checks', _t('support.err_checks') || '위 항목을 모두 확인해주세요.');
      hasError = true;
    } else {
      _clearFieldError('error-checks');
    }

    const platEl = document.getElementById('s-platform');
    if (!platEl?.value) {
      _setFieldError('error-platform', _t('support.err_platform') || '플랫폼을 선택해주세요.');
      platEl?.classList.add('is-error');
      hasError = true;
    } else {
      _clearFieldError('error-platform');
      platEl?.classList.remove('is-error');
      if (platEl.value === 'other') {
        const platOtherEl = document.getElementById('s-platform-other');
        if (!platOtherEl?.value.trim()) {
          _setFieldError('error-platform', _t('support.err_platform') || '플랫폼을 입력해주세요.');
          platOtherEl?.classList.add('is-error');
          hasError = true;
        } else {
          platOtherEl?.classList.remove('is-error');
        }
      }
    }

    const osEl = document.getElementById('s-os');
    if (!osEl?.value.trim()) {
      _setFieldError('error-os', _t('support.err_os') || '운영체제를 입력해주세요.');
      osEl?.classList.add('is-error');
      hasError = true;
    } else {
      _clearFieldError('error-os');
      osEl?.classList.remove('is-error');
    }

    const gpuEl = document.getElementById('s-gpu');
    if (!gpuEl?.value.trim()) {
      _setFieldError('error-gpu', _t('support.err_gpu') || 'GPU를 입력해주세요.');
      gpuEl?.classList.add('is-error');
      hasError = true;
    } else {
      _clearFieldError('error-gpu');
      gpuEl?.classList.remove('is-error');
    }
  }

  if (hasError) return;

  const siCb = document.getElementById('include-sysinfo');
  const isSupport = form.category.value === 'support';
  const payload = isSupport ? {
    type:           'support',
    symptom:        form.suggestion.value.trim(),
    platform:       (function() { var p = document.getElementById('s-platform'); return (p?.value === 'other') ? (document.getElementById('s-platform-other')?.value.trim() || null) : (p?.value || null); })(),
    os:             document.getElementById('s-os')?.value.trim() || null,
    gpu:            document.getElementById('s-gpu')?.value.trim() || null,
    files_url:      document.getElementById('files-url')?.value.trim()      || null,
    contact:        document.getElementById('s-contact')?.value.trim()     || null,
    nickname:       form.nickname.value.trim() || '익명',
  } : {
    category:    form.category.value,
    subcategory: form.subcategory?.value || null,
    character_a: form.character_a?.value || null,
    character_b: form.character_b?.value || null,
    original:    form.original?.value.trim() || null,
    suggestion:  form.suggestion.value.trim(),
    nickname:    form.nickname.value.trim() || '익명',
    screenshot:  null,
    system_info: (siCb && siCb.checked && window._getSysInfo) ? window._getSysInfo() : null,
  };

  btn.disabled = true;
  btn.textContent = _t('feedback.btn_submitting') || '제출 중...';
  result.hidden = true;
  result.className = 'form-result';

  try {
    const res = await fetch(FEEDBACK_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      result.textContent = _t('feedback.msg_success') ?? '피드백이 제출됐습니다. 감사합니다!';
      result.classList.add('success');
      form.reset();
      ['error-category','error-chars','error-suggestion','error-checks'].forEach(_clearFieldError);
      document.getElementById('category')?.classList.remove('is-error');
      document.getElementById('suggestion')?.classList.remove('is-error');
      // restore nickname default after reset
      const nn = document.getElementById('nickname');
      if (nn) nn.value = _t('feedback.nickname_default') || '익명';
      // clear screenshot + sysinfo
      if (window._ss && window._ss.reset) window._ss.reset();
      if (siCb) { siCb.checked = false; }
      const siPrev = document.getElementById('sysinfo-preview');
      if (siPrev) siPrev.hidden = true;
      // re-trigger category toggle so support-fields hides after reset
      document.getElementById('category')?.dispatchEvent(new Event('change'));
    } else {
      throw new Error('server error');
    }
  } catch (_) {
    result.textContent = _t('feedback.msg_error') ?? '제출에 실패했습니다. 잠시 후 다시 시도해주세요.';
    result.classList.add('error');
  } finally {
    result.hidden = false;
    btn.disabled = false;
    btn.textContent = _t('feedback.btn_submit') || '피드백 제출';
  }
});

fetchReleaseStats();

// ── Install channel cards (GUI recommended / CLI alternative) ─
// Cards sit side by side. Selecting one swaps the shared action zone:
//  · download button href + label
//  · step1/step2 description text (per-channel i18n keys)
// The card hierarchy itself (border weight, glow) is static — GUI always
// reads as recommended; selection mostly drives the action zone below.
(function () {
  var cards = document.querySelectorAll('.install-card');
  var action = document.querySelector('.install-action');
  if (!cards.length || !action) return;

  var ctaBtn    = action.querySelector('.install-cta');
  var ctaLabel  = action.querySelector('.install-cta-label');
  var step1Desc = action.querySelector('[data-channel-text][data-i18n="install.step1_desc"], [data-channel-text][data-i18n="install.step1_desc_cli"]');
  var step2Desc = action.querySelector('[data-channel-text][data-i18n="install.step2_desc"], [data-channel-text][data-i18n="install.step2_desc_cli"]');

  // Single GitHub releases URL for both channels — the actual asset (.exe vs .zip)
  // is picked from the releases page (or pre-resolved by fetchReleaseStats).
  var releasesUrl = 'https://github.com/KimHerV/mk11-korean-patch/releases/latest';
  var channels = {
    gui: { labelKey: 'install.btn_download',     step1Key: 'install.step1_desc',     step2Key: 'install.step2_desc' },
    cli: { labelKey: 'install.btn_download_cli', step1Key: 'install.step1_desc_cli', step2Key: 'install.step2_desc_cli' }
  };

  function activate(channel) {
    var cfg = channels[channel] || channels.gui;

    cards.forEach(function (c) {
      var on = c.dataset.channel === channel;
      c.classList.toggle('is-selected', on);
      c.setAttribute('aria-checked', on ? 'true' : 'false');
    });
    action.setAttribute('data-active-channel', channel);

    if (ctaBtn) {
      var urls = window._mk11DirectUrls || {};
      ctaBtn.setAttribute('href', urls[channel] || releasesUrl);
    }
    if (ctaLabel) ctaLabel.setAttribute('data-i18n', cfg.labelKey);
    if (step1Desc) step1Desc.setAttribute('data-i18n', cfg.step1Key);
    if (step2Desc) step2Desc.setAttribute('data-i18n', cfg.step2Key);

    // Let the shared i18n pass render the new keys (handles KR/EN automatically).
    if (typeof window.applyI18n === 'function') window.applyI18n();
  }

  cards.forEach(function (card) {
    card.addEventListener('click', function () { activate(card.dataset.channel); });
    card.addEventListener('keydown', function (e) {
      var nextChannel = null;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') nextChannel = 'cli';
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') nextChannel = 'gui';
      if (!nextChannel) return;
      e.preventDefault();
      activate(nextChannel);
      var next = document.querySelector('.install-card[data-channel="' + nextChannel + '"]');
      if (next) next.focus();
    });
  });

  activate('gui');

  // Mobile swipe: activate whichever card is >60% visible in the container.
  if ('IntersectionObserver' in window) {
    var container = document.querySelector('.install-cards');
    if (container) {
      container.scrollLeft = 0;

      // Only activate via observer after the user has actually touched/swiped.
      // This prevents browser scroll restoration from triggering CLI activation
      // on page load/refresh.
      var swipeReady = false;
      ['touchstart', 'pointerdown'].forEach(function (evt) {
        container.addEventListener(evt, function () { swipeReady = true; }, { once: true });
      });

      var swipeObserver = new IntersectionObserver(function (entries) {
        if (!swipeReady) return;
        entries.forEach(function (entry) {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
            activate(entry.target.dataset.channel);
          }
        });
      }, { root: container, threshold: 0.6 });

      cards.forEach(function (card) { swipeObserver.observe(card); });

      // Reset scroll position when resizing from mobile to desktop.
      window.addEventListener('resize', function () {
        if (window.innerWidth > 720 && container.scrollLeft > 0) {
          container.scrollLeft = 0;
        }
      });
    }
  }
})();

// ── AV notice modal (intercepts GUI download button) ──────────
// Shows every time the user clicks the download button while the GUI channel
// is active. Primary action proceeds to the download URL; secondary action
// switches the channel to CLI and closes the modal without downloading.
(function () {
  var modal    = document.getElementById('av-notice-modal');
  var backdrop = document.getElementById('av-notice-backdrop');
  var closeBtn = document.getElementById('av-notice-close');
  var proceedBtn = document.getElementById('av-notice-btn-proceed');
  var cliBtn   = document.getElementById('av-notice-btn-cli');
  var dlBtn    = document.getElementById('download-btn');
  var action   = document.querySelector('.install-action');

  if (!modal || !dlBtn || !action) return;

  var _pendingHref = null;

  function openModal(href) {
    _pendingHref = href;
    modal.removeAttribute('hidden');
    requestAnimationFrame(function () { modal.classList.add('is-open'); });
    if (typeof window.applyI18n === 'function') window.applyI18n();
    if (proceedBtn) proceedBtn.focus();
  }

  function closeModal() {
    if (!modal.classList.contains('is-open')) return;
    modal.classList.remove('is-open');
    _pendingHref = null;
    setTimeout(function () { modal.setAttribute('hidden', ''); }, 260);
    dlBtn.focus();
  }

  dlBtn.addEventListener('click', function (e) {
    if (action.getAttribute('data-active-channel') !== 'gui') return;
    e.preventDefault();
    openModal(dlBtn.getAttribute('href'));
  });

  if (proceedBtn) {
    proceedBtn.addEventListener('click', function () {
      var href = _pendingHref;
      closeModal();
      if (href) window.open(href, '_blank', 'noopener,noreferrer');
    });
  }

  if (cliBtn) {
    cliBtn.addEventListener('click', function () {
      closeModal();
      var cliCard = document.querySelector('.install-card[data-channel="cli"]');
      if (cliCard) cliCard.click();
    });
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (backdrop) backdrop.addEventListener('click', closeModal);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
  });
})();

// ── Live download counter sparkles ────────────────────────
(function () {
  var host = document.getElementById('stat-live');
  if (!host) return;

  // 4 sparkle positions around the number (x offset, base delay, duration)
  var sparks = [
    { x: '-28px', delay: '0s',    dur: '2.2s' },
    { x:  '28px', delay: '0.55s', dur: '2.6s' },
    { x: '-14px', delay: '1.1s',  dur: '2.0s' },
    { x:  '16px', delay: '1.65s', dur: '2.4s' },
  ];

  sparks.forEach(function (s) {
    var el = document.createElement('span');
    el.className = 'live-spark';
    el.textContent = '✦';
    el.style.left = 'calc(50% + ' + s.x + ')';
    el.style.top  = '18%';
    el.style.setProperty('--spark-delay', s.delay);
    el.style.setProperty('--spark-dur',   s.dur);
    host.appendChild(el);
  });
})();

// ── System info collection ────────────────────────────────────
function _osFromUA() {
  var ua = navigator.userAgent;
  if (/Windows NT 10\.0/.test(ua))    return 'Windows 10 / 11';
  if (/Windows NT 6\.3/.test(ua))     return 'Windows 8.1';
  if (/Windows NT 6\.1/.test(ua))     return 'Windows 7';
  if (/Mac OS X/.test(ua))            return 'macOS';
  if (/Linux/.test(ua))               return 'Linux';
  return 'Unknown';
}

async function collectSystemInfo() {
  var os = _osFromUA();

  // Chromium: high-entropy hints distinguish Win10 vs Win11 + build string
  if (navigator.userAgentData) {
    try {
      var hd = await navigator.userAgentData.getHighEntropyValues(['platform', 'platformVersion']);
      if (hd.platform === 'Windows') {
        var major = parseInt((hd.platformVersion || '').split('.')[0], 10);
        os = (major >= 13 ? 'Windows 11' : 'Windows 10') + ' (build ' + hd.platformVersion + ')';
      } else if (hd.platform) {
        os = hd.platform;
      }
    } catch (e) {}
  }

  var gpu = 'Unknown';
  try {
    var canvas = document.createElement('canvas');
    var gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (gl) {
      var ext = gl.getExtension('WEBGL_debug_renderer_info');
      if (ext) gpu = gl.getParameter(ext.UNMASKED_RENDERER_WEBGL);
    }
  } catch (e) {}

  var dpr   = window.devicePixelRatio || 1;
  var scale = screen.width + '\xd7' + screen.height + ' (' + dpr + '\xd7)';

  return { os: os, gpu: gpu, display: scale };
}

/* SCREENSHOT: disabled temporarily
(function () {
  var fileInput = document.getElementById('screenshot');
  var preview   = document.getElementById('screenshot-preview');
  var caption   = document.getElementById('screenshot-caption');
  var filename  = document.getElementById('screenshot-filename');
  var removeBtn = document.getElementById('screenshot-remove');
  var warn      = document.getElementById('screenshot-warn');

  var MAX = 2 * 1024 * 1024; // 2MB

  window._ss = {
    base64: null,
    reset: function () {
      window._ss.base64 = null;
      if (fileInput) fileInput.value = '';
      if (preview)  { preview.hidden = true; preview.src = ''; }
      if (caption)  caption.hidden = true;
      if (filename) filename.textContent = '';
      if (warn)     warn.hidden = true;
    }
  };

  if (!fileInput) return;

  fileInput.addEventListener('change', function () {
    var file = fileInput.files[0];
    if (!file) return;
    if (file.size > MAX) {
      warn.hidden = false;
      fileInput.value = '';
      return;
    }
    warn.hidden = true;
    var reader = new FileReader();
    reader.onload = function (e) {
      window._ss.base64 = e.target.result;
      preview.src = e.target.result;
      preview.hidden = false;
      if (filename) filename.textContent = file.name;
      if (caption)  caption.hidden = false;
    };
    reader.readAsDataURL(file);
  });

  if (removeBtn) removeBtn.addEventListener('click', window._ss.reset);
})();
*/

// ── System info checkbox ──────────────────────────────────────
(function () {
  var cb      = document.getElementById('include-sysinfo');
  var preview = document.getElementById('sysinfo-preview');
  if (!cb || !preview) return;

  var _stored = null;
  window._getSysInfo = function () { return _stored; };

  cb.addEventListener('change', function () {
    if (!cb.checked) { preview.hidden = true; _stored = null; return; }
    preview.textContent = '수집 중...';
    preview.hidden = false;
    collectSystemInfo().then(function (info) {
      _stored = info;
      preview.textContent = 'OS: ' + info.os + '\nGPU: ' + info.gpu + '\nDisplay: ' + info.display;
    });
  });
})();

// ── Carousel ──────────────────────────────────────────────────
(function () {
  const track    = document.getElementById('carousel-track');
  const prevBtn  = document.getElementById('carousel-prev');
  const nextBtn  = document.getElementById('carousel-next');
  const caption  = document.getElementById('carousel-caption');
  const dotsEl   = document.getElementById('carousel-dots');
  const counter  = document.getElementById('carousel-counter');

  if (!track) return;

  const slides = Array.from(track.querySelectorAll('.carousel-slide'));
  const total  = slides.length;
  let current  = 0;
  let autoTimer;

  // build dots
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Slide ${i + 1}`);
    dot.addEventListener('click', () => { goTo(i); startAuto(); });
    dotsEl.appendChild(dot);
  });

  function goTo(idx) {
    current = (idx + total) % total;
    track.style.transform = `translateX(-${current * 100}%)`;

    // caption
    const lbl = slides[current].dataset.label || '';
    if (caption) caption.textContent = lbl;

    // counter
    if (counter) counter.textContent = `${current + 1} / ${total}`;

    // re-apply active class to restart fill animation
    dotsEl.querySelectorAll('.carousel-dot').forEach((d, i) => {
      const isActive = i === current;
      if (isActive && d.classList.contains('active')) {
        // same slide reselected: restart animation
        d.classList.remove('active');
        void d.offsetWidth;
      }
      d.classList.toggle('active', isActive);
    });
  }

  function startAuto() {
    stopAuto();
    autoTimer = setInterval(() => goTo(current + 1), 5000);
  }

  function stopAuto() {
    clearInterval(autoTimer);
  }

  prevBtn?.addEventListener('click', () => { goTo(current - 1); startAuto(); });
  nextBtn?.addEventListener('click', () => { goTo(current + 1); startAuto(); });

  // keyboard
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft')  { goTo(current - 1); startAuto(); }
    if (e.key === 'ArrowRight') { goTo(current + 1); startAuto(); }
  });

  // touch swipe
  let touchStartX = 0;
  track.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 50) { goTo(current + (dx < 0 ? 1 : -1)); startAuto(); }
  });

  goTo(0);
  startAuto();
})();

// ── Engine Visualizer (D3 force graph) ────────────────────────
(function () {
  let vizData = null;
  let svgSel  = null;
  let simRef  = null;
  const state = { selected: null, pair: null, filter: null };
  const NW = 38, NH = 51;

  function t(key) { return (window._i18n && window._i18n.t(key)) || key; }
  function loc()  { return (window._i18n && window._i18n.locale) || 'kr'; }

  function fmBase(name) {
    return (name || '').split('→')[0].split('(')[0].trim();
  }
  function fmColor(name) {
    if (!vizData) return '#666';
    return (vizData.formality_levels[fmBase(name)] || {}).color || '#666';
  }
  function fmLabel(name) {
    if (!vizData) return name || '';
    const fm = vizData.formality_levels[fmBase(name)];
    if (!fm) return name || '';
    return loc() === 'en' ? fm.short_en : fmBase(name);
  }
  function textColor(hex) {
    if (!hex || hex.length < 7) return '#fff';
    const r = parseInt(hex.slice(1,3),16)/255;
    const g = parseInt(hex.slice(3,5),16)/255;
    const b = parseInt(hex.slice(5,7),16)/255;
    return (0.2126*r + 0.7152*g + 0.0722*b) > 0.45 ? '#111' : '#fff';
  }
  function badge(formality) {
    const bg = fmColor(formality);
    const fg = textColor(bg);
    return `<span class="engine-badge" style="background:${bg};color:${fg}" title="${formality || ''}">${fmLabel(formality)}</span>`;
  }
  function fmCounts() {
    if (!vizData) return {};
    const counts = {};
    vizData.characters.filter(c => c.has_portrait).forEach(c => {
      const k = c.default_formality;
      if (k) counts[k] = (counts[k] || 0) + 1;
    });
    return counts;
  }
  function charByCode(code) {
    return vizData && vizData.characters.find(c => c.code === code);
  }
  function findPair(a, b) {
    return vizData && vizData.pairs.find(p => p.speaker === a && p.listener === b);
  }

  // ── Filter bar ───────────────────────────────────────────────
  function renderFilter() {
    const bar = document.getElementById('engine-filter-bar');
    if (!bar || !vizData) return;
    const counts = fmCounts();
    const total  = vizData.characters.filter(c => c.has_portrait).length;
    const all = `<button class="eng-filter-btn active" data-fm="">
      ${t('engine.filter_all')} <span class="eng-filter-count">(${total})</span>
    </button>`;
    const btns = Object.entries(vizData.formality_levels).map(([name, fm]) => {
      const n = counts[name] || 0;
      const label = loc() === 'en' ? fm.short_en : name;
      const disabled = n === 0 ? 'disabled' : '';
      return `<button class="eng-filter-btn${n === 0 ? ' eng-filter-empty' : ''}" data-fm="${name}"
        style="--fm-color:${fm.color}" ${disabled}>
        <span class="eng-filter-dot" style="background:${fm.color}"></span>
        ${label} <span class="eng-filter-count">(${n})</span>
      </button>`;
    }).join('');
    bar.innerHTML = all + btns;
    bar.querySelectorAll('.eng-filter-btn:not([disabled])').forEach(btn =>
      btn.addEventListener('click', () => applyFilter(btn.dataset.fm, bar))
    );
  }

  function applyFilter(fm, bar) {
    state.filter = fm || null;
    if (bar) bar.querySelectorAll('.eng-filter-btn').forEach(b =>
      b.classList.toggle('active', b.dataset.fm === (fm || ''))
    );
    if (!svgSel) return;
    svgSel.selectAll('.eng-link').each(function (d) {
      const match = !fm || fmBase(d.formality) === fm;
      d3.select(this).attr('stroke-opacity', match ? 0.22 : 0.03).attr('stroke-width', match ? 1.2 : 0.4);
    });
  }

  // ── Realm helpers ─────────────────────────────────────────────
  const REALM_ORDER = ['Earthrealm', 'Edenia', 'Outworld', 'Netherrealm', 'Heavens', 'Beyond'];
  const REALM_COLOR = {
    'Earthrealm':  '#3a7fd5',
    'Edenia':      '#9b59b6',
    'Outworld':    '#c0392b',
    'Netherrealm': '#8e3191',
    'Heavens':     '#c9a11a',
    'Beyond':      '#7f8c8d',
    'Other':       '#556066',
  };
  function primaryRealm(r) {
    if (!r) return 'Other';
    for (const p of REALM_ORDER) { if (r.startsWith(p)) return p; }
    return 'Other';
  }
  function realmColor(realm) {
    return REALM_COLOR[primaryRealm(realm)] || '#556066';
  }

  // ── Circular chord layout ─────────────────────────────────────
  function initGraph() {
    const wrap = document.querySelector('.engine-graph-wrap');
    if (!wrap || !vizData || typeof d3 === 'undefined') return;

    const W  = wrap.offsetWidth  || 800;
    const H  = wrap.offsetHeight || 660;
    const CX = W / 2, CY = H / 2;
    const PW = 28, PH = 36; // portrait size

    // Build realm-ordered node array
    const portrait = vizData.characters.filter(c => c.has_portrait);
    const realmMap = {};
    REALM_ORDER.forEach(r => { realmMap[r] = []; });
    portrait.forEach(c => {
      const r = primaryRealm(c.realm);
      if (!realmMap[r]) realmMap[r] = [];
      realmMap[r].push(c);
    });
    const activeRealms = REALM_ORDER.filter(r => realmMap[r] && realmMap[r].length);

    // Compute radius so portraits don't overlap (arc per char > portrait width + margin)
    const GAP_MULT  = 1.6;
    const GAP       = (2 * Math.PI / portrait.length) * GAP_MULT;
    const totalGap  = activeRealms.length * GAP;
    const radPerChar = (2 * Math.PI - totalGap) / portrait.length;
    const R_fit = (PW + 5) / radPerChar;
    const R = Math.max(R_fit, Math.min(W * 0.41, H * 0.39));

    let angle = -Math.PI / 2 + GAP / 2;
    const nodeData     = {};
    const orderedNodes = [];
    const realmMidA    = {};

    activeRealms.forEach(realm => {
      const chars = realmMap[realm];
      const startA = angle;
      chars.forEach(c => {
        const nd = Object.assign({}, c, {
          x: CX + R * Math.cos(angle), y: CY + R * Math.sin(angle), angle
        });
        nodeData[c.code] = nd;
        orderedNodes.push(nd);
        angle += radPerChar;
      });
      realmMidA[realm] = (startA + angle - radPerChar) / 2;
      angle += GAP;
    });

    // Links (matrix pairs only)
    const codeSet = new Set(orderedNodes.map(n => n.code));
    const links = vizData.pairs
      .filter(p => p.source !== 'ingame' && codeSet.has(p.speaker) && codeSet.has(p.listener))
      .map(p => ({ source: p.speaker, target: p.listener, formality: p.formality, example_kr: p.example_kr }));

    // SVG setup
    const svg = d3.select('#engine-svg').attr('viewBox', `0 0 ${W} ${H}`);
    svg.selectAll('*').remove();

    const defs = svg.append('defs');
    orderedNodes.forEach(n => {
      defs.append('clipPath').attr('id', `ec-${n.code}`)
        .append('rect').attr('x', -PW/2).attr('y', -PH/2).attr('width', PW).attr('height', PH).attr('rx', 3);
    });
    defs.append('marker').attr('id', 'ea-pair')
      .attr('viewBox', '0 -4 8 8').attr('refX', 0).attr('refY', 0)
      .attr('markerWidth', 6).attr('markerHeight', 6).attr('orient', 'auto')
      .append('path').attr('d', 'M0,-4L8,0L0,4Z').attr('fill', '#f0c040');

    const zoomLabel = svg.append('text').attr('class', 'eng-zoom-label')
      .attr('x', W - 10).attr('y', H - 10).attr('text-anchor', 'end').text('100%');

    const g = svg.append('g');
    svg.call(d3.zoom().scaleExtent([0.3, 4]).on('zoom', e => {
      g.attr('transform', e.transform);
      zoomLabel.text(Math.round(e.transform.k * 100) + '%');
    }));
    svg.on('click', () => { state.selected = null; state.pair = null; updateVisuals(); closePanel(); });

    // Realm arc labels (colored, just outside circle)
    const lblR = R + PH / 2 + 20;
    activeRealms.forEach(realm => {
      const mid = realmMidA[realm];
      g.append('text').attr('class', 'eng-realm-label-svg')
        .attr('x', CX + lblR * Math.cos(mid)).attr('y', CY + lblR * Math.sin(mid))
        .attr('text-anchor', 'middle').attr('dominant-baseline', 'middle')
        .attr('fill', realmColor(realm))
        .text(realm.toUpperCase());
    });

    // Link layer (neutral color — no register coding)
    const animLayer = g.append('g').attr('class', 'eng-anim-layer');
    const linkSel = g.append('g').selectAll('line').data(links).join('line')
      .attr('class', 'eng-link')
      .attr('x1', d => (nodeData[d.source] || {}).x || CX)
      .attr('y1', d => (nodeData[d.source] || {}).y || CY)
      .attr('x2', d => (nodeData[d.target] || {}).x || CX)
      .attr('y2', d => (nodeData[d.target] || {}).y || CY)
      .attr('stroke', '#8899aa')
      .attr('stroke-width', 0.7).attr('stroke-opacity', 0.12);

    // Node layer
    const nodeSel = g.append('g').selectAll('g').data(orderedNodes).join('g')
      .attr('class', 'eng-node')
      .attr('transform', d => `translate(${d.x},${d.y})`)
      .on('click', (e, d) => { e.stopPropagation(); onNodeClick(d.code); });

    nodeSel.append('rect').attr('class', 'eng-node-ring')
      .attr('x', -PW/2 - 2).attr('y', -PH/2 - 2).attr('width', PW + 4).attr('height', PH + 4).attr('rx', 4)
      .attr('fill', '#111')
      .attr('stroke', d => realmColor(d.realm))
      .attr('stroke-width', 2);

    nodeSel.append('rect')
      .attr('x', -PW/2).attr('y', -PH/2).attr('width', PW).attr('height', PH).attr('rx', 3)
      .attr('fill', d => realmColor(d.realm)).attr('opacity', 0.18);

    nodeSel.append('image')
      .attr('href', d => `assets/characters/${d.code}.png`)
      .attr('x', -PW/2).attr('y', -PH/2).attr('width', PW).attr('height', PH)
      .attr('clip-path', d => `url(#ec-${d.code})`);

    // Radial name labels
    nodeSel.append('text').attr('class', 'eng-node-label')
      .attr('transform', d => {
        const lx = (PW / 2 + 8) * Math.cos(d.angle);
        const ly = (PW / 2 + 8) * Math.sin(d.angle);
        const deg = d.angle * 180 / Math.PI;
        return `translate(${lx},${ly}) rotate(${Math.cos(d.angle) < -0.05 ? deg + 180 : deg})`;
      })
      .attr('text-anchor', d => Math.cos(d.angle) < -0.05 ? 'end' : 'start')
      .attr('dominant-baseline', 'middle')
      .attr('font-size', 8).attr('fill', '#bbb').attr('pointer-events', 'none')
      .text(d => loc() === 'en' ? d.name_en.split(' ')[0] : d.name_kr);

    svgSel = svg;
    svgSel._linkSel   = linkSel;
    svgSel._nodeSel   = nodeSel;
    svgSel._animLayer = animLayer;
    svgSel._nodeData  = nodeData;
    svgSel._CX = CX; svgSel._CY = CY;
  }

  // ── Node click ───────────────────────────────────────────────
  function onNodeClick(code) {
    const { selected: sel, pair } = state;
    if (!sel) {
      state.selected = code; state.pair = null;
    } else if (pair) {
      // pair(A,B): collapse to single if clicking either, swap partner otherwise
      if (code === sel || code === pair) { state.pair = null; }
      else { state.pair = code; }
    } else {
      if (code === sel) { state.selected = null; }
      else { state.pair = code; }
    }
    updateVisuals();
    state.selected ? renderPanel(state.selected, state.pair) : closePanel();
  }

  function updateVisuals() {
    if (!svgSel) return;
    const { selected: sel, pair, filter } = state;
    svgSel._nodeSel && svgSel._nodeSel
      .select('.eng-node-ring')
      .attr('stroke', d => d.code === sel ? '#f0c040' : d.code === pair ? '#cc3333' : realmColor(d.realm))
      .attr('stroke-width', d => (d.code === sel || d.code === pair) ? 3.5 : 2);
    svgSel._nodeSel && svgSel._nodeSel.attr('opacity', d => {
      if (sel && pair) return (d.code === sel || d.code === pair) ? 1 : 0.15;
      if (!sel) return 1;
      if (d.code === sel) return 1;
      const connected = vizData.pairs.some(p =>
        (p.speaker === sel && p.listener === d.code) ||
        (p.listener === sel && p.speaker === d.code)
      );
      return connected ? 0.9 : 0.35;
    });
    svgSel._linkSel && svgSel._linkSel
      .attr('stroke-opacity', d => {
        const s = typeof d.source === 'object' ? d.source.code : d.source;
        const t = typeof d.target === 'object' ? d.target.code : d.target;
        if (sel) return (s === sel || t === sel) ? 0.85 : 0.04;
        return (!filter || fmBase(d.formality) === filter) ? 0.10 : 0.04;
      })
      .attr('stroke-width', d => {
        const s = typeof d.source === 'object' ? d.source.code : d.source;
        const t = typeof d.target === 'object' ? d.target.code : d.target;
        if (sel) return (s === sel || t === sel) ? 2.2 : 0.5;
        return 0.7;
      });
    // Pulse lines for selected pair
    if (svgSel._animLayer) {
      svgSel._animLayer.selectAll('*').remove();
      if (sel && pair) {
        const pAB = vizData.pairs.find(p => p.speaker === sel  && p.listener === pair);
        const pBA = vizData.pairs.find(p => p.speaker === pair && p.listener === sel);
        const nd  = svgSel._nodeData;
        [[pAB, sel, pair], [pBA, pair, sel]].forEach(([p, from, to]) => {
          if (!p || !nd) return;
          const nf = nd[from], nt = nd[to];
          if (!nf || !nt) return;
          const color = fmColor(p.formality);
          ['eng-pair-base', 'eng-pair-pulse'].forEach(cls => {
            svgSel._animLayer.append('line')
              .attr('class', cls)
              .attr('x1', nf.x).attr('y1', nf.y)
              .attr('x2', nt.x).attr('y2', nt.y)
              .attr('stroke', color).attr('fill', 'none')
              .attr('marker-end', 'url(#ea-pair)');
          });
        });
      }
    }
  }


  // ── Panel ────────────────────────────────────────────────────
  function closePanel() {
    const p = document.getElementById('engine-panel');
    if (p) p.hidden = true;
  }

  function renderPanel(code, pairCode) {
    const char  = charByCode(code);
    const panel = document.getElementById('engine-panel');
    const inner = document.getElementById('engine-panel-inner');
    if (!char || !panel || !inner) return;

    const nameA = loc() === 'en' ? char.name_en : char.name_kr;
    const subA  = loc() === 'en' ? char.name_kr : char.name_en;

    let bodyHtml;
    if (pairCode) {
      const charB = charByCode(pairCode);
      if (!charB) return;
      const nameB = loc() === 'en' ? charB.name_en : charB.name_kr;
      const pAB = findPair(code, pairCode);
      const pBA = findPair(pairCode, code);
      const fAB = (pAB && pAB.formality) ? pAB.formality : char.default_formality;
      const fBA = (pBA && pBA.formality) ? pBA.formality : charB.default_formality;
      const noMatrix = src => !src || src === 'ingame';
      const fallback = `<span class="eng-pair-fallback">(${t('engine.pair_fallback')})</span>`;
      const ingameTagAB = (pAB && noMatrix(pAB.source) && pAB.exchange_count)
        ? `<span class="eng-pair-ingame">${pAB.exchange_count}회 교환</span>` : '';
      const ingameTagBA = (pBA && noMatrix(pBA.source) && pBA.exchange_count)
        ? `<span class="eng-pair-ingame">${pBA.exchange_count}회 교환</span>` : '';

      bodyHtml = `
        <div class="eng-pair-header">
          <div class="eng-pair-char">
            <img src="assets/characters/${char.code}.png" alt="${char.name_kr}" />
            <span>${nameA}</span>
          </div>
          <div class="eng-pair-vs">VS</div>
          <div class="eng-pair-char">
            <img src="assets/characters/${charB.code}.png" alt="${charB.name_kr}" />
            <span>${nameB}</span>
          </div>
        </div>
        <div class="eng-section">
          <div class="eng-section-title">${nameA} &rarr; ${nameB}</div>
          <div class="eng-pair-row">${badge(fAB)} ${(!pAB || noMatrix(pAB.source)) ? fallback : ''} ${ingameTagAB}</div>
          ${pAB && pAB.example_kr ? `<div class="eng-pair-example">"${pAB.example_kr}"</div>` : ''}
        </div>
        <div class="eng-section">
          <div class="eng-section-title">${nameB} &rarr; ${nameA}</div>
          <div class="eng-pair-row">${badge(fBA)} ${(!pBA || noMatrix(pBA.source)) ? fallback : ''} ${ingameTagBA}</div>
          ${pBA && pBA.example_kr ? `<div class="eng-pair-example">"${pBA.example_kr}"</div>` : ''}
        </div>
        <button class="btn btn-secondary" id="eng-back" style="width:100%;margin-top:8px">&#8592; ${nameA}</button>`;
    } else {
      const rels = (char.relationships || []).filter(r => !r.target.startsWith('npc_') && !r.target.startsWith('past_'));
      const vocab = (char.key_vocab || []).map(v => `<span class="eng-vocab-chip">${v}</span>`).join('');

      // speech_doctrine: Raiden-specific detailed doctrine
      const doctrine = char.speech_doctrine
        ? ['primary','secondary','ceremonial','forbidden','decision_rule']
            .filter(k => char.speech_doctrine[k])
            .map(k => `<div class="eng-doctrine-block">${char.speech_doctrine[k]}</div>`).join('')
        : '';

      // quirks: common to all 38 characters
      const quirksHtml = (char.quirks || []).length
        ? char.quirks.map(q => `<div class="eng-doctrine-block">${q}</div>`).join('')
        : '';

      // sentence_pattern
      const sentenceHtml = char.sentence_pattern
        ? `<div class="eng-doctrine-block">${char.sentence_pattern}</div>`
        : '';

      // emotion_map: 9 characters
      const emotions = char.emotion_map ? Object.entries(char.emotion_map) : [];
      const emotionHtml = emotions.length
        ? `<div class="eng-emotion-grid">${
            emotions.map(([emo, desc]) =>
              `<div class="eng-emotion-item"><span class="eng-emotion-key">${emo}</span><span class="eng-emotion-desc">${desc}</span></div>`
            ).join('')
          }</div>`
        : '';
      const relHtml = rels.map(r => {
        const tgt = charByCode(r.target);
        const tn  = tgt ? (loc() === 'en' ? tgt.name_en : tgt.name_kr) : r.target;
        return `<div class="eng-rel-item">
          ${tgt && tgt.has_portrait ? `<img class="eng-rel-portrait" src="assets/characters/${r.target}.png" alt="${tn}" loading="lazy" />` : ''}
          <div class="eng-rel-info">
            <div class="eng-rel-name">${tn}</div>
            <div class="eng-rel-dynamic">${r.dynamic || ''}</div>
          </div>
          ${badge(r.speech_to)}
        </div>`;
      }).join('');

      bodyHtml = `
        ${char.tone ? `<div class="eng-section"><div class="eng-section-title">${t('engine.panel_tone')}</div><div class="eng-section-body">${char.tone}</div></div>` : ''}
        ${vocab ? `<div class="eng-section"><div class="eng-section-title">${t('engine.panel_vocab')}</div><div class="eng-vocab-chips">${vocab}</div></div>` : ''}
        ${sentenceHtml ? `<div class="eng-section"><div class="eng-section-title">${t('engine.panel_sentence')}</div>${sentenceHtml}</div>` : ''}
        ${quirksHtml ? `<div class="eng-section"><div class="eng-section-title">${t('engine.panel_quirks')}</div>${quirksHtml}</div>` : ''}
        ${emotionHtml ? `<div class="eng-section"><div class="eng-section-title">${t('engine.panel_emotion')}</div>${emotionHtml}</div>` : ''}
        ${relHtml ? `<div class="eng-section"><div class="eng-section-title">${t('engine.panel_relations')}</div><div class="eng-rel-list">${relHtml}</div></div>` : ''}
        <p class="eng-pair-hint">${t('engine.pair_hint')}</p>`;
    }

    inner.innerHTML = `
      <div class="eng-panel-header">
        <img class="eng-panel-portrait" src="assets/characters/${char.code}.png" alt="${char.name_kr}" />
        <div class="eng-panel-header-info">
          <div class="eng-panel-name">${nameA}<span class="eng-panel-subname">${subA}</span></div>
          <div class="eng-panel-meta">${badge(char.default_formality)}</div>
        </div>
        <button class="eng-panel-close" id="eng-close">&#x2715;</button>
      </div>
      <div class="eng-panel-scroll">${bodyHtml}</div>`;

    document.getElementById('eng-close').addEventListener('click', () => {
      state.selected = null; state.pair = null; updateVisuals(); closePanel();
    });
    const back = document.getElementById('eng-back');
    if (back) back.addEventListener('click', () => { state.pair = null; updateVisuals(); renderPanel(state.selected, null); });

    panel.hidden = false;
  }

  // ── Init ─────────────────────────────────────────────────────
  function init() {
    const data = window.MK11_VIZ_DATA;
    if (!data) { console.error('[engine] MK11_VIZ_DATA not loaded'); return; }
    vizData = data;
    renderFilter();
    try { initGraph(); } catch (e) { console.error('[engine]', e); }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  const _orig = window.setLocale;
  window.setLocale = function (l) {
    _orig(l);
    if (!vizData) return;
    renderFilter();
    if (state.selected) renderPanel(state.selected, state.pair);
  };
})();

// ── FAQ ───────────────────────────────────────────────────────
(function () {
  var faqList = document.getElementById('faq-list');
  if (!faqList || !window.MK11_FAQ) return;

  function pick(obj) {
    if (!obj) return '';
    if (typeof obj === 'string') return obj;
    return obj[_locale] !== undefined ? obj[_locale] : (obj.kr || '');
  }

  function renderFaq() {
    var html = window.MK11_FAQ.map(function (cat) {
      var catLabel = pick(cat.category);
      var items = cat.items.map(function (item) {
        var q = pick(item.q);
        var aText = pick(item.a);

        // Paragraph lines (split on \n)
        var paras = aText.split('\n').filter(Boolean).map(function (line) {
          return '<p>' + line + '</p>';
        }).join('');

        // Optional bullet list
        var listHtml = '';
        if (item.list) {
          var bullets = pick(item.list);
          if (Array.isArray(bullets) && bullets.length) {
            listHtml = '<ul class="faq-list">' +
              bullets.map(function (b) { return '<li>' + b + '</li>'; }).join('') +
              '</ul>';
          }
        }

        // Optional note
        var noteHtml = item.note
          ? '<p class="faq-note">' + pick(item.note) + '</p>'
          : '';

        return '<details class="faq-item" name="faq">' +
          '<summary class="disclosure-toggle faq-q">' + q +
          '<i data-lucide="chevron-down" aria-hidden="true"></i>' +
          '</summary>' +
          '<div class="faq-a">' + paras + listHtml + noteHtml + '</div>' +
          '</details>';
      }).join('');

      return '<div class="faq-category">' +
        '<h3 class="faq-cat-title">' + catLabel + '</h3>' +
        items +
        '</div>';
    }).join('');

    faqList.innerHTML = html;
    if (window.lucide) lucide.createIcons();
  }

  renderFaq();

  var _origApply = window.applyI18n;
  window.applyI18n = function () {
    if (_origApply) _origApply();
    renderFaq();
  };
})();

// ── FAQ exclusive accordion (fallback for browsers without <details name>) ──
(function () {
  document.addEventListener('toggle', function (e) {
    if (!e.target.classList.contains('faq-item') || !e.target.open) return;
    document.querySelectorAll('.faq-item').forEach(function (el) {
      if (el !== e.target && el.open) el.open = false;
    });
  }, true);
})();

// ── Scroll entrance animations ────────────────────────────
(function () {
  if (!window.IntersectionObserver) return;

  var selectors = [
    '.stat-item',
    '.feature-card',
    '.about-entry',
    '.install-cards > .install-card',
    '.install-trust-strip',
    '.install-action',
    '.install-steps > li',
    '.install-cta',
    '.install-complete',
    '.faq-category',
    '.feedback-form',
    '.section-title',
    '.section-sub',
    '.section-subtitle',
  ];

  selectors.forEach(function (sel) {
    document.querySelectorAll(sel).forEach(function (el) {
      el.classList.add('anim-watch');
    });
  });

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('anim-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -32px 0px' });

  document.querySelectorAll('.anim-watch').forEach(function (el) {
    observer.observe(el);
  });
})();

// ── Back to top ───────────────────────────────────────────
(function () {
  var btn = document.getElementById('to-top');
  if (!btn) return;

  var SHOW_AT = 600;          // 이 정도 내려오면 표시
  var ticking = false;
  function update() {
    ticking = false;
    if (window.pageYOffset > SHOW_AT) btn.classList.add('is-visible');
    else btn.classList.remove('is-visible');
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }, { passive: true });

  var reduceMotion = false;
  try { reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (_) {}
  btn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  });

  update();
})();

