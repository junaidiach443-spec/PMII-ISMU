<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Neon-Connection-String, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$rawInput = file_get_contents('php://input');
$payload = json_decode($rawInput, true);

// Muat config lokal pengurus (gitignored) bila tersedia untuk server lokal
if (file_exists(__DIR__ . '/config.local.php')) {
    @include_once __DIR__ . '/config.local.php';
}

$serverEnvUrl = getenv('DATABASE_URL')
    ?: ($_ENV['DATABASE_URL'] ?? ($_SERVER['DATABASE_URL'] ?? ''));
if (empty($serverEnvUrl)) {
    $serverEnvUrl = getenv('NEON_DATABASE_URL')
        ?: ($_ENV['NEON_DATABASE_URL'] ?? ($_SERVER['NEON_DATABASE_URL'] ?? ''));
}
if (empty($serverEnvUrl) && defined('DATABASE_URL')) {
    $serverEnvUrl = constant('DATABASE_URL');
}

// Prioritaskan konfigurasi aman di server (Vercel Env Var / config.local.php)
// agar cache browser lama tidak pernah menimpa password baru hasil rotasi.
$connStr = trim((string) $serverEnvUrl);
if (empty($connStr)) {
    if (!empty($_SERVER['HTTP_NEON_CONNECTION_STRING'])) {
        $connStr = trim($_SERVER['HTTP_NEON_CONNECTION_STRING']);
    } elseif (!empty($_SERVER['Neon-Connection-String'])) {
        $connStr = trim($_SERVER['Neon-Connection-String']);
    }
}

if (empty($connStr)) {
    header("Content-Type: application/json");
    http_response_code(500);
    echo json_encode(['error' => 'DATABASE_URL belum diatur di Environment Variables server (Vercel) atau api/config.local.php.']);
    exit;
}

if (!function_exists('isBlockedNeonSql')) {
    function isBlockedNeonSql($sql) {
        if (!is_string($sql)) return true;
        $clean = preg_replace('/\/\*[\s\S]*?\*\//', ' ', $sql);
        $clean = preg_replace('/--[^\r\n]*/', ' ', $clean);
        return (bool) preg_match('/\b(DROP\s+(TABLE|DATABASE|SCHEMA|INDEX)|TRUNCATE\s+TABLE|ALTER\s+(TABLE|SYSTEM|ROLE|USER)|CREATE\s+(ROLE|USER)|GRANT\s+|REVOKE\s+|COPY\s+.*\s+PROGRAM)\b/i', $clean);
    }
}

$host = '';
if (preg_match('/@([^:\/?]+)/', $connStr, $m)) {
    $host = $m[1];
}
if (empty($host)) {
    header("Content-Type: application/json");
    http_response_code(500);
    echo json_encode(['error' => 'Format DATABASE_URL tidak valid.']);
    exit;
}

$cleanHost = str_replace('-pooler', '', $host);
$neonEndpoint = "https://" . $cleanHost . "/sql";

// 1. Eksekusi Batch Queries secara Paralel (curl_multi) agar super cepat (<2 detik)
if (isset($payload['queries']) && is_array($payload['queries'])) {
    $validQueries = [];
    foreach ($payload['queries'] as $q) {
        if (is_string($q) && trim($q) !== '') {
            if (isBlockedNeonSql($q)) {
                header("Content-Type: application/json");
                http_response_code(403);
                echo json_encode(['error' => 'Perintah SQL destruktif tidak diizinkan melalui proxy publik.']);
                exit;
            }
            $validQueries[] = trim($q);
        }
    }

    if (empty($validQueries)) {
        header("Content-Type: application/json");
        echo json_encode(['success' => true, 'results' => [], 'rowCount' => 0]);
        exit;
    }

    $mh = curl_multi_init();
    $handles = [];

    foreach ($validQueries as $i => $q) {
        $ch = curl_init($neonEndpoint);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(['query' => $q]));
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Content-Type: application/json',
            'Neon-Connection-String: ' . $connStr
        ]);
        curl_setopt($ch, CURLOPT_TIMEOUT, 15);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_multi_add_handle($mh, $ch);
        $handles[$i] = $ch;
    }

    $running = null;
    do {
        curl_multi_exec($mh, $running);
        curl_multi_select($mh);
    } while ($running > 0);

    $results = [];
    foreach ($handles as $i => $ch) {
        $content = curl_multi_getcontent($ch);
        $results[$i] = json_decode($content, true) ?: $content;
        curl_multi_remove_handle($mh, $ch);
        curl_close($ch);
    }
    curl_multi_close($mh);

    header("Content-Type: application/json");
    echo json_encode(['success' => true, 'results' => $results, 'rowCount' => count($results)]);
    exit;
}

// 2. Single query
if (empty($rawInput)) {
    header("Content-Type: application/json");
    http_response_code(400);
    echo json_encode(['error' => 'Permintaan kosong. Silakan sertakan query SQL.']);
    exit;
}

$singleQuerySql = is_array($payload) && isset($payload['query']) ? $payload['query'] : '';
if (isBlockedNeonSql($singleQuerySql)) {
    header("Content-Type: application/json");
    http_response_code(403);
    echo json_encode(['error' => 'Perintah SQL destruktif tidak diizinkan melalui proxy publik.']);
    exit;
}

$ch = curl_init($neonEndpoint);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $rawInput);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Neon-Connection-String: ' . $connStr
]);
curl_setopt($ch, CURLOPT_TIMEOUT, 20);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlErr = curl_error($ch);
curl_close($ch);

header("Content-Type: application/json");
if ($response === false) {
    http_response_code(502);
    echo json_encode(['error' => 'Gagal menghubungi Neon: ' . $curlErr]);
    exit;
}

http_response_code($httpCode ?: 200);
echo $response;
