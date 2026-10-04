import { safeUrl } from '@/lib/safe-url';

export default function PromoteSection({ config }) {
  const promote = config?.site?.promote;
  const packages = Array.isArray(promote?.packages) ? promote.packages : [];

  if (!promote?.enabled || !packages.length) {
    return <section className="promote-section page-width" id="promote" hidden />;
  }

  return (
    <section className="promote-section page-width" id="promote">
      <div className="promote-heading">
        <div>
          <h2>{promote.title || 'Promote GTPS'}</h2>
          <p>{promote.description || ''}</p>
        </div>
      </div>
      <div className="promote-grid">
        {packages.map((raw, index) => {
          const item = raw && typeof raw === 'object' ? raw : {};
          const features = Array.isArray(item.features) ? item.features : [];
          return (
            <article key={item.id ?? index} className={`promote-card${item.popular ? ' is-popular' : ''}`}>
              {item.popular ? <span className="promote-badge">Paling populer</span> : null}
              <div className="promote-card-head">
                <span className="promote-plan">{item.name || `Paket ${index + 1}`}</span>
                {item.description ? <span className="promote-description">{item.description}</span> : null}
              </div>
              <div className="promote-price">{item.price || ''}</div>
              <ul className="promote-features">
                {features.map((feature, i) => (
                  <li key={i}><span className="promote-feature-icon" aria-hidden="true">+</span>{String(feature)}</li>
                ))}
              </ul>
              <a
                className="promote-cta"
                href={safeUrl(item.url) || '#'}
                target="_blank"
                rel="noopener noreferrer"
              >
                {item.button || 'Pesan Sekarang'}
              </a>
            </article>
          );
        })}
      </div>
    </section>
  );
}
