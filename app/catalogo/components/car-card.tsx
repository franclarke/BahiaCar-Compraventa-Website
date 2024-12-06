import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { Car } from "@/types/car";

interface CarCardProps {
  car: Car;
}

export function CarCard({ car }: CarCardProps) {
  const formatter = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "USD",
  });

  return (
    <Link href={`/catalogo/${car.id}`} className="block group">
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
        <div className="relative aspect-[16/9] overflow-hidden">
          <Image
            src={
              car.images[0] || 
              "https://static.vecteezy.com/system/resources/thumbnails/008/585/294/small/3d-rendering-sport-blue-car-on-white-bakcground-jpg-free-photo.jpg"
            }
            alt={`${car.brand} ${car.model}`}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute top-2 right-2">
            <Badge variant={car.status === "NEW" ? "default" : "secondary"}>
              {car.status === "NEW" ? "Nuevo" : "Usado"}
            </Badge>
          </div>
        </div>
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="text-lg font-bold group-hover:text-primary transition-colors">
                {car.brand} {car.model}
              </h3>
              <p className="text-sm text-muted-foreground">{car.year}</p>
            </div>
            <p className="text-xl font-bold text-primary">
              {formatter.format(car.price)}
            </p>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            <Badge variant="outline" className="text-xs">
              {car.transmission}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {car.type}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {car.fuelType}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {car.mileage.toLocaleString()} km
            </Badge>
          </div>
        </div>
      </Card>
    </Link>
  );
}
