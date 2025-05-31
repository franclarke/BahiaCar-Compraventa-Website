/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'cdn.motor1.com',
      'static.vecteezy.com',
      'http2.mlstatic.com',
      'fbcjdahxceizkiveteqh.supabase.co',
      'maipuexclusivos.com.ar'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 31536000,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  experimental: {
    serverComponentsExternalPackages: ['@supabase/supabase-js'],
    optimizeCss: true,
    scrollRestoration: true,
  },
  swcMinify: true,
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  webpack: (config, { isServer, dev }) => {
    // Configuración para manejar las dependencias problemáticas
    config.resolve.fallback = {
      ...config.resolve.fallback,
      punycode: false,
      fs: false,
      net: false,
      tls: false,
      child_process: false,
    };

    // Ignorar módulos opcionales de ws
    config.externals = config.externals || [];
    config.externals.push({
      'bufferutil': 'bufferutil',
      'utf-8-validate': 'utf-8-validate',
    });

    // Optimizaciones de producción
    if (!dev) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            enforce: true,
          },
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            enforce: true,
          },
        },
      };
    }

    return config;
  },
  eslint: {
    // Solo ignorar durante el build si es necesario
    ignoreDuringBuilds: false,
  },
  typescript: {
    // Solo ignorar durante el build si es necesario
    ignoreBuildErrors: false,
  },
}

module.exports = nextConfig
