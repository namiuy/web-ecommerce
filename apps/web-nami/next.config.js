/* eslint-disable turbo/no-undeclared-env-vars */
const {
  ID,
  APP_NAME,
  PRODUCT_CARD_PRICE_TYPE,
  PRODUCT_CARD_CODE,
  PRODUCT_DETAIL_PRICE_TYPE,
  PRODUCT_DETAIL_RELATED_PRODUCTS,
  PRODUCT_DETAIL_STOCK,
  PRODUCT_PAGINATION,
  SITE_HOST,
  GOOGLE_MAP_API_KEY,
  GOOGLE_GA_MEASUREMENT_ID,
  NODE_ENV,
  CART_ENABLED,
  AUTH_ENABLED,
  PAYMENT_METHODS,
  NAVBAR_MESSAGE,
} = process.env;

const multiDomainItemsHrefProd = {
  AUTOPARTS: 'https://nami.com.uy',
  CLIMA: 'https://clima.nami.com.uy',
  TOOLS: 'https://herramientas.nami.com.uy',
  ELECTRIC: 'https://electrico.nami.com.uy',
};

const multiDomainItemsHrefDev = {
  AUTOPARTS: 'https://nami.com.uy',
  CLIMA: 'https://develop.d1uaun1tjxdfo9.amplifyapp.com/',
  TOOLS: 'https://develop.dvqh13e4phd11.amplifyapp.com/',
  ELECTRIC: 'https://develop.d2s9qf1omvguuy.amplifyapp.com/',
};

const multiDomainItemsHref = NODE_ENV == 'development' ? multiDomainItemsHrefDev : multiDomainItemsHrefProd;

const multiDomainItemsNami = [
  {
    id: 'AUTOPARTS',
    text: 'AUTOPARTES',
    href: multiDomainItemsHref['AUTOPARTS'],
  },
  {
    id: 'CLIMA',
    text: 'CLIMATIZACIÓN',
    href: multiDomainItemsHref['CLIMA'],
  },
  {
    id: 'TOOLS',
    text: 'HERRAMIENTAS',
    href: multiDomainItemsHref['TOOLS'],
  },
  {
    id: 'ELECTRIC',
    text: 'AUTO ELÉCTRICO',
    href: multiDomainItemsHref['ELECTRIC'],
  },
].filter(item => item.id !== ID);

const multiDomainItemsRobotec = [];

const multiDomainItems = ID === 'ROBOTEC' ? multiDomainItemsRobotec : multiDomainItemsNami;

const menuItemsNami = [
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

const menuItemsRobotec = [
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
    id: 'cursos',
    text: 'Cursos',
    href: 'https://www.robotec.edu.uy',
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

const menuItems = ID === 'ROBOTEC' ? menuItemsRobotec : menuItemsNami;

const socialNeworksItemsNami = [
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

const socialNeworksItemsRobotec = [
  {
    id: 'facebook',
    href: 'https://www.facebook.com/robotecuy',
  },
  {
    id: 'instagram',
    href: 'https://www.instagram.com/robotecuy',
  },
  {
    id: 'youtube',
    href: 'https://www.youtube.com/@robotecuruguay2909',
  },
  {
    id: 'linkedin',
    href: 'https://www.linkedin.com/company/robotecuy/',
  },
];

const socialNeworksItems = ID === 'ROBOTEC' ? socialNeworksItemsRobotec : socialNeworksItemsNami;

const branchesNami = [
  {
    location: 'Montevideo',
    address: 'Bvr. Artigas 3397',
    addressDetail: 'Casi Gral. Flores',
    schedule: 'Lunes a Viernes: de 8:00 a 12:30 y de 13:30 a 18:00 hrs.',
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
      number: 598098829026,
      text: '098 829 026',
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

const branchesRobotec = [
  {
    location: 'Montevideo',
    address: 'Joanicó 3258',
    addressDetail: 'Esq. Av. Dámaso A. Larrañaga',
    schedule: 'Lunes a Viernes: de 9:00 a 12:30 y de 13:00 a 18:00 hrs.',
    phone: [
      {
        number: 59824807776,
        text: '2480 7776',
      },
    ],
    whatsApp: {
      number: 598099263226,
      text: '099 263 226',
    },
    position: {
      lat: -34.88040991654218,
      lng: -56.15175340966902,
    },
    mapUrl: 'https://maps.app.goo.gl/gJc8m7AwYp2igCZNA',
  },
];

const branches = ID === 'ROBOTEC' ? branchesRobotec : branchesNami;

const enabledPaymentMethods = PAYMENT_METHODS ? PAYMENT_METHODS.split(',').map(method => method.trim()) : [];

const paymentMethods = [
  {
    id: 'SADE',
    name: 'Santander',
    description: 'Debes depositar a nombre de: Alodenar S.A. Cuenta Corriente Dólares 5100409277 sucursal 61 Cuenta Corriente Pesos 441546 sucursal 61',
  },
  {
    id: 'ITDE',
    name: 'Itaú',
    description: 'Debes depositar a nombre de: Alodenar S.A. Cuenta Corriente Dólares 492316 Cuenta Corriente Pesos 485112',
  },
  {
    id: 'ABGI',
    name: 'Abitab',
    description: 'Debes girar a nombre de: Maria Fernanda Varela CI 1977433-7',
  },
];

const availablePaymentMethods = paymentMethods.filter(method => enabledPaymentMethods.includes(method.id));

const shippingMethods = [
  {
    id: 'MON',
    name: 'Montevideo',
    description: 'Te lo enviamos a tu casa en Montevideo.',
    price: 6,
  },
  {
    id: 'AME',
    name: 'Área Metropolitana',
    description: 'Te lo enviamos a tu casa hasta Costa de Oro hasta Arroyo Pando, Ruta 8 hasta Pando, La Paz y Las Piedras.',
    price: 9,
  },
  {
    id: 'INT',
    name: 'Interior',
    description: 'Te lo enviamos por la empresa de transporte que tu nos indiques.',
    price: 0,
  },
  {
    id: 'RES',
    name: 'Retiro en el comercio',
    description: 'Lo retiras en nuestro local de Joanicó 3256 esq. Av. D. A. Larrañaga.',
    price: 0,
  },
];

const homeCategories =
  ID === 'TOOLS'
    ? [
        {
          name: 'Escáneres',
          image_url: './assets/categories/scanner.png',
          path: '10',
        },
        {
          name: 'Elevadores',
          image_url: './assets/categories/elevador.png',
          path: '9',
        },
        {
          name: 'Alineadoras',
          image_url: './assets/categories/alineadora.png',
          path: '11.30',
        },
        {
          name: 'Aire Acondicionado',
          image_url: './assets/categories/aire_acondicionado.png',
          path: '8',
        },
        {
          name: 'Osciloscopios',
          image_url: './assets/categories/osciloscopio.png',
          path: '12',
        },
        {
          name: 'Herramientas',
          image_url: './assets/categories/herramientas.png',
          path: '17',
        },
      ]
    : [];

module.exports = {
  reactStrictMode: true,
  transpilePackages: ['shared', 'ui'],
  // Explicitly set output mode for Amplify
  output: 'standalone',
  images: {
    domains: ['nami-uy.s3.sa-east-1.amazonaws.com', 'nami-tools.s3.sa-east-1.amazonaws.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.amazonaws.com',
      },
    ],
  },
  publicRuntimeConfig: {
    envId: ID,
    appName: APP_NAME,
    siteHost: SITE_HOST,
    menuItems,
    socialNeworksItems,
    multiDomainItems,
    homeCategories,
    branches,
    cartEnabled: CART_ENABLED === 'true',
    authEnabled: AUTH_ENABLED === 'true',
    paymentMethods: availablePaymentMethods,
    shippingMethods,
    navbarMessage: NAVBAR_MESSAGE,
    keys: {
      googleMapsApiKey: GOOGLE_MAP_API_KEY,
      googleGaMeasurementId: GOOGLE_GA_MEASUREMENT_ID,
    },
    product: {
      cardPriceType: PRODUCT_CARD_PRICE_TYPE,
      detailPriceType: PRODUCT_DETAIL_PRICE_TYPE,
      showCod: PRODUCT_CARD_CODE === 'true',
      showRelatedProducts: PRODUCT_DETAIL_RELATED_PRODUCTS === 'true',
      showStock: PRODUCT_DETAIL_STOCK === 'true',
      showPagination: PRODUCT_PAGINATION === 'true',
    },
  },
};
