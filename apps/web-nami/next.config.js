/* eslint-disable turbo/no-undeclared-env-vars */

const { APP_NAME, BFF_URL, GOOGLE_MAP_API_KEY, PRODUCT_AFTER_PRICE_TEXT, SITE_HOST } = process.env;

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
  {
    id: 'blog',
    text: 'Blog',
    href: '/blog',
  },
  {
    id: 'contact',
    text: 'Contacto',
    href: '/contacto',
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
  {
    id: 'youtube',
    href: '/',
  },
  {
    id: 'linkedin',
    href: '/',
  },
];

const branches = [
  {
    location : 'Montevideo',
    address: 'Bvr. Artigas 3397',
    addressDetail: 'Casi Gral. Flores',
    schedule: 'Lunes a Viernes: de 8:00 a 12:00 y de 13:30 a 18:30 hrs.',
    phone: [
      {
        number: 59822001350,
        text: '2200 1350',
      },
      {
        number: 59822034381,
        text: '2203 4381',
      },
    ],
    whatsApp: {
      number: 598098000600,
      text: '098 000 600',
    },
    mapUrl: 'https://goo.gl/maps/8EZqjv8GDNFBBoAM9',
  },
  {
    location : 'Montevideo',
    address: 'Cerro Largo 1518',
    addressDetail: 'Esq. Piedra Alta',
    schedule: 'Lunes a Viernes: de 8:00 a 12:30 y de 13:30 a 18:00 hrs.',
    phone: [
      {
        number: 59824020922,
        text: '2402 0922',
      },
      {
        number: 59824020031,
        text: '2402 0031',
      },
    ],
    whatsApp: {
      number: 598091033282,
      text: '091 033 282',
    },
    mapUrl: 'https://goo.gl/maps/9Uhq6dWkB9FrVQmp6',
  },
];

module.exports = {
  reactStrictMode: true,
  transpilePackages: ['shared', 'ui'],
  publicRuntimeConfig: {
    appName: APP_NAME,
    bffUrl: BFF_URL,
    siteHost: SITE_HOST,
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
