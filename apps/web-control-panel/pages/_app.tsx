'use client';

import type { AppProps } from 'next/app';
import { AppContextProvider } from 'shared';
import { ThemeProvider } from 'ui';
import { theme } from '../theme';
import Head from 'next/head';
import { envId } from 'shared';

const favicon = envId === 'CREDI' ? '/favicon-cb.ico' : '/favicon-nami.ico';

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Head>
        <link rel="icon" href={favicon} />
      </Head>
      <AppContextProvider>
        <ThemeProvider theme={theme}>
          <Component {...pageProps} />
        </ThemeProvider>
      </AppContextProvider>
    </>
  );
};

export default App;
