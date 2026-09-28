# Epen GTPS v6.7

## Pengaturan button dari `settings.js`

Semua button utama di halaman `index.html` sekarang dibuat otomatis dari:

```js
window.EPEN_CONFIG.site.actionButtons
```

Contoh:

```js
actionButtons: [
  {
    id: 'discord',
    category: 'Community',
    title: 'Discord Community',
    url: 'https://discord.com/username',
    iconUrl: '',
    icon: 'discord',
    target: '_blank'
  },
  {
    id: 'telegram',
    category: 'Community',
    title: 'Telegram Community',
    url: 'https://t.me/example',
    iconUrl: '',
    icon: 'link',
    target: '_blank'
  }
]
```

### Field

- `id`: ID unik button.
- `category`: teks kecil di atas judul.
- `title`: teks utama button.
- `url`: link tujuan saat button diklik. Bisa URL eksternal, `#videos`, atau halaman seperti `partners.html`.
- `iconUrl`: URL gambar icon. Kosongkan jika ingin memakai SVG fallback.
- `icon`: fallback SVG. Pilihan bawaan: `discord`, `whatsapp`, `users`, `network`, `play`, `video`, `link`.
- `target`: gunakan `_blank` untuk tab baru atau `_self` untuk halaman yang sama.

### Menambah button baru

Cukup tambahkan object baru ke array `actionButtons`. Tidak perlu mengubah `index.html` atau `script.js`.

```js
{
  id: 'website',
  category: 'Official',
  title: 'Website Epen',
  url: 'https://example.com',
  iconUrl: 'https://example.com/icon.png',
  icon: 'link',
  target: '_blank'
}
```

Button akan muncul otomatis sesuai urutan object di array.

## Gambar utama

```js
site: {
  logoUrl: 'https://example.com/logo.png',
  bannerUrl: 'https://example.com/banner.jpg'
}
```

Banner mengikuti rasio gambar asli dan tidak dicrop.

## YouTube API

API key tetap disimpan di Vercel Environment Variables sebagai `YOUTUBE_API_KEY` dan tidak dimasukkan ke `settings.js`.
