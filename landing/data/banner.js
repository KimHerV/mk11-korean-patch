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
  kr: 'v1.2: 스토리 2부, 인게임 대화 품질 개선 및 기술명 동기화.',
  en: 'v1.2: Story Part 2, in-game dialogue quality improvements, and move name sync.',
  kr_mobile: 'v1.2: 스토리 2부·대화 개선.',
  en_mobile: 'v1.2: Story Part 2 and dialogue updated.',
  cta_kr: '',
  cta_en: '',
  href: '#install',
  new_tab: false,
  channel: 'gui',
};
