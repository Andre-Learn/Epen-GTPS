import Image from 'next/image';
import Link from 'next/link';
import SmartLink from './SmartLink';
import { isUrlEnabled } from '@/lib/pages';
import { safeImageUrl, safeUrl } from '@/lib/safe-url';
import { isLocalImage } from '@/lib/image';

// Ikon footer memakai salinan yang sudah di-crop supaya ukurannya seragam.
const FOOTER_ICONS = {
  home: '/assets/icons/footer/home.png',
  promote: '/assets/icons/footer/promote.png',
  partners: '/assets/icons/footer/partners.png',
  servers: '/assets/icons/footer/servers.png',
  discord: '/assets/icons/footer/discord.png',
  whatsapp: '/assets/icons/footer/whatsapp.png'
};

export default function SiteFooter({ config }) {
  const site = config?.site || {};
  const name = String(site.name || 'Epen GTPS');
  const logoUrl = safeImageUrl(site.logoUrl);
  const description = String(site.footerDescription || 'Community, creator, dan partner network.');
  const nav = Array.isArray(site.footerNav) ? site.footerNav : [];

  const links = nav
    .filter(item => isUrlEnabled(config, item?.url))
    .map((item, index) => {
      const id = String(item?.id || `footer-${index + 1}`);
      return {
        id,
        label: String(item?.label || 'Link'),
        url: safeUrl(item?.url) || '#',
        target: item?.target === '_blank' ? '_blank' : '_self'
      };
    });

  return (
    <footer className="footer">
      <div className="global-footer-inner page-width">
        <div className="global-footer-top">
          <Link className="global-footer-brand" href="/" aria-label={`${name} home`}>
            {logoUrl && isLocalImage(logoUrl)
              ? <Image className="global-footer-logo" src={logoUrl} alt={`${name} logo`} width={43} height={43} sizes="43px" />
              : logoUrl
                ? <img className="global-footer-logo" src={logoUrl} alt={`${name} logo`} loading="lazy" />
                : <span className="global-footer-logo-fallback">E</span>}
            <span>{name}</span>
          </Link>
          <p className="global-footer-description">{description}</p>
        </div>
        <nav className="global-footer-nav" aria-label="Footer navigation">
          {links.map(link => (
            <SmartLink
              key={link.id}
              className={`global-footer-link footer-link-${link.id}`}
              href={link.url}
              target={link.target}
            >
              <img
                className="global-footer-icon"
                src={FOOTER_ICONS[link.id] || FOOTER_ICONS.home}
                alt=""
                aria-hidden="true"
                loading="lazy"
                decoding="async"
              />
              <span>{link.label}</span>
            </SmartLink>
          ))}
        </nav>
        <div className="global-footer-divider" />
        <div className="global-footer-bottom">
          <span>© {new Date().getFullYear()} {name}</span>
          <span>Made for the GTPS community.</span>
        </div>
      </div>
    </footer>
  );
}
