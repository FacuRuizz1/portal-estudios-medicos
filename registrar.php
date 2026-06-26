<?php

require_once __DIR__ . '/db.php';


$datos = json_decode(file_get_contents('php://input'), true);

$nombre = trim($datos['nombre'] ?? '');
$documento = trim($datos['documento'] ?? '');
$password = $datos['password'] ?? '';

//Validaciones basicas del lado del servidor
if($nombre === '' || $documento === '' || $password === '') {
  echo json_encode([
    'success' => false,
    'message' => 'Todos los campos son obligatorios.'
  ]);
  exit;
}

if(strlen($password) < 6) {
    echo json_encode([
        'success' => false,
        'message' => 'La contraseña debe tener al menos 6 caracteres'
    ]);
    exit;
}

try {
   //Verificar que el documento no este ya registrado
   $stmt = $pdo->prepare("SELECT id FROM usuarios WHERE documento = :documento");
   $stmt->execute(['documento' => $documento]);

   if($stmt->fetch()) {
    echo json_encode([
        'success' => false,
        'message' => 'Ese numero de documento ya esta registrado.'
    ]);
    exit;
   }

   //Hashear la contraseña 
   $passwordHash = password_hash($password, PASSWORD_DEFAULT);

   //Insertar el nuevo usuario
   $stmt = $pdo->prepare(
    "INSERT INTO usuarios (nombre, documento, password_hash) VALUES (:nombre, :documento, :password_hash)"
   );

   $stmt->execute([
    'nombre' => $nombre,
    'documento' => $documento,
    'password_hash' => $passwordHash
   ]);

   echo json_encode([
    'success' => true,
    'message' => 'Usuario registrado correctamente. Ya podes iniciar sesion.'
   ]);


} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Ocurrio un error al registrar el usuario.'
    ]);
}