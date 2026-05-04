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
    if (v !== undefined) el.dataset.label = v;
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
}

applyI18n();

// ── Fetch installer cumulative download count ────────────────
// Source: stats Worker /public endpoint. Worker provides clobber-corrected
// cumulative count across all releases (installer .exe only). The button
// href still resolves through GitHub's latest-release API for the .exe URL.
async function fetchReleaseStats() {
  // Headline number from worker (cumulative installer across all versions)
  try {
    const res = await fetch('https://mk11-stats.elka2love.workers.dev/public');
    if (res.ok) {
      const { total_installs } = await res.json();
      if (typeof total_installs === 'number' && total_installs > 0) {
        const countEl = document.getElementById('download-count');
        const totalEl = document.getElementById('total-downloads');
        if (countEl) countEl.textContent = total_installs.toLocaleString('ko-KR') + '회';
        if (totalEl) totalEl.textContent = total_installs.toLocaleString('ko-KR') + '회';
      }
    }
  } catch (_) { /* fail silently */ }

  // Resolve installer button href from the latest release
  try {
    const res = await fetch('https://api.github.com/repos/KimHerV/mk11-korean-patch/releases/latest');
    if (!res.ok) return;
    const data = await res.json();
    const installer = (data.assets || []).find(a => a.name.endsWith('.exe'));
    if (installer) {
      const btn = document.getElementById('download-btn');
      if (btn) btn.href = installer.browser_download_url;
    }
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
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  function closePicker() {
    picker.hidden = true;
    document.body.style.overflow = '';
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
    if (e.key === 'Escape' && !picker.hidden) closePicker();
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

  if (hasError) return;

  const payload = {
    category:    form.category.value,
    subcategory: form.subcategory?.value || null,
    character_a: form.character_a?.value || null,
    character_b: form.character_b?.value || null,
    original:    form.original?.value.trim() || null,
    suggestion:  form.suggestion.value.trim(),
    nickname:    form.nickname.value.trim() || '익명',
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
      ['error-category','error-chars','error-suggestion'].forEach(_clearFieldError);
      document.getElementById('category')?.classList.remove('is-error');
      document.getElementById('suggestion')?.classList.remove('is-error');
      // restore nickname default after reset
      const nn = document.getElementById('nickname');
      if (nn) nn.value = _t('feedback.nickname_default') || '익명';
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
  let svgSel = null;
  let simRef = null;
  const state = { selected: null, pair: null, filter: null };
  const NW = 38, NH = 51;  // portrait ratio 124/167

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
      d3.select(this).attr('stroke-opacity', match ? 0.72 : 0.06).attr('stroke-width', match ? 2 : 1);
    });
  }

  // ── Realm layout targets ─────────────────────────────────────
  const REALM_TARGET = {
    // Gods / Divine: top center
    RAI:{ rx:0.50,ry:0.14 }, FUJ:{ rx:0.42,ry:0.14 }, CET:{ rx:0.58,ry:0.14 },
    // Earthrealm heroes: left
    SCO:{ rx:0.18,ry:0.35 }, SUB:{ rx:0.18,ry:0.52 }, LIU:{ rx:0.26,ry:0.28 },
    KUN:{ rx:0.24,ry:0.45 }, JOH:{ rx:0.12,ry:0.30 }, SON:{ rx:0.12,ry:0.48 },
    CAS:{ rx:0.12,ry:0.65 }, JAX:{ rx:0.18,ry:0.72 }, JAC:{ rx:0.24,ry:0.68 },
    FRO:{ rx:0.20,ry:0.78 }, KAB:{ rx:0.28,ry:0.75 }, KAN:{ rx:0.22,ry:0.85 },
    SKA:{ rx:0.30,ry:0.85 }, ERR:{ rx:0.35,ry:0.78 },
    // Outworld / Edenia: right
    KIT:{ rx:0.76,ry:0.30 }, SHA:{ rx:0.88,ry:0.48 }, KOT:{ rx:0.78,ry:0.48 },
    JAD:{ rx:0.86,ry:0.35 }, SHE:{ rx:0.84,ry:0.62 }, MIL:{ rx:0.76,ry:0.62 },
    BAR:{ rx:0.88,ry:0.28 }, KOL:{ rx:0.92,ry:0.55 }, SIN:{ rx:0.70,ry:0.22 },
    // Netherrealm / Other: center-bottom
    NOO:{ rx:0.50,ry:0.78 }, TER:{ rx:0.50,ry:0.60 }, DVO:{ rx:0.60,ry:0.72 },
    // DLC: spread bottom
    SHT:{ rx:0.42,ry:0.90 }, NIT:{ rx:0.32,ry:0.90 }, JOK:{ rx:0.22,ry:0.92 },
    SPA:{ rx:0.50,ry:0.94 }, ROB:{ rx:0.12,ry:0.88 }, RAM:{ rx:0.62,ry:0.90 },
    RAN:{ rx:0.72,ry:0.90 }, TRM:{ rx:0.38,ry:0.94 },
  };

  // ── Graph ────────────────────────────────────────────────────
  function initGraph() {
    const wrap = document.querySelector('.engine-graph-wrap');
    if (!wrap || !vizData || typeof d3 === 'undefined') return;

    const W = wrap.offsetWidth  || 800;
    const H = wrap.offsetHeight || 560;

    const portrait = vizData.characters.filter(c => c.has_portrait);
    const codeSet  = new Set(portrait.map(c => c.code));
    const nodes    = portrait.map(c => ({ ...c }));
    // show only explicitly mapped pairs. ingame-only covers all combos and creates visual noise.
    const links = vizData.pairs
      .filter(p => codeSet.has(p.speaker) && codeSet.has(p.listener) && p.source !== 'ingame')
      .map(p => ({
        source: p.speaker, target: p.listener,
        formality: p.formality, tone: p.tone, example_kr: p.example_kr,
        src_type: 'matrix', exchange_count: p.exchange_count || 0
      }));

    // Bidirectional pair lookup for offset direction
    const bidir = new Set(links.map(l => `${l.source}|${l.target}`));

    const svg = d3.select('#engine-svg')
      .attr('width', W).attr('height', H)
      .attr('viewBox', `0 0 ${W} ${H}`)
      .style('width', W + 'px').style('height', H + 'px');

    const defs = svg.append('defs');

    // Clip paths: portrait rectangles
    nodes.forEach(n => {
      defs.append('clipPath').attr('id', `ec-${n.code}`)
        .append('rect')
        .attr('x', -NW/2).attr('y', -NH/2)
        .attr('width', NW).attr('height', NH).attr('rx', 3);
    });

    // Arrow markers per formality
    Object.entries(vizData.formality_levels).forEach(([name, fm]) => {
      const id = `ea-${name.replace(/[\s_]/g, '-')}`;
      defs.append('marker').attr('id', id)
        .attr('viewBox', '0 -4 8 8').attr('refX', 0).attr('refY', 0)
        .attr('markerWidth', 5).attr('markerHeight', 5).attr('orient', 'auto')
        .append('path').attr('d', 'M0,-4L8,0L0,4Z')
        .attr('fill', fm.color).attr('opacity', 0.9);
    });

    // Gold marker for pair animation
    defs.append('marker').attr('id', 'ea-pair')
      .attr('viewBox', '0 -4 8 8').attr('refX', 0).attr('refY', 0)
      .attr('markerWidth', 6).attr('markerHeight', 6).attr('orient', 'auto')
      .append('path').attr('d', 'M0,-4L8,0L0,4Z').attr('fill', '#f0c040');

    const g = svg.append('g');
    svg.call(d3.zoom().scaleExtent([0.2, 3]).on('zoom', e => g.attr('transform', e.transform)));
    svg.on('click', () => { state.selected = null; state.pair = null; updateVisuals(); closePanel(); });

    // Realm soft-positioning forces
    const txFn = d => { const rt = REALM_TARGET[d.code]; return rt ? rt.rx * W : W * 0.5; };
    const tyFn = d => { const rt = REALM_TARGET[d.code]; return rt ? rt.ry * H : H * 0.5; };

    simRef = d3.forceSimulation(nodes)
      .force('link',    d3.forceLink(links).id(d => d.code).distance(160).strength(0.25))
      .force('charge',  d3.forceManyBody().strength(-420))
      .force('collide', d3.forceCollide(Math.sqrt(NW*NW/4 + NH*NH/4) + 14))
      .force('rx',      d3.forceX().x(txFn).strength(0.18))
      .force('ry',      d3.forceY().y(tyFn).strength(0.18))
      .alphaDecay(0.012);

    // Animation layer (pair arrows drawn on top)
    const animLayer = g.append('g').attr('class', 'eng-anim-layer');

    const linkSel = g.append('g').selectAll('line').data(links).join('line')
      .attr('class', 'eng-link')
      .attr('stroke', d => fmColor(d.formality))
      .attr('stroke-width', 1)
      .attr('stroke-opacity', 0.55)
      .attr('marker-end', d => `url(#ea-${fmBase(d.formality).replace(/[\s_]/g, '-')})`);

    const nodeSel = g.append('g').selectAll('g').data(nodes).join('g')
      .attr('class', 'eng-node')
      .call(d3.drag()
        .on('start', (e, d) => { if (!e.active) simRef.alphaTarget(0.3).restart(); d.fx = d.x; d.fy = d.y; })
        .on('drag',  (e, d) => { d.fx = e.x; d.fy = e.y; })
        .on('end',   (e, d) => { if (!e.active) simRef.alphaTarget(0); d.fx = null; d.fy = null; })
      )
      .on('click', (e, d) => { e.stopPropagation(); onNodeClick(d.code); });

    // Border rect
    nodeSel.append('rect').attr('class', 'eng-node-ring')
      .attr('x', -NW/2 - 2).attr('y', -NH/2 - 2)
      .attr('width', NW + 4).attr('height', NH + 4).attr('rx', 4)
      .attr('fill', '#111')
      .attr('stroke', d => fmColor(d.default_formality))
      .attr('stroke-width', 2.5);

    // Portrait placeholder bg (shows when image fails)
    nodeSel.append('rect').attr('class', 'eng-node-img-bg')
      .attr('x', -NW/2).attr('y', -NH/2)
      .attr('width', NW).attr('height', NH).attr('rx', 3)
      .attr('fill', d => fmColor(d.default_formality))
      .attr('opacity', 0.18);

    nodeSel.append('text').attr('class', 'eng-node-fallback')
      .attr('y', 5).attr('text-anchor', 'middle')
      .attr('font-size', 11).attr('fill', '#666')
      .attr('pointer-events', 'none')
      .text(d => d.code);

    // Portrait (hides fallback on success)
    nodeSel.append('image')
      .attr('href', d => `assets/characters/${d.code}.png`)
      .attr('x', -NW/2).attr('y', -NH/2)
      .attr('width', NW).attr('height', NH)
      .attr('clip-path', d => `url(#ec-${d.code})`)
      .on('error', function() { d3.select(this).attr('href', null); });

    // Name label bg (inside card, bottom strip)
    nodeSel.append('rect').attr('class', 'eng-label-bg')
      .attr('x', -NW/2).attr('y', NH/2 - 16)
      .attr('width', NW).attr('height', 16).attr('rx', 0)
      .attr('fill', 'rgba(0,0,0,0.70)').attr('pointer-events', 'none');

    // Name label
    nodeSel.append('text').attr('class', 'eng-node-label')
      .attr('y', NH/2 - 5).attr('text-anchor', 'middle')
      .attr('font-size', 9).attr('fill', '#eee')
      .attr('pointer-events', 'none')
      .text(d => loc() === 'en' ? d.name_en.split(' ')[0] : d.name_kr);

    function lineEndpoint(src, tgt, side) {
      // Returns endpoint on the boundary of the rectangular node
      const dx = tgt.x - src.x, dy = tgt.y - src.y;
      const dist = Math.sqrt(dx*dx + dy*dy) || 1;
      // Perpendicular offset for bidirectionality
      const hasMirror = bidir.has(`${tgt.code ?? tgt}|${src.code ?? src}`) ||
                        bidir.has(`${tgt}|${src}`);
      const off = hasMirror ? 7 : 0;
      const ox = (-dy / dist) * off * side;
      const oy = (dx  / dist) * off * side;
      // Walk inward from target center by half-diagonal
      const r = Math.sqrt(NW*NW/4 + NH*NH/4) + 3;
      return {
        x: tgt.x - (dx/dist)*r + ox,
        y: tgt.y - (dy/dist)*r + oy,
        ox, oy
      };
    }

    function linkPath(d, side) {
      const sx = d.source.x ?? 0, sy = d.source.y ?? 0;
      const tx = d.target.x ?? 0, ty = d.target.y ?? 0;
      const dx = tx - sx, dy = ty - sy;
      const dist = Math.sqrt(dx*dx + dy*dy) || 1;
      const hasMirror = bidir.has(`${d.target.code ?? d.target}|${d.source.code ?? d.source}`);
      const off = hasMirror ? 7 : 0;
      const ox = (-dy/dist)*off*side, oy = (dx/dist)*off*side;
      const r = Math.sqrt(NW*NW/4 + NH*NH/4) + 3;
      const ex = tx - (dx/dist)*r + ox;
      const ey = ty - (dy/dist)*r + oy;
      return { x1: sx+ox, y1: sy+oy, x2: ex, y2: ey };
    }

    simRef.on('tick', () => {
      linkSel.each(function(d) {
        const p = linkPath(d, 1);
        d3.select(this).attr('x1', p.x1).attr('y1', p.y1).attr('x2', p.x2).attr('y2', p.y2);
      });
      nodeSel.attr('transform', d => `translate(${d.x ?? 0},${d.y ?? 0})`);

      // Update pair animation paths
      animLayer.selectAll('.eng-pair-base, .eng-pair-pulse, .eng-pair-pulse-rev').each(function() {
        const el = d3.select(this);
        const fc = el.attr('data-from'), tc = el.attr('data-to');
        const fn = nodes.find(n => n.code === fc), tn = nodes.find(n => n.code === tc);
        if (!fn || !tn) return;
        const dx = tn.x - fn.x, dy = tn.y - fn.y;
        const dist = Math.sqrt(dx*dx + dy*dy) || 1;
        const r = Math.sqrt(NW*NW/4 + NH*NH/4) + 3;
        const ex = tn.x - (dx/dist)*r, ey = tn.y - (dy/dist)*r;
        el.attr('x1', fn.x).attr('y1', fn.y).attr('x2', ex).attr('y2', ey);
      });
    });

    svgSel = svg;
    svgSel._linkSel = linkSel;
    svgSel._nodeSel = nodeSel;
    svgSel._animLayer = animLayer;
    svgSel._nodes = nodes;
  }

  // ── Node click ───────────────────────────────────────────────
  function onNodeClick(code) {
    if (state.selected === code) {
      state.selected = null; state.pair = null;
    } else if (state.selected) {
      state.pair = code;
    } else {
      state.selected = code; state.pair = null;
    }
    updateVisuals();
    state.selected ? renderPanel(state.selected, state.pair) : closePanel();
  }

  function updateVisuals() {
    if (!svgSel) return;
    const { selected: sel, pair, filter } = state;

    svgSel._nodeSel && svgSel._nodeSel
      .select('.eng-node-ring')
      .attr('stroke', d => d.code === sel ? '#f0c040' : d.code === pair ? '#cc3333' : fmColor(d.default_formality))
      .attr('stroke-width', d => (d.code === sel || d.code === pair) ? 3.5 : 2.5);

    svgSel._nodeSel && svgSel._nodeSel.attr('opacity', d => {
      if (!sel) return 1;
      if (d.code === sel || d.code === pair) return 1;
      const connected = vizData.pairs.some(p =>
        (p.speaker === sel && p.listener === d.code) ||
        (p.listener === sel && p.speaker === d.code)
      );
      return connected ? 0.9 : 0.4;
    });

    svgSel._linkSel && svgSel._linkSel
      .attr('stroke-opacity', d => {
        if (sel) {
          const hit = d.source.code === sel || d.target.code === sel;
          return hit ? 0.9 : 0.04;
        }
        return (!filter || fmBase(d.formality) === filter) ? 0.55 : 0.06;
      })
      .attr('stroke-width', d => {
        if (sel) return (d.source.code === sel || d.target.code === sel) ? 2.5 : 0.8;
        return 1.8;
      });

    // Pair connection animation
    if (svgSel._animLayer) {
      svgSel._animLayer.selectAll('*').remove();
      if (sel && pair) {
        // Layer 1: static base lines (thin, with direction arrows)
        [[sel, pair], [pair, sel]].forEach(([fc, tc]) => {
          svgSel._animLayer.append('line')
            .attr('class', 'eng-pair-base')
            .attr('data-from', fc).attr('data-to', tc)
            .attr('marker-end', 'url(#ea-pair)');
        });
        // Layer 2: traveling pulses. Opposite directions, half-period offset.
        svgSel._animLayer.append('line')
          .attr('class', 'eng-pair-pulse')
          .attr('data-from', sel).attr('data-to', pair);
        svgSel._animLayer.append('line')
          .attr('class', 'eng-pair-pulse-rev')
          .attr('data-from', pair).attr('data-to', sel);
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
          <div class="eng-panel-meta">${badge(char.default_formality)}${char.register ? `<span class="eng-panel-realm">${char.register}</span>` : ''}</div>
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
    if (svgSel) {
      svgSel._nodeSel && svgSel._nodeSel.select('text').text(d => loc() === 'en' ? d.name_en.split(' ')[0] : d.name_kr);
    }
    if (state.selected) renderPanel(state.selected, state.pair);
  };
})();
