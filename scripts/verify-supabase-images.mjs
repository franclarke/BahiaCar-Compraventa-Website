import { PrismaClient } from '@prisma/client'
import { verifyBucketConfiguration } from '../lib/storage.js'

const prisma = new PrismaClient()

async function verifySupabaseImages() {
  try {
    console.log('🔍 Verificando configuración de Supabase...')

    // Verificar configuración del bucket
    const bucketOk = await verifyBucketConfiguration()
    console.log(`📦 Bucket configurado: ${bucketOk ? '✅' : '❌'}`)

    // Obtener algunos autos con imágenes
    const carsWithImages = await prisma.car.findMany({
      where: {
        images: {
          isEmpty: false
        }
      },
      take: 5,
      select: {
        id: true,
        brand: true,
        model: true,
        images: true
      }
    })

    console.log(`\n🚗 Encontrados ${carsWithImages.length} autos con imágenes`)

    if (carsWithImages.length === 0) {
      console.log('ℹ️  No hay autos con imágenes para verificar')
      return
    }

    // Verificar URLs de imágenes
    for (const car of carsWithImages) {
      console.log(`\n🔍 Verificando ${car.brand} ${car.model} (ID: ${car.id})`)
      console.log(`   Imágenes almacenadas: ${car.images.length}`)
      
      for (let i = 0; i < car.images.length; i++) {
        const imageUrl = car.images[i]
        console.log(`   Imagen ${i + 1}: ${imageUrl}`)
        
        // Verificar si la URL es accesible
        try {
          const response = await fetch(imageUrl, { method: 'HEAD' })
          console.log(`   Estado: ${response.status} ${response.ok ? '✅' : '❌'}`)
        } catch (error) {
          console.log(`   Error: ❌ ${error.message}`)
        }
      }
    }

    // Verificar variables de entorno
    console.log('\n🔧 Variables de entorno:')
    console.log(`   NEXT_PUBLIC_SUPABASE_URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅' : '❌'}`)
    console.log(`   NEXT_PUBLIC_SUPABASE_ANON_KEY: ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅' : '❌'}`)
    console.log(`   SUPABASE_SERVICE_ROLE_KEY: ${process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅' : '❌'}`)

  } catch (error) {
    console.error('❌ Error durante la verificación:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Ejecutar el script
verifySupabaseImages()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  }) 