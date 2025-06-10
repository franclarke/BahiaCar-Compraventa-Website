import { prisma } from './prisma';

let isShuttingDown = false;
let cleanupSetup = false;

async function cleanup(exitCode: number = 0) {
  if (isShuttingDown) return;
  isShuttingDown = true;

  console.log('Cerrando conexiones...');
  
  try {
    await prisma.$disconnect();
    console.log('Conexiones cerradas correctamente');
    process.exit(exitCode);
  } catch (error) {
    console.error('Error al cerrar conexiones:', error);
    process.exit(1);
  }
}

export function setupCleanup() {
  // Evitar configurar múltiples listeners
  if (cleanupSetup) return;
  cleanupSetup = true;

  // Establecer un límite más alto para los listeners de eventos
  process.setMaxListeners(20);
  
  // Manejar señales de terminación
  process.on('SIGTERM', () => cleanup(0));
  process.on('SIGINT', () => cleanup(0));
  
  // Manejar excepciones no capturadas
  process.on('uncaughtException', (error) => {
    console.error('Excepción no capturada:', error);
    cleanup(1);
  });
  
  // Manejar rechazos de promesas no capturados
  process.on('unhandledRejection', (reason, promise) => {
    console.error('Rechazo de promesa no manejado:', reason);
    cleanup(1);
  });

  // Limpiar recursos antes de salir
  process.on('exit', (code) => {
    if (!isShuttingDown) {
      console.log(`Proceso terminando con código ${code}`);
      // No llamamos a cleanup() aquí porque process.exit() no funcionará dentro de 'exit'
      prisma.$disconnect().catch(() => {});
    }
  });
} 