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
    $connStr = getenv('DATABASE_URL') ?: getenv('NEON_DATABASE_URL') ?: 'postgresql://neondb_owner:npg_nTzvpcJeB07A@ep-nameless-salad-betekr6e-pooler.c-9.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require';
}

$host = 'ep-nameless-salad-betekr6e-pooler.c-9.us-east-2.aws.neon.tech';
if (preg_match('/@([^:\/?]+)/', $connStr, $m)) {
    $host = $m[1];
}

$neonEndpoint = "https://" . $host . "/sql";

// Cek apakah batch queries atau single query
if (isset($payload['queries']) && is_array($payload['queries'])) {
    $results = [];
    foreach ($payload['queries'] as $q) {
        if (!is_string($q) || trim($q) === '') continue;
        $ch = curl_init($neonEndpoint);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(['query' => trim($q)]));
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Content-Type: application/json',
            'Neon-Connection-String: ' . $connStr
        ]);
        curl_setopt($ch, CURLOPT_TIMEOUT, 30);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        $res = curl_exec($ch);
        curl_close($ch);
        $results[] = json_decode($res, true) ?: $res;
    }
    header("Content-Type: application/json");
    echo json_encode(['success' => true, 'results' => $results, 'rowCount' => count($results)]);
    exit;
}

// Single query
$ch = curl_init($neonEndpoint);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $rawInput);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Neon-Connection-String: ' . $connStr
]);
curl_setopt($ch, CURLOPT_TIMEOUT, 30);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

header("Content-Type: application/json");
http_response_code($httpCode ?: 200);
echo $response ?: json_encode(['error' => 'No response from Neon']);
