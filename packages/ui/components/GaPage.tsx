/* eslint-disable react-hooks/exhaustive-deps */
import { ReactElement, useEffect } from 'react';
import { Page, useAnalytics } from 'shared';

type GaPageProps = {
  page: Page;
  children: ReactElement;
};

export const GaPage = ({ page, children }: GaPageProps) => {
  const { trackPageView } = useAnalytics();
  useEffect(() => trackPageView(page), []);
  return children;
};
