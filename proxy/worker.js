/*
 * Kleiner Proxy für den TermQuest-Tutor (Cloudflare Worker).
 * Der Anthropic-API-Key liegt NUR hier als Secret (ANTHROPIC_API_KEY) – nie im Repository.
 *
 * Er reicht ausschließlich Chat-Anfragen der App weiter und begrenzt sie:
 * nur ein erlaubtes Modell, kurze Antworten, keine Tools, nur von der eigenen Website.
 */
const ALLOWED_MODELS = ['claude-opus-5-5'];
const ALLOWED_BETAS = ['server-side-fallback-2026-07-01'];
const MAX_TOKENS = 4000;
const MAX_MESSAGES = 12;

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const allowed = (env.ALLOWED_ORIGIN || 'https://aipsg.github.io').split(',').map((s) => s.trim());
    const cors = {
      'Access-Control-Allow-Origin': allowed.includes(origin) ? origin : allowed[0],
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': '*',
      Vary: 'Origin',
    };
    if (request.method === 'OPTIONS') return new Response(null, { headers: cors });

    const url = new URL(request.url);
    if (request.method !== 'POST' || url.pathname !== '/v1/messages') return new Response('Not found', { status: 404, headers: cors });
    if (!allowed.includes(origin)) return new Response('Forbidden', { status: 403, headers: cors });

    let body;
    try { body = await request.json(); } catch (e) { return new Response('Bad request', { status: 400, headers: cors }); }
    if (!ALLOWED_MODELS.includes(body.model)) return new Response('Model not allowed', { status: 400, headers: cors });
    if (!Array.isArray(body.messages) || body.messages.length > MAX_MESSAGES) return new Response('Too many messages', { status: 400, headers: cors });
    body.max_tokens = Math.min(Number(body.max_tokens) || MAX_TOKENS, MAX_TOKENS);
    delete body.tools;
    delete body.mcp_servers;

    const betas = (request.headers.get('anthropic-beta') || '').split(',').map((s) => s.trim()).filter((b) => ALLOWED_BETAS.includes(b));
    const headers = {
      'content-type': 'application/json',
      'x-api-key': env.ANTHROPIC_API_KEY,
      'anthropic-version': request.headers.get('anthropic-version') || '2023-06-01',
    };
    if (betas.length) headers['anthropic-beta'] = betas.join(',');

    const upstream = await fetch('https://api.anthropic.com/v1/messages', { method: 'POST', headers, body: JSON.stringify(body) });
    const out = new Headers(upstream.headers);
    Object.entries(cors).forEach(([k, v]) => out.set(k, v));
    return new Response(upstream.body, { status: upstream.status, headers: out });
  },
};
