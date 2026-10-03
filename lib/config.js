import { cache } from 'react';
import { unstable_cache } from 'next/cache';
import { get } from '@vercel/blob';
import defaultConfig from '@/data/default-config.json';

export const CONFIG_PATH = 'epen/site-config.json';
// Admin memanggil revalidateTag(CONFIG_TAG) setelah menyimpan → halaman langsung diperbarui.
export const CONFIG_TAG = 'site-config';
// Batas aman kalau tag tidak sempat di-revalidate (detik).
export const CONFIG_REVALIDATE = 300;

const isPlainObject = value => value && typeof value === 'object' && !Array.isArray(value);

// Baca config dari Vercel Blob (private).
// Mengembalikan null kalau config belum pernah disimpan; melempar error kalau Blob bermasalah.
async function readStored() {
  const result = await get(CONFIG_PATH, { access: 'private', useCache: false });
  if (!result || result.statusCode !== 200) return null;
  const parsed = JSON.parse(await new Response(result.stream).text());
  return isPlainObject(parsed) ? parsed : null;
}

// Tanpa cache: dipakai /api/config dan admin supaya selalu data terbaru.
export async function readConfig() {
  try {
    return (await readStored()) ?? defaultConfig;
  } catch {
    return defaultConfig;
  }
}

// Dengan cache: dipakai halaman publik. Kalau readStored() melempar error, hasilnya TIDAK ikut
// di-cache (unstable_cache hanya menyimpan nilai yang berhasil), jadi gangguan sesaat di Blob
// tidak "menempel" selama 5 menit.
const readStoredCached = unstable_cache(readStored, ['site-config'], {
  tags: [CONFIG_TAG],
  revalidate: CONFIG_REVALIDATE
});

// cache() dari React: generateMetadata + page + layout dalam satu request cukup membaca sekali.
export const getConfig = cache(async () => {
  try {
    return (await readStoredCached()) ?? defaultConfig;
  } catch {
    return defaultConfig;
  }
});
