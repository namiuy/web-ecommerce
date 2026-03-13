'use client';

import type { AppProps } from 'next/app';
import Head from 'next/head';
import { ChakraProvider } from '@chakra-ui/react';
import { AppContextProvider } from 'shared';
import { ThemeProvider, WhatsApp } from 'ui';
import { theme } from '../theme/index';
import ReactGA from 'react-ga4';
import { useEffect, useState } from 'react';

const App = ({ Component, pageProps }: AppProps) => {
  const [faviconPath, setFaviconPath] = useState('/favicon-tools.ico');

  // Initialize Google Analytics and favicon only on client side
  useEffect(() => {
    // Dynamically import env to avoid server-side execution
    import('shared').then(({ keys, envId }) => {
      const { googleGaMeasurementId } = keys;

      if (googleGaMeasurementId && !ReactGA.isInitialized) {
        console.log('ReactGA initialized');
        ReactGA.initialize(googleGaMeasurementId);
      }

      const favicon = envId === 'ROBOTEC' ? '/favicon-robotec.ico' : '/favicon-tools.ico';
      setFaviconPath(favicon);
    });
  }, []);

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
