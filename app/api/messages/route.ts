import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { handleApiError, validateDatabaseConnection } from '@/lib/api-error-handler'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    // Validar conexión a la base de datos
    validateDatabaseConnection();
    
    const url = new URL(req.url)
    const status = url.searchParams.get('status')
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = parseInt(url.searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    const where = status ? { status: status as any } : {}

    const [messages, total] = await Promise.all([
      prisma.message.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.message.count({ where })
    ])

    return NextResponse.json({ 
      success: true, 
      data: messages,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    }, { status: 200 })
  } catch (error: any) {
    return handleApiError(error)
  }
} 