window.EPEN_CONFIG = {
  // =====================================
  // STATUS HALAMAN
  // =====================================
  // Atur halaman mana yang sedang aktif.
  // enabled: false akan menampilkan halaman
  // "Segera Tersedia" dan otomatis memberi noindex.
  // Kamu cukup mengubah true/false di sini.
  pages: {
    home: {
      enabled: true,
      maintenanceTitle: 'Segera Tersedia',
      maintenanceDescription: 'Halaman utama Epen GTPS sedang disiapkan. Silakan kembali lagi nanti.'
    },
    promote: {
      enabled: true,
      maintenanceTitle: 'Promote GTPS Segera Tersedia',
      maintenanceDescription: 'Halaman jasa promote GTPS sedang dalam tahap persiapan. Silakan kembali lagi nanti.'
    },
    partners: {
      enabled: true,
      maintenanceTitle: 'Partner Segera Tersedia',
      maintenanceDescription: 'Halaman partner dan promoter GTPS sedang dalam tahap persiapan. Silakan kembali lagi nanti.'
    },
    servers: {
      enabled: true,
      maintenanceTitle: 'Server GTPS Segera Tersedia',
      maintenanceDescription: 'Direktori server GTPS sedang dalam tahap persiapan. Silakan kembali lagi nanti.'
    }
  },

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
    description: 'Epen GTPS — channel YouTube dan platform jasa promote GTPS, jaringan promoter, serta direktori server Growtopia Private Server Indonesia.',
    footerDescription: 'Jasa promote GTPS, jaringan promoter, dan direktori server Growtopia.',
    faviconUrl: '/assets/favicon-48.png',
    ogImageUrl: '/assets/banner.png',

    // =====================================
    // SEO PER HALAMAN
    // =====================================
    pageSEO: {
      home: {
        title: 'Epen GTPS — Promote GTPS & Server GTPS Indonesia',
        description: 'Epen GTPS adalah platform promosi GTPS Indonesia untuk membantu pemilik Growtopia Private Server mempromosikan server, menemukan partner, dan menjelajahi daftar server GTPS.',
        keywords: 'Epen GTPS, promote GTPS, jasa promote GTPS, GTPS Indonesia, server GTPS, Growtopia Private Server, promoter GTPS',
        ogTitle: 'Epen GTPS — Promote GTPS & Server GTPS Indonesia',
        ogDescription: 'Platform Epen GTPS untuk promosi server GTPS, menemukan partner dan promoter, serta menjelajahi daftar Growtopia Private Server Indonesia.'
      },
      promote: {
        title: 'Jasa Promote GTPS Indonesia — Epen GTPS',
        description: 'Promosikan server Growtopia Private Server kamu bersama Epen GTPS. Pilih paket jasa promote GTPS dan hubungi Epen GTPS untuk memulai promosi.',
        keywords: 'jasa promote GTPS, promote GTPS, promote server GTPS, jasa promosi GTPS, GTPS Indonesia, Epen GTPS',
        ogTitle: 'Jasa Promote GTPS Indonesia — Epen GTPS',
        ogDescription: 'Pilih paket jasa promote GTPS untuk membantu server Growtopia Private Server kamu dikenal oleh pemain dan komunitas.'
      },
      partners: {
        title: 'Partner & Promoter GTPS Indonesia — Epen GTPS',
        description: 'Temukan partner dan promoter GTPS di Epen GTPS beserta profil, komunitas, dan konten mereka untuk kebutuhan promosi Growtopia Private Server.',
        keywords: 'partner GTPS, promoter GTPS, creator GTPS, promoter Growtopia, Epen GTPS',
        ogTitle: 'Partner & Promoter GTPS Indonesia — Epen GTPS',
        ogDescription: 'Daftar partner dan promoter GTPS Epen GTPS beserta profil, komunitas, dan konten yang tersedia.'
      },
      servers: {
        title: 'Daftar Server GTPS Indonesia — Growtopia Private Server | Epen GTPS',
        description: 'Cari dan jelajahi daftar server GTPS Indonesia di Epen GTPS. Lihat status, deskripsi, dan tautan komunitas server yang tersedia.',
        keywords: 'server GTPS, server GTPS Indonesia, daftar GTPS, Growtopia Private Server, GTPS Indonesia, Epen GTPS',
        ogTitle: 'Daftar Server GTPS Indonesia — Epen GTPS',
        ogDescription: 'Direktori server GTPS Epen GTPS untuk membantu pemain menemukan Growtopia Private Server dan informasi komunitasnya.'
      }
    },

    // =====================================
    // GLOBAL FOOTER
    // =====================================
    // Footer ini dipakai otomatis di semua halaman yang memiliki
    // <footer data-site-footer></footer>.
    // Untuk menambah/mengubah menu, cukup edit daftar di bawah.
    footerNav: [
      { id: 'home', label: 'Home', url: '/', target: '_self' },
      { id: 'promote', label: 'Promote', url: '/promote', target: '_self' },
      { id: 'partners', label: 'Partner', url: '/partners', target: '_self' },
      { id: 'servers', label: 'Server GTPS', url: '/servers', target: '_self' },
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
          description: 'Pilihan hemat untuk memperkenalkan server kamu kepada pemain dan komunitas GTPS.',
          features: ['Promosi melalui antrean reguler', 'Diproses sesuai urutan pembelian', 'Pilihan hemat untuk memperkenalkan server', 'Server ditampilkan di website Epen GTPS'],
          popular: false,
          url: 'https://discord.gg/aWBz8tn6QK',
          button: 'Pesan Sekarang'
        },
        {
          id: 'skip',
          name: 'Skip',
          price: 'Rp7.000',
          description: 'Dapatkan prioritas lebih tinggi agar promosi server kamu dapat diproses lebih cepat.',
          features: ['Promosi dengan prioritas lebih tinggi', 'Diproses lebih cepat dari antrean reguler', 'Cocok untuk server yang ingin segera dipromosikan', 'Server ditampilkan di website Epen GTPS'],
          popular: true,
          url: 'https://discord.gg/aWBz8tn6QK',
          button: 'Pesan Sekarang'
        },
        {
          id: 'ms',
          name: 'Mega Skip',
          price: 'Rp15.000',
          description: 'Pilihan untuk server yang ingin mendapatkan exposure lebih cepat dengan prioritas tinggi.',
          features: ['Promosi dengan prioritas tinggi', 'Proses lebih cepat untuk mengurangi waktu antre', 'Cocok untuk server yang ingin mendapatkan exposure lebih cepat', 'Server ditampilkan di website Epen GTPS'],
          popular: false,
          url: 'https://discord.gg/aWBz8tn6QK',
          button: 'Pesan Sekarang'
        },
        {
          id: 'skipall',
          name: 'Skip All',
          price: 'Rp??.000',
          description: 'Pilihan dengan prioritas tertinggi untuk proses promosi secepat mungkin.',
          features: ['Promosi dengan prioritas tertinggi', 'Lewati antrean promosi yang tersedia', 'Proses diprioritaskan untuk publikasi lebih cepat', 'Server ditampilkan di website Epen GTPS'],
          popular: false,
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
        logo: 'https://f.top4top.io/p_39270cpcr1.jpg',
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
        id: 'promote',
        category: 'Promote',
        title: 'Order Promote GTPS',
        url: '/promote',
        iconUrl: '/assets/icons/promote.png',
        icon: '',
        target: '_self'
      },
      {
        id: 'whatsapp',
        category: 'Information',
        title: 'Informasi Giveaway Role',
        url: 'https://whatsapp.com/channel/0029VbDsLl9LNSZxidjstX2E',
        iconUrl: '/assets/icons/whatsapp.png',
        icon: 'whatsapp',
        target: '_blank'
      },
      {
        id: 'partners',
        category: 'Partner',
        title: 'Partner Epen GTPS',
        url: '/partners',
        iconUrl: '/assets/icons/partners.png',
        icon: 'users',
        target: '_self'
      },
      {
        id: 'servers',
        category: 'Server',
        title: 'List Server GTPS',
        url: '/servers',
        iconUrl: '/assets/icons/servers.png',
        icon: 'network',
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
      short: 'V',
      tagline: 'Promoter GTPS',
      description: 'Subscribe = 1 Account Free.',
      logo: '',
      banner: '',
      // custom = gunakan gambar banner sendiri | template = gunakan banner bawaan Epen GTPS
      bannerMode: 'template',
      bannerTemplate: { style: 'signature', showLogo: true },
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
      // Pilih 'template' agar banner 1600x500 dibuat otomatis dari desain Epen GTPS.
      bannerMode: 'template',
      bannerTemplate: { style: 'signature', showLogo: true },
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
    }
  ]
};
