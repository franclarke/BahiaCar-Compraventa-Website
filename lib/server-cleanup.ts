import { prisma } from './prisma';

async function cleanup() {
  console.log('Cerrando conexiones...');
  
  try {
    await prisma.$disconnect();
    console.log('Conexiones cerradas correctamente');
    process.exit(0);
  } catch (error) {
    console.error('Error al cerrar conexiones:', error);
    process.exit(1);
  }
}

export function setupCleanup() {
  // Manejar señales de terminación
  process.on('SIGTERM', cleanup);
  process.on('SIGINT', cleanup);
  
  // Manejar excepciones no capturadas
  process.on('uncaughtException', (error) => {
    console.error('Excepción no capturada:', error);
    cleanup();
  });
  
  // Manejar rechazos de promesas no capturados
  process.on('unhandledRejection', (reason, promise) => {
    console.error('Rechazo de promesa no manejado:', reason);
    cleanup();
  });
} 