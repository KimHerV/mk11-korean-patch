/**
 * Site announcement banner config.
 *
 * id      — unique key suffix for localStorage dismiss.
 *           Bump (e.g. v2-...) to invalidate previous dismissals.
 * active  — set false to hide without deleting this file.
 * kr / en — banner text shown per locale.
 * href    — scroll-to anchor when the banner body is clicked (null = no scroll).
 * channel — install card to auto-activate on click: 'gui' | 'cli' | null.
 *
 * Dev: to reset dismiss state, run in DevTools console:
 *   localStorage.removeItem('mk11-banner-' + window.MK11_BANNER.id)
 * then reload.
 */
window.MK11_BANNER = {
  id: 'v1-cli',
  active: true,
  kr: 'CLI 설치 채널 추가 · Steam Deck (Linux) 지원',
  en: 'CLI installer added · Steam Deck (Linux) supported',
  kr_mobile: 'CLI 설치 채널 추가',
  en_mobile: 'CLI installer added',
  cta_kr: '자세히 보기',
  cta_en: 'Learn more',
  href: '#install',
  channel: 'cli',
};
