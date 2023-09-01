'use client';

import type { AppProps } from 'next/app';
import { ChakraProvider } from '@chakra-ui/react';
import { AppContextProvider } from 'shared';
import { ThemeProvider } from 'ui';
import { theme } from '../theme';

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <AppContextProvider>
      <ChakraProvider>
        <ThemeProvider theme={theme}>
          <Component {...pageProps} />
        </ThemeProvider>
      </ChakraProvider>
    </AppContextProvider>
  );
};

export default App;
