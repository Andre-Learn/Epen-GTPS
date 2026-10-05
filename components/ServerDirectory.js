'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ServerLinkIcon } from './Icons';

const isOffline = status => String(status || '').toLowerCase().includes('offline');
const statusLabel = status => (isOffline(status) ? 'Offline' : String(status || 'Online'));

function StatusBadge({ status, className = '' }) {
  return (
    <span className={`server-status-badge${isOffline(status) ? ' is-offline' : ''}${className ? ` ${className}` : ''}`}>
      <i className={`server-status-dot${isOffline(status) ? ' is-offline' : ''}`} />
      {statusLabel(status)}
    </span>
  );
}

function ServerLogo({ server }) {
  return server.logo
    ? <img src={server.logo} alt="" loading="lazy" />
    : <span>{String(server.name || 'G').slice(0, 1).toUpperCase()}</span>;
}

export default function ServerDirectory({ servers, linkIcons }) {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(null); // server yang sedang terbuka
  const [shown, setShown] = useState(null); // isi panel tetap ada selama animasi tutup
  const triggerRef = useRef(null); // elemen yang membuka panel, fokus dikembalikan ke sini saat ditutup
  const cardRef = useRef(null);
  const closeRef = useRef(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return servers;
    return servers.filter(server =>
      [server.name, server.description, server.status].join(' ').toLowerCase().includes(q)
    );
  }, [servers, query]);

  const openServer = useCallback(server => {
    triggerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setShown(server);
    setSelected(server);
  }, []);
  const close = useCallback(() => {
    setSelected(null);
    const trigger = triggerRef.current;
    triggerRef.current = null;
    if (trigger && trigger.isConnected) trigger.focus({ preventScroll: true });
  }, []);

  // Deep link: /servers?server=<id>
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get('server');
    if (!id) return undefined;
    const requested = servers.find(server => server.id === id);
    if (!requested) return undefined;
    const frame = requestAnimationFrame(() => openServer(requested));
    return () => cancelAnimationFrame(frame);
  }, [servers, openServer]);

  // Saat panel terbuka: kunci scroll halaman, pindahkan fokus ke dalam panel,
  // jaga Tab tetap di dalam panel, dan tutup dengan Escape.
  useEffect(() => {
    if (!selected) return undefined;
    document.body.classList.add('modal-open');
    const frame = requestAnimationFrame(() => closeRef.current?.focus({ preventScroll: true }));

    const onKey = event => {
      if (event.key === 'Escape') { close(); return; }
      if (event.key !== 'Tab' || !cardRef.current) return;
      const items = cardRef.current.querySelectorAll('a[href], button:not([disabled])');
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      if (!cardRef.current.contains(active)) {
        event.preventDefault();
        first.focus();
      } else if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      cancelAnimationFrame(frame);
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
              <StatusBadge status={server.status} className="server-card-meta" />
              <span className="server-card-arrow" aria-hidden="true">›</span>
            </button>
          ))
        ) : (
          <div className="server-empty"><strong>Server tidak ditemukan</strong><span>Coba kata kunci lain.</span></div>
        )}
      </section>

      <div className={`server-modal${selected ? ' is-open' : ''}`} id="serverModal" aria-hidden={!selected}>
        <div className="server-modal-backdrop" onClick={close} />
        <section ref={cardRef} className="server-modal-card" role="dialog" aria-modal="true" aria-labelledby="serverModalTitle">
          <button ref={closeRef} className="server-modal-close" type="button" onClick={close} aria-label="Tutup">×</button>
          <div className="server-modal-content" id="serverModalContent">
            {shown ? (
              <>
                <div className="server-modal-logo">
                  {shown.logo
                    ? <img src={shown.logo} alt={`${shown.name || 'Server'} logo`} />
                    : <span>{String(shown.name || 'G').slice(0, 1).toUpperCase()}</span>}
                </div>
                <StatusBadge status={shown.status} className="server-modal-status" />
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
