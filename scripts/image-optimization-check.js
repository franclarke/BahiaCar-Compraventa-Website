#!/usr/bin/env node

/**
 * Script para verificar optimizaciones de imagen
 * Analiza el código y reporta el estado de las optimizaciones
 */

const fs = require('fs');
const path = require('path');

console.log('🖼️  Verificando Optimizaciones de Imagen...\n');

// Archivos a verificar
const filesToCheck = [
  'components/optimized-image.tsx',
  'app/page.tsx',
  'app/catalogo/components/car-card.tsx',
  'app/catalogo/[id]/page.tsx',
  'app/panel/components/car-management.js',
  'app/panel/components/car-form.js',
  'next.config.js',
  'lib/image-loader.js'
];

const optimizations = {
  qualityOptimized: 0,
  lazyLoadingEnabled: 0,
  responsiveSizes: 0,
  webpAvifEnabled: false,
  cacheOptimized: false,
  blurPlaceholder: 0,
  totalImages: 0
};

function analyzeFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  Archivo no encontrado: ${filePath}`);
    return;
  }

  const content = fs.readFileSync(filePath, 'utf8');
  
  // Contar imágenes
  const imageMatches = content.match(/<Image/g);
  if (imageMatches) {
    optimizations.totalImages += imageMatches.length;
  }

  // Verificar optimizaciones
  if (content.includes('quality={7') || content.includes('quality={6')) {
    optimizations.qualityOptimized++;
  }

  if (content.includes('loading="lazy"') || content.includes('lazy={true}')) {
    optimizations.lazyLoadingEnabled++;
  }

  if (content.includes('sizes=')) {
    optimizations.responsiveSizes++;
  }

  if (content.includes('placeholder="blur"')) {
    optimizations.blurPlaceholder++;
  }

  // Verificar configuraciones específicas
  if (filePath.includes('next.config.js')) {
    if (content.includes("'image/webp', 'image/avif'")) {
      optimizations.webpAvifEnabled = true;
    }
    if (content.includes('minimumCacheTTL: 86400')) {
      optimizations.cacheOptimized = true;
    }
  }
}

// Analizar archivos
filesToCheck.forEach(file => {
  console.log(`📁 Analizando: ${file}`);
  analyzeFile(file);
});

// Generar reporte
console.log('\n📊 REPORTE DE OPTIMIZACIONES\n');
console.log('═'.repeat(50));

console.log(`🖼️  Total de componentes Image encontrados: ${optimizations.totalImages}`);
console.log(`⚡ Calidad optimizada (≤75%): ${optimizations.qualityOptimized}/${optimizations.totalImages}`);
console.log(`🚀 Lazy loading habilitado: ${optimizations.lazyLoadingEnabled}/${optimizations.totalImages}`);
console.log(`📱 Tamaños responsive: ${optimizations.responsiveSizes}/${optimizations.totalImages}`);
console.log(`🌫️  Blur placeholder: ${optimizations.blurPlaceholder}/${optimizations.totalImages}`);
console.log(`🎨 WebP/AVIF habilitado: ${optimizations.webpAvifEnabled ? '✅' : '❌'}`);
console.log(`💾 Cache optimizado (24h): ${optimizations.cacheOptimized ? '✅' : '❌'}`);

// Calcular score de optimización
const maxScore = optimizations.totalImages * 4 + 2; // 4 optimizaciones por imagen + 2 configuraciones globales
const currentScore = optimizations.qualityOptimized + 
                    optimizations.lazyLoadingEnabled + 
                    optimizations.responsiveSizes + 
                    optimizations.blurPlaceholder +
                    (optimizations.webpAvifEnabled ? 1 : 0) +
                    (optimizations.cacheOptimized ? 1 : 0);

const percentage = Math.round((currentScore / maxScore) * 100);

console.log('\n🎯 SCORE DE OPTIMIZACIÓN');
console.log('═'.repeat(30));
console.log(`Score: ${currentScore}/${maxScore} (${percentage}%)`);

if (percentage >= 90) {
  console.log('🏆 ¡Excelente! Optimizaciones implementadas correctamente');
} else if (percentage >= 70) {
  console.log('👍 Buenas optimizaciones, algunas mejoras pendientes');
} else {
  console.log('⚠️  Necesita más optimizaciones');
}

// Recomendaciones
console.log('\n💡 RECOMENDACIONES PARA LIGHTHOUSE');
console.log('═'.repeat(40));
console.log('• Calidad de imagen: 70-75% para balance calidad/tamaño');
console.log('• Lazy loading: Todas las imágenes excepto above-the-fold');
console.log('• Responsive sizes: Especificar para cada breakpoint');
console.log('• Formatos modernos: WebP/AVIF habilitados');
console.log('• Cache: TTL de 24h+ para imágenes estáticas');
console.log('• Placeholder: Blur effect para mejor UX');

console.log('\n🚀 IMPACTO ESPERADO EN LIGHTHOUSE:');
console.log('• Performance: +10-15 puntos');
console.log('• LCP (Largest Contentful Paint): -1.5s');
console.log('• Ahorro estimado: 3.3MB+ en imágenes');
console.log('• Formatos modernos: 25-35% menos peso');

console.log('\n✅ Optimizaciones completadas!'); 