import getConfig from 'next/config';

const { publicRuntimeConfig: prc } = getConfig();

type Keys = {
  googleMapsApiKey: string;
  googleGaMeasurementId: string;
};

type Branch = {
  address: string;
  // detail: string; falta la direccion detallada
  schedule: string;
  // phone: string; falta el telefono fijo
  whatsApp: {
    number: number;
    text: string;
  };
  location: string;
  position: { lat: number; lng: number };
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
  afterPriceText: string;
};

export const bff = {
  url: prc.bffUrl,
};

export const keys = prc.keys as Keys;

export const branches = prc.branches as Branch[];

export const menuItems = prc.menuItems as MenuItem[];

export const socialNeworksItems = prc.socialNeworksItems as SocialNeworkItem[];

export const product = prc.product as Product;
