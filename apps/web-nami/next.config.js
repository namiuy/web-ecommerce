/* eslint-disable turbo/no-undeclared-env-vars */

const { APP_NAME, BFF_URL, GOOGLE_MAP_API_KEY } = process.env;

const menuItems = [
  {
    id: 'index',
    text: 'Inicio',
    href: '/',
  },
  {
    id: 'products',
    text: 'Productos',
    href: '/productos',
  },
  {
    id: 'services',
    text: 'Servicios',
    href: '/servicios',
  },
  {
    id: 'company',
    text: 'Empresa',
    href: '/empresa',
  },
];

const socialNeworksItems = [
  {
    id: 'facebook',
    href: '/',
  },
  {
    id: 'instagram',
    href: '/',
  },
  {
    id: 'tiktok',
    href: '/',
  },
  {
    id: 'whatsapp',
    href: '/',
  },
];

module.exports = {
  reactStrictMode: true,
  transpilePackages: ['shared', 'ui'],
  publicRuntimeConfig: {
    appName: APP_NAME,
    bffUrl: BFF_URL,
    menuItems,
    socialNeworksItems,
    keys: {
      googleMapsApiKey: GOOGLE_MAP_API_KEY,
    },
  },
};
