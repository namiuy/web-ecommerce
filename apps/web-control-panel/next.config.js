/* eslint-disable turbo/no-undeclared-env-vars */

const { ID, APP_NAME, BFF_URL, GOOGLE_MAP_API_KEY, GOOGLE_GA_MEASUREMENT_ID } = process.env;

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
    },
  },
};
