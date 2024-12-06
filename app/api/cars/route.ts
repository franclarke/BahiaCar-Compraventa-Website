import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { CarStatus } from "@prisma/client";

interface FilterParams {
  status?: CarStatus;
  type?: string;
  brand?: string;
  model?: string;
  transmission?: string;
  minPrice?: number;
  maxPrice?: number;
}

export async function POST(req: Request) {
  try {
    const body = await req.json() as FilterParams;

    // Construcción de los filtros básicos
    const filters: any = {};

    if (body.status && Object.values(CarStatus).includes(body.status)) {
      filters.status = body.status;
    }
    if (body.type) filters.type = body.type;
    if (body.brand) filters.brand = body.brand;
    if (body.model) filters.model = body.model;
    if (body.transmission) filters.transmission = body.transmission;

    // Consulta a la base de datos
    const cars = await prisma.car.findMany({
      where: filters,
      orderBy: { createdAt: 'desc' }
    });

    // Filtrado de precios si es necesario
    if (body.minPrice || body.maxPrice) {
      return NextResponse.json(cars.filter(car => {
        const price = car.price;
        const minOk = !body.minPrice || price >= body.minPrice;
        const maxOk = !body.maxPrice || price <= body.maxPrice;
        return minOk && maxOk;
      }));
    }

    return NextResponse.json(cars);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error al cargar los datos" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const cars = await prisma.car.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(cars);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error al cargar los datos" }, { status: 500 });
  }
}