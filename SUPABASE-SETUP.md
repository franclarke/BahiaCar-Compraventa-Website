# Configuración de Supabase para Imágenes

## Problema Identificado

Las imágenes se están subiendo correctamente a Supabase, pero no se están mostrando en la aplicación. Esto puede deberse a problemas de configuración de políticas RLS (Row Level Security) o configuración del bucket.

## Pasos para Solucionar

### 1. Verificar Variables de Entorno

Asegúrate de que estas variables estén configuradas en tu archivo `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima
SUPABASE_SERVICE_ROLE_KEY=tu_clave_de_servicio
```

### 2. Configurar el Bucket en Supabase

1. Ve a tu proyecto de Supabase
2. Navega a **Storage** en el panel lateral
3. Busca el bucket `car-images` o créalo si no existe
4. Configura el bucket como **público**

### 3. Configurar Políticas RLS

Ejecuta estos comandos SQL en el editor SQL de Supabase:

```sql
-- Permitir lectura pública de imágenes
CREATE POLICY "Public read access for car images" ON storage.objects
FOR SELECT USING (bucket_id = 'car-images');

-- Permitir subida de imágenes para usuarios autenticados
CREATE POLICY "Authenticated users can upload car images" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'car-images' AND auth.role() = 'authenticated');

-- Permitir actualización de imágenes para usuarios autenticados
CREATE POLICY "Authenticated users can update car images" ON storage.objects
FOR UPDATE USING (bucket_id = 'car-images' AND auth.role() = 'authenticated');

-- Permitir eliminación de imágenes para usuarios autenticados
CREATE POLICY "Authenticated users can delete car images" ON storage.objects
FOR DELETE USING (bucket_id = 'car-images' AND auth.role() = 'authenticated');
```

### 4. Verificar Configuración

Ejecuta el script de verificación:

```bash
node scripts/fix-image-urls.js
```

### 5. Probar la Funcionalidad

1. Ve a `/test-images` en tu aplicación para verificar que las imágenes se cargan
2. Intenta subir una nueva imagen desde el panel de administración
3. Verifica que las imágenes aparezcan en el catálogo

## Estructura de URLs

Las URLs de las imágenes deben tener este formato:

```
https://tu-proyecto.supabase.co/storage/v1/object/public/car-images/cars/car-123-1234567890.jpg
```

## Comandos Útiles

### Verificar imágenes existentes
```bash
node scripts/fix-image-urls.js
```

### Poblar opciones por defecto
```bash
node scripts/seed-car-options.js
```

### Verificar configuración de Supabase
```bash
node scripts/verify-supabase-images.mjs
```

### Limpiar opciones no utilizadas
```bash
node scripts/cleanup-unused-options.js
```

## Funcionalidades Implementadas

### ✅ Sistema de Opciones Dinámicas

- **Transmisión**: Manual, Automática, CVT + opciones personalizadas
- **Tipo de Vehículo**: Sedán, SUV, Hatchback, etc. + opciones personalizadas  
- **Combustible**: Nafta, Diésel, GNC, etc. + opciones personalizadas

### ✅ Formulario de Administración Mejorado

- Selectores dinámicos con botón "+" para agregar opciones
- Las nuevas opciones se guardan en la base de datos
- Se muestran automáticamente en futuros formularios

### ✅ Filtros del Catálogo Actualizados

- Los filtros ahora cargan opciones desde la base de datos
- Se actualizan automáticamente cuando se agregan nuevas opciones
- Mantienen compatibilidad con opciones existentes

### ✅ Mejoras en el Sistema de Imágenes

- ✅ **Subida de imágenes corregida**: Ahora funciona tanto para crear como editar autos
- ✅ **Modo aditivo**: Las nuevas imágenes se agregan a las existentes en lugar de reemplazarlas
- ✅ **Mejor manejo de errores**: Validación mejorada de archivos
- ✅ **Logging detallado**: Para facilitar el debugging

### ✅ Sistema de Opciones Inteligentes

- ✅ **Filtrado automático**: Los filtros públicos solo muestran opciones en uso
- ✅ **Panel administrativo completo**: Los administradores ven todas las opciones
- ✅ **Limpieza automática**: Script para eliminar opciones no utilizadas
- ✅ **Indicadores visuales**: Distingue entre opciones por defecto y personalizadas

## Próximos Pasos

1. Configurar las políticas RLS en Supabase
2. Verificar que el bucket sea público
3. Probar la subida y visualización de imágenes
4. Probar la funcionalidad de opciones dinámicas 