import getConfig from 'next/config';

const {
  publicRuntimeConfig: { bffUrl },
} = getConfig();

export const bff = {
  url: bffUrl,
};
