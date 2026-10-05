import { ImageResponse } from 'next/og';
import { getConfig } from '@/lib/config';
import { findServer, isServerOffline } from '@/lib/servers';
import { loadLogoDataUrl, siteHost } from '@/lib/og-logo';

export const alt = 'Server GTPS terbaru 2026 — Epen GTPS';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const revalidate = 300;

export default async function OgImage({ params }) {
  const { id } = await params;
  const config = await getConfig();
  const server = findServer(config, id);
  const name = server?.name || 'Server GTPS';
  const offline = server ? isServerOffline(server) : false;
  const logo = server ? await loadLogoDataUrl(server.logo) : '';
  const initial = String(name).slice(0, 1).toUpperCase();
  const fontSize = name.length > 22 ? 64 : name.length > 14 ? 78 : 92;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '64px 72px',
          color: '#fff',
          background: 'linear-gradient(135deg,#2e1065 0%,#5b21b6 55%,#8b5cf6 100%)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', fontSize: 30, fontWeight: 700, opacity: 0.92 }}>
          Epen GTPS
          <div style={{ display: 'flex', marginLeft: 18, fontSize: 24, fontWeight: 500, opacity: 0.75 }}>Direktori Server GTPS</div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div
            style={{
              width: 220,
              height: 220,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 48,
              overflow: 'hidden',
              background: 'rgba(255,255,255,.16)',
              border: '4px solid rgba(255,255,255,.55)',
              fontSize: 110,
              fontWeight: 700,
              flexShrink: 0
            }}
          >
            {logo
              // eslint-disable-next-line @next/next/no-img-element
              ? <img src={logo} width={220} height={220} alt="" style={{ objectFit: 'cover' }} />
              : initial}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', marginLeft: 52, minWidth: 0 }}>
            <div style={{ display: 'flex', fontSize, fontWeight: 800, lineHeight: 1.05, letterSpacing: -2 }}>{name}</div>
            <div style={{ display: 'flex', marginTop: 18, fontSize: 38, fontWeight: 600, opacity: 0.92 }}>
              Server GTPS Terbaru 2026
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                alignSelf: 'flex-start',
                marginTop: 26,
                padding: '10px 24px',
                borderRadius: 999,
                fontSize: 28,
                fontWeight: 700,
                background: offline ? 'rgba(239,68,68,.25)' : 'rgba(34,197,94,.25)',
                border: `2px solid ${offline ? 'rgba(252,165,165,.7)' : 'rgba(134,239,172,.7)'}`
              }}
            >
              <div
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: 999,
                  marginRight: 12,
                  background: offline ? '#f87171' : '#4ade80'
                }}
              />
              {offline ? 'Offline' : 'Online'}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', fontSize: 26, opacity: 0.8 }}>{siteHost}/servers</div>
      </div>
    ),
    { ...size }
  );
}
