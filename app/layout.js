import { SITE_URL } from '@/lib/site';

export const metadata = {
  metadataBase: new URL(SITE_URL),
  manifest: '/site.webmanifest',
  referrer: 'strict-origin-when-cross-origin'
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#faf9fe' },
    { media: '(prefers-color-scheme: dark)', color: '#0d0918' }
  ]
};

// Set tema sebelum paint supaya tidak berkedip (sama seperti versi lama).
const THEME_SCRIPT = `(()=>{try{var s=localStorage.getItem('epen-theme');var d=window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches;if(s==='dark'||(!s&&d))document.documentElement.dataset.theme='dark';}catch(_){}})();`;

export default function RootLayout({ children }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600;700&display=swap"
        />
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
