'use client';

import type { AppProps } from 'next/app';
import Head from 'next/head';
import Script from 'next/script';
import { ChakraProvider } from '@chakra-ui/react';
import { AppContextProvider } from 'shared';
import { ThemeProvider, WhatsApp } from 'ui';
import { theme as themeTools } from '../theme/tools.theme';
import ReactGA from 'react-ga4';
import { createElement, useEffect, useState } from 'react';

const App = ({ Component, pageProps }: AppProps) => {
  const [faviconPath, setFaviconPath] = useState('/favicon-tools.ico');
  const [currentTheme, setCurrentTheme] = useState(themeTools);
  const [isRobotec, setIsRobotec] = useState(false);

  // Initialize Google Analytics, favicon, and theme only on client side
  useEffect(() => {
    // Dynamically import env and theme to avoid server-side execution
    Promise.all([
      import('shared'),
      import('../theme/index')
    ]).then(([sharedModule, themeModule]) => {
      const { googleGaMeasurementId } = sharedModule.getKeys();
      const envId = sharedModule.getEnvId();

      if (googleGaMeasurementId && !ReactGA.isInitialized) {
        console.log('ReactGA initialized');
        ReactGA.initialize(googleGaMeasurementId);
      }

      const favicon = envId === 'ROBOTEC' ? '/favicon-robotec.ico' : '/favicon-tools.ico';
      setFaviconPath(favicon);
      setCurrentTheme(themeModule.theme);
      setIsRobotec(envId === 'ROBOTEC');
    });
  }, []);

  return (
    <>
      <Head>
        <link rel="icon" type="image/x-icon" href={faviconPath} />
      </Head>
      <AppContextProvider>
        <ChakraProvider>
          <ThemeProvider theme={currentTheme}>
            <Component {...pageProps} />
            <WhatsApp />
            {isRobotec && (
              <>
                {/* Carpincho Viajero: bienvenida + asistente con voz (ver public/carpincho-avatar.js) */}
                <Script src="/carpincho-avatar.js" strategy="afterInteractive" />
                {createElement('carpincho-avatar', {
                  'ws-url': 'wss://ia.nami.com.uy/robotec',
                  'api-url': 'https://ia.nami.com.uy/robotec',
                  'products-api': 'https://api-ecommerce.robotec.com.uy',
                  'product-base': '/productos/',
                  whatsapp: '59899263226',
                  // canción del Carpincho Viajero en la principal, hasta que empiecen a usar el asistente
                  'music-src': '/carpincho-viajero.mp3',
                  'music-pages': '/',
                  'music-bpm': '97.5',
                  'music-volume': '0.35',
                })}
              </>
            )}
          </ThemeProvider>
        </ChakraProvider>
      </AppContextProvider>
    </>
  );
};

export default App;
