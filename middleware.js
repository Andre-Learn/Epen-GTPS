import { NextResponse } from 'next/server';
import { getClientIp, rateLimit } from '@/lib/rate-limit';

// Gerbang admin.
//
// Halaman admin dan /api/admin hanya "ada" untuk browser yang membawa cookie gerbang. Siapa pun
// yang tidak punya cookie itu mendapat 404 biasa, sama persis seperti halaman yang memang tidak ada.
//
// Cara masuk: buka  /<ADMIN_PATH>?key=<ADMIN_GATE_KEY>  sekali. Kalau kodenya benar, cookie
// httpOnly dipasang (7 hari) lalu kamu diarahkan ke /<ADMIN_PATH> tanpa kode di URL.
//
// Env (Vercel):
//   ADMIN_GATE_KEY  kode rahasia, minimal 16 karakter. Tanpa ini admin TERTUTUP total (fail closed).
//   ADMIN_PATH      alamat admin, mis. "panel-7k2xq9". Kosong = "admin".
// Mengganti salah satunya langsung mencabut semua cookie gerbang yang sudah dibagikan.

const COOKIE = 'epen_gate';
const COOKIE_TTL_SEC = 7 * 24 * 60 * 60;
const KEY_GUESS_LIMIT = 10;
const KEY_GUESS_WINDOW_SEC = 15 * 60;
const MIN_KEY_LENGTH = 16;

// Awalan yang dikecualikan dari matcher di bawah; nama admin tidak boleh diawali salah satunya.
const RESERVED_PREFIXES = ['partners', 'servers', 'promote', 'api', '_next', 'assets', 'favicon', 'robots', 'sitemap'];
const SLUG_RE = /^[A-Za-z0-9][A-Za-z0-9_-]{4,40}$/;

const encoder = new TextEncoder();

function readGateConfig() {
  const key = process.env.ADMIN_GATE_KEY || '';
  const slug = (process.env.ADMIN_PATH || 'admin').trim().replace(/^\/+|\/+$/g, '');
  if (key.length < MIN_KEY_LENGTH) return null;
  if (!SLUG_RE.test(slug)) return null;
  if (RESERVED_PREFIXES.some(prefix => slug.toLowerCase().startsWith(prefix))) return null;
  return { key, slug };
}

const toBase64Url = bytes =>
  btoa(String.fromCharCode(...bytes)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

function bytesEqual(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

async function sign(secret, message) {
  const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return new Uint8Array(await crypto.subtle.sign('HMAC', key, encoder.encode(message)));
}

// Bandingkan lewat hash supaya panjang kode tidak bocor lewat waktu respons.
async function sha256(value) {
  return new Uint8Array(await crypto.subtle.digest('SHA-256', encoder.encode(String(value))));
}

async function keyMatches(provided, expected) {
  return bytesEqual(await sha256(provided), await sha256(expected));
}

async function makeGateCookie(key) {
  const exp = String(Math.floor(Date.now() / 1000) + COOKIE_TTL_SEC);
  return `${exp}.${toBase64Url(await sign(key, `gate:${exp}`))}`;
}

async function validGateCookie(value, key) {
  if (!value) return false;
  const [exp, signature] = String(value).split('.');
  if (!exp || !signature || !(Number(exp) > Math.floor(Date.now() / 1000))) return false;
  const expected = toBase64Url(await sign(key, `gate:${exp}`));
  return bytesEqual(encoder.encode(signature), encoder.encode(expected));
}

function protect(response) {
  response.headers.set('Cache-Control', 'no-store');
  response.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
  return response;
}

// Dialihkan ke alamat yang tidak ada → Next.js menampilkan 404 yang sama dengan halaman lain yang tidak ada.
function notFound(request) {
  return protect(NextResponse.rewrite(new URL('/_gate-not-found', request.url)));
}

export async function middleware(request) {
  const path = request.nextUrl.pathname.replace(/\/+$/, '') || '/';
  const config = readGateConfig();

  const isApi = path === '/api/admin';
  const isDirect = path === '/admin' || path.startsWith('/admin/');
  const isGate = Boolean(config) && path === `/${config.slug}`;

  if (!isApi && !isDirect && !isGate) return NextResponse.next();

  // Admin belum dikonfigurasi dengan benar → tutup semuanya.
  if (!config) return notFound(request);
  // Alamat /admin asli tidak boleh bisa dibuka kalau admin sudah dipindah ke nama lain.
  if (isDirect && !isGate) return notFound(request);

  if (await validGateCookie(request.cookies.get(COOKIE)?.value, config.key)) {
    if (isApi) return protect(NextResponse.next());
    // Alamat rahasia menampilkan halaman /admin di balik layar (URL di browser tidak berubah).
    return protect(config.slug === 'admin' ? NextResponse.next() : NextResponse.rewrite(new URL('/admin', request.url)));
  }

  // Belum punya cookie: satu-satunya jalan masuk adalah /<ADMIN_PATH>?key=KODE.
  if (isGate && request.nextUrl.searchParams.has('key')) {
    // Batasi tebakan kode. Kode benar pun ditolak selama diblokir, dan jawabannya tetap 404 biasa.
    const attempt = await rateLimit(`gate:${getClientIp(request)}`, { limit: KEY_GUESS_LIMIT, windowSec: KEY_GUESS_WINDOW_SEC });
    if (attempt.ok && (await keyMatches(request.nextUrl.searchParams.get('key'), config.key))) {
      const response = NextResponse.redirect(new URL(`/${config.slug}`, request.url));
      response.cookies.set({
        name: COOKIE,
        value: await makeGateCookie(config.key),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: COOKIE_TTL_SEC
      });
      return protect(response);
    }
  }

  return notFound(request);
}

// Hanya jalan untuk path yang mungkin admin; halaman publik dan aset dikecualikan supaya tidak
// ada tambahan latensi. (/api/admin disebut sendiri karena awalan "api" dikecualikan di pola kedua.)
export const config = {
  matcher: [
    '/api/admin',
    '/((?!partners|servers|promote|api|_next|assets|favicon|robots|sitemap|site\\.webmanifest).+)'
  ]
};
