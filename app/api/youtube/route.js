import { NextResponse } from 'next/server';
import { getClientIp, rateLimit } from '@/lib/rate-limit';
import { CHANNEL_ID_RE, YoutubeError, clampLimit, getChannelVideos } from '@/lib/youtube-server';

export const dynamic = 'force-dynamic';

const baseHeaders = { 'X-Content-Type-Options': 'nosniff' };

// Error tidak boleh di-cache CDN (versi lama ikut meng-cache 429/502 selama 5 menit).
function fail(message, status, extra = {}) {
  return NextResponse.json(
    { error: message },
    { status, headers: { ...baseHeaders, 'Cache-Control': 'no-store', ...extra } }
  );
}

// Dipakai tombol "muat ulang" di browser. Render awal halaman sudah memakai data dari server
// (lib/youtube-server.js), jadi endpoint ini hanya dipanggil saat pengunjung menekan tombol itu.
export async function GET(request) {
  const ip = getClientIp(request);
  const { searchParams } = new URL(request.url);
  const channelId = searchParams.get('channelId') || '';
  const wantsFresh = searchParams.has('refresh');

  // Batas umum: 30 permintaan/menit per IP. Muat ulang paksa (melewati cache) lebih ketat: 5/menit.
  const general = await rateLimit(`yt:${ip}`, { limit: 30, windowSec: 60 });
  if (!general.ok) return fail('Terlalu banyak permintaan. Coba lagi nanti.', 429, { 'Retry-After': String(general.retryAfter) });
  if (wantsFresh) {
    const strict = await rateLimit(`ytfresh:${ip}`, { limit: 5, windowSec: 60 });
    if (!strict.ok) return fail('Terlalu sering memuat ulang. Coba lagi sebentar.', 429, { 'Retry-After': String(strict.retryAfter) });
  }

  if (!CHANNEL_ID_RE.test(channelId)) return fail('channelId tidak valid.', 400);

  try {
    const videos = await getChannelVideos(channelId, clampLimit(searchParams.get('limit')), { fresh: wantsFresh });
    return NextResponse.json(
      { videos },
      {
        headers: {
          ...baseHeaders,
          // Permintaan "refresh" jangan disimpan CDN; yang biasa boleh 5 menit.
          'Cache-Control': wantsFresh ? 'no-store' : 's-maxage=300, stale-while-revalidate=600'
        }
      }
    );
  } catch (error) {
    if (error instanceof YoutubeError) return fail(error.message, error.status);
    console.error('YouTube proxy error:', error);
    return fail('Terjadi kesalahan saat mengambil data YouTube.', 502);
  }
}
