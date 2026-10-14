import Link from 'next/link';
import PageShell from '@/components/PageShell';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import { getConfig } from '@/lib/config';
import { isPageEnabled } from '@/lib/pages';
// Root not-found berada di luar (site)/layout.js, jadi CSS situs diimpor di sini.
import './globals.css';
import './design.css';

export const metadata = {
  title: { absolute: '404 | Epen GTPS' },
  robots: { index: false, follow: false }
};

export default async function NotFound() {
  const config = await getConfig();
  const showServers = isPageEnabled(config, 'servers');

  return (
    <PageShell className="not-found-page is-maintenance-page" pageKey="not-found">
      <SiteHeader config={config} variant="sub" title="404" />
      <main>
        <section className="maintenance-page page-width" aria-labelledby="notFoundTitle">
          <div className="maintenance-content">
            <span className="section-kicker">Error 404</span>
            <h1 id="notFoundTitle">Halaman tidak ditemukan</h1>
            <p>Link ini salah atau halamannya sudah dihapus.</p>
            <Link className="maintenance-button" href="/">Kembali ke Home</Link>
            {showServers ? <p><Link href="/servers">Lihat direktori server</Link></p> : null}
          </div>
        </section>
      </main>
      <SiteFooter config={config} />
    </PageShell>
  );
}
