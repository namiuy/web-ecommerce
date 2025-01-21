/* eslint-disable turbo/no-undeclared-env-vars */

const { ID, APP_NAME, BFF_URL, GOOGLE_MAP_API_KEY, GOOGLE_GA_MEASUREMENT_ID, PRODUCT_COLORS } = process.env;

const colors = [
  { id: 'red', color: '#FF0000', name: 'Rojo' },
  { id: 'black', color: '#000000', name: 'Negro' },
  { id: 'blue', color: '#0000FF', name: 'Azul' },
  { id: 'green', color: '#008000', name: 'Verde' },
  { id: 'yellow', color: '#FFFF00', name: 'Amarillo' },
  { id: 'purple', color: '#800080', name: 'Morado' },
];

module.exports = {
  reactStrictMode: true,
  transpilePackages: ['shared', 'ui'],
  publicRuntimeConfig: {
    envId: ID,
    appName: APP_NAME,
    bffUrl: BFF_URL,
    menuItems: [],
    socialNeworksItems: [],
    branches: [],
    keys: {
      googleMapsApiKey: GOOGLE_MAP_API_KEY,
      googleGaMeasurementId: GOOGLE_GA_MEASUREMENT_ID,
    },
    product: {
      afterPriceText: '',
      showColors: PRODUCT_COLORS === 'true',
    },
    colors,
  },
};
