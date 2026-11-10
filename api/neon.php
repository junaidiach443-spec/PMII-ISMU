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

$connStr = '';
if (!empty($_SERVER['HTTP_NEON_CONNECTION_STRING'])) {
    $connStr = trim($_SERVER['HTTP_NEON_CONNECTION_STRING']);
} elseif (!empty($_SERVER['Neon-Connection-String'])) {
    $connStr = trim($_SERVER['Neon-Connection-String']);
} else {
    $connStr = getenv('DATABASE_URL') ?: getenv('NEON_DATABASE_URL') ?: 'postgresql://neondb_owner:npg_OzRkS4cao0gV@ep-gentle-truth-bdh8gtax-pooler.c-8.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require';
}

$host = 'ep-gentle-truth-bdh8gtax-pooler.c-8.us-east-2.aws.neon.tech';
if (preg_match('/@([^:\/?]+)/', $connStr, $m)) {
    $host = $m[1];
}

$cleanHost = str_replace('-pooler', '', $host);
$neonEndpoint = "https://" . $cleanHost . "/sql";

// 1. Eksekusi Batch Queries secara Paralel (curl_multi) agar super cepat (<2 detik)
if (isset($payload['queries']) && is_array($payload['queries'])) {
    $validQueries = [];
    foreach ($payload['queries'] as $q) {
        if (is_string($q) && trim($q) !== '') {
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
