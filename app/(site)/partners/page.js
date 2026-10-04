import PageShell from '@/components/PageShell';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import PartnerList from '@/components/PartnerList';
import Maintenance from '@/components/Maintenance';
import JsonLd from '@/components/JsonLd';
import partnersJsonLd from '@/data/jsonld/partners.json';
import { getConfig } from '@/lib/config';
import { buildPageMetadata } from '@/lib/metadata';
import { isPageEnabled } from '@/lib/pages';
import { sanitizePartners, videoSettings } from '@/lib/sanitize';
import { loadFeed } from '@/lib/youtube-server';

export async function generateMetadata() {
  return buildPageMetadata(await getConfig(), 'partners', '/partners');
}

export default async function PartnersPage() {
  const config = await getConfig();
  const header = <SiteHeader config={config} variant="sub" title="Partner" />;

  if (!isPageEnabled(config, 'partners')) {
    return (
      <PageShell className="partners-page" pageKey="partners">
        {header}
        <Maintenance config={config} pageKey="partners" />
        <SiteFooter config={config} />
      </PageShell>
    );
  }

  const video = videoSettings(config);
  // Video tiap partner diambil di server (di-cache 15 menit) dan ikut masuk HTML.
  const partners = await Promise.all(
    sanitizePartners(config.partners).map(async partner => ({
      ...partner,
      feed: await loadFeed(partner.youtubeChannelId, video.fetchLimit, partner.videos)
    }))
  );

  return (
    <PageShell className="partners-page" pageKey="partners">
      {header}
      <main className="page-width partner-page-main">
        <section className="partners-intro" id="partnersIntro">
          <span className="section-kicker">Epen GTPS partners</span>
          <h1>Partner &amp; Promoter GTPS Indonesia</h1>
          <p>
            Temukan <strong>promoter GTPS</strong>, creator, dan partner yang di rekomendasikan <strong>Epen GTPS</strong> untuk
            kebutuhan promosi Growtopia Private Server (GTPS).
          </p>
        </section>

        <PartnerList partners={partners} fetchLimit={video.fetchLimit} />
      </main>

      <SiteFooter config={config} />
      <JsonLd data={partnersJsonLd} />
    </PageShell>
  );
}
