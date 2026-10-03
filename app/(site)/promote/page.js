import Link from 'next/link';
import PageShell from '@/components/PageShell';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import PromoteSection from '@/components/PromoteSection';
import Maintenance from '@/components/Maintenance';
import JsonLd from '@/components/JsonLd';
import promoteJsonLd from '@/data/jsonld/promote.json';
import { getConfig } from '@/lib/config';
import { buildPageMetadata } from '@/lib/metadata';
import { isPageEnabled } from '@/lib/pages';

export async function generateMetadata() {
  return buildPageMetadata(await getConfig(), 'promote', '/promote');
}

const STEPS = [
  { title: 'Pilih Paket', text: 'Tentukan paket promote yang sesuai dengan kebutuhan server kamu.' },
  { title: 'Kirim Data Server', text: 'Siapkan nama, logo, informasi server, dan materi yang diperlukan untuk promosi.' },
  { title: 'Lakukan Pembayaran', text: 'Hubungi Epen GTPS melalui tombol pemesanan pada paket yang kamu pilih.' },
  { title: 'Promosi Diproses', text: 'Server diproses sesuai antrean atau prioritas yang didapat dari paket.' }
];

export default async function PromotePage() {
  const config = await getConfig();
  const header = <SiteHeader config={config} variant="sub" title="Promote" innerClass="partner-header-inner" />;

  if (!isPageEnabled(config, 'promote')) {
    return (
      <PageShell className="home-page promote-page" pageKey="promote">
        {header}
        <Maintenance config={config} pageKey="promote" />
        <SiteFooter config={config} />
      </PageShell>
    );
  }

  return (
    <PageShell className="home-page promote-page" pageKey="promote">
      {header}
      <main>
        <section className="promote-hero page-width" aria-labelledby="promoteTitle">
          <span className="section-kicker">Price Promote</span>
          <h1 id="promoteTitle">Promote GTPS</h1>
          <p className="promote-hero-lead"><strong>Promosikan GTPS kamu bersama Epen GTPS.</strong></p>
          <p>
            Epen GTPS membantu pemilik <strong>Growtopia Private Server</strong> memperkenalkan server mereka kepada
            pemain melalui konten youtube dan jaringan promosi yang tersedia.
          </p>
        </section>

        <PromoteSection config={config} />

        <section className="promote-process page-width" aria-labelledby="processTitle">
          <div className="section-title-row promote-section-heading">
            <div>
              <span className="section-kicker">CARA KERJA</span>
              <h2 id="processTitle">Cara Promote di Epen GTPS</h2>
              <p>Pilih paket, kirim informasi server, lalu biarkan proses promote berjalan sesuai paket yang dipilih.</p>
            </div>
          </div>
          <div className="process-grid">
            {STEPS.map((step, index) => (
              <article key={step.title} className="process-card">
                <span className="process-number">{String(index + 1).padStart(2, '0')}</span>
                <div><h3>{step.title}</h3><p>{step.text}</p></div>
              </article>
            ))}
          </div>
        </section>

        <section className="seo-faq page-width" aria-labelledby="faqTitle">
          <div className="section-title-row seo-section-heading">
            <div><span className="section-kicker">FAQ</span><h2 id="faqTitle">Pertanyaan tentang Promote GTPS</h2></div>
          </div>
          <div className="faq-list">
            <details>
              <summary>Apa itu promote GTPS?</summary>
              <p>Layanan promosi untuk membantu server Growtopia Private Server mendapatkan perhatian dari pemain Growtopia dan komunitas melalui promosi youtube Epen GTPS.</p>
            </details>
            <details>
              <summary>Apakah server akan masuk ke website Epen GTPS?</summary>
              <p>Ya. Semua paket promote yang tersedia mencakup pencantuman server pada website Epen GTPS sebagai bagian dari benefit promote.</p>
            </details>
            <details>
              <summary>Bagaimana cara membeli promote GTPS?</summary>
              <p>Pilih paket yang tersedia, lalu tekan tombol pemesanan pada paket tersebut untuk menghubungi Epen GTPS.</p>
            </details>
            <details>
              <summary>Apa perbedaan Normal, Skip, Mega Skip, dan Skip All?</summary>
              <p>Perbedaannya berada pada antrean dan tingkat prioritas proses. Detail benefit setiap paket dapat dilihat pada kartu paket di atas.</p>
            </details>
            <details>
              <summary>Informasi apa yang perlu disiapkan?</summary>
              <p>Siapkan nama server, logo atau banner, informasi server, dan link komunitas yang diperlukan untuk promosi.</p>
            </details>
            <details>
              <summary>Di mana mencari server GTPS?</summary>
              <p>Kunjungi <Link href="/servers">Daftar Server GTPS</Link> untuk melihat server yang tersedia di direktori Epen GTPS.</p>
            </details>
          </div>
        </section>

        <section className="promote-final-cta page-width" aria-labelledby="finalPromoteTitle">
          <div className="promote-final-copy">
            <span className="section-kicker">SIAP PROMOSI?</span>
            <h2 id="finalPromoteTitle">Bawa server kamu lebih dikenal pemain Growtopia.</h2>
            <p>Pilih paket promote yang sesuai, siapkan data server, lalu hubungi Epen GTPS untuk memulai proses.</p>
          </div>
          <a className="promote-final-cta-button" href="#promote">Lihat Paket Promote</a>
        </section>
      </main>

      <SiteFooter config={config} />
      <JsonLd data={promoteJsonLd} />
    </PageShell>
  );
}
