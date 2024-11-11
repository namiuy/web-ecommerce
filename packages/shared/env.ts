import getConfig from 'next/config';

const { publicRuntimeConfig: prc } = getConfig();

type Keys = {
  googleMapsApiKey: string;
  googleGaMeasurementId: string;
};

type Branch = {
  address: string;
  addressDetail: string;
  schedule: string;
  phone: [
    {
      number: number;
      text: string;
    },
  ];
  whatsApp: {
    number: number;
    text: string;
  };
  location: string;
  position: { lat: number; lng: number };
  mapUrl: string;
};

type MultiDomainItem = {
  id: string;
  text: string;
  href: string;
};

type MenuItem = {
  id: string;
  text: string;
  href: string;
};

type SocialNeworkItem = {
  id: string;
  href: string;
};

type Product = {
  cardPriceType: string;
  detailPriceType: string;
  showCod: boolean;
  showRelatedProducts: boolean;
  showStock: boolean;
  showPagination: boolean;
};

export const bff = {
  url: prc.bffUrl,
};

export const envId = prc.envId;

export const appName = prc.appName;

export const siteHost = prc.siteHost;

export const keys = prc.keys as Keys;

export const branches = prc.branches as Branch[];

export const multiDomainItems = prc.multiDomainItems as MultiDomainItem[];

export const menuItems = prc.menuItems as MenuItem[];

export const socialNeworksItems = prc.socialNeworksItems as SocialNeworkItem[];

export const product = prc.product as Product;
