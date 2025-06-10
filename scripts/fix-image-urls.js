const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function fixImageUrls() {
  try {
    console.log('🔧 Iniciando corrección de URLs de imágenes...')

    // Obtener todos los autos con imágenes
    const cars = await prisma.car.findMany({
      where: {
        images: {
          isEmpty: false
        }
      },
      select: {
        id: true,
        brand: true,
        model: true,
        images: true
      }
    })

    console.log(`📊 Encontrados ${cars.length} autos con imágenes`)

    let fixedCount = 0

    for (const car of cars) {
      let needsUpdate = false
      const fixedImages = car.images.map(imageUrl => {
        // Si la URL no contiene el dominio de Supabase, podría necesitar corrección
        if (!imageUrl.includes('supabase')) {
          console.log(`⚠️  URL sospechosa en ${car.brand} ${car.model}: ${imageUrl}`)
          
          // Si es solo un path, construir la URL completa
          if (imageUrl.startsWith('cars/')) {
            const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
            if (supabaseUrl) {
              const fixedUrl = `${supabaseUrl}/storage/v1/object/public/car-images/${imageUrl}`
              console.log(`✅ Corrigiendo a: ${fixedUrl}`)
              needsUpdate = true
              return fixedUrl
            }
          }
        }
        return imageUrl
      })

      if (needsUpdate) {
        await prisma.car.update({
          where: { id: car.id },
          data: { images: fixedImages }
        })
        fixedCount++
        console.log(`✅ Actualizado ${car.brand} ${car.model}`)
      }
    }

    console.log(`\n🎉 Proceso completado. ${fixedCount} autos actualizados.`)

  } catch (error) {
    console.error('❌ Error durante la corrección:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Ejecutar si el script se ejecuta directamente
if (require.main === module) {
  fixImageUrls()
    .catch((error) => {
      console.error(error)
      process.exit(1)
    })
}

module.exports = { fixImageUrls } 