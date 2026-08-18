import { useEffect, useCallback } from 'react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { ChakraProvider } from '@chakra-ui/react';
import { AppContextProvider } from 'shared';
import { ThemeProvider, WhatsApp, AIChatWidget } from 'ui';
import { theme } from '../theme/index';
import ReactGA from 'react-ga4';
import { getKeys, getEnvId } from 'shared';
import { config } from '../lib/config';

const keys = getKeys();
const googleGaMeasurementId = keys?.googleGaMeasurementId;

if (googleGaMeasurementId) {
  console.log('ReactGA initialized');
  ReactGA.initialize(googleGaMeasurementId);
}

const App = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();

  useEffect(() => {
    fetch(`${config.autopartsApiBaseUrl}/api/log-visit?source=web-autoparts`, { method: 'POST' }).catch(() => {});
  }, []);

  const handleProductSearch = useCallback((query: string) => {
    setTimeout(() => {
      router.push(`/productos?t=${encodeURIComponent(query)}`);
    }, 1500);
  }, [router]);

  return (
    <>
      <Head>
        <link rel="icon" type="image/x-icon" href='/favicon-tools.ico' />
        <title>Nami</title>
      </Head>
      <AppContextProvider>
        <ChakraProvider>
          <ThemeProvider theme={theme}>
            <Component {...pageProps} />
            <WhatsApp />
            {/* <AIChatWidget onProductSearch={handleProductSearch} /> */}
          </ThemeProvider>
        </ChakraProvider>
      </AppContextProvider>
    </>
  );
};

export default App;
