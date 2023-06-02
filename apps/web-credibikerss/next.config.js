/* eslint-disable turbo/no-undeclared-env-vars */

const { APP_NAME, BFF_URL } = process.env;
console.log('next.config', BFF_URL)
module.exports = {
  reactStrictMode: true,
  transpilePackages: ['shared', 'ui'],
  publicRuntimeConfig: {
    appName: APP_NAME,
    bffUrl: BFF_URL
  },
};
