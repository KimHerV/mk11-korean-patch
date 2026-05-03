/**
 * MK11 Korean Patch: unified stats Worker
 *
 * Cron (daily 02:00 UTC): snapshot GitHub release download counts to KV
 * GET /stats?key=SECRET        : unified HTML dashboard
 * GET /stats?key=SECRET&fmt=json: raw JSON
 * GET /snapshot?key=SECRET     : manual snapshot trigger
 */

const GITHUB_REPO = 'KimHerV/mk11-korean-patch';
const GITHUB_API  = 'https://api.github.com';
const CF_GQL      = 'https://api.cloudflare.com/client/v4/graphql';
const ACCOUNT_ID  = '987455b8ac0de3b40c578b52c12feb98';
const SITE_TAG    = 'a09a14b2b63a4624a68b36b876727ebf';

// ── GitHub download counts ────────────────────────────────────

async function fetchGitHubCounts() {
  const res = await fetch(`${GITHUB_API}/repos/${GITHUB_REPO}/releases`, {
    headers: { 'User-Agent': 'mk11-stats-worker/1.0', Accept: 'application/vnd.github+json' },
  });
  if (!res.ok) throw new Error(`GitHub API ${res.status}`);
  const releases = await res.json();
  let installer = 0, coalesced = 0, font = 0;
  for (const r of releases) {
    for (const a of r.assets || []) {
      if (a.name.endsWith('.exe'))       installer  += a.download_count;
      if (a.name === 'Coalesced.CHS')    coalesced  += a.download_count;
      if (a.name.endsWith('.xxx'))       font       += a.download_count;
    }
  }
  return { installer, coalesced, font, total: installer + coalesced + font };
}

// ── Cloudflare Web Analytics (GraphQL) ───────────────────────

async function fetchWebAnalytics(token, days = 30) {
  const since = new Date(Date.now() - days * 86400000).toISOString().slice(0, 10);
  const today = new Date().toISOString().slice(0, 10);

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
          sum { visits pageViews }
          dimensions { date }
        }
        referrers: rumPageloadEventsAdaptiveGroups(
          filter: { AND: [
            { date_geq: "${since}" }
            { siteTag: "${SITE_TAG}" }
          ]}
          limit: 8
          orderBy: [sum_visits_DESC]
        ) {
          sum { visits }
          dimensions { refererHost }
        }
        countries: rumPageloadEventsAdaptiveGroups(
          filter: { AND: [
            { date_geq: "${since}" }
            { siteTag: "${SITE_TAG}" }
          ]}
          limit: 8
          orderBy: [sum_visits_DESC]
        ) {
          sum { visits }
          dimensions { clientCountryName }
        }
        devices: rumPageloadEventsAdaptiveGroups(
          filter: { AND: [
            { date_geq: "${since}" }
            { siteTag: "${SITE_TAG}" }
          ]}
          limit: 5
          orderBy: [sum_visits_DESC]
        ) {
          sum { visits }
          dimensions { deviceType }
        }
        browsers: rumPageloadEventsAdaptiveGroups(
          filter: { AND: [
            { date_geq: "${since}" }
            { siteTag: "${SITE_TAG}" }
          ]}
          limit: 8
          orderBy: [sum_visits_DESC]
        ) {
          sum { visits }
          dimensions { browserFamily }
        }
        os: rumPageloadEventsAdaptiveGroups(
          filter: { AND: [
            { date_geq: "${since}" }
            { siteTag: "${SITE_TAG}" }
          ]}
          limit: 8
          orderBy: [sum_visits_DESC]
        ) {
          sum { visits }
          dimensions { osFamily }
        }
      }
    }
  }`;

  const res = await fetch(CF_GQL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  });
  if (!res.ok) throw new Error(`CF GraphQL ${res.status}`);
  const json = await res.json();
  const acct = json?.data?.viewer?.accounts?.[0];
  return {
    daily:     acct?.daily     || [],
    referrers: acct?.referrers || [],
    countries: acct?.countries || [],
    devices:   acct?.devices   || [],
    browsers:  acct?.browsers  || [],
    os:        acct?.os        || [],
  };
}

// ── KV helpers ───────────────────────────────────────────────

async function takeSnapshot(env) {
  const counts = await fetchGitHubCounts();
  const date   = new Date().toISOString().slice(0, 10);
  const snap   = { ...counts, recorded_at: new Date().toISOString() };
  await env.MK11_STATS.put(`day:${date}`, JSON.stringify(snap));
  await env.MK11_STATS.put('latest', JSON.stringify(snap));
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

// ── HTML renderer ────────────────────────────────────────────

function renderHtml(dlDays, wa) {
  const latest   = dlDays[dlDays.length - 1] || {};
  const withDelta = dlDays.map((d, i) => ({
    ...d,
    delta: i === 0 ? d.installer : d.installer - dlDays[i - 1].installer,
  }));
  const maxDlDelta = Math.max(...withDelta.map(d => d.delta || 0), 1);

  const totalVisits    = wa.daily.reduce((s, d) => s + (d.sum?.visits || 0), 0);
  const totalPageViews = wa.daily.reduce((s, d) => s + (d.sum?.pageViews || 0), 0);
  const todayWa        = wa.daily[wa.daily.length - 1];
  const todayVisits    = todayWa?.sum?.visits || 0;
  const maxWaVisits    = Math.max(...wa.daily.map(d => d.sum?.visits || 0), 1);

  const dlRows = [...withDelta].reverse().map(d => {
    const bar = Math.round(((d.delta || 0) / maxDlDelta) * 80);
    return `<tr>
      <td>${d.date}</td>
      <td class="g">${(d.installer||0).toLocaleString()}</td>
      <td>+${(d.delta||0).toLocaleString()}</td>
      <td>${(d.coalesced||0).toLocaleString()}</td>
      <td>${(d.font||0).toLocaleString()}</td>
      <td><span class="bar" style="width:${bar}px"></span></td>
    </tr>`;
  }).join('');

  const waRows = [...wa.daily].reverse().map(d => {
    const v   = d.sum?.visits || 0;
    const pv  = d.sum?.pageViews || 0;
    const bar = Math.round((v / maxWaVisits) * 80);
    return `<tr>
      <td>${d.dimensions?.date || ''}</td>
      <td class="g">${v.toLocaleString()}</td>
      <td>${pv.toLocaleString()}</td>
      <td><span class="bar" style="width:${bar}px"></span></td>
    </tr>`;
  }).join('');

  const refRows = wa.referrers
    .filter(r => r.dimensions?.refererHost)
    .map(r => `<tr><td>${r.dimensions.refererHost}</td><td class="g">${(r.sum?.visits||0).toLocaleString()}</td></tr>`)
    .join('');

  const ctryRows = wa.countries
    .filter(c => c.dimensions?.clientCountryName)
    .map(c => `<tr><td>${c.dimensions.clientCountryName}</td><td class="g">${(c.sum?.visits||0).toLocaleString()}</td></tr>`)
    .join('');

  const deviceRows = wa.devices
    .filter(d => d.dimensions?.deviceType)
    .map(d => `<tr><td>${d.dimensions.deviceType}</td><td class="g">${(d.sum?.visits||0).toLocaleString()}</td></tr>`)
    .join('');

  const browserRows = wa.browsers
    .filter(b => b.dimensions?.browserFamily)
    .map(b => `<tr><td>${b.dimensions.browserFamily}</td><td class="g">${(b.sum?.visits||0).toLocaleString()}</td></tr>`)
    .join('');

  const osRows = wa.os
    .filter(o => o.dimensions?.osFamily)
    .map(o => `<tr><td>${o.dimensions.osFamily}</td><td class="g">${(o.sum?.visits||0).toLocaleString()}</td></tr>`)
    .join('');

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
  .divider { border: none; border-top: 1px solid #1e1e1e; margin: 28px 0; }
  @media (max-width: 600px) { .two-col { grid-template-columns: 1fr; } }
</style>
</head>
<body>
<h1>MK11 Korean Patch: Stats</h1>
<p class="sub">Download snapshots: daily 02:00 UTC. Web Analytics: last 30 days.</p>

<h2>Downloads</h2>
<div class="cards">
  <div class="card"><div class="num">${(latest.installer||0).toLocaleString()}</div><div class="lbl">Installer (.exe)</div></div>
  <div class="card"><div class="num">${(latest.coalesced||0).toLocaleString()}</div><div class="lbl">Coalesced.CHS</div></div>
  <div class="card"><div class="num">${(latest.font||0).toLocaleString()}</div><div class="lbl">Font Asset</div></div>
  <div class="card"><div class="num">${dlDays.length}</div><div class="lbl">Days Tracked</div></div>
</div>
<table>
  <thead><tr><th>Date</th><th>Installer</th><th>+Daily</th><th>Coalesced</th><th>Font</th><th>Trend</th></tr></thead>
  <tbody>${dlRows}</tbody>
</table>

<hr class="divider">

<h2>Landing Page (Web Analytics)</h2>
<div class="cards">
  <div class="card"><div class="num">${totalVisits.toLocaleString()}</div><div class="lbl">Visits (30d)</div></div>
  <div class="card"><div class="num">${totalPageViews.toLocaleString()}</div><div class="lbl">Page Views (30d)</div></div>
  <div class="card"><div class="num">${todayVisits.toLocaleString()}</div><div class="lbl">Visits Today</div></div>
</div>
<table>
  <thead><tr><th>Date</th><th>Visits</th><th>Page Views</th><th>Trend</th></tr></thead>
  <tbody>${waRows}</tbody>
</table>

<div class="two-col">
  <div>
    <h2>Top Referrers</h2>
    <table>
      <thead><tr><th>Source</th><th>Visits</th></tr></thead>
      <tbody>${refRows || '<tr><td colspan="2" style="color:#444">No data yet</td></tr>'}</tbody>
    </table>
  </div>
  <div>
    <h2>Top Countries</h2>
    <table>
      <thead><tr><th>Country</th><th>Visits</th></tr></thead>
      <tbody>${ctryRows || '<tr><td colspan="2" style="color:#444">No data yet</td></tr>'}</tbody>
    </table>
  </div>
</div>
<div class="two-col">
  <div>
    <h2>Device Type</h2>
    <table>
      <thead><tr><th>Device</th><th>Visits</th></tr></thead>
      <tbody>${deviceRows || '<tr><td colspan="2" style="color:#444">No data yet</td></tr>'}</tbody>
    </table>
  </div>
  <div>
    <h2>Browsers</h2>
    <table>
      <thead><tr><th>Browser</th><th>Visits</th></tr></thead>
      <tbody>${browserRows || '<tr><td colspan="2" style="color:#444">No data yet</td></tr>'}</tbody>
    </table>
  </div>
</div>
<div class="two-col">
  <div>
    <h2>Operating Systems</h2>
    <table>
      <thead><tr><th>OS</th><th>Visits</th></tr></thead>
      <tbody>${osRows || '<tr><td colspan="2" style="color:#444">No data yet</td></tr>'}</tbody>
    </table>
  </div>
  <div></div>
</div>
</body>
</html>`;
}

// ── Worker entry ─────────────────────────────────────────────

export default {
  async scheduled(_event, env) {
    await takeSnapshot(env);
  },

  async fetch(request, env) {
    const url = new URL(request.url);
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
      const [dlDays, wa] = await Promise.all([
        loadDays(env),
        fetchWebAnalytics(env.CF_ANALYTICS_TOKEN).catch(() => ({ daily: [], referrers: [], countries: [] })),
      ]);

      if (url.searchParams.get('fmt') === 'json') {
        return new Response(JSON.stringify({ downloads: dlDays, webAnalytics: wa }, null, 2), {
          headers: { 'Content-Type': 'application/json' },
        });
      }
      return new Response(renderHtml(dlDays, wa), {
        headers: { 'Content-Type': 'text/html;charset=utf-8' },
      });
    }

    return new Response('Not Found', { status: 404 });
  },
};
