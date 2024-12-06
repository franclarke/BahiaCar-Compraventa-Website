"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Car } from "@prisma/client";
import { formatPrice } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CarCardProps {
  car: Car;
}

export function CarCard({ car }: CarCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    if (currentImageIndex < car.images.length - 1) {
      setCurrentImageIndex(prev => prev + 1);
    } else {
      setCurrentImageIndex(0);
    }
  };

  const previousImage = (e: React.MouseEvent) => {
    e.preventDefault();
    if (currentImageIndex > 0) {
      setCurrentImageIndex(prev => prev - 1);
    } else {
      setCurrentImageIndex(car.images.length - 1);
    }
  };

  return (
    <div className="p-2 md:p-0">
      <Link href={`/catalogo/${car.id}`}>
        <Card className="overflow-hidden hover:shadow-lg transition-shadow">
          {/* Carrusel de Imágenes */}
          <div className="relative w-full aspect-[4/3] group">
            <Image
              src={car.images[currentImageIndex] || '/placeholder-car.jpg'}
              alt={`${car.brand} ${car.model}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority
            />
            
            {/* Controles del carrusel */}
            {car.images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 hover:bg-white/90"
                  onClick={previousImage}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 hover:bg-white/90"
                  onClick={nextImage}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>

                {/* Indicadores de imágenes */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                  {car.images.map((_, index) => (
                    <div
                      key={index}
                      className={`w-1.5 h-1.5 rounded-full transition-colors ${
                        index === currentImageIndex
                          ? 'bg-white'
                          : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}

            <Badge 
              variant={car.status === 'NEW' ? 'default' : 'secondary'}
              className="absolute top-2 right-2"
            >
              {car.status === 'NEW' ? 'Nuevo' : 'Usado'}
            </Badge>
          </div>

          <CardContent className="p-4">
            {/* Información Principal */}
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg md:text-xl truncate">
                    {car.brand} {car.model}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {car.year} • {car.transmission} • {car.fuelType}
                  </p>
                </div>
                <p className="text-lg md:text-xl font-bold">
                  USD {formatPrice(car.price)}
                </p>
              </div>

              {/* Detalles Adicionales */}
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge variant="outline">{car.type}</Badge>
                {car.status === 'USED' && (
                  <Badge variant="outline">{car.mileage.toLocaleString()} km</Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </div>
  );
}
