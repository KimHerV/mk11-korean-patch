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
 *   latest      → snapshot { recorded_at, releases:{tag:{installer_gui,installer_cli,coalesced,font,published_at}}, totals }
 *   latest_raw  → { tag: {installer_gui, installer_cli, coalesced, font} } last raw GitHub values (clobber detection)
 *   baseline    → { tag: {installer_gui, installer_cli, coalesced, font} } cumulative baseline added to raw
 *
 * Migration note: KV entries written before the GUI/CLI split used `installer` (GUI-only).
 *   The code reads old `installer` as `installer_gui` on first run, then discards the old key.
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

  const out = {};
  for (const r of releases) {
    const tag = r.tag_name || `id_${r.id}`;
    let installer_gui = 0, installer_cli = 0, coalesced = 0, font = 0;
    for (const a of r.assets || []) {
      if (a.name === 'MK11-Korean-Patch-Setup.exe')     installer_gui += a.download_count;
      if (a.name === 'MK11-Korean-Patch-CLI-Setup.zip') installer_cli += a.download_count;
      if (a.name === 'Coalesced.CHS')                   coalesced     += a.download_count;
      if (a.name.endsWith('.xxx'))                       font          += a.download_count;
    }
    out[tag] = {
      installer_gui,
      installer_cli,
      coalesced,
      font,
      published_at: (r.published_at || '').slice(0, 10),
      _order: Object.keys(out).length,
    };
  }
  return out;
}

// ── Snapshot with baseline accumulation ──────────────────────

function emptyAssetCounts() {
  return { installer_gui: 0, installer_cli: 0, coalesced: 0, font: 0 };
}

// Reads a field from a KV entry, migrating the old combined `installer` key to `installer_gui`.
function readField(entry, key) {
  if (entry[key] !== undefined) return entry[key];
  if (key === 'installer_gui' && entry.installer !== undefined) return entry.installer;
  return 0;
}

async function takeSnapshot(env) {
  const raw      = await fetchGitHubReleases(env);
  const prevRaw  = JSON.parse((await env.MK11_STATS.get('latest_raw')) || '{}');
  const baseline = JSON.parse((await env.MK11_STATS.get('baseline'))   || '{}');

  for (const tag of Object.keys(raw)) {
    const cur  = raw[tag];
    const prev = prevRaw[tag] || emptyAssetCounts();
    if (!baseline[tag]) baseline[tag] = emptyAssetCounts();

    for (const k of ['installer_gui', 'installer_cli', 'coalesced', 'font']) {
      const prevVal = readField(prev, k);
      if (prevVal > cur[k]) {
        baseline[tag][k] = readField(baseline[tag], k) + prevVal;
      }
    }
  }

  const releases = {};
  let total_gui = 0, total_cli = 0;
  for (const tag of Object.keys(raw)) {
    const r = raw[tag];
    const b = baseline[tag] || emptyAssetCounts();
    const gui = r.installer_gui + readField(b, 'installer_gui');
    const cli = r.installer_cli + readField(b, 'installer_cli');
    releases[tag] = {
      installer_gui: gui,
      installer_cli: cli,
      coalesced:     r.coalesced + (b.coalesced || 0),
      font:          r.font      + (b.font      || 0),
      published_at:  r.published_at,
      is_latest:     r._order === 0,
    };
    total_gui += gui;
    total_cli += cli;
  }

  const latestTag = Object.entries(raw)
    .sort((a, b) => a[1]._order - b[1]._order)[0]?.[0];
  const latest = latestTag ? releases[latestTag] : null;

  const snap = {
    recorded_at: new Date().toISOString(),
    releases,
    latest_tag: latestTag,
    totals: {
      installer_gui:    total_gui,
      installer_cli:    total_cli,
      installer:        total_gui + total_cli,              // combined, for landing counter
      coalesced_latest: latest ? latest.coalesced : 0,
      font_latest:      latest ? latest.font      : 0,
    },
  };

  const rawClean = {};
  for (const tag of Object.keys(raw)) {
    rawClean[tag] = {
      installer_gui: raw[tag].installer_gui,
      installer_cli: raw[tag].installer_cli,
      coalesced:     raw[tag].coalesced,
      font:          raw[tag].font,
    };
  }

  await env.MK11_STATS.put('latest',     JSON.stringify(snap));
  await env.MK11_STATS.put('latest_raw', JSON.stringify(rawClean));
  await env.MK11_STATS.put('baseline',   JSON.stringify(baseline));
  await appendTimeseries(env, snap, rawClean);
  return snap;
}

// ── Timeseries: append once per UTC day to a single 'timeseries' key.
// Each entry preserves per-tag counts so version-wise history is retained
// even after newer releases shift `latest_tag`. Idempotent: if today's
// entry exists, the snapshot is updated in-place rather than appended.
async function appendTimeseries(env, snap, rawClean) {
  try {
    const today = new Date().toISOString().slice(0, 10);
    const existing = JSON.parse((await env.MK11_STATS.get('timeseries')) || '[]');
    const entry = {
      date:        today,
      latest_tag:  snap.latest_tag || null,
      totals: {
        installer_gui: (snap.totals && snap.totals.installer_gui) || 0,
        installer_cli: (snap.totals && snap.totals.installer_cli) || 0,
      },
      by_tag:      rawClean || {},
      recorded_at: snap.recorded_at || null,
    };

    if (existing.length && existing[existing.length - 1].date === today) {
      // Same UTC day: refresh in place so the last entry reflects the latest snapshot.
      existing[existing.length - 1] = entry;
    } else {
      existing.push(entry);
    }
    await env.MK11_STATS.put('timeseries', JSON.stringify(existing));
  } catch (e) {
    // Timeseries failure must not break the main snapshot path.
    console.error('appendTimeseries failed:', e);
  }
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

    if (url.pathname === '/public') {
      let snap = JSON.parse((await env.MK11_STATS.get('latest')) || 'null');
      if (!snap) snap = await takeSnapshot(env);
      const t = snap.totals || {};
      return new Response(JSON.stringify({
        total_installs:     t.installer     || 0,
        total_installs_gui: t.installer_gui || 0,
        total_installs_cli: t.installer_cli || 0,
        coalesced_latest:   t.coalesced_latest || 0,
        font_latest:        t.font_latest      || 0,
        latest_tag:         snap.latest_tag    || null,
        recorded_at:        snap.recorded_at   || null,
      }), {
        headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=300', ...CORS_HEADERS },
      });
    }

    if (url.pathname === '/snapshot') {
      if (url.searchParams.get('key') !== env.STATS_KEY) {
        return new Response('Unauthorized', { status: 401 });
      }
      const snap = await takeSnapshot(env);
      return new Response(JSON.stringify(snap, null, 2), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (url.pathname === '/timeseries') {
      const series = JSON.parse((await env.MK11_STATS.get('timeseries')) || '[]');
      return new Response(JSON.stringify({ count: series.length, entries: series }, null, 2), {
        headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=300', ...CORS_HEADERS },
      });
    }

    return new Response('Not Found', { status: 404 });
  },
};
