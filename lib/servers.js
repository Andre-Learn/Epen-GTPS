import { sanitizeServers } from './sanitize';

export const serverPath = id => `/servers/${encodeURIComponent(id)}`;

// Hanya server ber-ID yang punya halaman sendiri.
export const getServers = config => sanitizeServers(config?.site?.servers).filter(server => server.id);

export function findServer(config, id) {
  const wanted = String(id ?? '');
  return getServers(config).find(server => server.id === wanted) || null;
}

export const isServerOffline = server => String(server?.status || '').toLowerCase().includes('offline');

const trimDot = text => String(text || '').trim().replace(/[.\s]+$/, '');

// SEO per server. Dibuat dari nama + status supaya tiap halaman unik,
// walau deskripsi singkat antar server mirip.
export function serverSeo(server) {
  const name = server.name;
  const status = isServerOffline(server) ? 'Offline' : 'Online';
  const short = trimDot(server.description);
  const title = `${name} — Server GTPS Terbaru 2026 | Epen GTPS`;
  const description = `${name}: ${short}. Status ${status}. Lihat info, link Discord, WhatsApp, dan cara join ${name} — GTPS (Growtopia Private Server) terbaru 2026 di Epen GTPS.`;
  const about =
    String(server.about || '').trim() ||
    `${name} adalah salah satu server GTPS (Growtopia Private Server) terbaru 2026 di Indonesia yang terdaftar di Epen GTPS. ` +
      `${short}. Saat ini statusnya ${status}. Gunakan tombol di atas untuk bergabung ke komunitas Discord atau WhatsApp ${name}, ` +
      `atau buka panduan Host Server untuk melihat cara bermain.`;
  return {
    title,
    description,
    about,
    keywords: [
      `${name}`,
      `${name} GTPS`,
      `${name} Growtopia Private Server`,
      `cara join ${name}`,
      'GTPS terbaru 2026',
      'server GTPS Indonesia',
      'Epen GTPS'
    ].join(', '),
    ogTitle: `${name} — GTPS Terbaru 2026 | Epen GTPS`,
    ogDescription: `${name}: ${short}. Status ${status}. Cek info dan link komunitasnya di Epen GTPS.`
  };
}
