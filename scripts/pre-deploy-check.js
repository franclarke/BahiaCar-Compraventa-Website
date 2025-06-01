#!/usr/bin/env node

/**
 * Pre-deploy verification script
 * Validates configuration before deploying to Netlify
 */

const fs = require('fs')
const path = require('path')

const REQUIRED_FILES = [
  'netlify.toml',
  'next.config.js',
  'lib/image-loader.js',
  'public/manifest.json',
  'public/logo.svg',
  'app/api/health/route.ts'
]

const REQUIRED_ENV_VARS = [
  'DATABASE_URL',
  'DIRECT_URL',
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY'
]

console.log('🔍 Ejecutando verificación pre-deploy...\n')

let hasErrors = false

// Verificar archivos requeridos
console.log('📁 Verificando archivos requeridos:')
REQUIRED_FILES.forEach(file => {
  const exists = fs.existsSync(path.join(process.cwd(), file))
  const status = exists ? '✅' : '❌'
  console.log(`  ${status} ${file}`)
  if (!exists) hasErrors = true
})

// Verificar variables de entorno
console.log('\n🔧 Verificando variables de entorno:')
REQUIRED_ENV_VARS.forEach(envVar => {
  const exists = !!process.env[envVar]
  const status = exists ? '✅' : '⚠️'
  console.log(`  ${status} ${envVar}`)
  if (!exists) {
    console.log(`    💡 Asegúrate de configurar esta variable en Netlify`)
  }
})

// Verificar manifest.json
console.log('\n📱 Verificando manifest.json:')
try {
  const manifestPath = path.join(process.cwd(), 'public/manifest.json')
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'))
  
  // Verificar iconos
  const hasValidIcons = manifest.icons && manifest.icons.length > 0
  const iconsHaveValidPurpose = manifest.icons.every(icon => 
    icon.purpose && (icon.purpose === 'any' || icon.purpose === 'maskable')
  )
  
  console.log(`  ${hasValidIcons ? '✅' : '❌'} Iconos presentes`)
  console.log(`  ${iconsHaveValidPurpose ? '✅' : '❌'} Propósitos de iconos válidos`)
  
  if (!hasValidIcons || !iconsHaveValidPurpose) hasErrors = true
} catch (error) {
  console.log('  ❌ Error leyendo manifest.json:', error.message)
  hasErrors = true
}

// Verificar next.config.js
console.log('\n⚙️ Verificando next.config.js:')
try {
  const configPath = path.join(process.cwd(), 'next.config.js')
  const configContent = fs.readFileSync(configPath, 'utf8')
  
  const hasConditionalImageLoader = configContent.includes('process.env.NODE_ENV === \'production\'')
  const hasImageLoaderFile = configContent.includes('loaderFile: \'./lib/image-loader.js\'')
  const hasStandaloneOutput = configContent.includes('output: \'standalone\'')
  
  console.log(`  ${hasConditionalImageLoader ? '✅' : '❌'} Image loader condicional configurado`)
  console.log(`  ${hasImageLoaderFile ? '✅' : '❌'} Image loader file especificado`)
  console.log(`  ${hasStandaloneOutput ? '✅' : '❌'} Output standalone configurado`)
  
  if (!hasConditionalImageLoader || !hasImageLoaderFile || !hasStandaloneOutput) hasErrors = true
} catch (error) {
  console.log('  ❌ Error leyendo next.config.js:', error.message)
  hasErrors = true
}

// Verificar netlify.toml
console.log('\n🌐 Verificando netlify.toml:')
try {
  const tomlPath = path.join(process.cwd(), 'netlify.toml')
  const tomlContent = fs.readFileSync(tomlPath, 'utf8')
  
  const hasNextjsPlugin = tomlContent.includes('@netlify/plugin-nextjs')
  const hasCSSHeaders = tomlContent.includes('/_next/static/css/*')
  const hasImageRedirects = tomlContent.includes('/_next/image*')
  
  console.log(`  ${hasNextjsPlugin ? '✅' : '❌'} Plugin de Next.js configurado`)
  console.log(`  ${hasCSSHeaders ? '✅' : '❌'} Headers para CSS configurados`)
  console.log(`  ${hasImageRedirects ? '✅' : '❌'} Redirects para imágenes configurados`)
  
  if (!hasNextjsPlugin || !hasCSSHeaders || !hasImageRedirects) hasErrors = true
} catch (error) {
  console.log('  ❌ Error leyendo netlify.toml:', error.message)
  hasErrors = true
}

// Verificar image loader
console.log('\n🖼️ Verificando image loader:')
try {
  const loaderPath = path.join(process.cwd(), 'lib/image-loader.js')
  const loaderContent = fs.readFileSync(loaderPath, 'utf8')
  
  const handlesLocalImages = loaderContent.includes('src.startsWith(\'/\')')
  const handlesSupabaseImages = loaderContent.includes('supabase.co')
  const hasFallback = loaderContent.includes('return src')
  
  console.log(`  ${handlesLocalImages ? '✅' : '❌'} Maneja imágenes locales`)
  console.log(`  ${handlesSupabaseImages ? '✅' : '❌'} Maneja imágenes de Supabase`)
  console.log(`  ${hasFallback ? '✅' : '❌'} Tiene fallback`)
  
  if (!handlesLocalImages || !handlesSupabaseImages || !hasFallback) hasErrors = true
} catch (error) {
  console.log('  ❌ Error leyendo image loader:', error.message)
  hasErrors = true
}

// Resultado final
console.log('\n' + '='.repeat(50))
if (hasErrors) {
  console.log('❌ Verificación FALLIDA')
  console.log('🔧 Corrige los errores antes de hacer deploy')
  process.exit(1)
} else {
  console.log('✅ Verificación EXITOSA')
  console.log('🚀 Listo para deploy en Netlify')
  console.log('\n💡 Recuerda configurar las variables de entorno en Netlify')
  console.log('💡 Después del deploy, verifica: https://tu-sitio.netlify.app/api/health')
  console.log('💡 Las imágenes funcionarán en desarrollo (sin custom loader) y producción (con custom loader)')
}

console.log('='.repeat(50)) 