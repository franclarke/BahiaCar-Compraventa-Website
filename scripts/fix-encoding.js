const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const corrections = {
  'AutomÃ¡tica': 'Automática',
  'SedÃ¡n': 'Sedán',
  'CoupÃ©': 'Coupé',
  'DiÃ©sel': 'Diésel',
  'HÃ­brido': 'Híbrido',
  'ElÃ©ctrico': 'Eléctrico'
}

async function fixEncoding() {
  try {
    console.log('🔧 Corrigiendo problemas de codificación...')

    // Obtener todas las opciones
    const options = await prisma.carOption.findMany()

    console.log('\n📋 Opciones actuales:')
    options.forEach(option => {
      console.log(`  ID: ${option.id}, Valor: "${option.value}", Categoría: ${option.category}`)
    })

    let fixedCount = 0

    for (const option of options) {
      const correctedValue = corrections[option.value]
      
      if (correctedValue) {
        console.log(`\n🔄 Corrigiendo: "${option.value}" → "${correctedValue}"`)
        
        try {
          await prisma.carOption.update({
            where: { id: option.id },
            data: { value: correctedValue }
          })
          
          fixedCount++
          console.log(`✅ Corregido exitosamente`)
        } catch (error) {
          console.log(`❌ Error al corregir: ${error.message}`)
        }
      }
    }

    console.log(`\n✅ Proceso completado. ${fixedCount} opciones corregidas.`)

  } catch (error) {
    console.error('❌ Error durante la corrección:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Ejecutar si el script se ejecuta directamente
if (require.main === module) {
  fixEncoding()
    .catch((error) => {
      console.error(error)
      process.exit(1)
    })
}

module.exports = { fixEncoding } 