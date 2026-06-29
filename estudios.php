<?php
// ============================================
// Endpoint: estudios.php
// Devuelve, en JSON, los estudios del usuario
// que tenga la sesión activa. Acepta un parámetro
// opcional ?busqueda= para filtrar por tipo_estudio.
// ============================================

session_start();

require_once __DIR__ . '/db.php';

// 1) Protección: si no hay sesión activa, no mostramos nada
if (!isset($_SESSION['usuario_id'])) {
    http_response_code(401); // 401 = "no autorizado"
    echo json_encode([
        'success' => false,
        'message' => 'No hay sesión activa. Iniciá sesión nuevamente.'
    ]);
    exit;
}

$usuarioId = $_SESSION['usuario_id'];

// 2) Leemos el parámetro de búsqueda (viene por GET, ej: estudios.php?busqueda=rx)
$busqueda = trim($_GET['busqueda'] ?? '');

try {

    if ($busqueda !== '') {

        // ILIKE = como LIKE, pero sin distinguir mayúsculas/minúsculas (propio de PostgreSQL)
        $stmt = $pdo->prepare(
            "SELECT numero_estudio, fecha, tipo_estudio, estado
             FROM estudios
             WHERE usuario_id = :usuario_id
               AND tipo_estudio ILIKE :busqueda
             ORDER BY fecha DESC"
        );
        $stmt->execute([
            'usuario_id' => $usuarioId,
            'busqueda'   => '%' . $busqueda . '%' // los % son "cualquier cosa antes/después"
        ]);

    } else {

        $stmt = $pdo->prepare(
            "SELECT numero_estudio, fecha, tipo_estudio, estado
             FROM estudios
             WHERE usuario_id = :usuario_id
             ORDER BY fecha DESC"
        );
        $stmt->execute(['usuario_id' => $usuarioId]);
    }

    $estudios = $stmt->fetchAll();

    echo json_encode([
        'success'        => true,
        'usuario_nombre' => $_SESSION['usuario_nombre'],
        'estudios'       => $estudios
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Ocurrió un error al obtener los estudios.'
    ]);
}