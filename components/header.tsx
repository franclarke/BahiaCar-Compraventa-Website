"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function Header() {
  return (
    <header 
      className="fixed w-full h-14 sm:h-16 bg-white/80 backdrop-blur-sm z-50 border-b"
      role="banner"
    >
      <div className="container mx-auto h-full px-3 sm:px-4 lg:px-6 flex items-center justify-between">
        {/* Logo y nombre - Oculto en móvil, visible en tablet/desktop */}
        <Link 
          href="/"
          className="hidden lg:flex text-xl xl:text-2xl font-bold hover:text-primary transition-colors items-center"
          aria-label="BahiaCar - Ir a página principal"
        >
          <span>BahiaCar</span>
        </Link>

        {/* Logo central */}
        <div className="flex lg:absolute lg:left-1/2 lg:top-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2">
          <Link 
            href="/" 
            className="flex items-center space-x-2"
            aria-label="BahiaCar - Ir a página principal"
          >
            <div className="relative w-7 h-7 sm:w-8 sm:h-8 lg:w-12 lg:h-12 flex-shrink-0">
              <Image
                src="/logo.svg"
                alt=""
                width={48}
                height={48}
                className="object-contain"
                priority
                aria-hidden="true"
              />
            </div>
            {/* Nombre visible solo en móvil y tablet */}
            <span className="text-base sm:text-lg font-semibold lg:hidden">BahiaCar</span>
          </Link>
        </div>
        
        {/* Navegación Desktop */}
        <nav 
          className="hidden lg:block"
          role="navigation"
          aria-label="Navegación principal"
        >
          <Link href="/catalogo">
            <Button 
              variant="outline" 
              className="font-semibold hover:bg-primary hover:text-white transition-colors text-sm xl:text-base min-h-[44px] px-4"
              aria-label="Ver catálogo de vehículos"
            >
              Catálogo
            </Button>
          </Link>
        </nav>

        {/* Menú Móvil */}
        <Sheet>
          <SheetTrigger asChild className="lg:hidden">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-11 w-11 sm:h-12 sm:w-12 min-h-[44px] min-w-[44px]"
              aria-label="Abrir menú de navegación"
            >
              <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent 
            side="right" 
            className="w-[280px] sm:w-[320px]"
            aria-label="Menú de navegación móvil"
          >
            <nav 
              className="flex flex-col gap-4 mt-8"
              role="navigation"
              aria-label="Navegación móvil"
            >
              <h2 className="sr-only">Navegación del sitio</h2>
              <Link href="/catalogo">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-base sm:text-lg font-semibold h-12 min-h-[44px]"
                  aria-label="Ver catálogo de vehículos"
                >
                  Catálogo
                </Button>
              </Link>
              <Link href="/vender">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-base sm:text-lg font-semibold h-12 min-h-[44px]"
                  aria-label="Publicar tu vehículo en venta"
                >
                  Publicá tu vehículo
                </Button>
              </Link>
              <Link href="/contacto">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-base sm:text-lg font-semibold h-12 min-h-[44px]"
                  aria-label="Información de contacto"
                >
                  Contacto
                </Button>
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}