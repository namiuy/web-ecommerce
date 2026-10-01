'use client';

import type { AppProps } from 'next/app';
import Head from 'next/head';
import { ChakraProvider } from '@chakra-ui/react';
import { AppContextProvider } from 'shared';
import { ThemeProvider, WhatsApp, AIChatWidget } from 'ui';
import { theme as themeTools } from '../theme/tools.theme';
import ReactGA from 'react-ga4';
import { useEffect, useState } from 'react';

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
              <AIChatWidget
                wsUrl="ws://100.30.234.52:8002"
                apiUrl="http://100.30.234.52:8002"
                title="Robotec IA"
              />
            )}
          </ThemeProvider>
        </ChakraProvider>
      </AppContextProvider>
    </>
  );
};

export default App;
