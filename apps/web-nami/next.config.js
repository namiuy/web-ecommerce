/* eslint-disable turbo/no-undeclared-env-vars */
const { ID, APP_NAME, BFF_URL, GOOGLE_MAP_API_KEY, PRODUCT_CARD_PRICE_TYPE, PRODUCT_DETAIL_PRICE_TYPE, SITE_HOST, GOOGLE_GA_MEASUREMENT_ID } = process.env;

const multiDomainItems = [
  {
    id: 'AUTOPARTS',
    text: 'AUTOPARTES',
    href: 'https://nami.com.uy',
  },
  {
    id: 'CLIMA',
    text: 'CLIMATIZACIÓN',
    //href: 'https://climatizacion.nami.com.uy',
    href: 'https://develop.d1uaun1tjxdfo9.amplifyapp.com/',
  },
  {
    id: 'TOOLS',
    text: 'HERRAMIENTAS',
    //href: 'https://herramientas.nami.com.uy',
    href: 'https://develop.dvqh13e4phd11.amplifyapp.com/',
  },
  {
    id: 'ELECTRIC',
    text: 'AUTO ELÉCTRICO',
    //href: 'https://electrico.nami.com.uy',
    href: 'https://develop.d2s9qf1omvguuy.amplifyapp.com/',
  },
].filter(item => item.id !== ID);

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
  {
    id: 'contact',
    text: 'Contacto',
    href: '/contacto',
  },
];

const socialNeworksItems = [
  {
    id: 'facebook',
    href: 'https://www.facebook.com/nami.ltda/',
  },
  {
    id: 'instagram',
    href: 'https://www.instagram.com/namiuruguay',
  },
  {
    id: 'youtube',
    href: 'https://www.youtube.com/channel/UCj-bqgJxFs0rhqB02jhxQ0g',
  },
  {
    id: 'linkedin',
    href: 'https://www.linkedin.com/company/namiuy',
  },
];

const branches = [
  {
    location: 'Montevideo',
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
    position: {
      lat: -34.87058963647513,
      lng: -56.17624398650627,
    },
    mapUrl: 'https://goo.gl/maps/8EZqjv8GDNFBBoAM9',
    position: {
      lat: -34.87058963647513,
      lng: -56.17624398650627,
    },
  },
  {
    location: 'Montevideo',
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
    position: {
      lat: -34.9003072728495,
      lng: -56.18455037487027,
    },
    mapUrl: 'https://goo.gl/maps/9Uhq6dWkB9FrVQmp6',
    position: {
      lat: -34.9003072728495,
      lng: -56.18455037487027,
    },
  },
];

module.exports = {
  reactStrictMode: true,
  transpilePackages: ['shared', 'ui'],
  publicRuntimeConfig: {
    envId: ID,
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
    },
  },
};
