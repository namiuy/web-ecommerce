import '@fontsource/play';

const grey0 = '#F7F7F7';
const grey1 = '#C9C9C9';
const grey2 = '#7D7D7D';
const grey3 = '#3E4448';

const primary = 'black';
const secondary = '#d7fc00';

export const theme: Record<string, any> = {
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
      grey: {
        0: grey0,
        1: grey1,
        2: grey2,
        3: grey3,
      },
      login: {
        backgroundColorOne: primary,
        backgroundColorTwo: 'white',
      },
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
      productDetail: {
        backgroundColor: grey0,
        borderColor: '#e2e2e2',
        // smallText: smallText,
        // tooltipBg: tooltipBg,
        // buyButton: {
        //   backgroundColor: secondary,
        //   color: 'white',
        //   _hover: {
        //     backgroundColor: buyButtonHoverBg,
        //   },
        // },
        // relatedLinks: {
        //   linkColor: relatedLinksColor,
        //   _hover: {
        //     backgroundColor: relatedLinksColor,
        //   },
        // },
      },
    },
  },
};
