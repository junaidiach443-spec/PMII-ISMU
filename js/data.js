/**
 * Data Awal & Default untuk Aplikasi Pendataan Kader PMII Tingkat Komisariat
 * Pengurus Komisariat PMII ISMU (Institut Miftahul Ulum Tarate) Sumenep
 */

/**
 * ⚡ KONFIGURASI DATABASE CLOUD (OPSIONAL)
 * Kredensial database cloud yang aman disimpan di backend (api/config.local.php atau .env).
 * Jika pengurus ingin mengatur koneksi direct browser secara mandiri, gunakan menu Pengaturan Sistem di dalam aplikasi.
 */
const DEFAULT_CLOUD_CONFIG = {
  url: "postgresql://neondb_owner:npg_nTzvpcJeB07A@ep-nameless-salad-betekr6e-pooler.c-9.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
  key: "npg_nTzvpcJeB07A",
  autoSyncIntervalMs: 10000 // Interval sinkronisasi background jika cloud aktif (10 detik)
};

const defaultKomisariat = {
  nama: "PK PMII ISMU",
  namaLengkap: "Pengurus Komisariat PMII ISMU",
  kampus: "INSTITUT MIFTAHUL ULUM TARATE",
  cabang: "PC PMII Kab. Sumenep",
  pkc: "PKC PMII Jawa Timur",
  masaKhidmat: "2026 - 2027",
  ketuaKomisariat: "Sahabat M. Ilham Fathoni",
  sekretarisKomisariat: "Sahabat Ahmad Faruq Al-Faruqi",
  bendaharaKomisariat: "Sahabati Nur Lailia Ramadhani",
  nomorSK: "048.PC-XXVIII.V-04.01.2026",
  alamat: "Jl. Pesantren No. 11, Tarate, Pandian, Kec. Kota Sumenep, Kabupaten Sumenep, Jawa Timur",
  email: "pk.pmii.ismu@gmail.com",
  telepon: "0812-3456-7890"
};

// Data Master Fakultas & Program Studi (Prodi) di Kampus ISMU Tarate Sumenep
const defaultFakultasProdi = [
  {
    fakultas: "Fakultas Tarbiyah",
    prodi: [
      "Pendidikan Agama Islam (PAI)",
      "Manajemen Pendidikan Islam (MPI)",
      "Pendidikan Guru Madrasah Ibtidaiyah (PGMI)"
    ]
  },
  {
    fakultas: "Fakultas Syariah",
    prodi: [
      "Hukum Keluarga Islam (HKI / Ahwal Syakhshiyyah)",
      "Hukum Ekonomi Syariah (HES / Muamalah)"
    ]
  },
  {
    fakultas: "Fakultas Ekonomi & Bisnis Islam",
    prodi: [
      "Ekonomi Syariah",
      "Perbankan Syariah"
    ]
  },
  {
    fakultas: "Program Pascasarjana",
    prodi: [
      "Magister Pendidikan Agama Islam (S2 PAI)"
    ]
  }
];

// Data Master Daftar Tahun Khidmat & Arsip Historis
const defaultTahunKhidmatList = [
  {
    id: "2026-2027",
    label: "Masa Khidmat 2026 - 2027",
    tahunMulai: 2026,
    tahunSelesai: 2027,
    isAktif: true,
    ketuaKomisariat: "Sahabat M. Ilham Fathoni",
    sekretarisKomisariat: "Sahabat Ahmad Faruq Al-Faruqi",
    bendaharaKomisariat: "Sahabati Nur Lailia Ramadhani",
    nomorSK: "048.PC-XXVIII.V-04.01.2026",
    keterangan: "Periode aktif berjalan saat ini"
  },
  {
    id: "2025-2026",
    label: "Masa Khidmat 2025 - 2026",
    tahunMulai: 2025,
    tahunSelesai: 2026,
    isAktif: false,
    ketuaKomisariat: "Sahabat Ahmad Faruq Al-Faruqi",
    sekretarisKomisariat: "Sahabat M. Ilham Fathoni",
    bendaharaKomisariat: "Sahabati Siti Munawaroh",
    nomorSK: "032.PC-XXVIII.V-04.01.2025",
    keterangan: "Arsip kepengurusan periode lalu"
  },
  {
    id: "2024-2025",
    label: "Masa Khidmat 2024 - 2025",
    tahunMulai: 2024,
    tahunSelesai: 2025,
    isAktif: false,
    ketuaKomisariat: "Sahabat Moh. Rofi'ie",
    sekretarisKomisariat: "Sahabat Ahmad Faruq Al-Faruqi",
    bendaharaKomisariat: "Sahabati Siti Munawaroh",
    nomorSK: "018.PC-XXVIII.V-04.01.2024",
    keterangan: "Arsip kepengurusan perintis"
  }
];

const defaultRayons = [];

const defaultMabinkom = [
  {
    id: "MBK-001",
    nama: "Dr. H. M. Zainul Muttaqin, M.Pd.I",
    jabatan: "Ketua Dewan Mabinkom",
    angkatan: "2002",
    profesi: "Dosen Pascasarjana & Tokoh Pendidikan",
    instansi: "Institut Miftahul Ulum Tarate",
    whatsapp: "081234567901",
    email: "zainul.muttaqin@gmail.com",
    alamat: "Jl. Trunojoyo No. 12, Sumenep",
    foto: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=faces",
    keterangan: "Fasilitator Pemikiran Islam Aswaja & Kebangsaan"
  },
  {
    id: "MBK-002",
    nama: "Ahmad Baihaqi, S.Kom., M.T.",
    jabatan: "Sekretaris Mabinkom",
    angkatan: "2008",
    profesi: "Praktisi IT & Konsultan Sistem Informasi",
    instansi: "PT Inovasi Digital Madura",
    whatsapp: "081234567902",
    email: "baihaqi.it@gmail.com",
    alamat: "Jl. Pesantren No. 45, Tarate, Sumenep",
    foto: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop&crop=faces",
    keterangan: "Pendamping Digitalisasi & Media Pergerakan"
  },
  {
    id: "MBK-003",
    nama: "M. Bahrul Ulum, S.H., M.H.",
    jabatan: "Anggota Dewan Pembina",
    angkatan: "2010",
    profesi: "Advokat & Dosen Fakultas Syariah",
    instansi: "Institut Miftahul Ulum Tarate",
    whatsapp: "081234567903",
    email: "bahrul.ulum.law@gmail.com",
    alamat: "Jl. KH. Agus Salim No. 7, Pandian, Sumenep",
    foto: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=faces",
    keterangan: "Advokasi Kebijakan Publik & Bantuan Hukum"
  },
  {
    id: "MBK-004",
    nama: "Siti Fatimah Zahro, S.E., M.E.",
    jabatan: "Anggota Dewan Pembina",
    angkatan: "2012",
    profesi: "Praktisi Perbankan Syariah & Pengusaha",
    instansi: "BPRS Bhakti Sumekar Sumenep",
    whatsapp: "081234567904",
    email: "fatimah.zahro@gmail.com",
    alamat: "Jl. Raya Lenteng No. 18, Sumenep",
    foto: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=faces",
    keterangan: "Pembina Gerakan Ekonomi Mandiri & KOPRI"
  },
  {
    id: "MBK-005",
    nama: "Abdul Wahab Hasbullah, S.Pd.",
    jabatan: "Anggota Dewan Pembina",
    angkatan: "2014",
    profesi: "Penggiat Literasi & Pendidikan Pesantren",
    instansi: "Yayasan Miftahul Ulum Tarate",
    whatsapp: "081234567905",
    email: "wahab.hasbullah@gmail.com",
    alamat: "Jl. Urip Sumoharjo No. 22, Sumenep",
    foto: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=faces",
    keterangan: "Pengembangan Riset & Karya Ilmiah Kader"
  }
];

const defaultKaders = [
  {
    id: "KDR-001",
    noKta: "13.01.2023.001",
    nik: "3529012204020001",
    nim: "230101001",
    nama: "Sahabat M. Ilham Fathoni",
    panggilan: "Ilhan",
    namaPanggilan: "Ilhan",
    gender: "Laki-laki",
    jurusan: "Pendidikan Agama Islam (PAI)",
    fakultas: "Fakultas Tarbiyah",
    angkatan: "2023",
    tempatLahir: "Sumenep",
    tanggalLahir: "2003-05-14",
    ttl: "Sumenep, 14 Mei 2003",
    whatsapp: "081234567801",
    email: "ilham.fathoni@gmail.com",
    alamat: "Jl. Trunojoyo, Sumenep",
    statusKuliah: "Aktif",
    statusKader: "Aktif",
    statusKeaktifan: "Aktif",
    foto: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop&crop=faces",
    kaderisasi: {
      formal: "PKD",
      tahunMapaba: "2023",
      penyelenggaraMapaba: "PK PMII ISMU",
      tahunPkd: "2024",
      penyelenggaraPkd: "PC PMII Kab. Sumenep",
      tahunPkl: "",
      penyelenggaraPkl: "",
      kopri: "-",
      tahunSig: "",
      tahunSkk: ""
    }
  }
];
const defaultPemasukan = [
  {
    id: "MSK-2024-001",
    tanggal: "2024-09-01",
    kategori: "Iuran Kas Anggota",
    jumlah: 1500000,
    keterangan: "Iuran kas bulanan pengurus komisariat periode September 2024",
    diterimaDari: "Pengurus & Kader Komisariat",
    pic: "Sahabati Siti Munawaroh (Bendahara)",
    bukti: "BKK-09/01"
  },
  {
    id: "MSK-2024-002",
    tanggal: "2024-09-15",
    kategori: "Bantuan / Sumbangan Mabinkom",
    jumlah: 3000000,
    keterangan: "Infaq dan sumbangan sukarela Majelis Pembina (MABINKOM) untuk persiapan kaderisasi",
    diterimaDari: "Dewan Mabinkom ISMU",
    pic: "Sahabat M. Ilham Fathoni (Ketua)",
    bukti: "TRF-BSI-9031"
  },
  {
    id: "MSK-2024-003",
    tanggal: "2024-10-01",
    kategori: "Iuran Kas Anggota",
    jumlah: 1600000,
    keterangan: "Iuran kas bulanan pengurus komisariat periode Oktober 2024",
    diterimaDari: "Pengurus Komisariat",
    pic: "Sahabati Siti Munawaroh (Bendahara)",
    bukti: "BKK-10/01"
  },
  {
    id: "MSK-2024-004",
    tanggal: "2024-10-10",
    kategori: "Bantuan Kampus / Lembaga",
    jumlah: 5000000,
    keterangan: "Pencairan dana bantuan kegiatan kemahasiswaan dari Institut Miftahul Ulum Tarate",
    diterimaDari: "Rektorat ISMU Tarate",
    pic: "Sahabat M. Ilham Fathoni (Ketua)",
    bukti: "SP2D-ISMU-10"
  },
  {
    id: "MSK-2024-005",
    tanggal: "2024-10-25",
    kategori: "Usaha Mandiri (Danus)",
    jumlah: 850000,
    keterangan: "Keuntungan bersih penjualan atribut pergerakan (pin, stiker, kaos PDH PMII)",
    diterimaDari: "Biro Danus Komisariat",
    pic: "Sahabati Nur Lailia",
    bukti: "DNS-OKT-09"
  }
];

const defaultPengeluaran = [
  // --- POS PENGELUARAN: PELANTIKAN ---
  {
    id: "KLR-PLT-001",
    tanggal: "2026-02-14",
    pos: "Pelantikan",
    kategori: "Sewa Tempat / Sound / Akomodasi",
    jumlah: 2500000,
    keterangan: "Sewa aula gedung pertemuan & sound system Pelantikan Pengurus Masa Khidmat 2026",
    pic: "Sahabat Rizky Maulana (Ketua Panitia)",
    bukti: "NOTA-AULA-PLT-01"
  },
  {
    id: "KLR-PLT-002",
    tanggal: "2026-02-15",
    pos: "Pelantikan",
    kategori: "Konsumsi & Logistik",
    jumlah: 1800000,
    keterangan: "Konsumsi prasmanan tamu kehormatan PC PMII, Mabinkom, Alumni & undangan",
    pic: "Sahabati Nurul Aini (Bendahara)",
    bukti: "NOTA-KNS-PLT-02"
  },
  {
    id: "KLR-PLT-003",
    tanggal: "2026-02-12",
    pos: "Pelantikan",
    kategori: "Publikasi, Dekorasi & Cenderamata",
    jumlah: 650000,
    keterangan: "Cetak backdrop banner panggung, ID card panitia, dan vandel cenderamata PC PMII",
    pic: "Sahabati Fitriyah (Biro Media)",
    bukti: "NOTA-PRT-PLT-03"
  },

  // --- POS PENGELUARAN: MAPABA ---
  {
    id: "KLR-2024-001",
    tanggal: "2024-09-25",
    pos: "MAPABA",
    kategori: "Sewa Tempat / Sound / Akomodasi",
    jumlah: 1800000,
    keterangan: "Sewa aula dan sound system pembukaan Masa Penerimaan Anggota Baru (MAPABA)",
    pic: "Sahabat Rizky Maulana (Ketua Panitia)",
    bukti: "NOTA-AULA-01"
  },
  {
    id: "KLR-2024-002",
    tanggal: "2024-09-27",
    pos: "MAPABA",
    kategori: "Konsumsi & Logistik",
    jumlah: 1450000,
    keterangan: "Konsumsi peserta dan panitia MAPABA selama 3 hari",
    pic: "Sahabat Danang Prasetyo",
    bukti: "KWT-KNS-09"
  },
  {
    id: "KLR-2024-003",
    tanggal: "2024-09-28",
    pos: "MAPABA",
    kategori: "Modul, Sertifikat & Kit",
    jumlah: 550000,
    keterangan: "Pengadaan modul materi MAPABA, sertifikat, dan ID Card peserta",
    pic: "Sahabat Dimas Arya",
    bukti: "PRT-MPB-03"
  },

  // --- POS PENGELUARAN: PKD ---
  {
    id: "KLR-2024-004",
    tanggal: "2024-10-14",
    pos: "PKD",
    kategori: "Sewa Tempat / Sound / Akomodasi",
    jumlah: 2500000,
    keterangan: "Sewa gedung dan akomodasi Pelatihan Kader Dasar (PKD) ISMU",
    pic: "Sahabat Rizky Maulana (Ketua Panitia)",
    bukti: "KWT-AULA-15"
  },
  {
    id: "KLR-2024-005",
    tanggal: "2024-10-15",
    pos: "PKD",
    kategori: "Konsumsi & Logistik",
    jumlah: 1700000,
    keterangan: "Konsumsi prasmanan peserta & instruktur PKD",
    pic: "Sahabati Siti Munawaroh",
    bukti: "NOTA-KTR-15"
  },
  {
    id: "KLR-2024-006",
    tanggal: "2024-10-16",
    pos: "PKD",
    kategori: "Honor Pemateri & Narasumber",
    jumlah: 650000,
    keterangan: "Transportasi & cenderamata instruktur BPK PC PMII Kab. Sumenep serta modul PKD",
    pic: "Sahabat Ahmad Faruq (Sekretaris)",
    bukti: "NOTA-PRT-44"
  },

  // --- POS PENGELUARAN: LAIN-LAIN ---
  {
    id: "KLR-2024-007",
    tanggal: "2024-09-08",
    pos: "Lain-lain",
    kategori: "Kesekretariatan & ATK",
    jumlah: 350000,
    keterangan: "Pembelian kertas HVS 5 rim, tinta printer EPSON & stempel kepengurusan",
    pic: "Sahabat Ahmad Faruq (Sekretaris)",
    bukti: "NOTA-ATK-882"
  },
  {
    id: "KLR-2024-008",
    tanggal: "2024-09-22",
    pos: "Lain-lain",
    kategori: "Konsumsi & Logistik",
    jumlah: 275000,
    keterangan: "Konsumsi snack dan kopi rapat pleno pengurus komisariat",
    pic: "Sahabat Danang Prasetyo",
    bukti: "KW-04/PLN"
  },
  {
    id: "KLR-2024-009",
    tanggal: "2024-11-02",
    pos: "Lain-lain",
    kategori: "Transportasi & Operasional",
    jumlah: 450000,
    keterangan: "Bantuan operasional bensin & akomodasi delegasi komisariat Konfercab PC PMII Kab. Sumenep",
    pic: "Sahabat Ahmad Faruq (Sekretaris)",
    bukti: "OPR-KNF-02"
  }
];

// Data Agenda & Presensi Rapat Pengurus Komisariat
const defaultRapat = [
  {
    id: "RPT-2026-001",
    agenda: "Rapat Pleno BPH & Pembentukan Panitia Pelantikan Pengurus 2026",
    tanggal: "2026-01-20",
    waktu: "19.30 - 22.00 WIB",
    tempat: "Sekretariat PK PMII ISMU Tarate",
    pimpinan: "Ahmad Zainuri (Ketua Umum)",
    notulis: "M. Fathur Rozak (Sekretaris Umum)",
    notulensi: "1. Menyepakati tanggal pelaksanaan pelantikan pengurus pada pertengahan Februari 2026 di Aula Kampus ISMU Tarate.\n2. Pembentukan susunan panitia pelantikan dengan Ketua Panitia Sahabat Rizky Maulana.\n3. Rincian kebutuhan anggaran awal diajukan sebesar Rp 7.500.000 meliputi sewa tempat, konsumsi tamu Mabinkom/PC PMII, dan atribut pelantikan.\n4. Rapat koordinasi lanjutan dijadwalkan minggu depan bersama seluruh biro.",
    presensi: [
      { id: "PGR-001", nama: "Ahmad Zainuri", jabatan: "Ketua Umum", status: "Hadir", keterangan: "Memimpin jalannya rapat pleno" },
      { id: "PGR-002", nama: "M. Fathur Rozak", jabatan: "Sekretaris Umum", status: "Hadir", keterangan: "Mencatat notulensi rapat" },
      { id: "PGR-003", nama: "Nurul Aini", jabatan: "Bendahara Umum", status: "Hadir", keterangan: "Memaparkan estimasi kas" },
      { id: "PGR-004", nama: "Siti Nur Halimah", jabatan: "Ketua KOPRI", status: "Hadir", keterangan: "Koordinasi divisi konsumsi & tamu" },
      { id: "PGR-005", nama: "Rizky Maulana", jabatan: "Biro Kaderisasi", status: "Hadir", keterangan: "Terpilih sebagai Ketua Panitia" },
      { id: "PGR-006", nama: "Dimas Arya", jabatan: "Biro Gerakan & Aksi", status: "Izin", keterangan: "Izin dinas kerja malam" },
      { id: "PGR-007", nama: "Zainal Arifin", jabatan: "Biro Keagamaan & Aswaja", status: "Hadir", keterangan: "Membaca doa pembuka & penutup" },
      { id: "PGR-008", nama: "Fitriyah", jabatan: "Biro Media & Komunikasi", status: "Hadir", keterangan: "Dokumentasi & publikasi" },
      { id: "PGR-009", nama: "Danang Prasetyo", jabatan: "Biro Pengembangan Organisasi", status: "Sakit", keterangan: "Demam / flu istirahat di kos" },
      { id: "PGR-010", nama: "Achmad Baihaki", jabatan: "Biro Hubungan Kampus & Alumni", status: "Hadir", keterangan: "Komunikasi Mabinkom & rektorat" }
    ]
  },
  {
    id: "RPT-2026-002",
    agenda: "Rapat Koordinasi & Pemantapan Konsep MAPABA & PKD 2026",
    tanggal: "2026-02-05",
    waktu: "20.00 - 22.30 WIB",
    tempat: "Aula Lt. 2 Kampus ISMU Tarate",
    pimpinan: "Ahmad Zainuri (Ketua Umum)",
    notulis: "M. Fathur Rozak (Sekretaris Umum)",
    notulensi: "1. Target kuota peserta MAPABA tahun 2026 minimal 60 mahasiswa baru dari Fakultas Tarbiyah, FEBI, dan Syariah.\n2. PKD direncanakan setelah MAPABA dengan mendatangkan instruktur BPK PC PMII Kab. Sumenep.\n3. Pemantapan modul materi kaderisasi dan screening peserta agar ideologi Aswaja tertanam kuat.\n4. Penyusunan proposal kemitraan dan sowan ke para Masyayikh & Mabinkom.",
    presensi: [
      { id: "PGR-001", nama: "Ahmad Zainuri", jabatan: "Ketua Umum", status: "Hadir", keterangan: "Arahan umum kaderisasi" },
      { id: "PGR-002", nama: "M. Fathur Rozak", jabatan: "Sekretaris Umum", status: "Hadir", keterangan: "Notulensi rapat" },
      { id: "PGR-003", nama: "Nurul Aini", jabatan: "Bendahara Umum", status: "Hadir", keterangan: "Laporan kas masuk & keluar" },
      { id: "PGR-004", nama: "Siti Nur Halimah", jabatan: "Ketua KOPRI", status: "Hadir", keterangan: "Pengawalan kader sahabati" },
      { id: "PGR-005", nama: "Rizky Maulana", jabatan: "Biro Kaderisasi", status: "Hadir", keterangan: "Pemaparan kurikulum kaderisasi" },
      { id: "PGR-006", nama: "Dimas Arya", jabatan: "Biro Gerakan & Aksi", status: "Hadir", keterangan: "Logistik & perlengkapan" },
      { id: "PGR-007", nama: "Zainal Arifin", jabatan: "Biro Keagamaan & Aswaja", status: "Hadir", keterangan: "Materi ke-Aswaja-an" },
      { id: "PGR-008", nama: "Fitriyah", jabatan: "Biro Media & Komunikasi", status: "Hadir", keterangan: "Desain pamflet & media sosial" },
      { id: "PGR-009", nama: "Danang Prasetyo", jabatan: "Biro Pengembangan Organisasi", status: "Hadir", keterangan: "Database keanggotaan" },
      { id: "PGR-010", nama: "Achmad Baihaki", jabatan: "Biro Hubungan Kampus & Alumni", status: "Izin", keterangan: "Keperluan keluarga di luar kota" }
    ]
  }
];

// Data Susunan Pengurus Struktural per Tahun / Periode
const defaultPengurus = [
  {
    periode: "2026",
    label: "Masa Khidmat 2026 - 2027",
    isAktif: true,
    struktur: [
      {
        id: "PGR-2026-001",
        kategori: "Badan Pengurus Harian (BPH)",
        jabatan: "Ketua Umum Komisariat",
        nama: "Sahabat M. Ilham Fathoni",
        nim: "220101110023",
        fakultas: "Fakultas Tarbiyah",
        whatsapp: "081234567801",
        foto: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=faces",
        urutan: 1
      },
      {
        id: "PGR-2026-002",
        kategori: "Badan Pengurus Harian (BPH)",
        jabatan: "Wakil Ketua I (Kaderisasi)",
        nama: "Sahabat Rizky Maulana",
        nim: "230301110012",
        fakultas: "Fakultas Ekonomi & Bisnis Islam",
        whatsapp: "081234567804",
        foto: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=faces",
        urutan: 2
      },
      {
        id: "PGR-2026-003",
        kategori: "Badan Pengurus Harian (BPH)",
        jabatan: "Wakil Ketua II (Gerakan & Advokasi)",
        nama: "Sahabat Fajar Shodiq",
        nim: "240201110018",
        fakultas: "Fakultas Syariah",
        whatsapp: "081234567808",
        foto: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&h=200&fit=crop&crop=faces",
        urutan: 3
      },
      {
        id: "PGR-2026-004",
        kategori: "Badan Pengurus Harian (BPH)",
        jabatan: "Ketua Mandataris KOPRI",
        nama: "Sahabati Siti Nur Halimah",
        nim: "220202110088",
        fakultas: "Fakultas Syariah",
        whatsapp: "081234567803",
        foto: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=faces",
        urutan: 4
      },
      {
        id: "PGR-2026-005",
        kategori: "Badan Pengurus Harian (BPH)",
        jabatan: "Sekretaris Umum Komisariat",
        nama: "Sahabat Ahmad Faruq Al-Faruqi",
        nim: "220101110045",
        fakultas: "Fakultas Tarbiyah",
        whatsapp: "081234567802",
        foto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=faces",
        urutan: 5
      },
      {
        id: "PGR-2026-006",
        kategori: "Badan Pengurus Harian (BPH)",
        jabatan: "Bendahara Umum Komisariat",
        nama: "Sahabati Nur Lailia Ramadhani",
        nim: "230102110056",
        fakultas: "Fakultas Tarbiyah",
        whatsapp: "081234567805",
        foto: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=faces",
        urutan: 6
      },
      {
        id: "PGR-2026-007",
        kategori: "Biro & Departemen",
        jabatan: "Koordinator Biro Kaderisasi & SDM",
        nama: "Sahabat Danang Prasetyo",
        nim: "230302110090",
        fakultas: "Fakultas Ekonomi & Bisnis Islam",
        whatsapp: "081234567812",
        foto: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=faces",
        urutan: 7
      },
      {
        id: "PGR-2026-008",
        kategori: "Biro & Departemen",
        jabatan: "Koordinator Biro Media & Publikasi",
        nama: "Sahabati Annisa Rahmawati",
        nim: "240301110034",
        fakultas: "Fakultas Ekonomi & Bisnis Islam",
        whatsapp: "081234567807",
        foto: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=200&h=200&fit=crop&crop=faces",
        urutan: 8
      },
      {
        id: "PGR-2026-009",
        kategori: "Biro & Departemen",
        jabatan: "Koordinator Biro Kajian Aswaja & Keislaman",
        nama: "Sahabat Zainal Arifin",
        nim: "230201110041",
        fakultas: "Fakultas Syariah",
        whatsapp: "081234567815",
        foto: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=faces",
        urutan: 9
      }
    ]
  },
  {
    periode: "2025",
    label: "Masa Khidmat 2025 - 2026",
    isAktif: false,
    struktur: [
      {
        id: "PGR-2025-001",
        kategori: "Badan Pengurus Harian (BPH)",
        jabatan: "Ketua Umum Komisariat",
        nama: "Sahabat Ahmad Faruq Al-Faruqi",
        nim: "220101110045",
        fakultas: "Fakultas Tarbiyah",
        whatsapp: "081234567802",
        foto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=faces",
        urutan: 1
      },
      {
        id: "PGR-2025-002",
        kategori: "Badan Pengurus Harian (BPH)",
        jabatan: "Sekretaris Umum Komisariat",
        nama: "Sahabat M. Ilham Fathoni",
        nim: "220101110023",
        fakultas: "Fakultas Tarbiyah",
        whatsapp: "081234567801",
        foto: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=faces",
        urutan: 2
      },
      {
        id: "PGR-2025-003",
        kategori: "Badan Pengurus Harian (BPH)",
        jabatan: "Bendahara Umum Komisariat",
        nama: "Sahabati Siti Munawaroh",
        nim: "220301110011",
        fakultas: "Fakultas Ekonomi & Bisnis Islam",
        whatsapp: "081234567899",
        foto: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=faces",
        urutan: 3
      }
    ]
  },
  {
    periode: "2024",
    label: "Masa Khidmat 2024 - 2025",
    isAktif: false,
    struktur: [
      {
        id: "PGR-2024-001",
        kategori: "Badan Pengurus Harian (BPH)",
        jabatan: "Ketua Umum Komisariat",
        nama: "Sahabat M. Bahrul Ulum, S.H.",
        nim: "210201110005",
        fakultas: "Fakultas Syariah",
        whatsapp: "081234567806",
        foto: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=200&h=200&fit=crop&crop=faces",
        urutan: 1
      },
      {
        id: "PGR-2024-002",
        kategori: "Badan Pengurus Harian (BPH)",
        jabatan: "Sekretaris Umum Komisariat",
        nama: "Sahabat Ahmad Faruq Al-Faruqi",
        nim: "220101110045",
        fakultas: "Fakultas Tarbiyah",
        whatsapp: "081234567802",
        foto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=faces",
        urutan: 2
      },
      {
        id: "PGR-2024-003",
        kategori: "Badan Pengurus Harian (BPH)",
        jabatan: "Bendahara Umum Komisariat",
        nama: "Sahabati Siti Munawaroh",
        nim: "220301110011",
        fakultas: "Fakultas Ekonomi & Bisnis Islam",
        whatsapp: "081234567899",
        foto: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=faces",
        urutan: 3
      }
    ]
  }
];

// Data Dewan Ketua Umum Komisariat dari Masa ke Masa (KETUM KOM)
const defaultKetumKom = [
  {
    id: "KTM-2026",
    tahun: "2026",
    periode: "2026 - 2027",
    nama: "Sahabat M. Ilham Fathoni",
    fakultas: "Fakultas Tarbiyah (PAI)",
    status: "Sedang Menjabat (Aktif)",
    foto: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=faces",
    visi: "Digitalisasi Gerakan & Penguatan Ideologi Aswaja Transformatif di Era Modern",
    prestasi: "Pelopor Sistem Informasi Kaderisasi Berbasis Digital & Kemandirian Ekonomi Komisariat",
    whatsapp: "081234567801",
    email: "ilham.fathoni@student.ismu.ac.id"
  },
  {
    id: "KTM-2025",
    tahun: "2025",
    periode: "2025 - 2026",
    nama: "Sahabat Ahmad Faruq Al-Faruqi",
    fakultas: "Fakultas Tarbiyah (PAI)",
    status: "Demisioner",
    foto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=faces",
    visi: "Kader Inklusif, Kritis Progresif, dan Berakar pada Tradisi Pesantren Tarate",
    prestasi: "Penyelenggaraan MAPABA Akbar dan Penataan Tertib Administrasi Kesekretariatan",
    whatsapp: "081234567802",
    email: "faruq.pai@student.ismu.ac.id"
  },
  {
    id: "KTM-2024",
    tahun: "2024",
    periode: "2024 - 2025",
    nama: "Sahabat M. Bahrul Ulum, S.H.",
    fakultas: "Fakultas Syariah (HKI)",
    status: "Demisioner",
    foto: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=200&h=200&fit=crop&crop=faces",
    visi: "Sinergi Advokasi Kebijakan Kampus dan Pengembangan Riset Hukum Kader Santri",
    prestasi: "Penyelenggaraan PKD Tingkat Lanjut & Advokasi Hak-Hak Mahasiswa Institut Miftahul Ulum",
    whatsapp: "081234567806",
    email: "bahrul.ulum@gmail.com"
  },
  {
    id: "KTM-2023",
    tahun: "2023",
    periode: "2023 - 2024",
    nama: "Sahabat Abdul Wahab Hasbullah, S.Pd.",
    fakultas: "Fakultas Tarbiyah (PBA)",
    status: "Demisioner",
    foto: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=faces",
    visi: "Menghidupkan Budaya Literasi & Dialektika Intelektual Mahasiswa Santri",
    prestasi: "Mendirikan Pojok Baca Pergerakan & Penguatan Sinergi Alumni Mabinkom",
    whatsapp: "081234567905",
    email: "wahab.hasbullah@gmail.com"
  },
  {
    id: "KTM-2022",
    tahun: "2022",
    periode: "2022 - 2023",
    nama: "Sahabat Ahmad Baihaqi, S.Kom.",
    fakultas: "Fakultas Tarbiyah",
    status: "Demisioner",
    foto: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop&crop=faces",
    visi: "Pemanfaatan Media Informasi Digital untuk Syiar Pergerakan Mahasiswa Islam",
    prestasi: "Inisiasi Website dan Akun Media Sosial Resmi PK PMII ISMU Pertama Kali",
    whatsapp: "081234567902",
    email: "baihaqi.it@gmail.com"
  }
];

const defaultAnggaran = [
  // --- POS ANGGARAN: PELANTIKAN ---
  {
    id: "AGR-PLT-001",
    pos: "Pelantikan",
    kegiatan: "Pelantikan Pengurus Komisariat Masa Khidmat 2026",
    nama: "Sewa Gedung Pelantikan & Sound System",
    jumlah: 2500000,
    tanggalTarget: "2026-02-15",
    status: "Proses Pendanaan",
    keterangan: "Sewa aula gedung pertemuan untuk pelantikan pengurus komisariat masa khidmat 2026-2027"
  },
  {
    id: "AGR-PLT-002",
    pos: "Pelantikan",
    kegiatan: "Pelantikan Pengurus Komisariat Masa Khidmat 2026",
    nama: "Konsumsi Tamu Undangan, Mabinkom & Pengurus (150 Porsi)",
    jumlah: 3000000,
    tanggalTarget: "2026-02-15",
    status: "Menunggu Kas",
    keterangan: "Konsumsi prasmanan tamu kehormatan PC PMII, Mabinkom, Alumni, dan pengurus"
  },
  {
    id: "AGR-PLT-003",
    pos: "Pelantikan",
    kegiatan: "Pelantikan Pengurus Komisariat Masa Khidmat 2026",
    nama: "Backdrop Banner, ID Card Panitia & Cinderamata",
    jumlah: 1200000,
    tanggalTarget: "2026-02-10",
    status: "Proses Pendanaan",
    keterangan: "Pencetakan backdrop panggung utama, ID card panitia, dan vandel plakat penghargaan"
  },
  {
    id: "AGR-PLT-004",
    pos: "Pelantikan",
    kegiatan: "Pelantikan Pengurus Komisariat Masa Khidmat 2026",
    nama: "Penerbitan Buku Saku & Penggandaan Berkas SK Pengurus",
    jumlah: 800000,
    tanggalTarget: "2026-02-10",
    status: "Menunggu Kas",
    keterangan: "Cetak buku saku pedoman kerja pengurus dan arsip pengesahan SK Cabang Sumenep"
  },

  // --- POS ANGGARAN: PKD ---
  {
    id: "AGR-PKD-001",
    pos: "PKD",
    kegiatan: "Pelatihan Kader Dasar (PKD) Ke-IV",
    nama: "Sewa Lokasi / Penginapan Kaderisasi PKD (3 Hari 2 Malam)",
    jumlah: 3000000,
    tanggalTarget: "2026-05-20",
    status: "Menunggu Kas",
    keterangan: "Sewa tempat pelatihan intensif kaderisasi formal tahap 2 dan fasilitas akomodasi"
  },
  {
    id: "AGR-PKD-002",
    pos: "PKD",
    kegiatan: "Pelatihan Kader Dasar (PKD) Ke-IV",
    nama: "Pengadaan Modul Pedoman Kaderisasi Formal PKD (50 Eks)",
    jumlah: 1500000,
    tanggalTarget: "2026-05-15",
    status: "Proses Pendanaan",
    keterangan: "Cetak jilid materi ideologi, analisa sosial, kepemimpinan, dan strategi gerakan"
  },
  {
    id: "AGR-PKD-003",
    pos: "PKD",
    kegiatan: "Pelatihan Kader Dasar (PKD) Ke-IV",
    nama: "Konsumsi Peserta, Instruktur & Fasilitator (3 Hari)",
    jumlah: 4500000,
    tanggalTarget: "2026-05-22",
    status: "Menunggu Kas",
    keterangan: "Konsumsi 3 kali makan per hari plus coffee break selama seluruh sesi forum PKD"
  },
  {
    id: "AGR-PKD-004",
    pos: "PKD",
    kegiatan: "Pelatihan Kader Dasar (PKD) Ke-IV",
    nama: "Sertifikat Kelulusan, Bet Dada PKD & Piagam Pemateri",
    jumlah: 1000000,
    tanggalTarget: "2026-05-20",
    status: "Menunggu Kas",
    keterangan: "Atribut resmi tanda kelulusan kader mujahid PKD dan piagam narasumber"
  },

  // --- POS ANGGARAN: MAPABA ---
  {
    id: "AGR-MPB-001",
    pos: "MAPABA",
    kegiatan: "Masa Penerimaan Anggota Baru (MAPABA) 2026",
    nama: "Sewa Tempat, Sound System & Perlengkapan MAPABA Raya",
    jumlah: 2000000,
    tanggalTarget: "2026-09-10",
    status: "Menunggu Kas",
    keterangan: "Penyediaan sarana aula pertemuan, sound system, proyektor, dan penataan ruangan"
  },
  {
    id: "AGR-MPB-002",
    pos: "MAPABA",
    kegiatan: "Masa Penerimaan Anggota Baru (MAPABA) 2026",
    nama: "Buku Materi Aswaja, NDP PMII & AD/ART (80 Eks)",
    jumlah: 1800000,
    tanggalTarget: "2026-09-08",
    status: "Proses Pendanaan",
    keterangan: "Buku panduan pengenalan nilai dasar pergerakan dan modul keislaman kader baru"
  },
  {
    id: "AGR-MPB-003",
    pos: "MAPABA",
    kegiatan: "Masa Penerimaan Anggota Baru (MAPABA) 2026",
    nama: "Kaos Peserta, Pin PMII, Blocknote & ID Card (80 Paket)",
    jumlah: 3200000,
    tanggalTarget: "2026-09-10",
    status: "Menunggu Kas",
    keterangan: "Kelengkapan atribut peserta masa penerimaan anggota baru ISMU Tarate"
  },
  {
    id: "AGR-MPB-004",
    pos: "MAPABA",
    kegiatan: "Masa Penerimaan Anggota Baru (MAPABA) 2026",
    nama: "Konsumsi Peserta, Narasumber & Panitia (2 Hari)",
    jumlah: 3500000,
    tanggalTarget: "2026-09-12",
    status: "Menunggu Kas",
    keterangan: "Penyediaan konsumsi prasmanan, coffee break, dan air mineral selama kegiatan MAPABA"
  },

  // --- POS ANGGARAN: LAIN-LAIN ---
  {
    id: "AGR-LL-001",
    pos: "Lain-lain",
    kegiatan: "Peringatan Harlah PMII Ke-66 & Doa Bersama",
    nama: "Peringatan Harlah PMII Ke-66 & Istighatsah Kubro",
    jumlah: 3500000,
    tanggalTarget: "2026-04-17",
    status: "Menunggu Kas",
    keterangan: "Malam tasyakuran harlah PMII, istighatsah kubro, tumpengan bersama kyai dan alumni"
  },
  {
    id: "AGR-LL-002",
    pos: "Lain-lain",
    kegiatan: "Operasional Rutin Sekretariat Komisariat",
    nama: "Operasional Sekretariat, Listrik & Wifi Tahunan",
    jumlah: 2400000,
    tanggalTarget: "2026-01-30",
    status: "Proses Pendanaan",
    keterangan: "Biaya penunjang aktivitas harian sekretariat komisariat, listrik, air, dan koneksi internet"
  },
  {
    id: "AGR-LL-003",
    pos: "Lain-lain",
    kegiatan: "Pengembangan Intelektual & Wacana Kritis",
    nama: "Kajian Rutin Paradigma & Diskusi Mingguan (12 Seri)",
    jumlah: 1200000,
    tanggalTarget: "2026-11-30",
    status: "Menunggu Kas",
    keterangan: "Pengadaan logistik dan konsumsi kajian mingguan telaah pemikiran Aswaja & NDP"
  },
  {
    id: "AGR-LL-004",
    pos: "Lain-lain",
    kegiatan: "Keorganisasian & Sinergi Eksternal",
    nama: "Silaturahmi Alumni, Rapat Kerja & Turba Cabang",
    jumlah: 1500000,
    tanggalTarget: "2026-03-01",
    status: "Menunggu Kas",
    keterangan: "Biaya akomodasi transportasi dan konsumsi pertemuan rapat kerja kelembagaan"
  }
];

const defaultTransaksi = [
  ...defaultPemasukan.map(p => ({ ...p, tipe: 'pemasukan' })),
  ...defaultPengeluaran.map(k => ({ ...k, tipe: 'pengeluaran', kategori: k.pos }))
];
