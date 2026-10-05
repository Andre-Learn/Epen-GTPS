import Link from 'next/link';
import { notFound } from 'next/navigation';
import PageShell from '@/components/PageShell';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import Maintenance from '@/components/Maintenance';
import JsonLd from '@/components/JsonLd';
import ShareButtons from '@/components/ShareButtons';
import { ServerLinkIcon } from '@/components/Icons';
import { getConfig } from '@/lib/config';
import { buildPageMetadata } from '@/lib/metadata';
import { isPageEnabled } from '@/lib/pages';
import { SITE_URL } from '@/lib/site';
import { safeImageUrl } from '@/lib/safe-url';
import { findServer, getServers, isServerOffline, serverPath, serverSeo } from '@/lib/servers';

export async function generateStaticParams() {
  const config = await getConfig();
  return getServers(config).map(server => ({ id: server.id }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const config = await getConfig();
  const server = findServer(config, id);
  if (!server) return { title: 'Server tidak ditemukan — Epen GTPS', robots: { index: false, follow: false } };

  const seoConfig = {
    ...config,
    site: { ...config?.site, pageSEO: { ...config?.site?.pageSEO, servers: serverSeo(server) } }
  };
  const metadata = buildPageMetadata(seoConfig, 'servers', serverPath(server.id));
  // Gambar OG dibuat otomatis per server (opengraph-image.js), jadi gambar bawaan situs dilepas.
  if (metadata.openGraph) delete metadata.openGraph.images;
  if (metadata.twitter) {
    delete metadata.twitter.images;
    metadata.twitter.card = 'summary_large_image';
  }
  return metadata;
}

export default async function ServerDetailPage({ params }) {
  const { id } = await params;
  const config = await getConfig();
  const header = <SiteHeader config={config} variant="sub" title="Server GTPS" />;

  if (!isPageEnabled(config, 'servers')) {
    return (
      <PageShell className="servers-page" pageKey="servers">
        {header}
        <Maintenance config={config} pageKey="servers" />
        <SiteFooter config={config} />
      </PageShell>
    );
  }

  const server = findServer(config, id);
  if (!server) notFound();

  const seo = serverSeo(server);
  const offline = isServerOffline(server);
  const icons = config.site?.serverLinkIcons || {};
  const linkIcons = { whatsapp: safeImageUrl(icons.whatsapp), discord: safeImageUrl(icons.discord) };
  const links = [
    { key: 'whatsapp', label: 'WhatsApp', url: server.whatsapp },
    { key: 'discord', label: 'Discord', url: server.discord },
    { key: 'host', label: 'Host Server', url: server.host }
  ].filter(item => item.url);
  const others = getServers(config).filter(item => item.id !== server.id);
  const url = `${SITE_URL}${serverPath(server.id)}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${url}#webpage`,
        url,
        name: seo.title,
        description: seo.description,
        inLanguage: 'id-ID',
        isPartOf: { '@id': `${SITE_URL}/#website` },
        breadcrumb: { '@id': `${url}#breadcrumb` },
        about: { '@type': 'Thing', name: server.name, description: server.description },
        ...(server.logo ? { primaryImageOfPage: { '@type': 'ImageObject', url: server.logo } } : {})
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${url}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
          { '@type': 'ListItem', position: 2, name: 'Server GTPS', item: `${SITE_URL}/servers` },
          { '@type': 'ListItem', position: 3, name: server.name, item: url }
        ]
      }
    ]
  };

  return (
    <PageShell className="servers-page server-detail-page" pageKey="servers">
      {header}
      <main className="page-width server-page-main">
        <nav className="server-breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link><span aria-hidden="true">›</span>
          <Link href="/servers">Server GTPS</Link><span aria-hidden="true">›</span>
          <span aria-current="page">{server.name}</span>
        </nav>

        <article className="server-detail">
          <div className="server-detail-head">
            <div className="server-detail-logo">
              {server.logo
                ? <img src={server.logo} alt={`Logo ${server.name}`} />
                : <span>{server.name.slice(0, 1).toUpperCase()}</span>}
            </div>
            <div className="server-detail-title">
              <span className={`server-status-badge${offline ? ' is-offline' : ''}`}>
                <i className={`server-status-dot${offline ? ' is-offline' : ''}`} />
                {offline ? 'Offline' : 'Online'}
              </span>
              <h1>{server.name} <span>GTPS Terbaru 2026</span></h1>
              <p>{server.description}</p>
            </div>
          </div>

          <div className="server-modal-links">
            {links.map(item => (
              <a key={item.key} className="server-modal-link" href={item.url} target="_blank" rel="noopener noreferrer">
                <div className="server-modal-link-icon" aria-hidden="true">
                  <ServerLinkIcon type={item.key} src={linkIcons[item.key]} />
                </div>
                <span className="server-modal-link-label">{item.label}</span>
                <b>›</b>
              </a>
            ))}
          </div>

          <ShareButtons path={serverPath(server.id)} title={seo.ogTitle} text={seo.ogDescription} />

          <section className="server-seo" aria-label={`Tentang ${server.name}`}>
            <h2>Tentang {server.name}</h2>
            <p>{seo.about}</p>
          </section>
        </article>

        {others.length ? (
          <section className="server-related" aria-label="Server GTPS lainnya">
            <h2>Server GTPS lainnya</h2>
            <div className="server-related-list">
              {others.map(item => (
                <Link key={item.id} href={serverPath(item.id)} className="server-related-item">
                  <span className="server-card-logo">
                    {item.logo ? <img src={item.logo} alt="" loading="lazy" /> : <span>{item.name.slice(0, 1).toUpperCase()}</span>}
                  </span>
                  <strong>{item.name}</strong>
                </Link>
              ))}
            </div>
            <Link href="/servers" className="server-modal-page-link">Lihat semua server GTPS ›</Link>
          </section>
        ) : null}
      </main>

      <SiteFooter config={config} />
      <JsonLd data={jsonLd} />
    </PageShell>
  );
}
