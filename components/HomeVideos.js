'use client';

import { useRef, useState } from 'react';
import { useVideoFeed } from '@/lib/use-video-feed';
import { RefreshButton, VideoCard } from './VideoParts';

export default function HomeVideos({ channelId, initialVideos, initialLimit, fetchLimit }) {
  const { videos, refreshing, refresh } = useVideoFeed({ channelId, fetchLimit, initialVideos });
  const [expanded, setExpanded] = useState(false);
  const moreRef = useRef(null);

  const toggleMore = () => {
    const next = !expanded;
    setExpanded(next);
    if (!next) moreRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <section className="content-section page-width" id="videos">
      <div className="section-title-row">
        <div><span className="section-kicker">LATEST CONTENT</span><h2>Video Epen GTPS</h2></div>
        <RefreshButton label="Muat ulang video terbaru" refreshing={refreshing} onClick={refresh} />
      </div>
      <div className="home-video-grid" id="homeVideoGrid">
        <div className="video-grid-inner">
          {videos.map((video, index) => (
            <VideoCard
              key={`${video.videoId}-${index}`}
              video={video}
              index={index}
              scope="home"
              hidden={!expanded && index >= initialLimit}
            />
          ))}
        </div>
        {videos.length > initialLimit ? (
          <button
            ref={moreRef}
            className="show-more-videos"
            type="button"
            aria-expanded={expanded}
            onClick={toggleMore}
          >
            <span>{expanded ? 'Show Less' : 'Show More'}</span>
            <svg viewBox="0 0 24 24" aria-hidden="true" style={expanded ? { transform: 'rotate(180deg)' } : undefined}>
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>
        ) : null}
      </div>
    </section>
  );
}
