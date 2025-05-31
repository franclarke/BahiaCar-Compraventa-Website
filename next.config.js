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
  },
  experimental: {
    serverComponentsExternalPackages: ['@supabase/supabase-js'],
  },
  swcMinify: false,
  webpack: (config, { isServer }) => {
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

    // Solo desactivar minificación en desarrollo
    if (!isServer && process.env.NODE_ENV === 'development') {
      config.optimization.minimize = false;
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
