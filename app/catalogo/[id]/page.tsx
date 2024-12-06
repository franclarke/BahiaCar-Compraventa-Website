import Image from "next/image";
import { notFound } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function getCar(id: string) {
  const car = await prisma.car.findUnique({
    where: { id: parseInt(id, 10) },
  });

  if (!car) {
    notFound();
  }

  return car;
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function CarDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const car = await getCar(params.id);

  const formatter = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "USD",
  });

  return (
    <div className="container mx-auto py-8">
      <div className="space-y-8">
        <Carousel className="w-full">
          <CarouselContent>
            {car.images.map((image, index) => (
              <CarouselItem key={index}>
                <div className="relative aspect-[16/9]">
                  <Image
                    src={image}
                    alt={`${car.brand} ${car.model} - Imagen ${index + 1}`}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              {car.brand} {car.model} {car.year}
            </h1>
            <p className="text-3xl font-bold text-primary mb-4">
              {formatter.format(car.price)}
            </p>
            <p className="text-lg text-muted-foreground mb-6">
              {car.description}
            </p>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Especificaciones Técnicas</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <div>
                  <CardDescription>Transmisión</CardDescription>
                  <p className="font-medium">{car.transmission}</p>
                </div>
                <div>
                  <CardDescription>Combustible</CardDescription>
                  <p className="font-medium">{car.fuelType}</p>
                </div>
                <div>
                  <CardDescription>Kilometraje</CardDescription>
                  <p className="font-medium">{car.mileage.toLocaleString()} km</p>
                </div>
                <div>
                  <CardDescription>Estado</CardDescription>
                  <p className="font-medium">
                    {car.status === "NEW" ? "Nuevo" : "Usado"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
