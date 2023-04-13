import type { AppProps } from 'next/app';
import { ThemeProvider } from 'ui';
import theme from '../theme';

const App = ({ Component, pageProps }: AppProps) => (
  <ThemeProvider theme={theme}>
    <Component {...pageProps} />
  </ThemeProvider>
);

export default App;
