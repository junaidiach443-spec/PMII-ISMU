<?php
/**
 * API: Registrasi Mandiri Kader PMII (Publik)
 * Menerima data pendaftaran dari form-kader.html dan menyimpannya ke database
 * Sistem Informasi & Pendataan Kader PK PMII ISMU Sumenep
 */

require_once __DIR__ . '/koneksi.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse('error', 'Metode tidak diizinkan. Gunakan POST.', null, 405);
}

// Baca input: baik dari JSON body maupun dari FormData (multipart)
$inputRaw = file_get_contents('php://input');
$data = json_decode($inputRaw, true);

if (!$data || !is_array($data)) {
    // Fallback jika dikirim via POST Form biasa
    $data = $_POST;
}

if (empty($data['nama']) || empty($data['nim'])) {
    jsonResponse('error', 'Nama lengkap dan NIM wajib diisi!', null, 400);
}

try {
    $isPgsql = ($pdo->getAttribute(PDO::ATTR_DRIVER_NAME) === 'pgsql');
    
    $nama = trim($data['nama']);
    $nim = trim($data['nim']);
    $namaPanggilan = !empty($data['namaPanggilan']) ? trim($data['namaPanggilan']) : null;
    $gender = !empty($data['gender']) ? trim($data['gender']) : 'Laki-laki';
    $tempatLahir = !empty($data['tempatLahir']) ? trim($data['tempatLahir']) : null;
    $tanggalLahir = !empty($data['tanggalLahir']) ? trim($data['tanggalLahir']) : null;
    $fakultas = !empty($data['fakultas']) ? trim($data['fakultas']) : 'Fakultas Tarbiyah';
    $jurusan = !empty($data['jurusan']) ? trim($data['jurusan']) : 'Pendidikan Agama Islam (PAI)';
    $angkatan = !empty($data['angkatan']) ? (string) trim($data['angkatan']) : date('Y');
    $statusKuliah = !empty($data['statusKuliah']) ? trim($data['statusKuliah']) : 'Aktif';
    $alamat = !empty($data['alamat']) ? trim($data['alamat']) : null;
    $whatsapp = !empty($data['whatsapp']) ? trim($data['whatsapp']) : null;
    $email = !empty($data['email']) ? trim($data['email']) : null;
    $foto = !empty($data['foto']) ? trim($data['foto']) : null;
    $statusKader = 'Aktif';

    // Data Kaderisasi
    $formal = !empty($data['formal']) ? trim($data['formal']) : (!empty($data['kaderisasiFormal']) ? trim($data['kaderisasiFormal']) : 'MAPABA');
    $tahunMapaba = !empty($data['tahunMapaba']) ? trim($data['tahunMapaba']) : $angkatan;
    $penyelenggaraMapaba = !empty($data['penyelenggaraMapaba']) ? trim($data['penyelenggaraMapaba']) : 'PK PMII ISMU';
    $tahunPkd = !empty($data['tahunPkd']) ? trim($data['tahunPkd']) : null;
    $penyelenggaraPkd = !empty($data['penyelenggaraPkd']) ? trim($data['penyelenggaraPkd']) : null;
    $tahunPkl = !empty($data['tahunPkl']) ? trim($data['tahunPkl']) : null;
    $kopri = !empty($data['kopri']) ? trim($data['kopri']) : ($gender === 'Perempuan' ? 'SIG' : '-');
    $tahunSig = !empty($data['tahunSig']) ? trim($data['tahunSig']) : null;
    $tahunSkk = !empty($data['tahunSkk']) ? trim($data['tahunSkk']) : null;

    // 1. Cek apakah NIM sudah terdaftar sebelumnya
    $sqlCheck = $isPgsql 
        ? "SELECT id, no_kta FROM tb_kader WHERE nim = :nim LIMIT 1"
        : "SELECT `id`, `no_kta` FROM `tb_kader` WHERE `nim` = :nim LIMIT 1";
    $stmtCheck = $pdo->prepare($sqlCheck);
    $stmtCheck->execute([':nim' => $nim]);
    $existing = $stmtCheck->fetch();

    if ($existing) {
        $kaderId = $existing['id'];
        $noKta = $existing['no_kta'];
    } else {
        // Buat ID baru unik
        $kaderId = 'KD-' . $angkatan . '-' . str_pad(mt_rand(1, 9999), 4, '0', STR_PAD_LEFT);
        // Buat No KTA PMII otomatis (format standar: 13.01.Angkatan.Urutan)
        $noKta = '13.01.' . $angkatan . '.' . mt_rand(100, 999);
    }

    // 2. Query INSERT / UPDATE (Upsert)
    $sqlUpsert = $isPgsql ? "
        INSERT INTO tb_kader 
        (id, no_kta, nik, nim, nama, nama_panggilan, gender, tempat_lahir, tanggal_lahir, fakultas, jurusan, angkatan, status_kuliah, alamat, whatsapp, email, foto, status_kader, formal, tahun_mapaba, penyelenggara_mapaba, tahun_pkd, penyelenggara_pkd, tahun_pkl, kopri, tahun_sig, tahun_skk)
        VALUES 
        (:id, :no_kta, :nik, :nim, :nama, :nama_panggilan, :gender, :tempat_lahir, :tanggal_lahir, :fakultas, :jurusan, :angkatan, :status_kuliah, :alamat, :whatsapp, :email, :foto, :status_kader, :formal, :th_mapaba, :peny_mapaba, :th_pkd, :peny_pkd, :th_pkl, :kopri, :th_sig, :th_skk)
        ON CONFLICT (id) DO UPDATE SET 
        no_kta = COALESCE(tb_kader.no_kta, EXCLUDED.no_kta),
        nim = EXCLUDED.nim,
        nama = EXCLUDED.nama,
        nama_panggilan = EXCLUDED.nama_panggilan,
        gender = EXCLUDED.gender,
        tempat_lahir = EXCLUDED.tempat_lahir,
        tanggal_lahir = EXCLUDED.tanggal_lahir,
        fakultas = EXCLUDED.fakultas,
        jurusan = EXCLUDED.jurusan,
        angkatan = EXCLUDED.angkatan,
        status_kuliah = EXCLUDED.status_kuliah,
        alamat = EXCLUDED.alamat,
        whatsapp = EXCLUDED.whatsapp,
        email = EXCLUDED.email,
        foto = COALESCE(EXCLUDED.foto, tb_kader.foto),
        status_kader = EXCLUDED.status_kader,
        formal = EXCLUDED.formal,
        tahun_mapaba = EXCLUDED.tahun_mapaba,
        penyelenggara_mapaba = EXCLUDED.penyelenggara_mapaba,
        tahun_pkd = EXCLUDED.tahun_pkd,
        penyelenggara_pkd = EXCLUDED.penyelenggara_pkd,
        tahun_pkl = EXCLUDED.tahun_pkl,
        kopri = EXCLUDED.kopri,
        tahun_sig = EXCLUDED.tahun_sig,
        tahun_skk = EXCLUDED.tahun_skk
    " : "
        INSERT INTO `tb_kader` 
        (`id`, `no_kta`, `nik`, `nim`, `nama`, `nama_panggilan`, `gender`, `tempat_lahir`, `tanggal_lahir`, `fakultas`, `jurusan`, `angkatan`, `status_kuliah`, `alamat`, `whatsapp`, `email`, `foto`, `status_kader`, `formal`, `tahun_mapaba`, `penyelenggara_mapaba`, `tahun_pkd`, `penyelenggara_pkd`, `tahun_pkl`, `kopri`, `tahun_sig`, `tahun_skk`)
        VALUES 
        (:id, :no_kta, :nik, :nim, :nama, :nama_panggilan, :gender, :tempat_lahir, :tanggal_lahir, :fakultas, :jurusan, :angkatan, :status_kuliah, :alamat, :whatsapp, :email, :foto, :status_kader, :formal, :th_mapaba, :peny_mapaba, :th_pkd, :peny_pkd, :th_pkl, :kopri, :th_sig, :th_skk)
        ON DUPLICATE KEY UPDATE 
        `no_kta` = COALESCE(`tb_kader`.`no_kta`, VALUES(`no_kta`)),
        `nim` = VALUES(`nim`),
        `nama` = VALUES(`nama`),
        `nama_panggilan` = VALUES(`nama_panggilan`),
        `gender` = VALUES(`gender`),
        `tempat_lahir` = VALUES(`tempat_lahir`),
        `tanggal_lahir` = VALUES(`tanggal_lahir`),
        `fakultas` = VALUES(`fakultas`),
        `jurusan` = VALUES(`jurusan`),
        `angkatan` = VALUES(`angkatan`),
        `status_kuliah` = VALUES(`status_kuliah`),
        `alamat` = VALUES(`alamat`),
        `whatsapp` = VALUES(`whatsapp`),
        `email` = VALUES(`email`),
        `foto` = IFNULL(VALUES(`foto`), `tb_kader`.`foto`),
        `status_kader` = VALUES(`status_kader`),
        `formal` = VALUES(`formal`),
        `tahun_mapaba` = VALUES(`tahun_mapaba`),
        `penyelenggara_mapaba` = VALUES(`penyelenggara_mapaba`),
        `tahun_pkd` = VALUES(`tahun_pkd`),
        `penyelenggara_pkd` = VALUES(`penyelenggara_pkd`),
        `tahun_pkl` = VALUES(`tahun_pkl`),
        `kopri` = VALUES(`kopri`),
        `tahun_sig` = VALUES(`tahun_sig`),
        `tahun_skk` = VALUES(`tahun_skk`)
    ";

    $stmtUpsert = $pdo->prepare($sqlUpsert);
    $stmtUpsert->execute([
        ':id'            => $kaderId,
        ':no_kta'        => $noKta,
        ':nik'           => !empty($data['nik']) ? trim($data['nik']) : null,
        ':nim'           => $nim,
        ':nama'          => $nama,
        ':nama_panggilan'=> $namaPanggilan,
        ':gender'        => $gender,
        ':tempat_lahir'  => $tempatLahir,
        ':tanggal_lahir' => $tanggalLahir,
        ':fakultas'      => $fakultas,
        ':jurusan'       => $jurusan,
        ':angkatan'      => $angkatan,
        ':status_kuliah' => $statusKuliah,
        ':alamat'        => $alamat,
        ':whatsapp'      => $whatsapp,
        ':email'         => $email,
        ':foto'          => $foto,
        ':status_kader'  => $statusKader,
        ':formal'        => $formal,
        ':th_mapaba'     => $tahunMapaba,
        ':peny_mapaba'   => $penyelenggaraMapaba,
        ':th_pkd'        => $tahunPkd,
        ':peny_pkd'      => $penyelenggaraPkd,
        ':th_pkl'        => $tahunPkl,
        ':kopri'         => $kopri,
        ':th_sig'        => $tahunSig,
        ':th_skk'        => $tahunSkk
    ]);

    // Format response kader
    $savedKader = [
        'id'            => $kaderId,
        'noKta'         => $noKta,
        'nama'          => $nama,
        'namaPanggilan' => $namaPanggilan,
        'gender'        => $gender,
        'nim'           => $nim,
        'fakultas'      => $fakultas,
        'jurusan'       => $jurusan,
        'angkatan'      => $angkatan,
        'statusKuliah'  => $statusKuliah,
        'whatsapp'      => $whatsapp,
        'email'         => $email,
        'foto'          => $foto,
        'kaderisasi'    => [
            'formal'              => $formal,
            'tahunMapaba'         => $tahunMapaba,
            'penyelenggaraMapaba' => $penyelenggaraMapaba,
            'tahunPkd'            => $tahunPkd,
            'penyelenggaraPkd'    => $penyelenggaraPkd,
            'tahunPkl'            => $tahunPkl,
            'kopri'               => $kopri,
            'tahunSig'            => $tahunSig,
            'tahunSkk'            => $tahunSkk
        ],
        'waktuDaftar'   => date('Y-m-d H:i:s')
    ];

    $msg = $existing 
        ? "Biodata Sahabat/i {$nama} berhasil diperbarui di sistem!" 
        : "Alhamdulillah! Pendaftaran kader Sahabat/i {$nama} berhasil disimpan.";

    jsonResponse('success', $msg, $savedKader, 200);

} catch (PDOException $e) {
    error_log('[REGISTER KADER ERROR] ' . $e->getMessage());
    jsonResponse('error', 'Terjadi kesalahan saat menyimpan data: ' . $e->getMessage(), null, 500);
}

