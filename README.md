# Portal de Estudios Médicos (Práctica AJAX)

Proyecto de práctica para aprender **AJAX** con PHP puro, JavaScript y PostgreSQL.
Está inspirado en el sistema de "Entrega Digital" del Instituto Oulton, pero **no es una copia ni un producto oficial** — es un ejercicio para entender el flujo de login, sesiones y carga dinámica de datos sin recargar la página.

## 🧰 Tecnologías usadas

- **PHP puro** (sin frameworks) — lógica del backend y endpoints
- **PostgreSQL** — base de datos, con **PDO** como capa de conexión
- **JavaScript** — `fetch()` para las llamadas AJAX
- **Bootstrap 5**  — estilos y componentes
- **SweetAlert2** — alertas y feedback visual

## 📁 Estructura del proyecto

```
oulton-portal-practica/
│
├── index.html              → Página de login
├── registro.html           → Página de registro de usuarios
├── estudios.html           → Página protegida con la lista de estudios
│
├── login.php               → Endpoint: valida credenciales y abre sesión
├── registrar.php           → Endpoint: crea un nuevo usuario
├── estudios.php             → Endpoint: devuelve los estudios del usuario logueado (con filtro opcional)
├── logout.php               → Endpoint: cierra la sesión
│
├── db.php                  → Conexión PDO a PostgreSQL (usa config.php)
├── config.php               → Credenciales reales de la base ⚠️ NO incluido en el repo
├── config.example.php       → Plantilla de config.php, sí incluida en el repo
│
├── assets/
│   └── js/
│       ├── login.js
│       ├── registro.js
│       └── estudios.js
│
├── sql/
│   ├── schema.sql           → Creación de tablas
│   └── datos_prueba.sql     → INSERTs de estudios de ejemplo
│
└── .gitignore
```

## ⚠️ Importante: `config.php` no está en el repositorio

Por seguridad, **el archivo `config.php` (con las credenciales reales de la base de datos) no se sube al repositorio** — está listado en `.gitignore`. En su lugar, se incluye `config.example.php`, una plantilla vacía con la estructura esperada.

**Si cloná este repo, tenés que:**

1. Copiar `config.example.php` y renombrar la copia a `config.php`.
2. Completar `config.php` con tus propios datos de conexión a PostgreSQL:

```php
define('DB_HOST', 'localhost');
define('DB_PORT', '5432');
define('DB_NAME', 'nombre_de_tu_db');
define('DB_USER', 'tu_usuario');
define('DB_PASS', 'tu_password');
```

Sin este paso, `db.php` no va a poder conectarse y vas a ver un error de conexión en cualquier endpoint.

## 🚀 Cómo correr el proyecto localmente

### 1. Requisitos previos

- Tener **PHP instalado** (con la extensión `pdo_pgsql` habilitada)
- Tener **PostgreSQL instalado** y corriendo

> No hace falta XAMPP ni Apache — usamos el servidor embebido de PHP, que es más simple para un proyecto de práctica. AJAX funciona igual sin importar qué servidor sirva los archivos PHP.

### 2. Crear la base de datos

```bash
createdb nombre_de_db
```

(o creala desde pgAdmin)

### 3. Crear las tablas

Corré el contenido de `sql/schema.sql` contra tu base `oulton_db` (con pgAdmin → Query Tool, o por terminal):

```bash
psql -U tu_usuario -d nombre_de_tu_db -f sql/schema.sql
```

### 4. Configurar la conexión

Copiá `config.example.php` → `config.php` y completá tus credenciales (ver sección de arriba).

### 5. Levantar el servidor

Parado en la raíz del proyecto:

```bash
php -S localhost:8000
```

### 6. Probar

Entrá a `http://localhost:8000/registro.html`, creá un usuario, después logueate desde `http://localhost:8000/index.html`.

### 7. (Opcional) Cargar estudios de prueba

Una vez que tengas al menos un usuario registrado, corré `sql/datos_prueba.sql` para que tenga estudios de ejemplo asociados y así poder ver la tabla funcionando con datos reales.

## 🔄 Flujo de la aplicación

1. **Registro** (`registro.html` → `registrar.php`): el usuario completa nombre, documento y contraseña. La contraseña se guarda hasheada con `password_hash()`, nunca en texto plano.
2. **Login** (`index.html` → `login.php`): se valida documento + contraseña con `password_verify()`. Si es correcto, se abre una sesión PHP (`$_SESSION`) y se redirige a la lista de estudios.
3. **Lista de estudios** (`estudios.html` → `estudios.php`): al cargar la página, se pide vía AJAX la lista de estudios del usuario logueado (filtrados por `usuario_id` de la sesión, nunca se muestran estudios de otro usuario). Incluye un buscador en vivo por tipo de estudio (con debounce de 400ms para no saturar al servidor).
4. **Logout** (`logout.php`): destruye la sesión y vuelve al login.

Todo el intercambio de datos entre el frontend y el backend se hace con **AJAX** (`fetch()` + JSON) — ninguna página se recarga en ningún momento, salvo las redirecciones explícitas después de login/registro/logout.

## 🔒 Decisiones de seguridad tomadas

- **Prepared statements (PDO)** en todas las consultas que usan datos del usuario, para evitar SQL injection.
- **Contraseñas hasheadas** con `password_hash()` / `password_verify()` — nunca se guardan ni se comparan en texto plano.
- **Validación en cliente y servidor**: el JS valida para dar feedback rápido, pero el PHP vuelve a validar todo, porque nunca hay que confiar en lo que llega del navegador.
- **Endpoints protegidos por sesión**: `estudios.php` rechaza cualquier pedido si no hay `$_SESSION['usuario_id']` activo (responde 401).
- **Mensajes de error genéricos en el login**: se muestra el mismo mensaje tanto si el documento no existe como si la contraseña es incorrecta, para no revelar qué documentos están registrados.
- **Credenciales fuera del repositorio**: `config.php` nunca se sube a GitHub (ver sección de arriba).

## 💡 Posibles mejoras futuras (no implementadas)

- Generación dinámica de informes en PDF (actualmente fuera del alcance del proyecto)
- Recuperación de contraseña
- Paginación de la tabla de estudios
- Panel de administrador para cargar estudios desde la propia interfaz (hoy se cargan manualmente por SQL)
- Verificación en vivo de documento duplicado durante el registro (mientras el usuario escribe)

