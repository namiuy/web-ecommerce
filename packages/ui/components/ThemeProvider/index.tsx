import { extendTheme as chakraExtendTheme, ChakraProvider, ChakraProviderProps } from '@chakra-ui/react';
import { defaultTheme } from './defaultTheme';
import deepExtend from 'deep-extend';

export const extendTheme = chakraExtendTheme;

export const ThemeProvider: (props: ChakraProviderProps) => JSX.Element = ({
  children,
  theme: customTheme,
  ...restProps
}) => {
  const theme = extendTheme(deepExtend(defaultTheme, customTheme as Record<string, any>));
  return (
    <ChakraProvider {...restProps} theme={theme}>
      {children}
    </ChakraProvider>
  );
};
