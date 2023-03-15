import { extendTheme } from '@chakra-ui/react';

const grey0 = '#F7F7F7';
const grey1 = '#C9C9C9';
const grey2 = '#7D7D7D';
const grey3 = '#3E4448';

export default extendTheme({
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
      },
      drawerMenu: {
        item: {
          color: grey3,
        },
      },
    },
  },
});
