/* eslint-disable turbo/no-undeclared-env-vars */

const {
  APP_NAME,
  BFF_URL,
  GOOGLE_MAP_API_KEY,
  PRODUCT_CARD_PRICE_TYPE,
  PRODUCT_CARD_CODE,
  PRODUCT_DETAIL_PRICE_TYPE,
  PRODUCT_DETAIL_RELATED_PRODUCTS,
  PRODUCT_DETAIL_STOCK,
  SITE_HOST,
  GOOGLE_GA_MEASUREMENT_ID,
} = process.env;

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

const multiDomainItems = [];

const branches = [
  {
    location: 'Montevideo',
    address: 'Mercedes 1789, esq. Tristán Narvaja',
    schedule: 'Lunes a viernes de 10:00 a 19:00 y sabados de 10:00 a 13:00 hrs',
    whatsApp: {
      number: 598097530690,
      text: '097 530 690',
    },
    position: { lat: -34.900745, lng: -56.178579 },
    mapUrl: 'https://maps.app.goo.gl/HFfUmgWHC6NU8d2B6',
  },
  {
    location: 'Las Piedras',
    address: 'Av. Dr. Enrique Pouey 711, esq. Aparicio Saravia',
    schedule: 'Lunes a viernes de 10:00 a 19:00 y sabados de 10:00 a 13:00 hrs',
    whatsApp: {
      number: 598092555609,
      text: '092 555 609',
    },
    position: { lat: -34.7308552, lng: -56.2236266 },
    mapUrl: 'https://maps.app.goo.gl/1zXx8qUZdsgGxNQv7',
  },
];

module.exports = {
  reactStrictMode: true,
  transpilePackages: ['shared', 'ui'],
  publicRuntimeConfig: {
    envId: 'CREDI',
    appName: APP_NAME,
    bffUrl: BFF_URL,
    siteHost: SITE_HOST,
    menuItems,
    socialNeworksItems,
    multiDomainItems,
    branches,
    keys: {
      googleMapsApiKey: GOOGLE_MAP_API_KEY,
      googleGaMeasurementId: GOOGLE_GA_MEASUREMENT_ID,
    },
    product: {
      cardPriceType: PRODUCT_CARD_PRICE_TYPE,
      detailPriceType: PRODUCT_DETAIL_PRICE_TYPE,
      showCod: PRODUCT_CARD_CODE,
      showRelatedProducts: PRODUCT_DETAIL_RELATED_PRODUCTS,
      showStock: PRODUCT_DETAIL_STOCK,
    },
  },
};
