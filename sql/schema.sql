-- ============================================
-- Base de datos: nombre_de_tu_bd
-- Proyecto de práctica AJAX + PHP + PostgreSQL
-- ============================================

-- Tabla de usuarios (login por documento + contraseña)
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    documento VARCHAR(20) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    fecha_registro TIMESTAMP DEFAULT now()
);

-- Tabla de estudios médicos asociados a cada usuario
CREATE TABLE estudios (
    id SERIAL PRIMARY KEY,
    usuario_id INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    numero_estudio VARCHAR(20) NOT NULL,
    fecha DATE NOT NULL,
    tipo_estudio VARCHAR(100) NOT NULL,
    estado VARCHAR(20) DEFAULT 'Disponible'
);

