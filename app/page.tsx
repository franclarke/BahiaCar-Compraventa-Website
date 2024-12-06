"use client";

import { SellCarDialog } from "@/components/sell-car-dialog";
import { ContactDialog } from "@/components/contact-dialog";
import { NewsletterForm } from "@/components/newsletter-form";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full h-[60vh] md:h-[50vh] lg:h-screen">
        <div 
          className="absolute inset-0 bg-[url('https://maipuexclusivos.com.ar/wp-content/uploads/sites/8/2022/08/1440x1920-audi-a3-sedan-my2021-1023.jpg')] 
          bg-cover bg-center"
        />
        <div className="absolute inset-0 bg-black/50" />
        
        {/* Contenido sobre la imagen */}
        <div className="relative h-full flex flex-col items-center justify-center px-4 text-white text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            Tu Mercado de Autos de Confianza en Bahia Blanca
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl">
            Compra, vende o consulta sobre vehículos con total confianza
          </p>
          <div className="w-full max-w-md space-y-4">
            <Link href="/catalogo" className="block">
              <Button 
                className="w-full text-lg py-6"
                size="lg"
              >
                Ver Catálogo
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Sección de Acciones */}
      <section className="bg-white py-8 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SellCarDialog />
            <ContactDialog />
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-gray-50 py-8 px-4">
        <div className="container mx-auto max-w-md">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2">Mantente Actualizado</h2>
            <p className="text-muted-foreground">
              Recibe las últimas novedades y ofertas especiales
            </p>
          </div>
          <NewsletterForm />
        </div>
      </section>
    </main>
  );
}
