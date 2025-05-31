# Funcionalidad de Autos Vendidos

## Descripción
Se ha implementado la capacidad de marcar autos como "vendidos" en la aplicación de compra y venta de autos.

## Características Implementadas

### 1. Base de Datos
- ✅ Agregado campo `vendido` (boolean) al modelo `Car` en Prisma
- ✅ Migración aplicada a la base de datos de Supabase
- ✅ Valor por defecto: `false` (disponible)

### 2. API
- ✅ Actualizada la API `/api/cars` para soportar filtro por estado de vendido
- ✅ Parámetro `vendido` en los filtros de búsqueda

### 3. Interfaz de Usuario
- ✅ Etiqueta visual "VENDIDO" en diagonal en las cards de autos vendidos
- ✅ Etiqueta visual "VENDIDO" en la página de detalle del auto
- ✅ Filtro "Estado de Venta" en el panel de filtros con opciones:
  - Todos
  - Disponible
  - Vendido
- ✅ Navegación de imágenes funcional en cards de autos vendidos
- ✅ Botón de contacto deshabilitado para autos vendidos

## Cómo Usar

### Marcar un Auto como Vendido
1. Accede a la consola de Supabase
2. Ve a la tabla `Car`
3. Encuentra el auto que quieres marcar como vendido
4. Cambia el campo `vendido` de `false` a `true`

### Filtrar Autos por Estado
1. Ve al catálogo de autos
2. En el panel de filtros, busca "Estado de Venta"
3. Selecciona:
   - **Todos**: Muestra todos los autos
   - **Disponible**: Solo autos no vendidos
   - **Vendido**: Solo autos vendidos

### Visualización
- Los autos vendidos muestran una etiqueta roja "VENDIDO" en diagonal sobre la imagen en el catálogo
- Los autos vendidos también muestran la etiqueta "VENDIDO" en su página de detalle
- El botón de contacto se deshabilita y cambia a "Auto Vendido" para autos vendidos
- Los autos disponibles no muestran ninguna etiqueta adicional
- La navegación de imágenes funciona correctamente en todas las cards (vendidos y disponibles)

## Archivos Modificados

1. `prisma/schema.prisma` - Agregado campo `vendido`
2. `app/api/cars/route.ts` - Soporte para filtro de vendido
3. `app/catalogo/components/car-card.tsx` - Etiqueta visual VENDIDO y navegación corregida
4. `app/catalogo/components/car-filters.tsx` - Filtro de estado de venta
5. `app/catalogo/[id]/page.tsx` - Etiqueta VENDIDO en página de detalle y botón deshabilitado

## Scripts de Prueba

### SQL para Marcar Autos como Vendidos
```sql
-- Marcar auto específico como vendido
UPDATE "Car" SET vendido = true WHERE id = 1;

-- Marcar múltiples autos como vendidos
UPDATE "Car" SET vendido = true WHERE id IN (2, 5, 8);

-- Ver estado de todos los autos
SELECT id, brand, model, year, price, vendido FROM "Car" ORDER BY id;
```

### Prueba de API
```javascript
// Obtener autos disponibles
fetch('/api/cars', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ vendido: false })
});

// Obtener autos vendidos
fetch('/api/cars', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ vendido: true })
});
```

## Notas Técnicas

- El campo `vendido` es de tipo `Boolean` con valor por defecto `false`
- La etiqueta "VENDIDO" se muestra con rotación de -12 grados para efecto visual
- Los filtros son compatibles con todos los filtros existentes
- La funcionalidad es completamente retrocompatible

## Próximos Pasos Sugeridos

1. **Panel de Administración**: Crear interfaz para marcar autos como vendidos desde la aplicación
2. **Notificaciones**: Sistema de notificaciones cuando un auto se marca como vendido
3. **Historial**: Registro de cuándo se vendió cada auto
4. **Estadísticas**: Dashboard con métricas de ventas 