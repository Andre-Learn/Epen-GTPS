'use client';

import { useCallback, useState } from 'react';
import { refreshYoutubeVideos } from './youtube-client';

// Video awal datang dari server (props). Hook ini hanya mengurus tombol "muat ulang".
// Kalau gagal, video lama dipertahankan dan `error` diisi supaya bisa ditampilkan.
export function useVideoFeed({ channelId, fetchLimit, initialVideos }) {
  const [videos, setVideos] = useState(initialVideos);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const refresh = useCallback(async () => {
    setRefreshing(true);
    setError('');
    try {
      const live = await refreshYoutubeVideos(channelId, fetchLimit);
      if (live === null) setError('Gagal memuat ulang, coba lagi sebentar.');
      else if (live.length) setVideos(live);
    } finally {
      setRefreshing(false);
    }
  }, [channelId, fetchLimit]);

  return { videos, refreshing, refresh, error };
}
