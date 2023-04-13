import type { AppProps } from 'next/app';
import { AppContextProvider } from 'shared';
import { DesignDebug, ThemeProvider } from 'ui';
import initialState from '../context';
import theme from '../theme';

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <AppContextProvider initialState={initialState}>
      <ThemeProvider theme={theme}>
        <DesignDebug />
        <Component {...pageProps} />
      </ThemeProvider>
    </AppContextProvider>
  );
};

export default App;
