<?php
/**
 * API Proxy: Kirim Pesan WhatsApp Otomatis via Fonnte Gateway (Opsional)
 * Mendukung Environment Variable server (FONNTE_TOKEN) atau token dari UI Admin.
 */
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if (file_exists(__DIR__ . '/config.local.php')) {
    @include_once __DIR__ . '/config.local.php';
}

$serverToken = getenv('FONNTE_TOKEN')
    ?: ($_ENV['FONNTE_TOKEN'] ?? ($_SERVER['FONNTE_TOKEN'] ?? ''));
if (empty($serverToken) && defined('FONNTE_TOKEN')) {
    $serverToken = constant('FONNTE_TOKEN');
}
$serverToken = trim((string) $serverToken);

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    echo json_encode([
        'ok' => true,
        'serverTokenConfigured' => ($serverToken !== '')
    ]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['status' => false, 'reason' => 'Metode tidak diizinkan. Gunakan POST.']);
    exit;
}

$raw = file_get_contents('php://input');
$data = json_decode($raw, true);
if (!is_array($data)) {
    http_response_code(400);
    echo json_encode(['status' => false, 'reason' => 'Payload JSON tidak valid.']);
    exit;
}

$target = preg_replace('/[^0-9]/', '', (string) ($data['target'] ?? ''));
$message = trim((string) ($data['message'] ?? ''));
$clientToken = trim((string) ($data['token'] ?? ''));
$token = $serverToken !== '' ? $serverToken : $clientToken;

if ($token === '') {
    http_response_code(400);
    echo json_encode([
        'status' => false,
        'code' => 'NO_TOKEN',
        'reason' => 'Token Fonnte belum diatur. Gunakan Mode Gratis WhatsApp Link atau isi Token Fonnte.'
    ]);
    exit;
}

if (strlen($target) < 10 || $message === '') {
    http_response_code(400);
    echo json_encode([
        'status' => false,
        'reason' => 'Nomor WhatsApp tujuan atau isi pesan tidak valid.'
    ]);
    exit;
}

$ch = curl_init('https://api.fonnte.com/send');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, [
    'target' => $target,
    'message' => $message,
    'countryCode' => '62'
]);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: ' . $token
]);
curl_setopt($ch, CURLOPT_TIMEOUT, 20);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlErr = curl_error($ch);
curl_close($ch);

if ($response === false) {
    http_response_code(502);
    echo json_encode([
        'status' => false,
        'reason' => 'Gagal menghubungi server Fonnte: ' . $curlErr
    ]);
    exit;
}

http_response_code($httpCode ?: 200);
echo $response;

