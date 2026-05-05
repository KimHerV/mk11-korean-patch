/**
 * MK11 Korean Patch: unified stats Worker
 *
 * Cron (daily 02:00 UTC): snapshot GitHub release download counts to KV.
 *   Per-release tracking with monotonic baseline correction so that
 *   `gh release upload --clobber` (which resets a single asset's count)
 *   never loses cumulative history.
 *
 * Routes:
 *   GET /public                  : public JSON, total installer cumulative + latest CHS/font
 *   GET /stats?key=SECRET        : unified HTML dashboard
 *   GET /stats?key=SECRET&fmt=json : raw JSON
 *   GET /snapshot?key=SECRET     : manual snapshot trigger
 *
 * KV schema:
 *   day:YYYY-MM-DD  → snapshot { recorded_at, releases:{tag:{installer,coalesced,font,published_at}}, totals }
 *   latest          → same as latest day:* (legacy mirror)
 *   latest_raw      → { tag: {installer, coalesced, font} } last raw GitHub values (clobber detection)
 *   baseline        → { tag: {installer, coalesced, font} } cumulative baseline added to raw
 */

const GITHUB_REPO = 'KimHerV/mk11-korean-patch';
const GITHUB_API  = 'https://api.github.com';
const CF_GQL      = 'https://api.cloudflare.com/client/v4/graphql';
const ACCOUNT_ID  = '987455b8ac0de3b40c578b52c12feb98';
const SITE_TAG    = 'a09a14b2b63a4624a68b36b876727ebf';

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

  const date = new Date().toISOString().slice(0, 10);
  // Strip raw values from latest_raw payload (only counts, no metadata)
  const rawClean = {};
  for (const tag of Object.keys(raw)) {
    rawClean[tag] = {
      installer: raw[tag].installer,
      coalesced: raw[tag].coalesced,
      font:      raw[tag].font,
    };
  }

  await env.MK11_STATS.put(`day:${date}`, JSON.stringify(snap));
  await env.MK11_STATS.put('latest',     JSON.stringify(snap));
  await env.MK11_STATS.put('latest_raw', JSON.stringify(rawClean));
  await env.MK11_STATS.put('baseline',   JSON.stringify(baseline));
  return snap;
}

async function loadDays(env) {
  const list = await env.MK11_STATS.list({ prefix: 'day:' });
  const days = [];
  for (const k of list.keys) {
    const v = await env.MK11_STATS.get(k.name);
    if (v) days.push({ date: k.name.slice(4), ...JSON.parse(v) });
  }
  return days.sort((a, b) => a.date.localeCompare(b.date));
}

// ── Cloudflare Web Analytics (GraphQL) ───────────────────────

async function fetchWebAnalytics(token, days = 30) {
  const since = new Date(Date.now() - days * 86400000).toISOString().slice(0, 10);
  const today = new Date().toISOString().slice(0, 10);

  // Cloudflare deprecated several RUM dimensions in 2025 (clientCountryName,
  // refererHost, deviceType, browserFamily, osFamily, pageViews). The full
  // breakdown lives in the Cloudflare dashboard now; this worker keeps only
  // the daily visits + pageload count for a fast headline view.
  const query = `{
    viewer {
      accounts(filter: {accountTag: "${ACCOUNT_ID}"}) {
        daily: rumPageloadEventsAdaptiveGroups(
          filter: { AND: [
            { date_geq: "${since}" }
            { date_leq: "${today}" }
            { siteTag: "${SITE_TAG}" }
          ]}
          limit: 1000
          orderBy: [date_ASC]
        ) {
          sum { visits }
          count
          dimensions { date }
        }
      }
    }
  }`;

  if (!token) throw new Error('CF_ANALYTICS_TOKEN secret is not set');
  const res = await fetch(CF_GQL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '<no body>');
    throw new Error(`CF GraphQL HTTP ${res.status}: ${body.slice(0, 500)}`);
  }
  const json = await res.json();
  if (json.errors) {
    throw new Error(`CF GraphQL errors: ${JSON.stringify(json.errors).slice(0, 500)}`);
  }
  const acct = json?.data?.viewer?.accounts?.[0];
  if (!acct) {
    throw new Error(`CF GraphQL: no account in response (data=${JSON.stringify(json?.data || {}).slice(0, 300)})`);
  }
  return {
    daily: acct?.daily || [],
  };
}

// ── HTML dashboard ───────────────────────────────────────────

function renderHtml(dlDays, wa, days = 30, key = '') {
  const latestSnap = dlDays[dlDays.length - 1] || {};
  const totals     = latestSnap.totals || { installer: 0, coalesced_latest: 0, font_latest: 0 };
  const releases   = latestSnap.releases || {};

  // Daily delta of total installer
  const withDelta = dlDays.map((d, i) => {
    const cur = d.totals?.installer || 0;
    const prev = i === 0 ? 0 : (dlDays[i - 1].totals?.installer || 0);
    return { date: d.date, installer: cur, delta: cur - prev };
  });
  const maxDlDelta = Math.max(...withDelta.map(d => d.delta || 0), 1);

  // Web Analytics totals
  const totalVisits    = wa.daily.reduce((s, d) => s + (d.sum?.visits || 0), 0);
  const totalPageViews = wa.daily.reduce((s, d) => s + (d.count || 0), 0);
  const todayWa        = wa.daily[wa.daily.length - 1];
  const todayVisits    = todayWa?.sum?.visits || 0;
  const maxWaVisits    = Math.max(...wa.daily.map(d => d.sum?.visits || 0), 1);

  // Per-version breakdown rows (sorted by published_at desc)
  const versionRows = Object.entries(releases)
    .sort((a, b) => (b[1].published_at || '').localeCompare(a[1].published_at || ''))
    .map(([tag, r]) => `<tr>
      <td>${tag}${r.is_latest ? ' <span class="badge">latest</span>' : ''}</td>
      <td>${r.published_at || ''}</td>
      <td class="g">${(r.installer || 0).toLocaleString()}</td>
      <td>${(r.coalesced || 0).toLocaleString()}</td>
      <td>${(r.font || 0).toLocaleString()}</td>
    </tr>`).join('');

  // Daily snapshot rows
  const dlRows = [...withDelta].reverse().map(d => {
    const bar = Math.round(((d.delta || 0) / maxDlDelta) * 80);
    return `<tr>
      <td>${d.date}</td>
      <td class="g">${(d.installer || 0).toLocaleString()}</td>
      <td>+${(d.delta || 0).toLocaleString()}</td>
      <td><span class="bar" style="width:${bar}px"></span></td>
    </tr>`;
  }).join('');

  const waRows = [...wa.daily].reverse().map(d => {
    const v   = d.sum?.visits || 0;
    const pv  = d.count || 0;
    const bar = Math.round((v / maxWaVisits) * 80);
    return `<tr>
      <td>${d.dimensions?.date || ''}</td>
      <td class="g">${v.toLocaleString()}</td>
      <td>${pv.toLocaleString()}</td>
      <td><span class="bar" style="width:${bar}px"></span></td>
    </tr>`;
  }).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>MK11 Korean Patch: Stats</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: system-ui, sans-serif; background: #0a0a0a; color: #f0ece0; padding: 32px 24px; max-width: 960px; }
  h1 { color: #c9a84c; font-size: 1.3rem; margin-bottom: 4px; }
  .sub { color: #555; font-size: 0.78rem; margin-bottom: 28px; }
  h2 { font-size: 0.9rem; color: #888; text-transform: uppercase; letter-spacing: .08em; margin: 32px 0 12px; }
  .cards { display: flex; flex-wrap: wrap; gap: 12px; margin-bottom: 8px; }
  .card { background: #111; border: 1px solid #2a2a2a; border-radius: 8px; padding: 14px 20px; min-width: 130px; }
  .card .num { font-size: 1.7rem; font-weight: 700; color: #c9a84c; }
  .card .lbl { font-size: 0.72rem; color: #666; margin-top: 3px; }
  .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-top: 8px; }
  table { width: 100%; border-collapse: collapse; font-size: 0.82rem; }
  th { text-align: left; padding: 7px 10px; color: #555; border-bottom: 1px solid #1e1e1e; }
  td { padding: 6px 10px; border-bottom: 1px solid #141414; }
  .g { color: #c9a84c; }
  .bar { display: inline-block; height: 7px; background: #7a6030; border-radius: 2px; vertical-align: middle; min-width: 2px; }
  .badge { display: inline-block; font-size: 0.65rem; padding: 1px 6px; background: #1e1a0e; color: #c9a84c; border: 1px solid #7a6030; border-radius: 3px; margin-left: 4px; }
  .divider { border: none; border-top: 1px solid #1e1e1e; margin: 28px 0; }
  .period { display: flex; gap: 6px; margin: 12px 0 24px; }
  .period-btn { padding: 4px 12px; border-radius: 4px; font-size: 0.78rem; text-decoration: none; background: #1a1a1a; color: #888; border: 1px solid #2a2a2a; }
  .period-btn:hover { color: #c9a84c; border-color: #7a6030; }
  .period-btn.active { background: #1e1a0e; color: #c9a84c; border-color: #7a6030; }
  @media (max-width: 600px) { .two-col { grid-template-columns: 1fr; } }
</style>
</head>
<body>
<h1>MK11 Korean Patch: Stats</h1>
<p class="sub">Download snapshots: daily 02:00 UTC. Web Analytics: last ${days} days.</p>
<div class="period">
  ${[7, 30, 90, 180, 365].map(d =>
    `<a href="/stats?key=${key}&days=${d}" class="period-btn${d === days ? ' active' : ''}">${d}d</a>`
  ).join('')}
</div>

<h2>Headline KPIs</h2>
<div class="cards">
  <div class="card"><div class="num">${(totals.installer || 0).toLocaleString()}</div><div class="lbl">Total Installs (all versions)</div></div>
  <div class="card"><div class="num">${(totals.coalesced_latest || 0).toLocaleString()}</div><div class="lbl">Active Users (latest .CHS)</div></div>
  <div class="card"><div class="num">${(totals.font_latest || 0).toLocaleString()}</div><div class="lbl">Font Patches (latest)</div></div>
  <div class="card"><div class="num">${dlDays.length}</div><div class="lbl">Days Tracked</div></div>
</div>

<h2>Per-Version Breakdown</h2>
<table>
  <thead><tr><th>Version</th><th>Released</th><th>Installs</th><th>Active (.CHS)</th><th>Font (.xxx)</th></tr></thead>
  <tbody>${versionRows || '<tr><td colspan="5" style="color:#444">No data yet</td></tr>'}</tbody>
</table>

<h2>Daily Installer Snapshots</h2>
<table>
  <thead><tr><th>Date</th><th>Installer (cumulative)</th><th>+Daily</th><th>Trend</th></tr></thead>
  <tbody>${dlRows}</tbody>
</table>

<hr class="divider">

<h2>Landing Page (Web Analytics)</h2>
<div class="cards">
  <div class="card"><div class="num">${totalVisits.toLocaleString()}</div><div class="lbl">Visits (${days}d)</div></div>
  <div class="card"><div class="num">${totalPageViews.toLocaleString()}</div><div class="lbl">Page Views (${days}d)</div></div>
  <div class="card"><div class="num">${todayVisits.toLocaleString()}</div><div class="lbl">Visits Today</div></div>
</div>
<table>
  <thead><tr><th>Date</th><th>Visits</th><th>Page Views</th><th>Trend</th></tr></thead>
  <tbody>${waRows}</tbody>
</table>
<p class="sub" style="margin-top:16px">For country / device / browser / OS breakdown, open Cloudflare dashboard &rarr; Analytics &amp; Logs &rarr; Web Analytics.</p>
</body>
</html>`;
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

    // Authenticated endpoints
    const key = url.searchParams.get('key');
    if (key !== env.STATS_KEY) {
      return new Response('Unauthorized', { status: 401 });
    }

    if (url.pathname === '/snapshot') {
      const snap = await takeSnapshot(env);
      return new Response(JSON.stringify(snap, null, 2), {
        headers: { 'Content-Type': 'application/json' },
      });
    }


    if (url.pathname === '/stats') {
      const days = Math.min(parseInt(url.searchParams.get('days') || '30', 10) || 30, 365);
      const [dlDays, wa] = await Promise.all([
        loadDays(env),
        fetchWebAnalytics(env.CF_ANALYTICS_TOKEN, days).catch((err) => {
          console.error('Web Analytics fetch failed:', err.message);
          return { daily: [], referrers: [], countries: [], devices: [], browsers: [], os: [] };
        }),
      ]);

      if (url.searchParams.get('fmt') === 'json') {
        return new Response(JSON.stringify({ downloads: dlDays, webAnalytics: wa }, null, 2), {
          headers: { 'Content-Type': 'application/json' },
        });
      }
      // wa.daily comes in shape: [{ sum: {visits}, count, dimensions: {date} }, ...]
      return new Response(renderHtml(dlDays, wa, days, key), {
        headers: { 'Content-Type': 'text/html;charset=utf-8' },
      });
    }

    return new Response('Not Found', { status: 404 });
  },
};
