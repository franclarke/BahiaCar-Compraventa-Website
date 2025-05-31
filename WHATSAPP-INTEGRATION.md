# Integración con WhatsApp - Documentación

## Resumen de Cambios

Se ha modificado la aplicación para que todos los formularios redirijan a WhatsApp en lugar de guardar los datos en Supabase. Esto incluye:

### 📋 Formularios Modificados

1. **"Publicá tu auto hoy"** (`components/sell-car-dialog.tsx`)
2. **"Consultanos Ahora"** (`components/contact-dialog.tsx`) 
3. **"Estoy Interesado"** (reutiliza `contact-dialog.tsx` en páginas de detalles)

### 🔧 Archivos Modificados/Creados

#### 1. **`lib/whatsapp-utils.ts`** (NUEVO)
Contiene todas las funciones utilitarias para construir mensajes de WhatsApp:

- `buildSellCarWhatsAppMessage()` - Para formulario de venta
- `buildContactWhatsAppMessage()` - Para formulario de contacto general  
- `buildInterestWhatsAppMessage()` - Para formulario de interés en auto específico
- `createWhatsAppURL()` - Construye la URL de WhatsApp
- `openWhatsApp()` - Abre WhatsApp en nueva ventana

#### 2. **`components/sell-car-dialog.tsx`** (MODIFICADO)
- ✅ Importa funciones de WhatsApp utils
- ✅ Reemplaza llamada a API por construcción de mensaje WhatsApp
- ✅ Abre WhatsApp con todos los datos del formulario
- ✅ Mantiene la misma UX pero con redirección a WhatsApp

#### 3. **`components/contact-dialog.tsx`** (MODIFICADO)
- ✅ Importa funciones de WhatsApp utils
- ✅ Soporte para información del auto (prop `carInfo`)
- ✅ Diferencia entre contacto general e interés en auto específico
- ✅ Reemplaza llamada a API por construcción de mensaje WhatsApp

#### 4. **`app/catalogo/[id]/page.tsx`** (MODIFICADO)
- ✅ Pasa información del auto al formulario de contacto
- ✅ Construye string con detalles del auto consultado

### 📱 Número de WhatsApp Configurado

```
+54 9 (291) 572-5975
```

### 📝 Formato de Mensajes

#### Formulario de Venta de Auto:
```
¡Hola! Me interesa vender mi auto.

Nombre: [Nombre del usuario]
Teléfono: [Teléfono]
Email: [Email]
Marca: [Marca]
Modelo: [Modelo]
Año: [Año]
Condición: [Nueva/Usado]
Kilometraje: [XXX] km
Precio: $[Precio]
Mensaje adicional: [Descripción]
```

#### Formulario de Contacto General:
```
¡Hola! Tengo una consulta.

Nombre: [Nombre del usuario]
Email: [Email]
Mensaje: [Mensaje]
```

#### Formulario "Estoy Interesado":
```
¡Hola! Estoy interesado en un auto.

Nombre: [Nombre del usuario]
Email: [Email]
Mensaje: [Mensaje]

Auto consultado: [Marca Modelo Año (ID: XX) - USD XXXXX]
```

### 🔒 Seguridad

- ✅ Uso de `encodeURIComponent()` para codificar caracteres especiales
- ✅ Validación de formularios mantiene la misma lógica
- ✅ Números de teléfono se limpian automáticamente (solo dígitos)

### 🚀 Características

- ✅ **UX Optimizada**: Mensajes de toast informativos al usuario
- ✅ **Responsive**: Funciona en móvil y desktop
- ✅ **Accesibilidad**: Mantiene todos los atributos ARIA existentes
- ✅ **Fallback**: Manejo de errores si no se puede abrir WhatsApp
- ✅ **TypeScript**: Completamente tipado con interfaces

### 📱 Flujo de Usuario

1. Usuario completa cualquier formulario
2. Presiona "Publicar", "Enviar mensaje" o "Estoy Interesado"
3. Se muestra toast: "¡Redirigiendo a WhatsApp!"
4. Se abre WhatsApp Web/App con mensaje preescrito
5. Usuario puede editar mensaje si necesita y enviar

### 🔄 APIs Removidas

Los siguientes endpoints ya no se utilizan:
- `/api/sell_request` (formulario de venta)
- `/api/contact` (formulario de contacto)

**Nota**: Las APIs siguen existiendo pero no se llaman desde el frontend.

### ✅ Testing

Para probar:
1. Llenar cualquier formulario
2. Hacer clic en enviar
3. Verificar que se abre WhatsApp con el mensaje correcto
4. Verificar que todos los datos del formulario están incluidos

### 🚧 Consideraciones de Desarrollo

- Los formularios mantienen toda la validación existente
- Se preserva la UX original (loading states, toasts, etc.)
- Los cambios son retrocompatibles
- No se rompe ninguna funcionalidad existente 