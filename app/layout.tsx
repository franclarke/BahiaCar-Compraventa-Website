import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from "@/components/ui/toaster";
import { Header } from "@/components/header";
import { setupCleanup } from '@/lib/server-cleanup';

const inter = Inter({ subsets: ['latin'] });

// Configurar la limpieza del servidor solo en el lado del servidor
if (typeof window === 'undefined') {
  setupCleanup();
}

export const metadata: Metadata = {
  title: 'BahiaCar- Compra y Venta de Autos y Camionetas',
  description: 'La plataforma confiable en Bahía Blanca para comprar y vender autos y camionetas, nuevos y usados.',
  keywords: 'autos, camionetas, Bahía Blanca, Buenos Aires, comprar autos, vender autos, autos usados, autos nuevos, Argentina',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        {children}
        <Toaster />
      </body>
    </html>
  );
}