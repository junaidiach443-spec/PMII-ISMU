<?php
/**
 * Konfigurasi Koneksi Database MySQL / MariaDB & PostgreSQL
 * Sistem Informasi & Pendataan Kader PK PMII ISMU
 */

// Hindari warning jika dijalankan melalui CLI
$isCli = (php_sapi_name() === 'cli' || !isset($_SERVER['REQUEST_METHOD']));

if (!$isCli) {
    header('Content-Type: application/json; charset=UTF-8');
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

    // Tangani preflight request OPTIONS
    if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
        http_response_code(200);
        exit;
    }
}

// 1. Muat konfigurasi lokal pengurus jika ada (tidak di-commit ke Git)
if (file_exists(__DIR__ . '/config.local.php')) {
    require_once __DIR__ . '/config.local.php';
}

// 2. Muat file .env jika ada
if (file_exists(__DIR__ . '/../.env')) {
    $envLines = @file(__DIR__ . '/../.env', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    if (is_array($envLines)) {
        foreach ($envLines as $line) {
            $line = trim($line);
            if ($line === '' || str_starts_with($line, '#')) continue;
            if (strpos($line, '=') !== false) {
                [$k, $v] = explode('=', $line, 2);
                $k = trim($k);
                $v = trim($v, " \t\n\r\0\x0B\"'");
                if (!isset($_ENV[$k])) {
                    $_ENV[$k] = $v;
                    putenv("$k=$v");
                }
            }
        }
    }
}

// 3. Tentukan Database URL / Parameter
$databaseUrl = defined('DATABASE_URL') ? constant('DATABASE_URL') : (getenv('DATABASE_URL') ?: (getenv('NEON_DATABASE_URL') ?: ''));

if (!empty($databaseUrl)) {
    // Mode PostgreSQL Cloud (Neon.tech / Supabase)
    $dbparts  = parse_url($databaseUrl);
    $dbDriver = 'pgsql';
    $dbHost   = $dbparts['host'] ?? 'localhost';
    $dbPort   = $dbparts['port'] ?? '5432';
    $dbUser   = isset($dbparts['user']) ? urldecode($dbparts['user']) : 'postgres';
    $dbPass   = isset($dbparts['pass']) ? urldecode($dbparts['pass']) : '';
    $dbName   = isset($dbparts['path']) ? ltrim($dbparts['path'], '/') : 'neondb';
    $dsn      = "pgsql:host={$dbHost};port={$dbPort};dbname={$dbName};sslmode=require";
} else {
    // Mode Default: MySQL Local (XAMPP / cPanel)
    $dbDriver = defined('DB_DRIVER') ? constant('DB_DRIVER') : (getenv('DB_DRIVER') ?: 'mysql');
    $dbHost   = defined('DB_HOST') ? constant('DB_HOST') : (getenv('DB_HOST') ?: 'localhost');
    $dbPort   = defined('DB_PORT') ? constant('DB_PORT') : (getenv('DB_PORT') ?: '3306');
    $dbName   = defined('DB_NAME') ? constant('DB_NAME') : (getenv('DB_NAME') ?: 'db_pmii_ismu');
    $dbUser   = defined('DB_USER') ? constant('DB_USER') : (getenv('DB_USER') ?: 'root');
    $dbPass   = defined('DB_PASS') ? constant('DB_PASS') : (getenv('DB_PASS') ?: '');
    $dsn      = "mysql:host={$dbHost};port={$dbPort};dbname={$dbName};charset=utf8mb4";
}

if (!defined('DB_DRIVER')) define('DB_DRIVER', $dbDriver);
if (!defined('DB_HOST')) define('DB_HOST', $dbHost);
if (!defined('DB_NAME')) define('DB_NAME', $dbName);
if (!defined('DB_USER')) define('DB_USER', $dbUser);

try {
    $pdo = new PDO(
        $dsn,
        $dbUser,
        $dbPass,
        [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ]
    );
} catch (PDOException $e) {
    if (!$isCli) http_response_code(500);
    echo json_encode([
        'status'  => 'error',
        'message' => 'Gagal terhubung ke database (' . $dbDriver . '): ' . $e->getMessage(),
        'tip'     => ($dbDriver === 'pgsql') 
            ? 'Pastikan koneksi internet aktif dan kredensial PostgreSQL/Neon valid di api/config.local.php.'
            : 'Pastikan modul MySQL di XAMPP sudah dijalankan dan database `db_pmii_ismu` sudah diimpor.'
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

/**
 * Helper JSON Response
 */
function jsonResponse($status, $message, $data = null, $code = 200) {
    if (php_sapi_name() !== 'cli' && !headers_sent()) {
        http_response_code($code);
    }
    echo json_encode([
        'status'  => $status,
        'message' => $message,
        'data'    => $data,
        'time'    => date('Y-m-d H:i:s')
    ], JSON_UNESCAPED_UNICODE);
    exit;
}
