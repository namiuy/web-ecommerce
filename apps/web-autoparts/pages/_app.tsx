import { useEffect } from 'react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { ChakraProvider } from '@chakra-ui/react';
import { AppContextProvider } from 'shared';
import { ThemeProvider, WhatsApp } from 'ui';
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
  useEffect(() => {
    fetch(`${config.autopartsApiBaseUrl}/api/log-visit?source=web-autoparts`, { method: 'POST' }).catch(() => {});
  }, []);

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
          </ThemeProvider>
        </ChakraProvider>
      </AppContextProvider>
    </>
  );
};

export default App;
