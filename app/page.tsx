"use client";

import { SellCarDialog } from "@/components/sell-car-dialog";
import { ContactDialog } from "@/components/contact-dialog";
import { NewsletterForm } from "@/components/newsletter-form";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col lg:flex-row pt-14 sm:pt-16 lg:pt-0">
      {/* Sección Izquierda */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-3 sm:px-6 lg:px-12 py-6 sm:py-8 lg:py-0 order-2 lg:order-1">
        <div className="max-w-xl mx-auto lg:mx-0 w-full space-y-6 sm:space-y-8">
          <div className="text-center lg:text-left space-y-3 sm:space-y-4">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tight">
              Tu Aliado de Confianza para Comprar y Vender Autos en Bahía Blanca
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-muted-foreground">
              Descubre una experiencia segura y personalizada para adquirir, vender o informarte sobre vehículos.
            </p>
          </div>

          <div className="space-y-3 sm:space-y-4">
            <Link href="/catalogo" className="block">
              <Button 
                className="w-full text-base sm:text-lg py-4 sm:py-6"
                size="lg"
              >
                Explorar Autos Disponibles
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </Link>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <SellCarDialog />
              <ContactDialog />
            </div>
          </div>

          <div className="pt-4 sm:pt-6 border-t">
            <NewsletterForm />
          </div>
        </div>
      </div>

      {/* Sección Derecha - Imagen */}
      <div className="w-full lg:w-1/2 h-[50vh] sm:h-[60vh] lg:h-screen relative order-1 lg:order-2">
        <div 
          className="absolute inset-0 bg-[url('https://maipuexclusivos.com.ar/wp-content/uploads/sites/8/2022/08/1440x1920-audi-a3-sedan-my2021-1023.jpg')] 
          bg-cover bg-center"
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>
    </main>
  );
}
