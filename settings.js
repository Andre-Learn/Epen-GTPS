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
    logoUrl: "https://cdn.discordapp.com/attachments/1371532839132205089/1553968672727371806/Proyek_Baru_25_A36F6C3.png?ex=6abb2d9a&is=6ab9dc1a&hm=a236a0a6c6ce5b0026f57613088fa29fd0e14b8f18d48f63050d6b92486602db&",
    bannerUrl: "https://cdn.discordapp.com/attachments/1371532839132205089/1553968672182239233/Proyek_Baru_33_01976A3.png?ex=6abb2d9a&is=6ab9dc1a&hm=c51123abaa001a4ddb9941448c78bc8f1861ac5c87e590e52f635ed170996f96&"
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
