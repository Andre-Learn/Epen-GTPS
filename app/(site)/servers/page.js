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

export async function generateMetadata() {
  return buildPageMetadata(await getConfig(), 'servers', '/servers');
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

  return (
    <PageShell className="servers-page" pageKey="servers">
      {header}
      <main className="page-width server-page-main">
        <section className="server-intro">
          <span className="section-kicker">GTPS DIRECTORY</span>
          <h1>List Server <span>GTPS.</span></h1>
          <p>
            Temukan <strong>server GTPS</strong> atau Growtopia Private Server yang ada pada website Epen GTPS. Cari berdasarkan
            nama, lalu lihat status, deskripsi, dan tautan komunitasnya.
          </p>
        </section>

        <ServerDirectory servers={sanitizeServers(config.site?.servers)} linkIcons={linkIcons} />
      </main>

      <SiteFooter config={config} />
      <JsonLd data={serversJsonLd} />
    </PageShell>
  );
}
