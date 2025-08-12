import { Post } from '@/types/index';

export const posts: Post[] = [
  // --- POST 1: Ibu Kota Nusantara (IKN) ---
  {
    id: 'post_001',
    userId: 'user_ikn_expert',
    username: 'Analisis IKN',
    handle: '@ikn_watch',
    time: '15 menit yang lalu',
    content: 'Progres pembangunan Ibu Kota Nusantara (IKN) terus berjalan. Menurut kalian, apa tantangan terbesar yang masih harus dihadapi pemerintah untuk memastikan proyek ini sukses dan berkelanjutan?',
    upvotes: 342,
    commentsCount: 3,
    comments: [
      {
        id: 'c1_1',
        userId: 'user_pro_ikn',
        username: 'Budi Santoso',
        handle: '@budisan',
        time: '10 menit yang lalu',
        content: 'Tantangan utamanya adalah pendanaan dan menarik investasi swasta. Tanpa itu, beban APBN akan sangat berat.',
        replies: [
          {
            id: 'c1_1_1',
            userId: 'user_ikn_expert',
            username: 'Analisis IKN',
            handle: '@ikn_watch',
            time: '5 menit yang lalu',
            content: 'Setuju. Transparansi alokasi dana menjadi kunci untuk menjaga kepercayaan investor.',
          },
        ],
      },
      {
        id: 'c1_2',
        userId: 'user_lingkungan',
        username: 'Rina Lestari',
        handle: '@greenpeace_rina',
        time: '12 menit yang lalu',
        content: 'Aspek lingkungan jangan sampai dikesampingkan. Bagaimana nasib hutan Kalimantan dan ekosistemnya?',
      },
    ],
  },
  // --- POST 2: Kebijakan Kesehatan (BPJS) ---
  {
    id: 'post_002',
    userId: 'user_health_policy',
    username: 'Info Sehat Publik',
    handle: '@sehat_info',
    time: '1 jam yang lalu',
    content: 'Wacana sistem kelas rawat inap standar (KRIS) untuk BPJS Kesehatan kembali mengemuka. Apakah ini akan meningkatkan kualitas layanan atau justru sebaliknya?',
    upvotes: 198,
    commentsCount: 1,
    comments: [
      {
        id: 'c2_1',
        userId: 'user_pasien',
        username: 'Dewi Anggraini',
        handle: '@dewi_anggraini',
        time: '30 menit yang lalu',
        content: 'Harapannya sih pemerataan kualitas, tapi khawatir juga kalau semua disamaratakan malah jadi turun standarnya.',
      },
    ],
  },
  // --- POST 3: Keamanan Siber ---
  {
    id: 'post_003',
    userId: 'user_cybersec',
    username: 'CyberGuard ID',
    handle: '@cyberguard',
    time: '3 jam yang lalu',
    content: 'Serangan siber terhadap institusi pemerintah semakin marak. Apa langkah konkret yang harus segera diambil untuk memperkuat pertahanan digital nasional kita?',
    upvotes: 512,
    commentsCount: 2,
    comments: [
      {
        id: 'c3_1',
        userId: 'user_tech_dev',
        username: 'Andi Wijaya',
        handle: '@anditech',
        time: '2 jam yang lalu',
        content: 'Investasi pada talenta digital dan BSSN harus jadi prioritas. Bukan cuma beli software, tapi juga bangun sumber daya manusianya.',
      },
      {
          id: 'c3_2',
          userId: 'user_privacy',
          username: 'Faisal Rahman',
          handle: '@privacy_first',
          time: '1 jam yang lalu',
          content: 'Perlindungan data pribadi (UU PDP) harus ditegakkan secara serius. Tanpa itu, kita semua rentan.',
      }
    ],
  },
  // --- POST 4: Pendidikan ---
  {
    id: 'post_004',
    userId: 'user_pendidikan',
    username: 'Guru Inovatif',
    handle: '@gurumaju',
    time: '5 jam yang lalu',
    content: 'Kurikulum Merdeka memberikan fleksibilitas, namun banyak guru di daerah yang masih kesulitan beradaptasi. Bagaimana cara terbaik menjembatani kesenjangan ini?',
    upvotes: 215,
    commentsCount: 0,
    comments: [],
  },
  // --- POST 5: Ekonomi & UMKM ---
  {
    id: 'post_005',
    userId: 'user_ekonomi',
    username: 'Ekonom Rakyat',
    handle: '@ekonomirakyat',
    time: '8 jam yang lalu',
    content: 'Digitalisasi UMKM adalah kunci, tapi akses internet dan literasi digital masih belum merata. Apa solusi paling efektif menurut kalian?',
    upvotes: 433,
    commentsCount: 1,
    comments: [
      {
          id: 'c5_1',
          userId: 'user_umkm_owner',
          username: 'Warung Bu Siti',
          handle: '@warungbusiti',
          time: '7 jam yang lalu',
          content: 'Pelatihan langsung di tingkat desa/kelurahan sangat membantu. Teori saja tidak cukup.',
      }
    ],
  },
  // --- POST 6: Politik Luar Negeri ---
  {
    id: 'post_006',
    userId: 'user_ir_analyst',
    username: 'Diplomasi Watch',
    handle: '@diplowatch',
    time: '12 jam yang lalu',
    content: 'Di tengah persaingan geopolitik global, bagaimana Indonesia seharusnya memposisikan kebijakan luar negeri "bebas aktif"-nya agar tetap relevan dan menguntungkan kepentingan nasional?',
    upvotes: 671,
    commentsCount: 2,
    comments: [
      {
          id: 'c6_1',
          userId: 'user_historian',
          username: 'Jaka Sembung',
          handle: '@jakahistory',
          time: '10 jam yang lalu',
          content: 'Prinsipnya masih sangat relevan. Kuncinya adalah konsistensi dan kemampuan diplomasi yang kuat, tidak terseret ke salah satu blok.',
      },
      {
          id: 'c6_2',
          userId: 'user_trade_expert',
          username: 'Cahyo',
          handle: '@tradeindo',
          time: '9 jam yang lalu',
          content: 'Fokus pada diplomasi ekonomi. Kerjasama yang saling menguntungkan akan memperkuat posisi tawar kita.',
      }
    ],
  },
  // --- POST 7: Lingkungan Hidup ---
  {
    id: 'post_007',
    userId: 'user_environment',
    username: 'Save Our Forest',
    handle: '@hutanlestari',
    time: '1 hari yang lalu',
    content: 'Kebijakan transisi ke energi terbarukan (EBT) terlihat lambat. Apa yang menjadi penghambat utama di Indonesia? Teknologi, biaya, atau kemauan politik?',
    upvotes: 389,
    commentsCount: 0,
    comments: [],
  },
  // --- POST 8: Transportasi Publik ---
  {
    id: 'post_008',
    userId: 'user_transport',
    username: 'Anak Kereta',
    handle: '@commuterline',
    time: '1 hari yang lalu',
    content: 'Integrasi antarmoda transportasi publik di Jabodetabek sudah lebih baik, tapi masih banyak pekerjaan rumah. Apa prioritas selanjutnya? MRT, LRT, atau perbaikan layanan bus?',
    upvotes: 490,
    commentsCount: 1,
    comments: [
      {
          id: 'c8_1',
          userId: 'user_urbanplan',
          username: 'Tata Kota ID',
          handle: '@tatakota',
          time: '20 jam yang lalu',
          content: 'Perbaikan jalur pejalan kaki dan "first-mile/last-mile" solution. Tanpa itu, orang tetap enggan beralih ke transportasi publik.',
      }
    ],
  },
  // --- POST 9: Hukum & Korupsi ---
  {
    id: 'post_009',
    userId: 'user_law',
    username: 'ICW Clone',
    handle: '@antikorupsi',
    time: '2 hari yang lalu',
    content: 'Revisi UU KPK beberapa tahun lalu masih menjadi perdebatan. Secara objektif, apakah lembaga ini menjadi lebih kuat atau lebih lemah dalam memberantas korupsi?',
    upvotes: 820,
    commentsCount: 0,
    comments: [],
  },
  // --- POST 10: Isu Sosial ---
  {
    id: 'post_010',
    userId: 'user_social',
    username: 'Setara Institute',
    handle: '@setara',
    time: '2 hari yang lalu',
    content: 'Toleransi antarumat beragama adalah fondasi bangsa. Bagaimana cara kita merawatnya di era digital yang penuh dengan polarisasi dan hoaks?',
    upvotes: 754,
    commentsCount: 1,
    comments: [
      {
          id: 'c10_1',
          userId: 'user_moderator',
          username: 'Damai Indonesiaku',
          handle: '@damai_id',
          time: '1 hari yang lalu',
          content: 'Pendidikan karakter sejak dini dan literasi media digital yang masif. Itu kuncinya.',
      }
    ],
  },
  // --- POST 11: Pertanyaan Reflektif ---
  {
    id: 'post_011',
    userId: 'user_philosopher',
    username: 'Filsuf Jalanan',
    handle: '@filsufjalanan',
    time: '3 hari yang lalu',
    content: 'Jika Anda bisa mengubah satu saja kebijakan di Indonesia saat ini, kebijakan apa yang akan Anda pilih dan mengapa?',
    upvotes: 1050,
    commentsCount: 0,
    comments: [],
  },
];
