"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="fixed w-full h-16 bg-white/80 backdrop-blur-sm z-50 border-b">
      <div className="container mx-auto h-full px-4 flex items-center justify-between">
        {/* Logo y nombre */}
        <Link 
          href="/"
          className="text-2xl font-bold hover:text-primary transition-colors flex items-center"
        >
          <span className="">BahiaCar Compraventa</span>
        </Link>

        {/* Logo central */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="relative w-12 h-12">
            <Link href="/">
            <Image
              src="/logo.svg"
              alt="AutoCar Bahia Logo"
              width={48}
              height={48}
              className="object-contain"
              priority
            />
            </Link>
          </div>
        </div>
        
        {/* Navegación */}
        <nav>
          <Link href="/catalogo">
            <Button 
              variant="outline" 
              className="font-semibold hover:bg-primary hover:text-white transition-colors"
            >
              Catálogo
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}