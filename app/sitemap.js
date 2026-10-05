import { getConfig } from '@/lib/config';
import { isPageEnabled } from '@/lib/pages';
import { SITE_URL } from '@/lib/site';
import { getServers, serverPath } from '@/lib/servers';

export const revalidate = 300;

const PAGES = [
  { path: '/', key: 'home', changeFrequency: 'weekly', priority: 1.0 },
  { path: '/promote', key: 'promote', changeFrequency: 'weekly', priority: 0.9 },
  { path: '/servers', key: 'servers', changeFrequency: 'weekly', priority: 0.9 },
  { path: '/partners', key: 'partners', changeFrequency: 'weekly', priority: 0.8 }
];

// Halaman yang dimatikan dari admin otomatis keluar dari sitemap.
export default async function sitemap() {
  const config = await getConfig();
  const pages = PAGES
    .filter(page => isPageEnabled(config, page.key))
    .map(({ path, changeFrequency, priority }) => ({
      url: path === '/' ? `${SITE_URL}/` : `${SITE_URL}${path}`,
      changeFrequency,
      priority
    }));
  // Tiap server punya halaman sendiri.
  const servers = isPageEnabled(config, 'servers')
    ? getServers(config).map(server => ({
        url: `${SITE_URL}${serverPath(server.id)}`,
        changeFrequency: 'weekly',
        priority: 0.7
      }))
    : [];
  return [...pages, ...servers];
}
