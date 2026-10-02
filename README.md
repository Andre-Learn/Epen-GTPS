# Epen GTPS v9.6 — Security Hardening

Versi ini mempertahankan fitur v9.5 dan menambah hardening keamanan.

## Vercel Environment Variables

Wajib ada:

- `YOUTUBE_API_KEY` — API key YouTube Data API v3. Jangan taruh di `settings.js`.
- `YOUTUBE_ALLOWED_CHANNELS` — daftar Channel ID YouTube yang boleh diproses endpoint, dipisahkan koma.

Channel yang saat ini dipakai Epen GTPS:

```text
UCg8u_12KwZlZn9ZhWM_TExw,UCz9raHwx9TleY6VcZiIjmDA,UCakFHiJ1Q_3zoc81-71EMJQ
```

Setelah mengubah Environment Variables di Vercel, lakukan redeploy agar Function mendapatkan nilai baru.

## Hardening yang ditambahkan

- Validasi URL untuk link, logo, banner, favicon, dan icon eksternal.
- Menolak URL berbahaya seperti `javascript:` dan protocol-relative URL.
- Validasi YouTube Channel ID dan Video ID di backend.
- Endpoint YouTube fail-closed jika allowlist channel belum dikonfigurasi.
- Rate limit dasar per IP dengan batas memory tracking.
- Response error backend tidak membocorkan pesan mentah dari Google API.
- Security headers tambahan di Vercel.
- CSP diperketat untuk menolak iframe dan inline event handler.
- Output konfigurasi tetap di-escape sebelum dimasukkan ke HTML.


## Mengaktifkan / menonaktifkan halaman
Atur `pages` di `settings.js`. Contoh `promote: { enabled: false }` akan membuat `/promote` menampilkan halaman **Segera Tersedia** dan otomatis memakai `noindex, nofollow`. Link footer dan tombol internal menuju halaman yang dimatikan juga otomatis disembunyikan.


## Partner Banner Template
Partner banner mendukung dua mode melalui `settings.js`: `custom` untuk gambar sendiri dan `template` untuk banner otomatis Epen GTPS. Template memakai rasio **1600x500** dan otomatis menampilkan nama partner serta tagline.

Contoh:
```js
bannerMode: 'template',
bannerTemplate: {
  style: 'signature', // signature atau midnight
  eyebrow: 'EPEN GTPS PARTNER',
  showLogo: true
}
```
Untuk banner sendiri:
```js
bannerMode: 'custom',
banner: '/assets/partners/nama-banner.png'
```
