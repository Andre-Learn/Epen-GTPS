import { safeImageUrl, safeLink } from '@/lib/safe-url';

export const pretty = value => JSON.stringify(value, null, 2);
export const isPlainObject = value => Boolean(value) && typeof value === 'object' && !Array.isArray(value);

// Salin hanya sepanjang `path` (immutable) — dipakai untuk setiap perubahan isian form.
export function setIn(obj, path, value) {
  if (!path.length) return value;
  const [key, ...rest] = path;
  const base = Array.isArray(obj) ? [...obj] : { ...(obj || {}) };
  base[key] = setIn(obj?.[key], rest, value);
  return base;
}

// ID unik untuk item baru: "server-1", "server-2", ...
export function makeId(items, base) {
  const used = new Set((items || []).map(item => String(item?.id ?? '')));
  let n = (items || []).length + 1;
  while (used.has(`${base}-${n}`)) n += 1;
  return `${base}-${n}`;
}

export const CHANNEL_ID_RE = /^UC[a-zA-Z0-9_-]{22}$/;
const ID_RE = /^[A-Za-z0-9_-]+$/;

export const LINK_MESSAGE = 'Harus diawali https://, http://, atau / (contoh: /promote).';
export const IMAGE_MESSAGE = 'Harus https://… atau path lokal seperti /assets/logo.png.';

// Hasil: { 'site.servers.0.logo': 'pesan', ... }. Kosong = tidak ada masalah.
export function validate(config) {
  const errors = {};
  const put = (path, message) => { errors[path.join('.')] = message; };
  const link = (path, value) => {
    const text = String(value ?? '').trim();
    if (text && !safeLink(text)) put(path, LINK_MESSAGE);
  };
  const image = (path, value) => {
    const text = String(value ?? '').trim();
    if (text && !safeImageUrl(text)) put(path, IMAGE_MESSAGE);
  };
  const channel = (path, value) => {
    const text = String(value ?? '').trim();
    if (text && !CHANNEL_ID_RE.test(text)) put(path, 'Channel ID YouTube diawali UC dan panjangnya 24 karakter.');
  };
  const count = (path, value, max) => {
    if (value === '' || value == null) return;
    const n = Number(value);
    if (!Number.isInteger(n) || n < 1 || n > max) put(path, `Isi angka bulat 1–${max}.`);
  };
  const ids = (basePath, list, label) => {
    const seen = new Map();
    list.forEach(item => {
      const id = String(item?.id ?? '').trim();
      seen.set(id, (seen.get(id) || 0) + 1);
    });
    list.forEach((item, index) => {
      const id = String(item?.id ?? '').trim();
      const path = [...basePath, index, 'id'];
      if (!id) put(path, `ID ${label} wajib diisi.`);
      else if (!ID_RE.test(id)) put(path, 'ID hanya boleh huruf, angka, - dan _ (tanpa spasi).');
      else if (seen.get(id) > 1) put(path, `ID ${label} ini dipakai lebih dari sekali.`);
    });
  };

  const site = isPlainObject(config?.site) ? config.site : {};
  ['logoUrl', 'bannerUrl', 'faviconUrl', 'ogImageUrl'].forEach(key => image(['site', key], site[key]));

  const packages = Array.isArray(site.promote?.packages) ? site.promote.packages : [];
  packages.forEach((pkg, index) => link(['site', 'promote', 'packages', index, 'url'], pkg?.url));

  const buttons = Array.isArray(site.actionButtons) ? site.actionButtons : [];
  ids(['site', 'actionButtons'], buttons, 'tombol');
  buttons.forEach((button, index) => {
    link(['site', 'actionButtons', index, 'url'], button?.url);
    image(['site', 'actionButtons', index, 'iconUrl'], button?.iconUrl);
  });

  const servers = Array.isArray(site.servers) ? site.servers : [];
  ids(['site', 'servers'], servers, 'server');
  servers.forEach((server, index) => {
    image(['site', 'servers', index, 'logo'], server?.logo);
    ['whatsapp', 'discord', 'host'].forEach(key => link(['site', 'servers', index, key], server?.[key]));
  });

  const partners = Array.isArray(config?.partners) ? config.partners : [];
  ids(['partners'], partners, 'partner');
  partners.forEach((partner, index) => {
    image(['partners', index, 'logo'], partner?.logo);
    image(['partners', index, 'banner'], partner?.banner);
    ['whatsapp', 'discord', 'youtube'].forEach(key => link(['partners', index, 'links', key], partner?.links?.[key]));
    channel(['partners', index, 'youtubeChannelId'], partner?.youtubeChannelId);
    if (partner?.bannerMode === 'custom' && !String(partner?.banner ?? '').trim()) {
      put(['partners', index, 'banner'], 'Isi URL banner, atau ganti mode ke Template.');
    }
    if (partner?.videoLimit !== '' && partner?.videoLimit != null) {
      const n = Number(partner.videoLimit);
      if (!Number.isInteger(n) || n < 0 || n > 24) put(['partners', index, 'videoLimit'], 'Isi angka bulat 0–24 (0 = tampilkan semua).');
    }
  });

  channel(['epen', 'youtubeChannelId'], config?.epen?.youtubeChannelId);
  count(['video', 'initialLimit'], config?.video?.initialLimit, 24);
  count(['video', 'fetchLimit'], config?.video?.fetchLimit, 24);

  return errors;
}

// Rapikan sebelum disimpan: baris keunggulan yang kosong dibuang, ID di-trim.
export function prepareForSave(config) {
  const next = { ...config };
  const trimId = item => (item && typeof item.id === 'string' ? { ...item, id: item.id.trim() } : item);

  if (isPlainObject(next.site)) {
    const site = { ...next.site };
    if (isPlainObject(site.promote) && Array.isArray(site.promote.packages)) {
      site.promote = {
        ...site.promote,
        packages: site.promote.packages.map(pkg => ({
          ...trimId(pkg),
          features: (Array.isArray(pkg?.features) ? pkg.features : [])
            .map(line => String(line).trim())
            .filter(Boolean)
        }))
      };
    }
    if (Array.isArray(site.servers)) site.servers = site.servers.map(trimId);
    if (Array.isArray(site.actionButtons)) site.actionButtons = site.actionButtons.map(trimId);
    next.site = site;
  }
  if (Array.isArray(next.partners)) next.partners = next.partners.map(trimId);
  return next;
}
