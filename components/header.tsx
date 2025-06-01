"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ContactDialog } from "@/components/contact-dialog";
import { SellCarDialog } from "@/components/sell-car-dialog";

export function Header() {

  return (
    <header 
      className="fixed w-full h-16 bg-white/95 backdrop-blur-sm z-50 border-b shadow-sm"
      role="banner"
    >
      <div className="container mx-auto h-full px-3 sm:px-4 lg:px-6 flex items-center justify-between">
        {/* Logo y nombre */}
        <Link 
          href="/"
          className="flex items-center space-x-2 sm:space-x-3 hover:opacity-80 transition-opacity"
          aria-label="BahiaCar - Ir a página principal"
        >
          <Image
            src="/logo.svg"
            alt="BahiaCar Logo"
            width={32}
            height={32}
            className="w-7 h-7 sm:w-10 sm:h-10"
            priority
          />
          <span className="text-base sm:text-xl font-bold text-gray-900">BahiaCar</span>
        </Link>
        
        {/* Navegación Desktop */}
        <nav 
          className="hidden md:flex items-center gap-4"
          role="navigation"
          aria-label="Navegación principal"
        >
          <Link href="/catalogo">
            <Button 
              variant="ghost" 
              className="font-medium hover:bg-gray-100 transition-colors text-base px-4"
              aria-label="Ver catálogo de vehículos"
            >
              Catálogo
            </Button>
          </Link>
          
          <SellCarDialog 
            triggerText="Vender" 
            triggerClassName="font-medium hover:bg-blue-50 hover:text-blue-700 text-base px-4"
          />
          
          <ContactDialog 
            triggerText="Contacto" 
            triggerClassName="bg-primary text-white hover:bg-primary/90 font-medium text-base px-6"
          />
        </nav>

        {/* Navegación Mobile */}
        <nav 
          className="flex md:hidden items-center gap-1"
          role="navigation"
          aria-label="Navegación móvil"
        >
          <Link href="/catalogo">
            <Button 
              variant="ghost" 
              size="sm"
              className="font-medium text-xs px-2 h-8"
              aria-label="Ver catálogo de vehículos"
            >
              Catálogo
            </Button>
          </Link>
          
          <SellCarDialog 
            triggerText="Vender" 
            triggerClassName="text-xs px-2 h-8 font-medium hover:bg-blue-50 hover:text-blue-700"
          />
          
          <ContactDialog 
            triggerText="Contacto" 
            triggerClassName="bg-primary text-white hover:bg-primary/90 text-xs px-2 h-8 font-medium"
          />
        </nav>
      </div>
    </header>
  );
}