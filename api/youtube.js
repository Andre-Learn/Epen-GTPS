const CHANNEL_ID_RE = /^UC[a-zA-Z0-9_-]{22}$/;
const VIDEO_ID_RE = /^[a-zA-Z0-9_-]{11}$/;
const ipHits = new Map();
const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 30;
const MAX_TRACKED_IPS = 5000;

function getClientIp(req) {
  const forwarded = req.headers?.['x-forwarded-for'] || req.headers?.['x-real-ip'] || '';
  const first = String(forwarded).split(',')[0].trim();
  return first || 'unknown';
}

function rateLimited(ip) {
  const now = Date.now();
  const previous = ipHits.get(ip) || [];
  const active = previous.filter(time => now - time < WINDOW_MS);
  active.push(now);

  if (!ipHits.has(ip) && ipHits.size >= MAX_TRACKED_IPS) {
    const oldest = ipHits.keys().next().value;
    if (oldest) ipHits.delete(oldest);
  }
  ipHits.set(ip, active);
  return active.length > MAX_REQUESTS_PER_WINDOW;
}

function allowedChannels() {
  return String(process.env.YOUTUBE_ALLOWED_CHANNELS || '')
    .split(',')
    .map(id => id.trim())
    .filter(id => CHANNEL_ID_RE.test(id));
}

function clampLimit(value) {
  const parsed = Number.parseInt(String(value ?? ''), 10);
  if (!Number.isFinite(parsed)) return 24;
  return Math.min(Math.max(parsed, 1), 24);
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
  res.setHeader('X-Content-Type-Options', 'nosniff');

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method tidak diizinkan.' });
  }

  const ip = getClientIp(req);
  if (rateLimited(ip)) {
    res.setHeader('Retry-After', '60');
    return res.status(429).json({ error: 'Terlalu banyak permintaan. Coba lagi nanti.' });
  }

  const { channelId, limit = '24' } = req.query || {};
  const apiKey = process.env.YOUTUBE_API_KEY;
  const configuredChannels = allowedChannels();

  // Fail closed: the proxy must have an explicit allowlist before it can spend API quota.
  if (!configuredChannels.length) {
    return res.status(503).json({ error: 'YOUTUBE_ALLOWED_CHANNELS belum diatur di Vercel Environment Variables.' });
  }

  if (!apiKey) {
    return res.status(500).json({ error: 'YOUTUBE_API_KEY belum diatur di Vercel Environment Variables.' });
  }
  if (!channelId || !CHANNEL_ID_RE.test(String(channelId))) {
    return res.status(400).json({ error: 'channelId tidak valid.' });
  }

  const requestedChannel = String(channelId);
  if (!configuredChannels.includes(requestedChannel)) {
    return res.status(403).json({ error: 'Channel tidak diizinkan.' });
  }

  const maxResults = clampLimit(limit);
  const base = 'https://www.googleapis.com/youtube/v3';

  try {
    const channelUrl = new URL(`${base}/channels`);
    channelUrl.searchParams.set('part', 'contentDetails');
    channelUrl.searchParams.set('id', requestedChannel);
    channelUrl.searchParams.set('key', apiKey);

    const channelResponse = await fetch(channelUrl);
    const channelData = await channelResponse.json();
    if (!channelResponse.ok) {
      return res.status(502).json({ error: 'Gagal mengambil data channel YouTube.' });
    }

    const uploadsPlaylistId = channelData.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;
    if (!uploadsPlaylistId) {
      return res.status(404).json({ error: 'Channel YouTube tidak ditemukan atau tidak memiliki playlist upload.' });
    }

    const playlistUrl = new URL(`${base}/playlistItems`);
    playlistUrl.searchParams.set('part', 'snippet,contentDetails');
    playlistUrl.searchParams.set('playlistId', uploadsPlaylistId);
    playlistUrl.searchParams.set('maxResults', String(maxResults));
    playlistUrl.searchParams.set('key', apiKey);

    const playlistResponse = await fetch(playlistUrl);
    const playlistData = await playlistResponse.json();
    if (!playlistResponse.ok) {
      return res.status(502).json({ error: 'Gagal mengambil video YouTube.' });
    }

    const videos = (playlistData.items || [])
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

    return res.status(200).json({ videos });
  } catch (error) {
    console.error('YouTube proxy error:', error);
    return res.status(502).json({ error: 'Terjadi kesalahan saat mengambil data YouTube.' });
  }
}
