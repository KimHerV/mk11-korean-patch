/**
 * MK11 Korean Patch: download stats Worker
 *
 * Cron (daily 02:00 UTC): snapshot GitHub release download counts to KV
 * GET /stats?key=SECRET        : HTML dashboard
 * GET /stats?key=SECRET&fmt=json: raw JSON
 * GET /snapshot?key=SECRET     : manual trigger snapshot (for initial seed)
 */

const GITHUB_REPO = 'KimHerV/mk11-korean-patch';
const GITHUB_API  = 'https://api.github.com';

async function fetchGitHubCounts() {
  const res = await fetch(`${GITHUB_API}/repos/${GITHUB_REPO}/releases`, {
    headers: { 'User-Agent': 'mk11-stats-worker/1.0', Accept: 'application/vnd.github+json' },
  });
  if (!res.ok) throw new Error(`GitHub API ${res.status}`);
  const releases = await res.json();

  let installer = 0, coalesced = 0, font = 0;
  for (const r of releases) {
    for (const a of r.assets || []) {
      if (a.name.endsWith('.exe'))  installer  += a.download_count;
      if (a.name === 'Coalesced.CHS') coalesced += a.download_count;
      if (a.name.endsWith('.xxx'))  font       += a.download_count;
    }
  }
  return { installer, coalesced, font, total: installer + coalesced + font };
}

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

function renderHtml(days) {
  const withDelta = days.map((d, i) => ({
    ...d,
    delta: i === 0 ? d.installer : d.installer - days[i - 1].installer,
  }));

  const latest  = days[days.length - 1] || {};
  const maxDelta = Math.max(...withDelta.map(d => d.delta || 0), 1);

  const rows = [...withDelta].reverse().map(d => {
    const bar = Math.round(((d.delta || 0) / maxDelta) * 100);
    return `<tr>
      <td>${d.date}</td>
      <td class="g">${(d.installer || 0).toLocaleString()}</td>
      <td>+${(d.delta || 0).toLocaleString()}</td>
      <td>${(d.coalesced || 0).toLocaleString()}</td>
      <td>${(d.font || 0).toLocaleString()}</td>
      <td><span class="bar" style="width:${bar}px"></span></td>
    </tr>`;
  }).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>MK11 Korean Patch - Stats</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: system-ui, sans-serif; background: #0a0a0a; color: #f0ece0; padding: 32px 24px; }
  h1 { color: #c9a84c; font-size: 1.3rem; margin-bottom: 4px; }
  .sub { color: #666; font-size: 0.8rem; margin-bottom: 32px; }
  .cards { display: flex; flex-wrap: wrap; gap: 16px; margin-bottom: 32px; }
  .card { background: #111; border: 1px solid #2a2a2a; border-radius: 8px; padding: 16px 24px; min-width: 140px; }
  .card .num { font-size: 1.8rem; font-weight: 700; color: #c9a84c; }
  .card .lbl { font-size: 0.75rem; color: #888; margin-top: 4px; }
  table { width: 100%; border-collapse: collapse; font-size: 0.83rem; }
  th { text-align: left; padding: 8px 10px; color: #666; border-bottom: 1px solid #1e1e1e; }
  td { padding: 7px 10px; border-bottom: 1px solid #161616; }
  .g { color: #c9a84c; }
  .bar { display: inline-block; height: 8px; background: #7a6030; border-radius: 2px; vertical-align: middle; }
</style>
</head>
<body>
<h1>MK11 Korean Patch: Download Stats</h1>
<p class="sub">Snapshots taken daily at 02:00 UTC. Installer downloads shown.</p>
<div class="cards">
  <div class="card"><div class="num">${(latest.installer || 0).toLocaleString()}</div><div class="lbl">Total Installer Downloads</div></div>
  <div class="card"><div class="num">${(latest.coalesced || 0).toLocaleString()}</div><div class="lbl">Coalesced.CHS Downloads</div></div>
  <div class="card"><div class="num">${(latest.font || 0).toLocaleString()}</div><div class="lbl">Font Asset Downloads</div></div>
  <div class="card"><div class="num">${days.length}</div><div class="lbl">Days Tracked</div></div>
</div>
<table>
  <thead><tr><th>Date</th><th>Installer</th><th>+Daily</th><th>Coalesced</th><th>Font</th><th>Trend</th></tr></thead>
  <tbody>${rows}</tbody>
</table>
</body>
</html>`;
}

export default {
  async scheduled(_event, env) {
    await takeSnapshot(env);
  },

  async fetch(request, env) {
    const url  = new URL(request.url);
    const key  = url.searchParams.get('key');

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
      const days = await loadDays(env);
      if (url.searchParams.get('fmt') === 'json') {
        return new Response(JSON.stringify(days, null, 2), {
          headers: { 'Content-Type': 'application/json' },
        });
      }
      return new Response(renderHtml(days), {
        headers: { 'Content-Type': 'text/html;charset=utf-8' },
      });
    }

    return new Response('Not Found', { status: 404 });
  },
};
