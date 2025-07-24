'use client';

import type { AppProps } from 'next/app';
import Head from 'next/head';
import { ChakraProvider } from '@chakra-ui/react';
import { AppContextProvider } from 'shared';
import { ThemeProvider, WhatsApp } from 'ui';
import { theme } from '../theme/index';
import ReactGA from 'react-ga4';
import { keys, envId } from 'shared';

const { googleGaMeasurementId } = keys;

if (googleGaMeasurementId) {
  console.log('ReactGA initialized');
  ReactGA.initialize(googleGaMeasurementId);
}

const App = ({ Component, pageProps }: AppProps) => {
  const faviconPath = envId === 'ROBOTEC' ? '/favicon-robotec.ico' : '/favicon-tools.ico';

  return (
    <>
      <Head>
        <link rel="icon" type="image/x-icon" href={faviconPath} />
      </Head>
      <AppContextProvider>
        <ChakraProvider>
          <ThemeProvider theme={theme}>
            <Component {...pageProps} />
            <WhatsApp />
          </ThemeProvider>
        </ChakraProvider>
      </AppContextProvider>
    </>
  );
};

export default App;
