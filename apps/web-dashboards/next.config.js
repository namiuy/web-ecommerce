/** @type {import('next').NextConfig} */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''; // vacio = test directo por puerto; set = tras el proxy del portal
module.exports = {
  reactStrictMode: true,
  basePath: basePath || undefined,
  assetPrefix: basePath || undefined,
  eslint: { ignoreDuringBuilds: true }, // app standalone (sin eslint-config del workspace)
};
