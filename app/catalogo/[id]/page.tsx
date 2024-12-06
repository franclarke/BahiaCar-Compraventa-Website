"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Car } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ContactDialog } from "@/components/contact-dialog";
import { formatPrice } from "@/lib/utils";
import { ArrowLeft, ChevronLeft, ChevronRight, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function CarDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [car, setCar] = useState<Car | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCar = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`/api/cars/${params.id}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Error al cargar el auto");
        }

        setCar(data);
      } catch (error) {
        console.error("Error al cargar el auto:", error);
        setError(error instanceof Error ? error.message : "Error al cargar el auto");
      } finally {
        setLoading(false);
      }
    };

    fetchCar();
  }, [params.id]);

  const nextImage = () => {
    if (car && currentImageIndex < car.images.length - 1) {
      setCurrentImageIndex(prev => prev + 1);
    } else {
      setCurrentImageIndex(0);
    }
  };

  const previousImage = () => {
    if (car && currentImageIndex > 0) {
      setCurrentImageIndex(prev => prev - 1);
    } else if (car) {
      setCurrentImageIndex(car.images.length - 1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen pt-16 px-4">
        <div className="container mx-auto py-8">
          <Button
            variant="ghost"
            className="mb-4 -ml-2"
            onClick={() => router.back()}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al catálogo
          </Button>
          
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
        </div>
      </main>
    );
  }

  if (!car) {
    return (
      <main className="min-h-screen pt-16 px-4">
        <div className="container mx-auto py-8">
          <Button
            variant="ghost"
            className="mb-4 -ml-2"
            onClick={() => router.back()}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al catálogo
          </Button>
          
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Auto no encontrado</AlertTitle>
            <AlertDescription>
              El auto que buscas no existe o ha sido eliminado.
            </AlertDescription>
          </Alert>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-16 pb-8">
      <div className="container mx-auto px-4">
        {/* Botón Volver */}
        <Button
          variant="ghost"
          className="mb-4 -ml-2"
          onClick={() => router.back()}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver al catálogo
        </Button>

        {/* Carrusel de Imágenes */}
        <div className="relative aspect-[4/3] md:aspect-[16/9] mb-6 rounded-lg overflow-hidden">
          <Image
            src={car.images[currentImageIndex] || '/placeholder-car.jpg'}
            alt={`${car.brand} ${car.model}`}
            fill
            className="object-cover"
            priority
          />
          
          {car.images.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white/90"
                onClick={previousImage}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white/90"
                onClick={nextImage}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>

              {/* Indicadores */}
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
        </div>

        {/* Información del Auto */}
        <div className="grid md:grid-cols-2 gap-2">
          <div>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">
                  {car.brand} {car.model}
                </h1>
                <p className="text-lg text-muted-foreground">
                  {car.year}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl md:text-3xl font-bold">
                  USD {formatPrice(car.price)}
                </p>
                <Badge variant={car.status === 'NEW' ? 'default' : 'secondary'}>
                  {car.status === 'NEW' ? 'Nuevo' : 'Usado'}
                </Badge>
              </div>
            </div>

            {/* Especificaciones */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <h3 className="font-medium text-muted-foreground">Transmisión</h3>
                <p>{car.transmission}</p>
              </div>
              <div>
                <h3 className="font-medium text-muted-foreground">Combustible</h3>
                <p>{car.fuelType}</p>
              </div>
              <div>
                <h3 className="font-medium text-muted-foreground">Tipo</h3>
                <p>{car.type}</p>
              </div>
              <div>
                <h3 className="font-medium text-muted-foreground">Kilometraje</h3>
                <p>{car.mileage.toLocaleString()} km</p>
              </div>
            </div>

            {/* Descripción */}
            <div className="mb-2">
              <h3 className="font-medium text-muted-foreground mb-2">Descripción</h3>
              <p className="whitespace-pre-line">{car.description}</p>
            </div>
          </div>

          {/* Acciones */}
          <div className="md:pl-6">
            <Button 
              size="lg" 
              className="w-full mb-4"
              onClick={() => setIsContactOpen(true)}
            >
              Estoy Interesado
            </Button>
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-medium mb-2">¿Por qué elegirnos?</h3>
              <ul className="space-y-2 text-sm">
                <li>✓ Vehículos verificados</li>
                <li>✓ Asesoramiento personalizado</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
