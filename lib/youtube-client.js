// Dipakai di browser, hanya untuk tombol "muat ulang". Render awal sudah membawa data video dari server.
// Mengembalikan array video, atau null kalau gagal (supaya tampilan lama dipertahankan).
export async function refreshYoutubeVideos(channelId, limit = 24) {
  if (!channelId) return null;
  try {
    const response = await fetch(
      `/api/youtube?channelId=${encodeURIComponent(channelId)}&limit=${encodeURIComponent(limit)}&refresh=${Date.now()}`,
      { cache: 'no-store' }
    );
    if (!response.ok) throw new Error(`YouTube API ${response.status}`);
    const data = await response.json();
    return Array.isArray(data.videos) && data.videos.length ? data.videos : null;
  } catch (error) {
    console.warn('YouTube feed unavailable:', error);
    return null;
  }
}
