-- ====================================================================
-- SISTEM INFORMASI & PENDATAAN KADER PMII (TINGKAT KOMISARIAT)
-- PK PMII ISMU (INSTITUT MIFTAHUL ULUM TARATE) SUMENEP
-- Skema Database PostgreSQL (Kompatibel untuk Neon.tech & Supabase)
-- ====================================================================

-- 1. Tabel Profil & Identitas Komisariat
DROP TABLE IF EXISTS tb_presensi_rapat CASCADE;
DROP TABLE IF EXISTS tb_rapat CASCADE;
DROP TABLE IF EXISTS tb_anggaran_rab CASCADE;
DROP TABLE IF EXISTS tb_pengeluaran CASCADE;
DROP TABLE IF EXISTS tb_pemasukan CASCADE;
DROP TABLE IF EXISTS tb_ketum_kom CASCADE;
DROP TABLE IF EXISTS tb_struktur_pengurus CASCADE;
DROP TABLE IF EXISTS tb_periode_pengurus CASCADE;
DROP TABLE IF EXISTS tb_mabinkom CASCADE;
DROP TABLE IF EXISTS tb_kader CASCADE;
DROP TABLE IF EXISTS tb_users CASCADE;
DROP TABLE IF EXISTS tb_komisariat CASCADE;

CREATE TABLE tb_komisariat (
  id SERIAL PRIMARY KEY,
  nama VARCHAR(100) NOT NULL DEFAULT 'PK PMII ISMU',
  nama_lengkap VARCHAR(255) NOT NULL DEFAULT 'Pengurus Komisariat PMII ISMU',
  kampus VARCHAR(255) NOT NULL DEFAULT 'INSTITUT MIFTAHUL ULUM TARATE',
  cabang VARCHAR(150) NOT NULL DEFAULT 'PC PMII Kab. Sumenep',
  pkc VARCHAR(150) NOT NULL DEFAULT 'PKC PMII Jawa Timur',
  masa_khidmat VARCHAR(50) NOT NULL DEFAULT '2026-2027',
  ketua_komisariat VARCHAR(150) DEFAULT 'Ahmad Zainuri',
  sekretaris_komisariat VARCHAR(150) DEFAULT 'M. Fathur Rozak',
  bendahara_komisariat VARCHAR(150) DEFAULT 'Nurul Aini',
  nomor_sk VARCHAR(150) DEFAULT '042.PC-XX.V-02.01.001.A-1.02.2026',
  alamat TEXT,
  email VARCHAR(150) DEFAULT 'pmii.ismu.tarate@gmail.com',
  telepon VARCHAR(50) DEFAULT '085231998877',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO tb_komisariat (id, nama, nama_lengkap, kampus, cabang, pkc, masa_khidmat, ketua_komisariat, sekretaris_komisariat, bendahara_komisariat, nomor_sk, alamat, email, telepon)
VALUES (1, 'PK PMII ISMU', 'Pengurus Komisariat PMII ISMU', 'INSTITUT MIFTAHUL ULUM TARATE', 'PC PMII Kab. Sumenep', 'PKC PMII Jawa Timur', '2026-2027', 'Ahmad Zainuri', 'M. Fathur Rozak', 'Nurul Aini', '042.PC-XX.V-02.01.001.A-1.02.2026', 'Jl. KH. M. Kholil No. 12 Tarate, Pandian, Kec. Kota, Kab. Sumenep, Madura', 'pmii.ismu.tarate@gmail.com', '085231998877');

-- 2. Tabel Manajemen Pengguna / Akun Pengurus
CREATE TABLE tb_users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  nama_lengkap VARCHAR(150) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'admin',
  email VARCHAR(150),
  status VARCHAR(20) DEFAULT 'aktif',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO tb_users (username, password_hash, nama_lengkap, role, email, status)
VALUES 
('admin', 'admin123', 'Administrator PMII ISMU', 'admin', 'admin@pmii-ismu.org', 'aktif'),
('ketua', 'ketua123', 'Ahmad Zainuri (Ketum)', 'ketua', 'ketua@pmii-ismu.org', 'aktif'),
('sekretaris', 'sekretaris123', 'M. Fathur Rozak (Sekum)', 'sekretaris', 'sekretaris@pmii-ismu.org', 'aktif'),
('bendahara', 'bendahara123', 'Nurul Aini (Bendum)', 'bendahara', 'bendahara@pmii-ismu.org', 'aktif'),
('kader', 'kader123', 'Sahabat Kader PMII', 'kader', 'kader@pmii-ismu.org', 'aktif');

-- 3. Tabel Induk Master Data Kader
CREATE TABLE tb_kader (
  id VARCHAR(50) PRIMARY KEY,
  no_kta VARCHAR(50) NOT NULL UNIQUE,
  nik VARCHAR(20),
  nim VARCHAR(30) NOT NULL,
  nama VARCHAR(150) NOT NULL,
  nama_panggilan VARCHAR(50),
  gender VARCHAR(20) NOT NULL DEFAULT 'Laki-laki',
  tempat_lahir VARCHAR(100),
  tanggal_lahir DATE,
  fakultas VARCHAR(100) NOT NULL,
  jurusan VARCHAR(100) NOT NULL,
  angkatan VARCHAR(10) NOT NULL,
  status_kuliah VARCHAR(50) DEFAULT 'Aktif',
  alamat TEXT,
  whatsapp VARCHAR(30),
  email VARCHAR(100),
  foto TEXT,
  status_kader VARCHAR(50) DEFAULT 'Aktif',
  formal VARCHAR(20) NOT NULL DEFAULT 'MAPABA',
  tahun_mapaba VARCHAR(10),
  penyelenggara_mapaba VARCHAR(150) DEFAULT 'PK PMII ISMU Tarate',
  tahun_pkd VARCHAR(10),
  penyelenggara_pkd VARCHAR(150),
  tahun_pkl VARCHAR(10),
  kopri VARCHAR(50) DEFAULT '-',
  tahun_sig VARCHAR(10),
  tahun_skk VARCHAR(10),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_kader_fakultas ON tb_kader(fakultas);
CREATE INDEX idx_kader_angkatan ON tb_kader(angkatan);
CREATE INDEX idx_kader_formal ON tb_kader(formal);

INSERT INTO tb_kader (id, no_kta, nik, nim, nama, nama_panggilan, gender, tempat_lahir, tanggal_lahir, fakultas, jurusan, angkatan, status_kuliah, alamat, whatsapp, email, foto, status_kader, formal, tahun_mapaba, penyelenggara_mapaba, tahun_pkd, penyelenggara_pkd)
VALUES 
('KDR-001', '13.01.2023.001', '3529012204020001', '230101001', 'Sahabat M. Ilham Fathoni', 'Ilham', 'Laki-laki', 'Sumenep', '2004-04-12', 'Fakultas Tarbiyah', 'Pendidikan Agama Islam (PAI)', '2023', 'Aktif', 'Jl. Trunojoyo No. 45, Sumenep', '081234567890', 'ilham.fathoni@gmail.com', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80', 'Aktif', 'PKD', '2023', 'PK PMII ISMU', '2024', 'PC PMII Kab. Sumenep'),
('KDR-002', '13.01.2023.002', '3529014508020002', '230102014', 'Sahabati Siti Nur Halimah', 'Halimah', 'Perempuan', 'Pamekasan', '2004-08-15', 'Fakultas Tarbiyah', 'Pendidikan Bahasa Arab (PBA)', '2023', 'Aktif', 'Desa Tarate, Sumenep', '082345678901', 'nurhalimah.siti@gmail.com', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80', 'Aktif', 'PKD', '2023', 'PK PMII ISMU', '2024', 'PC PMII Kab. Sumenep'),
('KDR-003', '13.01.2024.003', '3529021001030003', '240201008', 'Sahabat Rizky Maulana', 'Rizky', 'Laki-laki', 'Sumenep', '2005-01-10', 'FEBI', 'Ekonomi Syariah (ES)', '2024', 'Aktif', 'Kec. Kalianget, Sumenep', '083456789012', 'rizky.maulana@gmail.com', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80', 'Aktif', 'MAPABA', '2024', 'PK PMII ISMU', NULL, NULL),
('KDR-004', '13.01.2024.004', '3529035511030004', '240202022', 'Sahabati Nur Lailia Ramadhani', 'Lia', 'Perempuan', 'Sampang', '2005-11-20', 'FEBI', 'Perbankan Syariah (PS)', '2024', 'Aktif', 'Desa Pandian, Kec. Kota, Sumenep', '085678901234', 'nurlailia.r@gmail.com', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80', 'Aktif', 'MAPABA', '2024', 'PK PMII ISMU', NULL, NULL),
('KDR-005', '13.01.2024.005', '3529011505030005', '240301019', 'Sahabat Fajar Shodiq', 'Fajar', 'Laki-laki', 'Sumenep', '2005-05-18', 'Fakultas Syariah', 'Hukum Keluarga Islam (HKI)', '2024', 'Aktif', 'Desa Marengan Daya, Sumenep', '087890123456', 'fajar.shodiq@gmail.com', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80', 'Aktif', 'MAPABA', '2024', 'PK PMII ISMU', NULL, NULL);

-- 4. Tabel Majelis Pembina Komisariat (Mabinkom)
CREATE TABLE tb_mabinkom (
  id VARCHAR(50) PRIMARY KEY,
  nama VARCHAR(150) NOT NULL,
  gelar VARCHAR(100),
  jabatan VARCHAR(100) NOT NULL DEFAULT 'Anggota Mabinkom',
  periode VARCHAR(50) DEFAULT '2026-2027',
  kiprah TEXT,
  profesi VARCHAR(150),
  kontak VARCHAR(50),
  foto TEXT,
  status VARCHAR(50) DEFAULT 'Aktif',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO tb_mabinkom (id, nama, gelar, jabatan, periode, kiprah, profesi, kontak, foto, status)
VALUES 
('MBN-001', 'Dr. KH. Achmad Fauzi', 'M.Pd.I', 'Ketua Dewan Pembina', '2026-2027', 'Mantan Ketua Umum PK PMII ISMU Angkatan 2008 & Dosen Senior Pascasarjana', 'Akademisi & Pimpinan Yayasan', '081233445566', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80', 'Aktif'),
('MBN-002', 'K.H. Zainal Muttaqin', 'S.Sy., M.H.', 'Sekretaris Dewan Pembina', '2026-2027', 'Alumni Aktivis Advokasi PMII & Praktisi Hukum di Kab. Sumenep', 'Advokat / Praktisi Hukum', '081344556677', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80', 'Aktif'),
('MBN-003', 'Hj. Siti Romlah', 'M.Pd.', 'Anggota Dewan Pembina', '2026-2027', 'Penggerak KOPRI pertama di kampus ISMU Tarate & Pengurus Muslimat NU', 'Dosen Fakultas Tarbiyah', '081455667788', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80', 'Aktif');

-- 5. Tabel Periode & Struktur Pengurus
CREATE TABLE tb_periode_pengurus (
  id SERIAL PRIMARY KEY,
  periode VARCHAR(20) NOT NULL UNIQUE,
  tema VARCHAR(255),
  is_aktif BOOLEAN NOT NULL DEFAULT FALSE,
  sk_pengesahan VARCHAR(150),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO tb_periode_pengurus (periode, tema, is_aktif, sk_pengesahan)
VALUES 
('2026', 'Transformasi Gerakan Kader Intelektual Menuju Era Keemasan ISMU', TRUE, '042.PC-XX.V-02.01.001.A-1.02.2026'),
('2025', 'Memperkokoh Aswaja & Militansi Kader di Tengah Arus Digitalisasi', FALSE, '038.PC-XX.V-02.01.001.A-1.01.2025');

CREATE TABLE tb_struktur_pengurus (
  id VARCHAR(50) PRIMARY KEY,
  periode VARCHAR(20) NOT NULL,
  kategori VARCHAR(100) NOT NULL,
  jabatan VARCHAR(100) NOT NULL,
  nama VARCHAR(150) NOT NULL,
  fakultas VARCHAR(100),
  kontak VARCHAR(50),
  foto TEXT,
  status VARCHAR(50) DEFAULT 'Aktif',
  urutan INT DEFAULT 1
);

INSERT INTO tb_struktur_pengurus (id, periode, kategori, jabatan, nama, fakultas, kontak, foto, status, urutan)
VALUES 
('PGR-2026-001', '2026', 'Badan Pengurus Harian (BPH)', 'Ketua Umum Komisariat', 'Sahabat M. Ilham Fathoni', 'Fakultas Tarbiyah', '081234567890', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80', 'Aktif', 1),
('PGR-2026-002', '2026', 'Badan Pengurus Harian (BPH)', 'Wakil Ketua I (Kaderisasi)', 'Sahabat Rizky Maulana', 'FEBI', '083456789012', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80', 'Aktif', 2),
('PGR-2026-003', '2026', 'Badan Pengurus Harian (BPH)', 'Wakil Ketua II (Gerakan & Advokasi)', 'Sahabat Fajar Shodiq', 'Fakultas Syariah', '087890123456', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80', 'Aktif', 3),
('PGR-2026-004', '2026', 'Badan Pengurus Harian (BPH)', 'Ketua Mandataris KOPRI', 'Sahabati Siti Nur Halimah', 'Fakultas Tarbiyah', '082345678901', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80', 'Aktif', 4),
('PGR-2026-005', '2026', 'Badan Pengurus Harian (BPH)', 'Sekretaris Umum Komisariat', 'Sahabat Ahmad Faruq Al-Faruqi', 'Fakultas Tarbiyah', '089901234567', 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=300&q=80', 'Aktif', 5),
('PGR-2026-006', '2026', 'Badan Pengurus Harian (BPH)', 'Bendahara Umum Komisariat', 'Sahabati Nur Lailia Ramadhani', 'FEBI', '085678901234', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80', 'Aktif', 6),
('PGR-2026-007', '2026', 'Biro / Departemen', 'Biro Kaderisasi & Pengembangan SDM', 'Sahabat Danang Prasetyo', 'Fakultas Syariah', '082123456789', 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=300&q=80', 'Aktif', 7),
('PGR-2026-008', '2026', 'Biro / Departemen', 'Biro Kajian Keislaman & Aswaja', 'Sahabat Zainal Arifin', 'Fakultas Tarbiyah', '085234567891', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80', 'Aktif', 8);

-- 6. Tabel Ketua Umum dari Masa ke Masa
CREATE TABLE tb_ketum_kom (
  id VARCHAR(50) PRIMARY KEY,
  nama VARCHAR(150) NOT NULL,
  periode VARCHAR(50) NOT NULL,
  tahun_mulai VARCHAR(10) NOT NULL,
  tahun_selesai VARCHAR(10) NOT NULL,
  foto TEXT,
  profesi_sekarang VARCHAR(150),
  kontak VARCHAR(50),
  fakultas VARCHAR(100),
  status VARCHAR(50) DEFAULT 'Demisioner',
  visi TEXT,
  prestasi TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO tb_ketum_kom (id, nama, periode, tahun_mulai, tahun_selesai, foto, profesi_sekarang, kontak, fakultas, status, visi, prestasi)
VALUES 
('KTM-001', 'Sahabat M. Ilham Fathoni', '2026-2027', '2026', '2027', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80', 'Mahasiswa Tingkat Akhir & Aktivis Kampus', '081234567890', 'Fakultas Tarbiyah', 'Aktif Menjabat', 'Menjadikan PMII ISMU sebagai episentrum kaderisasi berbasis riset dan pengabdian masyarakat.', 'Membawa penambahan kader terbanyak pada MAPABA 2026'),
('KTM-002', 'Sahabat Ahmad Faruq Al-Faruqi', '2025-2026', '2025', '2026', 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=300&q=80', 'Peneliti Muda & Asisten Dosen', '089901234567', 'Fakultas Tarbiyah', 'Demisioner', 'Konsolidasi ideologis dan penguatan literasi digital kader santri.', 'Inisiator digitalisasi sistem pendataan kader berbasis web di ISMU'),
('KTM-003', 'Sahabat Danang Prasetyo', '2024-2025', '2024', '2025', 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=300&q=80', 'Staf Legal Advokasi & Wiraswasta', '082123456789', 'Fakultas Syariah', 'Demisioner', 'Kaderisasi militan berintegritas dan tanggap terhadap problem sosial daerah.', 'Penyelenggaraan PKD Akbar pertama bersama seluruh komisariat se-Sumenep');

-- 7. Tabel Pemasukan Kas
CREATE TABLE tb_pemasukan (
  id VARCHAR(50) PRIMARY KEY,
  bukti VARCHAR(50),
  tanggal DATE NOT NULL,
  kategori VARCHAR(100) NOT NULL,
  keterangan TEXT NOT NULL,
  diterima_dari VARCHAR(150) NOT NULL,
  pic VARCHAR(150) NOT NULL,
  jumlah NUMERIC(15,2) NOT NULL DEFAULT 0.00,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO tb_pemasukan (id, bukti, tanggal, kategori, keterangan, diterima_dari, pic, jumlah)
VALUES 
('KAS-IN-001', 'BKK-09/01', '2026-01-10', 'Iuran Wajib Kader', 'Iuran kas bulanan pengurus komisariat periode September 2024', 'Pengurus & Kader Komisariat', 'Sahabati Nurul Aini (Bendahara)', 750000.00),
('KAS-IN-002', 'BKM-09/02', '2026-01-15', 'Donasi Alumni', 'Bantuan operasional kesekretariatan awal kepengurusan dari K.H. Zainal Muttaqin', 'K.H. Zainal Muttaqin (Alumni/Mabinkom)', 'Sahabat M. Ilham Fathoni (Ketum)', 1500000.00),
('KAS-IN-003', 'BKM-10/01', '2026-02-01', 'Sponsorship & Usaha', 'Keuntungan penjualan atribut pin, stiker & kaos pergerakan PMII ISMU', 'Divisi Kewirausahaan Komisariat', 'Sahabat Fajar Shodiq', 850000.00),
('KAS-IN-004', 'BKK-10/01', '2026-02-10', 'Iuran Wajib Kader', 'Iuran kas bulanan pengurus komisariat periode Oktober 2024', 'Pengurus Komisariat', 'Sahabati Nurul Aini (Bendahara)', 650000.00),
('KAS-IN-005', 'BKM-11/01', '2026-02-15', 'Donasi Mabinkom', 'Sumbangan sukarela pembinaan kader dari Mabinkom untuk kegiatan komisariat', 'Dewan Pembina (Mabinkom)', 'Sahabat M. Ilham Fathoni (Ketum)', 2000000.00);

-- 8. Tabel Pengeluaran Kas (4 Pos)
CREATE TABLE tb_pengeluaran (
  id VARCHAR(50) PRIMARY KEY,
  pos VARCHAR(50) NOT NULL,
  bukti VARCHAR(50),
  tanggal DATE NOT NULL,
  kategori VARCHAR(100) NOT NULL,
  kegiatan VARCHAR(255),
  keterangan TEXT NOT NULL,
  pic VARCHAR(150) NOT NULL,
  jumlah NUMERIC(15,2) NOT NULL DEFAULT 0.00,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO tb_pengeluaran (id, pos, bukti, tanggal, kategori, kegiatan, keterangan, pic, jumlah)
VALUES 
('KAS-OUT-001', 'PELANTIKAN', 'NOTA-AULA-PLT-01', '2026-01-25', 'Sewa Tempat & Fasilitas', 'Pelantikan Pengurus 2026', 'Sewa aula gedung pertemuan & sound system Pelantikan Pengurus Masa Khidmat 2026', 'Sahabat Rizky Maulana (Ketua Panitia)', 2500000.00),
('KAS-OUT-002', 'PELANTIKAN', 'NOTA-KONS-PLT-02', '2026-01-26', 'Konsumsi', 'Pelantikan Pengurus 2026', 'Konsumsi prasmanan tamu undangan, Masyayikh, Mabinkom & seluruh jajaran pengurus', 'Sahabati Nur Lailia Ramadhani', 2800000.00),
('KAS-OUT-003', 'PELANTIKAN', 'NOTA-ATTR-PLT-03', '2026-01-27', 'Atribut & Dokumentasi', 'Pelantikan Pengurus 2026', 'Cetak backdrop banner pelantikan 4x3 meter, ID card panitia, dan vandel cindera mata', 'Sahabat Danang Prasetyo', 1200000.00),
('KAS-OUT-004', 'MAPABA', 'KW-01/MPB', '2026-02-05', 'Kesekretariatan MAPABA', 'MAPABA 2026', 'Penggandaan modul materi ke-PMII-an dan buku saku pedoman peserta MAPABA 2026', 'Sahabat Ahmad Faruq (Sekretaris)', 850000.00),
('KAS-OUT-005', 'MAPABA', 'KW-02/MPB', '2026-02-06', 'Sewa Tempat & Banner', 'MAPABA 2026', 'Sewa gedung aula pertemuan pondok pesantren dan cetak backdrop MAPABA', 'Sahabat Danang Prasetyo', 1200000.00),
('KAS-OUT-006', 'MAPABA', 'KW-03/MPB', '2026-02-07', 'Konsumsi & Logistik', 'MAPABA 2026', 'Konsumsi makanan berat dan snack selama 3 hari pelaksanaan MAPABA (60 peserta)', 'Sahabati Nur Lailia Ramadhani', 1750000.00),
('KAS-OUT-007', 'PKD', 'KW-01/PKD', '2026-02-12', 'Bisyarah Narasumber', 'PKD 2026', 'Bisyarah dan cinderamata instruktur pelatihan BPK PC PMII Sumenep & narasumber ideologi', 'Sahabat Rizky Maulana', 1500000.00),
('KAS-OUT-008', 'PKD', 'KW-02/PKD', '2026-02-13', 'Sertifikat & Modul PKD', 'PKD 2026', 'Cetak sertifikat berhologram resmi PC PMII dan binder materi lanjutan kaderisasi', 'Sahabat Ahmad Faruq', 1100000.00),
('KAS-OUT-009', 'PKD', 'KW-03/PKD', '2026-02-14', 'Konsumsi & Akomodasi', 'PKD 2026', 'Konsumsi harian peserta dan panitia PKD di lokasi karantina kaderisasi', 'Sahabati Siti Nur Halimah', 2250000.00),
('KAS-OUT-010', 'LAIN-LAIN', 'NOTA-ATK-882', '2026-01-20', 'Operasional & ATK', 'Operasional Komisariat', 'Pembelian kertas HVS 5 rim, tinta printer EPSON & stempel kepengurusan', 'Sahabat Ahmad Faruq (Sekretaris)', 425000.00),
('KAS-OUT-011', 'LAIN-LAIN', 'KW-04/PLN', '2026-02-01', 'Konsumsi & Rapat', 'Rapat Pleno', 'Konsumsi snack dan kopi rapat pleno pengurus komisariat', 'Sahabat Danang Prasetyo', 250000.00),
('KAS-OUT-012', 'LAIN-LAIN', 'KW-WIFI-02', '2026-02-02', 'Utilitas & Komunikasi', 'Operasional Sekretariat', 'Iuran internet WiFi sekretariat komisariat bulan Februari 2026', 'Sahabat M. Ilham Fathoni', 400000.00);

-- 9. Tabel Rencana Anggaran Biaya (RAB)
CREATE TABLE tb_anggaran_rab (
  id VARCHAR(50) PRIMARY KEY,
  pos VARCHAR(50) NOT NULL,
  kegiatan VARCHAR(255) NOT NULL,
  nama VARCHAR(255) NOT NULL,
  jumlah NUMERIC(15,2) NOT NULL DEFAULT 0.00,
  tanggal_target DATE,
  status VARCHAR(50) NOT NULL DEFAULT 'Menunggu Kas',
  keterangan TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO tb_anggaran_rab (id, pos, kegiatan, nama, jumlah, tanggal_target, status, keterangan)
VALUES 
('AGR-PLT-001', 'Pelantikan', 'Pelantikan Pengurus Komisariat Masa Khidmat 2026', 'Sewa Gedung Pelantikan & Sound System', 2500000.00, '2026-02-15', 'Terpenuhi', 'Sewa aula gedung pertemuan untuk pelantikan pengurus komisariat masa khidmat 2026-2027'),
('AGR-PLT-002', 'Pelantikan', 'Pelantikan Pengurus Komisariat Masa Khidmat 2026', 'Konsumsi Tamu Undangan, Mabinkom & Pengurus (150 Porsi)', 3000000.00, '2026-02-15', 'Sebagian', 'Prasmanan tamu Masyayikh, Mabinkom, PC PMII Kab. Sumenep, dan kader undangan'),
('AGR-PLT-003', 'Pelantikan', 'Pelantikan Pengurus Komisariat Masa Khidmat 2026', 'Backdrop Banner, ID Card Panitia & Cinderamata', 1200000.00, '2026-02-12', 'Terpenuhi', 'Banner panggung ukuran 6x3.5 m, kartu pengenal panitia, dan vandel penghargaan alumni'),
('AGR-PLT-004', 'Pelantikan', 'Pelantikan Pengurus Komisariat Masa Khidmat 2026', 'Atribut Jas Pengurus & Buku Panduan Khidmat', 1800000.00, '2026-02-10', 'Menunggu Kas', 'Pengadaan jas seragam pengurus BPH dan buku panduan organisasi masa khidmat 2026'),
('AGR-PKD-001', 'PKD', 'Pelatihan Kader Dasar (PKD) Ke-IX', 'Bisyarah Instruktur & Pemateri BPK PC PMII', 2000000.00, '2026-03-20', 'Menunggu Kas', 'Honorarium transport dan cinderamata tim instruktur kaderisasi cabang selama 4 hari'),
('AGR-PKD-002', 'PKD', 'Pelatihan Kader Dasar (PKD) Ke-IX', 'Penggandaan Modul Teori Kritis & Binder Peserta', 1200000.00, '2026-03-18', 'Menunggu Kas', 'Modul kaderisasi formal tingkat 2, map, blocknote dan bolpoin untuk 35 peserta'),
('AGR-PKD-003', 'PKD', 'Pelatihan Kader Dasar (PKD) Ke-IX', 'Akomodasi & Konsumsi Karantina PKD (4 Hari)', 3500000.00, '2026-03-20', 'Menunggu Kas', 'Konsumsi 3x sehari selama forum karantina kaderisasi berlangsung di asrama'),
('AGR-MPB-001', 'MAPABA', 'Masa Penerimaan Anggota Baru (MAPABA) 2026', 'Modul Ke-PMII-an, Buku Saku Aswaja & Pin Atribut', 1500000.00, '2026-09-15', 'Menunggu Kas', 'Target 70 peserta mahasiswa baru dari 3 fakultas (Tarbiyah, FEBI, Syariah)'),
('AGR-MPB-002', 'MAPABA', 'Masa Penerimaan Anggota Baru (MAPABA) 2026', 'Sewa Aula Kampus & Sound System Outbound', 1500000.00, '2026-09-18', 'Menunggu Kas', 'Sewa fasilitas penunjang stadium general dan penutupan baiat kader'),
('AGR-LL-001', 'Lain-lain', 'Operasional Kesekretariatan Komisariat', 'Pengadaan Kertas HVS, Tinta & Printer Sekretariat', 800000.00, '2026-02-28', 'Sebagian', 'Kebutuhan surat-menyurat resmi komisariat, proposal kemitraan, dan arsip'),
('AGR-LL-002', 'Lain-lain', 'Operasional Kesekretariatan Komisariat', 'Iuran Internet WiFi Sekretariat 6 Bulan', 1800000.00, '2026-03-01', 'Menunggu Kas', 'Akses internet penunjang pusat data kader dan kegiatan digitalisasi kader');

-- 10. Tabel Agenda & Notulensi Rapat
CREATE TABLE tb_rapat (
  id VARCHAR(50) PRIMARY KEY,
  agenda VARCHAR(255) NOT NULL,
  tanggal DATE NOT NULL,
  waktu VARCHAR(100) DEFAULT '19.30 - Selesai',
  tempat VARCHAR(255) DEFAULT 'Sekretariat PK PMII ISMU Tarate',
  pimpinan VARCHAR(150),
  notulis VARCHAR(150),
  notulensi TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO tb_rapat (id, agenda, tanggal, waktu, tempat, pimpinan, notulis, notulensi)
VALUES 
('RPT-2026-001', 'Rapat Pleno BPH & Pembentukan Panitia Pelantikan Pengurus 2026', '2026-01-20', '19.30 - 22.00 WIB', 'Sekretariat PK PMII ISMU Tarate', 'Ahmad Zainuri (Ketua Umum)', 'M. Fathur Rozak (Sekretaris Umum)', '1. Menyepakati tanggal pelaksanaan pelantikan pengurus pada pertengahan Februari 2026 di Aula Kampus ISMU Tarate.\n2. Pembentukan susunan panitia pelantikan dengan Ketua Panitia Sahabat Rizky Maulana.\n3. Rincian kebutuhan anggaran awal diajukan sebesar Rp 7.500.000 meliputi sewa tempat, konsumsi tamu Mabinkom/PC PMII, dan atribut pelantikan.\n4. Rapat koordinasi lanjutan dijadwalkan minggu depan bersama seluruh biro.'),
('RPT-2026-002', 'Rapat Koordinasi & Pemantapan Konsep MAPABA & PKD 2026', '2026-02-05', '20.00 - 22.30 WIB', 'Aula Lt. 2 Kampus ISMU Tarate', 'Ahmad Zainuri (Ketua Umum)', 'M. Fathur Rozak (Sekretaris Umum)', '1. Target kuota peserta MAPABA tahun 2026 minimal 60 mahasiswa baru dari Fakultas Tarbiyah, FEBI, dan Syariah.\n2. PKD direncanakan setelah MAPABA dengan mendatangkan instruktur BPK PC PMII Kab. Sumenep.\n3. Pemantapan modul materi kaderisasi dan screening peserta agar ideologi Aswaja tertanam kuat.\n4. Penyusunan proposal kemitraan dan sowan ke para Masyayikh & Mabinkom.');

-- 11. Tabel Presensi Kehadiran Pengurus per Rapat
CREATE TABLE tb_presensi_rapat (
  id SERIAL PRIMARY KEY,
  rapat_id VARCHAR(50) NOT NULL REFERENCES tb_rapat(id) ON DELETE CASCADE,
  pengurus_id VARCHAR(50),
  nama VARCHAR(150) NOT NULL,
  jabatan VARCHAR(150) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'Hadir',
  keterangan VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO tb_presensi_rapat (rapat_id, pengurus_id, nama, jabatan, status, keterangan)
VALUES 
('RPT-2026-001', 'PGR-001', 'Ahmad Zainuri', 'Ketua Umum', 'Hadir', 'Memimpin jalannya rapat pleno'),
('RPT-2026-001', 'PGR-002', 'M. Fathur Rozak', 'Sekretaris Umum', 'Hadir', 'Mencatat notulensi rapat'),
('RPT-2026-001', 'PGR-003', 'Nurul Aini', 'Bendahara Umum', 'Hadir', 'Memaparkan estimasi kas'),
('RPT-2026-001', 'PGR-004', 'Siti Nur Halimah', 'Ketua KOPRI', 'Hadir', 'Koordinasi divisi konsumsi & tamu'),
('RPT-2026-001', 'PGR-005', 'Rizky Maulana', 'Biro Kaderisasi', 'Hadir', 'Terpilih sebagai Ketua Panitia'),
('RPT-2026-001', 'PGR-006', 'Dimas Arya', 'Biro Gerakan & Aksi', 'Izin', 'Izin dinas kerja malam'),
('RPT-2026-001', 'PGR-007', 'Zainal Arifin', 'Biro Keagamaan & Aswaja', 'Hadir', 'Membaca doa pembuka & penutup'),
('RPT-2026-001', 'PGR-008', 'Fitriyah', 'Biro Media & Komunikasi', 'Hadir', 'Dokumentasi & publikasi'),
('RPT-2026-001', 'PGR-009', 'Danang Prasetyo', 'Biro Pengembangan Organisasi', 'Sakit', 'Demam / flu istirahat di kos'),
('RPT-2026-001', 'PGR-010', 'Achmad Baihaki', 'Biro Hubungan Kampus & Alumni', 'Hadir', 'Komunikasi Mabinkom & rektorat'),
('RPT-2026-002', 'PGR-001', 'Ahmad Zainuri', 'Ketua Umum', 'Hadir', 'Arahan umum kaderisasi'),
('RPT-2026-002', 'PGR-002', 'M. Fathur Rozak', 'Sekretaris Umum', 'Hadir', 'Notulensi rapat'),
('RPT-2026-002', 'PGR-003', 'Nurul Aini', 'Bendahara Umum', 'Hadir', 'Laporan kas masuk & keluar'),
('RPT-2026-002', 'PGR-004', 'Siti Nur Halimah', 'Ketua KOPRI', 'Hadir', 'Pengawalan kader sahabati'),
('RPT-2026-002', 'PGR-005', 'Rizky Maulana', 'Biro Kaderisasi', 'Hadir', 'Pemaparan kurikulum kaderisasi'),
('RPT-2026-002', 'PGR-006', 'Dimas Arya', 'Biro Gerakan & Aksi', 'Hadir', 'Logistik & perlengkapan'),
('RPT-2026-002', 'PGR-007', 'Zainal Arifin', 'Biro Keagamaan & Aswaja', 'Hadir', 'Materi ke-Aswaja-an'),
('RPT-2026-002', 'PGR-008', 'Fitriyah', 'Biro Media & Komunikasi', 'Hadir', 'Desain pamflet & media sosial'),
('RPT-2026-002', 'PGR-009', 'Danang Prasetyo', 'Biro Pengembangan Organisasi', 'Hadir', 'Database keanggotaan'),
('RPT-2026-002', 'PGR-010', 'Achmad Baihaki', 'Biro Hubungan Kampus & Alumni', 'Izin', 'Keperluan keluarga di luar kota');

