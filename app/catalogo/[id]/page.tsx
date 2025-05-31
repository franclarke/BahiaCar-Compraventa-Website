"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
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

interface ErrorStateProps {
  message: string;
  variant?: "destructive" | "default";
}

function ErrorState({ message, variant = "default" }: ErrorStateProps) {
  const router = useRouter();
  const handleBack = useCallback(() => router.back(), [router]);

  return (
    <main className="min-h-screen pt-16 px-4">
      <div className="container mx-auto py-8">
        <Button variant="ghost" className="mb-4 -ml-2" onClick={handleBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver al catálogo
        </Button>
        <Alert variant={variant}>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{variant === "destructive" ? "Error" : "Auto no encontrado"}</AlertTitle>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      </div>
    </main>
  );
}

export default function CarDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [car, setCar] = useState<Car | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Carga de datos del auto
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
      } catch (err) {
        console.error("Error al cargar el auto:", err);
        setError(err instanceof Error ? err.message : "Error al cargar el auto");
      } finally {
        setLoading(false);
      }
    };

    fetchCar();
  }, [params.id]);

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  const nextImage = useCallback(() => {
    if (car) {
      setCurrentImageIndex((prev) => (prev < car.images.length - 1 ? prev + 1 : 0));
    }
  }, [car]);

  const previousImage = useCallback(() => {
    if (car) {
      setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : car.images.length - 1));
    }
  }, [car]);

  const contactMessage = useMemo(() => {
    if (!car) return "";
    return `Hola, estoy interesado en el ${car.brand} ${car.model} ${car.year} (ID: ${car.id})`;
  }, [car]);

  const carInfo = useMemo(() => {
    if (!car) return "";
    return `${car.brand} ${car.model} ${car.year} (ID: ${car.id}) - USD ${formatPrice(car.price)}`;
  }, [car]);

  if (loading) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary" />
      </div>
    );
  }

  if (error || !car) {
    return (
      <ErrorState
        message={error || "El auto que buscas no existe o ha sido eliminado."}
        variant={error ? "destructive" : "default"}
      />
    );
  }

  // Desestructuramos el objeto car para mayor claridad
  const { brand, model, year, images, status, price, transmission, fuelType, type, mileage, description, vendido } = car;

  return (
    <main className="min-h-screen pt-16 pb-8">
      <div className="container mx-auto px-4">
        {/* Navegación */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" className="-ml-2" onClick={handleBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al catálogo
          </Button>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Galería de Imágenes */}
          <div className="space-y-4">
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
              <Image
                src={images[currentImageIndex] || "/placeholder-car.jpg"}
                alt={`${brand} ${model}`}
                fill
                className="object-cover"
                priority
              />
              
              {/* Etiqueta VENDIDO */}
              {vendido && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div 
                    className="bg-red-600 text-white font-bold text-2xl md:text-3xl px-12 py-3 
                               transform rotate-12 shadow-lg border-2 border-white
                               opacity-95 z-10"
                    style={{
                      transform: 'rotate(-12deg) translateY(-10px)',
                    }}
                  >
                    VENDIDO
                  </div>
                </div>
              )}
              
              {images.length > 1 && (
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
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
                    {images.map((_, index) => (
                      <button
                        key={index}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          index === currentImageIndex ? "bg-white" : "bg-white/50"
                        }`}
                        onClick={() => setCurrentImageIndex(index)}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
            {/* Miniaturas */}
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {images.map((img, index) => (
                  <button
                    key={index}
                    className={`relative aspect-square rounded-md overflow-hidden ${
                      index === currentImageIndex ? "ring-2 ring-primary" : ""
                    }`}
                    onClick={() => setCurrentImageIndex(index)}
                  >
                    <Image
                      src={img}
                      alt={`${brand} ${model} - Vista ${index + 1}`}
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
                  {brand} {model} {year}
                </h1>
                <Badge variant={status === "NEW" ? "default" : "secondary"}>
                  {status === "NEW" ? "Nuevo" : "Usado"}
                </Badge>
              </div>
              <p className="text-2xl md:text-3xl font-bold text-primary mt-2">
                USD {formatPrice(price)}
              </p>
            </div>

            <Separator />

            {/* Especificaciones */}
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium text-muted-foreground mb-1">Transmisión</h3>
                    <p>{transmission}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-muted-foreground mb-1">Combustible</h3>
                    <p>{fuelType}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-muted-foreground mb-1">Tipo</h3>
                    <p>{type}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-muted-foreground mb-1">Kilometraje</h3>
                    <p>{mileage.toLocaleString()} km</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Descripción */}
            <div>
              <h3 className="font-medium text-muted-foreground mb-2">Descripción</h3>
              <p className="whitespace-pre-line">{description}</p>
            </div>

            <Separator />

            {/* Acciones */}
            <div className="space-y-4">
              {vendido ? (
                <Button size="lg" className="w-full" disabled variant="secondary">
                  Auto Vendido
                </Button>
              ) : (
                <Button size="lg" className="w-full" onClick={() => setIsContactOpen(true)}>
                  Estoy Interesado
                </Button>
              )}

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
        carInfo={carInfo}
        triggerButton={false}
      />
    </main>
  );
}
