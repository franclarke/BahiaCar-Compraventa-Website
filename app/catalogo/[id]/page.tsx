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
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

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

  const contactMessage = `Hola, estoy interesado en el ${car.brand} ${car.model} ${car.year} (ID: ${car.id})`;

  return (
    <main className="min-h-screen pt-16 pb-8">
      <div className="container mx-auto px-4">
        {/* Navegación */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            className="-ml-2"
            onClick={() => router.back()}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al catálogo
          </Button>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Galería de Imágenes */}
          <div className="space-y-4">
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
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

                  {/* Miniaturas */}
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
                    {car.images.map((_, index) => (
                      <button
                        key={index}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          index === currentImageIndex
                            ? 'bg-white'
                            : 'bg-white/50'
                        }`}
                        onClick={() => setCurrentImageIndex(index)}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Miniaturas de imágenes */}
            {car.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {car.images.map((image, index) => (
                  <button
                    key={index}
                    className={`relative aspect-square rounded-md overflow-hidden ${
                      index === currentImageIndex ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => setCurrentImageIndex(index)}
                  >
                    <Image
                      src={image}
                      alt={`${car.brand} ${car.model} - Vista ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Información y Acciones */}
          <div className="space-y-6">
            {/* Encabezado */}
            <div>
              <div className="flex items-center justify-between gap-4">
                <h1 className="text-2xl md:text-3xl font-bold">
                  {car.brand} {car.model} {car.year}
                </h1>
                <Badge variant={car.status === 'NEW' ? 'default' : 'secondary'}>
                  {car.status === 'NEW' ? 'Nuevo' : 'Usado'}
                </Badge>
              </div>
              <p className="text-2xl md:text-3xl font-bold text-primary mt-2">
                USD {formatPrice(car.price)}
              </p>
            </div>

            <Separator />

            {/* Especificaciones */}
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium text-muted-foreground mb-1">Transmisión</h3>
                    <p>{car.transmission}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-muted-foreground mb-1">Combustible</h3>
                    <p>{car.fuelType}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-muted-foreground mb-1">Tipo</h3>
                    <p>{car.type}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-muted-foreground mb-1">Kilometraje</h3>
                    <p>{car.mileage.toLocaleString()} km</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Descripción */}
            <div>
              <h3 className="font-medium text-muted-foreground mb-2">Descripción</h3>
              <p className="whitespace-pre-line">{car.description}</p>
            </div>

            <Separator />

            {/* Acciones */}
            <div className="space-y-4">
              <Button 
                size="lg" 
                className="w-full"
                onClick={() => setIsContactOpen(true)}
              >
                Estoy Interesado
              </Button>

              <Card className="bg-muted">
                <CardContent className="p-6">
                  <h3 className="font-medium mb-4">¿Por qué elegirnos?</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <span className="text-primary">✓</span>
                      Vehículos verificados
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-primary">✓</span>
                      Garantía de compra
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-primary">✓</span>
                      Financiación disponible
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-primary">✓</span>
                      Asesoramiento personalizado
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Dialog de Contacto */}
      <ContactDialog 
        open={isContactOpen}
        onOpenChange={setIsContactOpen}
        defaultMessage={contactMessage}
        triggerButton={false}
      />
    </main>
  );
}
