import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: "ID inválido" },
        { status: 400 }
      );
    }

    const car = await prisma.car.findUnique({
      where: { id }
    });

    if (!car) {
      return NextResponse.json(
        { error: "Auto no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(car);
  } catch (error) {
    console.error("Error al obtener el auto:", error);
    return NextResponse.json(
      { error: "Error al obtener el auto" },
      { status: 500 }
    );
  }
} 