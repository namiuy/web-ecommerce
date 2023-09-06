'use client';

import type { AppProps } from 'next/app';
import { AppContextProvider } from 'shared';
import { ThemeProvider, WhatsApp } from 'ui';
import { theme } from '../theme';

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
