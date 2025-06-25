import getConfig from 'next/config';
import { PaymentMethod } from './entities/payment-method';
import { ShippingMethod } from './entities/shipping-method';
import { Color } from './entities/color';

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

type HomeCategory = {
  name: string;
  image_url: string;
  path: string;
};

type Product = {
  cardPriceType: string;
  detailPriceType: string;
  showCod: boolean;
  showRelatedProducts: boolean;
  showStock: boolean;
  showPagination: boolean;
  showColors: boolean;
};

export const bff = {
  url: prc.bffUrl,
};

export const envId = prc.envId;

export const appName = prc.appName;

export const siteHost = prc.siteHost;

export const keys = prc.keys as Keys;

export const branches = prc.branches as Branch[];

export const cartEnabled = prc.cartEnabled as boolean;

export const authEnabled = prc.authEnabled as boolean;

export const multiDomainItems = prc.multiDomainItems as MultiDomainItem[];

export const paymentMethods = prc.paymentMethods as PaymentMethod[];

export const shippingMethods = prc.shippingMethods as ShippingMethod[];

export const homeCategories = prc.homeCategories as HomeCategory[];

export const menuItems = prc.menuItems as MenuItem[];

export const socialNeworksItems = prc.socialNeworksItems as SocialNeworkItem[];

export const product = prc.product as Product;

export const colors = prc.colors as Color[];
