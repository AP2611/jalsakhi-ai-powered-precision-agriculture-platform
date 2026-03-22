#!/usr/bin/env node
'use strict';

/**
 * Verifies all models/endpoints under the unified API.
 * Usage: node check-unified-api.js [BASE_URL]
 * BASE_URL defaults to http://localhost:5000
 * Requires INTERNAL_API_KEY in env (or .env) for /model1, /model2, /model3.
 */

require('dotenv').config();

const BASE_URL = (process.argv[2] || process.env.BASE_URL || 'http://localhost:5000').replace(/\/$/, '');
const INTERNAL_API_KEY = process.env.INTERNAL_API_KEY;

const headers = { 'Content-Type': 'application/json' };
const authHeaders = { ...headers, 'x-internal-key': INTERNAL_API_KEY || '' };

async function request(method, path, body = null, useAuth = false) {
  const url = `${BASE_URL}${path}`;
  const opts = {
    method,
    headers: useAuth ? authHeaders : headers,
  };
  if (body && (method === 'POST' || method === 'PUT')) {
    opts.body = typeof body === 'string' ? body : JSON.stringify(body);
  }
  const res = await fetch(url, opts);
  const text = await res.text();
  let json = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch (_) {}
  return { ok: res.ok, status: res.status, json, text };
}

async function main() {
  const results = [];
  const pass = (name, detail) => {
    results.push({ name, ok: true, detail });
    console.log(`✓ ${name}${detail ? ` — ${detail}` : ''}`);
  };
  const fail = (name, detail) => {
    results.push({ name, ok: false, detail });
    console.log(`✗ ${name} — ${detail}`);
  };

  console.log(`\nChecking unified API at ${BASE_URL}\n`);

  // 1. Gateway health
  try {
    const r = await request('GET', '/health');
    if (r.ok && r.json && r.json.status === 'ok') pass('GET /health', 'gateway ok');
    else fail('GET /health', r.status + (r.json?.error ? `: ${r.json.error}` : ''));
  } catch (e) {
    fail('GET /health', e.message || 'request failed');
  }

  // 2. Crop Water (unified proxy)
  try {
    const r = await request('GET', '/crop-water/health');
    if (r.ok) pass('GET /crop-water/health', 'crop-water proxy ok');
    else fail('GET /crop-water/health', r.status + (r.json?.error ? `: ${r.json.error}` : ''));
  } catch (e) {
    fail('GET /crop-water/health', e.message || 'request failed');
  }

  // 3. Soil Moisture (unified proxy)
  try {
    const r = await request('GET', '/soil-moisture/health');
    if (r.ok) pass('GET /soil-moisture/health', 'soil-moisture proxy ok');
    else fail('GET /soil-moisture/health', r.status + (r.json?.error ? `: ${r.json.error}` : ''));
  } catch (e) {
    fail('GET /soil-moisture/health', e.message || 'request failed');
  }

  // 4. Village Water (unified proxy)
  try {
    const r = await request('GET', '/village-water/health');
    if (r.ok) pass('GET /village-water/health', 'village-water proxy ok');
    else fail('GET /village-water/health', r.status + (r.json?.error ? `: ${r.json.error}` : ''));
  } catch (e) {
    fail('GET /village-water/health', e.message || 'request failed');
  }

  // 5. Chatbot (unified proxy)
  try {
    const r = await request('GET', '/chatbot/health');
    if (r.ok && r.json && r.json.status === 'ok') pass('GET /chatbot/health', 'chatbot proxy ok');
    else fail('GET /chatbot/health', r.status + (r.json?.error ? `: ${r.json.error}` : ''));
  } catch (e) {
    fail('GET /chatbot/health', e.message || 'request failed');
  }

  // 6–8. Internal model endpoints (require x-internal-key)
  if (!INTERNAL_API_KEY) {
    fail('POST /model1', 'INTERNAL_API_KEY not set (skipped)');
    fail('POST /model2', 'INTERNAL_API_KEY not set (skipped)');
    fail('POST /model3', 'INTERNAL_API_KEY not set (skipped)');
  } else {
    for (const model of ['model1', 'model2', 'model3']) {
      try {
        const r = await request('POST', `/${model}`, { test: true }, true);
        if (r.ok && r.json && r.json.model === model) pass(`POST /${model}`, 'ok');
        else fail(`POST /${model}`, r.status + (r.json?.error ? `: ${r.json.error}` : ''));
      } catch (e) {
        fail(`POST /${model}`, e.message || 'request failed');
      }
    }
  }

  const passed = results.filter((x) => x.ok).length;
  const total = results.length;
  console.log(`\n${passed}/${total} checks passed.\n`);
  process.exit(passed === total ? 0 : 1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
