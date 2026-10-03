import crypto from 'node:crypto';
import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { revalidateTag } from 'next/cache';
import { getClientIp, rateLimit, resetRateLimit } from '@/lib/rate-limit';
import { CONFIG_PATH, CONFIG_TAG, readConfig } from '@/lib/config';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const COOKIE_NAME = 'epen_admin_session';
const SESSION_TTL = 60 * 60 * 8;
// Batas percobaan login: 8 kali per 15 menit per IP. Login berhasil mereset hitungan.
const LOGIN_LIMIT = 8;
const LOGIN_WINDOW_SEC = 15 * 60;
const FAILED_LOGIN_DELAY_MS = 500;

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
// Bandingkan hash (panjang selalu sama) supaya panjang password tidak bocor lewat waktu respons.
const digest = value => crypto.createHash('sha256').update(String(value)).digest();

const secret = () => process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || '';
const sign = value => crypto.createHmac('sha256', secret()).update(value).digest('base64url');

function makeToken() {
  const payload = String(Math.floor(Date.now() / 1000) + SESSION_TTL);
  return `${payload}.${sign(payload)}`;
}

function validToken(request) {
  const raw = request.cookies.get(COOKIE_NAME)?.value;
  if (!raw || !secret()) return false;
  let decoded = raw;
  try { decoded = decodeURIComponent(raw); } catch { /* pakai nilai mentah */ }
  const [exp, sig] = decoded.split('.');
  if (!exp || !sig || Number(exp) < Math.floor(Date.now() / 1000)) return false;
  const a = Buffer.from(sig);
  const b = Buffer.from(sign(exp));
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

function json(body, init = {}) {
  return NextResponse.json(body, {
    ...init,
    headers: {
      'Cache-Control': 'no-store, max-age=0',
      'X-Content-Type-Options': 'nosniff',
      ...(init.headers || {})
    }
  });
}

function setSession(response, value, maxAge) {
  response.cookies.set({
    name: COOKIE_NAME,
    value,
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    path: '/',
    maxAge
  });
  return response;
}

function validConfig(config) {
  if (!config || typeof config !== 'object' || Array.isArray(config)) return false;
  if (JSON.stringify(config).length > 800000) return false;
  if (config.pages && typeof config.pages !== 'object') return false;
  if (config.partners && !Array.isArray(config.partners)) return false;
  if (config.servers && !Array.isArray(config.servers)) return false;
  if (config.promote?.packages && !Array.isArray(config.promote.packages)) return false;
  return true;
}

export async function POST(request) {
  const body = (await request.json().catch(() => ({}))) || {};

  if (body.action === 'login') {
    if (!process.env.ADMIN_PASSWORD || !secret()) {
      return json({ error: 'Admin belum dikonfigurasi. Tambahkan ADMIN_PASSWORD dan ADMIN_SESSION_SECRET di Vercel.' }, { status: 503 });
    }

    const loginKey = `login:${getClientIp(request)}`;
    const attempt = await rateLimit(loginKey, { limit: LOGIN_LIMIT, windowSec: LOGIN_WINDOW_SEC });
    if (!attempt.ok) {
      const minutes = Math.max(1, Math.ceil(attempt.retryAfter / 60));
      return json(
        { error: `Terlalu banyak percobaan login. Coba lagi dalam ${minutes} menit.` },
        { status: 429, headers: { 'Retry-After': String(attempt.retryAfter) } }
      );
    }

    if (!crypto.timingSafeEqual(digest(body.password || ''), digest(process.env.ADMIN_PASSWORD))) {
      await sleep(FAILED_LOGIN_DELAY_MS);
      return json({ error: 'Password admin salah.' }, { status: 401 });
    }

    await resetRateLimit(loginKey);
    return setSession(json({ ok: true }), makeToken(), SESSION_TTL);
  }

  if (body.action === 'logout') {
    return setSession(json({ ok: true }), '', 0);
  }

  if (!validToken(request)) return json({ error: 'Unauthorized' }, { status: 401 });
  return json({ error: 'Method not allowed' }, { status: 405, headers: { Allow: 'GET, PUT, POST' } });
}

export async function GET(request) {
  if (!validToken(request)) return json({ error: 'Unauthorized' }, { status: 401 });
  return json(await readConfig());
}

export async function PUT(request) {
  if (!validToken(request)) return json({ error: 'Unauthorized' }, { status: 401 });

  const body = (await request.json().catch(() => ({}))) || {};
  let config = body.config;
  if (typeof config === 'string') {
    try { config = JSON.parse(config); } catch { return json({ error: 'JSON config tidak valid.' }, { status: 400 }); }
  }
  if (!validConfig(config)) {
    return json({ error: 'Format config tidak valid atau terlalu besar.' }, { status: 400 });
  }

  const blob = await put(CONFIG_PATH, JSON.stringify(config, null, 2), {
    access: 'private',
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: 'application/json'
  });

  // Buang cache config → halaman publik dibuat ulang dengan data baru pada kunjungan berikutnya.
  revalidateTag(CONFIG_TAG);
  return json({ ok: true, url: blob.url });
}
