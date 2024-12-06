import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient, CarStatus } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
  try {
    const { name, phone, email, brand, model, year, condition, mileage, price, description } = await req.json()

    // Validación simple
    if (!name || !phone || !email || !brand || !model || !year || !condition || !mileage || !price || !description) {
      return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 })
    }

    // Convertir valores numéricos
    const parsedYear = parseInt(year, 10)
    const parsedMileage = parseInt(mileage, 10)
    const parsedPrice = parseFloat(price)

    if (isNaN(parsedYear) || isNaN(parsedMileage) || isNaN(parsedPrice)) {
      return NextResponse.json({ error: 'Los campos año, kilometraje o precio no son válidos' }, { status: 400 })
    }

    // Determinar el CarStatus
    let carStatus: CarStatus = CarStatus.USED
    if (condition.toLowerCase() === "nuevo") {
      carStatus = CarStatus.NEW
    }

    const createdSellRequest = await prisma.sellRequest.create({
      data: {
        name,
        phone,
        email,
        brand,
        model,
        year: parsedYear,
        status: carStatus,
        mileage: parsedMileage,
        price: parsedPrice,
        message: description,
      }
    })

    return NextResponse.json({ success: true, data: createdSellRequest }, { status: 200 })
  } catch (error: any) {
    console.error('Error al guardar el request de venta:', error)
    return NextResponse.json({ error: 'Error al guardar en la base de datos' }, { status: 500 })
  }
}
