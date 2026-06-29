<?php
//Destruye la sesion activa

session_start();

header('Content-Type: application/json; charset=utf-8');

$_SESSION = []; //Vaciamos todas las variables de sesion
session_destroy();

echo json_encode([
    'success' => true,
    'message' => 'Sesion cerrada correctamente.'
]);