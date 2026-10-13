import { useEffect, createElement } from 'react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import Script from 'next/script';
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
  ReactGA.initialize(googleGaMeasurementId, {
    gtagOptions: process.env.NODE_ENV !== 'production' ? { debug_mode: true } : undefined, // DebugView en dev
  });
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
            {/* Viriato, el mecánico de Nami: bienvenida + asistente con voz (ver public/viriato-avatar.js) */}
            <Script src="/viriato-avatar.js" strategy="afterInteractive" />
            {createElement('viriato-avatar', {
              'img-src': '/viriato.png',
              'ws-url': 'wss://ia.nami.com.uy',
              'api-url': 'https://ia.nami.com.uy',
              'products-api': 'https://api-autoparts-v2.nami.com.uy',
              'product-base': '/productos/',
              whatsapp: '59891033282',
            })}
          </ThemeProvider>
        </ChakraProvider>
      </AppContextProvider>
    </>
  );
};

export default App;
