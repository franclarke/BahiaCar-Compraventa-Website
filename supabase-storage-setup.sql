-- Script para configurar Supabase Storage para el proyecto de autos

-- 1. Crear el bucket si no existe (ejecutar en Storage > Settings o via código)
-- INSERT INTO storage.buckets (id, name, public) 
-- VALUES ('car-images', 'car-images', true)
-- ON CONFLICT (id) DO NOTHING;

-- 2. Crear políticas para el bucket car-images

-- Política para permitir subir archivos (INSERT)
CREATE POLICY "Allow public uploads" ON storage.objects 
FOR INSERT WITH CHECK (bucket_id = 'car-images');

-- Política para permitir leer archivos (SELECT)  
CREATE POLICY "Allow public access" ON storage.objects 
FOR SELECT USING (bucket_id = 'car-images');

-- Política para permitir eliminar archivos (DELETE)
CREATE POLICY "Allow public deletes" ON storage.objects 
FOR DELETE USING (bucket_id = 'car-images');

-- Política para permitir actualizar archivos (UPDATE)
CREATE POLICY "Allow public updates" ON storage.objects 
FOR UPDATE USING (bucket_id = 'car-images');

-- Verificar que las políticas se crearon correctamente
SELECT * FROM storage.objects WHERE bucket_id = 'car-images';

-- Si necesitas eliminar políticas existentes (ejecutar solo si es necesario):
-- DROP POLICY IF EXISTS "Allow public uploads" ON storage.objects;
-- DROP POLICY IF EXISTS "Allow public access" ON storage.objects;
-- DROP POLICY IF EXISTS "Allow public deletes" ON storage.objects;
-- DROP POLICY IF EXISTS "Allow public updates" ON storage.objects; 