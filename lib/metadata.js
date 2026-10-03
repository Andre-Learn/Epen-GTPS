import { DEFAULT_NAME, SITE_URL, TWITTER_HANDLE } from './site';
import { safeImageUrl } from './safe-url';
import { getMaintenance, isPageEnabled } from './pages';

export function buildPageMetadata(config, key, path) {
  const site = config?.site || {};
  const name = String(site.name || DEFAULT_NAME).trim();
  const seo = site.pageSEO?.[key] || {};
  const canonical = path === '/' ? `${SITE_URL}/` : `${SITE_URL}${path}`;

  // Halaman yang dimatikan dari admin → "Segera Tersedia" + noindex.
  if (!isPageEnabled(config, key)) {
    const { title } = getMaintenance(config, key);
    return {
      title: { absolute: `${title} — ${name}` },
      robots: { index: false, follow: false },
      alternates: { canonical }
    };
  }

  const description = String(seo.description || site.description || '').trim();
  const title = String(seo.title || name).trim();
  const ogTitle = String(seo.ogTitle || title).trim();
  const ogDescription = String(seo.ogDescription || description).trim();
  const keywords = String(seo.keywords || '').trim();
  const bannerUrl = safeImageUrl(site.bannerUrl);
  const faviconUrl = safeImageUrl(site.faviconUrl || site.logoUrl) || '/assets/favicon-48.png';
  const ogImage = safeImageUrl(site.ogImageUrl || site.bannerUrl || site.logoUrl);

  const image = ogImage
    ? [{
        url: ogImage,
        alt: name,
        ...(ogImage === bannerUrl ? { width: 1600, height: 500 } : {})
      }]
    : undefined;

  return {
    title: { absolute: title },
    description,
    ...(keywords ? { keywords } : {}),
    applicationName: name,
    authors: [{ name }],
    alternates: { canonical },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1
      }
    },
    icons: {
      icon: [
        { url: faviconUrl, sizes: '48x48', type: 'image/png' },
        { url: '/assets/favicon-96.png', sizes: '96x96', type: 'image/png' }
      ],
      apple: [{ url: '/assets/apple-touch-icon.png', sizes: '180x180' }]
    },
    openGraph: {
      type: 'website',
      siteName: name,
      locale: 'id_ID',
      url: canonical,
      title: ogTitle,
      description: ogDescription,
      ...(image ? { images: image } : {})
    },
    twitter: {
      card: ogImage ? 'summary_large_image' : 'summary',
      site: TWITTER_HANDLE,
      creator: TWITTER_HANDLE,
      title: ogTitle,
      description: ogDescription,
      ...(ogImage ? { images: [ogImage] } : {})
    }
  };
}
