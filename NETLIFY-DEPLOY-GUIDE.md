# 🚀 Guía de Deploy para Netlify - BahiaCar

## 📋 Pre-requisitos

### 1. Variables de Entorno Requeridas
Configura estas variables en Netlify (Site settings → Environment variables):

```bash
# Base de Datos
DATABASE_URL="postgresql://username:password@hostname:port/database"
DIRECT_URL="postgresql://username:password@hostname:port/database"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your_anon_key_here"
SUPABASE_SERVICE_ROLE_KEY="your_service_role_key_here"

# NextAuth (opcional si usas autenticación)
NEXTAUTH_SECRET="your_nextauth_secret_here"
NEXTAUTH_URL="https://tu-sitio.netlify.app"

# Node Environment
NODE_ENV="production"
```

## 🔧 Configuraciones Implementadas

### 1. **Optimización de MIME Types**
- ✅ Headers específicos para CSS y JavaScript
- ✅ Corrección de Content-Type para archivos estáticos
- ✅ Cache optimizado para assets

### 2. **Manejo de Imágenes**
- ✅ Image loader personalizado para Netlify
- ✅ Soporte para imágenes SVG locales
- ✅ Optimización de imágenes de Supabase
- ✅ Fallback para optimización de Next.js

### 3. **Manifest.json Corregido**
- ✅ Iconos con propósitos válidos (`any`, `maskable`)
- ✅ Configuración PWA completa
- ✅ Soporte para múltiples tamaños de iconos

### 4. **Configuración de Build**
- ✅ Plugin oficial de Netlify para Next.js
- ✅ Output standalone para mejor rendimiento
- ✅ Optimizaciones de webpack
- ✅ Compresión y minificación habilitadas

## 🚀 Pasos de Deploy

### 1. **Conectar Repositorio**
```bash
# En Netlify Dashboard:
# Sites → Add new site → Import from Git
# Selecciona tu repositorio de GitHub
```

### 2. **Configurar Build Settings**
```bash
# Build command:
npm run build

# Publish directory:
.next

# Node version:
18
```

### 3. **Variables de Entorno**
```bash
# Site settings → Environment variables
# Agrega cada variable listada en Pre-requisitos
```

### 4. **Deploy**
```bash
# Netlify automáticamente ejecutará:
npm install
npm run build
```

## 🔍 Verificación Post-Deploy

### 1. **Health Check**
Visita: `https://tu-sitio.netlify.app/api/health`

Debe retornar:
```json
{
  "status": "healthy",
  "checks": {
    "database": { "status": "ok" },
    "environment": { "status": "ok" },
    "supabase": { "status": "ok" }
  }
}
```

### 2. **Test de Funcionalidades**
- [ ] Página principal carga correctamente
- [ ] Imágenes de autos se muestran
- [ ] Logo.svg aparece en header
- [ ] Formularios funcionan
- [ ] API endpoints responden
- [ ] PWA manifest es válido

### 3. **Performance Check**
```bash
# Lighthouse score esperado:
# Performance: 90+
# Accessibility: 95+
# Best Practices: 95+
# SEO: 95+
```

## 🐛 Solución de Problemas Comunes

### Error: "MIME type not executable"
✅ **Solucionado**: Headers específicos para CSS/JS en `netlify.toml`

### Error: "Next.js Image Optimization 400"
✅ **Solucionado**: Image loader personalizado en `lib/image-loader.js`

### Error: "Manifest icons no valid purpose"
✅ **Solucionado**: Iconos corregidos en `public/manifest.json`

### Error: "Environment variables missing"
🔧 **Verificar**: Variables en Netlify settings

### Error: "Database connection failed"
🔧 **Verificar**: DATABASE_URL y DIRECT_URL son correctas

### Error: "Build failed"
```bash
# Limpiar cache y rebuild:
# Netlify Dashboard → Deploys → Trigger deploy → Clear cache and deploy
```

## 📊 Monitoreo

### 1. **Logs de Deploy**
```bash
# Netlify Dashboard → Deploys → [último deploy] → Deploy log
```

### 2. **Function Logs**
```bash
# Netlify Dashboard → Functions → View logs
```

### 3. **Analytics**
```bash
# Netlify Dashboard → Analytics
```

## 🔄 Actualizaciones Futuras

### 1. **Deploy Automático**
- ✅ Configurado para deploy automático en push a `main`
- ✅ Preview deployments en pull requests

### 2. **Cache Strategy**
```bash
# Assets estáticos: 1 año
# API responses: No cache
# HTML pages: 24 horas
```

### 3. **Rollback**
```bash
# Netlify Dashboard → Deploys → [deploy anterior] → Publish deploy
```

## 📞 Soporte

Si encuentras problemas:

1. **Revisa health check**: `/api/health`
2. **Verifica logs de Netlify**
3. **Confirma variables de entorno**
4. **Testea localmente con**: `npm run build && npm start`

---

**Estado**: ✅ Configuración optimizada para producción
**Última actualización**: Diciembre 2024 