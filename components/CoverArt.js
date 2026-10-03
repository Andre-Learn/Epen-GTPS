'use client';

import { useEffect, useState } from 'react';
import { BANNER_WIDTH, optimizedLocalUrl } from '@/lib/image';

// Banner utama. Rasio mengikuti gambar asli (default CSS 16:5, diperbarui setelah gambar dimuat).
export default function CoverArt({ bannerUrl }) {
  const [ratio, setRatio] = useState('');
  const displayUrl = bannerUrl ? optimizedLocalUrl(bannerUrl, BANNER_WIDTH) : '';

  useEffect(() => {
    if (!bannerUrl) return undefined;
    const probe = new Image();
    probe.onload = () => {
      if (probe.naturalWidth && probe.naturalHeight) {
        setRatio(`${probe.naturalWidth} / ${probe.naturalHeight}`);
      }
    };
    probe.src = displayUrl;
    return () => { probe.onload = null; };
  }, [bannerUrl, displayUrl]);

  const style = bannerUrl
    ? {
        backgroundImage: `url("${displayUrl.replace(/"/g, '%22')}")`,
        ...(ratio ? { aspectRatio: ratio } : {})
      }
    : undefined;

  return (
    <div className={`cover-art${bannerUrl ? ' has-site-banner' : ''}`} style={style}>
      <div className="cover-glow" />
      <div className="cover-grid" />
      <div className="cover-copy"><strong>EPEN</strong><span>GTPS CREATOR</span></div>
      <div className="cover-orb">E</div>
    </div>
  );
}
