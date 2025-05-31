"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function Header() {
  return (
    <header className="fixed w-full h-14 sm:h-16 bg-white/80 backdrop-blur-sm z-50 border-b">
      <div className="container mx-auto h-full px-3 sm:px-4 lg:px-6 flex items-center justify-between">
        {/* Logo y nombre - Oculto en móvil, visible en tablet/desktop */}
        <Link 
          href="/"
          className="hidden lg:flex text-xl xl:text-2xl font-bold hover:text-primary transition-colors items-center"
        >
          <span>BahiaCar</span>
        </Link>

        {/* Logo central */}
        <div className="flex lg:absolute lg:left-1/2 lg:top-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2">
          <Link href="/" className="flex items-center space-x-2">
            <div className="relative w-7 h-7 sm:w-8 sm:h-8 lg:w-12 lg:h-12 flex-shrink-0">
              <Image
                src="/logo.svg"
                alt="AutoCar Bahia Logo"
                width={48}
                height={48}
                className="object-contain"
                priority
              />
            </div>
            {/* Nombre visible solo en móvil y tablet */}
            <span className="text-base sm:text-lg font-semibold lg:hidden">BahiaCar</span>
          </Link>
        </div>
        
        {/* Navegación Desktop */}
        <nav className="hidden lg:block">
          <Link href="/catalogo">
            <Button 
              variant="outline" 
              className="font-semibold hover:bg-primary hover:text-white transition-colors text-sm xl:text-base"
            >
              Catálogo
            </Button>
          </Link>
        </nav>

        {/* Menú Móvil */}
        <Sheet>
          <SheetTrigger asChild className="lg:hidden">
            <Button variant="ghost" size="icon" className="h-9 w-9 sm:h-10 sm:w-10">
              <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="sr-only">Abrir menú</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[280px] sm:w-[320px]">
            <nav className="flex flex-col gap-4 mt-8">
              <Link href="/catalogo">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-base sm:text-lg font-semibold h-12"
                >
                  Catálogo
                </Button>
              </Link>
              <Link href="/vender">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-base sm:text-lg font-semibold h-12"
                >
                  Publicá tu vehículo
                </Button>
              </Link>
              <Link href="/contacto">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-base sm:text-lg font-semibold h-12"
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