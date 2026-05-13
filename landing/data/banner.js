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
  kr: 'Steam Deck도 설치할 수 있어요 ↓',
  en: 'Now available on Steam Deck ↓',
  kr_mobile: 'Steam Deck도 설치할 수 있어요 ↓',
  en_mobile: 'Now available on Steam Deck ↓',
  cta_kr: '',
  cta_en: '',
  href: '#install',
  channel: 'cli',
};
