import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const runtime = 'edge'
export const revalidate = 0

export async function GET() {
  const timestamp = new Date().toISOString()
  
  try {
    // Test database connection
    const dbStatus = await testDatabaseConnection()
    
    // Test environment variables
    const envStatus = testEnvironmentVariables()
    
    // Test Supabase connection
    const supabaseStatus = testSupabaseConfig()

    const health = {
      status: 'healthy',
      timestamp,
      version: '1.0.0',
      environment: process.env.NODE_ENV,
      checks: {
        database: dbStatus,
        environment: envStatus,
        supabase: supabaseStatus,
      },
      uptime: process.uptime?.() || 'unknown',
      memoryUsage: process.memoryUsage?.() || 'unknown',
    }

    // Si algún check falla, marcar como unhealthy
    const isHealthy = Object.values(health.checks).every(check => check.status === 'ok')
    if (!isHealthy) {
      health.status = 'unhealthy'
    }

    return NextResponse.json(health, { 
      status: isHealthy ? 200 : 503,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })
  } catch (error) {
    console.error('Health check failed:', error)
    
    return NextResponse.json({
      status: 'error',
      timestamp,
      error: error instanceof Error ? error.message : 'Unknown error',
      checks: {
        database: { status: 'error', message: 'Connection failed' },
        environment: testEnvironmentVariables(),
        supabase: testSupabaseConfig(),
      }
    }, { 
      status: 503,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })
  }
}

async function testDatabaseConnection() {
  try {
    // Test simple query
    await prisma.$queryRaw`SELECT 1 as test`
    return { status: 'ok', message: 'Database connected' }
  } catch (error) {
    console.error('Database connection error:', error)
    return { 
      status: 'error', 
      message: error instanceof Error ? error.message : 'Database connection failed' 
    }
  }
}

function testEnvironmentVariables() {
  const requiredVars = [
    'DATABASE_URL',
    'DIRECT_URL',
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY'
  ]

  const missing = requiredVars.filter(varName => !process.env[varName])
  
  if (missing.length > 0) {
    return {
      status: 'error',
      message: `Missing environment variables: ${missing.join(', ')}`
    }
  }

  return { status: 'ok', message: 'All required environment variables present' }
}

function testSupabaseConfig() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (!supabaseUrl || !supabaseKey) {
    return {
      status: 'error',
      message: 'Supabase configuration missing'
    }
  }

  // Validate URL format
  try {
    new URL(supabaseUrl)
    return { status: 'ok', message: 'Supabase configuration valid' }
  } catch {
    return {
      status: 'error',
      message: 'Invalid Supabase URL format'
    }
  }
} 