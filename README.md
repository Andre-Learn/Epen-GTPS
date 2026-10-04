# Epen GTPS — Next.js

Website Epen GTPS (promote GTPS, direktori server, partner) yang sudah dipindah dari HTML + vanilla JS + Vercel Functions ke **Next.js (App Router) dengan JavaScript**. Tampilan memakai CSS yang sama persis dengan versi sebelumnya.

## Menjalankan

```bash
npm install
cp .env.example .env.local   # lalu isi nilainya
npm run dev                  # http://localhost:3000
npm run build && npm start   # production
```

Butuh Node.js 20 atau lebih baru.

## Environment variables

Sama seperti versi lama (lihat `.env.example`):

| Variabel | Fungsi |
| --- | --- |
| `YOUTUBE_API_KEY` | API key YouTube Data API v3 (hanya dipakai di server) |
| `YOUTUBE_ALLOWED_CHANNELS` | Channel ID yang boleh diproses `/api/youtube`, pisahkan dengan koma |
| `ADMIN_PASSWORD` | Password login `/admin` |
| `ADMIN_SESSION_SECRET` | Secret panjang untuk menandatangani cookie sesi admin |
| `ADMIN_GATE_KEY` | Kode rahasia gerbang admin (min. 16 karakter). **Wajib**: tanpa ini admin tertutup total |
| `ADMIN_PATH` | Alamat admin, mis. `panel-7k2xq9`. Kosong = `admin` |
| `BLOB_READ_WRITE_TOKEN` | Otomatis ada setelah Vercel Blob di-connect ke project |
| `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` | (disarankan) penyimpan hitungan rate limit yang dipakai bersama semua instance. `KV_REST_API_URL`/`KV_REST_API_TOKEN` juga dikenali |
| `NEXT_PUBLIC_SITE_URL` | (opsional) domain utama, default `https://epengtps.web.id` |

Setelah mengubah env di Vercel, lakukan redeploy.

## Deploy ke Vercel

1. Ganti isi repo dengan folder ini (hapus file lama: `*.html`, `api/`, `admin/`, `assets/app/`, `script.js`, `style.css`, `vercel.json`).
2. Push. Vercel otomatis mendeteksi Next.js, tidak perlu pengaturan build khusus.
3. Pastikan env di atas sudah ada, lalu deploy.

## Struktur

```
app/
  layout.js            root layout (font, script tema)
  globals.css          CSS lama (style.css)
  (site)/              halaman publik: /, /promote, /partners, /servers
  admin/               admin panel berbasis form (React), dibuka lewat ADMIN_PATH
  api/config           config publik
  api/admin            login/logout + baca/simpan config (Vercel Blob)
  api/youtube          muat ulang video (allowlist channel + rate limit)
  robots.js sitemap.js
components/            komponen UI (server & client)
lib/                   config+cache, URL aman, metadata/SEO, sanitasi, YouTube server, rate limit
data/
  default-config.json  config bawaan (dipakai kalau Blob belum diisi)
  jsonld/              structured data per halaman
public/                logo, banner, ikon, site.webmanifest
middleware.js          gerbang admin (kode rahasia + cookie)
next.config.mjs        security header + CSP + redirect (pengganti vercel.json)
```

## Cara kerja

**Config & cache.** Halaman publik dibuat statis lalu diperbarui (ISR). Config dibaca dari Vercel Blob (fallback `data/default-config.json`) dan di-cache dengan tag `site-config`. Saat admin menekan Simpan, tag itu di-revalidate sehingga halaman langsung diperbarui; pengaman tambahan: paling lama 5 menit. Kalau Blob sedang error, hasilnya tidak ikut ter-cache.

**Video YouTube.** Diambil di server (`lib/youtube-server.js`) dan ikut masuk HTML, jadi pengunjung tidak menunggu skeleton dan tidak memicu panggilan API. Hasilnya di-cache 15 menit per channel (1 request per channel, memakai playlist uploads `UU…` langsung). Browser hanya memanggil `/api/youtube` saat tombol "muat ulang" ditekan. Channel harus ada di `YOUTUBE_ALLOWED_CHANNELS`. Opsi `video.cache` di config sudah tidak dipakai.

**Rate limit** (`lib/rate-limit.js`).
- Login admin: 8 percobaan per 15 menit per IP, dihitung ulang dari nol setelah login berhasil, plus jeda 0,5 detik setiap gagal.
- `/api/youtube`: 30 permintaan/menit per IP; muat ulang paksa 5/menit.
- Dengan Upstash Redis hitungan dibagi ke semua instance. Tanpa Upstash dipakai memori per-instance (kurang kuat). Kalau Redis down, otomatis kembali ke memori.

**Desain.** Semua gaya ada di satu file, `app/globals.css`: token warna (terang dan gelap) di bagian atas, komponen di bawahnya. Untuk mengganti warna ungu cukup ubah `--accent`, `--accent-solid`, dan `--accent-soft`. Font memakai Instrument Sans (dimuat di `app/layout.js`). Animasi dimatikan otomatis untuk pengguna dengan `prefers-reduced-motion`. Halaman admin (`app/admin`) punya CSS sendiri dan tidak ikut berubah.

**Gambar.** Ikon, logo, dan banner di `public/assets` sudah diperkecil sesuai ukuran tampilnya. Logo lokal memakai `next/image` dan banner memakai optimizer Next (`/_next/image`, WebP). Gambar dari URL luar tetap `<img>` biasa.

**Gerbang admin** (`middleware.js`). Halaman admin dan `/api/admin` hanya ada untuk browser yang membawa cookie gerbang; selain itu jawabannya 404 biasa. Alamat `/admin` asli juga ditutup kalau `ADMIN_PATH` diganti. Cara masuk: buka `/<ADMIN_PATH>?key=<ADMIN_GATE_KEY>` sekali, lalu cookie `httpOnly` berlaku 7 hari dan kamu diarahkan ke `/<ADMIN_PATH>` tanpa kode di URL. Tebakan kode dibatasi 10 kali per 15 menit per IP. Mengganti `ADMIN_GATE_KEY` atau `ADMIN_PATH` mencabut semua cookie gerbang yang sudah ada. Setelah itu tetap ada login password dan batas percobaannya.

**Admin.** Form per bagian: Halaman, Situs & SEO, Promote, Server, Partner, Video, plus Advanced JSON untuk sisanya (tombol menu beranda, navigasi footer, ikon link server, video cadangan). Isian divalidasi (URL aman, ID unik, Channel ID) dan ada peringatan kalau menutup halaman sebelum menyimpan.

**Keamanan.** Semua URL dari config dibersihkan di server (`lib/safe-url.js`) sebelum masuk ke HTML. Halaman yang dimatikan menampilkan "Segera Tersedia", `noindex`, dan keluar dari `sitemap.xml`. `/api/config` tetap ada (isinya sama seperti sebelumnya).
