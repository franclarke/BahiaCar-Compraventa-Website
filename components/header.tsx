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
      <div className="container mx-auto h-full px-2 sm:px-4 lg:px-6 flex items-center justify-between gap-2">
        {/* Logo y nombre */}
        <Link 
          href="/"
          className="flex items-center space-x-2 sm:space-x-3 hover:opacity-80 transition-opacity flex-shrink-0"
          aria-label="SYM Automotores - Ir a página principal"
        >
          <div 
            className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center flex-shrink-0"
            aria-hidden="true"
          >
           <img src="/logo.svg" alt="Logo" className="w-full h-full object-contain" />
          </div>
          <span className="text-sm sm:text-xl font-bold text-gray-900 truncate">SYM Automotores</span>
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
          className="flex md:hidden items-center gap-2"
          role="navigation"
          aria-label="Navegación móvil"
        >
          <div className="flex items-center gap-2">
            <Link href="/catalogo">
              <Button 
                variant="ghost" 
                size="sm"
                className="bg-primary text-white hover:bg-primary/90 font-medium text-xs px-3 py-2 h-10 min-w-[60px] rounded-md"
                aria-label="Ver catálogo de vehículos"
              >
                Catálogo
              </Button>
            </Link>
            
            <Link href="/login">
              <Button 
                variant="ghost" 
                size="sm"
                className="text-gray-600 hover:text-gray-800 hover:bg-gray-100 p-2 h-10 w-10 min-w-[44px] rounded-md border border-gray-200"
                aria-label="Acceso administrador"
              >
                <User className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          
          <SellCarDialog 
            triggerText="Vender" 
            triggerClassName="text-xs px-3 py-2 h-10 font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 min-w-[60px] rounded-md"
          />
          
          <ContactDialog 
            triggerText="Contacto" 
            triggerClassName="text-xs px-3 py-2 h-10 font-medium text-white bg-green-600 hover:bg-green-700 min-w-[70px] rounded-md"
          />
        </nav>
      </div>
    </header>
  );
}