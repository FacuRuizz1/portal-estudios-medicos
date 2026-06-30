<?php
require_once __DIR__ . '/config.php'; 

header('Content-Type: application/json; charset=utf-8');

try {
    $dsn = "pgsql:host=" . DB_HOST . ";port=" . DB_PORT . ";dbname=" . DB_NAME;

    $pdo = new PDO($dsn, DB_USER, DB_PASS, [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION, // que tire excepción si algo falla
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,       // que devuelva arrays asociativos
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error de conexión a la base de datos.'
    ]);
    exit;
}