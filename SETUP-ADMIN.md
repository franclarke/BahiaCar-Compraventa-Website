# Setup del Sistema de Administración

## Variables de Entorno Requeridas

Asegúrate de tener las siguientes variables en tu archivo `.env.local`:

```env
# Base de datos
DATABASE_URL="postgresql://username:password@localhost:5432/database_name"
DIRECT_URL="postgresql://username:password@localhost:5432/database_name"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# JWT Secret para autenticación
JWT_SECRET="your-super-secret-jwt-key-here"

# Next.js
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## Configuración de Supabase Storage

1. Ve a tu proyecto de Supabase
2. Navega a Storage
3. Crea un bucket llamado `car-images`
4. Configura las políticas de acceso:
   - Permitir lectura pública
   - Permitir escritura solo para usuarios autenticados

## Crear Usuario Administrador

Ejecuta el siguiente comando para crear un usuario administrador:

```bash
npm run create-admin [username] [password]
```

Ejemplo:
```bash
npm run create-admin admin mypassword123
```

Si no especificas username y password, se usarán los valores por defecto:
- Username: `admin`
- Password: `admin123`

## Acceso al Panel

1. Inicia el servidor de desarrollo: `npm run dev`
2. Ve a `http://localhost:3000/login`
3. Ingresa las credenciales del administrador
4. Serás redirigido a `http://localhost:3000/panel`

## Funcionalidades del Panel

### Gestión de Autos
- ✅ Ver lista de todos los autos
- ✅ Buscar autos por marca, modelo o descripción
- ✅ Filtrar por estado (Nuevo/Usado) y vendido
- ✅ Agregar nuevos autos con imágenes
- ✅ Editar autos existentes
- ✅ Eliminar autos (incluye eliminación de imágenes)
- ✅ Subida de múltiples imágenes a Supabase Storage

### Autenticación
- ✅ Login seguro con JWT
- ✅ Cookies httpOnly para seguridad
- ✅ Verificación de autenticación en rutas protegidas
- ✅ Logout con limpieza de sesión

## Estructura de Archivos

```
app/
├── login/
│   └── page.js                 # Página de login
├── panel/
│   ├── layout.js              # Layout del panel (protegido)
│   ├── page.js                # Página principal del panel
│   └── components/
│       ├── car-management.js  # Componente principal de gestión
│       ├── car-form.js        # Formulario de auto
│       └── delete-car-dialog.js # Diálogo de confirmación
└── api/
    ├── auth/
    │   ├── login/route.js     # API de login
    │   ├── logout/route.js    # API de logout
    │   └── verify/route.js    # API de verificación
    └── cars/
        └── admin/route.js     # API CRUD de autos

lib/
├── auth.js                    # Funciones de autenticación
├── storage.js                 # Funciones de Supabase Storage
├── middleware.js              # Middleware de autenticación
└── supabaseClient.js          # Cliente de Supabase

components/
└── logout-button.js           # Botón de logout

scripts/
└── create-admin.js            # Script para crear admin
```

## Seguridad

- Las contraseñas se hashean con bcrypt (12 rounds)
- JWT tokens con expiración de 24 horas
- Cookies httpOnly para prevenir XSS
- Verificación de autenticación en todas las rutas del panel
- Validación de datos en el servidor

## Troubleshooting

### Error: "Missing Supabase environment variables"
- Verifica que todas las variables de Supabase estén configuradas en `.env.local`

### Error: "No autorizado" en API
- Verifica que estés logueado correctamente
- Revisa que las cookies se estén enviando

### Error al subir imágenes
- Verifica la configuración del bucket `car-images` en Supabase
- Revisa las políticas de acceso del bucket
- Confirma que `SUPABASE_SERVICE_ROLE_KEY` esté configurada

### Error de conexión a la base de datos
- Verifica `DATABASE_URL` y `DIRECT_URL`
- Ejecuta `npx prisma generate` y `npx prisma db push` 