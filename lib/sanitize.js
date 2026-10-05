import { safeImageUrl, safeLink } from './safe-url';

const VIDEO_ID_RE = /^[A-Za-z0-9_-]{11}$/;
const str = (value, fallback = '') => (value == null || value === '' ? fallback : String(value));

export function cleanVideos(list) {
  return (Array.isArray(list) ? list : [])
    .filter(video => video && VIDEO_ID_RE.test(str(video.videoId)))
    .map(video => ({
      title: str(video.title, 'Video YouTube'),
      videoId: str(video.videoId),
      meta: str(video.meta, 'YouTube')
    }));
}

// Semua URL dibersihkan di server sebelum dikirim ke Client Components.
export function sanitizePartners(list) {
  return (Array.isArray(list) ? list : [])
    .filter(partner => partner && partner.id != null && partner.id !== '')
    .map(partner => {
      const logo = safeImageUrl(partner.logo);
      const banner = safeImageUrl(partner.banner);
      const template = partner.bannerTemplate || {};
      const links = partner.links || {};
      const limit = Math.floor(Number(partner.videoLimit));
      return {
        id: str(partner.id),
        name: str(partner.name),
        short: str(partner.short),
        tagline: str(partner.tagline),
        description: str(partner.description),
        logo,
        banner,
        bannerMode: partner.bannerMode === 'custom' && banner ? 'custom' : 'template',
        bannerStyle: ['signature', 'midnight'].includes(template.style) ? template.style : 'signature',
        bannerShowLogo: Boolean(template.showLogo && logo),
        links: {
          whatsapp: safeLink(links.whatsapp),
          discord: safeLink(links.discord),
          youtube: safeLink(links.youtube)
        },
        // 0 = tampilkan semua video yang didapat
        videoLimit: Number.isFinite(limit) && limit > 0 ? limit : 0,
        youtubeChannelId: str(partner.youtubeChannelId),
        videos: cleanVideos(partner.videos)
      };
    });
}

export function sanitizeServers(list) {
  return (Array.isArray(list) ? list : [])
    .filter(Boolean)
    .map(server => ({
      id: str(server.id),
      name: str(server.name, 'Unnamed Server'),
      description: str(server.description, 'GTPS Community'),
      about: str(server.about),
      status: str(server.status, 'Online'),
      logo: safeImageUrl(server.logo),
      whatsapp: safeLink(server.whatsapp),
      discord: safeLink(server.discord),
      host: safeLink(server.host)
    }));
}

export function videoSettings(config) {
  const video = config?.video || {};
  return {
    initialLimit: Number(video.initialLimit) || 4,
    fetchLimit: Number(video.fetchLimit) || 24
  };
}
