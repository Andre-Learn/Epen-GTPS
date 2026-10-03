import { getConfig } from '@/lib/config';
import { isPageEnabled } from '@/lib/pages';
import { SITE_URL } from '@/lib/site';

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
  return PAGES
    .filter(page => isPageEnabled(config, page.key))
    .map(({ path, changeFrequency, priority }) => ({
      url: path === '/' ? `${SITE_URL}/` : `${SITE_URL}${path}`,
      changeFrequency,
      priority
    }));
}
