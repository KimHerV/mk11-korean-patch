/**
 * Site announcement banner config.
 *
 * id      : unique key suffix for localStorage dismiss.
 *           Bump (e.g. v2-...) to invalidate previous dismissals.
 * active  : set false to hide without deleting this file.
 * kr / en : banner text shown per locale.
 * href    : '#section' = scroll to anchor / '/path' or URL = navigate to page.
 * new_tab : true opens href in a new tab (used for /changelog.html and external URLs).
 * channel : install card to auto-activate on click: 'gui' | 'cli' | null.
 *           (only relevant for in-page anchor href; ignored for external nav)
 *
 * Dev: to reset dismiss state, run in DevTools console:
 *   localStorage.removeItem('mk11-banner-' + window.MK11_BANNER.id)
 * then reload.
 */
window.MK11_BANNER = {
  id: 'v1-2-release',
  active: true,
  kr: 'v1.2: 전투 자동 대사 한국어 추가, 인게임 대화 교정.',
  en: 'v1.2: Combat lines now in Korean, in-game dialogue re-tuned.',
  kr_mobile: 'v1.2: 전투 대사 한국어 추가.',
  en_mobile: 'v1.2: Combat lines now in Korean.',
  cta_kr: '',
  cta_en: '',
  href: '#install',
  new_tab: false,
  channel: 'gui',
};
