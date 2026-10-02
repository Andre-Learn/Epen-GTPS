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
    logoUrl: "/assets/logo.png",
    bannerUrl: "/assets/banner.png",
    
     // =====================================
    // SEO / SOCIAL PREVIEW
    // =====================================
    description: 'Epen GTPS — Growtopia private server creator, community, videos, promoter, and partner network.',
    footerDescription: 'Community, creator, dan partner network.',
    faviconUrl: '/assets/logo.png',
    ogImageUrl: '/assets/banner.png',

    // =====================================
    // GLOBAL FOOTER
    // =====================================
    // Footer ini dipakai otomatis di semua halaman yang memiliki
    // <footer data-site-footer></footer>.
    // Untuk menambah/mengubah menu, cukup edit daftar di bawah.
    footerNav: [
      { id: 'home', label: 'Home', url: '/', target: '_self' },
      { id: 'partners', label: 'Partner', url: '/partners', target: '_self' },
      { id: 'discord', label: 'Discord', url: 'https://discord.gg/aWBz8tn6QK', target: '_blank' },
      { id: 'whatsapp', label: 'WhatsApp', url: 'https://whatsapp.com/channel/0029VbDsLl9LNSZxidjstX2E', target: '_blank' }
    ],

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
    // =====================================
    // PROMOTE GTPS / PRICE LIST
    // =====================================
    promote: {
      enabled: true,
      title: 'Price Promote GTPS',
      description: 'Promosikan server GTPS kamu bersama Epen GTPS.',
      packages: [
        {
          id: 'normal',
          name: 'Normal',
          price: 'Rp5.000',
          description: 'Harga terjangkau dan cocok untuk server baru.',
          features: ['Slowlest upload', 'Di proses sesuai antrian', 'Harga paling terjangkau'],
          popular: false,
          url: 'https://discord.gg/aWBz8tn6QK',
          button: 'Pesan Sekarang'
        },
        {
          id: 'skip',
          name: 'Skip',
          price: 'Rp7.000',
          description: 'Mendapatkan prioritas terlebih dahulu.',
          features: ['Faster upload', 'Di proses lebih cepat', 'Prioritas upload'],
          popular: true,
          url: 'https://discord.gg/aWBz8tn6QK',
          button: 'Pesan Sekarang'
        },
        {
          id: 'ms',
          name: 'Mega Skip',
          price: 'Rp15.000',
          description: 'Mendapatkan prioritas upload paling tinggi.',
          features: ['High faster uploaf ', 'Di proses paling cepat', 'Prioritas upload lebih tinggi'],
          popular: true,
          url: 'https://discord.gg/aWBz8tn6QK',
          button: 'Pesan Sekarang'
        },
        {
          id: 'skipall',
          name: 'Skip All',
          price: 'Rp??.000',
          description: 'Skip semua antrian, untuk harga chat Epen.',
          features: ['Super faster uploaf ', 'Skip semua antrian', 'Prioritas upload paling tinggi'],
          popular: true,
          url: 'https://discord.gg/aWBz8tn6QK',
          button: 'Pesan Sekarang'
        }
      ]
    },

    // =====================================
    // SERVER GTPS DIRECTORY
    // =====================================
    // Tambahkan object baru untuk setiap server GTPS.
    // Icon link pada popup server. Kosongkan URL jika ingin memakai fallback bawaan.
    serverLinkIcons: {
      whatsapp: '/assets/icons/whatsapp.png',
      discord: '/assets/icons/discord.png'
    },

    // whatsapp / discord / host akan muncul di popup saat server dipilih.
    servers: [
      {
        id: 'nova',
        name: 'Nova Ps',
        logo: 'https://a.top4top.io/p_3926ju9oh1.jpg',
        status: 'Online',
        description: 'Growtopia private server terbaru 2026.',
        whatsapp: 'https://chat.whatsapp.com/Hh2XwUpwaVyE2cPIkuZuXi?s=cl&p=a&mlu=4&ilr=4',
        discord: 'https://discord.gg/nzmHvWMTG',
        host: 'https://gtpshosting.web.id/how-to-play/NovaPs'
      },
      {
        id: 'tera',
        name: 'Tera Ps',
        logo: 'https://i.top4top.io/p_3926n9vtm1.jpg',
        status: 'Online',
        description: 'Growtopia private server terbaru 2026.',
        whatsapp: 'https://chat.whatsapp.com/KxCNIaXCYlPBKFO1Cpw2LH?mode=gi_t',
        discord: 'https://discord.gg/9AgqrZ7aYu',
        host: 'https://gtpshosting.web.id/how-to-play/TeraPS'
      },
      {
        id: 'draco',
        name: 'Draco Ps',
        logo: 'https://a.top4top.io/p_392669yva1.jpg',
        status: 'Online',
        description: 'Growtopia private server terbaru 2026.',
        whatsapp: 'https://chat.whatsapp.com/FavXmPnPOtd4ZFe15xuZDC',
        discord: '',
        host: 'https://gtpshosting.web.id/how-to-play/DracoPs'
      },
      {
        id: 'growy',
        name: 'Growy',
        logo: 'https://d.uguu.se/yywAMbxZ.jpg',
        status: 'Online',
        description: 'Growtopia private server terbaru 2026.',
        whatsapp: 'https://chat.whatsapp.com/JQDaqkILa8i6k6v45Xod7K',
        discord: 'https://discord.gg/Mz9Aerw8f',
        host: 'https://fyrefly.tech/how-to-play/Growy'
      },
      {
        id: 'sniff',
        name: 'Sniff Ps',
        logo: 'https://l.top4top.io/p_3926rdvye1.jpg',
        status: 'Online',
        description: 'Growtopia private server terbaru 2026.',
        whatsapp: 'https://chat.whatsapp.com/BtUM9L4pDMZKW7p1sqd9fk',
        discord: 'https://discord.gg/TCVBaYS7F7',
        host: 'https://dash.gtps.cloud/how-to-play/8564'
      }
    ],

    actionButtons: [
      {
        id: 'discord',
        category: 'Promote',
        title: 'Buy Promote GTPS',
        url: 'https://discord.gg/aWBz8tn6QK',
        iconUrl: '/assets/icons/discord.png',
        icon: 'discord',
        target: '_blank'
      },
      {
        id: 'whatsapp',
        category: 'Information',
        title: 'Information Giveaway',
        url: 'https://whatsapp.com/channel/0029VbDsLl9LNSZxidjstX2E',
        iconUrl: '/assets/icons/whatsapp.png',
        icon: 'whatsapp',
        target: '_blank'
      },
      {
        id: 'partners',
        category: 'Network',
        title: 'Lihat Partner Kami',
        url: '/partners',
        iconUrl: '/assets/icons/partners.png',
        icon: 'users',
        target: '_self'
      },
      {
        id: 'servers',
        category: 'Network',
        title: 'Lihat Server GTPS',
        url: '/servers',
        iconUrl: '',
        icon: 'network',
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
      logo: '/assets/partners/vincent-logo.png',
      banner: '/assets/partners/vincent-banner.png',
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
