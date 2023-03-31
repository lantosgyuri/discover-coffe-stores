/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  reactStrictMode: false,
  images: {
    domains: ["images.unsplash.com"],
  },
};

module.exports = nextConfig;
