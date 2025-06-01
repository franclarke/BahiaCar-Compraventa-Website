"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ContactDialog } from "@/components/contact-dialog";
import { SellCarDialog } from "@/components/sell-car-dialog";

export function Header() {

  return (
    <header 
      className="fixed w-full h-16 bg-white/90 backdrop-blur-sm z-50 border-b"
      role="banner"
    >
      <div className="container mx-auto h-full px-4 lg:px-6 flex items-center justify-between">
        {/* Logo y nombre */}
        <Link 
          href="/"
          className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
          aria-label="BahiaCar - Ir a página principal"
        >
          <div className="relative w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0">
            <Image
              src="/logo.svg"
              alt="BahiaCar Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <span className="text-lg sm:text-xl font-bold text-gray-900">BahiaCar</span>
        </Link>
        
        {/* Navegación */}
        <nav 
          className="flex items-center gap-3 sm:gap-4"
          role="navigation"
          aria-label="Navegación principal"
        >
          <Link href="/catalogo">
            <Button 
              variant="outline" 
              className="font-semibold hover:bg-primary hover:text-white transition-colors text-sm sm:text-base min-h-[44px] px-3 sm:px-4"
              aria-label="Ver catálogo de vehículos"
            >
              Catálogo
            </Button>
          </Link>
          
          <div className="hidden sm:flex items-center gap-3">
            <SellCarDialog triggerText="Vender" />
            <ContactDialog triggerText="Contacto" />
          </div>
          
          {/* Botones móviles simplificados */}
          <div className="flex sm:hidden items-center gap-2">
            <SellCarDialog triggerText="Vender" />
            <ContactDialog triggerText="Contacto" />
          </div>
        </nav>
      </div>
    </header>
  );
}