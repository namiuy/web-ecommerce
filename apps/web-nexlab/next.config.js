/* eslint-disable turbo/no-undeclared-env-vars */
// const { } = process.env;

module.exports = {
  reactStrictMode: true,
  transpilePackages: ['shared', 'ui'],
  publicRuntimeConfig: {
    envId: 'NEXLAB',
    appName: 'NexLab',
    bffUrl: 'https://',
    siteHost: 'https://',
    // menuItems,
    // socialNeworksItems,
    // multiDomainItems,
    // branches,
    keys: {
      googleMapsApiKey: 'GOOGLE_MAP_API_KEY',
      googleGaMeasurementId: 'GOOGLE_GA_MEASUREMENT_ID',
    },
    product: {
      cardPriceType: 'PRODUCT_CARD_PRICE_TYPE',
      detailPriceType: 'PRODUCT_DETAIL_PRICE_TYPE',
      showCod: false,
      showRelatedProducts: false,
      showStock: false
    },
  },
};
