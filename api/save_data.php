<?php
/**
 * API: Simpan / Sinkronkan Data ke MySQL
 * Menerima payload JSON dari frontend dan menyimpannya secara transaksional ke database
 */

require_once __DIR__ . '/koneksi.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse('error', 'Metode request tidak diizinkan. Gunakan POST.', null, 405);
}

// Baca raw body JSON
$inputRaw = file_get_contents('php://input');
$data = json_decode($inputRaw, true);

if (!$data || !is_array($data)) {
    jsonResponse('error', 'Format data JSON tidak valid.', null, 400);
}

try {
    $pdo->beginTransaction();
    $isPgsql = ($pdo->getAttribute(PDO::ATTR_DRIVER_NAME) === 'pgsql');

    // 1. Simpan Profil Komisariat
    if (isset($data['komisariat']) && is_array($data['komisariat'])) {
        $k = $data['komisariat'];
        $sqlKom = $isPgsql ? "
            INSERT INTO tb_komisariat 
            (id, nama, nama_lengkap, kampus, cabang, pkc, masa_khidmat, ketua_komisariat, sekretaris_komisariat, bendahara_komisariat, nomor_sk, alamat, email, telepon)
            VALUES (1, :nama, :nama_lengkap, :kampus, :cabang, :pkc, :masa_khidmat, :ketua, :sekretaris, :bendahara, :sk, :alamat, :email, :telepon)
            ON CONFLICT (id) DO UPDATE SET 
            nama = EXCLUDED.nama, nama_lengkap = EXCLUDED.nama_lengkap, kampus = EXCLUDED.kampus,
            cabang = EXCLUDED.cabang, pkc = EXCLUDED.pkc, masa_khidmat = EXCLUDED.masa_khidmat,
            ketua_komisariat = EXCLUDED.ketua_komisariat, sekretaris_komisariat = EXCLUDED.sekretaris_komisariat,
            bendahara_komisariat = EXCLUDED.bendahara_komisariat, nomor_sk = EXCLUDED.nomor_sk,
            alamat = EXCLUDED.alamat, email = EXCLUDED.email, telepon = EXCLUDED.telepon
        " : "
            INSERT INTO `tb_komisariat` 
            (`id`, `nama`, `nama_lengkap`, `kampus`, `cabang`, `pkc`, `masa_khidmat`, `ketua_komisariat`, `sekretaris_komisariat`, `bendahara_komisariat`, `nomor_sk`, `alamat`, `email`, `telepon`)
            VALUES (1, :nama, :nama_lengkap, :kampus, :cabang, :pkc, :masa_khidmat, :ketua, :sekretaris, :bendahara, :sk, :alamat, :email, :telepon)
            ON DUPLICATE KEY UPDATE 
            `nama` = VALUES(`nama`), `nama_lengkap` = VALUES(`nama_lengkap`), `kampus` = VALUES(`kampus`),
            `cabang` = VALUES(`cabang`), `pkc` = VALUES(`pkc`), `masa_khidmat` = VALUES(`masa_khidmat`),
            `ketua_komisariat` = VALUES(`ketua_komisariat`), `sekretaris_komisariat` = VALUES(`sekretaris_komisariat`),
            `bendahara_komisariat` = VALUES(`bendahara_komisariat`), `nomor_sk` = VALUES(`nomor_sk`),
            `alamat` = VALUES(`alamat`), `email` = VALUES(`email`), `telepon` = VALUES(`telepon`)
        ";
        $stmtKom = $pdo->prepare($sqlKom);
        $stmtKom->execute([
            ':nama'         => $k['nama'] ?? 'PK PMII ISMU',
            ':nama_lengkap' => $k['namaLengkap'] ?? 'Pengurus Komisariat PMII ISMU',
            ':kampus'       => $k['kampus'] ?? '',
            ':cabang'       => $k['cabang'] ?? '',
            ':pkc'          => $k['pkc'] ?? '',
            ':masa_khidmat' => $k['masaKhidmat'] ?? '',
            ':ketua'        => $k['ketuaKomisariat'] ?? '',
            ':sekretaris'   => $k['sekretarisKomisariat'] ?? '',
            ':bendahara'    => $k['bendaharaKomisariat'] ?? '',
            ':sk'           => $k['nomorSK'] ?? '',
            ':alamat'       => $k['alamat'] ?? '',
            ':email'        => $k['email'] ?? '',
            ':telepon'      => $k['telepon'] ?? ''
        ]);
    }

    // 2. Simpan Data Kader
    if (isset($data['kaders']) && is_array($data['kaders'])) {
        $sqlKdr = $isPgsql ? "
            INSERT INTO tb_kader 
            (id, no_kta, nik, nim, nama, nama_panggilan, gender, tempat_lahir, tanggal_lahir, fakultas, jurusan, angkatan, status_kuliah, alamat, whatsapp, email, foto, status_kader, formal, tahun_mapaba, penyelenggara_mapaba, tahun_pkd, penyelenggara_pkd, tahun_pkl, kopri, tahun_sig, tahun_skk)
            VALUES 
            (:id, :no_kta, :nik, :nim, :nama, :nama_panggilan, :gender, :tempat_lahir, :tanggal_lahir, :fakultas, :jurusan, :angkatan, :status_kuliah, :alamat, :whatsapp, :email, :foto, :status_kader, :formal, :th_mapaba, :peny_mapaba, :th_pkd, :peny_pkd, :th_pkl, :kopri, :th_sig, :th_skk)
            ON CONFLICT (id) DO UPDATE SET 
            no_kta = EXCLUDED.no_kta, nik = EXCLUDED.nik, nim = EXCLUDED.nim, nama = EXCLUDED.nama,
            nama_panggilan = EXCLUDED.nama_panggilan, gender = EXCLUDED.gender, tempat_lahir = EXCLUDED.tempat_lahir,
            tanggal_lahir = EXCLUDED.tanggal_lahir, fakultas = EXCLUDED.fakultas, jurusan = EXCLUDED.jurusan,
            angkatan = EXCLUDED.angkatan, status_kuliah = EXCLUDED.status_kuliah, alamat = EXCLUDED.alamat,
            whatsapp = EXCLUDED.whatsapp, email = EXCLUDED.email, foto = EXCLUDED.foto, status_kader = EXCLUDED.status_kader,
            formal = EXCLUDED.formal, tahun_mapaba = EXCLUDED.tahun_mapaba, penyelenggara_mapaba = EXCLUDED.penyelenggara_mapaba,
            tahun_pkd = EXCLUDED.tahun_pkd, penyelenggara_pkd = EXCLUDED.penyelenggara_pkd, tahun_pkl = EXCLUDED.tahun_pkl,
            kopri = EXCLUDED.kopri, tahun_sig = EXCLUDED.tahun_sig, tahun_skk = EXCLUDED.tahun_skk
        " : "
            INSERT INTO `tb_kader` 
            (`id`, `no_kta`, `nik`, `nim`, `nama`, `nama_panggilan`, `gender`, `tempat_lahir`, `tanggal_lahir`, `fakultas`, `jurusan`, `angkatan`, `status_kuliah`, `alamat`, `whatsapp`, `email`, `foto`, `status_kader`, `formal`, `tahun_mapaba`, `penyelenggara_mapaba`, `tahun_pkd`, `penyelenggara_pkd`, `tahun_pkl`, `kopri`, `tahun_sig`, `tahun_skk`)
            VALUES 
            (:id, :no_kta, :nik, :nim, :nama, :nama_panggilan, :gender, :tempat_lahir, :tanggal_lahir, :fakultas, :jurusan, :angkatan, :status_kuliah, :alamat, :whatsapp, :email, :foto, :status_kader, :formal, :th_mapaba, :peny_mapaba, :th_pkd, :peny_pkd, :th_pkl, :kopri, :th_sig, :th_skk)
            ON DUPLICATE KEY UPDATE 
            `no_kta` = VALUES(`no_kta`), `nik` = VALUES(`nik`), `nim` = VALUES(`nim`), `nama` = VALUES(`nama`),
            `nama_panggilan` = VALUES(`nama_panggilan`), `gender` = VALUES(`gender`), `tempat_lahir` = VALUES(`tempat_lahir`),
            `tanggal_lahir` = VALUES(`tanggal_lahir`), `fakultas` = VALUES(`fakultas`), `jurusan` = VALUES(`jurusan`),
            `angkatan` = VALUES(`angkatan`), `status_kuliah` = VALUES(`status_kuliah`), `alamat` = VALUES(`alamat`),
            `whatsapp` = VALUES(`whatsapp`), `email` = VALUES(`email`), `foto` = VALUES(`foto`), `status_kader` = VALUES(`status_kader`),
            `formal` = VALUES(`formal`), `tahun_mapaba` = VALUES(`tahun_mapaba`), `penyelenggara_mapaba` = VALUES(`penyelenggara_mapaba`),
            `tahun_pkd` = VALUES(`tahun_pkd`), `penyelenggara_pkd` = VALUES(`penyelenggara_pkd`), `tahun_pkl` = VALUES(`tahun_pkl`),
            `kopri` = VALUES(`kopri`), `tahun_sig` = VALUES(`tahun_sig`), `tahun_skk` = VALUES(`tahun_skk`)
        ";
        $stmtKdr = $pdo->prepare($sqlKdr);

        $submittedKaderIds = [];
        foreach ($data['kaders'] as $kdr) {
            if (empty($kdr['id'])) continue;
            $submittedKaderIds[] = $kdr['id'];
            $kdrz = $kdr['kaderisasi'] ?? [];

            $stmtKdr->execute([
                ':id'            => $kdr['id'],
                ':no_kta'        => $kdr['noKta'] ?? ('13.01.' . ($kdr['angkatan'] ?? date('Y')) . '.' . substr(uniqid(), -3)),
                ':nik'           => $kdr['nik'] ?? null,
                ':nim'           => $kdr['nim'] ?? '',
                ':nama'          => $kdr['nama'] ?? 'Kader PMII',
                ':nama_panggilan'=> $kdr['namaPanggilan'] ?? null,
                ':gender'        => $kdr['gender'] ?? 'Laki-laki',
                ':tempat_lahir'  => $kdr['tempatLahir'] ?? null,
                ':tanggal_lahir' => !empty($kdr['tanggalLahir']) ? $kdr['tanggalLahir'] : null,
                ':fakultas'      => $kdr['fakultas'] ?? 'Tarbiyah',
                ':jurusan'       => $kdr['jurusan'] ?? 'PAI',
                ':angkatan'      => (string) ($kdr['angkatan'] ?? date('Y')),
                ':status_kuliah' => $kdr['statusKuliah'] ?? 'Aktif',
                ':alamat'        => $kdr['alamat'] ?? null,
                ':whatsapp'      => $kdr['whatsapp'] ?? null,
                ':email'         => $kdr['email'] ?? null,
                ':foto'          => $kdr['foto'] ?? null,
                ':status_kader'  => $kdr['statusKader'] ?? 'Aktif',
                ':formal'        => $kdrz['formal'] ?? 'MAPABA',
                ':th_mapaba'     => $kdrz['tahunMapaba'] ?? null,
                ':peny_mapaba'   => $kdrz['penyelenggaraMapaba'] ?? null,
                ':th_pkd'        => $kdrz['tahunPkd'] ?? null,
                ':peny_pkd'      => $kdrz['penyelenggaraPkd'] ?? null,
                ':th_pkl'        => $kdrz['tahunPkl'] ?? null,
                ':kopri'         => $kdrz['kopri'] ?? '-',
                ':th_sig'        => $kdrz['tahunSig'] ?? null,
                ':th_skk'        => $kdrz['tahunSkk'] ?? null
            ]);
        }

        // Hapus data kader yang sudah dihapus di frontend jika ada id terkirim
        if (!empty($submittedKaderIds)) {
            $inClause = implode(',', array_fill(0, count($submittedKaderIds), '?'));
            $tableKader = $isPgsql ? 'tb_kader' : '`tb_kader`';
            $stmtDel = $pdo->prepare("DELETE FROM {$tableKader} WHERE id NOT IN ($inClause)");
            $stmtDel->execute($submittedKaderIds);
        }
    }

    // 3. Simpan Data Mabinkom
    if (isset($data['mabinkom']) && is_array($data['mabinkom'])) {
        $sqlMbn = $isPgsql ? "
            INSERT INTO tb_mabinkom (id, nama, gelar, jabatan, periode, kiprah, profesi, kontak, foto, status)
            VALUES (:id, :nama, :gelar, :jabatan, :periode, :kiprah, :profesi, :kontak, :foto, :status)
            ON CONFLICT (id) DO UPDATE SET 
            nama = EXCLUDED.nama, gelar = EXCLUDED.gelar, jabatan = EXCLUDED.jabatan,
            periode = EXCLUDED.periode, kiprah = EXCLUDED.kiprah, profesi = EXCLUDED.profesi,
            kontak = EXCLUDED.kontak, foto = EXCLUDED.foto, status = EXCLUDED.status
        " : "
            INSERT INTO `tb_mabinkom` (`id`, `nama`, `gelar`, `jabatan`, `periode`, `kiprah`, `profesi`, `kontak`, `foto`, `status`)
            VALUES (:id, :nama, :gelar, :jabatan, :periode, :kiprah, :profesi, :kontak, :foto, :status)
            ON DUPLICATE KEY UPDATE 
            `nama` = VALUES(`nama`), `gelar` = VALUES(`gelar`), `jabatan` = VALUES(`jabatan`),
            `periode` = VALUES(`periode`), `kiprah` = VALUES(`kiprah`), `profesi` = VALUES(`profesi`),
            `kontak` = VALUES(`kontak`), `foto` = VALUES(`foto`), `status` = VALUES(`status`)
        ";
        $stmtMbn = $pdo->prepare($sqlMbn);
        $submittedMabinkomIds = [];
        foreach ($data['mabinkom'] as $mbn) {
            if (empty($mbn['id'])) continue;
            $submittedMabinkomIds[] = $mbn['id'];
            $stmtMbn->execute([
                ':id'      => $mbn['id'],
                ':nama'    => $mbn['nama'],
                ':gelar'   => $mbn['gelar'] ?? null,
                ':jabatan' => $mbn['jabatan'] ?? 'Anggota Mabinkom',
                ':periode' => $mbn['periode'] ?? '',
                ':kiprah'  => $mbn['kiprah'] ?? '',
                ':profesi' => $mbn['profesi'] ?? '',
                ':kontak'  => $mbn['kontak'] ?? '',
                ':foto'    => $mbn['foto'] ?? '',
                ':status'  => $mbn['status'] ?? 'Aktif'
            ]);
        }
        if (!empty($submittedMabinkomIds)) {
            $inClause = implode(',', array_fill(0, count($submittedMabinkomIds), '?'));
            $tableMbn = $isPgsql ? 'tb_mabinkom' : '`tb_mabinkom`';
            $stmtDel = $pdo->prepare("DELETE FROM {$tableMbn} WHERE id NOT IN ($inClause)");
            $stmtDel->execute($submittedMabinkomIds);
        }
    }

    // 4. Simpan Data Pemasukan
    if (isset($data['pemasukan']) && is_array($data['pemasukan'])) {
        $sqlIn = $isPgsql ? "
            INSERT INTO tb_pemasukan (id, bukti, tanggal, kategori, keterangan, diterima_dari, pic, jumlah)
            VALUES (:id, :bukti, :tanggal, :kategori, :keterangan, :diterima_dari, :pic, :jumlah)
            ON CONFLICT (id) DO UPDATE SET 
            bukti = EXCLUDED.bukti, tanggal = EXCLUDED.tanggal, kategori = EXCLUDED.kategori,
            keterangan = EXCLUDED.keterangan, diterima_dari = EXCLUDED.diterima_dari,
            pic = EXCLUDED.pic, jumlah = EXCLUDED.jumlah
        " : "
            INSERT INTO `tb_pemasukan` (`id`, `bukti`, `tanggal`, `kategori`, `keterangan`, `diterima_dari`, `pic`, `jumlah`)
            VALUES (:id, :bukti, :tanggal, :kategori, :keterangan, :diterima_dari, :pic, :jumlah)
            ON DUPLICATE KEY UPDATE 
            `bukti` = VALUES(`bukti`), `tanggal` = VALUES(`tanggal`), `kategori` = VALUES(`kategori`),
            `keterangan` = VALUES(`keterangan`), `diterima_dari` = VALUES(`diterima_dari`),
            `pic` = VALUES(`pic`), `jumlah` = VALUES(`jumlah`)
        ";
        $stmtIn = $pdo->prepare($sqlIn);
        $submittedPemasukanIds = [];
        foreach ($data['pemasukan'] as $in) {
            if (empty($in['id'])) continue;
            $submittedPemasukanIds[] = $in['id'];
            $stmtIn->execute([
                ':id'            => $in['id'],
                ':bukti'         => $in['bukti'] ?? null,
                ':tanggal'       => $in['tanggal'] ?? date('Y-m-d'),
                ':kategori'      => $in['kategori'] ?? 'Kas Masuk',
                ':keterangan'    => $in['keterangan'] ?? '',
                ':diterima_dari' => $in['diterimaDari'] ?? '',
                ':pic'           => $in['pic'] ?? '',
                ':jumlah'        => (float) ($in['jumlah'] ?? 0)
            ]);
        }
        if (!empty($submittedPemasukanIds)) {
            $inClause = implode(',', array_fill(0, count($submittedPemasukanIds), '?'));
            $tableIn = $isPgsql ? 'tb_pemasukan' : '`tb_pemasukan`';
            $stmtDel = $pdo->prepare("DELETE FROM {$tableIn} WHERE id NOT IN ($inClause)");
            $stmtDel->execute($submittedPemasukanIds);
        }
    }

    // 5. Simpan Data Pengeluaran (4 Pos)
    if (isset($data['pengeluaran']) && is_array($data['pengeluaran'])) {
        $sqlOut = $isPgsql ? "
            INSERT INTO tb_pengeluaran (id, pos, bukti, tanggal, kategori, kegiatan, keterangan, pic, jumlah)
            VALUES (:id, :pos, :bukti, :tanggal, :kategori, :kegiatan, :keterangan, :pic, :jumlah)
            ON CONFLICT (id) DO UPDATE SET 
            pos = EXCLUDED.pos, bukti = EXCLUDED.bukti, tanggal = EXCLUDED.tanggal,
            kategori = EXCLUDED.kategori, kegiatan = EXCLUDED.kegiatan,
            keterangan = EXCLUDED.keterangan, pic = EXCLUDED.pic, jumlah = EXCLUDED.jumlah
        " : "
            INSERT INTO `tb_pengeluaran` (`id`, `pos`, `bukti`, `tanggal`, `kategori`, `kegiatan`, `keterangan`, `pic`, `jumlah`)
            VALUES (:id, :pos, :bukti, :tanggal, :kategori, :kegiatan, :keterangan, :pic, :jumlah)
            ON DUPLICATE KEY UPDATE 
            `pos` = VALUES(`pos`), `bukti` = VALUES(`bukti`), `tanggal` = VALUES(`tanggal`),
            `kategori` = VALUES(`kategori`), `kegiatan` = VALUES(`kegiatan`),
            `keterangan` = VALUES(`keterangan`), `pic` = VALUES(`pic`), `jumlah` = VALUES(`jumlah`)
        ";
        $stmtOut = $pdo->prepare($sqlOut);
        $submittedPengeluaranIds = [];
        foreach ($data['pengeluaran'] as $out) {
            if (empty($out['id'])) continue;
            $submittedPengeluaranIds[] = $out['id'];
            $pos = strtoupper($out['pos'] ?? 'LAIN-LAIN');
            if (!in_array($pos, ['PELANTIKAN', 'PKD', 'MAPABA', 'LAIN-LAIN'])) {
                $pos = 'LAIN-LAIN';
            }
            $stmtOut->execute([
                ':id'         => $out['id'],
                ':pos'        => $pos,
                ':bukti'      => $out['bukti'] ?? null,
                ':tanggal'    => $out['tanggal'] ?? date('Y-m-d'),
                ':kategori'   => $out['kategori'] ?? 'Operasional',
                ':kegiatan'   => $out['kegiatan'] ?? null,
                ':keterangan' => $out['keterangan'] ?? '',
                ':pic'        => $out['pic'] ?? '',
                ':jumlah'     => (float) ($out['jumlah'] ?? 0)
            ]);
        }
        if (!empty($submittedPengeluaranIds)) {
            $inClause = implode(',', array_fill(0, count($submittedPengeluaranIds), '?'));
            $tableOut = $isPgsql ? 'tb_pengeluaran' : '`tb_pengeluaran`';
            $stmtDel = $pdo->prepare("DELETE FROM {$tableOut} WHERE id NOT IN ($inClause)");
            $stmtDel->execute($submittedPengeluaranIds);
        }
    }

    // 6. Simpan Data Anggaran (RAB)
    if (isset($data['anggaran']) && is_array($data['anggaran'])) {
        $sqlAgr = $isPgsql ? "
            INSERT INTO tb_anggaran_rab (id, pos, kegiatan, nama, jumlah, tanggal_target, status, keterangan)
            VALUES (:id, :pos, :kegiatan, :nama, :jumlah, :tanggal_target, :status, :keterangan)
            ON CONFLICT (id) DO UPDATE SET 
            pos = EXCLUDED.pos, kegiatan = EXCLUDED.kegiatan, nama = EXCLUDED.nama,
            jumlah = EXCLUDED.jumlah, tanggal_target = EXCLUDED.tanggal_target,
            status = EXCLUDED.status, keterangan = EXCLUDED.keterangan
        " : "
            INSERT INTO `tb_anggaran_rab` (`id`, `pos`, `kegiatan`, `nama`, `jumlah`, `tanggal_target`, `status`, `keterangan`)
            VALUES (:id, :pos, :kegiatan, :nama, :jumlah, :tanggal_target, :status, :keterangan)
            ON DUPLICATE KEY UPDATE 
            `pos` = VALUES(`pos`), `kegiatan` = VALUES(`kegiatan`), `nama` = VALUES(`nama`),
            `jumlah` = VALUES(`jumlah`), `tanggal_target` = VALUES(`tanggal_target`),
            `status` = VALUES(`status`), `keterangan` = VALUES(`keterangan`)
        ";
        $stmtAgr = $pdo->prepare($sqlAgr);
        $submittedAnggaranIds = [];
        foreach ($data['anggaran'] as $agr) {
            if (empty($agr['id'])) continue;
            $submittedAnggaranIds[] = $agr['id'];
            $posAgr = ucfirst(strtolower($agr['pos'] ?? 'Pelantikan'));
            if ($posAgr === 'Pkd') $posAgr = 'PKD';
            if ($posAgr === 'Mapaba') $posAgr = 'MAPABA';
            if ($posAgr === 'Lain-lain' || $posAgr === 'Lain') $posAgr = 'Lain-lain';

            $stmtAgr->execute([
                ':id'             => $agr['id'],
                ':pos'            => $posAgr,
                ':kegiatan'       => $agr['kegiatan'] ?? '',
                ':nama'           => $agr['nama'] ?? '',
                ':jumlah'         => (float) ($agr['jumlah'] ?? 0),
                ':tanggal_target' => !empty($agr['tanggalTarget']) ? $agr['tanggalTarget'] : null,
                ':status'         => $agr['status'] ?? 'Menunggu Kas',
                ':keterangan'     => $agr['keterangan'] ?? null
            ]);
        }
        if (!empty($submittedAnggaranIds)) {
            $inClause = implode(',', array_fill(0, count($submittedAnggaranIds), '?'));
            $tableAgr = $isPgsql ? 'tb_anggaran_rab' : '`tb_anggaran_rab`';
            $stmtDel = $pdo->prepare("DELETE FROM {$tableAgr} WHERE id NOT IN ($inClause)");
            $stmtDel->execute($submittedAnggaranIds);
        }
    }

    // 7. Simpan Susunan Pengurus & Periode
    if (isset($data['pengurus']) && is_array($data['pengurus'])) {
        $sqlPer = $isPgsql ? "
            INSERT INTO tb_periode_pengurus (periode, tema, is_aktif, sk_pengesahan)
            VALUES (:periode, :tema, :is_aktif, :sk)
            ON CONFLICT (periode) DO UPDATE SET 
            tema = EXCLUDED.tema, is_aktif = EXCLUDED.is_aktif, sk_pengesahan = EXCLUDED.sk_pengesahan
        " : "
            INSERT INTO `tb_periode_pengurus` (`periode`, `tema`, `is_aktif`, `sk_pengesahan`)
            VALUES (:periode, :tema, :is_aktif, :sk)
            ON DUPLICATE KEY UPDATE 
            `tema` = VALUES(`tema`), `is_aktif` = VALUES(`is_aktif`), `sk_pengesahan` = VALUES(`sk_pengesahan`)
        ";
        $stmtPer = $pdo->prepare($sqlPer);

        $sqlStr = $isPgsql ? "
            INSERT INTO tb_struktur_pengurus (id, periode, kategori, jabatan, nama, fakultas, kontak, foto, status, urutan)
            VALUES (:id, :periode, :kategori, :jabatan, :nama, :fakultas, :kontak, :foto, :status, :urutan)
            ON CONFLICT (id) DO UPDATE SET 
            periode = EXCLUDED.periode, kategori = EXCLUDED.kategori, jabatan = EXCLUDED.jabatan, nama = EXCLUDED.nama,
            fakultas = EXCLUDED.fakultas, kontak = EXCLUDED.kontak, foto = EXCLUDED.foto,
            status = EXCLUDED.status, urutan = EXCLUDED.urutan
        " : "
            INSERT INTO `tb_struktur_pengurus` (`id`, `periode`, `kategori`, `jabatan`, `nama`, `fakultas`, `kontak`, `foto`, `status`, `urutan`)
            VALUES (:id, :periode, :kategori, :jabatan, :nama, :fakultas, :kontak, :foto, :status, :urutan)
            ON DUPLICATE KEY UPDATE 
            `kategori` = VALUES(`kategori`), `jabatan` = VALUES(`jabatan`), `nama` = VALUES(`nama`),
            `fakultas` = VALUES(`fakultas`), `kontak` = VALUES(`kontak`), `foto` = VALUES(`foto`),
            `status` = VALUES(`status`), `urutan` = VALUES(`urutan`)
        ";
        $stmtStrIns = $pdo->prepare($sqlStr);

        foreach ($data['pengurus'] as $per) {
            $periode = $per['periode'] ?? date('Y');
            $stmtPer->execute([
                ':periode'  => $periode,
                ':tema'     => $per['tema'] ?? '',
                ':is_aktif' => !empty($per['isAktif']) ? 1 : 0,
                ':sk'       => $per['skPengesahan'] ?? null
            ]);

            if (isset($per['struktur']) && is_array($per['struktur'])) {
                $submittedStrukturIds = [];
                $urutan = 1;
                foreach ($per['struktur'] as $str) {
                    if (empty($str['id'])) continue;
                    $submittedStrukturIds[] = $str['id'];
                    $stmtStrIns->execute([
                        ':id'       => $str['id'],
                        ':periode'  => $periode,
                        ':kategori' => $str['kategori'] ?? 'Badan Pengurus Harian (BPH)',
                        ':jabatan'  => $str['jabatan'] ?? 'Pengurus',
                        ':nama'     => $str['nama'] ?? 'Sahabat PMII',
                        ':fakultas' => $str['fakultas'] ?? null,
                        ':kontak'   => $str['kontak'] ?? null,
                        ':foto'     => $str['foto'] ?? null,
                        ':status'   => $str['status'] ?? 'Aktif',
                        ':urutan'   => $urutan++
                    ]);
                }
                if (!empty($submittedStrukturIds)) {
                    $inClause = implode(',', array_fill(0, count($submittedStrukturIds), '?'));
                    $tableStr = $isPgsql ? 'tb_struktur_pengurus' : '`tb_struktur_pengurus`';
                    $stmtDelStr = $pdo->prepare("DELETE FROM {$tableStr} WHERE periode = ? AND id NOT IN ($inClause)");
                    $stmtDelStr->execute(array_merge([$periode], $submittedStrukturIds));
                }
            }
        }
    }

    // 8. Simpan Ketum dari Masa ke Masa
    if (isset($data['ketumKom']) && is_array($data['ketumKom'])) {
        $sqlKtm = $isPgsql ? "
            INSERT INTO tb_ketum_kom (id, nama, periode, tahun_mulai, tahun_selesai, foto, profesi_sekarang, kontak, fakultas, status, visi, prestasi)
            VALUES (:id, :nama, :periode, :tahun_mulai, :tahun_selesai, :foto, :profesi_sekarang, :kontak, :fakultas, :status, :visi, :prestasi)
            ON CONFLICT (id) DO UPDATE SET 
            nama = EXCLUDED.nama, periode = EXCLUDED.periode, tahun_mulai = EXCLUDED.tahun_mulai,
            tahun_selesai = EXCLUDED.tahun_selesai, foto = EXCLUDED.foto, profesi_sekarang = EXCLUDED.profesi_sekarang,
            kontak = EXCLUDED.kontak, fakultas = EXCLUDED.fakultas, status = EXCLUDED.status,
            visi = EXCLUDED.visi, prestasi = EXCLUDED.prestasi
        " : "
            INSERT INTO `tb_ketum_kom` (`id`, `nama`, `periode`, `tahun_mulai`, `tahun_selesai`, `foto`, `profesi_sekarang`, `kontak`, `fakultas`, `status`, `visi`, `prestasi`)
            VALUES (:id, :nama, :periode, :tahun_mulai, :tahun_selesai, :foto, :profesi_sekarang, :kontak, :fakultas, :status, :visi, :prestasi)
            ON DUPLICATE KEY UPDATE 
            `nama` = VALUES(`nama`), `periode` = VALUES(`periode`), `tahun_mulai` = VALUES(`tahun_mulai`),
            `tahun_selesai` = VALUES(`tahun_selesai`), `foto` = VALUES(`foto`), `profesi_sekarang` = VALUES(`profesi_sekarang`),
            `kontak` = VALUES(`kontak`), `fakultas` = VALUES(`fakultas`), `status` = VALUES(`status`),
            `visi` = VALUES(`visi`), `prestasi` = VALUES(`prestasi`)
        ";
        $stmtKtm = $pdo->prepare($sqlKtm);
        $submittedKetumIds = [];
        foreach ($data['ketumKom'] as $ktm) {
            if (empty($ktm['id'])) continue;
            $submittedKetumIds[] = $ktm['id'];
            $stmtKtm->execute([
                ':id'               => $ktm['id'],
                ':nama'             => $ktm['nama'],
                ':periode'          => $ktm['periode'] ?? '',
                ':tahun_mulai'      => $ktm['tahunMulai'] ?? date('Y'),
                ':tahun_selesai'    => $ktm['tahunSelesai'] ?? (date('Y') + 1),
                ':foto'             => $ktm['foto'] ?? null,
                ':profesi_sekarang' => $ktm['profesiSekarang'] ?? null,
                ':kontak'           => $ktm['kontak'] ?? null,
                ':fakultas'         => $ktm['fakultas'] ?? null,
                ':status'           => $ktm['status'] ?? 'Demisioner',
                ':visi'             => $ktm['visi'] ?? null,
                ':prestasi'         => $ktm['prestasi'] ?? null
            ]);
        }
        if (!empty($submittedKetumIds)) {
            $inClause = implode(',', array_fill(0, count($submittedKetumIds), '?'));
            $tableKtm = $isPgsql ? 'tb_ketum_kom' : '`tb_ketum_kom`';
            $stmtDel = $pdo->prepare("DELETE FROM {$tableKtm} WHERE id NOT IN ($inClause)");
            $stmtDel->execute($submittedKetumIds);
        }
    }

    // 9. Simpan Agenda & Presensi Rapat
    if (isset($data['rapat']) && is_array($data['rapat'])) {
        $sqlRpt = $isPgsql ? "
            INSERT INTO tb_rapat (id, agenda, tanggal, waktu, tempat, pimpinan, notulis, notulensi)
            VALUES (:id, :agenda, :tanggal, :waktu, :tempat, :pimpinan, :notulis, :notulensi)
            ON CONFLICT (id) DO UPDATE SET 
            agenda = EXCLUDED.agenda, tanggal = EXCLUDED.tanggal, waktu = EXCLUDED.waktu,
            tempat = EXCLUDED.tempat, pimpinan = EXCLUDED.pimpinan,
            notulis = EXCLUDED.notulis, notulensi = EXCLUDED.notulensi
        " : "
            INSERT INTO `tb_rapat` (`id`, `agenda`, `tanggal`, `waktu`, `tempat`, `pimpinan`, `notulis`, `notulensi`)
            VALUES (:id, :agenda, :tanggal, :waktu, :tempat, :pimpinan, :notulis, :notulensi)
            ON DUPLICATE KEY UPDATE 
            `agenda` = VALUES(`agenda`), `tanggal` = VALUES(`tanggal`), `waktu` = VALUES(`waktu`),
            `tempat` = VALUES(`tempat`), `pimpinan` = VALUES(`pimpinan`),
            `notulis` = VALUES(`notulis`), `notulensi` = VALUES(`notulensi`)
        ";
        $stmtRpt = $pdo->prepare($sqlRpt);

        $tablePres = $isPgsql ? 'tb_presensi_rapat' : '`tb_presensi_rapat`';
        $stmtDelPres = $pdo->prepare("DELETE FROM {$tablePres} WHERE rapat_id = ?");
        $stmtInsPres = $pdo->prepare("
            INSERT INTO {$tablePres} (rapat_id, pengurus_id, nama, jabatan, status, keterangan)
            VALUES (?, ?, ?, ?, ?, ?)
        ");

        $submittedRapatIds = [];
        foreach ($data['rapat'] as $rpt) {
            if (empty($rpt['id'])) continue;
            $submittedRapatIds[] = $rpt['id'];
            $stmtRpt->execute([
                ':id'        => $rpt['id'],
                ':agenda'    => $rpt['agenda'] ?? 'Rapat Pengurus',
                ':tanggal'   => $rpt['tanggal'] ?? date('Y-m-d'),
                ':waktu'     => $rpt['waktu'] ?? '',
                ':tempat'    => $rpt['tempat'] ?? '',
                ':pimpinan'  => $rpt['pimpinan'] ?? '',
                ':notulis'   => $rpt['notulis'] ?? '',
                ':notulensi' => $rpt['notulensi'] ?? ''
            ]);

            // Sync daftar presensi kehadiran rapat
            if (isset($rpt['presensi']) && is_array($rpt['presensi'])) {
                $stmtDelPres->execute([$rpt['id']]);
                foreach ($rpt['presensi'] as $pres) {
                    $stmtInsPres->execute([
                        $rpt['id'],
                        $pres['id'] ?? null,
                        $pres['nama'] ?? 'Pengurus',
                        $pres['jabatan'] ?? '',
                        $pres['status'] ?? 'Hadir',
                        $pres['keterangan'] ?? ''
                    ]);
                }
            }
        }
        if (!empty($submittedRapatIds)) {
            $inClause = implode(',', array_fill(0, count($submittedRapatIds), '?'));
            $tableRpt = $isPgsql ? 'tb_rapat' : '`tb_rapat`';
            $stmtDel = $pdo->prepare("DELETE FROM {$tableRpt} WHERE id NOT IN ($inClause)");
            $stmtDel->execute($submittedRapatIds);
        }
    }

    $pdo->commit();
    jsonResponse('success', 'Seluruh data berhasil disinkronkan ke database MySQL.');

} catch (Exception $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    jsonResponse('error', 'Gagal menyimpan data ke database: ' . $e->getMessage(), null, 500);
}
