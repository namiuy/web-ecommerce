import '@fontsource/play';

const grey0 = '#F7F7F7';
const grey1 = '#C9C9C9';
const grey2 = '#7D7D7D';
const grey3 = '#3E4448';

export const lightTheme: Record<string, any> = {
  fonts: {
    heading: `'Play', sans-serif`,
  },
  colors: {
    brand: {
      nav: {
        item: {
          color: grey2,
          _hover: {
            color: grey3,
          },
        },
      },
      navBar: {
        backgroundColor: 'rgba(255, 255, 255, .6)',
        borderColor: 'rgba(0, 0, 0, .1)',
        input: {
          borderColor: grey1,
          _focus: {
            borderColor: grey2,
          },
          _placeholder: {
            color: grey2,
          },
        },
        iconButton: {
          color: grey3,
          _hover: {
            color: 'black',
          },
        },
      },
      input: {
        borderColor: grey1,
      },
      drawerMenu: {
        backgroundColor: 'rgba(255, 255, 255, .7)',
        item: {
          borderColor: 'rgba(0, 0, 0, .1)',
        },
      },
    },
  },
};

export const darkTheme: Record<string, any> = {
  fonts: {
    heading: `'Play', sans-serif`,
  },
  colors: {
    brand: {
      nav: {
        item: {
          color: grey1,
          _hover: {
            color: grey0,
          },
        },
      },
      navBar: {
        backgroundColor: 'rgba(0, 0, 0, .85)',
        borderColor: 'black',
        iconButton: {
          color: grey1,
          _hover: {
            color: 'black',
          },
        },
        input: {
          color: grey1,
          borderColor: grey2,
          _focus: {
            borderColor: grey1,
          },
          _placeholder: {
            color: grey2,
          },
        },
      },
      drawerMenu: {
        backgroundColor: 'rgba(0, 0, 0, .85)',
        item: {
          color: grey1,
          borderColor: 'rgba(255, 255, 255, .05)',
        },
      },
    },
  },
};
