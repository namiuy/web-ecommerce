const primary = '#6A0000';
const secondary = '#e53e3e';

const greyBg = '#fafafa';
const borderColor = '#eeeeee';
const smallText = '#909090';
const tooltipBg = '#676767';
const buyButtonHoverBg = '#e53e3e';
const relatedLinksColor = '#4195db';

export const theme: Record<string, any> = {
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
      login: {
        backgroundColorOne: primary,
        backgroundColorTwo: greyBg,
      },
      productDetail: {
        backgroundColor: greyBg,
        borderColor: borderColor,
        smallText: smallText,
        tooltipBg: tooltipBg,
        buyButton: {
          backgroundColor: secondary,
          color: 'white',
          _hover: {
            backgroundColor: buyButtonHoverBg,
          },
        },
        relatedLinks: {
          linkColor: relatedLinksColor,
          _hover: {
            backgroundColor: relatedLinksColor,
          },
        },
      },
      profile: {
        subtitlesColor: primary,
        backgroundColorOne: primary,
        backgroundColorTwo: greyBg,
        backButton: {
          _hover: {
            backgroundColor: 'white',
            color: primary,
          },
        },
      },
      nav: {
        item: {
          color: 'white',
          _hover: {
            color: 'lightgrey',
          },
        },
      },
      navBar: {
        backgroundColor: primary,
        borderColor: primary,
        iconButton: {
          color: 'white',
          _hover: {
            color: 'white',
          },
        },
        input: {
          color: 'white',
          borderColor: '#AC2222',
          iconColor: '#6566c1',
          //backgroundColor: '#0c0d77',
          _focus: {
            borderColor: '#6163d3',
          },
          _placeholder: {
            color: '#C16565',
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
    },
  },
};
