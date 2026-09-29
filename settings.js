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
    bannerUrl: "https://cdn.discordapp.com/attachments/1371532839132205089/1553968672182239233/Proyek_Baru_33_01976A3.png?ex=6abb2d9a&is=6ab9dc1a&hm=c51123abaa001a4ddb9941448c78bc8f1861ac5c87e590e52f635ed170996f96&",
    
     // =====================================
    // SEO / SOCIAL PREVIEW
    // =====================================
    description: 'Epen GTPS — Growtopia private server creator, community, videos, promoter, and partner network.',
    faviconUrl: 'https://cdn.discordapp.com/attachments/1371532839132205089/1553968672727371806/Proyek_Baru_25_A36F6C3.png?ex=6abb2d9a&is=6ab9dc1a&hm=a236a0a6c6ce5b0026f57613088fa29fd0e14b8f18d48f63050d6b92486602db&',
    ogImageUrl: 'https://cdn.discordapp.com/attachments/1371532839132205089/1553968672182239233/Proyek_Baru_33_01976A3.png?ex=6abb2d9a&is=6ab9dc1a&hm=c51123abaa001a4ddb9941448c78bc8f1861ac5c87e590e52f635ed170996f96&',
    footerSceneUrl: 'https://cdn.discordapp.com/attachments/1371532839132205089/1554536722149146797/Proyek_Baru_37_F85454B.png?ex=6abd3ea4&is=6abbed24&hm=56ace0f3996d59a5170ea5135bdba8631256da2aa2da1a71326a385359ca0547&',

    // =====================================
    // BUTTON UTAMA
    // =====================================
    // Semua button di halaman utama dibuat dari daftar ini.
    // Mau tambah button baru? Cukup copy salah satu object lalu ubah isinya.
    //
    // iconUrl  : URL gambar icon. Kosongkan untuk memakai SVG fallback.
    // icon     : nama SVG fallback: discord, whatsapp, users, network,
    //            play, video, link.
    // url      : tujuan saat button diklik. Bisa URL, #section, atau halaman.
    // target   : '_blank' untuk tab baru atau '_self' untuk halaman yang sama.
    actionButtons: [
      {
        id: 'discord',
        category: 'Promote',
        title: 'Buy Promote GTPS',
        url: 'https://discord.gg/aWBz8tn6QK',
        iconUrl: 'https://cdn.discordapp.com/attachments/1371532839132205089/1553999265045549106/Proyek_Baru_34_A5DF0C3.png?ex=6abb4a18&is=6ab9f898&hm=c22e9f7204f471acd25f42b9801ca9052817eb07b98cd3b92fefdbd9de35b873&',
        icon: 'discord',
        target: '_blank'
      },
      {
        id: 'whatsapp',
        category: 'Information',
        title: 'Information Giveaway',
        url: 'https://whatsapp.com/channel/0029VbDsLl9LNSZxidjstX2E',
        iconUrl: 'https://cdn.discordapp.com/attachments/1371532839132205089/1553999977171124244/Proyek_Baru_34_9035CD4.png?ex=6abb4ac2&is=6ab9f942&hm=07abe93aed1a87dbcf9b474b742e9ab163ba376dfe794970b1855da10e223cb0&',
        icon: 'whatsapp',
        target: '_blank'
      },
      {
        id: 'partners',
        category: 'Network',
        title: 'Lihat Partner Kami',
        url: 'partners.html',
        iconUrl: 'https://cdn.discordapp.com/attachments/1371532839132205089/1553999263950704701/Proyek_Baru_34_71025E1.png?ex=6abb4a18&is=6ab9f898&hm=411ae74772552863879ae5b1c6888511a7bfd4db57b378f9509a3ccc9d2671e0&',
        icon: 'users',
        target: '_self'
      },
      {
        id: 'videos',
        category: 'Content',
        title: 'Lihat Video Epen GTPS',
        url: '#videos',
        iconUrl: '',
        icon: 'play',
        target: '_self'
      }
    ]
  },

  video: {
    // Jumlah video yang tampil pertama kali.
    initialLimit: 6,
    // Jumlah video tambahan saat Show More belum memakai lazy-load per batch,
    // tetapi nilai ini disiapkan untuk pengembangan berikutnya.
    pageSize: 6,
    // Jumlah video maksimum yang diminta dari YouTube untuk satu feed.
    fetchLimit: 24,
    
    cache: {
      enabled: true,
      duration: 1800000,
      useStaleOnError: true
    }
  },

  epen: {
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
      id: 'Vincent',
      name: 'Vincent GTPS',
      short: 'GN',
      tagline: 'Promoter GTPS',
      description: 'Subscribe = 1 Account Free.',
      logo: 'https://cdn.discordapp.com/attachments/1371532839132205089/1553968672727371806/Proyek_Baru_25_A36F6C3.png?ex=6abb2d9a&is=6ab9dc1a&hm=a236a0a6c6ce5b0026f57613088fa29fd0e14b8f18d48f63050d6b92486602db&',
      banner: 'https://cdn.discordapp.com/attachments/1371532839132205089/1553968672182239233/Proyek_Baru_33_01976A3.png?ex=6abb2d9a&is=6ab9dc1a&hm=c51123abaa001a4ddb9941448c78bc8f1861ac5c87e590e52f635ed170996f96&',
      links: {
        whatsapp: 'https://wa.me/',
        discord: 'https://discord.com/',
        youtube: 'https://youtube.com/'
      },
      videoLimit: 4,
      youtubeChannelId: 'UCz9raHwx9TleY6VcZiIjmDA',
      videos: [
        { title: 'GTPS Community Update', videoId: 'dQw4w9WgXcQ', meta: 'GTPS Nusantara' },
        { title: 'GTPS Setup & Showcase', videoId: 'dQw4w9WgXcQ', meta: 'GTPS Nusantara' }
      ]
    },
    {
      id: 'Dora',
      name: 'Dora GTPS',
      short: 'D',
      tagline: 'Promoter GTPS',
      description: '',
      logo: '',
      banner: '',
      links: {
        whatsapp: 'https://wa.me/',
        discord: 'https://discord.com/',
        youtube: 'https://youtube.com/'
      },
      videoLimit: 4,
      youtubeChannelId: 'UCakFHiJ1Q_3zoc81-71EMJQ',
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
      videoLimit: 4,
      youtubeChannelId: '',
      videos: [
        { title: 'Creator Tutorial', videoId: 'dQw4w9WgXcQ', meta: 'GTPS Creator' },
        { title: 'GTPS Tips', videoId: 'dQw4w9WgXcQ', meta: 'GTPS Creator' }
      ]
    }
  ]
};
