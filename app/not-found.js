import Link from 'next/link';

export const metadata = {
  title: { absolute: '404 — Epen GTPS' },
  robots: { index: false, follow: false }
};

export default function NotFound() {
  return (
    <main style={{ fontFamily: 'system-ui, sans-serif', textAlign: 'center', padding: '15vh 20px' }}>
      <h1>404</h1>
      <p>Halaman tidak ditemukan.</p>
      <Link href="/">Kembali ke Home</Link>
    </main>
  );
}
