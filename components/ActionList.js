import SmartLink from './SmartLink';
import { ActionIcon } from './Icons';
import { isUrlEnabled } from '@/lib/pages';
import { safeImageUrl, safeUrl } from '@/lib/safe-url';

// Tombol menu di beranda. Tombol ke halaman yang dimatikan otomatis disembunyikan.
export default function ActionList({ config }) {
  const configured = Array.isArray(config?.site?.actionButtons) ? config.site.actionButtons : [];
  const buttons = configured.filter(item => isUrlEnabled(config, item?.url));

  return (
    <section className="action-list page-width" id="actionList" aria-label="Menu utama">
      {buttons.map((button, index) => {
        const item = button && typeof button === 'object' ? button : {};
        const id = String(item.id || `action-${index + 1}`);
        const iconUrl = safeImageUrl(item.iconUrl);
        const iconName = String(item.icon || 'link').trim();

        return (
          <SmartLink
            key={id}
            className="action-card"
            href={safeUrl(item.url) || '#'}
            target={item.target === '_blank' ? '_blank' : '_self'}
            data-action-id={id}
          >
            <span className={`action-logo${iconUrl ? ' has-action-icon' : ' has-fallback-icon'}`} aria-hidden="true">
              {iconUrl ? <img src={iconUrl} alt="" loading="eager" /> : <ActionIcon name={iconName} />}
            </span>
            <span className="action-copy">
              <small>{String(item.category || 'Link')}</small>
              <strong>{String(item.title || `Button ${index + 1}`)}</strong>
            </span>
          </SmartLink>
        );
      })}
    </section>
  );
}
