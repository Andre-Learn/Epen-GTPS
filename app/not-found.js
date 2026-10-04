import Link from 'next/link';

export const metadata = {
  title: { absolute: '404 — Epen GTPS' },
  robots: { index: false, follow: false }
};

const page = {
  minHeight: '100vh', display: 'grid', placeContent: 'center', justifyItems: 'center', gap: 12, padding: 24, textAlign: 'center',
  fontFamily: "'Instrument Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", color: '#17112b', background: '#faf9fe'
};

export default function NotFound() {
  return (
    <main style={page}>
      <h1 style={{ margin: 0, fontSize: 'clamp(3rem, 14vw, 5rem)', letterSpacing: '-0.05em', color: '#6d28d9' }}>404</h1>
      <p style={{ margin: 0, color: '#4b4466' }}>Halaman tidak ditemukan.</p>
      <Link href="/" style={{ marginTop: 12, padding: '12px 24px', borderRadius: 999, background: '#6d28d9', color: '#fff', fontWeight: 600, textDecoration: 'none' }}>
        Kembali ke Home
      </Link>
    </main>
  );
}
