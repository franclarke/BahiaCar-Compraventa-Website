-- Script para marcar algunos autos como vendidos para pruebas
-- Ejecutar en la consola de Supabase o en tu cliente de PostgreSQL

-- Marcar el primer auto como vendido
UPDATE "Car" SET vendido = true WHERE id = 1;

-- Marcar algunos autos más como vendidos (ajustar IDs según tu base de datos)
UPDATE "Car" SET vendido = true WHERE id IN (2, 5, 8);

-- Verificar los cambios
SELECT id, brand, model, year, price, vendido FROM "Car" ORDER BY id;

-- Para revertir los cambios (marcar como disponibles)
-- UPDATE "Car" SET vendido = false WHERE vendido = true; 