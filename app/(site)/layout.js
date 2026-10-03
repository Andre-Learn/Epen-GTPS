import '../globals.css';

// Halaman publik dibuat statis lalu diperbarui (ISR):
//  - langsung saat admin menyimpan (revalidateTag('site-config') di /api/admin)
//  - paling lambat tiap 5 menit sebagai pengaman.
// Next.js hanya membaca angka literal untuk opsi ini, jadi nilainya ditulis langsung.
export const revalidate = 300;

export default function SiteLayout({ children }) {
  return children;
}
