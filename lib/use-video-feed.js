'use client';

import { useCallback, useState } from 'react';
import { refreshYoutubeVideos } from './youtube-client';

// Video awal datang dari server (props). Hook ini hanya mengurus tombol "muat ulang".
export function useVideoFeed({ channelId, fetchLimit, initialVideos }) {
  const [videos, setVideos] = useState(initialVideos);
  const [refreshing, setRefreshing] = useState(false);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const live = await refreshYoutubeVideos(channelId, fetchLimit);
      if (live) setVideos(live);
    } finally {
      setRefreshing(false);
    }
  }, [channelId, fetchLimit]);

  return { videos, refreshing, refresh };
}
