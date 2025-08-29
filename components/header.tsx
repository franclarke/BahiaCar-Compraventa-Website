/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ContactDialog } from "@/components/contact-dialog";
import { SellCarDialog } from "@/components/sell-car-dialog";
import { User } from "lucide-react";

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
          aria-label="SYM Automotores - Ir a página principal"
        >
          <div 
            className="w-7 h-7 sm:w-10 sm:h-10  flex items-center justify-center"
            aria-hidden="true"
          >
           <img src="/logo.svg" alt="Logo" width={200} height={200} />
          </div>
          <span className="text-base sm:text-xl font-bold text-gray-900">SYM Automotores</span>
        </Link>
        
        {/* Navegación Desktop */}
        <nav 
          className="hidden md:flex items-center gap-4"
          role="navigation"
          aria-label="Navegación principal"
        >
          <SellCarDialog 
            triggerText="Vender" 
            triggerClassName="font-medium hover:bg-blue-50 hover:text-blue-700 text-base px-4"
          />
          
          <ContactDialog 
            triggerText="Contacto" 
            triggerClassName="font-medium hover:bg-blue-50 hover:text-blue-700 text-base px-4"
          />

          <div className="flex items-center gap-1">
            <Link href="/catalogo">
              <Button 
                variant="ghost" 
                className="bg-primary text-white hover:bg-primary/90 font-medium text-base px-6"
                aria-label="Ver catálogo de vehículos"
              >
                Catálogo
              </Button>
            </Link>
            
            <Link href="/login" className="p-2">
              <Button 
                variant="ghost" 
                size="sm"
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-50 p-1.5 h-7 w-7"
                aria-label="Acceso administrador"
              >
                <User className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </nav>

        {/* Navegación Mobile */}
        <nav 
          className="flex md:hidden items-center gap-1"
          role="navigation"
          aria-label="Navegación móvil"
        >
          <div className="flex items-center gap-1">
            <Link href="/catalogo">
              <Button 
                variant="ghost" 
                size="sm"
                className="font-medium text-xs px-3 h-10 min-w-[44px]"
                aria-label="Ver catálogo de vehículos"
              >
                Catálogo
              </Button>
            </Link>
            
            <Link href="/login">
              <Button 
                variant="ghost" 
                size="sm"
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-50 p-2 h-10 w-10 min-w-[44px]"
                aria-label="Acceso administrador"
              >
                <User className="h-4 w-4"  />
              </Button>
            </Link>
          </div>
          
          <SellCarDialog 
            triggerText="Vender" 
            triggerClassName="text-xs px-3 h-10 font-medium hover:bg-blue-50 hover:text-blue-700 min-w-[44px]"
          />
          
          <ContactDialog 
            triggerText="Contacto" 
            triggerClassName="bg-primary text-white hover:bg-primary/90 text-xs px-3 h-10 font-medium min-w-[44px]"
          />
        </nav>
      </div>
    </header>
  );
}