"use client";

import { SellCarDialog } from "@/components/sell-car-dialog";
import { ContactDialog } from "@/components/contact-dialog";
import { NewsletterForm } from "@/components/newsletter-form";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

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

          <div className="space-y-3 sm:space-y-4">
            <Button 
              asChild 
              size="lg" 
              className="w-full h-12 sm:h-16 text-base sm:text-lg font-medium group"
            >
              <Link href="/catalogo" className="flex items-center justify-center gap-2">
                Ver Catálogo
                <ArrowRight 
                  className="h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:translate-x-1" 
                  aria-hidden="true"
                />
              </Link>
            </Button>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <SellCarDialog
                triggerClassName="w-full h-12 sm:h-16 text-base sm:text-lg font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground"
                triggerText="Vender mi Auto"
              />
              
              <ContactDialog
                triggerClassName="w-full h-12 sm:h-16 text-base sm:text-lg font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground"
                triggerText="Contacto"
              />
            </div>
          </div>

          <div className="pt-4 sm:pt-6 border-t border-border/40">
            <NewsletterForm />
          </div>
        </div>
      </section>

      {/* Sección Derecha */}
      <section 
        className="w-full lg:w-1/2 h-[50vh] sm:h-[60vh] lg:h-screen relative order-1 lg:order-2"
        aria-label="Imagen destacada de vehículo"
      >
        <div className="relative w-full h-full overflow-hidden">
          <Image
            src="https://maipuexclusivos.com.ar/wp-content/uploads/sites/8/2022/08/1440x1920-audi-a3-sedan-my2021-1023.jpg"
            alt="Audi A3 Sedan 2021 - Vehículo de lujo disponible en BahiaCar"
            fill
            priority
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
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
