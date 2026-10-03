'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { ServerLinkIcon } from './Icons';

const isOffline = status => String(status || '').toLowerCase().includes('offline');

function ServerLogo({ server }) {
  return server.logo
    ? <img src={server.logo} alt="" loading="lazy" />
    : <span>{String(server.name || 'G').slice(0, 1).toUpperCase()}</span>;
}

export default function ServerDirectory({ servers, linkIcons }) {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(null); // server yang sedang terbuka
  const [shown, setShown] = useState(null); // isi modal tetap ada selama animasi tutup

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return servers;
    return servers.filter(server =>
      [server.name, server.description, server.status].join(' ').toLowerCase().includes(q)
    );
  }, [servers, query]);

  const openServer = useCallback(server => {
    setShown(server);
    setSelected(server);
  }, []);
  const close = useCallback(() => setSelected(null), []);

  // Deep link: /servers?server=<id>
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get('server');
    if (!id) return undefined;
    const requested = servers.find(server => server.id === id);
    if (!requested) return undefined;
    const frame = requestAnimationFrame(() => openServer(requested));
    return () => cancelAnimationFrame(frame);
  }, [servers, openServer]);

  // Kunci scroll halaman + tutup dengan Escape saat modal terbuka.
  useEffect(() => {
    if (!selected) return undefined;
    document.body.classList.add('modal-open');
    const onKey = event => { if (event.key === 'Escape') close(); };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.classList.remove('modal-open');
      document.removeEventListener('keydown', onKey);
    };
  }, [selected, close]);

  const links = shown
    ? [
        { key: 'whatsapp', label: 'WhatsApp', url: shown.whatsapp },
        { key: 'discord', label: 'Discord', url: shown.discord },
        { key: 'host', label: 'Host Server', url: shown.host }
      ].filter(item => item.url)
    : [];

  return (
    <>
      <section className="server-search" aria-label="Cari server GTPS">
        <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></svg>
        <input
          id="serverSearch"
          type="search"
          autoComplete="off"
          placeholder="Cari server GTPS..."
          aria-label="Cari server GTPS"
          value={query}
          onChange={event => setQuery(event.target.value)}
        />
        <span id="serverCount" className="server-count">{filtered.length} server</span>
      </section>

      <section className="server-list" id="serverList" aria-label="Daftar server GTPS">
        {filtered.length ? (
          filtered.map((server, index) => (
            <button key={server.id || index} className="server-card" type="button" onClick={() => openServer(server)}>
              <span className="server-card-logo"><ServerLogo server={server} /></span>
              <span className="server-card-copy"><strong>{server.name}</strong><small>{server.description}</small></span>
              <span className="server-card-meta">
                <i className={`server-status-dot${isOffline(server.status) ? ' is-offline' : ''}`} />
                {server.status}
              </span>
              <span className="server-card-arrow" aria-hidden="true">›</span>
            </button>
          ))
        ) : (
          <div className="server-empty"><strong>Server tidak ditemukan</strong><span>Coba kata kunci lain.</span></div>
        )}
      </section>

      <div className={`server-modal${selected ? ' is-open' : ''}`} id="serverModal" aria-hidden={!selected}>
        <div className="server-modal-backdrop" onClick={close} />
        <section className="server-modal-card" role="dialog" aria-modal="true" aria-labelledby="serverModalTitle">
          <button className="server-modal-close" type="button" onClick={close} aria-label="Tutup">×</button>
          <div className="server-modal-content" id="serverModalContent">
            {shown ? (
              <>
                <div className="server-modal-logo">
                  {shown.logo
                    ? <img src={shown.logo} alt={`${shown.name || 'Server'} logo`} />
                    : <span>{String(shown.name || 'G').slice(0, 1).toUpperCase()}</span>}
                </div>
                <span className="server-modal-status">
                  <i className={`server-status-dot${isOffline(shown.status) ? ' is-offline' : ''}`} />
                  {shown.status}
                </span>
                <h2 id="serverModalTitle">{shown.name}</h2>
                <p>{shown.description}</p>
                <div className="server-modal-links">
                  {links.map(item => (
                    <a key={item.key} className="server-modal-link" href={item.url} target="_blank" rel="noopener noreferrer">
                      <div className="server-modal-link-icon" aria-hidden="true">
                        <ServerLinkIcon type={item.key} src={linkIcons?.[item.key]} />
                      </div>
                      <span className="server-modal-link-label">{item.label}</span>
                      <b>›</b>
                    </a>
                  ))}
                </div>
              </>
            ) : null}
          </div>
        </section>
      </div>
    </>
  );
}
