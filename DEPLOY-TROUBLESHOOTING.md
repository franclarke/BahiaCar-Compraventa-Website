# 🚨 Guía de Solución de Problemas de Deploy

## ❌ Problema: "No se cargan los datos después del deploy"

### 🔍 Diagnóstico Rápido

1. **Visita el endpoint de diagnóstico:**
   ```
   https://tu-sitio.netlify.app/api/health
   ```

2. **Revisa las variables de entorno en Netlify:**
   - Ve a tu panel de Netlify
   - Site settings → Environment variables
   - Verifica que todas estén configuradas

### 📋 Variables de Entorno Requeridas

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Database Configuration (Prisma)
DATABASE_URL="postgresql://username:password@hostname:port/database"
DIRECT_URL="postgresql://username:password@hostname:port/database"

# NextAuth Configuration
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=https://tu-sitio.netlify.app
```

### 🛠️ Pasos de Solución

#### 1. **Configurar Variables de Entorno en Netlify**
```bash
# En tu panel de Netlify:
# Site settings → Environment variables → Add variable

# Agrega cada variable una por una
```

#### 2. **Verificar Conexión a Base de Datos**
- Asegúrate de que tu base de datos esté accesible desde internet
- Verifica que las credenciales sean correctas
- Confirma que la URL de conexión sea válida

#### 3. **Regenerar el Deploy**
```bash
# Después de configurar las variables:
# Deploys → Trigger deploy → Deploy site
```

#### 4. **Verificar Logs de Build**
```bash
# En Netlify:
# Deploys → [último deploy] → Deploy log
# Busca errores relacionados con variables de entorno
```

### 🔧 Comandos de Verificación Local

```bash
# Verificar que las variables estén en tu .env local
cat .env

# Probar conexión a la base de datos
npx prisma db pull

# Verificar que el build funcione
npm run build
```

### 📞 Endpoints de Diagnóstico

- **Health Check:** `/api/health`
- **Cars API:** `/api/cars`
- **Messages API:** `/api/messages`

### 🚨 Errores Comunes

1. **"Missing required environment variables"**
   - Solución: Configurar variables en Netlify

2. **"Cannot connect to database"**
   - Solución: Verificar DATABASE_URL y DIRECT_URL

3. **"API token is invalid"**
   - Solución: Verificar claves de Supabase

4. **"Function timeout"**
   - Solución: Optimizar consultas de base de datos

### 📱 Contacto de Soporte

Si el problema persiste:
1. Revisa los logs de Netlify
2. Verifica el endpoint `/api/health`
3. Comparte los errores específicos que aparecen 