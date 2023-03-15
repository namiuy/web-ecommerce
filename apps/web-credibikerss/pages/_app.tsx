import type { AppProps } from 'next/app';
import { AppContext } from 'shared';
import { DesignDebug, ThemeProvider } from 'ui';
import initalValues from '../context';
import theme from '../theme';

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <AppContext.Provider value={initalValues}>
      <ThemeProvider theme={theme}>
        <DesignDebug />
        <Component {...pageProps} />
      </ThemeProvider>
    </AppContext.Provider>
  );
};

export default App;
