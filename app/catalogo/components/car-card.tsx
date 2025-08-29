"use client";

import { useState, useCallback, memo, useRef, useEffect } from "react";
import { OptimizedImageLazy } from "@/components/optimized-image-lazy";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Car } from "@prisma/client";
import { formatPrice } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Phone, MessageCircle, Share2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { openQuickCarInquiry, openPhoneCall } from "@/lib/whatsapp-utils";
import { useShare } from "@/components/share-button";

interface CarCardProps {
  car: Car & { images: string[] }; // Aseguramos que 'images' sea un array de strings
}

function CarCardComponent({ car }: CarCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const router = useRouter();
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const [isTouching, setIsTouching] = useState(false);

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
    // Solo navegar si no se está haciendo swipe
    if (!isTouching) {
      router.push(`/catalogo/${car.id}`);
    }
  }, [car.id, router, isTouching]);

  // Touch gestures para swipe horizontal
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (car.images.length <= 1) return;
    touchStartX.current = e.touches[0].clientX;
    setIsTouching(true);
  }, [car.images.length]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (car.images.length <= 1) return;
    touchEndX.current = e.touches[0].clientX;
  }, [car.images.length]);

  const handleTouchEnd = useCallback(() => {
    if (car.images.length <= 1 || !touchStartX.current || !touchEndX.current) {
      setIsTouching(false);
      return;
    }

    const distance = touchStartX.current - touchEndX.current;
    const threshold = 50; // mínima distancia para swipe

    if (Math.abs(distance) > threshold) {
      if (distance > 0) {
        // Swipe izquierda - siguiente imagen
        setCurrentImageIndex(prev => prev < car.images.length - 1 ? prev + 1 : 0);
      } else {
        // Swipe derecha - imagen anterior
        setCurrentImageIndex(prev => prev > 0 ? prev - 1 : car.images.length - 1);
      }
    }

    // Reset touch values
    touchStartX.current = null;
    touchEndX.current = null;
    setTimeout(() => setIsTouching(false), 100);
  }, [car.images.length]);

  const handleWhatsApp = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      await openQuickCarInquiry({
        brand: car.brand,
        model: car.model,
        year: car.year,
        price: car.price,
        id: car.id
      });
    } catch (error) {
      console.error('Error abriendo WhatsApp:', error);
    }
  }, [car.brand, car.model, car.year, car.price, car.id]);

  const handleCall = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      openPhoneCall();
    } catch (error) {
      console.error('Error abriendo telefono:', error);
    }
  }, []);
  
  const { share } = useShare();
  const handleShare = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      await share({
        title: `${car.brand} ${car.model} ${car.year}`,
        text: `Mira este ${car.brand} ${car.model} ${car.year} en SYM Automotores - USD ${formatPrice(car.price)}`,
        url: `${window.location.origin}/catalogo/${car.id}`
      });
    } catch (error) {
      console.log('Share cancelled or failed:', error);
    }
  }, [car, share]);

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      {/* Carrusel de Imágenes */}
      <div 
        className="relative w-full aspect-[4/3] group"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Área clickeable para navegar al detalle */}
        <div 
          className="absolute inset-0 cursor-pointer z-0 select-none"
          onClick={handleCardClick}
        />
        
        <OptimizedImageLazy
          src={car.images[currentImageIndex] || "/placeholder-car.jpg"}
          alt={`${car.brand} ${car.model}`}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
          priority={currentImageIndex === 0}
        />

        {car.images.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 opacity-0 sm:group-hover:opacity-100 transition-opacity bg-white/80 hover:bg-white/90 z-20 h-10 w-10 min-w-[44px] touch-manipulation"
              onClick={previousImage}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 opacity-0 sm:group-hover:opacity-100 transition-opacity bg-white/80 hover:bg-white/90 z-20 h-10 w-10 min-w-[44px] touch-manipulation"
              onClick={nextImage}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>

            {/* Indicadores de imágenes */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
              {car.images.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 sm:w-1.5 sm:h-1.5 rounded-full transition-colors min-w-[8px] min-h-[8px] touch-manipulation ${
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
          <div className="space-y-3">
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
            <div className="flex flex-wrap gap-1 sm:gap-2">
              <Badge variant="outline" className="text-xs">{car.type}</Badge>
              {car.status === "USED" && (
                <Badge variant="outline" className="text-xs">
                  {car.mileage.toLocaleString()} km
                </Badge>
              )}
            </div>
            
            {/* Botones de acción móvil */}
            <div className="flex gap-2 sm:hidden pt-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 h-10 text-xs gap-1.5 touch-manipulation"
                onClick={handleWhatsApp}
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 h-10 text-xs gap-1.5 touch-manipulation"
                onClick={handleCall}
              >
                <Phone className="h-4 w-4" />
                Llamar
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-10 w-10 p-0 touch-manipulation"
                onClick={handleShare}
                aria-label="Compartir vehículo"
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}

export const CarCard = memo(CarCardComponent);
