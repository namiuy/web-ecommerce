import { useRouter } from 'next/router';
import ReactGA from 'react-ga4';

export type Page = 'SignIn' | 'Home' | 'Company' | 'Products' | 'ProductDetail' | 'Brand' | 'Contact' | 'Register';

type Category = 'Cart' | 'Quote';

export const useAnalytics = () => {
  const router = useRouter();

  const trackPageView = (page: Page) => {
    ReactGA.send({ hitType: 'pageview', page: router.asPath, title: page });
  };

  const trackClick = (category: Category, label: string) => {
    ReactGA.event({
      action: 'click',
      category,
      label,
    });
  };

  return { trackPageView, trackClick };
};
