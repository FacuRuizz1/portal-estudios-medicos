-- ============================================
-- Datos de prueba: estudios para un usuario
-- de ejemplo (genérico, sin datos personales reales)
--
-- Paso 1: registrate desde registro.html con estos
-- datos de ejemplo (podés cambiarlos si querés):
--
--   Nombre:     Juan Perez
--   Documento:  10000001
--   Contraseña: 123456
--
-- Paso 2: una vez registrado, corré este script.
-- ============================================

INSERT INTO estudios (usuario_id, numero_estudio, fecha, tipo_estudio, estado)
SELECT id, '2490105.2', '2025-11-25'::date, 'ECOGRAFIA RENAL', 'Disponible' FROM usuarios WHERE documento = '10000001'
UNION ALL
SELECT id, '1013894.4', '2026-04-29'::date, 'RX TORAX', 'Disponible' FROM usuarios WHERE documento = '10000001'
UNION ALL
SELECT id, '2540961.2', '2026-04-06'::date, 'ECOGRAFIA ABDOMINAL', 'Pendiente' FROM usuarios WHERE documento = '10000001'
UNION ALL
SELECT id, '2523212.2', '2026-02-20'::date, 'ECO DOPPLER FEMORAL', 'Disponible' FROM usuarios WHERE documento = '10000001'
UNION ALL
SELECT id, '32047.41',  '2025-10-20'::date, 'TAC ABDOMEN Y PELVIS', 'Disponible' FROM usuarios WHERE documento = '10000001'
UNION ALL
SELECT id, '2456789.2', '2025-09-09'::date, 'ECO DOPPLER CAROTIDAS', 'En Proceso' FROM usuarios WHERE documento = '10000001';

-- Para verificar que se insertaron bien:
-- SELECT * FROM estudios;