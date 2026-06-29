import getConfig from 'next/config';
import { PaymentMethod } from './entities/payment-method';
import { ShippingMethod } from './entities/shipping-method';
import { Color } from './entities/color';

// Lazy getter to avoid build-time execution
let _prc: any = null;
const getPrc = () => {
  if (_prc === null) {
    try {
      const { publicRuntimeConfig } = getConfig();
      _prc = publicRuntimeConfig || {};
    } catch (error) {
      // Return empty object during build or when config is not available
      console.warn('getConfig() not available, using empty config');
      _prc = {};
    }
  }
  return _prc;
};

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
  currencySymbol: string;
};

// Export getter functions
export const getBff = () => ({ url: getPrc().bffUrl });
export const getEnvId = () => getPrc().envId;
export const getAppName = () => getPrc().appName;
export const getSiteHost = () => getPrc().siteHost;
export const getKeys = () => getPrc().keys as Keys;
export const getBranches = () => getPrc().branches as Branch[];
export const getCartEnabled = () => getPrc().cartEnabled as boolean;
export const getAuthEnabled = () => getPrc().authEnabled as boolean;
export const getProductFormPhotoUpload = () => getPrc().productFormPhotoUpload as boolean;
export const getMultiDomainItems = () => getPrc().multiDomainItems as MultiDomainItem[];
export const getPaymentMethods = () => getPrc().paymentMethods as PaymentMethod[];
export const getShippingMethods = () => getPrc().shippingMethods as ShippingMethod[];
export const getHomeCategories = () => getPrc().homeCategories as HomeCategory[];
export const getMenuItems = () => getPrc().menuItems as MenuItem[];
export const getSocialNeworksItems = () => getPrc().socialNeworksItems as SocialNeworkItem[];
export const getProduct = () => getPrc().product as Product;
export const getColors = () => getPrc().colors as Color[];
export const getNavbarMessage = () => getPrc().navbarMessage;
export const getBannerLimit = () => getPrc().bannerLimit as number || 0;

// bff export for backwards compatibility
export const bff = {
  get url() {
    return getBff().url;
  }
};
