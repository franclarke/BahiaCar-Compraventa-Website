import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

// GET - Obtener todas las opciones por categoría
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')

    if (!category) {
      return NextResponse.json(
        { error: 'Se requiere especificar una categoría' },
        { status: 400 }
      )
    }

    // Validar que la categoría sea válida
    const validCategories = ['TRANSMISSION', 'TYPE', 'FUEL_TYPE']
    if (!validCategories.includes(category)) {
      return NextResponse.json(
        { error: 'Categoría inválida' },
        { status: 400 }
      )
    }

    // Obtener opciones de la tabla CarOption
    const allOptions = await prisma.carOption.findMany({
      where: { category: category as any },
      orderBy: [
        { isDefault: 'desc' }, // Opciones por defecto primero
        { value: 'asc' }       // Luego alfabéticamente
      ]
    })

    // Obtener valores únicos que están realmente en uso en los autos
    const fieldName = category === 'TRANSMISSION' ? 'transmission' : 
                     category === 'TYPE' ? 'type' : 'fuelType'
    
    const carsWithValues = await prisma.car.findMany({
      select: { [fieldName]: true },
      distinct: [fieldName]
    })

    const valuesInUse = new Set<string>(
      carsWithValues
        .map(car => car[fieldName as keyof typeof car] as string)
        .filter(Boolean)
    )

    // Filtrar opciones: mostrar por defecto + las que están en uso
    const filteredOptions = allOptions.filter(option => 
      option.isDefault || valuesInUse.has(option.value)
    )

    return NextResponse.json(filteredOptions)
  } catch (error) {
    console.error('Error obteniendo opciones:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// POST - Crear nueva opción (solo para administradores)
export async function POST(request: Request) {
  try {
    // Verificar autenticación
    const cookieHeader = request.headers.get('cookie')
    
    if (!cookieHeader) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const authCookie = cookieHeader.split(';')
      .find(cookie => cookie.trim().startsWith('auth-token='))
    
    if (!authCookie) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const token = authCookie.split('=')[1]
    const result = verifyToken(token)
    
    if (!result.success) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { category, value } = body

    if (!category || !value) {
      return NextResponse.json(
        { error: 'Se requieren categoría y valor' },
        { status: 400 }
      )
    }

    // Validar que la categoría sea válida
    const validCategories = ['TRANSMISSION', 'TYPE', 'FUEL_TYPE']
    if (!validCategories.includes(category)) {
      return NextResponse.json(
        { error: 'Categoría inválida' },
        { status: 400 }
      )
    }

    // Verificar si la opción ya existe
    const existingOption = await prisma.carOption.findFirst({
      where: {
        category: category as any,
        value: value.trim()
      }
    })

    if (existingOption) {
      return NextResponse.json(
        { error: 'Esta opción ya existe' },
        { status: 409 }
      )
    }

    // Crear la nueva opción
    const newOption = await prisma.carOption.create({
      data: {
        category: category as any,
        value: value.trim(),
        isDefault: false
      }
    })

    return NextResponse.json(newOption, { status: 201 })
  } catch (error) {
    console.error('Error creando opción:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
} 