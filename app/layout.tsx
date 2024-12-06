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
  title: 'Auto Marketplace - Buy & Sell Cars',
  description: 'Your trusted platform for buying and selling premium vehicles',
  keywords: 'cars, auto marketplace, buy cars, sell cars, used cars, new cars',
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