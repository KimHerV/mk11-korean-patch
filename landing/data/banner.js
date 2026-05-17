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
  id: 'v1-1-release',
  active: true,
  kr: 'v1.1 업데이트가 출시되었습니다.',
  en: 'v1.1 update is now available.',
  kr_mobile: 'v1.1 업데이트 출시',
  en_mobile: 'v1.1 update available',
  // CTA disabled: whole banner is clickable and opens in a new tab.
  cta_kr: '',
  cta_en: '',
  href: 'changelog.html',
  // Open href in a new tab. Use true for external links and standalone subpages.
  // false / omitted keeps default same-window behavior for in-page anchors.
  new_tab: true,
  channel: null,
};
