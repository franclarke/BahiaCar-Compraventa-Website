import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Verificar variables de entorno
    const envCheck = {
      DATABASE_URL: !!process.env.DATABASE_URL,
      NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    }

    // Verificar conexión a la base de datos
    const dbCheck = await prisma.$queryRaw`SELECT 1 as connected`
    
    // Contar registros en tablas principales
    const counts = await Promise.all([
      prisma.car.count(),
      prisma.message.count(),
      prisma.sellRequest.count(),
    ])

    return NextResponse.json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      database: {
        connected: !!dbCheck,
        counts: {
          cars: counts[0],
          messages: counts[1],
          sellRequests: counts[2],
        }
      },
      envVariables: envCheck,
      missingEnvVars: Object.entries(envCheck)
        .filter(([_, value]) => !value)
        .map(([key]) => key)
    })
  } catch (error) {
    console.error('Health check failed:', error)
    
    return NextResponse.json({
      status: 'ERROR',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
      environment: process.env.NODE_ENV,
      database: {
        connected: false
      }
    }, { status: 500 })
  }
} 