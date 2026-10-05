'use client';

import { useEffect, useRef, useState } from 'react';

// Tombol "Salin link" dan "Bagikan" (menu bagikan bawaan HP kalau tersedia).
export default function ShareButtons({ path, title, text }) {
  const [copied, setCopied] = useState(false);
  const [canShare, setCanShare] = useState(false);
  const timer = useRef(null);

  useEffect(() => {
    setCanShare(typeof navigator !== 'undefined' && typeof navigator.share === 'function');
    return () => clearTimeout(timer.current);
  }, []);

  const fullUrl = () => new URL(path, window.location.origin).href;

  const copy = async () => {
    const url = fullUrl();
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // Cadangan untuk browser lama / konteks non-HTTPS.
      const input = document.createElement('textarea');
      input.value = url;
      input.setAttribute('readonly', '');
      input.style.cssText = 'position:fixed;opacity:0;pointer-events:none';
      document.body.appendChild(input);
      input.select();
      try { document.execCommand('copy'); } catch { /* abaikan */ }
      input.remove();
    }
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 2200);
  };

  const share = async () => {
    try {
      await navigator.share({ title, text, url: fullUrl() });
    } catch {
      /* dibatalkan pengguna */
    }
  };

  return (
    <div className="share-row">
      <button type="button" className="share-btn" onClick={copy}>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          {copied
            ? <path d="m5 12.5 4.5 4.5L19 7.5" />
            : <><rect x="9" y="9" width="11" height="11" rx="2.5" /><path d="M5 15V6.5A2.5 2.5 0 0 1 7.5 4H15" /></>}
        </svg>
        <span>{copied ? 'Link disalin' : 'Salin link'}</span>
      </button>
      {canShare ? (
        <button type="button" className="share-btn" onClick={share}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="18" cy="5.5" r="2.5" /><circle cx="6" cy="12" r="2.5" /><circle cx="18" cy="18.5" r="2.5" />
            <path d="m8.2 10.8 7.6-4M8.2 13.2l7.6 4" />
          </svg>
          <span>Bagikan</span>
        </button>
      ) : null}
      <span className="share-live" role="status" aria-live="polite">{copied ? 'Link disalin' : ''}</span>
    </div>
  );
}
