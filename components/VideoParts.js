const VIDEO_ID_RE = /^[A-Za-z0-9_-]{11}$/;

export function VideoCard({ video, index = 0, scope = 'home', hidden = false }) {
  const id = String(video?.videoId || '');
  if (!VIDEO_ID_RE.test(id)) return null;
  const title = String(video.title || 'Video YouTube');

  return (
    <article className="video-card" data-video-index={index} data-video-scope={scope} hidden={hidden}>
      <a
        className="video-thumb"
        href={`https://www.youtube.com/watch?v=${encodeURIComponent(id)}`}
        target="_blank"
        rel="noopener"
        aria-label={`Buka ${title} di YouTube`}
      >
        <img src={`https://i.ytimg.com/vi/${encodeURIComponent(id)}/hqdefault.jpg`} alt={title} loading="lazy" />
        <span className="youtube-play" aria-hidden="true">
          <svg viewBox="0 0 24 24"><path d="M9 7.5v9l8-4.5-8-4.5Z" /></svg>
        </span>
      </a>
      <div className="video-info"><strong>{title}</strong><small>{video.meta || 'YouTube'}</small></div>
    </article>
  );
}

export function RefreshButton({ label = 'Muat ulang video', refreshing = false, onClick }) {
  return (
    <button
      className={`section-refresh${refreshing ? ' is-refreshing' : ''}`}
      type="button"
      aria-label={label}
      onClick={onClick}
    >
      <img src="/assets/icons/refresh-loop.png" alt="" aria-hidden="true" />
    </button>
  );
}
