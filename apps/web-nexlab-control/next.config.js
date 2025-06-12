/* eslint-disable turbo/no-undeclared-env-vars */
const { ID, APP_NAME, BFF_URL, SITE_HOST, GOOGLE_MAP_API_KEY, GOOGLE_GA_MEASUREMENT_ID } = process.env;

module.exports = {
  reactStrictMode: true,
  transpilePackages: ['shared', 'ui'],
  publicRuntimeConfig: {
    envId: 'NEXLAB',
    appName: APP_NAME,
    bffUrl: BFF_URL,
    siteHost: SITE_HOST,
    keys: {
      googleMapsApiKey: GOOGLE_MAP_API_KEY,
      googleGaMeasurementId: GOOGLE_GA_MEASUREMENT_ID,
    },
    product: {
      cardPriceType: 'PRODUCT_CARD_PRICE_TYPE',
      detailPriceType: 'PRODUCT_DETAIL_PRICE_TYPE',
      showCod: false,
      showRelatedProducts: false,
      showStock: false,
    },
  },
};
