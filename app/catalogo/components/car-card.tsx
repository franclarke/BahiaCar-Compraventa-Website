"use client";

import { useState, useCallback, memo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Car } from "@prisma/client";
import { formatPrice } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CarCardProps {
  car: Car & { images: string[] }; // Aseguramos que 'images' sea un array de strings
}

function CarCardComponent({ car }: CarCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setCurrentImageIndex((prev) => (prev < car.images.length - 1 ? prev + 1 : 0));
    },
    [car.images.length]
  );

  const previousImage = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : car.images.length - 1));
    },
    [car.images.length]
  );

  const handleCardClick = useCallback(() => {
    // Solo navegar si no es vendido o si se hace clic fuera de los controles
    window.location.href = `/catalogo/${car.id}`;
  }, [car.id]);

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      {/* Carrusel de Imágenes */}
      <div className="relative w-full aspect-[4/3] group">
        {/* Área clickeable para navegar al detalle */}
        <div 
          className="absolute inset-0 cursor-pointer z-0"
          onClick={handleCardClick}
        />
        
        <Image
          src={car.images[currentImageIndex] || "/placeholder-car.svg"}
          alt={`${car.brand} ${car.model}`}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
          priority
        />

        {car.images.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 hover:bg-white/90 z-20 h-8 w-8 sm:h-10 sm:w-10"
              onClick={previousImage}
            >
              <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 hover:bg-white/90 z-20 h-8 w-8 sm:h-10 sm:w-10"
              onClick={nextImage}
            >
              <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>

            {/* Indicadores de imágenes */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-20">
              {car.images.map((_, index) => (
                <button
                  key={index}
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${
                    index === currentImageIndex ? "bg-white" : "bg-white/50"
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setCurrentImageIndex(index);
                  }}
                />
              ))}
            </div>
          </>
        )}

        <Badge
          variant={car.status === "NEW" ? "default" : "secondary"}
          className="absolute top-2 right-2 z-20 text-xs"
        >
          {car.status === "NEW" ? "Nuevo" : "Usado"}
        </Badge>

        {/* Etiqueta VENDIDO */}
        {car.vendido && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
            <div 
              className="bg-red-600 text-white font-bold text-sm sm:text-lg md:text-xl px-4 sm:px-8 py-1 sm:py-2 
                         transform rotate-12 shadow-lg border-2 border-white
                         opacity-95"
              style={{
                transform: 'rotate(-12deg) translateY(-10px)',
              }}
            >
              VENDIDO
            </div>
          </div>
        )}
      </div>

      <Link href={`/catalogo/${car.id}`}>
        <CardContent className="p-3 sm:p-4 cursor-pointer">
          {/* Información Principal */}
          <div className="space-y-2">
            <div className="flex justify-between items-start gap-2">
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-base sm:text-lg md:text-xl truncate">
                  {car.brand} {car.model}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {car.year} • {car.transmission} • {car.fuelType}
                </p>
              </div>
              <p className="text-base sm:text-lg md:text-xl font-bold text-green-600 flex-shrink-0">
                USD {formatPrice(car.price)}
              </p>
            </div>

            {/* Detalles Adicionales */}
            <div className="flex flex-wrap gap-1 sm:gap-2 mt-2">
              <Badge variant="outline" className="text-xs">{car.type}</Badge>
              {car.status === "USED" && (
                <Badge variant="outline" className="text-xs">
                  {car.mileage.toLocaleString()} km
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}

export const CarCard = memo(CarCardComponent);
