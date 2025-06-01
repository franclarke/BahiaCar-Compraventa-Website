import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { status } = await req.json()
    const messageId = parseInt(params.id)

    if (isNaN(messageId)) {
      return NextResponse.json({ error: 'ID de mensaje inválido' }, { status: 400 })
    }

    if (!status || !['UNREAD', 'READ'].includes(status)) {
      return NextResponse.json({ error: 'Status inválido' }, { status: 400 })
    }

    const updatedMessage = await prisma.message.update({
      where: { id: messageId },
      data: { status }
    })

    return NextResponse.json({ success: true, data: updatedMessage }, { status: 200 })
  } catch (error: any) {
    console.error('Error al actualizar mensaje:', error)
    return NextResponse.json({ error: 'Error al actualizar mensaje' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const messageId = parseInt(params.id)

    if (isNaN(messageId)) {
      return NextResponse.json({ error: 'ID de mensaje inválido' }, { status: 400 })
    }

    await prisma.message.delete({
      where: { id: messageId }
    })

    return NextResponse.json({ success: true, message: 'Mensaje eliminado' }, { status: 200 })
  } catch (error: any) {
    console.error('Error al eliminar mensaje:', error)
    return NextResponse.json({ error: 'Error al eliminar mensaje' }, { status: 500 })
  }
} 