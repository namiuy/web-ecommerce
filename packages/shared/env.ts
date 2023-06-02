import getConfig from 'next/config';

const {
  publicRuntimeConfig: { bffUrl },
} = getConfig();
console.log('env', bffUrl);

export const bff = {
  url: bffUrl,
};
