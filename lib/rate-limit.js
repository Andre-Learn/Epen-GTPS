// Rate limit sederhana (fixed window).
//
// Di Vercel setiap Function instance punya memori sendiri, jadi penghitung di memori saja tidak
// efektif (penyerang cukup kena instance yang berbeda). Karena itu:
//  - Kalau Upstash Redis tersedia (UPSTASH_REDIS_REST_URL / KV_REST_API_URL + token), hitungan
//    disimpan di sana dan berlaku untuk semua instance.
//  - Kalau tidak, dipakai penghitung di memori sebagai cadangan (tetap ada, hanya kurang kuat).
// Tanpa library tambahan: Upstash dipanggil lewat REST API-nya.

const REDIS_URL = (process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL || '').replace(/\/+$/, '');
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN || '';
const PREFIX = 'epen:rl:';
const MAX_MEMORY_KEYS = 5000;
const REDIS_TIMEOUT_MS = 1500;

const memory = new Map(); // key -> { count, resetAt }

export const hasSharedStore = () => Boolean(REDIS_URL && REDIS_TOKEN);

export function getClientIp(request) {
  const real = request.headers.get('x-real-ip');
  if (real) return real.trim();
  const forwarded = request.headers.get('x-forwarded-for') || '';
  return forwarded.split(',')[0].trim() || 'unknown';
}

function hitMemory(key, windowSec) {
  const now = Date.now();
  let entry = memory.get(key);
  if (!entry || entry.resetAt <= now) {
    if (!entry && memory.size >= MAX_MEMORY_KEYS) {
      // Buang entri yang sudah kedaluwarsa dulu; kalau masih penuh, buang yang paling lama.
      for (const [k, v] of memory) if (v.resetAt <= now) memory.delete(k);
      if (memory.size >= MAX_MEMORY_KEYS) memory.delete(memory.keys().next().value);
    }
    entry = { count: 0, resetAt: now + windowSec * 1000 };
    memory.set(key, entry);
  }
  entry.count += 1;
  return { count: entry.count, ttl: Math.max(1, Math.ceil((entry.resetAt - now) / 1000)) };
}

async function redis(commands) {
  const response = await fetch(`${REDIS_URL}/pipeline`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${REDIS_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(commands),
    cache: 'no-store',
    signal: AbortSignal.timeout(REDIS_TIMEOUT_MS)
  });
  if (!response.ok) throw new Error(`Redis ${response.status}`);
  const results = await response.json();
  if (!Array.isArray(results) || results.some(item => item?.error)) throw new Error('Redis error');
  return results.map(item => item.result);
}

async function hitRedis(key, windowSec) {
  const redisKey = PREFIX + key;
  const [count, ttl] = await redis([['INCR', redisKey], ['TTL', redisKey]]);
  let remaining = Number(ttl);
  // TTL < 0 = key baru atau EXPIRE sebelumnya gagal → pasang sekarang supaya tidak terkunci selamanya.
  if (!(remaining > 0)) {
    await redis([['EXPIRE', redisKey, String(windowSec)]]);
    remaining = windowSec;
  }
  return { count: Number(count), ttl: remaining };
}

/**
 * Catat satu permintaan untuk `key`.
 * @returns {Promise<{ ok: boolean, count: number, remaining: number, retryAfter: number }>}
 */
export async function rateLimit(key, { limit, windowSec }) {
  let result;
  if (hasSharedStore()) {
    try {
      result = await hitRedis(key, windowSec);
    } catch (error) {
      console.warn('Rate limit store unavailable, memakai memori:', error?.message || error);
    }
  }
  if (!result) result = hitMemory(key, windowSec);

  return {
    ok: result.count <= limit,
    count: result.count,
    remaining: Math.max(0, limit - result.count),
    retryAfter: result.ttl
  };
}

// Hapus hitungan (mis. setelah login berhasil).
export async function resetRateLimit(key) {
  memory.delete(key);
  if (!hasSharedStore()) return;
  try {
    await redis([['DEL', PREFIX + key]]);
  } catch {
    // abaikan; hitungan akan kedaluwarsa sendiri
  }
}
