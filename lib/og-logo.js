import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { SITE_URL } from './site';

const TYPES = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg' };
const MAX_BYTES = 2 * 1024 * 1024;

// Logo server -> data URL untuk gambar OG. Mengembalikan '' kalau gagal / format tidak didukung (mis. webp),
// supaya gambar OG tetap jadi dengan huruf awal server.
export async function loadLogoDataUrl(url) {
  if (!url) return '';
  try {
    if (url.startsWith('/')) {
      const clean = path.posix.normalize(url).replace(/^(\.\.[/\\])+/, '');
      const type = TYPES[path.extname(clean).toLowerCase()];
      if (!type) return '';
      const file = await readFile(path.join(process.cwd(), 'public', clean));
      return `data:${type};base64,${file.toString('base64')}`;
    }
    const response = await fetch(url, { signal: AbortSignal.timeout(3500) });
    if (!response.ok) return '';
    const type = (response.headers.get('content-type') || '').split(';')[0].trim().toLowerCase();
    if (type !== 'image/png' && type !== 'image/jpeg') return '';
    const buffer = Buffer.from(await response.arrayBuffer());
    if (buffer.length > MAX_BYTES) return '';
    return `data:${type};base64,${buffer.toString('base64')}`;
  } catch {
    return '';
  }
}

export const siteHost = SITE_URL.replace(/^https?:\/\//, '');
