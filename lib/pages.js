import { SITE_URL } from './site';

const PATH_TO_KEY = {
  '/': 'home',
  '/index.html': 'home',
  '/promote': 'promote',
  '/promote.html': 'promote',
  '/partners': 'partners',
  '/partners.html': 'partners',
  '/servers': 'servers',
  '/servers.html': 'servers'
};

export function pageKeyFromUrl(value) {
  const raw = String(value ?? '').trim();
  if (!raw || raw.startsWith('#')) return '';
  try {
    const url = new URL(raw, SITE_URL);
    if (url.origin !== new URL(SITE_URL).origin) return '';
    const path = url.pathname.replace(/\/+$/, '') || '/';
    return PATH_TO_KEY[path] || '';
  } catch {
    return '';
  }
}

export function isPageEnabled(config, key) {
  if (!key) return true;
  return config?.pages?.[key]?.enabled !== false;
}

export function isUrlEnabled(config, value) {
  const key = pageKeyFromUrl(value);
  return !key || isPageEnabled(config, key);
}

export function getMaintenance(config, key) {
  const page = config?.pages?.[key] || {};
  return {
    title: String(page.maintenanceTitle || 'Segera Tersedia'),
    description: String(page.maintenanceDescription || 'Halaman ini sedang dalam tahap persiapan. Silakan kembali lagi nanti.')
  };
}
