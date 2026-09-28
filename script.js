/* =========================
   Epen GTPS — site data
   =========================
   Ganti data di bawah ini untuk memasukkan logo, banner, link, dan video asli.
*/

const SITE_CONFIG = window.EPEN_CONFIG || { partners: [], epen: { youtubeChannelId: '' }, video: { initialLimit: 4, pageSize: 4 } };
const partners = SITE_CONFIG.partners || [];
const epenVideos = SITE_CONFIG.epen?.videos || [];

const VIDEO_INITIAL_LIMIT = SITE_CONFIG.video?.initialLimit || 4;
const VIDEO_PAGE_SIZE = SITE_CONFIG.video?.pageSize || 4;

const escapeHtml = value => String(value ?? '').replace(/[&<>'"]/g, c => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#039;', '"': '&quot;'
}[c]));

function iconSvg(type) {
  const common = 'viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"';
  if (type === 'whatsapp') return `<svg ${common}><path d="M20 11.5a8 8 0 0 1-11.8 7L4 20l1.5-4.1A8 8 0 1 1 20 11.5Z"/><path d="M9 8.5c.3 1.9 1.5 3.4 3.2 4.4l1.2-.9c.2-.2.5-.2.8-.1l1.5.7c.3.1.4.4.3.7-.2.8-.9 1.3-1.7 1.3-3.6-.2-6.6-3.2-6.8-6.8 0-.8.5-1.5 1.3-1.7.3-.1.6 0 .7.3l.7 1.5c.1.3.1.6-.1.8L9 8.5Z"/></svg>`;
  if (type === 'discord') return `<svg ${common}><path d="M7.5 7.2A15 15 0 0 1 12 6a15 15 0 0 1 4.5 1.2 13.5 13.5 0 0 1 2.3 9.1 15 15 0 0 1-4.2 2.1l-.9-1.4"/><path d="M7.5 7.2a13.5 13.5 0 0 0-2.3 9.1 15 15 0 0 0 4.2 2.1l.9-1.4"/><circle cx="9.2" cy="12.4" r="1"/><circle cx="14.8" cy="12.4" r="1"/></svg>`;
  if (type === 'youtube') return `<svg ${common}><rect x="3" y="6" width="18" height="12" rx="3"/><path d="m10 9 5 3-5 3V9Z"/></svg>`;
  return `<svg ${common}><path d="M5 4h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z"/><path d="M8 8h8M8 12h5M8 16h7"/></svg>`;
}

function youtubeThumb(videoId) {
  return `https://i.ytimg.com/vi/${encodeURIComponent(videoId)}/hqdefault.jpg`;
}

function youtubePlayIcon() {
  return `<span class="youtube-play" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M9 7.5v9l8-4.5-8-4.5Z"/></svg></span>`;
}

function videoCard(video, index = 0, scope = 'home') {
  const id = String(video.videoId || '');
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

async function fetchYoutubeVideos(channelId, limit = 24) {
  if (!channelId) return [];
  try {
    const response = await fetch(`/api/youtube?channelId=${encodeURIComponent(channelId)}&limit=${encodeURIComponent(limit)}`, { cache: 'no-store' });
    if (!response.ok) throw new Error(`YouTube API ${response.status}`);
    const data = await response.json();
    return Array.isArray(data.videos) ? data.videos : [];
  } catch (error) {
    console.warn('YouTube feed unavailable:', error);
    return [];
  }
}

async function renderHomeVideos() {
  const grid = document.querySelector('#homeVideoGrid');
  if (!grid) return;
  const channelId = SITE_CONFIG.epen?.youtubeChannelId || '';
  if (channelId) {
    const videos = await fetchYoutubeVideos(channelId, SITE_CONFIG.video?.fetchLimit || 24);
    if (videos.length) { renderVideoCollection(grid, videos, 'home'); return; }
  }
  renderVideoCollection(grid, epenVideos, 'home');
}

async function renderPartnerVideos(partner) {
  const container = document.querySelector(`[data-partner-video="${CSS.escape(partner.id)}"]`);
  if (!container) return;
  const channelId = partner.youtubeChannelId || '';
  if (channelId) {
    const videos = await fetchYoutubeVideos(channelId, SITE_CONFIG.video?.fetchLimit || 24);
    if (videos.length) { renderVideoCollection(container, videos, `partner-${partner.id}`); return; }
  }
  renderVideoCollection(container, partner.videos || [], `partner-${partner.id}`);
}

function setLinkButton(type, url) {
  if (!url || url === '#') return '';
  const labels = { whatsapp: 'WhatsApp', discord: 'Discord', youtube: 'YouTube' };
  return `<a class="detail-link" href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">${iconSvg(type)}<span>${labels[type] || 'Link'}</span></a>`;
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

  const logo = partner.logo
    ? `<img src="${escapeHtml(partner.logo)}" alt="Logo ${escapeHtml(partner.name)}" loading="lazy">`
    : `<span>${escapeHtml(partner.short)}</span>`;

  const banner = partner.banner
    ? `<img src="${escapeHtml(partner.banner)}" alt="Banner ${escapeHtml(partner.name)}" loading="lazy"><div class="partner-expand-banner-overlay"></div>`
    : `<div class="partner-expand-banner-fallback"><span>${escapeHtml(partner.name)}</span></div>`;

  return `
    <div class="partner-expand" aria-hidden="true">
      <div class="partner-expand-banner">${banner}</div>
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
            <button class="section-refresh" type="button" data-video-refresh="partner-${escapeHtml(partner.id)}" aria-label="Muat ulang video partner">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 11a8 8 0 1 0 1 4"/><path d="M20 5v6h-6"/></svg>
            </button>
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
        <span class="partner-item-logo">${partner.logo ? `<img src="${escapeHtml(partner.logo)}" alt="" loading="lazy">` : escapeHtml(partner.short)}</span>
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

function init() {
  try { initTheme(); } catch (error) { console.warn('Theme init skipped:', error); }
  try { renderHomeVideos(); } catch (error) { console.warn('Home video render skipped:', error); }

  document.querySelectorAll('[data-video-refresh]').forEach(button => {
    button.addEventListener('click', () => {
      button.classList.add('is-refreshing');
      setTimeout(() => button.classList.remove('is-refreshing'), 500);
      const key = button.dataset.videoRefresh || '';
      if (key === 'home') renderHomeVideos();
      else if (key.startsWith('partner-')) {
        const partnerId = key.slice('partner-'.length);
        const partner = partners.find(item => item.id === partnerId);
        const container = document.querySelector(`[data-partner-video="${CSS.escape(partnerId)}"]`);
        if (partner && container) renderPartnerVideos(partner);
      }
    });
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

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init, { once: true });
} else {
  init();
}
