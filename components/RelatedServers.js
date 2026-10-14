'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

const LIMIT = 6;
const isOffline = status => String(status || '').toLowerCase().includes('offline');

function shuffle(list) {
  const copy = list.slice();
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// HTML statis memuat 6 server pertama (tetap bisa dirayapi); acak setelah hydrate supaya tidak mismatch.
export default function RelatedServers({ servers }) {
  const [picked, setPicked] = useState(() => servers.slice(0, LIMIT));

  useEffect(() => {
    setPicked(shuffle(servers).slice(0, LIMIT));
  }, [servers]);

  return (
    <div className="server-related-list">
      {picked.map(item => {
        const offline = isOffline(item.status);
        return (
          <Link key={item.id} href={item.href} className="server-related-item">
            <span className="server-card-logo">
              {item.logo ? <img src={item.logo} alt="" loading="lazy" /> : <span>{item.name.slice(0, 1).toUpperCase()}</span>}
            </span>
            <strong>{item.name}</strong>
            <span className={`server-status-badge${offline ? ' is-offline' : ''}`}>
              <i className={`server-status-dot${offline ? ' is-offline' : ''}`} />
              {offline ? 'Offline' : 'Online'}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
