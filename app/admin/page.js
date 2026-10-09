'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import styles from './admin.module.css';
import { isPlainObject, prepareForSave, pretty, setIn, validate } from './lib';
import { ButtonsEditor, PagesEditor, PartnersEditor, PromoteEditor, ServersEditor, SiteEditor, VideoEditor } from './editors';

async function api(url, options = {}) {
  const response = await fetch(url, {
    credentials: 'same-origin',
    ...options,
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) }
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || 'Request gagal');
  return data;
}

const TABS = [
  { id: 'pages', label: 'Halaman', Editor: PagesEditor },
  { id: 'site', label: 'Situs & SEO', Editor: SiteEditor },
  { id: 'buttons', label: 'Tombol', Editor: ButtonsEditor },
  { id: 'promote', label: 'Promote', Editor: PromoteEditor },
  { id: 'servers', label: 'Server', Editor: ServersEditor },
  { id: 'partners', label: 'Partner', Editor: PartnersEditor },
  { id: 'video', label: 'Video', Editor: VideoEditor },
  { id: 'json', label: 'Advanced JSON' }
];

export default function AdminPage() {
  const [checking, setChecking] = useState(true);
  const [config, setConfig] = useState(null); // null = belum login
  const [savedJson, setSavedJson] = useState('');
  const [jsonText, setJsonText] = useState('');
  const [tab, setTab] = useState('pages');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState({ message: '', ok: false });

  const errors = useMemo(() => (config ? validate(config) : {}), [config]);
  const errorCount = Object.keys(errors).length;
  const dirty = useMemo(() => (config ? pretty(config) !== savedJson : false), [config, savedJson]);

  const loadConfig = useCallback(async () => {
    try {
      const data = await api('/api/admin');
      setConfig(data);
      setSavedJson(pretty(data));
      return true;
    } catch {
      return false;
    }
  }, []);

  // Kalau cookie sesi masih valid, langsung masuk.
  useEffect(() => {
    loadConfig().finally(() => setChecking(false));
  }, [loadConfig]);

  // Peringatan kalau halaman ditutup padahal ada perubahan yang belum disimpan.
  useEffect(() => {
    if (!dirty) return undefined;
    const handler = event => { event.preventDefault(); event.returnValue = ''; };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [dirty]);

  const change = useCallback((path, value) => {
    setStatus({ message: '', ok: false });
    setConfig(current => setIn(current, path, value));
  }, []);

  const login = async () => {
    setLoggingIn(true);
    try {
      await api('/api/admin', { method: 'POST', body: JSON.stringify({ action: 'login', password }) });
      if (!(await loadConfig())) throw new Error('Login berhasil tetapi config tidak dapat dibaca.');
      setLoginError('');
      setPassword('');
    } catch (error) {
      setLoginError(error.message);
    } finally {
      setLoggingIn(false);
    }
  };

  const logout = async () => {
    if (dirty && !window.confirm('Ada perubahan yang belum disimpan. Tetap keluar?')) return;
    try { await api('/api/admin', { method: 'POST', body: JSON.stringify({ action: 'logout' }) }); } catch { /* tetap muat ulang */ }
    window.location.reload();
  };

  const save = async (candidate = config) => {
    const prepared = prepareForSave(candidate);
    const problems = Object.keys(validate(prepared)).length;
    if (problems) {
      setStatus({ message: `Perbaiki ${problems} isian yang bermasalah dulu (ditandai merah).`, ok: false });
      return;
    }
    setSaving(true);
    try {
      await api('/api/admin', { method: 'PUT', body: JSON.stringify({ config: prepared }) });
      setConfig(prepared);
      setSavedJson(pretty(prepared));
      setJsonText(pretty(prepared));
      setStatus({ message: 'Perubahan berhasil disimpan. Website langsung diperbarui.', ok: true });
    } catch (error) {
      setStatus({ message: error.message, ok: false });
    } finally {
      setSaving(false);
    }
  };

  const openTab = id => {
    if (id === 'json') setJsonText(pretty(config));
    setStatus({ message: '', ok: false });
    setTab(id);
  };

  const saveJson = async () => {
    let parsed;
    try {
      parsed = JSON.parse(jsonText);
    } catch (error) {
      setStatus({ message: `JSON tidak valid: ${error.message}`, ok: false });
      return;
    }
    if (!isPlainObject(parsed)) {
      setStatus({ message: 'Config harus berupa objek JSON.', ok: false });
      return;
    }
    await save(parsed);
  };

  if (checking) return <div className={styles.root} />;

  if (!config) {
    return (
      <div className={styles.root}>
        <main className={styles.wrap}>
          <section className={styles.login}>
            <div className={styles.brand}>EPEN <span>GTPS</span> Admin</div>
            <p className={styles.hint}>Masuk untuk mengatur konfigurasi website.</p>
            <div className={styles.field}>
              <label htmlFor="adminPassword">Password Admin</label>
              <input
                id="adminPassword"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={event => setPassword(event.target.value)}
                onKeyDown={event => { if (event.key === 'Enter' && !loggingIn) login(); }}
              />
            </div>
            <button className={styles.primary} type="button" onClick={login} disabled={loggingIn}>
              {loggingIn ? 'Memeriksa…' : 'Masuk'}
            </button>
            <div className={`${styles.status} ${styles.err}`} role="alert">{loginError}</div>
          </section>
        </main>
      </div>
    );
  }

  const active = TABS.find(item => item.id === tab) || TABS[0];
  const ActiveEditor = active.Editor;

  return (
    <div className={styles.root}>
      <main className={styles.wrap}>
        <div className={styles.top}>
          <div>
            <div className={styles.brand}>EPEN <span>GTPS</span> Admin</div>
            <div className={styles.hint}>Pengaturan website tersimpan di server.</div>
          </div>
          <button className={styles.ghost} type="button" onClick={logout}>Keluar</button>
        </div>

        <div className={styles.panel}>
          <div className={styles.tabs} role="tablist">
            {TABS.map(item => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={tab === item.id}
                className={tab === item.id ? styles.active : ''}
                onClick={() => openTab(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>

          {ActiveEditor ? (
            <>
              <ActiveEditor config={config} errors={errors} change={change} />
              <div className={styles.saveBar}>
                <div className={styles.saveInfo}>
                  {errorCount > 0
                    ? <span className={styles.err}>{errorCount} isian perlu diperbaiki</span>
                    : dirty
                      ? <span className={styles.dirty}>Ada perubahan yang belum disimpan</span>
                      : <span className={styles.ok}>Semua perubahan tersimpan</span>}
                </div>
                <button className={styles.primary} type="button" onClick={() => save()} disabled={saving || !dirty}>
                  {saving ? 'Menyimpan…' : 'Simpan'}
                </button>
              </div>
            </>
          ) : (
            <div>
              <div className={styles.notice}>
                Untuk pengaturan yang belum ada di form: tombol menu beranda, navigasi footer, ikon link server, dan video cadangan.
                Perubahan di tab lain yang belum disimpan tidak ikut di sini. Jangan masukkan API key atau password.
              </div>
              <div className={`${styles.field} ${styles.jsonField}`}>
                <label htmlFor="jsonEditor">Site config</label>
                <textarea id="jsonEditor" spellCheck={false} value={jsonText} onChange={event => setJsonText(event.target.value)} />
              </div>
              <div className={styles.bar}>
                <span className={styles.small}>Config maksimum 800 KB.</span>
                <button className={styles.primary} type="button" onClick={saveJson} disabled={saving}>
                  {saving ? 'Menyimpan…' : 'Simpan Perubahan'}
                </button>
              </div>
            </div>
          )}

          <div className={`${styles.status} ${status.ok ? styles.ok : styles.err}`} role="status">{status.message}</div>
        </div>
      </main>
    </div>
  );
}
