import { cardTheme } from './card.theme';

import '@fontsource/roboto/100.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import '@fontsource/roboto/900.css';
import { grey0, grey1, grey2, grey3 } from './colors';

export const defaultTheme: Record<string, any> = {
  fonts: {
    heading: `'Roboto', sans-serif`,
    body: `'Roboto', sans-serif`,
  },
  colors: {
    brand: {
      grey: { '0': grey0, '1': grey1, '2': grey2, '3': grey3 },
      input: {
        borderColor: grey1,
        _focus: {
          borderColor: grey2,
        },
        _placeholder: {
          color: grey2,
        },
      },
      nav: {
        item: {
          color: grey2,
          _hover: {
            color: grey3,
          },
        },
      },
      navBar: {
        backgroundColor: 'white',
        borderColor: grey1,
        iconButton: {
          color: grey3,
          _hover: {
            color: 'black',
          },
        },
        input: {
          borderColor: grey1,
          _focus: {
            borderColor: grey2,
          },
          _placeholder: {
            color: grey2,
          },
        },
      },
      carousel: {
        iconButton: {
          color: 'rgba(201, 201, 201, 0.6)',
          _hover: {
            color: 'rgb(201, 201, 201)',
          },
        },
      },
      drawerMenu: {
        item: {
          color: grey3,
        },
      },
      productFilters: {
        backgroundColor: grey0,
        borderColor: grey1,
        color: grey2,
        selected: {
          backgroundColor: grey1,
          color: grey3,
        },
      },
    },
  },
  components: {
    Card: cardTheme,
  },
};
