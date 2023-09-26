/* eslint-disable turbo/no-undeclared-env-vars */

const { APP_NAME, BFF_URL, GOOGLE_MAP_API_KEY, PRODUCT_AFTER_PRICE_TEXT } = process.env;

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

const branches = [
  {
    address: 'Bvr. Artigas 3397',
    schedule: 'Lunes a Viernes: de 8:00 a 12:00 y de 13:30 a 18:30 hrs.',
    whatsApp: {
      number: 598098000600,
      text: '098 000 600',
    },
    location: 'https://goo.gl/maps/8EZqjv8GDNFBBoAM9',
  },
  {
    address: 'Cerro Largo 1518',
    schedule: 'Lunes a Viernes: de 8:00 a 12:30 y de 13:30 a 18:00 hrs.',
    whatsApp: {
      number: 598091033282,
      text: '091 033 282',
    },
    location: 'https://goo.gl/maps/9Uhq6dWkB9FrVQmp6',
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
    branches,
    keys: {
      googleMapsApiKey: GOOGLE_MAP_API_KEY,
    },
    product: {
      afterPriceText: PRODUCT_AFTER_PRICE_TEXT,
    },
  },
};
