import { useRouter } from 'next/router';
import ReactGA from 'react-ga4';
import lscache from 'lscache';

export type Page =
  | 'SignIn'
  | 'Home'
  | 'Company'
  | 'Products'
  | 'ProductDetail'
  | 'Brand'
  | 'Contact'
  | 'Register'
  | 'Policies'
  | 'Cart'
  | 'Checkout'
  | 'MyOrders'
  | 'ResetPassword';

type Category = 'Cart' | 'Quote';

export type GaItem = {
  item_id?: string;
  item_name?: string;
  item_category?: string;
  price?: number;
  quantity?: number;
};

const CURRENCY = 'UYU';
const INTERNAL_ROLES = ['seller', 'admin', 'administrator', 'manager']; // vendedores/admins: no cuentan en metricas de clientes

const isInternalUser = (): boolean => {
  try {
    const user = lscache.get('user');
    return Array.isArray(user?.roles) && user.roles.some((r: string) => INTERNAL_ROLES.includes(r));
  } catch {
    return false;
  }
};

export const trackSearch = (searchTerm: string) => {
  if (isInternalUser() || !searchTerm) return;
  ReactGA.event('search', { search_term: searchTerm });
};

export const trackViewSearchResults = (searchTerm: string, resultsCount: number) => {
  if (isInternalUser() || !searchTerm) return;
  if (resultsCount > 0) {
    ReactGA.event('view_search_results', { search_term: searchTerm, results_count: resultsCount });
  } else {
    ReactGA.event('search_no_results', { search_term: searchTerm }); // demanda insatisfecha
  }
};

export const trackViewItem = (item: GaItem) => {
  if (isInternalUser() || !item?.item_id) return;
  ReactGA.event('view_item', { currency: CURRENCY, value: item.price ?? 0, items: [item] });
};

export const trackAddToCart = (item: GaItem) => {
  if (isInternalUser() || !item?.item_id) return;
  ReactGA.event('add_to_cart', { currency: CURRENCY, value: (item.price ?? 0) * (item.quantity ?? 1), items: [item] });
};

export const trackRemoveFromCart = (item: GaItem) => {
  if (isInternalUser() || !item?.item_id) return;
  ReactGA.event('remove_from_cart', { currency: CURRENCY, value: (item.price ?? 0) * (item.quantity ?? 1), items: [item] });
};

export const trackViewCart = (items: GaItem[], value: number) => {
  if (isInternalUser()) return;
  ReactGA.event('view_cart', { currency: CURRENCY, value, items });
};

export const trackViewItemList = (items: GaItem[], listName: string) => {
  if (isInternalUser() || !items?.length) return;
  ReactGA.event('view_item_list', { item_list_name: listName, items });
};

export const trackSelectItem = (item: GaItem, listName: string) => {
  if (isInternalUser() || !item?.item_id) return;
  ReactGA.event('select_item', { item_list_name: listName, items: [item] });
};

export const trackBeginCheckout = (items: GaItem[], value: number) => {
  if (isInternalUser()) return;
  ReactGA.event('begin_checkout', { currency: CURRENCY, value, items });
};

export const trackAddShippingInfo = (shippingTier: string, value: number, items: GaItem[] = []) => {
  if (isInternalUser()) return;
  ReactGA.event('add_shipping_info', { currency: CURRENCY, value, shipping_tier: shippingTier, items });
};

export const trackAddPaymentInfo = (paymentType: string, value: number, items: GaItem[] = []) => {
  if (isInternalUser()) return;
  ReactGA.event('add_payment_info', { currency: CURRENCY, value, payment_type: paymentType, items });
};

export const trackPurchase = (transactionId: string, items: GaItem[], value: number) => {
  if (isInternalUser()) return;
  ReactGA.event('purchase', { transaction_id: transactionId, currency: CURRENCY, value, items });
};

export const trackLogin = (method: string) => {
  if (isInternalUser()) return;
  ReactGA.event('login', { method });
};

export const trackSignUp = (method: string) => {
  if (isInternalUser()) return;
  ReactGA.event('sign_up', { method });
};

// generate_lead: cotizacion, contacto, consulta por WhatsApp (canales fuera de la compra directa)
export const trackGenerateLead = (source: string, itemId?: string) => {
  if (isInternalUser()) return;
  ReactGA.event('generate_lead', { lead_source: source, ...(itemId ? { item_id: itemId } : {}) });
};

// Escape hatch gateado para eventos custom (variantes de busqueda, chat IA, newsletter, etc.)
export const trackEvent = (name: string, params: Record<string, any> = {}) => {
  if (isInternalUser()) return;
  ReactGA.event(name, params);
};

export const useAnalytics = () => {
  const router = useRouter();

  const trackPageView = (page: Page) => {
    if (isInternalUser()) return;
    ReactGA.send({ hitType: 'pageview', page: router.asPath, title: page });
  };

  const trackClick = (category: Category, label: string) => {
    if (isInternalUser()) return;
    ReactGA.event({ action: 'click', category, label });
  };

  return { trackPageView, trackClick };
};
