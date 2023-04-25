/* eslint-disable turbo/no-undeclared-env-vars */

const { BFF_URL } = process.env;

module.exports = {
  reactStrictMode: true,
  transpilePackages: ['shared', 'ui'],
  publicRuntimeConfig: {
    appName: 'Nami',
    bffUrl: BFF_URL
  },
};
