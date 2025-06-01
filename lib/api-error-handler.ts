import { NextResponse } from 'next/server'

export interface ApiError {
  message: string
  status: number
  code?: string
}

export function handleApiError(error: unknown): NextResponse {
  console.error('API Error:', error)

  // Error de base de datos
  if (error instanceof Error) {
    // Errores de Prisma
    if (error.message.includes('PrismaClientKnownRequestError')) {
      return NextResponse.json(
        { 
          error: 'Error de base de datos',
          message: 'No se pudo conectar a la base de datos',
          code: 'DATABASE_ERROR'
        },
        { status: 500 }
      )
    }

    // Errores de conexión
    if (error.message.includes('ECONNREFUSED') || error.message.includes('timeout')) {
      return NextResponse.json(
        {
          error: 'Error de conexión',
          message: 'No se pudo establecer conexión con la base de datos',
          code: 'CONNECTION_ERROR'
        },
        { status: 503 }
      )
    }

    // Variables de entorno faltantes
    if (error.message.includes('Missing') || error.message.includes('environment')) {
      return NextResponse.json(
        {
          error: 'Error de configuración',
          message: 'Variables de entorno no configuradas correctamente',
          code: 'CONFIG_ERROR'
        },
        { status: 500 }
      )
    }

    // Error genérico con mensaje
    return NextResponse.json(
      {
        error: 'Error interno del servidor',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Ha ocurrido un error interno',
        code: 'INTERNAL_ERROR'
      },
      { status: 500 }
    )
  }

  // Error desconocido
  return NextResponse.json(
    {
      error: 'Error desconocido',
      message: 'Ha ocurrido un error inesperado',
      code: 'UNKNOWN_ERROR'
    },
    { status: 500 }
  )
}

export function validateDatabaseConnection() {
  const requiredEnvVars = [
    'DATABASE_URL',
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY'
  ]

  const missingVars = requiredEnvVars.filter(varName => !process.env[varName])

  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`)
  }
} 