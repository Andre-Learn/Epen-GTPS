'use client';

import styles from './admin.module.css';
import { isPlainObject, makeId, setIn } from './lib';
import { CheckField, Grid, ListEditor, NumberField, Section, SelectField, TextField } from './ui';

const PAGE_LABELS = { home: 'Beranda', promote: 'Promote', partners: 'Partner', servers: 'Server' };
const PAGE_KEYS = ['home', 'promote', 'partners', 'servers'];
const errAt = (errors, ...path) => errors[path.join('.')];
const asArray = value => (Array.isArray(value) ? value : []);

/* ---------- Halaman ---------- */
export function PagesEditor({ config, change }) {
  const pages = isPlainObject(config.pages) ? Object.entries(config.pages) : [];
  return (
    <Section
      title="Halaman"
      hint="Halaman yang dimatikan tampil sebagai “Segera Tersedia”, otomatis noindex, dan keluar dari sitemap. Link ke halaman itu di footer dan tombol menu ikut disembunyikan."
    >
      <div className={styles.quick}>
        {pages.map(([key, page]) => {
          const off = page?.enabled === false;
          return (
            <div key={key} className={styles.toggle}>
              <b>{PAGE_LABELS[key] || key}</b>
              <button
                type="button"
                className={off ? styles.ghost : styles.primary}
                aria-pressed={!off}
                onClick={() => change(['pages', key, 'enabled'], off)}
              >
                {off ? 'OFF' : 'ON'}
              </button>
            </div>
          );
        })}
      </div>
      <div className={styles.stack}>
        {pages.map(([key, page]) => (
          <details key={key} className={styles.item}>
            <summary><span className={styles.itemTitle}>Teks “Segera Tersedia” — {PAGE_LABELS[key] || key}</span></summary>
            <div className={styles.itemBody}>
              <Grid>
                <TextField label="Judul" value={page?.maintenanceTitle} onChange={v => change(['pages', key, 'maintenanceTitle'], v)} wide />
                <TextField label="Deskripsi" multiline rows={2} value={page?.maintenanceDescription} onChange={v => change(['pages', key, 'maintenanceDescription'], v)} />
              </Grid>
            </div>
          </details>
        ))}
      </div>
    </Section>
  );
}

/* ---------- Situs & SEO ---------- */
export function SiteEditor({ config, errors, change }) {
  const site = isPlainObject(config.site) ? config.site : {};
  const set = key => v => change(['site', key], v);
  return (
    <>
      <Section title="Identitas situs">
        <Grid>
          <TextField label="Nama situs" value={site.name} onChange={set('name')} />
          <TextField label="Teks footer" value={site.footerDescription} onChange={set('footerDescription')} />
          <TextField label="Deskripsi situs" multiline rows={3} value={site.description} onChange={set('description')} />
          <TextField label="Logo" value={site.logoUrl} onChange={set('logoUrl')} error={errAt(errors, 'site', 'logoUrl')} placeholder="/assets/logo.png" hint="Path lokal (/assets/…) otomatis dioptimasi." />
          <TextField label="Banner" value={site.bannerUrl} onChange={set('bannerUrl')} error={errAt(errors, 'site', 'bannerUrl')} placeholder="/assets/banner.png" hint="Rasio disarankan 1600×500." />
          <TextField label="Favicon" value={site.faviconUrl} onChange={set('faviconUrl')} error={errAt(errors, 'site', 'faviconUrl')} placeholder="/assets/favicon-48.png" />
          <TextField label="Gambar Open Graph (preview link)" value={site.ogImageUrl} onChange={set('ogImageUrl')} error={errAt(errors, 'site', 'ogImageUrl')} placeholder="/assets/banner.png" />
        </Grid>
      </Section>

      <Section title="SEO per halaman" hint="Judul dan deskripsi yang muncul di Google dan saat link dibagikan.">
        <div className={styles.stack}>
          {PAGE_KEYS.map(key => {
            const seo = site.pageSEO?.[key] || {};
            const setSeo = field => v => change(['site', 'pageSEO', key, field], v);
            return (
              <details key={key} className={styles.item}>
                <summary>
                  <span className={styles.itemTitle}>{PAGE_LABELS[key]}</span>
                  <span className={styles.itemMeta}>{seo.title || ''}</span>
                </summary>
                <div className={styles.itemBody}>
                  <Grid>
                    <TextField label="Judul (title)" value={seo.title} onChange={setSeo('title')} wide />
                    <TextField label="Deskripsi" multiline rows={3} value={seo.description} onChange={setSeo('description')} />
                    <TextField label="Kata kunci" value={seo.keywords} onChange={setSeo('keywords')} wide />
                    <TextField label="Judul Open Graph" value={seo.ogTitle} onChange={setSeo('ogTitle')} wide />
                    <TextField label="Deskripsi Open Graph" multiline rows={2} value={seo.ogDescription} onChange={setSeo('ogDescription')} />
                  </Grid>
                </div>
              </details>
            );
          })}
        </div>
      </Section>
    </>
  );
}

/* ---------- Promote ---------- */
export function PromoteEditor({ config, errors, change }) {
  const promote = isPlainObject(config.site?.promote) ? config.site.promote : {};
  const packages = asArray(promote.packages);
  const base = ['site', 'promote'];

  return (
    <>
      <Section title="Halaman promote">
        <Grid>
          <CheckField label="Tampilkan paket promote" checked={promote.enabled !== false} onChange={v => change([...base, 'enabled'], v)} />
          <TextField label="Judul" value={promote.title} onChange={v => change([...base, 'title'], v)} />
          <TextField label="Deskripsi" value={promote.description} onChange={v => change([...base, 'description'], v)} />
        </Grid>
      </Section>

      <Section title="Paket" hint="Urutan di sini = urutan kartu di website.">
        <ListEditor
          noun="paket"
          addLabel="Tambah paket"
          emptyText="Belum ada paket."
          items={packages}
          onChange={next => change([...base, 'packages'], next)}
          itemTitle={pkg => pkg?.name}
          itemMeta={pkg => [pkg?.price, pkg?.popular ? 'Popular' : ''].filter(Boolean).join(' · ')}
          makeItem={items => ({ id: makeId(items, 'paket'), name: '', price: '', description: '', features: [], popular: false, url: '', button: 'Pesan Sekarang' })}
          renderItem={(pkg, set, index) => (
            <>
              <TextField label="Nama paket" value={pkg.name} onChange={v => set({ ...pkg, name: v })} />
              <TextField label="Harga" value={pkg.price} onChange={v => set({ ...pkg, price: v })} placeholder="Rp5.000" />
              <TextField label="Deskripsi singkat" multiline rows={2} value={pkg.description} onChange={v => set({ ...pkg, description: v })} />
              <TextField
                label="Keunggulan"
                multiline
                rows={4}
                hint="Satu baris = satu poin."
                value={asArray(pkg.features).join('\n')}
                onChange={v => set({ ...pkg, features: v.split('\n') })}
              />
              <TextField label="Link tombol" value={pkg.url} onChange={v => set({ ...pkg, url: v })} error={errAt(errors, ...base, 'packages', index, 'url')} placeholder="https://discord.gg/…" />
              <TextField label="Teks tombol" value={pkg.button} onChange={v => set({ ...pkg, button: v })} />
              <CheckField label="Tandai sebagai POPULAR" checked={pkg.popular} onChange={v => set({ ...pkg, popular: v })} />
            </>
          )}
        />
      </Section>
    </>
  );
}

/* ---------- Server ---------- */
export function ServersEditor({ config, errors, change }) {
  const servers = asArray(config.site?.servers);
  const base = ['site', 'servers'];
  return (
    <Section title="Daftar server GTPS" hint="Server yang tampil di halaman Server GTPS. Kolom link boleh dikosongkan.">
      <ListEditor
        noun="server"
        addLabel="Tambah server"
        emptyText="Belum ada server."
        items={servers}
        onChange={next => change(base, next)}
        itemTitle={server => server?.name}
        itemMeta={server => server?.status}
        makeItem={items => ({ id: makeId(items, 'server'), name: '', logo: '', status: 'Online', description: 'Growtopia private server', whatsapp: '', discord: '', host: '' })}
        renderItem={(server, set, index) => (
          <>
            <TextField label="Nama server" value={server.name} onChange={v => set({ ...server, name: v })} />
            <TextField label="ID" value={server.id} onChange={v => set({ ...server, id: v })} error={errAt(errors, ...base, index, 'id')} hint="Dipakai di link /servers?server=ID." />
            <SelectField
              label="Status"
              value={String(server.status || 'Online')}
              onChange={v => set({ ...server, status: v })}
              options={[
                ...(['Online', 'Offline'].includes(server.status) || !server.status ? [] : [{ value: server.status, label: server.status }]),
                { value: 'Online', label: 'Online' },
                { value: 'Offline', label: 'Offline' }
              ]}
            />
            <TextField label="Logo" value={server.logo} onChange={v => set({ ...server, logo: v })} error={errAt(errors, ...base, index, 'logo')} placeholder="https://…" />
            <TextField label="Deskripsi" multiline rows={2} value={server.description} onChange={v => set({ ...server, description: v })} />
            <TextField label="WhatsApp" value={server.whatsapp} onChange={v => set({ ...server, whatsapp: v })} error={errAt(errors, ...base, index, 'whatsapp')} />
            <TextField label="Discord" value={server.discord} onChange={v => set({ ...server, discord: v })} error={errAt(errors, ...base, index, 'discord')} />
            <TextField label="Host / cara main" value={server.host} onChange={v => set({ ...server, host: v })} error={errAt(errors, ...base, index, 'host')} />
          </>
        )}
      />
    </Section>
  );
}

/* ---------- Partner ---------- */
export function PartnersEditor({ config, errors, change }) {
  const partners = asArray(config.partners);
  return (
    <Section title="Partner & promoter" hint="Video partner diambil otomatis dari channel YouTube-nya.">
      <ListEditor
        noun="partner"
        addLabel="Tambah partner"
        emptyText="Belum ada partner."
        items={partners}
        onChange={next => change(['partners'], next)}
        itemTitle={partner => partner?.name}
        itemMeta={partner => partner?.tagline}
        makeItem={items => ({
          id: makeId(items, 'partner'),
          name: '',
          short: '',
          tagline: 'Promoter GTPS',
          description: '',
          logo: '',
          banner: '',
          bannerMode: 'template',
          bannerTemplate: { style: 'signature', showLogo: true },
          links: { whatsapp: '', discord: '', youtube: '' },
          videoLimit: 4,
          youtubeChannelId: '',
          videos: []
        })}
        renderItem={(partner, set, index) => {
          const e = (...path) => errAt(errors, 'partners', index, ...path);
          const setField = (path, value) => set(setIn(partner, path, value));
          const custom = partner.bannerMode === 'custom';
          return (
            <>
              <TextField label="Nama" value={partner.name} onChange={v => setField(['name'], v)} />
              <TextField label="ID" value={partner.id} onChange={v => setField(['id'], v)} error={e('id')} hint="Dipakai di link /partners?partner=ID." />
              <TextField label="Inisial (kalau tanpa logo)" value={partner.short} onChange={v => setField(['short'], v)} />
              <TextField label="Tagline" value={partner.tagline} onChange={v => setField(['tagline'], v)} />
              <TextField label="Deskripsi" multiline rows={2} value={partner.description} onChange={v => setField(['description'], v)} />
              <TextField label="Logo" value={partner.logo} onChange={v => setField(['logo'], v)} error={e('logo')} placeholder="https://…" />

              <SelectField
                label="Banner"
                value={custom ? 'custom' : 'template'}
                onChange={v => setField(['bannerMode'], v)}
                options={[{ value: 'template', label: 'Template otomatis' }, { value: 'custom', label: 'Gambar sendiri' }]}
              />
              {custom ? (
                <TextField label="URL banner" value={partner.banner} onChange={v => setField(['banner'], v)} error={e('banner')} hint="Rasio 1600×500." />
              ) : (
                <>
                  <SelectField
                    label="Gaya template"
                    value={partner.bannerTemplate?.style === 'midnight' ? 'midnight' : 'signature'}
                    onChange={v => setField(['bannerTemplate', 'style'], v)}
                    options={[{ value: 'signature', label: 'Signature' }, { value: 'midnight', label: 'Midnight' }]}
                  />
                  <CheckField label="Tampilkan logo di banner" checked={partner.bannerTemplate?.showLogo} onChange={v => setField(['bannerTemplate', 'showLogo'], v)} />
                </>
              )}

              <TextField label="WhatsApp" value={partner.links?.whatsapp} onChange={v => setField(['links', 'whatsapp'], v)} error={e('links', 'whatsapp')} />
              <TextField label="Discord" value={partner.links?.discord} onChange={v => setField(['links', 'discord'], v)} error={e('links', 'discord')} />
              <TextField label="YouTube" value={partner.links?.youtube} onChange={v => setField(['links', 'youtube'], v)} error={e('links', 'youtube')} />

              <TextField
                label="Channel ID YouTube"
                value={partner.youtubeChannelId}
                onChange={v => setField(['youtubeChannelId'], v.trim())}
                error={e('youtubeChannelId')}
                hint="Harus juga ada di YOUTUBE_ALLOWED_CHANNELS (Vercel), kalau tidak video tidak akan muncul."
                mono
              />
              <NumberField label="Jumlah video" value={partner.videoLimit} onChange={v => setField(['videoLimit'], v)} error={e('videoLimit')} min={0} max={24} hint="0 = tampilkan semua." />
            </>
          );
        }}
      />
    </Section>
  );
}

/* ---------- Video ---------- */
export function VideoEditor({ config, errors, change }) {
  return (
    <Section title="Video beranda" hint="Video diambil dari YouTube dan di-cache 15 menit di server.">
      <Grid>
        <TextField
          label="Channel ID YouTube Epen GTPS"
          value={config.epen?.youtubeChannelId}
          onChange={v => change(['epen', 'youtubeChannelId'], v.trim())}
          error={errAt(errors, 'epen', 'youtubeChannelId')}
          hint="Harus ada di YOUTUBE_ALLOWED_CHANNELS (Vercel)."
          mono
          wide
        />
        <NumberField label="Video tampil awal" value={config.video?.initialLimit} onChange={v => change(['video', 'initialLimit'], v)} error={errAt(errors, 'video', 'initialLimit')} min={1} max={24} hint="Sisanya lewat tombol Show More." />
        <NumberField label="Maksimal video diambil" value={config.video?.fetchLimit} onChange={v => change(['video', 'fetchLimit'], v)} error={errAt(errors, 'video', 'fetchLimit')} min={1} max={24} />
      </Grid>
    </Section>
  );
}
