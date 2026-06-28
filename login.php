<?php

session_start();

require_once __DIR__ . '/db.php';

$datos = json_decode(file_get_contents('php://input'), true);

$documento = trim($datos['documento'] ?? '');
$password = $datos['password'] ?? '';

if($documento === '' || $password === '') {
    echo json_encode([
        'success' => false,
        'message' => 'Completa documento y contraseña.'
    ]);
    exit;

}

try {

   //Busco el usuario por documento
   $stmt = $pdo->prepare("SELECT id, nombre, password_hash FROM usuarios WHERE documento = :documento");
   $stmt->execute(['documento' => $documento]);
   $usuario = $stmt->fetch();

    // Si no existe el usuario, o la contraseña no coincide con el hash guardado
    if (!$usuario || !password_verify($password, $usuario['password_hash'])) {
        echo json_encode([
            'success' => false,
            'message' => 'Documento o contraseña incorrectos.'
        ]);
        exit;
    }

    // Credenciales correctas: guardamos los datos clave en la sesion
    $_SESSION['usuario_id'] = $usuario['id'];
    $_SESSION['usuario_nombre'] = $usuario['nombre'];

    echo json_encode([
        'success' => true,
        'message' => 'Sesion iniciada correctamente.'
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Ocurrio un error al iniciar sesión.'
    ]);
}