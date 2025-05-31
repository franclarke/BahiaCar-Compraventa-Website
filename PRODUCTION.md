# 🚀 Guía de Despliegue en Producción - AutosBahia

## 📋 Requisitos Previos

- Node.js 18+ 
- Base de datos PostgreSQL configurada
- Variables de entorno configuradas

## 🔧 Variables de Entorno Requeridas

Crear un archivo `.env` con las siguientes variables:

```bash
# Base de datos
DATABASE_URL="postgresql://usuario:contraseña@host:puerto/database"

# JWT Secret (mínimo 32 caracteres)
JWT_SECRET="tu_clave_secreta_jwt_muy_segura_aqui"

# Supabase (para almacenamiento de imágenes)
NEXT_PUBLIC_SUPABASE_URL="https://tu-proyecto.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="tu_clave_anonima"
SUPABASE_SERVICE_KEY="tu_clave_de_servicio"

# Configuración de producción
NODE_ENV="production"
NEXTAUTH_URL="https://tu-dominio.com"
```

## 🏗️ Proceso de Build y Despliegue

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar base de datos
```bash
# Generar cliente de Prisma
npx prisma generate

# Ejecutar migraciones
npx prisma migrate deploy

# (Opcional) Crear usuario administrador
npm run create-admin admin contraseña123
```

### 3. Build de producción
```bash
npm run build:production
```

### 4. Iniciar en producción
```bash
npm run start:production
```

## 🔒 Seguridad en Producción

### Variables de Entorno Críticas
- ✅ `JWT_SECRET`: Debe ser único y seguro (32+ caracteres)
- ✅ `DATABASE_URL`: Conexión segura a base de datos
- ✅ `NODE_ENV=production`: Habilita optimizaciones

### Configuraciones de Seguridad
- ✅ Cookies httpOnly para autenticación
- ✅ CORS configurado apropiadamente
- ✅ Validación de entrada en todas las APIs
- ✅ Manejo seguro de errores (sin exposición de detalles)

## 📊 Monitoreo y Logs

### Logs de Aplicación
Los errores se registran condicionalmente:
- En desarrollo: `console.error` activo
- En producción: Logs silenciados (configurar servicio externo)

### Métricas de Rendimiento
- ✅ Imágenes optimizadas con Next.js Image
- ✅ Componentes lazy loading
- ✅ Build optimizado para producción
- ✅ Compresión automática

## 🌐 Configuración de Servidor Web

### Nginx (Recomendado)
```nginx
server {
    listen 80;
    server_name tu-dominio.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### PM2 (Gestor de Procesos)
```bash
# Instalar PM2
npm install -g pm2

# Crear archivo ecosystem.config.js
module.exports = {
  apps: [{
    name: 'autos-bahia',
    script: 'npm',
    args: 'start',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
}

# Iniciar con PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## 🔄 Actualizaciones

### Proceso de Actualización
1. Hacer backup de la base de datos
2. Ejecutar `git pull` para obtener cambios
3. Ejecutar `npm install` para nuevas dependencias
4. Ejecutar `npx prisma migrate deploy` para migraciones
5. Ejecutar `npm run build:production`
6. Reiniciar el servidor

## 🆘 Solución de Problemas

### Errores Comunes

**Error de conexión a base de datos:**
- Verificar `DATABASE_URL`
- Comprobar conectividad de red
- Validar credenciales

**Error de JWT:**
- Verificar `JWT_SECRET` configurado
- Comprobar longitud mínima (32 caracteres)

**Imágenes no cargan:**
- Verificar configuración de Supabase
- Comprobar permisos de bucket
- Validar URLs en `next.config.js`

### Logs de Depuración
```bash
# Ver logs en tiempo real con PM2
pm2 logs autos-bahia

# Ver estado de la aplicación
pm2 status
```

## 📈 Optimizaciones Aplicadas

- ✅ **Imágenes**: Optimización automática con Next.js Image
- ✅ **CSS**: Tailwind CSS con purging automático
- ✅ **JavaScript**: Minificación y tree-shaking
- ✅ **Caching**: Headers de cache apropiados
- ✅ **Compresión**: Gzip habilitado
- ✅ **Responsive**: Mobile-first design
- ✅ **SEO**: Meta tags optimizados

## 🎯 Métricas de Rendimiento Objetivo

- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **Time to Interactive**: < 3.5s

---

**¡La aplicación está lista para producción! 🎉** 