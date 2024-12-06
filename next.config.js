/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'cdn.motor1.com',
      'static.vecteezy.com',
      'http2.mlstatic.com'
    ],
  },
  swcMinify: false,
  webpack: (config, { isServer }) => {
    config.optimization.minimize = false;
    config.resolve.fallback = {
      ...config.resolve.fallback,
      punycode: false,
    };
    return config;
  },
}

module.exports = nextConfig
