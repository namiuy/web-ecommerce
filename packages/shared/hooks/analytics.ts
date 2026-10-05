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

export const trackBeginCheckout = (items: GaItem[], value: number) => {
  if (isInternalUser()) return;
  ReactGA.event('begin_checkout', { currency: CURRENCY, value, items });
};

export const trackPurchase = (transactionId: string, items: GaItem[], value: number) => {
  if (isInternalUser()) return;
  ReactGA.event('purchase', { transaction_id: transactionId, currency: CURRENCY, value, items });
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
