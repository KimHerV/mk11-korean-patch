// MK11 OST Player: YouTube IFrame API
(function () {
  const VIDEO_ID   = 'X68Wy4U017U'; // MK11 OST Official (WB Games)
  let   marqueeRaf = null;
  const YT_URL     = 'https://www.youtube.com/watch?v=' + VIDEO_ID;
  const PLAYER_H   = 80;

  let player        = null;
  let progressTimer = null;

  let bar, playBtn, muteBtn,
      progressFill, progressBar, timeEl, durationEl,
      titleEl, volSlider, unmuteHint;

  // ── SVG icons (solid currentColor) ──────────────────────────

  const ICON_PLAY  = '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><polygon points="6 3 20 12 6 21 6 3"/></svg>';
  const ICON_PAUSE = '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><rect width="4" height="16" x="6" y="4"/><rect width="4" height="16" x="14" y="4"/></svg>';
  const ICON_VOL_HIGH = '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>';
  const ICON_VOL_LOW  = '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z"/></svg>';
  const ICON_VOL_MUTE = '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>';

  // ── Init ─────────────────────────────────────────────────────

  function init() {
    bar          = document.getElementById('music-player');
    playBtn      = document.getElementById('music-play');
    muteBtn      = document.getElementById('music-mute');
    progressFill = document.getElementById('music-progress-fill');
    progressBar  = document.getElementById('music-progress-bar');
    timeEl       = document.getElementById('music-time');
    durationEl   = document.getElementById('music-duration');
    titleEl      = document.getElementById('music-title');
    volSlider    = document.getElementById('music-vol');
    unmuteHint   = document.getElementById('music-unmute-hint');

    if (!bar) return;

    const isMobile = window.innerWidth <= 600;
    document.body.style.paddingBottom = (isMobile ? 62 : PLAYER_H) + 'px';

    // title click: open YouTube in new tab
    const titleWrap = document.getElementById('music-title-link');
    if (titleWrap) titleWrap.addEventListener('click', () => window.open(YT_URL, '_blank', 'noopener'));

    playBtn.addEventListener('click', togglePlay);
    muteBtn.addEventListener('click', toggleMute);
    volSlider.addEventListener('input', onVolumeChange);
    progressBar.addEventListener('click', seekTo);

    // unmute hint click
    if (unmuteHint) unmuteHint.addEventListener('click', () => {
      if (player?.isMuted()) { player.unMute(); updateVolumeUI(player.getVolume()); }
      unmuteHint.classList.remove('visible');
    });

    // load YouTube IFrame API
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(tag);
  }

  // ── YouTube API ─────────────────────────────────────────────

  window.onYouTubeIframeAPIReady = function () {
    player = new YT.Player('yt-iframe', {
      height: '1', width: '1',
      videoId: VIDEO_ID,
      playerVars: {
        autoplay: 1, mute: 1,  // muted autoplay (browser autoplay policy)
        controls: 0, rel: 0,
        enablejsapi: 1, playsinline: 1,
        loop: 1, playlist: VIDEO_ID,
      },
      events: { onReady: onReady, onStateChange: onStateChange },
    });
  };

  function onReady(e) {
    e.target.setVolume(50);
    updateVolumeUI(50, true /* muted */);
    // start muted, show unmute hint
    setTimeout(() => {
      if (unmuteHint) unmuteHint.classList.add('visible');
    }, 1500);
  }

  function onStateChange(e) {
    if (e.data === YT.PlayerState.PLAYING) {
      setPlayIcon(true);
      updateTrackInfo();
      startTimer();
    } else {
      setPlayIcon(false);
      stopTimer();
    }
    if (e.data === YT.PlayerState.ENDED) {
      player.seekTo(0); player.playVideo();
    }
  }

  // ── Controls ─────────────────────────────────────────────────

  function togglePlay() {
    if (!player) return;
    player.getPlayerState() === YT.PlayerState.PLAYING
      ? player.pauseVideo()
      : player.playVideo();
  }

  function toggleMute() {
    if (!player) return;
    if (player.isMuted()) {
      player.unMute();
      updateVolumeUI(player.getVolume(), false);
      if (unmuteHint) unmuteHint.classList.remove('visible');
    } else {
      player.mute();
      updateVolumeUI(player.getVolume(), true);
    }
  }

  function onVolumeChange() {
    if (!player) return;
    const v = parseInt(volSlider.value, 10);
    player.setVolume(v);
    if (player.isMuted()) { player.unMute(); if (unmuteHint) unmuteHint.classList.remove('visible'); }
    updateVolumeUI(v, false);
  }

  function seekTo(e) {
    if (!player) return;
    const rect = progressBar.getBoundingClientRect();
    const pct  = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    player.seekTo(pct * player.getDuration(), true);
  }

  // ── Progress timer ───────────────────────────────────────────

  function startTimer() {
    stopTimer();
    progressTimer = setInterval(updateProgress, 500);
  }
  function stopTimer() { clearInterval(progressTimer); }

  function updateProgress() {
    if (!player) return;
    const cur = player.getCurrentTime() || 0;
    const dur = player.getDuration()    || 0;
    if (dur > 0) progressFill.style.width = (cur / dur * 100) + '%';
    timeEl.textContent     = fmt(cur);
    durationEl.textContent = fmt(dur);
  }

  // ── UI update ────────────────────────────────────────────────

  function updateTrackInfo() {
    if (!player) return;
    const data = player.getVideoData?.();
    if (data?.title) {
      titleEl.textContent = data.title;
      checkMarquee();
    }
  }

  function checkMarquee() {
    const wrap = titleEl.closest('.mp-title-wrap');
    if (!wrap) return;

    // cancel existing rAF
    if (marqueeRaf) { cancelAnimationFrame(marqueeRaf); marqueeRaf = null; }
    titleEl.style.transform = '';
    setMask(wrap, 0, 0); // reset mask

    const overflow = titleEl.scrollWidth - wrap.clientWidth;
    if (overflow <= 4) return; // no overflow, skip marquee

    const FADE     = 22;   // px, gradient fade width
    const SPEED    = 38;   // px/s
    const PAUSE_MS = 1200; // ms, pause at each end
    const MS_PER_F = 1000 / 60;

    let offset     = 0;
    let dir        = 1;          // 1 = scroll left, -1 = scroll right
    let pauseLeft  = PAUSE_MS;   // initial pause at start
    let lastTime   = null;

    function frame(ts) {
      if (!lastTime) lastTime = ts;
      const dt = Math.min(ts - lastTime, 64); // cap at 2 frames
      lastTime = ts;

      if (pauseLeft > 0) {
        pauseLeft -= dt;
      } else {
        offset += SPEED * (dt / 1000) * dir;
        if (offset >= overflow) {
          offset    = overflow;
          dir       = -1;
          pauseLeft = PAUSE_MS;
        } else if (offset <= 0) {
          offset    = 0;
          dir       = 1;
          pauseLeft = PAUSE_MS;
        }
      }

      titleEl.style.transform = `translateX(-${offset}px)`;
      setMask(wrap, offset, overflow, FADE);
      marqueeRaf = requestAnimationFrame(frame);
    }

    setMask(wrap, 0, overflow, FADE); // initial: right fade only
    marqueeRaf = requestAnimationFrame(frame);
  }

  function setMask(wrap, offset, overflow, fade) {
    if (!overflow || fade === undefined) {
      wrap.style.webkitMaskImage = 'none';
      wrap.style.maskImage       = 'none';
      return;
    }
    const atStart = offset <= 2;
    const atEnd   = offset >= overflow - 2;
    let mask;
    if (atStart && atEnd) {
      mask = 'none';
    } else if (atStart) {
      // at start: right fade only
      mask = `linear-gradient(to right, black calc(100% - ${fade}px), transparent 100%)`;
    } else if (atEnd) {
      // at end: left fade only
      mask = `linear-gradient(to right, transparent 0px, black ${fade}px)`;
    } else {
      // in motion: both fades
      mask = `linear-gradient(to right, transparent 0px, black ${fade}px, black calc(100% - ${fade}px), transparent 100%)`;
    }
    wrap.style.webkitMaskImage = mask;
    wrap.style.maskImage       = mask;
  }

  function setPlayIcon(playing) {
    playBtn.innerHTML = playing ? ICON_PAUSE : ICON_PLAY;
  }

  function updateVolumeUI(v, muted) {
    volSlider.value = v;
    volSlider.style.setProperty('--vol-pct', (muted ? 0 : v) + '%');
    muteBtn.innerHTML = muted || v === 0
      ? ICON_VOL_MUTE
      : v < 50 ? ICON_VOL_LOW : ICON_VOL_HIGH;
  }

  function fmt(sec) {
    sec = Math.floor(sec || 0);
    return Math.floor(sec / 60) + ':' + String(sec % 60).padStart(2, '0');
  }

  document.addEventListener('DOMContentLoaded', init);
})();
