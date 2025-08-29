import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from "@/components/ui/toaster";
import { Header } from "@/components/header";
import { cn } from '@/lib/utils';
import { ConditionalHeader } from '@/components/conditional-header';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

// TODO: Re-habilitar setupCleanup cuando se resuelva el error de webpack
// if (typeof window === 'undefined') {
//   setupCleanup();
// }

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0F172A' },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL('https://bahiacarcompraventa.netlify.app'),
  title: {
    default: 'SYM Automotores - Compra y Venta de Autos en Bahía Blanca',
    template: '%s | SYM Automotores'
  },
  description: 'La plataforma confiable en Bahía Blanca para comprar y vender autos y camionetas. Encuentra tu vehículo ideal o publica tu auto para vender.',
  keywords: [
    'autos bahía blanca',
    'venta autos',
    'compra autos',
    'camionetas',
    'vehículos usados',
    'concesionaria',
    'bahía blanca',
    'autos usados bahía blanca',
    'compraventa autos',
    'SYM automotores',
    'financiación autos',
    'autos 0km',
    'plan de ahorro'
  ],
  authors: [{ name: 'SYM Automotores' }],
  creator: 'SYM Automotores',
  publisher: 'SYM Automotores',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    url: 'https://bahiacarcompraventa.netlify.app',
    siteName: 'SYM Automotores',
    title: 'SYM Automotores - Compra y Venta de Autos en Bahía Blanca',
    description: 'La plataforma confiable en Bahía Blanca para comprar y vender autos y camionetas.',
    images: [
      {
        url: '/favicon.ico',
        width: 1200,
        height: 630,
        alt: 'SYM Automotores Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SYM Automotores - Compra y Venta de Autos',
    description: 'La plataforma confiable en Bahía Blanca para comprar y vender autos y camionetas.',
    images: ['/android-chrome-512x512.svg'],
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
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.svg', sizes: '16x16', type: 'image/svg+xml' },
      { url: '/favicon-32x32.svg', sizes: '32x32', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [],
  },
  alternates: {
    canonical: '/',
  },
  applicationName: 'SYM Automotores',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'SYM Automotores',
    startupImage: [],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={inter.variable} suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#0F172A" />
        <meta name="color-scheme" content="light dark" />

        {/* Preconnect para recursos críticos */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="preconnect" href="https://maipuexclusivos.com.ar" />
        <link rel="preconnect" href="https://fbcjdahxceizkiveteqh.supabase.co" />
        
        {/* DNS prefetch para recursos secundarios */}
        <link rel="dns-prefetch" href="https://cdn.motor1.com" />
        <link rel="dns-prefetch" href="https://static.vecteezy.com" />
        <link rel="dns-prefetch" href="https://http2.mlstatic.com" />
        
        {/* Favicons adicionales para máxima compatibilidad */}
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        
        {/* PWA Manifest */}
        <link rel="manifest" href="/manifest.json" />
        
        {/* Meta tags adicionales para PWA */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="SYM Automotores" />
        <meta name="application-name" content="SYM Automotores" />
        <meta name="msapplication-TileColor" content="#0F172A" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
      </head>
      <body 
        className={cn(
          inter.className,
          'min-h-screen bg-background font-sans antialiased text-mobile-optimized'
        )}
        suppressHydrationWarning
      >
        <div className="relative flex min-h-screen flex-col safe-area-inset-bottom">
          <div className="flex-1">
            <ConditionalHeader />
            <main id="main-content" role="main" className="scroll-smooth-mobile">
              {children}
            </main>
          </div>
        </div>
        <Toaster />
      </body>
    </html>
  );
}