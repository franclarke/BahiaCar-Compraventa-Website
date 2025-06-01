import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { CarStatus } from "@prisma/client";
import { handleApiError, validateDatabaseConnection } from "@/lib/api-error-handler";

interface FilterParams {
  status?: CarStatus;
  type?: string;
  brand?: string;
  model?: string;
  transmission?: string;
  fuelType?: string;
  minPrice?: number;
  maxPrice?: number;
  minMileage?: number;
  maxMileage?: number;
  minYear?: number;
  maxYear?: number;
  vendido?: boolean;
}

export async function POST(req: Request) {
  try {
    // Validar conexión a la base de datos
    validateDatabaseConnection();
    
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
    if (body.fuelType) filters.fuelType = body.fuelType;
    if (typeof body.vendido === 'boolean') filters.vendido = body.vendido;

    // Consulta a la base de datos con filtros adicionales
    const cars = await prisma.car.findMany({
      where: {
        ...filters,
        ...(body.minYear || body.maxYear ? {
          year: {
            gte: body.minYear,
            lte: body.maxYear,
          }
        } : {}),
        ...(body.minMileage || body.maxMileage ? {
          mileage: {
            gte: body.minMileage,
            lte: body.maxMileage,
          }
        } : {}),
        ...(body.minPrice || body.maxPrice ? {
          price: {
            gte: body.minPrice,
            lte: body.maxPrice,
          }
        } : {}),
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(cars);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function GET() {
  try {
    // Validar conexión a la base de datos
    validateDatabaseConnection();
    
    const cars = await prisma.car.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(cars);
  } catch (error) {
    return handleApiError(error);
  }
}