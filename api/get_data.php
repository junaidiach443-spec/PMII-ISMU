<?php
/**
 * API: Ambil Seluruh Data Sistem (Full Sync)
 * Mengambil data dari MySQL dan mengembalikannya dalam format JSON yang siap dipakai frontend
 */

require_once __DIR__ . '/koneksi.php';

try {
    // 1. Profil Komisariat
    $stmtKom = $pdo->query("SELECT * FROM tb_komisariat LIMIT 1");
    $komRow = $stmtKom->fetch();
    $komisariat = [
        'nama'                 => $komRow['nama'] ?? 'PK PMII ISMU',
        'namaLengkap'          => $komRow['nama_lengkap'] ?? 'Pengurus Komisariat PMII ISMU',
        'kampus'               => $komRow['kampus'] ?? 'INSTITUT MIFTAHUL ULUM TARATE',
        'cabang'               => $komRow['cabang'] ?? 'PC PMII Kab. Sumenep',
        'pkc'                  => $komRow['pkc'] ?? 'PKC PMII Jawa Timur',
        'masaKhidmat'          => $komRow['masa_khidmat'] ?? '2026-2027',
        'ketuaKomisariat'      => $komRow['ketua_komisariat'] ?? 'Ahmad Zainuri',
        'sekretarisKomisariat' => $komRow['sekretaris_komisariat'] ?? 'M. Fathur Rozak',
        'bendaharaKomisariat'  => $komRow['bendahara_komisariat'] ?? 'Nurul Aini',
        'nomorSK'              => $komRow['nomor_sk'] ?? '',
        'alamat'               => $komRow['alamat'] ?? '',
        'email'                => $komRow['email'] ?? '',
        'telepon'              => $komRow['telepon'] ?? ''
    ];

    // 2. Data Kader
    $stmtKdr = $pdo->query("SELECT * FROM tb_kader ORDER BY angkatan DESC, nama ASC");
    $kaders = [];
    while ($row = $stmtKdr->fetch()) {
        $kaders[] = [
            'id'            => $row['id'],
            'noKta'         => $row['no_kta'],
            'nik'           => $row['nik'],
            'nim'           => $row['nim'],
            'nama'          => $row['nama'],
            'namaPanggilan' => $row['nama_panggilan'] ?? '',
            'gender'        => $row['gender'],
            'tempatLahir'   => $row['tempat_lahir'] ?? '',
            'tanggalLahir'  => $row['tanggal_lahir'] ?? '',
            'fakultas'      => $row['fakultas'],
            'jurusan'       => $row['jurusan'],
            'angkatan'      => $row['angkatan'],
            'statusKuliah'  => $row['status_kuliah'] ?? 'Aktif',
            'alamat'        => $row['alamat'] ?? '',
            'whatsapp'      => $row['whatsapp'] ?? '',
            'email'         => $row['email'] ?? '',
            'foto'          => $row['foto'] ?? '',
            'statusKader'   => $row['status_kader'] ?? 'Aktif',
            'kaderisasi'    => [
                'formal'              => $row['formal'] ?? 'MAPABA',
                'tahunMapaba'         => $row['tahun_mapaba'] ?? null,
                'penyelenggaraMapaba' => $row['penyelenggara_mapaba'] ?? 'PK PMII ISMU',
                'tahunPkd'            => $row['tahun_pkd'] ?? null,
                'penyelenggaraPkd'    => $row['penyelenggara_pkd'] ?? null,
                'tahunPkl'            => $row['tahun_pkl'] ?? null,
                'kopri'               => $row['kopri'] ?? '-',
                'tahunSig'            => $row['tahun_sig'] ?? null,
                'tahunSkk'            => $row['tahun_skk'] ?? null
            ]
        ];
    }

    // 3. Data Mabinkom
    $stmtMbn = $pdo->query("SELECT * FROM tb_mabinkom ORDER BY id ASC");
    $mabinkom = [];
    while ($row = $stmtMbn->fetch()) {
        $mabinkom[] = [
            'id'      => $row['id'],
            'nama'    => $row['nama'],
            'gelar'   => $row['gelar'] ?? '',
            'jabatan' => $row['jabatan'],
            'periode' => $row['periode'] ?? '',
            'kiprah'  => $row['kiprah'] ?? '',
            'profesi' => $row['profesi'] ?? '',
            'kontak'  => $row['kontak'] ?? '',
            'foto'    => $row['foto'] ?? '',
            'status'  => $row['status'] ?? 'Aktif'
        ];
    }

    // 4. Data Pemasukan Kas
    $stmtIn = $pdo->query("SELECT * FROM tb_pemasukan ORDER BY tanggal DESC, id DESC");
    $pemasukan = [];
    while ($row = $stmtIn->fetch()) {
        $pemasukan[] = [
            'id'           => $row['id'],
            'bukti'        => $row['bukti'] ?? '',
            'tanggal'      => $row['tanggal'],
            'kategori'     => $row['kategori'],
            'keterangan'   => $row['keterangan'],
            'diterimaDari' => $row['diterima_dari'],
            'pic'          => $row['pic'],
            'jumlah'       => (float) $row['jumlah']
        ];
    }

    // 5. Data Pengeluaran Kas (4 Pos)
    $stmtOut = $pdo->query("SELECT * FROM tb_pengeluaran ORDER BY tanggal DESC, id DESC");
    $pengeluaran = [];
    while ($row = $stmtOut->fetch()) {
        $pengeluaran[] = [
            'id'         => $row['id'],
            'pos'        => $row['pos'],
            'bukti'      => $row['bukti'] ?? '',
            'tanggal'    => $row['tanggal'],
            'kategori'   => $row['kategori'],
            'kegiatan'   => $row['kegiatan'] ?? '',
            'keterangan' => $row['keterangan'],
            'pic'        => $row['pic'],
            'jumlah'     => (float) $row['jumlah']
        ];
    }

    // 6. Data Anggaran (RAB)
    $stmtAgr = $pdo->query("SELECT * FROM tb_anggaran_rab ORDER BY pos ASC, id ASC");
    $anggaran = [];
    while ($row = $stmtAgr->fetch()) {
        $anggaran[] = [
            'id'            => $row['id'],
            'pos'           => $row['pos'],
            'kegiatan'      => $row['kegiatan'],
            'nama'          => $row['nama'],
            'jumlah'        => (float) $row['jumlah'],
            'tanggalTarget' => $row['tanggal_target'] ?? '',
            'status'        => $row['status'] ?? 'Menunggu Kas',
            'keterangan'    => $row['keterangan'] ?? ''
        ];
    }

    // 7. Data Susunan Pengurus per Periode
    $stmtPer = $pdo->query("SELECT * FROM tb_periode_pengurus ORDER BY periode DESC");
    $pengurus = [];
    while ($pRow = $stmtPer->fetch()) {
        $periode = $pRow['periode'];
        $stmtStr = $pdo->prepare("SELECT * FROM tb_struktur_pengurus WHERE periode = ? ORDER BY urutan ASC, id ASC");
        $stmtStr->execute([$periode]);
        $struktur = [];
        while ($sRow = $stmtStr->fetch()) {
            $struktur[] = [
                'id'       => $sRow['id'],
                'kategori' => $sRow['kategori'],
                'jabatan'  => $sRow['jabatan'],
                'nama'     => $sRow['nama'],
                'fakultas' => $sRow['fakultas'] ?? '',
                'kontak'   => $sRow['kontak'] ?? '',
                'foto'     => $sRow['foto'] ?? '',
                'status'   => $sRow['status'] ?? 'Aktif'
            ];
        }

        $pengurus[] = [
            'periode'      => $periode,
            'tema'         => $pRow['tema'] ?? '',
            'isAktif'      => (bool) $pRow['is_aktif'],
            'skPengesahan' => $pRow['sk_pengesahan'] ?? '',
            'struktur'     => $struktur
        ];
    }

    // 8. Data Ketua Umum dari Masa ke Masa
    $stmtKtm = $pdo->query("SELECT * FROM tb_ketum_kom ORDER BY tahun_mulai DESC");
    $ketumKom = [];
    while ($row = $stmtKtm->fetch()) {
        $ketumKom[] = [
            'id'              => $row['id'],
            'nama'            => $row['nama'],
            'periode'         => $row['periode'],
            'tahunMulai'      => $row['tahun_mulai'],
            'tahunSelesai'    => $row['tahun_selesai'],
            'foto'            => $row['foto'] ?? '',
            'profesiSekarang' => $row['profesi_sekarang'] ?? '',
            'kontak'          => $row['kontak'] ?? '',
            'fakultas'        => $row['fakultas'] ?? '',
            'status'          => $row['status'] ?? 'Demisioner',
            'visi'            => $row['visi'] ?? '',
            'prestasi'        => $row['prestasi'] ?? ''
        ];
    }

    // 9. Data Agenda & Presensi Rapat
    $stmtRpt = $pdo->query("SELECT * FROM tb_rapat ORDER BY tanggal DESC, id DESC");
    $rapat = [];
    while ($rRow = $stmtRpt->fetch()) {
        $rapatId = $rRow['id'];
        $stmtPres = $pdo->prepare("SELECT * FROM tb_presensi_rapat WHERE rapat_id = ? ORDER BY id ASC");
        $stmtPres->execute([$rapatId]);
        $presensi = [];
        while ($presRow = $stmtPres->fetch()) {
            $presensi[] = [
                'id'         => $presRow['pengurus_id'] ?? ('PGR-' . $presRow['id']),
                'nama'       => $presRow['nama'],
                'jabatan'    => $presRow['jabatan'],
                'status'     => $presRow['status'],
                'keterangan' => $presRow['keterangan'] ?? ''
            ];
        }

        $rapat[] = [
            'id'        => $rRow['id'],
            'agenda'    => $rRow['agenda'],
            'tanggal'   => $rRow['tanggal'],
            'waktu'     => $rRow['waktu'] ?? '',
            'tempat'    => $rRow['tempat'] ?? '',
            'pimpinan'  => $rRow['pimpinan'] ?? '',
            'notulis'   => $rRow['notulis'] ?? '',
            'notulensi' => $rRow['notulensi'] ?? '',
            'presensi'  => $presensi
        ];
    }

    jsonResponse('success', 'Data database MySQL berhasil dimuat', [
        'komisariat'  => $komisariat,
        'kaders'      => $kaders,
        'mabinkom'    => $mabinkom,
        'pemasukan'   => $pemasukan,
        'pengeluaran' => $pengeluaran,
        'anggaran'    => $anggaran,
        'pengurus'    => $pengurus,
        'ketumKom'    => $ketumKom,
        'rapat'       => $rapat
    ]);

} catch (Exception $e) {
    jsonResponse('error', 'Gagal memuat data dari database: ' . $e->getMessage(), null, 500);
}

