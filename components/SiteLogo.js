import Image from 'next/image';
import { safeImageUrl } from '@/lib/safe-url';
import { isLocalImage } from '@/lib/image';

// Logo situs dari config; kalau kosong tampil huruf "E".
// `size` = ukuran tampil (px). Logo lokal dioptimasi lewat next/image,
// logo dari URL luar tetap <img> biasa (domainnya bebas diatur dari admin).
export default function SiteLogo({ config, as: Tag = 'span', className = '', size = 46 }) {
  const site = config?.site || {};
  const url = safeImageUrl(site.logoUrl);
  const name = String(site.name || 'Epen GTPS');

  let image = <span className="site-logo-fallback">E</span>;
  if (url && isLocalImage(url)) {
    image = <Image src={url} alt={`${name} logo`} width={size} height={size} sizes={`${size}px`} priority />;
  } else if (url) {
    image = <img src={url} alt={`${name} logo`} loading="eager" />;
  }

  // data-site-logo dipakai CSS untuk ukuran & crop gambar (lihat [data-site-logo] di globals.css).
  return (
    <Tag className={`${className}${url ? ' has-site-logo' : ''}`.trim()} data-site-logo>
      {image}
    </Tag>
  );
}
