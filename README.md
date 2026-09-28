# Epen GTPS — YouTube Auto Feed

## Konfigurasi utama
Semua konfigurasi konten ada di `settings.js`:
- `epen.youtubeChannelId` = Channel ID YouTube Epen GTPS
- `partners[].youtubeChannelId` = Channel ID YouTube masing-masing partner
- `video.initialLimit` = jumlah video awal
- `video.fetchLimit` = jumlah maksimum video yang diambil dari YouTube
- logo, banner, link, nama, deskripsi partner juga ada di file ini.

## Keamanan API key
Jangan masukkan API key YouTube ke `settings.js` atau file frontend.

Di Vercel buka:
**Project → Settings → Environment Variables**

Tambahkan:
`YOUTUBE_API_KEY=API_KEY_KAMU`

Vercel Function di `api/youtube.js` membaca key tersebut dari `process.env.YOUTUBE_API_KEY`.

## Cara kerja video
Browser → `/api/youtube` → Vercel Function → YouTube Data API → data video → card website.

Website menampilkan 4 video pertama. Jika lebih banyak, tombol **Show More** akan muncul.

## Catatan
Jika `youtubeChannelId` masih kosong atau API gagal, website memakai data fallback di `settings.js`, sehingga halaman tetap bisa tampil.
