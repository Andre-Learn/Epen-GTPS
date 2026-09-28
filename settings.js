window.EPEN_CONFIG = {
  site: {
    name: 'Epen GTPS',

    // ================================
    // GAMBAR UTAMA WEBSITE
    // ================================
    // Isi dengan URL gambar. Contoh:
    // logoUrl: 'https://example.com/logo.png',
    // bannerUrl: 'https://example.com/banner.jpg',
    //
    // Bisa diganti kapan saja tanpa mengedit HTML.
    logoUrl: '',
    bannerUrl: ''
  },

  video: {
    // Jumlah video yang tampil pertama kali.
    initialLimit: 6,
    // Jumlah video tambahan saat Show More belum memakai lazy-load per batch,
    // tetapi nilai ini disiapkan untuk pengembangan berikutnya.
    pageSize: 6,
    // Jumlah video maksimum yang diminta dari YouTube untuk satu feed.
    fetchLimit: 24
  },

  epen: {
    // Isi dengan Channel ID YouTube Epen GTPS.
    // Contoh: 'UCxxxxxxxxxxxxxxxxxxxxxx'
    youtubeChannelId: "UCg8u_12KwZlZn9ZhWM_TExw",

    // Fallback jika API belum dikonfigurasi / channel ID masih kosong.
    videos: [
      { title: 'Video Epen GTPS #1', videoId: 'dQw4w9WgXcQ', meta: 'Epen GTPS' },
      { title: 'Video Epen GTPS #2', videoId: 'dQw4w9WgXcQ', meta: 'Epen GTPS' },
      { title: 'Video Epen GTPS #3', videoId: 'dQw4w9WgXcQ', meta: 'Epen GTPS' },
      { title: 'Video Epen GTPS #4', videoId: 'dQw4w9WgXcQ', meta: 'Epen GTPS' }
    ]
  },

  partners: [
    {
      id: 'gtps-nusantara',
      name: 'GTPS Nusantara',
      short: 'GN',
      tagline: 'Komunitas GTPS Indonesia',
      description: 'Komunitas untuk berbagi informasi server, event, update, dan diskusi seputar dunia GTPS.',
      logo: '',
      banner: '',
      links: {
        whatsapp: 'https://wa.me/',
        discord: 'https://discord.com/',
        youtube: 'https://youtube.com/'
      },
      youtubeChannelId: '',
      videos: [
        { title: 'GTPS Community Update', videoId: 'dQw4w9WgXcQ', meta: 'GTPS Nusantara' },
        { title: 'GTPS Setup & Showcase', videoId: 'dQw4w9WgXcQ', meta: 'GTPS Nusantara' }
      ]
    },
    {
      id: 'growtopia-project',
      name: 'Growtopia Project',
      short: 'GP',
      tagline: 'Project & server community',
      description: 'Tempat menemukan project, server, dan creator yang aktif di ekosistem GTPS.',
      logo: '',
      banner: '',
      links: {
        whatsapp: 'https://wa.me/',
        discord: 'https://discord.com/',
        youtube: 'https://youtube.com/'
      },
      youtubeChannelId: '',
      videos: [
        { title: 'Project Showcase', videoId: 'dQw4w9WgXcQ', meta: 'Growtopia Project' },
        { title: 'Community Highlights', videoId: 'dQw4w9WgXcQ', meta: 'Growtopia Project' }
      ]
    },
    {
      id: 'gtps-creator',
      name: 'GTPS Creator',
      short: 'GC',
      tagline: 'Creator & tutorial network',
      description: 'Kumpulan creator yang membagikan tutorial, resource, dan konten GTPS.',
      logo: '',
      banner: '',
      links: {
        whatsapp: 'https://wa.me/',
        discord: 'https://discord.com/',
        youtube: 'https://youtube.com/'
      },
      youtubeChannelId: '',
      videos: [
        { title: 'Creator Tutorial', videoId: 'dQw4w9WgXcQ', meta: 'GTPS Creator' },
        { title: 'GTPS Tips', videoId: 'dQw4w9WgXcQ', meta: 'GTPS Creator' }
      ]
    }
  ]
};
