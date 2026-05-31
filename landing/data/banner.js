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
  id: 'v1-1-story-update',
  active: true,
  kr: 'v1.2 업데이트: 스토리 1부 번역 품질 개선.',
  en: 'Story Part 1 translation updated.',
  kr_mobile: 'v1.2 업데이트: 스토리 1부 번역 품질 개선.',
  en_mobile: 'Story Part 1 updated.',
  cta_kr: '',
  cta_en: '',
  href: '#install',
  new_tab: false,
  channel: 'gui',
};
