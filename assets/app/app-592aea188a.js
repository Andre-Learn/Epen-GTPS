/* Epen GTPS — production site bundle */
/* =========================
   Epen GTPS — site data
   =========================
   Ganti data di bawah ini untuk memasukkan logo, banner, link, dan video asli.
*/

let SITE_CONFIG = { partners: [], epen: { youtubeChannelId: '' }, video: { initialLimit: 4, pageSize: 4 } };
let partners = SITE_CONFIG.partners || [];
let epenVideos = SITE_CONFIG.epen?.videos || [];
let VIDEO_INITIAL_LIMIT = SITE_CONFIG.video?.initialLimit || 4;
let VIDEO_PAGE_SIZE = SITE_CONFIG.video?.pageSize || 4;

function setSiteConfig(config) {
  SITE_CONFIG = config && typeof config === 'object' ? config : {};
  partners = Array.isArray(SITE_CONFIG.partners) ? SITE_CONFIG.partners : [];
  epenVideos = Array.isArray(SITE_CONFIG.epen?.videos) ? SITE_CONFIG.epen.videos : [];
  VIDEO_INITIAL_LIMIT = Number(SITE_CONFIG.video?.initialLimit) || 4;
  VIDEO_PAGE_SIZE = Number(SITE_CONFIG.video?.pageSize) || 4;
}

const YOUTUBE_VIDEO_ID_RE = /^[A-Za-z0-9_-]{11}$/;

const escapeHtml = value => String(value ?? '').replace(/[&<>'"]/g, c => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#039;', '"': '&quot;'
}[c]));

// Security helpers: configuration is editable client-side, so never trust URLs
// coming from settings.js. Only safe web/internal URLs are allowed.
function safeUrl(value, options = {}) {
  const raw = String(value ?? '').trim();
  if (!raw) return '';
  if (raw === '#') return '#';
  if (raw.startsWith('#') || raw.startsWith('./') || raw.startsWith('../') || (raw.startsWith('/') && !raw.startsWith('//'))) return raw;
  if (raw.startsWith('//') || /[\u0000-\u001F\u007F]/.test(raw)) return '';
  try {
    const url = new URL(raw, window.location.origin);
    if (url.protocol !== 'https:' && url.protocol !== 'http:') return '';
    if (options.sameOriginOnly && url.origin !== window.location.origin) return '';
    return url.href;
  } catch (_) {
    return '';
  }
}

function safeImageUrl(value) {
  const url = safeUrl(value);
  if (!url) return '';
  try {
    const parsed = new URL(url, window.location.origin);
    return parsed.protocol === 'https:' || (parsed.protocol === 'http:' && parsed.origin === window.location.origin) ? url : '';
  } catch (_) {
    return '';
  }
}


function actionFallbackSvg(name) {
  const common = 'width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"';
  const icons = {
    discord: `<svg ${common}><path d="M8.5 8.2A7.7 7.7 0 0 1 12 7.4a7.7 7.7 0 0 1 3.5.8"/><path d="M6.8 17.2c1.5 1.1 3.3 1.7 5.2 1.7s3.7-.6 5.2-1.7c.6-2.1.7-4.8.1-7.2-1.2-.8-2.4-1.2-3.8-1.4l-.5 1.1c-.7-.1-1.4-.1-2.1 0l-.5-1.1c-1.4.2-2.6.6-3.8 1.4-.6 2.4-.5 5.1.2 7.2Z"/><path d="M9.4 13.9h.1M14.5 13.9h.1"/></svg>`,
    whatsapp: `<svg ${common}><path d="M20 11.6a8 8 0 0 1-11.9 7L4 20l1.5-4A8 8 0 1 1 20 11.6Z"/><path d="M9 9.2c.2-.4.4-.5.7-.5h.5c.2 0 .4.1.5.4l.5 1.2c.1.2.1.4-.1.6l-.5.6c.5.9 1.2 1.6 2.1 2.1l.6-.5c.2-.2.4-.2.6-.1l1.2.5c.3.1.4.3.4.5v.5c0 .3-.1.5-.5.7-1 .4-2.4-.1-3.8-1.3-1.4-1.2-2.5-2.5-2.2-4.7Z"/></svg>`,
    users: `<svg ${common}><path d="M16 20v-1.4a3.6 3.6 0 0 0-3.6-3.6H7.6A3.6 3.6 0 0 0 4 18.6V20"/><circle cx="10" cy="8" r="3"/><path d="M16 11a3 3 0 0 0 0-6M20 20v-1.4a3.6 3.6 0 0 0-2.7-3.5"/></svg>`,
    network: `<svg ${common}><circle cx="12" cy="5" r="2.2"/><circle cx="5" cy="18" r="2.2"/><circle cx="19" cy="18" r="2.2"/><path d="M10.8 6.9 6.2 16M13.2 6.9l4.6 9M7.2 18h9.6"/></svg>`,
    play: `<svg ${common} fill="currentColor" stroke="none"><path d="m9 6.5 9 5.5-9 5.5v-11Z"/></svg>`,
    video: `<svg ${common}><rect x="3" y="5" width="13" height="14" rx="2"/><path d="m16 10 5-3v10l-5-3"/></svg>`,
    link: `<svg ${common}><path d="M10 13.8a4 4 0 0 0 5.7.2l2-2a4 4 0 0 0-5.7-5.7l-1.1 1.1"/><path d="M14 10.2a4 4 0 0 0-5.7-.2l-2 2A4 4 0 0 0 12 17.7l1.1-1.1"/></svg>`
  };
  return icons[name] || icons.link;
}

function pageKeyFromUrl(value) {
  const raw = String(value ?? '').trim();
  if (!raw || raw.startsWith('#')) return '';
  try {
    const url = new URL(raw, window.location.origin);
    if (url.origin !== window.location.origin) return '';
    const path = url.pathname.replace(/\/+$/, '') || '/';
    const map = {
      '/': 'home',
      '/index.html': 'home',
      '/promote': 'promote',
      '/promote.html': 'promote',
      '/partners': 'partners',
      '/partners.html': 'partners',
      '/servers': 'servers',
      '/servers.html': 'servers'
    };
    return map[path] || '';
  } catch (_) {
    return '';
  }
}

function isPageEnabled(key) {
  if (!key) return true;
  const pages = SITE_CONFIG.pages || {};
  return pages[key]?.enabled !== false;
}

function isUrlEnabled(value) {
  const key = pageKeyFromUrl(value);
  return !key || isPageEnabled(key);
}

function getCurrentPageKey() {
  const fromBody = String(document.body?.dataset?.pageKey || '').trim();
  if (fromBody) return fromBody;
  return pageKeyFromUrl(window.location.href) || 'home';
}

function applyPageAvailability() {
  const key = getCurrentPageKey();
  const page = SITE_CONFIG.pages?.[key];
  if (!page || page.enabled !== false) return false;

  document.body.classList.add('is-maintenance-page');

  const title = String(page.maintenanceTitle || 'Segera Tersedia');
  const description = String(page.maintenanceDescription || 'Halaman ini sedang dalam tahap persiapan. Silakan kembali lagi nanti.');
  const main = document.querySelector('main');
  if (main) {
    main.innerHTML = `
      <section class="maintenance-page page-width" aria-labelledby="maintenanceTitle">
        <div class="maintenance-content">
          <span class="section-kicker">EPEN GTPS</span>
          <h1 id="maintenanceTitle">${escapeHtml(title)}</h1>
          <p>${escapeHtml(description)}</p>
          ${key !== 'home' && isPageEnabled('home') ? '<a class="maintenance-button" href="/">Kembali ke Home</a>' : ''}
        </div>
      </section>`;
  }

  let robots = document.querySelector('meta[name="robots"]');
  if (!robots) {
    robots = document.createElement('meta');
    robots.name = 'robots';
    document.head.appendChild(robots);
  }
  robots.setAttribute('content', 'noindex, nofollow');

  document.title = `${title} — ${SITE_CONFIG.site?.name || 'Epen GTPS'}`;
  return true;
}

function footerIcon(id) {
  // Footer uses tightly-cropped local icon copies so transparent padding
  // inside source PNGs does not make some icons look smaller than others.
  const iconMap = {
    home: '/assets/icons/footer/home.png',
    promote: '/assets/icons/footer/promote.png',
    partners: '/assets/icons/footer/partners.png',
    servers: '/assets/icons/footer/servers.png',
    discord: '/assets/icons/footer/discord.png',
    whatsapp: '/assets/icons/footer/whatsapp.png'
  };
  const src = iconMap[id] || iconMap.home;
  return `<img class="global-footer-icon" src="${escapeHtml(src)}" alt="" aria-hidden="true" loading="lazy" decoding="async">`;
}

function renderGlobalFooter() {
  const footer = document.querySelector('[data-site-footer]');
  if (!footer) return;

  const site = SITE_CONFIG.site || {};
  const name = String(site.name || 'Epen GTPS');
  const logoUrl = safeImageUrl(site.logoUrl);
  const description = String(site.footerDescription || 'Community, creator, dan partner network.');
  const nav = Array.isArray(site.footerNav) ? site.footerNav : [];

  const logo = logoUrl
    ? `<img class="global-footer-logo" src="${escapeHtml(logoUrl)}" alt="${escapeHtml(name)} logo" loading="lazy">`
    : `<span class="global-footer-logo-fallback">E</span>`;

  const links = nav.filter(item => isUrlEnabled(item?.url)).map((item, index) => {
    const id = String(item?.id || `footer-${index + 1}`);
    const label = String(item?.label || 'Link');
    const url = safeUrl(item?.url) || '#';
    const target = item?.target === '_blank' ? '_blank' : '_self';
    const rel = target === '_blank' ? ' rel="noopener noreferrer"' : '';
    return `<a class="global-footer-link footer-link-${escapeHtml(id)}" href="${escapeHtml(url)}" target="${target}"${rel}>${footerIcon(id)}<span>${escapeHtml(label)}</span></a>`;
  }).join('');

  footer.innerHTML = `
    <div class="global-footer-inner page-width">
      <div class="global-footer-top">
        <a class="global-footer-brand" href="/" aria-label="${escapeHtml(name)} home">
          ${logo}
          <span>${escapeHtml(name)}</span>
        </a>
        <p class="global-footer-description">${escapeHtml(description)}</p>
      </div>
      <nav class="global-footer-nav" aria-label="Footer navigation">
        ${links}
      </nav>
      <div class="global-footer-divider"></div>
      <div class="global-footer-bottom">
        <span>© ${new Date().getFullYear()} ${escapeHtml(name)}</span>
        <span>Made for the GTPS community.</span>
      </div>
    </div>`;
}

function renderActionButtons() {
  const container = document.querySelector('#actionList');
  if (!container) return;

  const site = SITE_CONFIG.site || {};
  const configured = Array.isArray(site.actionButtons) ? site.actionButtons : [];

  const buttons = configured.filter(item => isUrlEnabled(item?.url));

  container.innerHTML = buttons.map((button, index) => {
    const item = button && typeof button === 'object' ? button : {};
    const id = String(item.id || `action-${index + 1}`);
    const category = String(item.category || 'Link');
    const title = String(item.title || `Button ${index + 1}`);
    const url = safeUrl(item.url) || '#';
    const iconUrl = safeImageUrl(item.iconUrl);
    const iconName = String(item.icon || 'link').trim();
    const target = item.target === '_blank' ? '_blank' : '_self';
    const rel = target === '_blank' ? ' rel="noopener noreferrer"' : '';
    const icon = iconUrl
      ? `<img src="${escapeHtml(iconUrl)}" alt="" loading="eager" />`
      : actionFallbackSvg(iconName);

    return `<a class="action-card" href="${escapeHtml(url)}" target="${target}"${rel} data-action-id="${escapeHtml(id)}">
      <span class="action-logo${iconUrl ? ' has-action-icon' : ' has-fallback-icon'}" aria-hidden="true">${icon}</span>
      <span class="action-copy"><small>${escapeHtml(category)}</small><strong>${escapeHtml(title)}</strong></span>
    </a>`;
  }).join('');
}

function applySiteMetadata() {
  const site = SITE_CONFIG.site || {};
  const name = String(site.name || 'Epen GTPS').trim();
  const key = getCurrentPageKey();
  const pageSEO = site.pageSEO?.[key] || {};
  const description = String(pageSEO.description || site.description || '').trim();
  const title = String(pageSEO.title || document.title || name).trim();
  const ogTitle = String(pageSEO.ogTitle || title).trim();
  const ogDescription = String(pageSEO.ogDescription || description).trim();
  const keywords = String(pageSEO.keywords || '').trim();
  const faviconUrl = safeImageUrl(site.faviconUrl || site.logoUrl);
  const ogImageUrl = safeImageUrl(site.ogImageUrl || site.bannerUrl || site.logoUrl);
  const canonical = document.querySelector('link[rel="canonical"]')?.href || window.location.href;

  document.title = title;

  const setMeta = (selector, attr, value) => {
    if (!value) return;
    let el = document.querySelector(selector);
    if (!el) {
      el = document.createElement('meta');
      const match = selector.match(/\[(?:name|property)="([^"]+)"\]/);
      if (!match) return;
      el.setAttribute(attr, match[1]);
      document.head.appendChild(el);
    }
    el.setAttribute('content', value);
  };

  setMeta('meta[name="description"]', 'name', description);
  setMeta('meta[name="keywords"]', 'name', keywords);
  setMeta('meta[property="og:title"]', 'property', ogTitle);
  setMeta('meta[property="og:description"]', 'property', ogDescription);
  setMeta('meta[property="og:url"]', 'property', canonical);
  setMeta('meta[property="og:site_name"]', 'property', name);
  setMeta('meta[property="og:image"]', 'property', ogImageUrl);
  setMeta('meta[property="og:type"]', 'property', 'website');
  setMeta('meta[name="twitter:card"]', 'name', ogImageUrl ? 'summary_large_image' : 'summary');
  setMeta('meta[name="twitter:title"]', 'name', ogTitle);
  setMeta('meta[name="twitter:description"]', 'name', ogDescription);
  setMeta('meta[name="twitter:image"]', 'name', ogImageUrl);
  setMeta('meta[name="twitter:url"]', 'name', canonical);

  const themeMeta = document.querySelector('meta[name="theme-color"]');
  if (themeMeta) themeMeta.setAttribute('content', '#6d28d9');

  if (faviconUrl) {
    let icon = document.querySelector('#siteFavicon');
    if (!icon) {
      icon = document.createElement('link');
      icon.id = 'siteFavicon';
      icon.rel = 'icon';
      document.head.appendChild(icon);
    }
    icon.type = 'image/png';
    icon.sizes = '48x48';
    icon.href = faviconUrl;
  }
}


function applySiteImages() {
  const site = SITE_CONFIG.site || {};
  const logoUrl = safeImageUrl(site.logoUrl);
  const bannerUrl = safeImageUrl(site.bannerUrl);

  // Main logo: header + profile avatar.
  document.querySelectorAll('[data-site-logo]').forEach(el => {
    if (!logoUrl) return;
    el.classList.add('has-site-logo');
    el.innerHTML = `<img src="${escapeHtml(logoUrl)}" alt="${escapeHtml(site.name || 'Epen GTPS')} logo" loading="eager" />`;
  });

  // Main banner / cover.
  const banner = document.querySelector('[data-site-banner]');
  if (banner && bannerUrl) {
    banner.classList.add('has-site-banner');
    banner.style.backgroundImage = `url(\"${bannerUrl.replace(/\"/g, '%22')}\")`;

    // Keep the banner proportional to the actual image. The CSS defaults to
    // the recommended 16:5 ratio, then this upgrades it automatically when
    // the supplied URL uses another ratio.
    const bannerProbe = new Image();
    bannerProbe.onload = () => {
      if (bannerProbe.naturalWidth && bannerProbe.naturalHeight) {
        banner.style.aspectRatio = `${bannerProbe.naturalWidth} / ${bannerProbe.naturalHeight}`;
      }
    };
    bannerProbe.src = bannerUrl;
  }
}

function iconSvg(type) {
  const iconMap = {
    whatsapp: '/assets/icons/whatsapp.png',
    discord: '/assets/icons/discord.png',
    youtube: '/assets/icons/youtube.png'
  };
  const src = iconMap[type] || '/assets/icons/partners.png';
  return `<img class="detail-link-icon detail-link-icon-${escapeHtml(type)}" src="${escapeHtml(src)}" alt="" aria-hidden="true" loading="lazy" decoding="async">`;
}

function youtubeThumb(videoId) {
  return `https://i.ytimg.com/vi/${encodeURIComponent(videoId)}/hqdefault.jpg`;
}

function youtubePlayIcon() {
  return `<span class="youtube-play" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M9 7.5v9l8-4.5-8-4.5Z"/></svg></span>`;
}

function videoSkeletonCard() {
  return `<article class="video-card video-skeleton-card" aria-hidden="true">
    <div class="video-skeleton-thumb skeleton-shimmer"></div>
    <div class="video-skeleton-info"><span class="skeleton-line skeleton-line-lg skeleton-shimmer"></span><span class="skeleton-line skeleton-line-sm skeleton-shimmer"></span></div>
  </article>`;
}

function renderVideoSkeletons(container, count = 4, partner = false) {
  if (!container) return;
  const safeCount = Math.max(2, Math.min(12, Number(count) || 4));
  container.innerHTML = `<div class="video-grid-inner is-loading">${Array.from({length: safeCount}, videoSkeletonCard).join('')}</div>`;
}

function refreshButtonMarkup(label = 'Muat ulang video', key = '') {
  const attr = key ? ` data-video-refresh="${escapeHtml(key)}"` : '';
  return `<button class="section-refresh" type="button"${attr} aria-label="${escapeHtml(label)}"><img src="assets/icons/refresh-loop.png" alt="" aria-hidden="true"></button>`;
}

function videoCard(video, index = 0, scope = 'home') {
  const id = String(video.videoId || '');
  if (!YOUTUBE_VIDEO_ID_RE.test(id)) return '';
  const thumb = youtubeThumb(id);
  return `<article class="video-card" data-video-index="${index}" data-video-scope="${scope}">
    <a class="video-thumb" href="https://www.youtube.com/watch?v=${encodeURIComponent(id)}" target="_blank" rel="noopener" aria-label="Buka ${escapeHtml(video.title)} di YouTube">
      <img src="${thumb}" alt="${escapeHtml(video.title)}" loading="lazy" />
      ${youtubePlayIcon()}
    </a>
    <div class="video-info"><strong>${escapeHtml(video.title)}</strong><small>${escapeHtml(video.meta || 'YouTube')}</small></div>
  </article>`;
}

function showMoreMarkup(scope, total) {
  if (total <= VIDEO_INITIAL_LIMIT) return '';
  return `<button class="show-more-videos" type="button" data-show-more="${scope}" aria-expanded="false">
    <span>Show More</span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>
  </button>`;
}

function renderVideoCollection(container, videos, scope) {
  if (!container) return;
  const list = Array.isArray(videos) ? videos : [];
  const cards = list.map((video, index) => videoCard(video, index, scope)).join('');
  container.innerHTML = `<div class="video-grid-inner">${cards}</div>${showMoreMarkup(scope, list.length)}`;
  const cardsEls = [...container.querySelectorAll('.video-card')];
  cardsEls.forEach((card, index) => {
    card.hidden = index >= VIDEO_INITIAL_LIMIT;
  });
  const more = container.querySelector('[data-show-more]');
  more?.addEventListener('click', () => {
    const expanded = more.getAttribute('aria-expanded') === 'true';
    if (expanded) {
      cardsEls.forEach((card, index) => { card.hidden = index >= VIDEO_INITIAL_LIMIT; });
      more.setAttribute('aria-expanded', 'false');
      more.querySelector('span').textContent = 'Show More';
      more.querySelector('svg').style.transform = '';
      more.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      cardsEls.forEach(card => { card.hidden = false; });
      more.setAttribute('aria-expanded', 'true');
      more.querySelector('span').textContent = 'Show Less';
      more.querySelector('svg').style.transform = 'rotate(180deg)';
    }
  });
}

function renderPartnerVideoCollection(container, videos, scope) {
  if (!container) return;
  const list = Array.isArray(videos) ? videos : [];
  const cards = list.map((video, index) => videoCard(video, index, scope)).join('');
  container.innerHTML = `<div class="video-grid-inner">${cards || '<p class="empty-content">Belum ada video dari partner ini.</p>'}</div>`;
}

function videoCacheConfig() {
  const cfg = SITE_CONFIG.video?.cache || {};
  const duration = Number(cfg.duration);
  return {
    enabled: cfg.enabled !== false,
    duration: Number.isFinite(duration) && duration > 0 ? duration : 300000,
    useStaleOnError: cfg.useStaleOnError !== false
  };
}

function videoCacheKey(channelId, limit) {
  return `epen-youtube-cache:v1:${channelId}:${limit}`;
}

function readVideoCache(channelId, limit) {
  const cfg = videoCacheConfig();
  if (!cfg.enabled) return null;
  try {
    const raw = localStorage.getItem(videoCacheKey(channelId, limit));
    if (!raw) return null;
    const cached = JSON.parse(raw);
    if (!Array.isArray(cached.videos) || !cached.savedAt) return null;
    return {
      videos: cached.videos,
      savedAt: Number(cached.savedAt),
      fresh: Date.now() - Number(cached.savedAt) < cfg.duration
    };
  } catch (_) {
    return null;
  }
}

function writeVideoCache(channelId, limit, videos) {
  const cfg = videoCacheConfig();
  if (!cfg.enabled || !Array.isArray(videos) || !videos.length) return;
  try {
    localStorage.setItem(videoCacheKey(channelId, limit), JSON.stringify({
      savedAt: Date.now(),
      videos
    }));
  } catch (_) {}
}

async function fetchYoutubeVideos(channelId, limit = 24, options = {}) {
  if (!channelId) return [];

  const forceRefresh = Boolean(options.forceRefresh);
  const cfg = videoCacheConfig();
  const cached = forceRefresh ? null : readVideoCache(channelId, limit);
  if (cached?.fresh) return cached.videos;

  try {
    const refreshQuery = forceRefresh ? `&refresh=${Date.now()}` : '';
    const response = await fetch(`/api/youtube?channelId=${encodeURIComponent(channelId)}&limit=${encodeURIComponent(limit)}${refreshQuery}`, {
      cache: forceRefresh ? 'no-store' : 'default'
    });
    if (!response.ok) throw new Error(`YouTube API ${response.status}`);
    const data = await response.json();
    const videos = Array.isArray(data.videos) ? data.videos : [];
    if (videos.length) writeVideoCache(channelId, limit, videos);
    return videos;
  } catch (error) {
    console.warn('YouTube feed unavailable:', error);
    if (cfg.useStaleOnError && cached?.videos?.length) return cached.videos;
    return [];
  }
}

async function renderHomeVideos(forceRefresh = false) {
  const grid = document.querySelector('#homeVideoGrid');
  if (!grid) return;
  renderVideoSkeletons(grid, VIDEO_INITIAL_LIMIT);
  const channelId = SITE_CONFIG.epen?.youtubeChannelId || '';
  if (channelId) {
    const videos = await fetchYoutubeVideos(channelId, SITE_CONFIG.video?.fetchLimit || 24, { forceRefresh });
    if (videos.length) { renderVideoCollection(grid, videos, 'home'); return; }
  }
  renderVideoCollection(grid, epenVideos, 'home');
}

async function renderPartnerVideos(partner, forceRefresh = false) {
  const container = document.querySelector(`[data-partner-video="${CSS.escape(partner.id)}"]`);
  if (!container) return;

  // Atur jumlah video per partner langsung dari settings.js.
  // 0 / kosong = tampilkan semua video yang berhasil didapat.
  const configuredLimit = Number(partner.videoLimit);
  const limit = Number.isFinite(configuredLimit) && configuredLimit > 0 ? Math.floor(configuredLimit) : 0;
  const globalFetchLimit = Number(SITE_CONFIG.video?.fetchLimit) || 24;
  const fetchLimit = Math.min(50, Math.max(globalFetchLimit, limit || 0));

  const applyLimit = (videos) => {
    const list = Array.isArray(videos) ? videos : [];
    return limit > 0 ? list.slice(0, limit) : list;
  };

  renderVideoSkeletons(container, Math.max(2, Math.min(limit || 4, 12)));

  const channelId = partner.youtubeChannelId || '';
  if (channelId) {
    const videos = await fetchYoutubeVideos(channelId, fetchLimit, { forceRefresh });
    if (videos.length) {
      renderPartnerVideoCollection(container, applyLimit(videos), `partner-${partner.id}`);
      return;
    }
  }

  renderPartnerVideoCollection(container, applyLimit(partner.videos || []), `partner-${partner.id}`);
}

function setLinkButton(type, url) {
  const safe = safeUrl(url);
  if (!safe || safe === '#') return '';
  const labels = { whatsapp: 'WhatsApp', discord: 'Discord', youtube: 'YouTube' };
  return `<a class="detail-link" href="${escapeHtml(safe)}" target="_blank" rel="noopener noreferrer">${iconSvg(type)}<span>${labels[type] || 'Link'}</span></a>`;
}

function partnerDetailMarkup(partner) {
  const links = [
    setLinkButton('whatsapp', partner.links?.whatsapp),
    setLinkButton('discord', partner.links?.discord),
    setLinkButton('youtube', partner.links?.youtube)
  ].join('');

  const videos = (partner.videos || []).length
    ? partner.videos.map(videoCard).join('')
    : '<p class="empty-content">Belum ada video dari partner ini.</p>';

  const partnerLogo = safeImageUrl(partner.logo);
  const logo = partnerLogo
    ? `<img src="${escapeHtml(partnerLogo)}" alt="Logo ${escapeHtml(partner.name)}" loading="lazy">`
    : `<span>${escapeHtml(partner.short)}</span>`;

  const partnerBanner = safeImageUrl(partner.banner);
  const bannerMode = partner.bannerMode === 'custom' && partnerBanner ? 'custom' : 'template';
  const template = partner.bannerTemplate || {};
  const templateStyle = ['signature', 'midnight'].includes(template.style) ? template.style : 'signature';
  const templateLogo = template.showLogo && partnerLogo
    ? `<img class="partner-banner-template-logo" src="${escapeHtml(partnerLogo)}" alt="" loading="lazy">`
    : '';
  const banner = bannerMode === 'custom'
    ? `<img src="${escapeHtml(partnerBanner)}" alt="Banner ${escapeHtml(partner.name)}" loading="lazy"><div class="partner-expand-banner-overlay"></div>`
    : `<div class="partner-banner-template partner-banner-template-${templateStyle}">
        <div class="partner-banner-template-grid"></div>
        <div class="partner-banner-template-glow"></div>
        <div class="partner-banner-template-copy">
          <strong>${escapeHtml(partner.name)}</strong>
          <span>${escapeHtml(partner.tagline || 'Partner & Promoter GTPS')}</span>
        </div>
        ${templateLogo}
      </div>`;

  return `
    <div class="partner-expand" aria-hidden="true">
      <div class="partner-expand-banner${bannerMode === 'custom' ? ' has-partner-banner' : ' is-template-banner'}">${banner}</div>
      <div class="partner-expand-content">
        <div class="partner-expand-logo">${logo}</div>
        <span class="section-kicker">PARTNER PROFILE</span>
        <h3>${escapeHtml(partner.name)}</h3>
        <p class="partner-expand-tagline">${escapeHtml(partner.tagline)}</p>
        <p class="partner-expand-description">${escapeHtml(partner.description)}</p>
        <div class="detail-links">${links}</div>
        <div class="partner-expand-videos">
          <div class="section-title-row">
            <div><span class="section-kicker">PARTNER CONTENT</span><h4>Video Partner</h4></div>
            ${refreshButtonMarkup(`Muat ulang video partner ${partner.name}`, `partner-${partner.id}`)}
          </div>
          <div class="partner-video-container" data-partner-video="${escapeHtml(partner.id)}"></div>
        </div>
      </div>
    </div>`;
}

function renderPartners() {
  const list = document.querySelector('#partnerList');
  if (!list) return;

  list.innerHTML = partners.map(partner => `
    <article class="partner-accordion" data-partner="${escapeHtml(partner.id)}">
      <button class="partner-item" type="button" aria-expanded="false" aria-controls="partner-panel-${escapeHtml(partner.id)}">
        <span class="partner-item-logo">${safeImageUrl(partner.logo) ? `<img src="${escapeHtml(safeImageUrl(partner.logo))}" alt="" loading="lazy">` : escapeHtml(partner.short)}</span>
        <span class="partner-item-copy"><strong>${escapeHtml(partner.name)}</strong><small>${escapeHtml(partner.tagline)}</small></span>
        <span class="partner-item-toggle" aria-hidden="true"><span class="toggle-plus">+</span><span class="toggle-minus">−</span></span>
      </button>
      <div class="partner-panel" id="partner-panel-${escapeHtml(partner.id)}">${partnerDetailMarkup(partner)}</div>
    </article>`).join('');

  partners.forEach(partner => {
    const container = list.querySelector(`[data-partner-video="${CSS.escape(partner.id)}"]`);
    renderPartnerVideos(partner);
  });

  list.querySelectorAll('.partner-item').forEach(button => {
    button.addEventListener('click', () => showPartner(button.closest('.partner-accordion')?.dataset.partner));
  });
}

function showPartner(id) {
  const target = document.querySelector(`.partner-accordion[data-partner="${CSS.escape(id)}"]`);
  const list = document.querySelector('#partnerList');
  if (!target || !list) return;

  const alreadyOpen = target.classList.contains('is-open');

  // Multiple partner cards may stay open at the same time.
  // Do not close other accordions when opening this one.

  if (alreadyOpen) {
    closePartner(target);
    history.replaceState(null, '', 'partners.html');
    return;
  }

  openPartner(target);
  history.replaceState(null, '', `partners.html?partner=${encodeURIComponent(id)}`);
}

function openPartner(accordion) {
  accordion.classList.add('is-open');
  const button = accordion.querySelector('.partner-item');
  const panel = accordion.querySelector('.partner-panel');
  const expand = accordion.querySelector('.partner-expand');
  if (!button || !panel || !expand) return;

  button.setAttribute('aria-expanded', 'true');
  panel.style.maxHeight = `${expand.scrollHeight}px`;
  expand.setAttribute('aria-hidden', 'false');

  requestAnimationFrame(() => {
    const headerOffset = 88;
    const top = button.getBoundingClientRect().top + window.scrollY - headerOffset;
    window.scrollTo({ top, behavior: 'smooth' });
  });

  setTimeout(() => {
    if (accordion.classList.contains('is-open')) {
      panel.style.maxHeight = `${expand.scrollHeight}px`;
    }
  }, 420);
}

function closePartner(accordion) {
  accordion.classList.remove('is-open');
  const button = accordion.querySelector('.partner-item');
  const panel = accordion.querySelector('.partner-panel');
  const expand = accordion.querySelector('.partner-expand');
  if (!button || !panel || !expand) return;

  button.setAttribute('aria-expanded', 'false');
  panel.style.maxHeight = '0px';
  expand.setAttribute('aria-hidden', 'true');
}

function scrollToPartnerList() {
  document.querySelector('#partnersIntro')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function updateThemeSwitch() {
  const dark = document.documentElement.dataset.theme === 'dark';
  const button = document.querySelector('#themeButton');
  if (!button) return;
  button.setAttribute('aria-pressed', String(dark));
  button.setAttribute('aria-label', dark ? 'Gunakan tema terang' : 'Gunakan tema gelap');
}

function initTheme() {
  const saved = localStorage.getItem('epen-theme');
  const systemDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
  const shouldUseDark = saved ? saved === 'dark' : systemDark;

  if (shouldUseDark) document.documentElement.dataset.theme = 'dark';
  else delete document.documentElement.dataset.theme;

  updateThemeSwitch();

  document.querySelector('#themeButton')?.addEventListener('click', () => {
    const dark = document.documentElement.dataset.theme === 'dark';
    if (dark) delete document.documentElement.dataset.theme;
    else document.documentElement.dataset.theme = 'dark';
    localStorage.setItem('epen-theme', dark ? 'light' : 'dark');
    updateThemeSwitch();
  });
}

function serverLinkIcon(type) {
  const common = 'viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"';
  const configured = safeImageUrl(SITE_CONFIG.site?.serverLinkIcons?.[type]);
  if (configured && type !== 'host') {
    return `<img class="server-link-icon" src="${escapeHtml(configured)}" alt="" aria-hidden="true">`;
  }
  const icons = {
    host: `<svg ${common}><circle cx="12" cy="12" r="8.5"/><path d="M3.8 9h16.4M3.8 15h16.4M12 3.5c2.1 2.3 3.2 5.1 3.2 8.5S14.1 18.2 12 20.5c-2.1-2.3-3.2-5.1-3.2-8.5S9.9 5.8 12 3.5Z"/></svg>`,
    whatsapp: `<svg ${common}><path d="M20 11.5a8 8 0 0 1-11.9 7L4 20l1.5-4A8 8 0 1 1 20 11.5Z"/><path d="M9.1 9.1c.2-.4.4-.5.7-.5h.5c.2 0 .4.1.5.4l.5 1.2c.1.2.1.4-.1.6l-.5.6c.5.9 1.2 1.6 2.1 2.1l.6-.5c.2-.2.4-.2.6-.1l1.2.5c.3.1.4.3.4.5v.5c0 .3-.1.5-.5.7-1 .4-2.4-.1-3.8-1.3-1.4-1.2-2.5-2.5-2.2-4.7Z"/></svg>`,
    discord: `<svg ${common}><path d="M8.2 8.2A8 8 0 0 1 12 7.3a8 8 0 0 1 3.8.9"/><path d="M6.5 17.1c1.6 1.1 3.4 1.7 5.5 1.7s3.9-.6 5.5-1.7c.6-2.2.7-4.7.1-7.1-1.2-.8-2.4-1.2-3.8-1.4l-.5 1.1a8 8 0 0 0-2.6 0l-.5-1.1c-1.4.2-2.6.6-3.8 1.4-.6 2.4-.5 4.9.1 7.1Z"/><circle cx="9.2" cy="13.7" r=".7" fill="currentColor" stroke="none"/><circle cx="14.8" cy="13.7" r=".7" fill="currentColor" stroke="none"/></svg>`
  };
  return icons[type] || icons.host;
}

function renderServerDirectory() {
  const list = document.querySelector('#serverList');
  const search = document.querySelector('#serverSearch');
  const count = document.querySelector('#serverCount');
  if (!list || !search) return;

  const servers = Array.isArray(SITE_CONFIG.site?.servers) ? SITE_CONFIG.site.servers : [];
  let filtered = servers.slice();

  const render = () => {
    const query = search.value.trim().toLowerCase();
    filtered = servers.filter(server => {
      const haystack = [server.name, server.description, server.status].map(value => String(value || '')).join(' ').toLowerCase();
      return !query || haystack.includes(query);
    });
    if (count) count.textContent = `${filtered.length} server`;
    if (!filtered.length) {
      list.innerHTML = `<div class="server-empty"><strong>Server tidak ditemukan</strong><span>Coba kata kunci lain.</span></div>`;
      return;
    }
    list.innerHTML = filtered.map((server, index) => {
      const logo = safeImageUrl(server.logo);
      const logoHtml = logo
        ? `<img src="${escapeHtml(logo)}" alt="" loading="lazy">`
        : `<span>${escapeHtml(String(server.name || 'G').slice(0, 1).toUpperCase())}</span>`;
      const status = String(server.status || 'Online');
      return `<button class="server-card" type="button" data-server-index="${servers.indexOf(server)}">
        <span class="server-card-logo">${logoHtml}</span>
        <span class="server-card-copy"><strong>${escapeHtml(server.name || 'Unnamed Server')}</strong><small>${escapeHtml(server.description || 'GTPS Community')}</small></span>
        <span class="server-card-meta"><i class="server-status-dot ${status.toLowerCase().includes('offline') ? 'is-offline' : ''}"></i>${escapeHtml(status)}</span>
        <span class="server-card-arrow" aria-hidden="true">›</span>
      </button>`;
    }).join('');
  };

  search.addEventListener('input', render);
  list.addEventListener('click', event => {
    const card = event.target.closest('[data-server-index]');
    if (!card) return;
    openServerModal(servers[Number(card.dataset.serverIndex)]);
  });

  render();
}

function openServerModal(server) {
  const modal = document.querySelector('#serverModal');
  const content = document.querySelector('#serverModalContent');
  if (!modal || !content || !server) return;
  const logo = safeImageUrl(server.logo);
  const logoHtml = logo
    ? `<img src="${escapeHtml(logo)}" alt="${escapeHtml(server.name || 'Server')} logo">`
    : `<span>${escapeHtml(String(server.name || 'G').slice(0, 1).toUpperCase())}</span>`;
  const links = [
    { key: 'whatsapp', label: 'WhatsApp', url: safeUrl(server.whatsapp), icon: serverLinkIcon('whatsapp') },
    { key: 'discord', label: 'Discord', url: safeUrl(server.discord), icon: serverLinkIcon('discord') },
    { key: 'host', label: 'Host Server', url: safeUrl(server.host), icon: serverLinkIcon('host') }
  ].filter(item => String(item.url || '').trim());

  content.innerHTML = `
    <div class="server-modal-logo">${logoHtml}</div>
    <span class="server-modal-status"><i class="server-status-dot ${String(server.status || '').toLowerCase().includes('offline') ? 'is-offline' : ''}"></i>${escapeHtml(server.status || 'Online')}</span>
    <h2 id="serverModalTitle">${escapeHtml(server.name || 'Server GTPS')}</h2>
    <p>${escapeHtml(server.description || 'GTPS Community')}</p>
    <div class="server-modal-links">
      ${links.map(item => `<a class="server-modal-link" href="${escapeHtml(item.url)}" target="_blank" rel="noopener noreferrer"><div class="server-modal-link-icon" aria-hidden="true">${item.icon}</div><span class="server-modal-link-label">${escapeHtml(item.label)}</span><b>›</b></a>`).join('')}
    </div>`;
  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
}

function closeServerModal() {
  const modal = document.querySelector('#serverModal');
  if (!modal) return;
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
}

function initServerDirectory() {
  if (!document.querySelector('#serverList')) return;
  renderServerDirectory();
  document.addEventListener('click', event => {
    if (event.target.closest('[data-server-close]')) closeServerModal();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeServerModal();
  });
}

function renderPromoteSection() {
  const section = document.querySelector('[data-promote-section]');
  const promote = SITE_CONFIG.site?.promote;
  if (!section || !promote?.enabled) {
    if (section) section.hidden = true;
    return;
  }

  const packages = Array.isArray(promote.packages) ? promote.packages : [];
  if (!packages.length) {
    section.hidden = true;
    return;
  }

  section.hidden = false;
  section.innerHTML = `
    <div class="promote-heading">
      <div>
        <span class="section-kicker">PROMOTE SERVER</span>
        <h2>${escapeHtml(promote.title || 'Promote GTPS')}</h2>
        <p>${escapeHtml(promote.description || '')}</p>
      </div>
    </div>
    <div class="promote-grid">
      ${packages.map((item, index) => `
        <article class="promote-card${item.popular ? ' is-popular' : ''}">
          ${item.popular ? '<span class="promote-badge">POPULAR</span>' : ''}
          <div class="promote-card-head">
            <span class="promote-plan">${escapeHtml(item.name || `Paket ${index + 1}`)}</span>
            ${item.description ? `<span class="promote-description">${escapeHtml(item.description)}</span>` : ''}
          </div>
          <div class="promote-price">${escapeHtml(item.price || '')}</div>
          <ul class="promote-features">
            ${(Array.isArray(item.features) ? item.features : []).map(feature => `<li><span class="promote-feature-icon" aria-hidden="true">+</span>${escapeHtml(feature)}</li>`).join('')}
          </ul>
          <a class="promote-cta" href="${escapeHtml(safeUrl(item.url) || '#')}" target="_blank" rel="noopener noreferrer">${escapeHtml(item.button || 'Pesan Sekarang')}</a>
        </article>
      `).join('')}
    </div>
  `;
}

function init() {
  renderGlobalFooter();
  try { applySiteMetadata(); } catch (error) { console.warn('Site metadata skipped:', error); }
  try { applySiteImages(); } catch (error) { console.warn('Site images skipped:', error); }
  try { initTheme(); } catch (error) { console.warn('Theme init skipped:', error); }

  if (applyPageAvailability()) return;

  renderActionButtons();
  renderPromoteSection();
  try { initServerDirectory(); } catch (error) { console.warn('Server directory skipped:', error); }
  if (document.querySelector('#serverList')) {
    const requestedServer = new URLSearchParams(location.search).get('server');
    if (requestedServer) {
      const requested = (SITE_CONFIG.site?.servers || []).find(item => String(item?.id || '') === requestedServer);
      if (requested) requestAnimationFrame(() => openServerModal(requested));
    }
  }
  try { renderHomeVideos(); } catch (error) { console.warn('Home video render skipped:', error); }

  document.addEventListener('click', (event) => {
    const button = event.target.closest('[data-video-refresh]');
    if (!button) return;
    button.classList.add('is-refreshing');
    const key = button.dataset.videoRefresh || '';
    if (key === 'home') {
      renderHomeVideos(true).finally(() => button.classList.remove('is-refreshing'));
    } else if (key.startsWith('partner-')) {
      const partnerId = key.slice('partner-'.length);
      const partner = partners.find(item => item.id === partnerId);
      const container = document.querySelector(`[data-partner-video="${CSS.escape(partnerId)}"]`);
      if (partner && container) {
        renderPartnerVideos(partner, true).finally(() => button.classList.remove('is-refreshing'));
      } else {
        button.classList.remove('is-refreshing');
      }
    } else {
      button.classList.remove('is-refreshing');
    }
  });

  const partnerList = document.querySelector('#partnerList');
  if (partnerList) {
    try {
      renderPartners();
      document.querySelector('#partnerTopButton')?.addEventListener('click', scrollToPartnerList);

      const requested = new URLSearchParams(location.search).get('partner');
      if (requested && partners.some(item => item.id === requested)) {
        requestAnimationFrame(() => showPartner(requested));
      }
    } catch (error) {
      console.error('Partner UI failed to render:', error);
      partnerList.innerHTML = partners.map(partner => `
        <article class="partner-accordion" data-partner="${escapeHtml(partner.id)}">
          <button class="partner-item" type="button">
            <span class="partner-item-logo">${escapeHtml(partner.short)}</span>
            <span class="partner-item-copy"><strong>${escapeHtml(partner.name)}</strong><small>${escapeHtml(partner.tagline)}</small></span>
            <span class="partner-item-toggle" aria-hidden="true"><span class="toggle-plus">+</span><span class="toggle-minus">−</span></span>
          </button>
        </article>`).join('');
    }
  }
}

async function bootstrap() {
  try {
    const response = await fetch('/api/config', { cache: 'no-store', credentials: 'same-origin' });
    if (response.ok) {
      const remote = await response.json();
      if (remote && typeof remote === 'object') setSiteConfig(remote);
    }
  } catch (error) {
    console.warn('Remote site config unavailable; using fallback config.', error);
  }
  init();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap, { once: true });
} else {
  bootstrap();
}
