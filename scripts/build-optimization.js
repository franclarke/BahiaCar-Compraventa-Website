#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Iniciando proceso de optimización del build...\n');

// 1. Limpiar archivos anteriores
console.log('🧹 Limpiando archivos de build anteriores...');
try {
  execSync('rm -rf .next', { stdio: 'inherit' });
  console.log('✅ Archivos anteriores eliminados\n');
} catch (error) {
  console.log('⚠️  No hay archivos anteriores para limpiar\n');
}

// 2. Verificar dependencias
console.log('📦 Verificando dependencias...');
try {
  execSync('npm audit --audit-level moderate', { stdio: 'inherit' });
  console.log('✅ Dependencias verificadas\n');
} catch (error) {
  console.log('⚠️  Se encontraron vulnerabilidades en dependencias\n');
}

// 3. Generar Prisma client
console.log('🔧 Generando Prisma client...');
try {
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('✅ Prisma client generado\n');
} catch (error) {
  console.log('❌ Error generando Prisma client');
  process.exit(1);
}

// 4. Lint del código
console.log('🔍 Ejecutando linter...');
try {
  execSync('npm run lint', { stdio: 'inherit' });
  console.log('✅ Linter completado sin errores\n');
} catch (error) {
  console.log('⚠️  Se encontraron problemas de linting');
  console.log('🔧 Intentando corregir automáticamente...');
  try {
    execSync('npm run lint:fix', { stdio: 'inherit' });
    console.log('✅ Problemas de linting corregidos\n');
  } catch (fixError) {
    console.log('❌ No se pudieron corregir todos los problemas de linting');
    console.log('Por favor revisa manualmente los errores de linting antes de continuar\n');
  }
}

// 5. Verificar tipos de TypeScript
console.log('📝 Verificando tipos de TypeScript...');
try {
  execSync('npm run type-check', { stdio: 'inherit' });
  console.log('✅ Verificación de tipos completada\n');
} catch (error) {
  console.log('❌ Errores de tipos de TypeScript encontrados');
  process.exit(1);
}

// 6. Build de la aplicación
console.log('🏗️  Construyendo aplicación...');
const buildStart = Date.now();

try {
  execSync('npm run build', { stdio: 'inherit' });
  const buildTime = ((Date.now() - buildStart) / 1000).toFixed(2);
  console.log(`✅ Build completado en ${buildTime} segundos\n`);
} catch (error) {
  console.log('❌ Error durante el build');
  process.exit(1);
}

// 7. Analizar tamaño del bundle
console.log('📊 Analizando tamaño del bundle...');
try {
  const buildDir = path.join(process.cwd(), '.next');
  
  if (fs.existsSync(buildDir)) {
    // Buscar archivos JS en el directorio static
    const staticDir = path.join(buildDir, 'static/chunks');
    
    if (fs.existsSync(staticDir)) {
      const files = fs.readdirSync(staticDir);
      const jsFiles = files.filter(file => file.endsWith('.js'));
      
      let totalSize = 0;
      const bundleInfo = [];
      
      jsFiles.forEach(file => {
        const filePath = path.join(staticDir, file);
        const stats = fs.statSync(filePath);
        const sizeKB = (stats.size / 1024).toFixed(2);
        totalSize += stats.size;
        
        bundleInfo.push({
          name: file,
          size: sizeKB
        });
      });
      
      // Ordenar por tamaño descendente
      bundleInfo.sort((a, b) => parseFloat(b.size) - parseFloat(a.size));
      
      console.log('\n📦 Información del bundle:');
      console.log(`📏 Tamaño total de JS: ${(totalSize / 1024).toFixed(2)} KB`);
      console.log('\n🔝 Archivos más grandes:');
      
      bundleInfo.slice(0, 5).forEach((file, index) => {
        console.log(`${index + 1}. ${file.name}: ${file.size} KB`);
      });
      
      // Recomendaciones basadas en el tamaño
      if (totalSize > 1024 * 500) { // > 500KB
        console.log('\n⚠️  El bundle es grande (>500KB). Considera:');
        console.log('   • Implementar code splitting con dynamic imports');
        console.log('   • Revisar dependencias no utilizadas');
        console.log('   • Usar tree shaking más agresivo');
      } else {
        console.log('\n✅ Tamaño del bundle está en un rango aceptable');
      }
    }
  }
} catch (error) {
  console.log('⚠️  No se pudo analizar el tamaño del bundle');
}

// 8. Recomendaciones finales
console.log('\n🎯 Recomendaciones de optimización:');
console.log('   • Asegúrate de usar `next/image` para todas las imágenes');
console.log('   • Implementa lazy loading para componentes pesados');
console.log('   • Usa `next/dynamic` para importaciones condicionales');
console.log('   • Configura `next.config.js` para optimización de producción');
console.log('   • Considera implementar Service Worker para caching');

console.log('\n🎉 Proceso de optimización completado!');
console.log('💡 Para producción, ejecuta: npm run start');

// 9. Crear reporte de optimización
const reportData = {
  timestamp: new Date().toISOString(),
  buildTime: 'Ver logs',
  recommendations: [
    'Usar componente OptimizedImage para todas las imágenes',
    'Implementar lazy loading con React.lazy()',
    'Configurar preconnect para recursos externos',
    'Minificar CSS y JS en producción',
    'Implementar análisis de bundle con webpack-bundle-analyzer'
  ]
};

fs.writeFileSync(
  path.join(process.cwd(), 'optimization-report.json'),
  JSON.stringify(reportData, null, 2)
);

console.log('📊 Reporte de optimización guardado en optimization-report.json'); 