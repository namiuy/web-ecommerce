'use client';

import type { AppProps } from 'next/app';
import Head from 'next/head';
import { AppContextProvider } from 'shared';
import { ThemeProvider } from 'ui';
import { theme as themeTools } from '../theme/theme.nami/tools.theme';
import { useEffect, useState } from 'react';

const App = ({ Component, pageProps }: AppProps) => {
  const [currentTheme, setCurrentTheme] = useState(themeTools);

  useEffect(() => {
    import('../theme/index').then((themeModule) => {
      if (themeModule.theme) {
        setCurrentTheme(themeModule.theme);
      }
    });
  }, []);

  return (
    <>
      <Head>
        <link rel="icon" href="/favicon-nami.ico" />
      </Head>
      <AppContextProvider>
        <ThemeProvider theme={currentTheme}>
          <Component {...pageProps} />
        </ThemeProvider>
      </AppContextProvider>
    </>
  );
};

export default App;
