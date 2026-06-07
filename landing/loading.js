(function () {
  'use strict';

  var debug = location.hostname === 'localhost' &&
              new URLSearchParams(location.search).has('debug');
  var reduceMotion = false;
  try { reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (_) {}

  /* ─────────────────────────────────────────────────────────────
     MK11 intro splash = the main loading screen.

     The hero video is held at frame 0, then once it can play (canplay)
     and the minimum display time has elapsed, the splash lifts and the
     video plays from the start. So the moment the splash clears, the hero
     begins at 0s like an opening sequence.

     The old hero blur overlay (.hero-media-loader) existed to hide a
     not-yet-loaded video on slow connections; this splash now does that
     job better (it waits for actual readiness), so it was removed. The
     carousel spinner is a separate scenario (scroll-triggered lazy-load)
     and is kept as-is.

     Click / Esc / Enter / Space skips immediately, and even if JS dies the
     CSS mk11-splash-out keyframe (fail-safe) removes the overlay on its own.
     ───────────────────────────────────────────────────────────── */
  var splash = document.getElementById('mk11-splash');
  var video  = document.querySelector('.hero-video');

  // Pause at frame 0 so autoplay doesn't run on behind the splash
  if (video) {
    try { video.pause(); video.currentTime = 0; } catch (_) {}
  }

  if (splash) {
    var lifted = false;
    // Logo fill-rise (1.4s) + brief hold. Shorter when reduced motion is preferred.
    var MIN = debug ? 6000 : (reduceMotion ? 700 : 2000);
    var minDone = false;
    var ready = !video;            // no media wait needed when there's no hero video

    function lift() {
      if (lifted) return;
      lifted = true;
      // Start the held hero entrance animation from the beginning
      document.documentElement.classList.remove('mk11-loading');
      if (video) {
        try { video.currentTime = 0; } catch (_) {}
        video.play().catch(function () {});
      }
      splash.classList.add('mk11-splash--out');
      var removed = false;
      function remove() {
        if (removed) return;
        removed = true;
        if (splash.parentNode) splash.parentNode.removeChild(splash);
        document.removeEventListener('keydown', onKey);
      }
      splash.addEventListener('transitionend', remove, { once: true });
      setTimeout(remove, 700);     // remove even if transitionend doesn't fire
    }
    function maybeLift() { if (minDone && ready) lift(); }

    // Skip
    function onKey(e) {
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') lift();
    }
    splash.addEventListener('click', lift);
    document.addEventListener('keydown', onKey);

    // Minimum display time
    setTimeout(function () { minDone = true; maybeLift(); }, MIN);

    // Readiness signal: hero video canplay (or already ready)
    if (video) {
      if (video.readyState >= 3) {
        ready = true;
      } else {
        video.addEventListener('canplay', function () { ready = true; maybeLift(); }, { once: true });
      }
    }
    // Backup signal + hard cap (never trap the page on a slow/failed load)
    window.addEventListener('load', function () { ready = true; maybeLift(); });
    setTimeout(lift, 5000);

    maybeLift();
  } else if (video) {
    // No splash (edge case): just play the video normally
    if (video.readyState >= 3) {
      video.play().catch(function () {});
    } else {
      video.addEventListener('canplay', function () { video.play().catch(function () {}); }, { once: true });
    }
  }

  /* ── Carousel image spinner ─────────────────────────────────────
     Carousel images are loading="lazy", so they load only when the user
     scrolls to them (long after the splash is gone). The splash can't cover
     that, so this keeps the original role: show a spinner instead of an
     empty slide on unstable connections. */
  function createSpinner() {
    var el = document.createElement('div');
    el.className = 'media-loader';
    el.innerHTML = '<div class="media-loader__spinner"></div>';
    return el;
  }

  var slides = document.querySelectorAll('.carousel-slide');
  for (var i = 0; i < slides.length; i++) {
    (function (slide) {
      var img = slide.querySelector('img');
      if (!img) return;

      var loader = createSpinner();
      slide.appendChild(loader);
      img.classList.add('media-loading');

      function revealImg() {
        img.classList.remove('media-loading');
        loader.classList.add('fade-out');
        loader.addEventListener('transitionend', function () {
          if (loader.parentNode) loader.parentNode.removeChild(loader);
        }, { once: true });
        setTimeout(function () {
          if (loader.parentNode) loader.parentNode.removeChild(loader);
        }, 700);
      }

      if (img.complete && img.naturalWidth > 0) {
        revealImg();
      } else {
        img.addEventListener('load',  revealImg, { once: true });
        img.addEventListener('error', revealImg, { once: true });
      }
    })(slides[i]);
  }
})();
