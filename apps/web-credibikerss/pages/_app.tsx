import type { AppProps } from 'next/app';
import { useState } from 'react';
import { AppContextProvider } from 'shared';
import { DesignDebug, ThemeProvider } from 'ui';
import initialState from '../context';
import { lightTheme, darkTheme } from '../theme';

const App = ({ Component, pageProps }: AppProps) => {
  const [theme, setTheme] = useState(lightTheme);
  const toggleTheme = () => setTheme(theme === lightTheme ? darkTheme : lightTheme);
  return (
    <AppContextProvider initialState={{ ...initialState, toggleTheme }}>
      <ThemeProvider theme={theme}>
        <DesignDebug />
        <Component {...pageProps} />
      </ThemeProvider>
    </AppContextProvider>
  );
};

export default App;
