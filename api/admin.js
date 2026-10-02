const crypto = require('crypto');
const { get, put } = require('@vercel/blob');
const defaultConfig = require('../data/default-config.json');

const CONFIG_PATH = 'epen/site-config.json';
const COOKIE_NAME = 'epen_admin_session';
const SESSION_TTL = 60 * 60 * 8;

function secret() {
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || '';
}

function sign(value) {
  return crypto.createHmac('sha256', secret()).update(value).digest('base64url');
}

function makeToken() {
  const exp = Math.floor(Date.now() / 1000) + SESSION_TTL;
  const payload = String(exp);
  return `${payload}.${sign(payload)}`;
}

function validToken(req) {
  const raw = req.headers.cookie || '';
  const match = raw.match(new RegExp(`${COOKIE_NAME}=([^;]+)`));
  if (!match || !secret()) return false;
  const [exp, sig] = decodeURIComponent(match[1]).split('.');
  if (!exp || !sig || Number(exp) < Math.floor(Date.now() / 1000)) return false;
  const expected = sign(exp);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

function cookie(value, maxAge) {
  return `${COOKIE_NAME}=${encodeURIComponent(value)}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${maxAge}`;
}

async function readConfig() {
  try {
    const result = await get(CONFIG_PATH, { access: 'private' });
    if (result && result.statusCode === 200) {
      const text = await new Response(result.stream).text();
      const parsed = JSON.parse(text);
      if (parsed && typeof parsed === 'object') return parsed;
    }
  } catch (_) {}
  return defaultConfig;
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

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  res.setHeader('X-Content-Type-Options', 'nosniff');

  if (req.method === 'POST') {
    const body = req.body || {};

    if (body.action === 'login') {
      const password = String(body.password || '');
      if (!process.env.ADMIN_PASSWORD || !secret()) {
        return res.status(503).json({ error: 'Admin belum dikonfigurasi. Tambahkan ADMIN_PASSWORD dan ADMIN_SESSION_SECRET di Vercel.' });
      }
      const a = Buffer.from(password);
      const b = Buffer.from(String(process.env.ADMIN_PASSWORD));
      if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
        return res.status(401).json({ error: 'Password admin salah.' });
      }
      res.setHeader('Set-Cookie', cookie(makeToken(), SESSION_TTL));
      return res.status(200).json({ ok: true });
    }

    if (body.action === 'logout') {
      res.setHeader('Set-Cookie', cookie('', 0));
      return res.status(200).json({ ok: true });
    }
  }

  if (!validToken(req)) return res.status(401).json({ error: 'Unauthorized' });

  if (req.method === 'GET') {
    return res.status(200).json(await readConfig());
  }

  if (req.method === 'PUT') {
    let config = req.body?.config;
    if (typeof config === 'string') {
      try { config = JSON.parse(config); } catch (_) { return res.status(400).json({ error: 'JSON config tidak valid.' }); }
    }
    if (!validConfig(config)) return res.status(400).json({ error: 'Format config tidak valid atau terlalu besar.' });

    const blob = await put(CONFIG_PATH, JSON.stringify(config, null, 2), {
      access: 'private',
      addRandomSuffix: false,
      contentType: 'application/json'
    });

    return res.status(200).json({ ok: true, url: blob.url });
  }

  res.setHeader('Allow', 'GET, PUT, POST');
  return res.status(405).json({ error: 'Method not allowed' });
};
