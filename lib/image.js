// URL gambar lokal lewat optimizer Next.js (otomatis WebP + ukuran sesuai kebutuhan).
// Dipakai untuk background-image, yang tidak bisa memakai <Image>.
// Lebar harus salah satu dari images.deviceSizes / imageSizes bawaan Next (mis. 640, 750, 1080, 1200, 1920).
export function optimizedLocalUrl(src, width = 1200, quality = 75) {
  if (typeof src !== 'string' || !src.startsWith('/') || src.startsWith('//')) return src;
  return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${quality}`;
}

// Lebar banner beranda; dipakai bersama oleh <link rel=preload> (server) dan background-image (client).
export const BANNER_WIDTH = 1200;

export const isLocalImage = src => typeof src === 'string' && src.startsWith('/') && !src.startsWith('//');
