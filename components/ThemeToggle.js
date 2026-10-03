'use client';

import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);

  // Tema awal sudah dipasang oleh script di <head>; di sini hanya sinkron ke state.
  useEffect(() => {
    setDark(document.documentElement.dataset.theme === 'dark');
  }, []);

  const toggle = () => {
    const next = !dark;
    if (next) document.documentElement.dataset.theme = 'dark';
    else delete document.documentElement.dataset.theme;
    try { localStorage.setItem('epen-theme', next ? 'dark' : 'light'); } catch { /* abaikan */ }
    setDark(next);
  };

  return (
    <button
      className="theme-switch"
      type="button"
      id="themeButton"
      aria-label={dark ? 'Gunakan tema terang' : 'Gunakan tema gelap'}
      aria-pressed={dark}
      onClick={toggle}
    >
      <span className="theme-switch-label theme-light-label">Light</span>
      <span className="theme-switch-track" aria-hidden="true">
        <span className="theme-switch-knob"><span /><i /></span>
      </span>
      <span className="theme-switch-label theme-dark-label">Dark</span>
    </button>
  );
}
