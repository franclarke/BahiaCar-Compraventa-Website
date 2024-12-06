"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function Header() {
  return (
    <header className="fixed w-full h-14 md:h-16 bg-white/80 backdrop-blur-sm z-50 border-b">
      <div className="container mx-auto h-full px-4 flex items-center justify-between">
        {/* Logo y nombre - Oculto en móvil, visible en tablet/desktop */}
        <Link 
          href="/"
          className="hidden md:flex text-xl md:text-2xl font-bold hover:text-primary transition-colors items-center"
        >
          <span>BahiaCar</span>
        </Link>

        {/* Logo central */}
        <div className="flex md:absolute md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2">
          <Link href="/" className="flex items-center space-x-2">
            <div className="relative w-8 h-8 md:w-12 md:h-12">
              <Image
                src="/logo.svg"
                alt="AutoCar Bahia Logo"
                width={48}
                height={48}
                className="object-contain"
                priority
              />
            </div>
            {/* Nombre visible solo en móvil */}
            <span className="text-lg font-semibold md:hidden">BahiaCar</span>
          </Link>
        </div>
        
        {/* Navegación Desktop */}
        <nav className="hidden md:block">
          <Link href="/catalogo">
            <Button 
              variant="outline" 
              className="font-semibold hover:bg-primary hover:text-white transition-colors"
            >
              Catálogo
            </Button>
          </Link>
        </nav>

        {/* Menú Móvil */}
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[250px] sm:w-[300px]">
            <nav className="flex flex-col gap-4 mt-8">
              <Link href="/catalogo">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-lg font-semibold"
                >
                  Catálogo
                </Button>
              </Link>
              <Link href="/vender">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-lg font-semibold"
                >
                  Vender mi Auto
                </Button>
              </Link>
              <Link href="/contacto">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-lg font-semibold"
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