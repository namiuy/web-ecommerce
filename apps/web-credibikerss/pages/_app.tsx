'use client';

import type { AppProps } from 'next/app';
import { AppContextProvider } from 'shared';
import { ThemeProvider, WhatsApp } from 'ui';
import { theme } from '../theme';
import ReactGA from 'react-ga4';
import { keys } from 'shared';

const { googleGaMeasurementId } = keys;

if (googleGaMeasurementId) {
  console.log('ReactGA initialized');
  ReactGA.initialize(googleGaMeasurementId);
}

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <AppContextProvider>
      <ThemeProvider theme={theme}>
        <Component {...pageProps} />
        <WhatsApp />
      </ThemeProvider>
    </AppContextProvider>
  );
};

export default App;
