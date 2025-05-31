import { NextResponse } from 'next/server'
import { authenticateUser } from '@/lib/auth'

export async function POST(request) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username y contraseña son requeridos' },
        { status: 400 }
      )
    }

    const result = await authenticateUser(username, password)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 401 }
      )
    }

    // Crear respuesta con cookie httpOnly
    const response = NextResponse.json({
      success: true,
      user: result.user
    })

    // Configurar cookie de autenticación
    response.cookies.set('auth-token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 24 horas
      path: '/'
    })

    return response
  } catch (error) {
    console.error('Error en login:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
} 