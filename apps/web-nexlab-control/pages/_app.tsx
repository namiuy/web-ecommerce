'use client';

import type { AppProps } from 'next/app';
import { ChakraProvider } from '@chakra-ui/react';
import { AppContextProvider } from 'shared';
import { ThemeProvider } from 'ui';
import { theme } from '../theme/index';
import ReactGA from 'react-ga4';
import { keys } from 'shared';

const { googleGaMeasurementId } = keys;

if (googleGaMeasurementId) {
  console.log('ReactGA initialized');
  ReactGA.initialize(googleGaMeasurementId);
}

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
