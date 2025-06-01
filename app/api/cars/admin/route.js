import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'
import { uploadMultipleCarImages, deleteMultipleCarImages } from '@/lib/storage'

export const dynamic = 'force-dynamic'

// Verificar autenticación
async function verifyAuth(request) {
  const cookieHeader = request.headers.get('cookie')
  
  if (!cookieHeader) {
    return { isAuthenticated: false, user: null }
  }

  const authCookie = cookieHeader.split(';')
    .find(cookie => cookie.trim().startsWith('auth-token='))
  
  if (!authCookie) {
    return { isAuthenticated: false, user: null }
  }

  const token = authCookie.split('=')[1]
  const result = verifyToken(token)
  
  return {
    isAuthenticated: result.success,
    user: result.success ? result.user : null
  }
}

// GET - Obtener todos los autos para administración
export async function GET(request) {
  try {
    const auth = await verifyAuth(request)
    if (!auth.isAuthenticated) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const brand = searchParams.get('brand')
    const model = searchParams.get('model')
    const status = searchParams.get('status')
    const vendido = searchParams.get('vendido')

    const where = {}

    if (search) {
      where.OR = [
        { brand: { contains: search, mode: 'insensitive' } },
        { model: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (brand) where.brand = brand
    if (model) where.model = model
    if (status) where.status = status
    if (vendido !== null) where.vendido = vendido === 'true'

    const cars = await prisma.car.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(cars)
  } catch (error) {
    console.error('Error obteniendo autos:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

// POST - Crear nuevo auto
export async function POST(request) {
  try {
    const auth = await verifyAuth(request)
    if (!auth.isAuthenticated) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const formData = await request.formData()
    
    const carData = {
      brand: formData.get('brand'),
      model: formData.get('model'),
      year: parseInt(formData.get('year')),
      status: formData.get('status'),
      mileage: parseInt(formData.get('mileage')),
      price: parseFloat(formData.get('price')),
      transmission: formData.get('transmission'),
      type: formData.get('type'),
      fuelType: formData.get('fuelType'),
      description: formData.get('description'),
      vendido: formData.get('vendido') === 'true'
    }

    // Validar datos requeridos
    if (!carData.brand || !carData.model || !carData.year) {
      return NextResponse.json({ error: 'Faltan datos requeridos' }, { status: 400 })
    }

    // Crear el auto primero
    const car = await prisma.car.create({
      data: {
        ...carData,
        images: [] // Inicialmente sin imágenes
      }
    })

    // Procesar imágenes si las hay
    const imageFiles = formData.getAll('images')
    let imageUrls = []

    if (imageFiles.length > 0 && imageFiles[0].size > 0) {
      const uploadResult = await uploadMultipleCarImages(imageFiles, car.id)
      
      if (uploadResult.success) {
        imageUrls = uploadResult.urls
        
        // Actualizar el auto con las URLs de las imágenes
        await prisma.car.update({
          where: { id: car.id },
          data: { images: imageUrls }
        })
      }
    }

    const updatedCar = await prisma.car.findUnique({
      where: { id: car.id }
    })

    return NextResponse.json(updatedCar, { status: 201 })
  } catch (error) {
    console.error('Error creando auto:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

// PUT - Actualizar auto
export async function PUT(request) {
  try {
    const auth = await verifyAuth(request)
    if (!auth.isAuthenticated) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const formData = await request.formData()
    const carId = parseInt(formData.get('id'))

    if (!carId) {
      return NextResponse.json({ error: 'ID de auto requerido' }, { status: 400 })
    }

    const carData = {
      brand: formData.get('brand'),
      model: formData.get('model'),
      year: parseInt(formData.get('year')),
      status: formData.get('status'),
      mileage: parseInt(formData.get('mileage')),
      price: parseFloat(formData.get('price')),
      transmission: formData.get('transmission'),
      type: formData.get('type'),
      fuelType: formData.get('fuelType'),
      description: formData.get('description'),
      vendido: formData.get('vendido') === 'true'
    }

    // Obtener auto actual
    const currentCar = await prisma.car.findUnique({
      where: { id: carId }
    })

    if (!currentCar) {
      return NextResponse.json({ error: 'Auto no encontrado' }, { status: 404 })
    }

    let imageUrls = currentCar.images

    // Procesar nuevas imágenes si las hay
    const newImageFiles = formData.getAll('newImages')
    const removeImages = formData.get('removeImages')
    
    if (removeImages === 'true') {
      // Eliminar imágenes existentes del storage
      if (currentCar.images.length > 0) {
        await deleteMultipleCarImages(currentCar.images)
      }
      imageUrls = []
    }

    if (newImageFiles.length > 0 && newImageFiles[0].size > 0) {
      const uploadResult = await uploadMultipleCarImages(newImageFiles, carId)
      
      if (uploadResult.success) {
        if (removeImages === 'true') {
          imageUrls = uploadResult.urls
        } else {
          imageUrls = [...imageUrls, ...uploadResult.urls]
        }
      }
    }

    // Actualizar el auto
    const updatedCar = await prisma.car.update({
      where: { id: carId },
      data: {
        ...carData,
        images: imageUrls
      }
    })

    return NextResponse.json(updatedCar)
  } catch (error) {
    console.error('Error actualizando auto:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

// DELETE - Eliminar auto
export async function DELETE(request) {
  try {
    const auth = await verifyAuth(request)
    if (!auth.isAuthenticated) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const carId = parseInt(searchParams.get('id'))

    if (!carId) {
      return NextResponse.json({ error: 'ID de auto requerido' }, { status: 400 })
    }

    // Obtener auto para eliminar imágenes
    const car = await prisma.car.findUnique({
      where: { id: carId }
    })

    if (!car) {
      return NextResponse.json({ error: 'Auto no encontrado' }, { status: 404 })
    }

    // Eliminar imágenes del storage
    if (car.images.length > 0) {
      await deleteMultipleCarImages(car.images)
    }

    // Eliminar auto de la base de datos
    await prisma.car.delete({
      where: { id: carId }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error eliminando auto:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
} 