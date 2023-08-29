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

const branches = [
  {
    loaction: 'Montevideo',
    address: 'Mercedes 1789, esq. Tristán Narvaja',
    whatsApp: {
      number: 598097530690,
      text: '097 530 690',
    },
    position: { lat: -34.900745, lng: -56.178579 },
  },
  {
    loaction: 'Las Piedras',
    address: 'Av. Dr. Enrique Pouey 711, esq. Aparicio Saravia',
    whatsApp: {
      number: 598092555609,
      text: '092 555 609',
    },
    position: { lat: -34.7308552, lng: -56.2236266 },
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
      afterPriceText: '+ IVA',
    },
  },
};
