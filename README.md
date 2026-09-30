# Epen GTPS v7.0

Perubahan v7.0:
- Partner search/filter dari `settings.js`.
- YouTube loading skeleton saat feed sedang dimuat.
- Favicon dan metadata SEO/social preview dapat diatur dari `settings.js`.
- `actionButtons` menjadi satu-satunya sistem action button; legacy `actionIcons` / `actionIconFallback` sudah dihapus.

## Partner search
Atur di `settings.js`:
```js
partnerSearch: {
  enabled: true,
  placeholder: 'Cari partner...'
}
```

## SEO / favicon
```js
site: {
  name: 'Epen GTPS',
  description: 'Deskripsi website...',
  logoUrl: 'https://example.com/logo.png',
  bannerUrl: 'https://example.com/banner.jpg',
  faviconUrl: 'https://example.com/favicon.png',
  ogImageUrl: 'https://example.com/share-image.jpg'
}
```
`faviconUrl` dipakai untuk favicon browser. `ogImageUrl` dipakai untuk Open Graph/Twitter metadata di browser. Untuk preview sosial crawler yang tidak menjalankan JavaScript, nilai OG idealnya juga dicantumkan langsung di HTML saat deployment.

## Loading skeleton
Skeleton otomatis muncul sebelum data YouTube selesai dimuat, baik di video Epen maupun video partner.


## v7.1 changes

- YouTube video cache in `localStorage`, configurable from `settings.js` via `video.cache`. Default: 5 minutes.
- Manual refresh buttons bypass the browser cache and request fresh data.
- Stale cached videos can be shown when YouTube/API is temporarily unavailable.
- YouTube loading skeletons are shown for the main feed and partner feeds.
- Favicon and Open Graph/Twitter metadata remain configurable from `settings.js` using `faviconUrl` and `ogImageUrl`.
- Removed the partner search feature from the previous v7.0 build because it was not requested.


## v7.6 Footer
Footer scene/image dihapus. Footer sekarang menggunakan layout clean berbasis surface/card ala SkillUI, responsive untuk mobile dan desktop.


## v7.7 — Global Footer
- Footer global dirender dari `script.js` ke `<footer data-site-footer></footer>` pada setiap halaman.
- Logo, nama, deskripsi, dan menu footer dikonfigurasi dari `settings.js` melalui `site.footerNav` dan `site.footerDescription`.
- Menu default: Home, Partner, Discord, WhatsApp.
- Untuk halaman baru, cukup tambahkan `<footer class="footer" data-site-footer></footer>` sebelum script `settings.js` dan `script.js`.
