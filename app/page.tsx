"use client";

import { SellCarDialog } from "@/components/sell-car-dialog";
import { ContactDialog } from "@/components/contact-dialog";
import { NewsletterForm } from "@/components/newsletter-form";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col md:flex-row">
      {/* Sección Izquierda */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center px-4 md:px-12 py-8 md:py-0 order-2 md:order-1">
        <div className="max-w-xl mx-auto md:mx-0 w-full space-y-8">
          <div className="text-center md:text-left space-y-4">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
              Tu Mercado de Autos de Confianza en Bahia Blanca
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              Compra, vende o consulta sobre vehículos con total confianza
            </p>
          </div>

          <div className="space-y-4">
            <Link href="/catalogo" className="block">
              <Button 
                className="w-full text-lg py-6"
                size="lg"
              >
                Ver Catálogo
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <SellCarDialog />
              <ContactDialog />
            </div>
          </div>

          <div className="pt-6 border-t">
            <NewsletterForm />
          </div>
        </div>
      </div>

      {/* Sección Derecha - Imagen */}
      <div className="w-full md:w-1/2 h-[40vh] md:h-screen relative order-1 md:order-2">
        <div 
          className="absolute inset-0 bg-[url('https://maipuexclusivos.com.ar/wp-content/uploads/sites/8/2022/08/1440x1920-audi-a3-sedan-my2021-1023.jpg')] 
          bg-cover bg-center"
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>
    </main>
  );
}
