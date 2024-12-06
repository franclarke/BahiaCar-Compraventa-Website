import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Falta el campo email' }, { status: 400 });
    }

    const createdSubscription = await prisma.subscription.create({
      data: { email },
    });

    return NextResponse.json({ success: true, data: createdSubscription }, { status: 200 });
  } catch (error: any) {
    console.error('Error al crear la suscripción:', error);
    return NextResponse.json({ error: 'Error al guardar en la base de datos' }, { status: 500 });
  }
}
