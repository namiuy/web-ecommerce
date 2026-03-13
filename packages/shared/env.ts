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

// Legacy exports for backwards compatibility
// Note: These are evaluated lazily via getters on first access
let _bff: any;
let _envId: any;
let _appName: any;
let _siteHost: any;
let _keys: any;
let _branches: any;
let _cartEnabled: any;
let _authEnabled: any;
let _productFormPhotoUpload: any;
let _multiDomainItems: any;
let _paymentMethods: any;
let _shippingMethods: any;
let _homeCategories: any;
let _menuItems: any;
let _socialNeworksItems: any;
let _product: any;
let _colors: any;
let _navbarMessage: any;

export const bff = {
  get url() {
    if (!_bff) _bff = getPrc();
    return _bff.bffUrl;
  }
};

Object.defineProperty(module.exports || exports, 'envId', {
  get() {
    if (_envId === undefined) _envId = getPrc().envId;
    return _envId;
  },
  enumerable: true
});

Object.defineProperty(module.exports || exports, 'appName', {
  get() {
    if (_appName === undefined) _appName = getPrc().appName;
    return _appName;
  },
  enumerable: true
});

Object.defineProperty(module.exports || exports, 'siteHost', {
  get() {
    if (_siteHost === undefined) _siteHost = getPrc().siteHost;
    return _siteHost;
  },
  enumerable: true
});

Object.defineProperty(module.exports || exports, 'keys', {
  get() {
    if (_keys === undefined) _keys = getPrc().keys as Keys;
    return _keys;
  },
  enumerable: true
});

Object.defineProperty(module.exports || exports, 'branches', {
  get() {
    if (_branches === undefined) _branches = getPrc().branches as Branch[];
    return _branches;
  },
  enumerable: true
});

Object.defineProperty(module.exports || exports, 'cartEnabled', {
  get() {
    if (_cartEnabled === undefined) _cartEnabled = getPrc().cartEnabled as boolean;
    return _cartEnabled;
  },
  enumerable: true
});

Object.defineProperty(module.exports || exports, 'authEnabled', {
  get() {
    if (_authEnabled === undefined) _authEnabled = getPrc().authEnabled as boolean;
    return _authEnabled;
  },
  enumerable: true
});

Object.defineProperty(module.exports || exports, 'productFormPhotoUpload', {
  get() {
    if (_productFormPhotoUpload === undefined) _productFormPhotoUpload = getPrc().productFormPhotoUpload as boolean;
    return _productFormPhotoUpload;
  },
  enumerable: true
});

Object.defineProperty(module.exports || exports, 'multiDomainItems', {
  get() {
    if (_multiDomainItems === undefined) _multiDomainItems = getPrc().multiDomainItems as MultiDomainItem[];
    return _multiDomainItems;
  },
  enumerable: true
});

Object.defineProperty(module.exports || exports, 'paymentMethods', {
  get() {
    if (_paymentMethods === undefined) _paymentMethods = getPrc().paymentMethods as PaymentMethod[];
    return _paymentMethods;
  },
  enumerable: true
});

Object.defineProperty(module.exports || exports, 'shippingMethods', {
  get() {
    if (_shippingMethods === undefined) _shippingMethods = getPrc().shippingMethods as ShippingMethod[];
    return _shippingMethods;
  },
  enumerable: true
});

Object.defineProperty(module.exports || exports, 'homeCategories', {
  get() {
    if (_homeCategories === undefined) _homeCategories = getPrc().homeCategories as HomeCategory[];
    return _homeCategories;
  },
  enumerable: true
});

Object.defineProperty(module.exports || exports, 'menuItems', {
  get() {
    if (_menuItems === undefined) _menuItems = getPrc().menuItems as MenuItem[];
    return _menuItems;
  },
  enumerable: true
});

Object.defineProperty(module.exports || exports, 'socialNeworksItems', {
  get() {
    if (_socialNeworksItems === undefined) _socialNeworksItems = getPrc().socialNeworksItems as SocialNeworkItem[];
    return _socialNeworksItems;
  },
  enumerable: true
});

Object.defineProperty(module.exports || exports, 'product', {
  get() {
    if (_product === undefined) _product = getPrc().product as Product;
    return _product;
  },
  enumerable: true
});

Object.defineProperty(module.exports || exports, 'colors', {
  get() {
    if (_colors === undefined) _colors = getPrc().colors as Color[];
    return _colors;
  },
  enumerable: true
});

Object.defineProperty(module.exports || exports, 'navbarMessage', {
  get() {
    if (_navbarMessage === undefined) _navbarMessage = getPrc().navbarMessage;
    return _navbarMessage;
  },
  enumerable: true
});
