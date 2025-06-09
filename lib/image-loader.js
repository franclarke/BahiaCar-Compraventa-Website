/**
 * Custom image loader for Netlify deployment
 * Handles image optimization and fallbacks
 */
export default function imageLoader({ src, width, quality = 70 }) {
  // Si es una imagen local (SVG o archivos estáticos)
  if (src.startsWith('/')) {
    // Para imágenes locales en Netlify, usar la URL tal como está
    // Netlify servirá los archivos estáticos directamente
    return src
  }

  // Si es una imagen externa de Supabase
  if (src.includes('supabase.co')) {
    // Para imágenes de Supabase Storage, mantener la URL original pero añadir parámetros de optimización
    const url = new URL(src)
    url.searchParams.set('width', width.toString())
    url.searchParams.set('quality', Math.min(quality, 75).toString()) // Máximo 75% para Supabase
    return url.toString()
  }

  // Para imágenes externas que necesitan optimización
  if (src.startsWith('http')) {
    // Para dominios específicos que pueden necesitar optimización
    const allowedDomains = [
      'cdn.motor1.com',
      'static.vecteezy.com',
      'http2.mlstatic.com',
      'maipuexclusivos.com.ar',
      'images.unsplash.com'
    ]
    
    const url = new URL(src)
    if (allowedDomains.some(domain => url.hostname.includes(domain))) {
      // Intentar usar Next.js image optimization si está disponible
      const params = new URLSearchParams()
      params.set('url', src)
      params.set('w', width.toString())
      params.set('q', Math.min(quality, 70).toString()) // Máximo 70% para dominios externos
      
      return `/_next/image?${params.toString()}`
    }
    
    // Para otros dominios externos, usar la URL original
    return src
  }

  // Fallback: devolver la URL original
  return src
} 