'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useVideoFeed } from '@/lib/use-video-feed';
import { RefreshButton, VideoCard } from './VideoParts';

const LINK_LABELS = { whatsapp: 'WhatsApp', discord: 'Discord', youtube: 'YouTube' };

function scrollToPartner(id) {
  const button = document.getElementById(`partner-item-${id}`);
  if (!button) return;
  const top = button.getBoundingClientRect().top + window.scrollY - 88;
  window.scrollTo({ top, behavior: 'smooth' });
}

// Video partner sudah diambil di server saat halaman dibuat (partner.feed); di sini hanya
// ditampilkan setelah panelnya pertama kali dibuka, dan bisa dimuat ulang lewat tombol.
function PartnerVideos({ partner, fetchLimit }) {
  const limit = partner.videoLimit;
  const { videos, refreshing, refresh } = useVideoFeed({
    channelId: partner.youtubeChannelId,
    fetchLimit,
    initialVideos: partner.feed
  });
  const shown = limit > 0 ? videos.slice(0, limit) : videos;

  return (
    <div className="partner-expand-videos">
      <div className="section-title-row">
        <div><span className="section-kicker">PARTNER CONTENT</span><h4>Video Partner</h4></div>
        <RefreshButton label={`Muat ulang video partner ${partner.name}`} refreshing={refreshing} onClick={refresh} />
      </div>
      <div className="partner-video-container">
        <div className="video-grid-inner">
          {shown.length
            ? shown.map((video, index) => (
                <VideoCard key={`${video.videoId}-${index}`} video={video} index={index} scope={`partner-${partner.id}`} />
              ))
            : <p className="empty-content">Belum ada video dari partner ini.</p>}
        </div>
      </div>
    </div>
  );
}

function PartnerBanner({ partner }) {
  if (partner.bannerMode === 'custom') {
    return (
      <>
        <img src={partner.banner} alt={`Banner ${partner.name}`} loading="lazy" />
        <div className="partner-expand-banner-overlay" />
      </>
    );
  }
  return (
    <div className={`partner-banner-template partner-banner-template-${partner.bannerStyle}`}>
      <div className="partner-banner-template-grid" />
      <div className="partner-banner-template-glow" />
      <div className="partner-banner-template-copy">
        <strong>{partner.name}</strong>
        <span>{partner.tagline || 'Partner & Promoter GTPS'}</span>
      </div>
      {partner.bannerShowLogo
        ? <img className="partner-banner-template-logo" src={partner.logo} alt="" loading="lazy" />
        : null}
    </div>
  );
}

function PartnerAccordion({ partner, open, loaded, onToggle, fetchLimit }) {
  const expandRef = useRef(null);
  const [height, setHeight] = useState(0);

  // Tinggi panel mengikuti isi (video dimuat belakangan) — menggantikan setTimeout 420ms versi lama.
  useEffect(() => {
    const el = expandRef.current;
    if (!open || !el) {
      setHeight(0);
      return undefined;
    }
    const update = () => setHeight(el.scrollHeight);
    update();
    if (typeof ResizeObserver === 'undefined') return undefined;
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, [open]);

  const logo = partner.logo
    ? <img src={partner.logo} alt="" loading="lazy" />
    : partner.short;

  return (
    <article className={`partner-accordion${open ? ' is-open' : ''}`} data-partner={partner.id}>
      <button
        className="partner-item"
        id={`partner-item-${partner.id}`}
        type="button"
        aria-expanded={open}
        aria-controls={`partner-panel-${partner.id}`}
        onClick={onToggle}
      >
        <span className="partner-item-logo">{logo}</span>
        <span className="partner-item-copy"><strong>{partner.name}</strong><small>{partner.tagline}</small></span>
        <span className="partner-item-toggle" aria-hidden="true">
          <span className="toggle-plus">+</span><span className="toggle-minus">−</span>
        </span>
      </button>
      <div className="partner-panel" id={`partner-panel-${partner.id}`} style={{ maxHeight: open ? height : 0 }}>
        <div className="partner-expand" ref={expandRef} aria-hidden={!open}>
          <div className={`partner-expand-banner${partner.bannerMode === 'custom' ? ' has-partner-banner' : ' is-template-banner'}`}>
            <PartnerBanner partner={partner} />
          </div>
          <div className="partner-expand-content">
            <div className="partner-expand-logo">
              {partner.logo
                ? <img src={partner.logo} alt={`Logo ${partner.name}`} loading="lazy" />
                : <span>{partner.short}</span>}
            </div>
            <span className="section-kicker">PARTNER PROFILE</span>
            <h3>{partner.name}</h3>
            <p className="partner-expand-tagline">{partner.tagline}</p>
            <p className="partner-expand-description">{partner.description}</p>
            <div className="detail-links">
              {Object.keys(LINK_LABELS).map(type => (
                partner.links[type] ? (
                  <a key={type} className="detail-link" href={partner.links[type]} target="_blank" rel="noopener noreferrer">
                    <img
                      className={`detail-link-icon detail-link-icon-${type}`}
                      src={`/assets/icons/${type}.png`}
                      alt=""
                      aria-hidden="true"
                      loading="lazy"
                      decoding="async"
                    />
                    <span>{LINK_LABELS[type]}</span>
                  </a>
                ) : null
              ))}
            </div>
            {loaded ? <PartnerVideos partner={partner} fetchLimit={fetchLimit} /> : null}
          </div>
        </div>
      </div>
    </article>
  );
}

export default function PartnerList({ partners, fetchLimit }) {
  // Beberapa partner boleh terbuka bersamaan.
  const [open, setOpen] = useState({});
  const [loaded, setLoaded] = useState({});

  const setPartnerOpen = useCallback((id, next) => {
    setOpen(prev => ({ ...prev, [id]: next }));
    if (next) setLoaded(prev => (prev[id] ? prev : { ...prev, [id]: true }));
  }, []);

  const toggle = id => {
    const next = !open[id];
    setPartnerOpen(id, next);
    window.history.replaceState(null, '', next ? `/partners?partner=${encodeURIComponent(id)}` : '/partners');
    if (next) requestAnimationFrame(() => scrollToPartner(id));
  };

  // Deep link: /partners?partner=<id>
  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get('partner');
    if (requested && partners.some(partner => partner.id === requested)) {
      requestAnimationFrame(() => {
        setPartnerOpen(requested, true);
        scrollToPartner(requested);
      });
    }
  }, [partners, setPartnerOpen]);

  return (
    <section className="partner-list" id="partnerList" aria-label="Daftar partner">
      {partners.map(partner => (
        <PartnerAccordion
          key={partner.id}
          partner={partner}
          open={Boolean(open[partner.id])}
          loaded={Boolean(loaded[partner.id])}
          onToggle={() => toggle(partner.id)}
          fetchLimit={fetchLimit}
        />
      ))}
    </section>
  );
}
