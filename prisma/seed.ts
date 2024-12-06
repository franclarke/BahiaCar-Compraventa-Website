import { PrismaClient, CarStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    // Limpia la base de datos primero
    await prisma.car.deleteMany();

    const cars = [
      {
        brand: "Toyota",
        model: "Corolla",
        year: 2023,
        status: CarStatus.NEW,
        mileage: 0,
        price: 35000,
        transmission: "Automatica",
        type: "Sedan",
        fuelType: "Nafta",
        images: [
          "https://cdn.motor1.com/images/mgl/kXQZZm/s3/2023-toyota-corolla-sedan.jpg",
          "https://cdn.motor1.com/images/mgl/JYyeP/s3/2023-toyota-corolla-sedan-interior.jpg"
        ] as string[],
        description: "Toyota Corolla 2023 0km, full equipo, versión SEG"
      },
      {
        brand: "Toyota",
        model: "Hilux",
        year: 2022,
        status: CarStatus.USED,
        mileage: 45000,
        price: 42000,
        transmission: "Manual",
        type: "Pickup",
        fuelType: "Diesel",
        images: [
          "https://cdn.motor1.com/images/mgl/P33NqL/s3/2022-toyota-hilux-gr-sport.jpg"
        ] as string[],
        description: "Toyota Hilux SRX 4x4, único dueño, service oficial"
      },
      {
        brand: "Volkswagen",
        model: "Golf",
        year: 2023,
        status: CarStatus.NEW,
        mileage: 0,
        price: 38000,
        transmission: "Automatica",
        type: "Hatchback",
        fuelType: "Nafta",
        images: [
          "https://cdn.motor1.com/images/mgl/P3Rkzq/s3/2023-vw-golf-r-20th-anniversary-edition.jpg"
        ] as string[],
        description: "VW Golf GTI 2023, nuevo modelo, full equipo"
      },
      {
        brand: "Ford",
        model: "Ranger",
        year: 2021,
        status: CarStatus.USED,
        mileage: 65000,
        price: 35000,
        transmission: "Manual",
        type: "Pickup",
        fuelType: "Diesel",
        images: [
          "https://cdn.motor1.com/images/mgl/kJLB1/s3/2021-ford-ranger-tremor.jpg"
        ] as string[],
        description: "Ford Ranger Limited 4x4, excelente estado"
      },
      {
        brand: "Honda",
        model: "CR-V",
        year: 2023,
        status: CarStatus.NEW,
        mileage: 0,
        price: 45000,
        transmission: "Automatica",
        type: "SUV",
        fuelType: "Nafta",
        images: [
          "https://cdn.motor1.com/images/mgl/kXQZZm/s3/2023-honda-cr-v.jpg"
        ] as string[],
        description: "Honda CR-V 2023, nueva generación, híbrida"
      }
    ];

    for (const car of cars) {
      await prisma.car.create({
        data: car
      });
    }

    console.log('Base de datos poblada con éxito');
  } catch (error) {
    console.error('Error al poblar la base de datos:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });