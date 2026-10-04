import Link from 'next/link';
import { getMaintenance, isPageEnabled } from '@/lib/pages';

// Tampilan "Segera Tersedia" untuk halaman yang dimatikan lewat admin.
export default function Maintenance({ config, pageKey }) {
  const { title, description } = getMaintenance(config, pageKey);
  const showHomeLink = pageKey !== 'home' && isPageEnabled(config, 'home');

  return (
    <main>
      <section className="maintenance-page page-width" aria-labelledby="maintenanceTitle">
        <div className="maintenance-content">
          <h1 id="maintenanceTitle">{title}</h1>
          <p>{description}</p>
          {showHomeLink ? <Link className="maintenance-button" href="/">Kembali ke Home</Link> : null}
        </div>
      </section>
    </main>
  );
}
