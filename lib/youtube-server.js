import { unstable_cache } from 'next/cache';

export const CHANNEL_ID_RE = /^UC[a-zA-Z0-9_-]{22}$/;
const VIDEO_ID_RE = /^[a-zA-Z0-9_-]{11}$/;
const API_BASE = 'https://www.googleapis.com/youtube/v3';
export const YOUTUBE_MAX = 24;
export const YOUTUBE_TAG = 'youtube';
// Hasil dari YouTube disimpan 15 menit: per channel hanya 1 request API, berapa pun jumlah pengunjungnya.
export const YOUTUBE_REVALIDATE = 900;

// Error dengan status HTTP + pesan aman untuk ditampilkan ke pengunjung.
export class YoutubeError extends Error {
  constructor(message, status = 502) {
    super(message);
    this.name = 'YoutubeError';
    this.status = status;
  }
}

export function allowedChannels() {
  return String(process.env.YOUTUBE_ALLOWED_CHANNELS || '')
    .split(',')
    .map(id => id.trim())
    .filter(id => CHANNEL_ID_RE.test(id));
}

export function clampLimit(value, fallback = YOUTUBE_MAX) {
  const parsed = Number.parseInt(String(value ?? ''), 10);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(Math.max(parsed, 1), YOUTUBE_MAX);
}

// Playlist "Uploads" sebuah channel selalu = ID channel dengan awalan UC diganti UU.
// Jadi tidak perlu request channels.list lagi (hemat 1 request per pengambilan).
export const uploadsPlaylistId = channelId => `UU${channelId.slice(2)}`;

function assertConfigured(channelId) {
  const channels = allowedChannels();
  // Fail closed: tanpa allowlist, endpoint tidak boleh memakai kuota API.
  if (!channels.length) throw new YoutubeError('YOUTUBE_ALLOWED_CHANNELS belum diatur di Vercel Environment Variables.', 503);
  if (!process.env.YOUTUBE_API_KEY) throw new YoutubeError('YOUTUBE_API_KEY belum diatur di Vercel Environment Variables.', 500);
  if (!channelId || !CHANNEL_ID_RE.test(String(channelId))) throw new YoutubeError('channelId tidak valid.', 400);
  if (!channels.includes(channelId)) throw new YoutubeError('Channel tidak diizinkan.', 403);
}

// Panggilan nyata ke YouTube Data API. Selalu meminta YOUTUBE_MAX item supaya satu entri cache
// bisa melayani semua `limit`. Error dilempar (bukan dikembalikan) supaya tidak ikut ter-cache.
async function fetchFromYoutube(channelId) {
  const url = new URL(`${API_BASE}/playlistItems`);
  url.searchParams.set('part', 'snippet,contentDetails');
  url.searchParams.set('playlistId', uploadsPlaylistId(channelId));
  url.searchParams.set('maxResults', String(YOUTUBE_MAX));
  url.searchParams.set('key', process.env.YOUTUBE_API_KEY);

  let response;
  try {
    // Tanpa opsi cache: hasilnya sudah di-cache oleh unstable_cache (kecuali fresh=true).
    response = await fetch(url, { signal: AbortSignal.timeout(8000) });
  } catch (error) {
    console.error('YouTube request failed:', error?.message || error);
    throw new YoutubeError('Terjadi kesalahan saat mengambil data YouTube.', 502);
  }
  if (response.status === 404) throw new YoutubeError('Channel YouTube tidak ditemukan atau tidak memiliki playlist upload.', 404);
  if (!response.ok) throw new YoutubeError('Gagal mengambil video YouTube.', 502);

  const data = await response.json().catch(() => ({}));
  return (data.items || [])
    .map(item => {
      const snippet = item.snippet || {};
      const videoId = String(item.contentDetails?.videoId || '');
      if (!VIDEO_ID_RE.test(videoId)) return null;
      return {
        title: String(snippet.title || 'Video YouTube').slice(0, 300),
        videoId,
        meta: String(snippet.channelTitle || 'YouTube').slice(0, 150),
        publishedAt: typeof snippet.publishedAt === 'string' ? snippet.publishedAt : null
      };
    })
    .filter(Boolean);
}

const fetchCached = unstable_cache(fetchFromYoutube, ['youtube-uploads'], {
  tags: [YOUTUBE_TAG],
  revalidate: YOUTUBE_REVALIDATE
});

/**
 * Video terbaru sebuah channel. `fresh: true` melewati cache (dipakai tombol "muat ulang").
 * Melempar YoutubeError kalau gagal.
 */
export async function getChannelVideos(channelId, limit = YOUTUBE_MAX, { fresh = false } = {}) {
  assertConfigured(channelId);
  const videos = fresh ? await fetchFromYoutube(channelId) : await fetchCached(channelId);
  return videos.slice(0, clampLimit(limit));
}

/**
 * Untuk render halaman: video dari YouTube kalau berhasil, kalau gagal/kosong pakai `fallback`
 * dari config. Tidak pernah melempar error — halaman tetap tampil.
 */
export async function loadFeed(channelId, limit, fallback = []) {
  if (channelId) {
    try {
      const live = await getChannelVideos(channelId, limit);
      if (live.length) return live.map(({ title, videoId, meta }) => ({ title, videoId, meta }));
    } catch (error) {
      console.warn('YouTube feed dilewati:', error?.message || error);
    }
  }
  return fallback;
}
