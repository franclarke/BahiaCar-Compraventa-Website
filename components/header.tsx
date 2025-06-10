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
          aria-label="BahiaCar - Ir a página principal"
        >
          <div 
            className="w-7 h-7 sm:w-10 sm:h-10 bg-slate-900 rounded-full flex items-center justify-center"
            aria-hidden="true"
          >
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 48 48" 
              fill="none" 
              className="w-4 h-4 sm:w-6 sm:h-6"
            >
              <path 
                d="M12 28C12 25.7909 13.7909 24 16 24H32C34.2091 24 36 25.7909 36 28V32C36 34.2091 34.2091 36 32 36H16C13.7909 36 12 34.2091 12 32V28Z" 
                fill="#E2E8F0"
              />
              <path 
                d="M14 20L18 16H30L34 20" 
                stroke="#E2E8F0" 
                strokeWidth="2" 
                strokeLinecap="round"
              />
              <circle cx="17" cy="30" r="2" fill="#0F172A"/>
              <circle cx="31" cy="30" r="2" fill="#0F172A"/>
            </svg>
          </div>
          <span className="text-base sm:text-xl font-bold text-gray-900">BahiaCar</span>
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
            
            <Link href="/login">
              <Button 
                variant="ghost" 
                size="sm"
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-50 p-1.5 h-7 w-7"
                aria-label="Acceso administrador"
              >
                <User className="h-3.5 w-3.5" />
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
          <div className="flex items-center gap-0.5">
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
            
            <Link href="/login">
              <Button 
                variant="ghost" 
                size="sm"
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-50 p-1 h-6 w-6"
                aria-label="Acceso administrador"
              >
                <User className="h-3 w-3" />
              </Button>
            </Link>
          </div>
          
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