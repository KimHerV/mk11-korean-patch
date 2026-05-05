/**
 * MK11 Korean Patch: download counter Worker
 *
 * Hourly cron: snapshot GitHub release download counts to KV with
 *   monotonic baseline correction so that `gh release upload --clobber`
 *   (which resets a single asset's count) never loses cumulative history.
 *
 * Routes:
 *   GET /public              : public JSON, total installer cumulative + latest CHS/font
 *   GET /snapshot?key=SECRET : manual snapshot trigger (used by scripts/release.ps1
 *                              right before --clobber to preserve the pre-reset value)
 *
 * KV schema:
 *   latest      → snapshot { recorded_at, releases:{tag:{installer,coalesced,font,published_at}}, totals }
 *   latest_raw  → { tag: {installer, coalesced, font} } last raw GitHub values (clobber detection)
 *   baseline    → { tag: {installer, coalesced, font} } cumulative baseline added to raw
 */

const GITHUB_REPO = 'KimHerV/mk11-korean-patch';
const GITHUB_API  = 'https://api.github.com';

// ── GitHub: fetch per-release raw counts ─────────────────────

async function fetchGitHubReleases(env) {
  const headers = { 'User-Agent': 'mk11-stats-worker/1.0', Accept: 'application/vnd.github+json' };
  if (env && env.GITHUB_TOKEN) headers.Authorization = `Bearer ${env.GITHUB_TOKEN}`;
  const res = await fetch(`${GITHUB_API}/repos/${GITHUB_REPO}/releases`, { headers });
  if (!res.ok) throw new Error(`GitHub API ${res.status}`);
  const releases = await res.json();

  // newest first from GitHub API; we keep that ordering
  const out = {};
  for (const r of releases) {
    const tag = r.tag_name || `id_${r.id}`;
    let installer = 0, coalesced = 0, font = 0;
    for (const a of r.assets || []) {
      if (a.name.endsWith('.exe'))    installer += a.download_count;
      if (a.name === 'Coalesced.CHS') coalesced += a.download_count;
      if (a.name.endsWith('.xxx'))    font      += a.download_count;
    }
    out[tag] = {
      installer,
      coalesced,
      font,
      published_at: (r.published_at || '').slice(0, 10),
      _order: Object.keys(out).length, // 0 = latest
    };
  }
  return out;
}

// ── Snapshot with baseline accumulation ──────────────────────

function emptyAssetCounts() {
  return { installer: 0, coalesced: 0, font: 0 };
}

async function takeSnapshot(env) {
  const raw      = await fetchGitHubReleases(env);
  const prevRaw  = JSON.parse((await env.MK11_STATS.get('latest_raw')) || '{}');
  const baseline = JSON.parse((await env.MK11_STATS.get('baseline'))   || '{}');

  // For each release+asset, detect clobber (raw decreased) and bank previous raw into baseline
  for (const tag of Object.keys(raw)) {
    const cur = raw[tag];
    const prev = prevRaw[tag] || emptyAssetCounts();
    if (!baseline[tag]) baseline[tag] = emptyAssetCounts();

    for (const k of ['installer', 'coalesced', 'font']) {
      if ((prev[k] || 0) > cur[k]) {
        // clobber: previous raw value is now lost from GitHub side, preserve it
        baseline[tag][k] = (baseline[tag][k] || 0) + (prev[k] || 0);
      }
    }
  }

  // Build adjusted per-release snapshot
  const releases = {};
  let total_installer = 0;
  for (const tag of Object.keys(raw)) {
    const r = raw[tag];
    const b = baseline[tag] || emptyAssetCounts();
    releases[tag] = {
      installer: r.installer + (b.installer || 0),
      coalesced: r.coalesced + (b.coalesced || 0),
      font:      r.font      + (b.font      || 0),
      published_at: r.published_at,
      is_latest: r._order === 0,
    };
    total_installer += releases[tag].installer;
  }

  // Latest release for CHS/font
  const latestTag = Object.entries(raw)
    .sort((a, b) => a[1]._order - b[1]._order)[0]?.[0];
  const latest = latestTag ? releases[latestTag] : null;

  const snap = {
    recorded_at: new Date().toISOString(),
    releases,
    latest_tag: latestTag,
    totals: {
      installer:        total_installer,                    // sum across all releases
      coalesced_latest: latest ? latest.coalesced : 0,      // latest release only
      font_latest:      latest ? latest.font      : 0,      // latest release only
    },
  };

  // Strip raw values from latest_raw payload (only counts, no metadata)
  const rawClean = {};
  for (const tag of Object.keys(raw)) {
    rawClean[tag] = {
      installer: raw[tag].installer,
      coalesced: raw[tag].coalesced,
      font:      raw[tag].font,
    };
  }

  await env.MK11_STATS.put('latest',     JSON.stringify(snap));
  await env.MK11_STATS.put('latest_raw', JSON.stringify(rawClean));
  await env.MK11_STATS.put('baseline',   JSON.stringify(baseline));
  return snap;
}

// ── Worker entry ─────────────────────────────────────────────

const CORS_HEADERS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
};

export default {
  async scheduled(_event, env) {
    await takeSnapshot(env);
  },

  async fetch(request, env) {
    const url = new URL(request.url);

    // Public endpoint: no auth, returns just the headline numbers
    if (url.pathname === '/public') {
      let snap = JSON.parse((await env.MK11_STATS.get('latest')) || 'null');
      if (!snap) {
        // Cold start: take a snapshot synchronously
        snap = await takeSnapshot(env);
      }
      const t = snap.totals || {};
      return new Response(JSON.stringify({
        total_installs:    t.installer        || 0,
        coalesced_latest:  t.coalesced_latest || 0,
        font_latest:       t.font_latest      || 0,
        latest_tag:        snap.latest_tag    || null,
        recorded_at:       snap.recorded_at   || null,
      }), {
        headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=300', ...CORS_HEADERS },
      });
    }

    // Authenticated manual snapshot trigger (used by scripts/release.ps1)
    if (url.pathname === '/snapshot') {
      if (url.searchParams.get('key') !== env.STATS_KEY) {
        return new Response('Unauthorized', { status: 401 });
      }
      const snap = await takeSnapshot(env);
      return new Response(JSON.stringify(snap, null, 2), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response('Not Found', { status: 404 });
  },
};
