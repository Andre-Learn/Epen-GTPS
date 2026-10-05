// SEO halaman /servers — target pencarian "GTPS terbaru 2026".
// Dipakai sebagai cadangan kalau config tersimpan (Blob) belum memuat kata kunci 2026.
export const SERVERS_SEO = {
  title: 'Server GTPS Terbaru 2026 — Daftar GTPS Indonesia Online | Epen GTPS',
  description:
    'Daftar server GTPS terbaru 2026 di Indonesia. Cek status online/offline, deskripsi, Discord, WhatsApp, dan cara join Growtopia Private Server (GTPS) terbaik.',
  keywords: [
    'GTPS terbaru 2026',
    'server GTPS terbaru 2026',
    'GTPS terbaru',
    'GTPS 2026',
    'private server Growtopia 2026',
    'Growtopia private server terbaru',
    'daftar GTPS Indonesia',
    'list GTPS online',
    'GTPS Indonesia',
    'server GTPS',
    'Epen GTPS'
  ],
  ogTitle: 'Server GTPS Terbaru 2026 — Daftar GTPS Indonesia | Epen GTPS',
  ogDescription:
    'Temukan server GTPS terbaru 2026 beserta status online/offline dan tautan komunitasnya di Epen GTPS.'
};

export const SERVERS_FAQ = [
  {
    q: 'Apa itu GTPS?',
    a: 'GTPS adalah singkatan dari Growtopia Private Server, yaitu server Growtopia buatan komunitas dengan fitur, item, dan ekonomi yang berbeda dari server resmi.'
  },
  {
    q: 'Di mana mencari GTPS terbaru 2026?',
    a: 'Di halaman ini. Epen GTPS mengumpulkan server GTPS terbaru 2026 lengkap dengan status online/offline, deskripsi, serta tautan Discord, WhatsApp, dan cara join.'
  },
  {
    q: 'Bagaimana cara tahu server GTPS sedang online?',
    a: 'Setiap server memiliki label Online atau Offline pada kartunya, jadi kamu bisa memilih server yang sedang aktif sebelum bergabung.'
  },
  {
    q: 'Bagaimana cara join server GTPS?',
    a: 'Klik server yang kamu inginkan, lalu buka tautan Host Server untuk panduan cara bermain, atau gabung ke Discord/WhatsApp komunitasnya untuk informasi terbaru.'
  }
];

// Gabungkan SEO tersimpan dengan bawaan 2026.
export function mergeServersSeo(stored = {}) {
  const has2026 = v => /2026/.test(String(v || ''));
  const pick = (key, force) => (stored[key] && (!force || has2026(stored[key])) ? stored[key] : SERVERS_SEO[key]);
  const keywords = Array.from(
    new Set(
      [...String(stored.keywords || '').split(','), ...SERVERS_SEO.keywords]
        .map(k => k.trim())
        .filter(Boolean)
    )
  ).join(', ');
  return {
    title: pick('title', true),
    description: pick('description', true),
    ogTitle: pick('ogTitle', true),
    ogDescription: pick('ogDescription', true),
    keywords
  };
}
