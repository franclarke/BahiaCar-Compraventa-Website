import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { brand } = await req.json();
    if (!brand) return NextResponse.json([]);

    const models = await prisma.car.findMany({
      where: { brand },
      select: { model: true },
      distinct: ['model'],
      orderBy: { model: 'asc' }
    });

    return NextResponse.json(models.map(m => m.model));
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error al cargar los modelos" }, { status: 500 });
  }
} 