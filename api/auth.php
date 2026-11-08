<?php
/**
 * API: Autentikasi Login Pengurus / Admin
 */

require_once __DIR__ . '/koneksi.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse('error', 'Metode request tidak diizinkan.', null, 405);
}

$inputRaw = file_get_contents('php://input');
$data = json_decode($inputRaw, true);

$username = trim($data['username'] ?? '');
$password = trim($data['password'] ?? '');

if (empty($username) || empty($password)) {
    jsonResponse('error', 'Username dan password wajib diisi.', null, 400);
}

try {
    $stmt = $pdo->prepare("SELECT `id`, `username`, `password_hash`, `nama_lengkap`, `role`, `status` FROM `tb_users` WHERE `username` = ? AND `status` = 'aktif' LIMIT 1");
    $stmt->execute([$username]);
    $user = $stmt->fetch();

    $isValidPassword = false;
    if ($user) {
        $storedHash = $user['password_hash'] ?? '';
        if ($storedHash === $password || $storedHash === md5($password) || password_verify($password, $storedHash)) {
            $isValidPassword = true;
        }
    }

    if ($user && $isValidPassword) {
        jsonResponse('success', 'Login berhasil!', [
            'id'           => $user['id'],
            'username'     => $user['username'],
            'nama_lengkap' => $user['nama_lengkap'],
            'role'         => $user['role']
        ]);
    } else {
        jsonResponse('error', 'Username atau password salah.', null, 401);
    }
} catch (Exception $e) {
    jsonResponse('error', 'Terjadi kesalahan sistem: ' . $e->getMessage(), null, 500);
}

