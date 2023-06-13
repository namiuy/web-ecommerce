import getConfig from 'next/config';

const { publicRuntimeConfig: prc } = getConfig();

type SocialNeworkItem = {
  id: string;
  href: string;
};

export const bff = {
  url: prc.bffUrl,
};

export const keys = prc.keys;

export const menuItems = prc.menuItems;

export const socialNeworksItems = prc.socialNeworksItems as SocialNeworkItem[];
