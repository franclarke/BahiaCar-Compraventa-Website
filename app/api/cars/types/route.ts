import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const types = await prisma.car.findMany({
      select: { type: true },
      distinct: ['type'],
      orderBy: { type: 'asc' }
    });

    return NextResponse.json(types.map(t => t.type));
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error al cargar los tipos" }, { status: 500 });
  }
} 