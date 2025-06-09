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
          quality={70}
          loading="lazy"
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
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
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
              {car.images.map((_, index) => (
                <div
                  key={index}
                  className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-colors ${
                    index === currentImageIndex ? "bg-white" : "bg-white/50"
                  }`}
                />
              ))}
            </div>
          </>
        )}

        {/* Badge de estado y vendido */}
        <div className="absolute top-2 right-2 flex flex-col gap-1 z-10">
          <Badge 
            variant={car.status === 'NEW' ? 'default' : 'secondary'}
            className="text-xs font-medium"
          >
            {car.status === 'NEW' ? 'Nuevo' : 'Usado'}
          </Badge>
          {car.vendido && (
            <Badge variant="destructive" className="text-xs font-medium">
              Vendido
            </Badge>
          )}
        </div>
      </div>

      {/* Contenido de la Tarjeta */}
      <CardContent className="p-3 sm:p-4">
        <div className="space-y-2 sm:space-y-3">
          <div>
            <h3 className="font-semibold text-sm sm:text-base line-clamp-1">
              {car.brand} {car.model}
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              {car.year} • {car.type}
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-base sm:text-lg text-primary">
                {formatPrice(car.price)}
              </p>
              <p className="text-xs text-muted-foreground">
                {car.mileage.toLocaleString()} km
              </p>
            </div>

            <Link href={`/catalogo/${car.id}`}>
              <Button 
                size="sm" 
                className="text-xs sm:text-sm"
                disabled={car.vendido}
              >
                {car.vendido ? 'Vendido' : 'Ver más'}
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export const CarCard = memo(CarCardComponent);
