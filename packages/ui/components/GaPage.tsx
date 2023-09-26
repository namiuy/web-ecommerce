/* eslint-disable react-hooks/exhaustive-deps */
import { FC, ReactElement, useEffect } from 'react';
import { Page, useAnalytics } from 'shared';

type GaPageProps = {
  page: Page;
  children: ReactElement;
};

export const GaPage: FC<GaPageProps> = ({ page, children }) => {
  const { trackPageView } = useAnalytics();
  useEffect(() => trackPageView(page), []);
  return children;
};
