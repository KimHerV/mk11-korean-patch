/**
 * MK11 Korean Patch: feedback collection Cloudflare Worker
 *
 * Environment variables (Cloudflare Dashboard > Worker > Settings > Variables):
 *   GITHUB_TOKEN  : KimHerV Personal Access Token (repo scope)
 *
 * After deployment, update FEEDBACK_ENDPOINT in script.js to
 * https://mk11-feedback.[your-subdomain].workers.dev
 */

const GITHUB_REPO  = 'KimHerV/mk11-feedback';
const GITHUB_API   = 'https://api.github.com';
const ALLOWED_ORIGINS = [
  'https://mk11-korean-patch.pages.dev', // replace with actual Cloudflare Pages URL after deployment
  'http://localhost:5500',               // VS Code Live Server
  'http://127.0.0.1:5500',
  'http://localhost:3000',
];

const CATEGORY_MAP = {
  story:    'area:story',
  ingame:   'area:ingame',
  movelist: 'area:movelist',
  tutorial: 'area:tutorial',
  items:    'area:items',
  ui:       'area:ui',
  dlc:      'area:dlc',
  krypt:    'area:krypt',
  other:    'area:other',
};

const CATEGORY_KR = {
  story:    '스토리 모드',
  ingame:   '인트로 대사',
  movelist: '무브리스트 (기술명)',
  tutorial: '튜토리얼',
  items:    '아이템 · 커스터마이즈',
  ui:       'UI · 메뉴',
  dlc:      'DLC 콘텐츠',
  krypt:    '크립트',
  other:    '기타',
};

function cors(origin) {
  const allowed = ALLOWED_ORIGINS.includes(origin) ? origin : '';
  return {
    'Access-Control-Allow-Origin':  allowed,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') ?? '';

    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors(origin) });
    }

    if (request.method !== 'POST') {
      return new Response('Method Not Allowed', { status: 405 });
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return new Response('Bad Request', { status: 400, headers: cors(origin) });
    }

    const { category, subcategory, character_a, character_b, original, suggestion, nickname } = body;

    if (!category || !suggestion?.trim()) {
      return new Response('Missing required fields', { status: 422, headers: cors(origin) });
    }

    const label      = CATEGORY_MAP[category] ?? 'area:other';
    const catKr      = CATEGORY_KR[category]  ?? '기타';
    const nick       = (nickname?.trim() || '익명');
    const origLine   = original?.trim() ? `**게임 원문:** \`${original.trim()}\`\n\n` : '';
    const subLine    = subcategory?.trim() ? `**세부 항목:** ${subcategory.trim()}\n\n` : '';
    const charLine   = (character_a && character_b)
      ? `**캐릭터:** ${character_a} vs ${character_b}\n\n` : '';

    const issueTitle = `[${catKr}] ${suggestion.trim().slice(0, 60)}${suggestion.length > 60 ? '…' : ''}`;
    const issueBody  =
`${charLine}${subLine}${origLine}**피드백:**\n${suggestion.trim()}

---
*제보자: ${nick} | 파트: ${catKr}*`;

    const ghRes = await fetch(`${GITHUB_API}/repos/${GITHUB_REPO}/issues`, {
      method: 'POST',
      headers: {
        Authorization:  `Bearer ${env.GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
        'User-Agent':   'mk11-feedback-worker/1.0',
        Accept:         'application/vnd.github+json',
      },
      body: JSON.stringify({ title: issueTitle, body: issueBody, labels: [label] }),
    });

    if (!ghRes.ok) {
      const err = await ghRes.text();
      console.error('GitHub API error:', err);
      return new Response('Internal Server Error', { status: 500, headers: cors(origin) });
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 201,
      headers: { 'Content-Type': 'application/json', ...cors(origin) },
    });
  },
};
