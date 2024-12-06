import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const brands = await prisma.car.findMany({
      select: { brand: true },
      distinct: ['brand'],
      orderBy: { brand: 'asc' }
    });

    return NextResponse.json(brands.map(b => b.brand));
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error al cargar las marcas" }, { status: 500 });
  }
} 