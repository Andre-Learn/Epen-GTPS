import Link from 'next/link';
import SiteLogo from './SiteLogo';
import ThemeToggle from './ThemeToggle';

// variant="home": logo + nama situs. variant="sub": tombol Kembali + judul halaman.
export default function SiteHeader({ config, variant = 'sub', title = '', innerClass = '' }) {
  const name = String(config?.site?.name || 'Epen GTPS');

  if (variant === 'home') {
    return (
      <header className="site-header">
        <div className="header-inner page-width home-header-inner">
          <Link href="/" className="header-brand" aria-label={`Beranda ${name}`}>
            <SiteLogo config={config} className="avatar avatar-small" size={46} />
            <span className="header-brand-copy"><strong>{name}</strong><small>GTPS Promotion &amp; Directory</small></span>
          </Link>
          <ThemeToggle />
        </div>
      </header>
    );
  }

  return (
    <header className="site-header">
      <div className={`header-inner page-width${innerClass ? ` ${innerClass}` : ''}`}>
        <Link href="/" className="header-back" aria-label="Kembali ke halaman utama">Kembali</Link>
        <div className="header-page-title">{title}</div>
        <ThemeToggle />
      </div>
    </header>
  );
}
