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
    id: 'company',
    text: 'Empresa',
    href: '/empresa',
  },
];

const socialNeworksItems = [
  {
    id: 'facebook',
    href: 'https://www.facebook.com/Credibikerss',
  },
  {
    id: 'instagram',
    href: 'https://www.instagram.com/credibikerss',
  },
  {
    id: 'tiktok',
    href: 'https://www.tiktok.com/@credibikerss',
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
    product: {
      afterPriceText: PRODUCT_AFTER_PRICE_TEXT,
    },
  },
};
