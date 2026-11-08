# 🌟 Sistem Informasi & Pendataan Kader PMII (Tingkat Komisariat)

Aplikasi web modern, responsif, dan siap pakai untuk pengelolaan database kader dan keuangan **Pergerakan Mahasiswa Islam Indonesia (PMII)** pada tingkat **Pengurus Komisariat (PK)**. 

Aplikasi ini dirancang khusus untuk memetakan potensi anggota, mencatat riwayat kaderisasi bertingkat (Mapaba, PKD, PKL, KOPRI), mendata **Dewan Mabinkom (Majelis Pembina Komisariat)**, mengelola **Pemasukan Kas**, memantau **Pengeluaran Pos Anggaran (MAPABA, PKD, LAIN-LAIN)**, serta mencetak **E-KTA (Kartu Tanda Anggota)** digital dengan QR Code verifikasi.

---

## 🚀 Cara Menjalankan Aplikasi

Aplikasi ini dibuat secara **ringan dan mandiri (Zero-Setup)**. Anda **tidak perlu menginstal Node.js, Python, atau XAMPP/PHP** untuk menjalankannya di laptop/komputer.

1. Buka folder proyek ini.
2. Klik dua kali (*double-click*) pada file **`index.html`**.
3. Aplikasi akan langsung terbuka di browser Anda (Google Chrome, Microsoft Edge, Opera, Mozilla Firefox, dll).
4. Selesai! Seluruh data otomatis tersimpan di penyimpanan lokal browser (*LocalStorage*) Anda secara aman.

---

## 📌 Fitur Utama & Struktur Menu

### 1. 📊 Dashboard Statistik Interaktif
* **Metrik Real-Time:** Total kader aktif, kader putra (Sahabat), kader putri (Sahabati / KOPRI), dan jumlah Dewan Mabinkom.
* **Distribusi Kaderisasi:** Jumlah kader berstatus **MAPABA**, **PKD**, **PKL**, **PKN**, serta kaderisasi KOPRI (**SIG**, **SKK**).
* **Widget Ringkasan Kas Keuangan:**
  * Total Kas Masuk (Pemasukan).
  * Total Kas Keluar (Pengeluaran).
  * Saldo Kas Bersih dengan status otomatis (*Surplus* / *Defisit*).
* **Grafik Visual Interaktif (Chart.js):**
  * Grafik Batang: Sebaran kader berdasarkan Fakultas.
  * Grafik Donat: Komposisi jenjang kaderisasi formal.
  * Grafik Lingkaran: Komposisi Sahabat vs Sahabati (KOPRI).

---

### 2. 👥 Manajemen Data Kader
* **Formulir Data Lengkap:**
  * Nomor KTA PMII, NIK (KTP), NIM, Nama Lengkap & Panggilan, Jenis Kelamin.
  * Fakultas, Jurusan / Program Studi, Angkatan Kuliah.
  * Kontak WhatsApp (bisa langsung diklik menuju chat WA), Email, TTL, Alamat Domisili.
  * Unggah Foto Profil Formal Jas PMII.
  * Riwayat Kaderisasi Formal: Jenjang (Mapaba, PKD, PKL, PKN), tahun pelaksanaan, dan instansi penyelenggara.
  * Riwayat Kaderisasi KOPRI: SIG, SKK, SKKN.
  * Jabatan struktural di organisasi.
* **Fitur Spreadsheet Excel Lengkap di Dalam Menu:**
  * 📥 **Download Template Excel:** Format `.xlsx` berkolom rapi siap isi disertai baris contoh.
  * 📤 **Import Excel:** Unggah file Excel `.xlsx` untuk memasukkan puluhan hingga ratusan data kader sekaligus.
  * 📊 **Export Excel:** Unduh database seluruh kader saat ini ke file Excel resmi.
* **Filter Multi-Kategori & Pencarian Instan:**
  * Pencarian instan berdasarkan Nama, NIM, No. KTA, atau Jurusan.
  * Filter Fakultas, Jenjang Kaderisasi, Gender, dan Angkatan Kuliah.
* **Modal Profil Biodata Lengkap:** Pratinjau biodata kader dengan tombol pintas cetak E-KTA.

---

### 3. 🛡️ Data Mabinkom (Majelis Pembina Komisariat)
* Menu khusus pendataan para alumni, pembina, sesepuh, dan tokoh pengarah komisariat.
* **Pencatatan Profil Pembina:**
  * Nama Lengkap & Gelar Akademik/Kehormatan.
  * Jabatan di Dewan Mabinkom (Ketua Dewan Mabinkom, Wakil Ketua, Sekretaris, Anggota Pengarah, dll).
  * Profesi / Pekerjaan Saat Ini (Dosen, Advokat, Pengusaha, Birokrat, dll).
  * Instansi / Lembaga / Tempat Pengabdian.
  * Alumni Angkatan / Tahun Kaderisasi PMII.
  * Kontak WhatsApp & Email.
* **Fitur Spreadsheet Excel di Menu Mabinkom:**
  * 📥 **Download Template Excel:** Format template `.xlsx` data Mabinkom.
  * 📤 **Import Excel:** Batch import data pembina dari file Excel.
  * 📊 **Export Excel:** Unduh daftar lengkap Mabinkom ke Excel.

---

### 4. 🪪 Studio Cetak E-KTA PMII (Kartu Tanda Anggota)
* Desain standar kartu identitas (CR-80) dengan perpaduan warna kebesaran PMII (Biru Navy & Kuning Emas).
* **Tampak Depan:** Foto kader, Nama, NIM, Fakultas & Jurusan, Jenjang Kaderisasi, Nomor Anggota/KTA.
* **Tampak Belakang:** Biodata singkat, masa khidmat, tanda tangan Ketua & Sekretaris Komisariat, serta **QR Code Verifikasi Otomatis**.
* **Ekspor & Cetak:**
  * Unduh gambar PNG Tampak Depan beresolusi tinggi.
  * Unduh gambar PNG Tampak Belakang.
  * Cetak langsung (*Print to PDF* atau printer fisik).

---

### 5. 💰 Pemasukan Kas (Khusus Kas Masuk)
* Menu khusus untuk mengelola seluruh arus kas masuk ke kas komisariat.
* **Kategori Pemasukan:**
  * Iuran Kas Anggota
  * Iuran Kas Pengurus
  * Bantuan / Sumbangan Mabinkom
  * Donatur & Alumni PMII
  * Usaha Mandiri (Danus)
  * Bantuan Kampus / Lembaga
  * Infaq & Shadaqah / Pemasukan Lain-lain.
* **Metrik Pemasukan:** Total akumulasi penerimaan, pemasukan bulan berjalan, dan frekuensi transaksi masuk.
* **Fitur Spreadsheet Excel:**
  * 📥 **Download Template Excel:** Format pencatatan kas masuk siap isi.
  * 📤 **Import Excel:** Batch import data pemasukan dari spreadsheet.
  * 📊 **Export Excel:** Unduh rekap kas masuk ke file `.xlsx`.
* **Kwitansi Kas Masuk Digital:** Dilengkapi kop surat komisariat, nomor bukti kuitansi, terbilang nominal otomatis, dan tanda tangan Bendahara.

---

### 6. 💸 Menu Pengeluaran (Pos: MAPABA, PKD, LAIN-LAIN)
* Menu khusus pencatatan pengeluaran kas yang dikelompokkan ke dalam pos-pos strategis:
  1. **Pos MAPABA** (Masa Penerimaan Anggota Baru)
  2. **Pos PKD** (Pelatihan Kader Dasar)
  3. **Pos LAIN-LAIN** (ATK, Kesekretariatan, Rapat, dan Operasional)
* **Konteks Tahun Khidmat Otomatis:** Menampilkan catatan pengeluaran sesuai tahun masa khidmat yang sedang aktif atau dipilih, dengan selector arsip tahunan.
* **Quick Filter Pos:** Tab filter cepat satu klik untuk beralih antara *Semua Pos*, *MAPABA*, *PKD*, dan *LAIN-LAIN*.
* **Statistik Real-Time Tiap Pos:** Total nominal dan jumlah transaksi masing-masing pos anggaran.
* **Fitur Spreadsheet Excel:**
  * 📥 **Download Template Excel:** Format pencatatan pengeluaran dengan selector kolom pos anggaran.
  * 📤 **Import Excel:** Batch import data nota/pengeluaran ke pos masing-masing.
  * 📊 **Export Excel:** Unduh laporan realisasi anggaran pengeluaran ke `.xlsx`.
* **Voucher / Bukti Kas Keluar Digital:** Cetak bukti pengeluaran dengan tanda tangan PIC pemohon dan Bendahara.

---

### 7. 📋 Rancangan Anggaran Biaya (RAB)
* Menu perencanaan alokasi anggaran kegiatan dan operasional per pos (MAPABA, PKD, LAIN-LAIN).
* **Fitur Spreadsheet Excel:**
  * 📥 **Download Template Excel:** Format standar RAB siap isi (pos, uraian kegiatan, volume, satuan, harga satuan, target tanggal).
  * 📤 **Import Excel RAB:** Unggah rancangan anggaran langsung dari file Excel `.xlsx` dalam satu klik.
  * 📊 **Export Excel RAB:** Unduh rekapitulasi rencana anggaran ke file `.xlsx`.
* **Integrasi Realisasi:** Memantau serapan anggaran per pos secara otomatis terhadap pengeluaran aktual kas.

---

### 8. 🏛️ Struktur Pengurus & Arsip Masa Khidmat
* **Susunan Personalia Lengkap:** Badan Pengurus Harian (BPH) dan Biro/Departemen Pengurus Komisariat.
* **Navigasi Periode Kepengurusan:**
  * Bilah pemilih tahun menampilkan seluruh periode yang memiliki struktur personalia sesuai format masa khidmat di Pengaturan (misal `2026 - 2027 (Aktif)`, `2025 - 2026`, `2024 - 2025`).
  * Beralih tahun dengan satu klik untuk melihat susunan kepengurusan lampau secara lengkap (arsip demisioner).
  * Terhubung otomatis dengan data Ketua Umum dari masa ke masa (Ketum Kom).

---

### 9. 📱 Studio Undangan & WhatsApp Broadcast Ketum (Auto-Runner)
* Fitur khusus Ketua Umum & Pengurus Harian untuk mengirim undangan resmi langsung ke WhatsApp pengurus maupun kader.
* **Nomor Pengirim Resmi Ketum:** Input nomor WhatsApp dan nama Ketua Umum sebagai identitas pengirim resmi.
* **Target Fleksibel:**
  * Seluruh Pengurus Aktif (dengan nomor WhatsApp).
  * Seluruh Kader (dengan filter jenjang Mapaba/PKD/PKL/KOPRI, fakultas, atau angkatan).
  * Dewan Mabinkom (Alumni & Pembina).
* **Personalisasi & Editor Teks:** Menyematkan variabel nama `{nama}`, `{panggilan}`, `{jabatan}`, `{agenda}`, `{hari_tanggal}`, `{waktu}`, `{tempat}` secara dinamis, serta kemampuan mengedit dan menyimpan kustomisasi teks undangan.
* **Mesin Pengiriman (Auto-Runner):**
  * Auto-Blast Runner: Membuka chat WhatsApp penerima satu per satu secara berurutan dengan jeda waktu aman.
  * 1-Klik Kirim Per Orang melalui tombol aksi instan di tabel antrean.
  * Live Chat Preview menyerupai tampilan asli WhatsApp.
  * Fitur salin seluruh nomor WhatsApp (format koma) & salin teks undangan siap pakai.

---

### 10. 📑 Rekapitulasi Laporan Resmi
* **Rekapitulasi Sebaran Kader:** Distribusi kader per fakultas lengkap dengan proporsi Mapaba, PKD, PKL, serta Sahabat vs Sahabati.
* **Rekapitulasi Keuangan per Pos Anggaran:** Laporan komparasi total kas masuk vs realisasi pos MAPABA, PKD, dan LAIN-LAIN beserta saldo akhir.
* Cetak langsung (*Print to PDF*) atau ekspor buku kas ke Excel.

---

### 11. ⚙️ Manajemen Tahun Khidmat, Siklus Keuangan & Cadangan
* **Manajemen Tahun Khidmat & Arsip Tahunan:**
  * Tambah masa khidmat baru dengan pengisian nama Ketum, Sekum, Bendahara, No. SK, dan opsi duplikasi kerangka struktur.
  * **Siklus Berganti Tahun:** Saat mengaktifkan tahun baru, catatan pengeluaran dan anggaran RAB otomatis **direset bersih dari Rp 0** untuk memulai siklus baru, sedangkan data tahun sebelumnya tetap tersimpan rapi di arsip.
  * **Pemasukan Kas Tetap Utuh:** Saldo dan seluruh catatan pemasukan kas dipertahankan secara akumulatif sebagai patokan modal & pendapatan organisasi dari masa ke masa.
* **Pengaturan Profil:** Ubah nama komisariat, kampus, PC, PKC, dan nomor SK.
* **Cadangkan (Backup JSON):** Simpan seluruh database aplikasi (Kader, Mabinkom, Pemasukan, Pengeluaran, Anggaran, Pengurus, Tahun Khidmat, Profil) ke file `.json`.
* **Pulihkan (Restore JSON):** Unggah file cadangan untuk memulihkan seluruh data dalam 1 detik.
* **Reset ke Bawaan:** Kembalikan data ke contoh awal jika ingin memulai dari lembaran baru.

---

### 12. 📱 Formulir Registrasi & Pendataan Mandiri Kader (`form-kader.html`)
* Halaman formulir web khusus publik terpisah dari dashboard admin pengurus yang sangat nyaman dibuka dari HP kader.
* **Fitur Formulir Kader:**
  * Pengisian biodata diri: Nama, NIM, Fakultas, Jurusan, Angkatan, No. WhatsApp, Tempat/Tanggal Lahir, Alamat.
  * Upload pas foto langsung dari Galeri atau Kamera HP dengan kompresi otomatis agar hemat kuota.
  * Riwayat kaderisasi: Jenjang formal (MAPABA/PKD/PKL) dan KOPRI (SIG/SKK).
* **Integrasi Data Otomatis:**
  * Terhubung langsung ke API `api/register_kader.php` (Database MySQL / PostgreSQL Cloud) dan tersimpan ke menu Data Kader.
  * Bukti registrasi digital otomatis terbit berupa kartu KTA sementara ber-QR Code.
  * Tombol 1-klik konfirmasi langsung ke WhatsApp Sekretaris/Pengurus.
* **Tombol Bagikan di Aplikasi Pengurus:**
  * Tombol **"🔗 Bagikan Link Form"** di menu Data Kader.
  * Dilengkapi **QR Code Generator** untuk dicetak/di-scan langsung oleh kader di kampus/lokasi acara, tombol salin link, dan tombol sebar broadcast undangan pengisian ke grup WhatsApp.

---

## 🌐 Cara Mengonlinekan / Hosting Aplikasi (Akses Kader & Pengurus)

Aplikasi ini dapat di-onlinekan agar link formulir `form-kader.html` bisa disebar ke seluruh mahasiswa/kader melalui WhatsApp, dan dashboard pengurus dapat dibuka dari mana saja:

### Pilihan 1: Web Hosting Resmi cPanel (Rekomendasi Terbaik)
1. Beli paket hosting & domain murah (misal: domain `.my.id` atau `.or.id` sekitar Rp 15.000 – Rp 30.000/tahun di Niagahoster, DomaiNesia, Hostinger, IDCloudHost).
2. Masuk ke **cPanel** > buka **File Manager** > masuk ke folder `public_html`.
3. Unggah seluruh isi file proyek ini (bisa dikompres ke format `.zip` lalu klik **Extract**).
4. Buat database MySQL di menu **MySQL Database Wizard** di cPanel, lalu sesuaikan koneksinya di `api/config.local.php`.
5. Tautan siap dibagikan:
   * Dashboard Admin Pengurus: `https://domain-anda.com/`
   * Link Formulir Kader: `https://domain-anda.com/form-kader.html`

### Pilihan 2: Hosting Gratis 100% Selamanya (InfinityFree)
1. Daftar gratis di [InfinityFree.com](https://www.infinityfree.com).
2. Buat akun hosting gratis dengan domain bawaan (contoh: `pmii-ismu.infinityfreeapp.com`).
3. Upload seluruh file ke folder `htdocs` via Online File Manager.
4. Buat database MySQL gratis di kontrol panel InfinityFree.
5. Aplikasi langsung aktif dan dapat diakses kader online tanpa biaya sepeser pun.

### Pilihan 3: Khusus Offline Saat Acara MAPABA (Hotspot / Wi-Fi Lokal)
Jika acara kaderisasi berada di aula/kampus tanpa koneksi internet:
1. Nyalakan Hotspot (Tethering) di laptop pengurus yang menjalankan aplikasi.
2. Sambungkan HP kader ke Wi-Fi / Hotspot laptop tersebut.
3. Cek IP laptop (misal `192.168.1.10`), lalu kader cukup membuka browser di HP dan mengetikkan: `http://192.168.1.10/PMII%20ISMU/form-kader.html`.
4. Seluruh kader dapat mengisi data bersamaan tanpa kuota internet!
