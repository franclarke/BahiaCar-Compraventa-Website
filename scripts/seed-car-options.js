const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const defaultOptions = [
  // Transmissions
  { category: 'TRANSMISSION', value: 'Manual', isDefault: true },
  { category: 'TRANSMISSION', value: 'Automática', isDefault: true },
  { category: 'TRANSMISSION', value: 'CVT', isDefault: false },

  // Vehicle Types
  { category: 'TYPE', value: 'Sedán', isDefault: true },
  { category: 'TYPE', value: 'SUV', isDefault: true },
  { category: 'TYPE', value: 'Hatchback', isDefault: true },
  { category: 'TYPE', value: 'Pickup', isDefault: true },
  { category: 'TYPE', value: 'Coupé', isDefault: false },
  { category: 'TYPE', value: 'Convertible', isDefault: false },
  { category: 'TYPE', value: 'Wagon', isDefault: false },

  // Fuel Types
  { category: 'FUEL_TYPE', value: 'Nafta', isDefault: true },
  { category: 'FUEL_TYPE', value: 'Diésel', isDefault: true },
  { category: 'FUEL_TYPE', value: 'GNC', isDefault: false },
  { category: 'FUEL_TYPE', value: 'Híbrido', isDefault: false },
  { category: 'FUEL_TYPE', value: 'Eléctrico', isDefault: false },
]

async function seedCarOptions() {
  try {
    console.log('🌱 Iniciando el seeding de opciones de autos...')

    // Insertar opciones por defecto, ignorando duplicados
    for (const option of defaultOptions) {
      await prisma.carOption.upsert({
        where: { value: option.value },
        update: {}, // No actualizar si ya existe
        create: option,
      })
    }

    console.log('✅ Opciones de autos insertadas correctamente')

    // Mostrar estadísticas
    const counts = await Promise.all([
      prisma.carOption.count({ where: { category: 'TRANSMISSION' } }),
      prisma.carOption.count({ where: { category: 'TYPE' } }),
      prisma.carOption.count({ where: { category: 'FUEL_TYPE' } }),
    ])

    console.log(`📊 Estadísticas:`)
    console.log(`   - Transmisiones: ${counts[0]}`)
    console.log(`   - Tipos de vehículo: ${counts[1]}`)
    console.log(`   - Tipos de combustible: ${counts[2]}`)

  } catch (error) {
    console.error('❌ Error durante el seeding:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Ejecutar el seeding si el script se ejecuta directamente
if (require.main === module) {
  seedCarOptions()
    .catch((error) => {
      console.error(error)
      process.exit(1)
    })
}

module.exports = { seedCarOptions } 