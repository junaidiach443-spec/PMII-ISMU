<?php
/**
 * API: Uji Koneksi & Status Database (MySQL & PostgreSQL)
 * Menampilkan status server database, jumlah tabel, dan ringkasan data
 */

require_once __DIR__ . '/koneksi.php';

try {
    // 1. Cek tabel yang ada di database sesuai driver
    if (DB_DRIVER === 'pgsql') {
        $stmtTables = $pdo->query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name ASC");
    } else {
        $stmtTables = $pdo->query("SHOW TABLES");
    }
    $tables = $stmtTables->fetchAll(PDO::FETCH_COLUMN);

    // 2. Hitung jumlah data dari masing-masing tabel utama
    $countKader       = (int) ($pdo->query("SELECT COUNT(*) FROM tb_kader")->fetchColumn() ?: 0);
    $countMabinkom    = (int) ($pdo->query("SELECT COUNT(*) FROM tb_mabinkom")->fetchColumn() ?: 0);
    $countPemasukan   = (int) ($pdo->query("SELECT COUNT(*) FROM tb_pemasukan")->fetchColumn() ?: 0);
    $countPengeluaran = (int) ($pdo->query("SELECT COUNT(*) FROM tb_pengeluaran")->fetchColumn() ?: 0);
    $countAnggaran    = (int) ($pdo->query("SELECT COUNT(*) FROM tb_anggaran_rab")->fetchColumn() ?: 0);
    $countRapat       = (int) ($pdo->query("SELECT COUNT(*) FROM tb_rapat")->fetchColumn() ?: 0);

    jsonResponse('success', 'Koneksi ke database (' . strtoupper(DB_DRIVER) . ') berhasil dan aktif!', [
        'driver'         => DB_DRIVER,
        'database'       => DB_NAME,
        'host'           => DB_HOST,
        'tables_count'   => count($tables),
        'tables_list'    => $tables,
        'stats' => [
            'total_kader'       => $countKader,
            'total_mabinkom'    => $countMabinkom,
            'total_pemasukan'   => $countPemasukan,
            'total_pengeluaran' => $countPengeluaran,
            'total_anggaran'    => $countAnggaran,
            'total_rapat'       => $countRapat
        ]
    ]);

} catch (Exception $e) {
    jsonResponse('error', 'Gagal memeriksa database: ' . $e->getMessage(), null, 500);
}
