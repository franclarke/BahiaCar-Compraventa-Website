import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from "@/components/ui/toaster";
import { Header } from "@/components/header";
import { setupCleanup } from '@/lib/server-cleanup';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

// Configurar la limpieza del servidor solo en el lado del servidor
if (typeof window === 'undefined') {
  setupCleanup();
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
};

export const metadata: Metadata = {
  title: {
    default: 'BahiaCar - Compra y Venta de Autos y Camionetas en Bahía Blanca',
    template: '%s | BahiaCar'
  },
  description: 'La plataforma confiable en Bahía Blanca para comprar y vender autos y camionetas, nuevos y usados. Encuentra tu vehículo ideal o vende el tuyo de manera segura.',
  keywords: [
    'autos',
    'camionetas', 
    'Bahía Blanca',
    'Buenos Aires',
    'comprar autos',
    'vender autos',
    'autos usados',
    'autos nuevos',
    'Argentina',
    'concesionaria',
    'vehículos'
  ],
  authors: [{ name: 'BahiaCar' }],
  creator: 'BahiaCar',
  publisher: 'BahiaCar',
  metadataBase: new URL('https://bahiacar.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    url: 'https://bahiacar.com',
    siteName: 'BahiaCar',
    title: 'BahiaCar - Compra y Venta de Autos en Bahía Blanca',
    description: 'Encuentra tu vehículo ideal en Bahía Blanca. Plataforma confiable para comprar y vender autos y camionetas.',
    images: [
      {
        url: '/logo.svg',
        width: 1200,
        height: 630,
        alt: 'BahiaCar - Compra y Venta de Vehículos',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BahiaCar - Compra y Venta de Autos en Bahía Blanca',
    description: 'Encuentra tu vehículo ideal en Bahía Blanca. Plataforma confiable para comprar y vender autos y camionetas.',
    images: ['/logo.svg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={inter.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="preconnect" href="https://maipuexclusivos.com.ar" />
        <link rel="preconnect" href="https://fbcjdahxceizkiveteqh.supabase.co" />
        <link rel="dns-prefetch" href="https://cdn.motor1.com" />
        <link rel="dns-prefetch" href="https://static.vecteezy.com" />
        <link rel="dns-prefetch" href="https://http2.mlstatic.com" />
      </head>
      <body className={inter.className}>
        <Header />
        <main id="main-content" role="main">
          {children}
        </main>
        <Toaster />
      </body>
    </html>
  );
}