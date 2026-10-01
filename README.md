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
