// Config bisa diedit lewat admin panel, jadi URL di dalamnya tidak boleh dipercaya begitu saja.
// Hanya path internal dan URL http(s) yang diizinkan.
const CONTROL_CHARS = /[\u0000-\u001F\u007F]/;

export function safeUrl(value) {
  const raw = String(value ?? '').trim();
  if (!raw) return '';
  if (CONTROL_CHARS.test(raw)) return '';
  if (raw === '#' || raw.startsWith('#')) return raw;
  // Path relatif/internal. Backslash ditolak karena browser menganggap "/\host" sama dengan "//host".
  if (raw.startsWith('./') || raw.startsWith('../') || (raw.startsWith('/') && !raw.startsWith('//'))) {
    return raw.includes('\\') ? '' : raw;
  }
  if (raw.startsWith('//')) return '';
  try {
    const url = new URL(raw);
    if (url.protocol !== 'https:' && url.protocol !== 'http:') return '';
    return url.href;
  } catch {
    return '';
  }
}

// Untuk gambar: path internal ("/assets/...") atau https saja.
export function safeImageUrl(value) {
  const url = safeUrl(value);
  if (!url || url.startsWith('#')) return '';
  if (url.startsWith('/') || url.startsWith('./') || url.startsWith('../')) return url;
  return url.startsWith('https://') ? url : '';
}

// Untuk tautan tombol/kartu: kosongkan kalau hasilnya hanya "#".
export function safeLink(value) {
  const url = safeUrl(value);
  return url && url !== '#' ? url : '';
}
