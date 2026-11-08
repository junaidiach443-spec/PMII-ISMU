# 📘 Panduan Penggunaan Database MySQL & Backend PHP
## Sistem Informasi & Pendataan Kader PK PMII ISMU (Institut Miftahul Ulum Tarate) Sumenep

Dokumen ini berisi panduan lengkap langkah demi langkah untuk mengaktifkan database **MySQL** dan menghubungkan aplikasi web **PMII ISMU** melalui backend **PHP PDO API**.

---

## 📁 File Database & Backend yang Disediakan

| File / Folder | Fungsi & Deskripsi |
| :--- | :--- |
| **`database_postgres.sql`** | Skrip pembuatan database PostgreSQL Cloud (kompatibel langsung untuk **Neon.tech** & **Supabase**). |
| **`database.sql`** | Skrip pembuatan database MySQL / MariaDB (untuk **XAMPP** atau hosting **cPanel** phpMyAdmin). |
| **`api/koneksi.php`** | Koneksi PDO MySQL aman dengan UTF-8, CORS headers, dan penanganan error. |
| **`api/get_data.php`** | Endpoint API untuk mengambil seluruh data dari MySQL ke aplikasi frontend. |
| **`api/save_data.php`** | Endpoint API untuk menyimpan dan menyinkronkan data dari frontend ke MySQL. |
| **`api/test_koneksi.php`**| Endpoint diagnostik untuk menguji status server MySQL dan jumlah data. |
| **`api/auth.php`** | Endpoint autentikasi login pengurus / administrator. |

---

## 🗄️ Struktur Tabel Database (`db_pmii_ismu`)

1. **`tb_komisariat`**: Profil identitas komisariat, nomor SK cabang/PKC, susunan ketua, sekretaris, bendahara, dan alamat.
2. **`tb_users`**: Akun pengguna sistem (Admin, Ketum, Sekum, Bendum) dengan password hash.
3. **`tb_kader`**: Master data induk kader (NIK, NIM, No. KTA, Nama, TTL, Fakultas, Jurusan, Angkatan, Jenjang Kaderisasi Mapaba/PKD/PKL/KOPRI, Foto, dan Kontak WA).
4. **`tb_mabinkom`**: Data Majelis Pembina Komisariat (Mabinkom), gelar, profesi, dan kiprah alumni.
5. **`tb_periode_pengurus`**: Riwayat periode kepengurusan komisariat per tahun masa khidmat (2026, 2025, dst.).
6. **`tb_struktur_pengurus`**: Susunan nama pengurus struktural per periode (BPH dan jajaran Biro/Departemen).
7. **`tb_ketum_kom`**: Rekam jejak Ketua Umum Komisariat dari masa ke masa, masa jabatan, visi misi, dan prestasi.
8. **`tb_pemasukan`**: Catatan arus kas masuk (Iuran kader, donasi alumni/Mabinkom, usaha mandiri).
9. **`tb_pengeluaran`**: Catatan arus kas keluar dengan **4 Pos Anggaran Terpisah** (**PELANTIKAN**, **PKD**, **MAPABA**, **LAIN-LAIN**).
10. **`tb_anggaran_rab`**: Rencana Anggaran Biaya (RAB) per pos kegiatan dan status pemenuhan pagu.
11. **`tb_rapat`**: Agenda rapat pengurus, tanggal, waktu, tempat, pimpinan, notulis, dan hasil notulensi.
12. **`tb_presensi_rapat`**: Daftar absensi kehadiran pengurus per rapat (Hadir, Izin, Sakit, Alpa) dan catatan keterangan.

---

## 🚀 Panduan 1: Menjalankan di Komputer Lokal (XAMPP)

### Langkah 1: Jalankan XAMPP
1. Buka aplikasi **XAMPP Control Panel**.
2. Klik tombol **Start** pada modul **Apache** dan **MySQL** hingga indikatornya berwarna hijau.

### Langkah 2: Buat Database & Import `database.sql`
1. Buka browser (Chrome / Edge / Firefox) dan akses:
   ```
   http://localhost/phpmyadmin
   ```
2. Klik menu **Databases / Basis Data** di bagian atas.
3. Pada kolom *Create database*, masukkan nama:
   ```
   db_pmii_ismu
   ```
   Pilih collation: `utf8mb4_unicode_ci`, lalu klik **Create**.
4. Klik database `db_pmii_ismu` yang baru dibuat di panel sebelah kiri.
5. Klik tab **Import** di bagian atas menu.
6. Klik tombol **Choose File / Browse**, lalu pilih file **`database.sql`** yang ada di folder proyek ini.
7. Gulir ke bawah dan klik tombol **Go / Impor**.
8. Tunggu beberapa detik hingga muncul pesan sukses berwarna hijau: *"Import has been successfully finished"*.

### Langkah 3: Tempatkan Folder Proyek di `htdocs`
1. Salin (*copy*) seluruh folder proyek ini:
   ```
   APP PMII ISMU
   ```
2. Tempel (*paste*) ke dalam direktori web server XAMPP Anda, biasanya di:
   ```
   C:\xampp\htdocs\app-pmii-ismu
   ```
   *(Anda boleh mengganti nama foldernya menjadi `app-pmii-ismu` agar mudah diketik).*

### Langkah 4: Buka Aplikasi di Browser
Buka browser Anda dan kunjungi tautan:
```
http://localhost/app-pmii-ismu/
```
Sistem akan otomatis mendeteksi koneksi MySQL! Indikator di pojok kanan atas akan berubah menjadi:
> 🟢 **MySQL (Online)**

---

## 🌐 Panduan 2: Deploy ke Hosting cPanel Kampus / Umum

Jika komisariat memiliki hosting atau subdomain kampus (misal: `pmii.ismu.ac.id`):

1. **Buat Database MySQL di cPanel:**
   - Masuk ke cPanel hosting Anda.
   - Buka menu **MySQL Database Wizard**.
   - Buat nama database baru (misal: `user_pmii_ismu`).
   - Buat user database baru dan password yang kuat.
   - Berikan hak akses **ALL PRIVILEGES** pada user tersebut.
2. **Import `database.sql` di phpMyAdmin cPanel:**
   - Buka menu **phpMyAdmin** di cPanel.
   - Pilih database yang baru Anda buat.
   - Klik tab **Import**, pilih file **`database.sql`**, lalu klik **Go**.
3. **Sesuaikan Konfigurasi di `api/config.local.php` atau `.env`:**
   Buat atau buka file `api/config.local.php` (file ini otomatis aman dan tidak akan ter-upload ke Git):
   ```php
   <?php
   define('DB_DRIVER', 'mysql');
   define('DB_HOST', 'localhost');
   define('DB_NAME', 'nama_database_cpanel_anda');
   define('DB_USER', 'user_database_cpanel_anda');
   define('DB_PASS', 'password_database_anda');
   ```
   *(Atau jika menggunakan PostgreSQL / Neon Cloud, cukup isi `define('DATABASE_URL', 'postgresql://...');`)*
4. **Upload File ke File Manager cPanel:**
   - Kompres seluruh isi folder proyek menjadi file `.zip`.
   - Unggah ke folder `public_html` (atau folder subdomain Anda).
   - Ekstrak file zip tersebut. Selesai!

---

## 🛡️ Akun Login Administrator Bawaan (`tb_users`)

| Role | Username | Password Bawaan |
| :--- | :--- | :--- |
| **Administrator Utama** | `admin` | `admin123` |
| **Ketua Umum (Ketum)** | `ketua` | `ketua123` |
| **Sekretaris Umum (Sekum)** | `sekretaris` | `sekretaris123` |
| **Bendahara Umum (Bendum)** | `bendahara` | `bendahara123` |

*(Password dapat diubah kapan saja di database atau modul pengaturan).*

---

## ⚡ Panduan 3: Deploy Online Otomatis (Vercel + Neon.tech / Supabase)

Ini adalah **solusi paling modern, cepat, dan anti-pusing**. Anda tidak perlu instalasi XAMPP di laptop, tidak perlu sewa hosting berbayar, dan **setiap kali Anda memperbaiki kode, website langsung otomatis terupdate (Auto-Deploy)!**

### Bagian A: Membuat Database Cloud di Neon.tech (Gratis)
1. Buka situs [https://neon.tech](https://neon.tech) dan klik **Sign Up** (bisa langsung pakai akun Google / GitHub).
2. Klik **Create Project**, beri nama misal: `db-pmii-ismu`.
3. Setelah dashboard terbuka, klik menu **SQL Editor** di sidebar kiri Neon.
4. Buka file **`database_postgres.sql`** dari folder proyek ini, salin seluruh isinya, tempelkan ke SQL Editor Neon, lalu klik **Run**.
5. Selesai! Semua tabel kader, kas, anggaran, dan rapat sudah aktif 24 jam di cloud global!

### Bagian B: Menghubungkan Aplikasi ke Neon (Sinkronisasi 2 Arah Otomatis)
1. Buka **Dashboard Neon** ([https://console.neon.tech](https://console.neon.tech)).
2. Di bagian **Connection Details**, salin **Connection String** Anda:
   ```text
   postgresql://neondb_owner:npg_xxxxxxx@ep-cool-fog-123456.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```
   *(Atau cukup salin Host: `ep-cool-fog-123456.us-east-2.aws.neon.tech` dan Password Anda).*
3. Buka aplikasi Anda, masuk ke menu **Pengaturan** (ikon gear di sidebar kiri).
4. Gulir ke bagian **Hosting Online & Database Cloud (Vercel + Neon / Supabase)**:
   - Tempelkan Connection String / Host ke kolom **Neon Host / Connection String**.
   - Masukkan Password database jika diminta (opsional jika sudah ada di connection string).
5. Klik **Simpan & Hubungkan**:
   - Status di pojok kanan atas aplikasi akan langsung berubah menjadi hijau: **`Neon Cloud (Online)`**.
   - Aplikasi akan otomatis menarik seluruh data terbaru yang ada di Neon.
   - **Sinkronisasi 2 Arah Aktif:**
     - Jika data dihapus di Neon, klik tombol **Tarik Data Neon** (atau cukup refresh aplikasi), data di aplikasi langsung terhapus sinkron!
     - Setiap kali Anda menambah/mengedit data kader, kas, atau rapat di aplikasi, aplikasi akan **otomatis menyimpannya langsung ke Neon Cloud**!

### Bagian C: Upload ke GitHub & Sambungkan ke Vercel (Auto-Deploy)
1. **Buat Repository di GitHub:**
   - Buka [https://github.com](https://github.com), buat akun dan buat repositori baru (misal: `app-pmii-ismu`).
   - Unggah berkas proyek ini ke repositori tersebut (bisa drag & drop langsung di web GitHub atau menggunakan aplikasi gratis **GitHub Desktop** yang tinggal klik tanpa perintah terminal).
2. **Sambungkan ke Vercel:**
   - Buka [https://vercel.com](https://vercel.com) dan login dengan akun GitHub Anda.
   - Klik tombol **"Add New Project"** / **"Import"**.
   - Pilih repositori `app-pmii-ismu` dari akun GitHub Anda.
   - Klik **Deploy**.
3. **Hasil:**
   - Dalam 30 detik, Anda langsung mendapatkan domain online resmi, misal:
     ```
     https://app-pmii-ismu.vercel.app
     ```
   - Link ini **bisa dibuka langsung dari HP Android, iPhone, tablet, maupun laptop pengurus di mana saja!**
   - **Auto-Deploy Aktif:** Kapan pun Anda mengedit atau memperbaiki kode di komputer dan menyimpannya ke GitHub, Vercel akan **otomatis mendeteksi dan memperbarui website secara live dalam hitungan detik!**

---

## 🔄 Sistem Dual-Mode (Online & Offline Pintar)
Aplikasi ini dilengkapi arsitektur **Dual-Mode**:
1. **Mode MySQL (Online):** Ketika aplikasi dijalankan di web server (XAMPP / Hosting), setiap penambahan data kader, pengeluaran kas, anggaran, dan absensi rapat akan otomatis tersimpan langsung ke MySQL.
2. **Mode LocalStorage (Offline):** Jika file `index.html` diklik langsung tanpa web server, aplikasi tetap berjalan normal 100% menggunakan penyimpanan lokal browser, sehingga Anda tetap bisa bekerja meskipun sedang tidak ada koneksi server.

