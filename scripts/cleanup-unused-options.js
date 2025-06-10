const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function cleanupUnusedOptions() {
  try {
    console.log('🧹 Iniciando limpieza de opciones no utilizadas...')

    // Obtener todas las opciones personalizadas (no por defecto)
    const customOptions = await prisma.carOption.findMany({
      where: { isDefault: false }
    })

    console.log(`📊 Encontradas ${customOptions.length} opciones personalizadas`)

    if (customOptions.length === 0) {
      console.log('✅ No hay opciones personalizadas para limpiar')
      return
    }

    let deletedCount = 0

    for (const option of customOptions) {
      const fieldName = option.category === 'TRANSMISSION' ? 'transmission' : 
                       option.category === 'TYPE' ? 'type' : 'fuelType'
      
      // Verificar si hay autos que usan esta opción
      const carsUsingOption = await prisma.car.count({
        where: { [fieldName]: option.value }
      })

      if (carsUsingOption === 0) {
        console.log(`🗑️  Eliminando opción no utilizada: "${option.value}" (${option.category})`)
        
        await prisma.carOption.delete({
          where: { id: option.id }
        })
        
        deletedCount++
      } else {
        console.log(`✅ Manteniendo opción en uso: "${option.value}" (${carsUsingOption} autos)`)
      }
    }

    console.log(`\n🎉 Limpieza completada. ${deletedCount} opciones eliminadas.`)

    // Mostrar estadísticas finales
    const finalCounts = await Promise.all([
      prisma.carOption.count({ where: { category: 'TRANSMISSION' } }),
      prisma.carOption.count({ where: { category: 'TYPE' } }),
      prisma.carOption.count({ where: { category: 'FUEL_TYPE' } }),
    ])

    console.log(`📊 Opciones restantes:`)
    console.log(`   - Transmisiones: ${finalCounts[0]}`)
    console.log(`   - Tipos de vehículo: ${finalCounts[1]}`)
    console.log(`   - Tipos de combustible: ${finalCounts[2]}`)

  } catch (error) {
    console.error('❌ Error durante la limpieza:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Ejecutar si el script se ejecuta directamente
if (require.main === module) {
  cleanupUnusedOptions()
    .catch((error) => {
      console.error(error)
      process.exit(1)
    })
}

module.exports = { cleanupUnusedOptions } 