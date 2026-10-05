import PageShell from '@/components/PageShell';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import ServerDirectory from '@/components/ServerDirectory';
import Maintenance from '@/components/Maintenance';
import JsonLd from '@/components/JsonLd';
import serversJsonLd from '@/data/jsonld/servers.json';
import { getConfig } from '@/lib/config';
import { buildPageMetadata } from '@/lib/metadata';
import { isPageEnabled } from '@/lib/pages';
import { sanitizeServers } from '@/lib/sanitize';
import { safeImageUrl } from '@/lib/safe-url';
import { SERVERS_FAQ, mergeServersSeo } from '@/lib/server-seo';
import { SITE_URL } from '@/lib/site';

export async function generateMetadata() {
  const config = await getConfig();
  const seoConfig = {
    ...config,
    site: {
      ...config?.site,
      pageSEO: { ...config?.site?.pageSEO, servers: mergeServersSeo(config?.site?.pageSEO?.servers) }
    }
  };
  return buildPageMetadata(seoConfig, 'servers', '/servers');
}

export default async function ServersPage() {
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

  const icons = config.site?.serverLinkIcons || {};
  const linkIcons = { whatsapp: safeImageUrl(icons.whatsapp), discord: safeImageUrl(icons.discord) };

  const servers = sanitizeServers(config.site?.servers);
  const extraJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ItemList',
        name: 'Daftar Server GTPS Terbaru 2026',
        numberOfItems: servers.length,
        itemListElement: servers.map((server, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: server.name,
          url: `${SITE_URL}/servers?server=${encodeURIComponent(server.id)}`
        }))
      },
      {
        '@type': 'FAQPage',
        mainEntity: SERVERS_FAQ.map(item => ({
          '@type': 'Question',
          name: item.q,
          acceptedAnswer: { '@type': 'Answer', text: item.a }
        }))
      }
    ]
  };

  return (
    <PageShell className="servers-page" pageKey="servers">
      {header}
      <main className="page-width server-page-main">
        <section className="server-intro">
          <span className="section-kicker">GTPS directory</span>
          <h1>Server GTPS Terbaru 2026 <span>Indonesia.</span></h1>
          <p>
            Temukan <strong>server GTPS terbaru 2026</strong> atau Growtopia Private Server yang ada pada website Epen GTPS. Cari
            berdasarkan nama, lalu lihat status online/offline, deskripsi, dan tautan komunitasnya.
          </p>
        </section>

        <ServerDirectory servers={servers} linkIcons={linkIcons} />

        <section className="server-seo" aria-label="Tentang GTPS terbaru 2026">
          <h2>Daftar GTPS Terbaru 2026</h2>
          <p>
            Epen GTPS menyediakan daftar <strong>GTPS terbaru 2026</strong> di Indonesia. Setiap server dilengkapi status
            online/offline, deskripsi singkat, serta tautan Discord, WhatsApp, dan panduan cara join sehingga kamu mudah
            menemukan <strong>private server Growtopia</strong> yang sesuai.
          </p>
          <h2>Pertanyaan umum seputar GTPS</h2>
          <div className="faq-list">
            {SERVERS_FAQ.map(item => (
              <details key={item.q}>
                <summary>{item.q}</summary>
                <p>{item.a}</p>
              </details>
            ))}
          </div>
        </section>
      </main>

      <SiteFooter config={config} />
      <JsonLd data={serversJsonLd} />
      <JsonLd data={extraJsonLd} />
    </PageShell>
  );
}
