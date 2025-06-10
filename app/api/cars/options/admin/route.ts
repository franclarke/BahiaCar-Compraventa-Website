import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

// GET - Obtener todas las opciones (incluso las no utilizadas) para administradores
export async function GET(request: Request) {
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

    // Obtener TODAS las opciones para administradores
    const options = await prisma.carOption.findMany({
      where: { category: category as any },
      orderBy: [
        { isDefault: 'desc' }, // Opciones por defecto primero
        { value: 'asc' }       // Luego alfabéticamente
      ]
    })

    return NextResponse.json(options)
  } catch (error) {
    console.error('Error obteniendo opciones admin:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
} 