import { preload } from 'react-dom';
import PageShell from '@/components/PageShell';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import SiteLogo from '@/components/SiteLogo';
import CoverArt from '@/components/CoverArt';
import ActionList from '@/components/ActionList';
import HomeVideos from '@/components/HomeVideos';
import Maintenance from '@/components/Maintenance';
import JsonLd from '@/components/JsonLd';
import homeJsonLd from '@/data/jsonld/home.json';
import { getConfig } from '@/lib/config';
import { buildPageMetadata } from '@/lib/metadata';
import { isPageEnabled } from '@/lib/pages';
import { cleanVideos, videoSettings } from '@/lib/sanitize';
import { loadFeed } from '@/lib/youtube-server';
import { safeImageUrl } from '@/lib/safe-url';
import { BANNER_WIDTH, optimizedLocalUrl } from '@/lib/image';

export async function generateMetadata() {
  return buildPageMetadata(await getConfig(), 'home', '/');
}

export default async function HomePage() {
  const config = await getConfig();
  const site = config.site || {};

  if (!isPageEnabled(config, 'home')) {
    return (
      <PageShell className="home-page" pageKey="home">
        <SiteHeader config={config} variant="home" />
        <Maintenance config={config} pageKey="home" />
        <SiteFooter config={config} />
      </PageShell>
    );
  }

  const bannerUrl = safeImageUrl(site.bannerUrl);
  if (bannerUrl) preload(optimizedLocalUrl(bannerUrl, BANNER_WIDTH), { as: 'image', fetchPriority: 'high' });

  const video = videoSettings(config);
  const channelId = String(config.epen?.youtubeChannelId || '');
  const initialVideos = await loadFeed(channelId, video.fetchLimit, cleanVideos(config.epen?.videos));
  const name = String(site.name || 'Epen GTPS');

  return (
    <PageShell className="home-page" pageKey="home">
      <SiteHeader config={config} variant="home" />

      <main>
        <section className="profile-hero page-width">
          <CoverArt bannerUrl={bannerUrl} />
          <div className="profile-avatar-wrap">
            <SiteLogo config={config} as="div" className="avatar profile-avatar" size={108} />
          </div>
          <div className="profile-info">
            <h1>{name}</h1>
          </div>
        </section>

        <section className="about-epen page-width" aria-labelledby="aboutEpenTitle">
          <div className="about-epen-main">
            <span className="section-kicker">Tentang Epen GTPS</span>
            <h2 id="aboutEpenTitle">Epen GTPS — Promoter Growtopia Private Server</h2>
            <p>
              <strong>Epen GTPS</strong> adalah channel YouTube dan platform yang berfokus pada <strong>promote GTPS</strong>.
              Tujuannya membantu pemilik <strong>Growtopia Private Server (GTPS)</strong> mempromosikan server mereka agar
              lebih mudah dikenal oleh pemain.
            </p>
            <p>
              Website ini juga memudahkan kamu untuk membeli promote, mengenal <strong>promoter GTPS</strong> melalui
              informasi dan tautan yang tersedia, serta menemukan <strong>server GTPS</strong> untuk dimainkan.
            </p>
          </div>
        </section>

        <ActionList config={config} />

        <HomeVideos
          channelId={channelId}
          initialVideos={initialVideos}
          initialLimit={video.initialLimit}
          fetchLimit={video.fetchLimit}
        />
      </main>

      <SiteFooter config={config} />
      <JsonLd data={homeJsonLd} />
    </PageShell>
  );
}
