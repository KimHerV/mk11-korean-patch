(function () {
  'use strict';

  var debug = location.hostname === 'localhost' &&
              new URLSearchParams(location.search).has('debug');
  var DELAY = debug ? 4000 : 0;

  /* After DELAY ms: optionally remove media-loading class, fade-out the overlay, run onReveal */
  function makeReveal(mediaEl, loaderEl, onReveal) {
    var done = false;
    return function () {
      if (done) return;
      done = true;
      setTimeout(function () {
        if (mediaEl) mediaEl.classList.remove('media-loading');
        if (onReveal) onReveal();
        if (!loaderEl) return;
        loaderEl.classList.add('fade-out');
        loaderEl.addEventListener('transitionend', function () {
          if (loaderEl.parentNode) loaderEl.parentNode.removeChild(loaderEl);
        }, { once: true });
        // Safety: remove even if transitionend doesn't fire
        setTimeout(function () {
          if (loaderEl.parentNode) loaderEl.parentNode.removeChild(loaderEl);
        }, 1100);
      }, DELAY);
    };
  }

  function createSpinner() {
    var el = document.createElement('div');
    el.className = 'media-loader';
    el.innerHTML = '<div class="media-loader__spinner"></div>';
    return el;
  }

  /* ── Hero video ─────────────────────────────────────────── */
  // Use a backdrop-filter overlay instead of filter on the video element.
  // filter: blur() on <video> can be bypassed by the browser's GPU compositing layer.
  // backdrop-filter on a sibling div is reliable regardless of video rendering mode.
  var video = document.querySelector('.hero-video');
  if (video) {
    var hero = video.closest('.hero');
    if (hero && (debug || video.readyState < 3)) {
      // Pause video so the loading state looks authentic (static frame under the overlay)
      video.pause();

      var heroLoader = document.createElement('div');
      heroLoader.className = 'hero-media-loader';
      hero.appendChild(heroLoader);

      // Play video when the overlay is removed
      var revealHero = makeReveal(null, heroLoader, function () {
        video.play().catch(function () {});
      });

      if (debug) {
        revealHero();
      } else if (video.readyState >= 3) {
        revealHero();
      } else {
        video.addEventListener('canplay', revealHero, { once: true });
        setTimeout(revealHero, 8000); // hard fallback for very slow loads
      }
    }
  }

  /* ── Carousel images ────────────────────────────────────── */
  var slides = document.querySelectorAll('.carousel-slide');
  for (var i = 0; i < slides.length; i++) {
    (function (slide) {
      var img = slide.querySelector('img');
      if (!img) return;

      var loader = createSpinner();
      slide.appendChild(loader);
      img.classList.add('media-loading');

      var revealImg = makeReveal(img, loader);

      if (debug) {
        revealImg();
      } else if (img.complete && img.naturalWidth > 0) {
        revealImg();
      } else {
        img.addEventListener('load',  revealImg, { once: true });
        img.addEventListener('error', revealImg, { once: true });
      }
    })(slides[i]);
  }

  /* ── Debug banner ───────────────────────────────────────── */
  if (debug) {
    var banner = document.createElement('div');
    banner.className = 'media-debug-banner';
    banner.textContent =
      'DEBUG  |  loading transitions delayed ' + (DELAY / 1000) + 's' +
      '  —  remove ?debug from URL to disable';
    document.body.appendChild(banner);
  }
})();
