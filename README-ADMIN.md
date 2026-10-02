# Epen GTPS — Admin Panel

Admin panel untuk mengubah konfigurasi website tanpa mem-publish `settings.js`.

## Vercel Environment Variables

Tambahkan di Project Settings → Environment Variables:

- `ADMIN_PASSWORD` — password login admin.
- `ADMIN_SESSION_SECRET` — random secret panjang untuk menandatangani session cookie.

## Vercel Blob

Buat/connect Vercel Blob Storage pada project dan pastikan environment variable `BLOB_READ_WRITE_TOKEN` tersedia. Config yang sudah disimpan akan berada di Blob private, bukan file publik.

## Akses

- Admin: `/admin/`
- Public config API: `/api/config`
- Admin API: `/api/admin`

`/api/config` memang dapat dibaca browser karena website membutuhkan konfigurasi untuk render. Endpoint itu tidak berisi password/API key.

## Yang bisa diatur

- Status halaman ON/OFF
- Site identity
- SEO
- Footer
- Action buttons
- Promote packages
- Server directory
- Partner data
- Video settings
- Banner partner
- Link sosial

Untuk perubahan lengkap gunakan tab **Advanced JSON**.

## Catatan keamanan

Jangan memasukkan API key, password, token, atau secret ke site config. Secret tetap gunakan Environment Variables dan server-side API.
