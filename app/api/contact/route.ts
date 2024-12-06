import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
  try {
    const { name, email, message } = await req.json()

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 })
    }

    const createdMessage = await prisma.message.create({
      data: {
        name,
        email,
        message,
        status: 'UNREAD' // Puedes asignar el estado por defecto si así lo deseas
      }
    })

    return NextResponse.json({ success: true, data: createdMessage }, { status: 200 })
  } catch (error: any) {
    console.error(error)
    return NextResponse.json({ error: 'Error al guardar el mensaje en la base de datos' }, { status: 500 })
  }
}
