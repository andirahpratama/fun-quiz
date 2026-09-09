// Question Bank Database for 10 SMP Subjects with Explanations

export const SUBJECTS = [
  { id: 'PKN', name: 'PKN (Pancasila & Kewarganegaraan)', icon: '🏛️', color: '#e11d48' },
  { id: 'Matematika', name: 'Matematika', icon: '📐', color: '#2563eb' },
  { id: 'IPA', name: 'IPA (Ilmu Pengetahuan Alam)', icon: '🔬', color: '#059669' },
  { id: 'IPS', name: 'IPS (Ilmu Pengetahuan Sosial)', icon: '🌍', color: '#d97706' },
  { id: 'Bahasa Indonesia', name: 'Bahasa Indonesia', icon: '📚', color: '#7c3aed' },
  { id: 'Bahasa Inggris', name: 'Bahasa Inggris', icon: '🔤', color: '#0891b2' },
  { id: 'Bahasa Sunda', name: 'Bahasa Sunda', icon: '🏞️', color: '#65a30d' },
  { id: 'Penjaskes', name: 'Penjaskes (PJOK)', icon: '⚽', color: '#ea580c' },
  { id: 'Seni Budaya', name: 'Seni Budaya', icon: '🎨', color: '#db2777' },
  { id: 'Agama Islam', name: 'Agama Islam (PAI)', icon: '🕌', color: '#0d9488' },
];

export const GAME_TYPES = [
  {
    id: 'balloon',
    name: 'Memanah Balon Nomor Soal',
    icon: '🎈',
    desc: 'Balon bernomor melayang ke atas. Panah atau klik balon untuk membuka soal!',
    bgGradient: 'from-amber-400 to-rose-500',
  },
  {
    id: 'fishing',
    name: 'Memancing Ikan Nomor Soal',
    icon: '🎣',
    desc: 'Ikan bernomor berenang di bawah laut. Tangkap ikan dengan kail atau klik untuk menjawab!',
    bgGradient: 'from-cyan-400 to-blue-600',
  },
  {
    id: 'catch_ball',
    name: 'Menangkap Bola Jatuh',
    icon: '⚽',
    desc: 'Bola bernomor jatuh dari atas langit. Geser jaring atau klik bola sebelum menyentuh tanah!',
    bgGradient: 'from-emerald-400 to-teal-700',
  },
  {
    id: 'fruit_ninja',
    name: 'Memotong Buah (Fruit Ninja)',
    icon: '🍉',
    desc: 'Buah-buahan bernomor terlempar ke udara. Usap/swipe layar untuk memotong buah!',
    bgGradient: 'from-purple-500 to-pink-600',
  },
];

// Pre-defined sample question templates for all 10 subjects
export const QUESTION_TEMPLATES = {
  'PKN': [
    {
      question: "Berdasarkan Pasal 7 ayat (1) UU No. 12 Tahun 2011, peraturan perundang-undangan yang menempati posisi tertinggi dalam tata urutan perundang-undangan di Indonesia adalah...",
      options: [
        "Ketetapan MPR (TAP MPR)",
        "Undang-Undang Dasar Negara Republik Indonesia Tahun 1945",
        "Undang-Undang / Peraturan Pemerintah Pengganti UU",
        "Peraturan Presiden (Perpres)"
      ],
      correctAnswer: 1,
      explanation: "UUD NRI Tahun 1945 merupakan hukum dasar tertinggi dalam hierarki peraturan perundang-undangan di Indonesia yang menjadi pedoman norma bagi seluruh peraturan di bawahnya."
    },
    {
      question: "Peraturan perundang-undangan yang ditetapkan oleh Presiden dalam hal 'ikhwal kegentingan yang memaksa' disebut...",
      options: [
        "Peraturan Pemerintah (PP)",
        "Peraturan Presiden (Perpres)",
        "Peraturan Pemerintah Pengganti Undang-Undang (Perppu)",
        "Ketetapan MPR"
      ],
      correctAnswer: 2,
      explanation: "Perppu dibuat Presiden dalam situasi kegentingan memaksa dan memiliki kedudukan setingkat dengan Undang-Undang, namun wajib memperoleh persetujuan DPR pada masa sidang berikutnya."
    },
    {
      question: "Asas hukum yang menyatakan bahwa 'peraturan perundang-undangan yang lebih tinggi mengesampingkan atau membatalkan peraturan yang lebih rendah' adalah...",
      options: [
        "Lex superior derogat legi inferiori",
        "Lex posterior derogat legi priori",
        "Lex specialis derogat legi generali",
        "Equality before the law"
      ],
      correctAnswer: 0,
      explanation: "Asas 'Lex superior derogat legi inferiori' menegaskan bahwa aturan hukum yang lebih rendah tidak boleh bertentangan dengan norma hukum yang lebih tinggi tingkatannya."
    },
    {
      question: "Lembaga negara yang memiliki wewenang untuk menguji materi Undang-Undang terhadap UUD NRI Tahun 1945 adalah...",
      options: [
        "Mahkamah Agung (MA)",
        "Dewan Perwakilan Rakyat (DPR)",
        "Mahkamah Konstitusi (MK)",
        "Komisi Yudisial (KY)"
      ],
      correctAnswer: 2,
      explanation: "Mahkamah Konstitusi (MK) berwenang menguji materi Undang-Undang terhadap UUD 1945, sedangkan Mahkamah Agung (MA) berwenang menguji peraturan di bawah UU terhadap UU."
    },
    {
      question: "Peraturan Pemerintah (PP) dibentuk oleh Presiden dengan tujuan utama untuk...",
      options: [
        "Menetapkan anggaran belanja negara secara mandiri",
        "Menjalankan Undang-Undang sebagaimana mestinya",
        "Mengubah klausul pasal dalam UUD NRI Tahun 1945",
        "Membubarkan institusi lembaga pemerintah daerah"
      ],
      correctAnswer: 1,
      explanation: "Sesuai Pasal 5 ayat (2) UUD NRI Tahun 1945, Presiden menetapkan Peraturan Pemerintah untuk menjalankan Undang-Undang sebagaimana mestinya."
    },
    {
      question: "Peraturan Daerah (Perda) Kabupaten/Kota dirancang dan ditetapkan atas dasar persetujuan bersama antara...",
      options: [
        "Bupati/Walikota bersama DPRD Kabupaten/Kota",
        "Gubernur bersama Bupati/Walikota",
        "Presiden bersama Menteri Dalam Negeri",
        "Kepala Desa bersama Camat wilayah setempat"
      ],
      correctAnswer: 0,
      explanation: "Perda Kabupaten/Kota dibentuk oleh Bupati atau Walikota dengan persetujuan bersama Dewan Perwakilan Rakyat Daerah (DPRD) Kabupaten/Kota."
    },
    {
      question: "Manakah urutan hierarki yang BENAR menurut UU No. 12 Tahun 2011 dari urutan paling tinggi ke paling rendah?",
      options: [
        "UUD 1945 -> PP -> Perpres -> UU -> Perda Provinsi",
        "UUD 1945 -> TAP MPR -> UU/Perppu -> PP -> Perpres -> Perda Provinsi -> Perda Kab/Kota",
        "TAP MPR -> UUD 1945 -> PP -> UU -> Perda Kab/Kota",
        "UUD 1945 -> UU -> TAP MPR -> Perpres -> PP -> Perda Provinsi"
      ],
      correctAnswer: 1,
      explanation: "Hierarki Pasal 7 UU 12/2011: 1. UUD 1945, 2. TAP MPR, 3. UU/Perppu, 4. Peraturan Pemerintah, 5. Peraturan Presiden, 6. Perda Provinsi, 7. Perda Kab/Kota."
    },
    {
      question: "Tiga landasan pokok yang wajib dipenuhi dalam setiap perumusan peraturan perundang-undangan di Indonesia adalah...",
      options: [
        "Landasan Militer, Politik, dan Ekonomi",
        "Landasan Filosofis, Sosiologis, dan Yuridis",
        "Landasan Tradisional, Internasional, dan Regional",
        "Landasan Moneter, Birokrasi, dan Eksekutif"
      ],
      correctAnswer: 1,
      explanation: "Pembentukan perundang-undangan harus bersumber pada cita hukum/Pancasila (Filosofis), kesesuaian kebutuhan masyarakat (Sosiologis), dan keabsahan dasar hukum (Yuridis)."
    },
    {
      question: "Apabila materi suatu Peraturan Daerah (Perda) dinilai bertentangan dengan Undang-Undang, lembaga yang berwenang menguji dan membatalkannya adalah...",
      options: [
        "Mahkamah Agung (MA)",
        "Mahkamah Konstitusi (MK)",
        "Badan Pemeriksa Keuangan (BPK)",
        "Komisi Pemberantasan Korupsi (KPK)"
      ],
      correctAnswer: 0,
      explanation: "Berdasarkan Pasal 24A UUD 1945, Mahkamah Agung (MA) berwenang menguji peraturan perundang-undangan di bawah undang-undang terhadap undang-undang."
    },
    {
      question: "Contoh sikap ketaatan dan kepatuhan siswa terhadap peraturan tata tertib di lingkungan sekolah adalah...",
      options: [
        "Mengendarai sepeda motor ke sekolah sebelum memiliki SIM",
        "Mematuhi tata tertib sekolah dan mengenakan seragam dengan rapi",
        "Menyebarkan informasi hoax yang belum terverifikasi di media sosial",
        "Meninggalkan jam pelajaran tanpa izin saat guru sedang berhalangan"
      ],
      correctAnswer: 1,
      explanation: "Mematuhi tata tertib sekolah dan menggunakan seragam sesuai ketentuan merupakan wujud kesadaran hukum dan disiplin positif sejak dini."
    }
  ],

  'Matematika': [
    {
      question: 'Hasil dari (-12) + 7 - (-5) adalah...',
      options: ['0', '2', '-10', '-14'],
      correctAnswer: 0,
      explanation: '(-12) + 7 - (-5) = -5 + 5 = 0. Ingat pengurangan dengan bilangan negatif menjadi penjumlahan.'
    },
    {
      question: 'Jika 3x + 5 = 20, maka nilai dari x adalah...',
      options: ['3', '4', '5', '6'],
      correctAnswer: 2,
      explanation: '3x = 20 - 5 => 3x = 15 => x = 15 / 3 = 5.'
    },
    {
      question: 'Luas lingkaran yang memiliki jari-jari 14 cm adalah... (π = 22/7)',
      options: ['154 cm²', '308 cm²', '616 cm²', '1232 cm²'],
      correctAnswer: 2,
      explanation: 'Luas = π × r² = (22/7) × 14 × 14 = 22 × 2 × 14 = 616 cm².'
    },
    {
      question: 'Sebuah segitiga siku-siku memiliki alas 6 cm dan tinggi 8 cm. Panjang sisi miringnya adalah...',
      options: ['9 cm', '10 cm', '12 cm', '14 cm'],
      correctAnswer: 1,
      explanation: 'Sesuai Teorema Pythagoras: c² = a² + b² = 6² + 8² = 36 + 64 = 100 => c = √100 = 10 cm.'
    },
    {
      question: 'Keliling persegi panjang dengan panjang 12 cm dan lebar 8 cm adalah...',
      options: ['20 cm', '40 cm', '96 cm', '48 cm'],
      correctAnswer: 1,
      explanation: 'Keliling = 2 × (p + l) = 2 × (12 + 8) = 2 × 20 = 40 cm.'
    }
  ],

  'IPA': [
    {
      question: 'Organel sel yang berfungsi sebagai tempat pembentukan energi (respirasi sel) adalah...',
      options: ['Ribosom', 'Lisosom', 'Mitokondria', 'Badan Golgi'],
      correctAnswer: 2,
      explanation: 'Mitokondria sering disebut "powerhouse of the cell" karena menghasilkan molekul energi (ATP) melalui respirasi sel.'
    },
    {
      question: 'Zat pembawa sifat keturunan yang terletak di dalam inti sel adalah...',
      options: ['Kromosom dan DNA', 'Sitoplasma', 'Membran Sel', 'Vakuola'],
      correctAnswer: 0,
      explanation: 'Kromosom mengandung materi genetik berupa DNA yang membawa informasi hereditas dari orang tua ke keturunan.'
    },
    {
      question: 'Hukum Newton II menyatakan bahwa percepatan benda sebanding dengan gaya dan berbanding terbalik dengan...',
      options: ['Kecepatan', 'Massa Benda', 'Jarak', 'Waktu'],
      correctAnswer: 1,
      explanation: 'Rumus Hukum Newton II: F = m × a, sehingga a = F / m. Percepatan (a) berbanding terbalik dengan massa benda (m).'
    },
    {
      question: 'Proses perubahan wujud zat dari padat langsung menjadi gas dinamakan...',
      options: ['Mengembun', 'Menyublim', 'Mengristal', 'Mencair'],
      correctAnswer: 1,
      explanation: 'Menyublim adalah peristiwa perubahan wujud zat dari padat menjadi gas tanpa melalui fase cair terlebih dahulu (contoh: kapur barus).'
    },
    {
      question: 'Bagian jantung yang berfungsi memompa darah kaya oksigen ke seluruh tubuh adalah...',
      options: ['Serambi Kanan', 'Bilik Kanan', 'Serambi Kiri', 'Bilik Kiri'],
      correctAnswer: 3,
      explanation: 'Bilik Kiri (Ventrikel Kiri) memiliki dinding paling tebal untuk memompa darah kaya O2 dari paru-paru menuju ke seluruh tubuh melalui aorta.'
    }
  ],

  'IPS': [
    {
      question: 'Benua terbesar dan terluas di dunia adalah Benua...',
      options: ['Amerika', 'Afrika', 'Asia', 'Eropa'],
      correctAnswer: 2,
      explanation: 'Benua Asia adalah benua terbesar di dunia dengan luas sekitar 44,58 juta km² (sekitar 30% dari total luas daratan bumi).'
    },
    {
      question: 'Organisasi kerjasama antar negara di kawasan Asia Tenggara adalah...',
      options: ['APEC', 'ASEAN', 'NATO', 'OPEC'],
      correctAnswer: 1,
      explanation: 'ASEAN (Association of Southeast Asian Nations) didirikan pada 8 Agustus 1967 di Bangkok oleh 5 negara pendiri termasuk Indonesia.'
    },
    {
      question: 'Peristiwa Proklamasi Kemerdekaan Indonesia terjadi pada tanggal 17 Agustus 1945 di Jalan...',
      options: ['Jalan Imam Bonjol No. 1', 'Jalan Pegangsaan Timur No. 56', 'Jalan Veteran No. 10', 'Jalan Merdeka Barat No. 5'],
      correctAnswer: 1,
      explanation: 'Teks Proklamasi dibacakan oleh Ir. Soekarno didampingi Drs. Mohammad Hatta di kediaman Soekarno, Jalan Pegangsaan Timur No. 56 Jakarta.'
    },
    {
      question: 'Faktor utama yang mendorong bangsa Eropa melakukan penjelajahan samudera ke Indonesia adalah pencarian...',
      options: ['Batu Mulia', 'Rempah-rempah', 'Minyak Bumi', 'Karet Alam'],
      correctAnswer: 1,
      explanation: 'Rempah-rempah (cengkeh, pala, lada) memiliki nilai ekonomi sangat tinggi di Eropa saat itu untuk bahan pengawet makanan dan obat-obatan.'
    },
    {
      question: 'Pasar yang penjual dan pembelinya tidak bertemu secara langsung tetapi melalui internet disebut pasar...',
      options: ['Abstrak / Online', 'Konkret / Nyata', 'Harian', 'Monopoli'],
      correctAnswer: 0,
      explanation: 'Pasar abstrak/online adalah pasar di mana transaksi dilakukan tanpa pertemuan fisik secara langsung antara penjual dan pembeli.'
    }
  ],

  'Bahasa Indonesia': [
    {
      question: 'Gagasan utama atau ide pokok yang menjadi dasar pengembangan sebuah paragraf disebut...',
      options: ['Ide Pendukung', 'Kalimat Pengembang', 'Gagasan Utama / Pikiran Utama', 'Kesimpulan'],
      correctAnswer: 2,
      explanation: 'Gagasan utama adalah inti pemikiran dari sebuah paragraf yang menjadi dasar pengembangan kalimat-kalimat penjelas.'
    },
    {
      question: 'Paragraf yang kalimat utamanya terletak di awal paragraf disebut paragraf...',
      options: ['Induktif', 'Deduktif', 'Campuran', 'Naratif'],
      correctAnswer: 1,
      explanation: 'Paragraf Deduktif dimulai dengan pernyataan umum (kalimat utama) di awal, kemudian diikuti rincian penjelas.'
    },
    {
      question: 'Unsur 5W+1H dalam teks berita yang menanyakan penyebab suatu peristiwa terjadi adalah...',
      options: ['What (Apa)', 'Where (Di mana)', 'Why (Mengapa)', 'How (Bagaimana)'],
      correctAnswer: 2,
      explanation: 'Unsur "Why" (Mengapa) digunakan dalam berita untuk menjelaskan latar belakang atau alasan terjadinya peristiwa tersebut.'
    },
    {
      question: 'Penggunaan tanda baca koma (,) yang tepat terdapat pada kalimat...',
      options: [
        'Saya membeli buku, pensil, dan penggaris.',
        'Saya membeli buku pensil, dan penggaris.',
        'Saya membeli, buku, pensil dan penggaris.',
        'Saya membeli buku, pensil dan, penggaris.'
      ],
      correctAnswer: 0,
      explanation: 'Pemerincian lebih dari dua unsur menggunakan tanda koma sebelum kata hubung "dan" (misal: buku, pensil, dan penggaris).'
    },
    {
      question: 'Majas yang membandingkan benda mati seolah-olah memiliki sifat seperti manusia dinamakan majas...',
      options: ['Metafora', 'Personifikasi', 'Hiperbola', 'Simile'],
      correctAnswer: 1,
      explanation: 'Majas personifikasi memberikan kualitas manusiawi pada benda mati/abstrak, contoh: "Nyiur melambai-lambai di tepi pantai".'
    }
  ],

  'Bahasa Inggris': [
    {
      question: 'Complete the sentence: "She _____ to the library every Wednesday afternoon."',
      options: ['go', 'goes', 'going', 'gone'],
      correctAnswer: 1,
      explanation: 'For Third Person Singular (She/He/It) in Simple Present Tense, we add -s/-es to the verb base (go -> goes).'
    },
    {
      question: 'What is the past tense (Verb 2) of the verb "BUY"?',
      options: ['Buys', 'Buying', 'Bought', 'Buyed'],
      correctAnswer: 2,
      explanation: 'The verb "buy" is an irregular verb. Its V2 (past form) and V3 (past participle) are "bought".'
    },
    {
      question: 'Choose the correct expression to compliment someone\'s work:',
      options: ['I am sorry to hear that.', 'What a magnificent painting!', 'You must be tired.', 'Can you help me?'],
      correctAnswer: 1,
      explanation: '"What a magnificent painting!" is an exclamation used to compliment or praise someone\'s achievement or creation.'
    },
    {
      question: 'Complete: "If you don\'t study hard, you _____ pass the final examination."',
      options: ['will not', 'would', 'are', 'did not'],
      correctAnswer: 0,
      explanation: 'First Conditional Sentence pattern: If + Simple Present (don\'t study), Simple Future (will not pass).'
    },
    {
      question: 'Which word is a SYNONYM of "Smart"?',
      options: ['Lazy', 'Intelligent', 'Slow', 'Naughty'],
      correctAnswer: 1,
      explanation: '"Intelligent" means showing high intelligence or mental capacity, which is a synonym of "Smart".'
    }
  ],

  'Bahasa Sunda': [
    {
      question: 'Kecap lemes (lemes pikeun batur) ti kecap "dahar" nyaéta...',
      options: ['Neda', 'Tuang', 'Emam', 'Mangan'],
      correctAnswer: 1,
      explanation: 'Dina tatakrama basa Sunda, kecap "dahar" pikeun batur/orang lain nyaéta "tuang", sedengkeun pikeun diri sorangan nyaéta "neda".'
    },
    {
      question: 'Pikiran utama anu ngajiwaan dina hiji karangan atawa sajak disebut...',
      options: ['Latar', 'Téma', 'Palaku', 'Amanat'],
      correctAnswer: 1,
      explanation: 'Téma nyaéta gagasan atawa pikiran utama anu ditiupkeun ku pangarang dina hiji karya sastra.'
    },
    {
      question: 'Pakakas tradisional Sunda anu dijieun tina awi jeung disada ku cara digoyangkeun nyaéta...',
      options: ['Kecapi', 'Suling', 'Angklung', 'Calung'],
      correctAnswer: 2,
      explanation: 'Angklung nyaéta alat musik tradisional Sunda tina bambu/awi anu dimainkan ku cara digoyangan.'
    },
    {
      question: 'Sesebut anak sasatoan dina basa Sunda: Anak gajah disebut...',
      options: ['Menel', 'Begu', 'Boloho', 'Cemé'],
      correctAnswer: 0,
      explanation: 'Dina basa Sunda, anak gajah disebut "menel", anak kancil disebut "begu", anak ucing disebut "bilatung".'
    },
    {
      question: 'Kecap "Lembur" dina basa Sunda mibanda arti...',
      options: ['Kerja Tambahan', 'Desa / Kampung Halaman', 'Kota Besar', 'Sawah'],
      correctAnswer: 1,
      explanation: 'Dina basa Sunda,kecap "lembur" hartina nyaéta desa, kampung, atawa tanah kalahiran (kampung halaman).'
    }
  ],

  'Penjaskes': [
    {
      question: 'Berapa jumlah pemain dalam satu tim bola voli saat bertanding di lapangan?',
      options: ['5 orang', '6 orang', '7 orang', '11 orang'],
      correctAnswer: 1,
      explanation: 'Satu regu bola voli terdiri dari 6 pemain inti yang berada di lapangan.'
    },
    {
      question: 'Teknik dasar mengoper bola dari atas kepala dengan kedua tangan dalam permainan bola basket dinamakan...',
      options: ['Chest Pass', 'Bounce Pass', 'Overhead Pass', 'Baseball Pass'],
      correctAnswer: 2,
      explanation: 'Overhead pass adalah teknik mengoper bola dari atas kepala dengan menggunakan kedua tangan menuju rekan satu tim.'
    },
    {
      question: 'Induk organisasi sepak bola seluruh Indonesia adalah...',
      options: ['PBVSI', 'PERBASI', 'PSSI', 'PASI'],
      correctAnswer: 2,
      explanation: 'PSSI (Persatuan Sepakbola Seluruh Indonesia) didirikan pada 19 April 1930 di Yogyakarta.'
    },
    {
      question: 'Gaya dada dalam olahraga renang sering juga dinamakan gaya...',
      options: ['Gaya Bebas', 'Gaya Katak', 'Gaya Punggung', 'Gaya Kupu-kupu'],
      correctAnswer: 1,
      explanation: 'Gaya dada disebut gaya katak karena gerakannya menyerupai gerakan katak yang sedang berenang di air.'
    },
    {
      question: 'Kemampuan tubuh untuk melakukan aktivitas tanpa mengalami kelelahan yang berarti dinamakan...',
      options: ['Kekuatan', 'Kelincahan', 'Kebugaran Jasmani', 'Kelenturan'],
      correctAnswer: 2,
      explanation: 'Kebugaran jasmani adalah kesanggupan tubuh melakukan kerja sehari-hari tanpa menimbulkan kelelahan berlebih.'
    }
  ],

  'Seni Budaya': [
    {
      question: 'Tari Saman merupakan tarian tradisional yang berasal dari daerah...',
      options: ['Sumatera Barat', 'Aceh', 'Bali', 'Jawa Barat'],
      correctAnswer: 1,
      explanation: 'Tari Saman adalah tarian Suku Gayo dari Provinsi Aceh yang diakui UNESCO sebagai Warisan Budaya Takbenda.'
    },
    {
      question: 'Alat musik Gamelan dimainkan dengan cara...',
      options: ['Ditiup', 'Dipetik', 'Ditepuk / Dipukul', 'Digesek'],
      correctAnswer: 2,
      explanation: 'Sebagian besar instrumen dalam Gamelan (seperti saron, bonang, gong) dimainkan dengan cara dipukul menggunakan pemukul khusus.'
    },
    {
      question: 'Unsur seni rupa paling dasar yang merupakan hasil dari titik yang ditarik secara berulang adalah...',
      options: ['Garis', 'Bidang', 'Warna', 'Tekstur'],
      correctAnswer: 0,
      explanation: 'Garis adalah goresan atau batas limit dari suatu benda, ruang, bidang, warna, tekstur, dan lainnya.'
    },
    {
      question: 'Teknik menggambar dengan membuat titik-titik kecil hingga membentuk objek gambar dinamakan teknik...',
      options: ['Arsir', 'Dusel', 'Pointilis', 'Aquarel'],
      correctAnswer: 2,
      explanation: 'Teknik pointilis mengandalkan susunan titik-titik dengan kerapatan berbeda untuk menghasilkan kerapatan gelap terang.'
    },
    {
      question: 'Lagu daerah "Manuk Dadali" berasal dari provinsi...',
      options: ['Jawa Tengah', 'Jawa Barat', 'Jawa Timur', 'DKI Jakarta'],
      correctAnswer: 1,
      explanation: 'Manuk Dadali adalah lagu daerah Jawa Barat yang diciptakan oleh Sambas Mangundikarta, bercerita tentang burung Garuda.'
    }
  ],

  'Agama Islam': [
    {
      question: 'Kitab suci Al-Qur\'an diturunkan kepada Nabi Muhammad SAW melalui perantara Malaikat...',
      options: ['Mikail', 'Jibril', 'Izrail', 'Israfil'],
      correctAnswer: 1,
      explanation: 'Malaikat Jibril adalah malaikat yang bertugas menyampaikan wahyu Allah SWT kepada para nabi dan rasul.'
    },
    {
      question: 'Rukun Islam yang ke-3 adalah...',
      options: ['Mengucapkan Syahadat', 'Mendirikan Shalat', 'Menunaikan Zakat', 'Berpuasa di Bulan Ramadhan'],
      correctAnswer: 2,
      explanation: 'Rukun Islam ada 5: 1. Syahadat, 2. Shalat, 3. Zakat, 4. Puasa Ramadhan, 5. Naik Haji bagi yang mampu.'
    },
    {
      question: 'Sifat wajib bagi Rasul "Shiddiq" artinya adalah...',
      options: ['Dapat Dipercaya', 'Jujur / Benar', 'Cerdas', 'Menyampaikan'],
      correctAnswer: 1,
      explanation: 'Sifat wajib Rasul: Shiddiq (Jujur/Benar), Amanah (Dapat dipercaya), Tabligh (Menyampaikan), Fathanah (Cerdas).'
    },
    {
      question: 'Shalat sunnah yang dikerjakan pada malam hari di bulan Ramadhan setelah shalat Isya dinamakan...',
      options: ['Shalat Tahajud', 'Shalat Tarawih', 'Shalat Duha', 'Shalat Witir'],
      correctAnswer: 1,
      explanation: 'Shalat Tarawih adalah shalat sunnah khusus yang dilaksanakan pada malam hari selama bulan suci Ramadhan.'
    },
    {
      question: 'Peristiwa hijrah Nabi Muhammad SAW dari kota Makkah ke Kota Madinah menjadi awal penanggalan kalender...',
      options: ['Masehi', 'Hijriyah', 'Jawa', 'Saka'],
      correctAnswer: 1,
      explanation: 'Kalender Hijriyah ditetapkan pertama kali oleh Khalifah Umar bin Khattab dengan menghitung tahun 1 dari peristiwa Hijrah Nabi.'
    }
  ]
};

// Generate questions helper dynamically based on Subject & Material & Desired Count
export const generateQuestions = (subject, material, count = 5) => {
  const templates = QUESTION_TEMPLATES[subject] || QUESTION_TEMPLATES['IPA'];
  const questions = [];

  for (let i = 0; i < count; i++) {
    const templateIndex = i % templates.length;
    const base = templates[templateIndex];
    
    questions.push({
      id: i + 1,
      questionNumber: i + 1,
      question: `${base.question} (Topik: ${material || 'Materi Pokok'})`,
      options: [...base.options],
      correctAnswer: base.correctAnswer,
      explanation: base.explanation,
    });
  }

  return questions;
};
