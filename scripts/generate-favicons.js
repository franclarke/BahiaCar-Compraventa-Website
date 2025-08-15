#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🎨 Generador de Favicons para SYM Automotores\n');

// Leer el logo.svg original
const logoPath = path.join(process.cwd(), 'public', 'logo.svg');
const logoContent = fs.readFileSync(logoPath, 'utf8');

console.log('✅ Logo.svg encontrado');

// Generar diferentes versiones del favicon
const faviconSizes = [
  { size: 16, filename: 'favicon-16x16.svg' },
  { size: 32, filename: 'favicon-32x32.svg' },
  { size: 180, filename: 'apple-touch-icon-180x180.svg' },
  { size: 192, filename: 'android-chrome-192x192.svg' },
  { size: 512, filename: 'android-chrome-512x512.svg' }
];

faviconSizes.forEach(({ size, filename }) => {
  const modifiedSvg = logoContent.replace(/width="48" height="48"/, `width="${size}" height="${size}"`);
  const outputPath = path.join(process.cwd(), 'public', filename);
  
  fs.writeFileSync(outputPath, modifiedSvg);
  console.log(`✅ Generado: ${filename} (${size}x${size})`);
});

// Crear un README con instrucciones para generar formatos PNG/ICO
const readmeContent = `# 🎨 Favicons de SYM Automotores

## Archivos Generados

Los siguientes archivos SVG han sido generados automáticamente:

${faviconSizes.map(({ size, filename }) => `- \`${filename}\` (${size}x${size}px)`).join('\n')}

## Conversión a PNG/ICO

Para generar las versiones PNG e ICO requeridas, puedes usar las siguientes herramientas online:

### Opción 1: Convertir manualmente
1. Ve a https://convertio.co/svg-png/ o https://cloudconvert.com/svg-to-png
2. Sube los archivos SVG generados
3. Descarga los PNG resultantes
4. Para ICO: https://convertio.co/png-ico/

### Opción 2: Usar CLI (si tienes ImageMagick instalado)
\`\`\`bash
# Instalar ImageMagick primero
# Ubuntu/Debian: sudo apt-get install imagemagick
# macOS: brew install imagemagick
# Windows: https://imagemagick.org/script/download.php#windows

# Convertir SVG a PNG
convert public/favicon-32x32.svg public/favicon-32x32.png
convert public/apple-touch-icon-180x180.svg public/apple-touch-icon.png
convert public/android-chrome-192x192.svg public/android-chrome-192x192.png
convert public/android-chrome-512x512.svg public/android-chrome-512x512.png

# Generar favicon.ico (múltiples tamaños en un archivo)
convert public/favicon-16x16.svg public/favicon-32x32.svg public/favicon.ico
\`\`\`

### Opción 3: Generador automático de favicons
- https://realfavicongenerator.net/
- https://favicon.io/
- https://favicomatic.com/

## Archivos Finales Requeridos

Una vez convertidos, asegúrate de tener estos archivos en \`/public\`:

- \`favicon.ico\` (16x16, 32x32 combinados)
- \`apple-touch-icon.png\` (180x180)
- \`android-chrome-192x192.png\` (192x192)
- \`android-chrome-512x512.png\` (512x512)
- \`logo.svg\` (original para navegadores modernos)

## Verificar Implementación

1. Abre tu sitio en el navegador
2. Verifica que aparezca el favicon en la pestaña
3. Agregar a favoritos y verificar el ícono
4. En dispositivos móviles, agregar a pantalla de inicio

## Prueba de Favicons

Puedes probar tus favicons en:
- https://realfavicongenerator.net/favicon_checker
- Chrome DevTools > Application > Manifest
- Firefox > Developer Tools > Application > Manifest
`;

fs.writeFileSync(path.join(process.cwd(), 'FAVICON-README.md'), readmeContent);

console.log('\n📋 Generado FAVICON-README.md con instrucciones de conversión');

console.log('\n🎉 Generación de favicons completada!');
console.log('\n📝 Próximos pasos:');
console.log('1. Convierte los archivos SVG a PNG/ICO usando las herramientas mencionadas');
console.log('2. Reemplaza los archivos temporales con las versiones PNG/ICO');
console.log('3. Prueba el sitio para verificar que los favicons funcionen correctamente');
console.log('\n💡 Tip: Usa https://realfavicongenerator.net/ para una conversión automática'); 