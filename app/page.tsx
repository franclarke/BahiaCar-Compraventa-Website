"use client";

import { SellCarDialog } from "@/components/sell-car-dialog";
import { ContactDialog } from "@/components/contact-dialog";
import { NewsletterForm } from "@/components/newsletter-form";

export default function Home() {
  return (
    <main className="min-h-screen flex pt-16">
      {/* Sección Izquierda */}
      <div className="w-1/2 p-12 flex flex-col justify-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">
            Tu Mercado de Autos de Confianza en Bahia Blanca
          </h1>
          <p className="text-muted-foreground text-lg">
            Compra, vende o consulta sobre vehículos con total confianza
          </p>
        </div>

        <div className="space-y-6">
          <SellCarDialog />
          <ContactDialog />
          <div className="pt-6 border-t">
            <NewsletterForm />
          </div>
        </div>
      </div>

      {/* Sección Derecha */}
      <div className="w-1/2 relative">
        <div className="absolute inset-0 bg-[url('https://maipuexclusivos.com.ar/wp-content/uploads/sites/8/2022/08/1440x1920-audi-a3-sedan-my2021-1023.jpg')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-black/20" />
      </div>
    </main>
  );
}
