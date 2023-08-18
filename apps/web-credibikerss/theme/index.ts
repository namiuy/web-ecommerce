import '@fontsource/play';

const grey0 = '#F7F7F7';
const grey1 = '#C9C9C9';
const grey2 = '#7D7D7D';
const grey3 = '#3E4448';

const primary = 'black';
const secondary = '#d7fc00';

export const lightTheme: Record<string, any> = {
  fonts: {
    heading: `'Play', sans-serif`,
  },
  colors: {
    primary: {
      main: primary,
      50: grey0,
      100: grey1,
      200: grey1,
      300: grey2,
      400: grey2,
      500: primary,
      600: grey3,
      700: grey3,
      800: primary,
      900: primary,
    },
    secondary: {
      main: secondary,
      50: secondary,
      100: secondary,
      200: secondary,
      300: secondary,
      400: secondary,
      500: secondary,
      600: secondary,
      700: secondary,
      800: secondary,
      900: secondary,
    },
    brand: {
      nav: {
        item: {
          color: grey3,
          _hover: {
            color: 'black',
          },
        },
      },
      navBar: {
        backgroundColor: 'rgba(255, 255, 255, .6)',
        borderColor: 'rgba(0, 0, 0, .1)',
        input: {
          borderColor: grey2,
          _focus: {
            borderColor: grey3,
          },
          _placeholder: {
            color: grey3,
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
    primary: {
      main: primary,
      50: primary,
      100: primary,
      200: primary,
      300: primary,
      400: primary,
      500: primary,
      600: primary,
      700: primary,
      800: primary,
      900: primary,
    },
    secondary: {
      main: secondary,
      50: secondary,
      100: secondary,
      200: secondary,
      300: secondary,
      400: secondary,
      500: secondary,
      600: secondary,
      700: secondary,
      800: secondary,
      900: secondary,
    },
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
