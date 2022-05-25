/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
      NEXT_SERVER_PORT: process.env.NEXT_SERVER_PORT,
      NEXT_SERVER_HOST: process.env.NEXT_SERVER_HOST,
  },
  experimental: {
    outputStandalone: true,
  },
}

module.exports = nextConfig
