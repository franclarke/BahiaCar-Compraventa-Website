#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Iniciando aplicación en modo producción...');

// Configurar variables de entorno para producción
process.env.NODE_ENV = 'production';

// Verificar que el build existe
const fs = require('fs');
const buildPath = path.join(__dirname, '..', '.next');

if (!fs.existsSync(buildPath)) {
  console.error('❌ Error: No se encontró el build de producción.');
  console.log('💡 Ejecuta "npm run build" primero.');
  process.exit(1);
}

console.log('✅ Build de producción encontrado');
console.log('🌐 Iniciando servidor...');

// Iniciar el servidor de Next.js
const server = spawn('npm', ['start'], {
  stdio: 'inherit',
  shell: true,
  cwd: path.join(__dirname, '..')
});

server.on('error', (error) => {
  console.error('❌ Error iniciando servidor:', error);
  process.exit(1);
});

server.on('close', (code) => {
  console.log(`🛑 Servidor terminado con código ${code}`);
  process.exit(code);
});

// Manejar señales de terminación
process.on('SIGINT', () => {
  console.log('\n🛑 Cerrando servidor...');
  server.kill('SIGINT');
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Cerrando servidor...');
  server.kill('SIGTERM');
}); 