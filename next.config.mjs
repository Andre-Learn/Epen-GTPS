const isProd = process.env.NODE_ENV === 'production';

// Dipindahkan dari vercel.json. CSP hanya dipasang di production karena
// dev server Next.js butuh eval + websocket untuk hot reload.
const csp = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "frame-src 'none'",
  "child-src 'none'",
  "script-src 'self' 'unsafe-inline'",
  "script-src-attr 'none'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "img-src 'self' https:",
  "font-src 'self' https://fonts.gstatic.com",
  "connect-src 'self'",
  "media-src 'self' https:",
  'upgrade-insecure-requests'
].join('; ');

const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
  { key: 'X-Permitted-Cross-Domain-Policies', value: 'none' },
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin-allow-popups' },
  { key: 'Cross-Origin-Resource-Policy', value: 'same-origin' },
  ...(isProd ? [{ key: 'Content-Security-Policy', value: csp }] : [])
];

const noStoreNoIndex = [
  { key: 'Cache-Control', value: 'no-store' },
  { key: 'X-Robots-Tag', value: 'noindex, nofollow' }
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  // Gambar lokal dioptimasi on-demand (WebP). Hasilnya di-cache 30 hari.
  images: { minimumCacheTTL: 60 * 60 * 24 * 30 },

  async redirects() {
    // URL lama (.html) tetap diarahkan permanen supaya SEO dan link lama aman.
    return [
      { source: '/index.html', destination: '/', permanent: true },
      { source: '/partners.html', destination: '/partners', permanent: true },
      { source: '/servers.html', destination: '/servers', permanent: true },
      { source: '/promote.html', destination: '/promote', permanent: true }
    ];
  },

  async headers() {
    return [
      { source: '/:path*', headers: securityHeaders },
      { source: '/assets/:path*', headers: [{ key: 'Cache-Control', value: 'public, max-age=86400, stale-while-revalidate=604800' }] },
      {
        source: '/admin/:path*',
        headers: [
          { key: 'X-Robots-Tag', value: 'noindex, nofollow, noarchive' },
          { key: 'Cache-Control', value: 'no-store' }
        ]
      },
      { source: '/api/config', headers: noStoreNoIndex },
      { source: '/api/admin', headers: noStoreNoIndex }
    ];
  }
};

export default nextConfig;
