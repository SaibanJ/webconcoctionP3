/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  allowedDevOrigins: ['172.20.20.20'],
  env: {
    NAMECHEAP_USERNAME: process.env.NAMECHEAP_USERNAME,
    NAMECHEAP_API_KEY: process.env.NAMECHEAP_API_KEY,
    NAMECHEAP_CLIENT_IP: process.env.NAMECHEAP_CLIENT_IP,
    NAMECHEAP_SANDBOX: process.env.NAMECHEAP_SANDBOX,
    WHM_API_TOKEN: process.env.WHM_API_TOKEN,
    WHM_USERNAME: process.env.WHM_USERNAME,
    WHM_HOST: process.env.WHM_HOST
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
