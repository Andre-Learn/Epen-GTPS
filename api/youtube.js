export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');

  const { channelId, limit = '24' } = req.query || {};
  const apiKey = process.env.YOUTUBE_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'YOUTUBE_API_KEY belum diatur di Vercel Environment Variables.' });
  }
  if (!channelId) {
    return res.status(400).json({ error: 'channelId wajib diisi.' });
  }

  const maxResults = Math.min(Math.max(Number.parseInt(limit, 10) || 24, 1), 50);
  const base = 'https://www.googleapis.com/youtube/v3';

  try {
    const channelUrl = new URL(`${base}/channels`);
    channelUrl.searchParams.set('part', 'contentDetails');
    channelUrl.searchParams.set('id', channelId);
    channelUrl.searchParams.set('key', apiKey);

    const channelResponse = await fetch(channelUrl);
    const channelData = await channelResponse.json();
    if (!channelResponse.ok) {
      return res.status(channelResponse.status).json({ error: channelData?.error?.message || 'Gagal mengambil channel YouTube.' });
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
      return res.status(playlistResponse.status).json({ error: playlistData?.error?.message || 'Gagal mengambil video YouTube.' });
    }

    const videos = (playlistData.items || [])
      .map(item => {
        const snippet = item.snippet || {};
        const videoId = item.contentDetails?.videoId;
        if (!videoId) return null;
        return {
          title: snippet.title || 'Video YouTube',
          videoId,
          meta: snippet.channelTitle || 'YouTube',
          publishedAt: snippet.publishedAt || null
        };
      })
      .filter(Boolean);

    return res.status(200).json({ videos });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Terjadi kesalahan saat mengambil data YouTube.' });
  }
}
