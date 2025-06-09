"use client";

import { SellCarDialog } from "@/components/sell-car-dialog";
import { ContactDialog } from "@/components/contact-dialog";
import { NewsletterForm } from "@/components/newsletter-form";
import { OptimizedImage } from "@/components/optimized-image";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col lg:flex-row pt-16 lg:pt-0">
      {/* Sección Izquierda */}
      <section 
        className="w-full lg:w-1/2 flex flex-col justify-center items-center px-3 sm:px-6 lg:px-12 py-6 sm:py-8 lg:py-0 order-2 lg:order-1"
        aria-labelledby="main-heading"
      >
        <div className="max-w-xl mx-auto lg:mx-0 w-full space-y-6 sm:space-y-8">
          <header className="text-center lg:text-left space-y-3 sm:space-y-4">
            <h1 
              id="main-heading"
              className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tight"
            >
              Tu Aliado de Confianza para Comprar y Vender Autos en Bahía Blanca
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-muted-foreground">
              Descubre una experiencia segura y personalizada para adquirir, vender o informarte sobre vehículos.
            </p>
          </header>

          <nav className="flex flex-col sm:flex-row gap-3 sm:gap-4" aria-label="Acciones principales">
            <Button 
              asChild 
              size="lg"
              className="flex-1 text-base sm:text-lg py-4 sm:py-6"
            >
              <Link href="/catalogo">
                Ver Catálogo
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Link>
            </Button>
            
            <div className="flex gap-2 sm:gap-3">
              <SellCarDialog />
              <ContactDialog />
            </div>
          </nav>

          <div className="bg-muted/50 rounded-lg p-4 sm:p-6 space-y-3 sm:space-y-4">
            <h2 className="font-semibold text-base sm:text-lg">Mantente Informado</h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              Suscríbete para recibir las mejores ofertas y novedades del mercado automotriz.
            </p>
            <NewsletterForm />
          </div>
        </div>
      </section>

      {/* Sección Derecha - Imagen Hero Optimizada */}
      <section 
        className="w-full lg:w-1/2 h-[50vh] sm:h-[60vh] lg:h-screen relative order-1 lg:order-2"
        aria-label="Imagen destacada de vehículo"
      >
        <div className="relative w-full h-full overflow-hidden">
          <OptimizedImage
            src="https://maipuexclusivos.com.ar/wp-content/uploads/sites/8/2022/08/1440x1920-audi-a3-sedan-my2021-1023.jpg"
            alt="Audi A3 Sedan 2021 - Vehículo de lujo disponible en BahiaCar"
            fill
            priority
            className="w-full h-full"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 50vw"
            quality={70}
          />
          <div 
            className="absolute inset-0 bg-black/30" 
            aria-hidden="true"
          />
        </div>
      </section>
    </main>
  );
}
