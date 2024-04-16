const primary = '#1d7531';
const secondary = '#238a3a';

const white = '#ffffff';
const black = '#000000';
const greyBg = '#fafafa';
const borderColor = '#eeeeee';
const smallText = '#909090';
const tooltipBg = '#676767';
const buyButtonHoverBg = '#e53e3e';

const relatedLinksColor = '#4195db';
const relatedLinksColorBg = '#e6f2ff';

const activeLabelStyles = {
  transform: 'scale(0.85) translateY(-24px)',
};

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
      background: greyBg,
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
          color: white,
          _hover: {
            backgroundColor: buyButtonHoverBg,
          },
        },
        relatedLinks: {
          linkColor: relatedLinksColor,
          _hover: {
            backgroundColor: relatedLinksColorBg,
          },
        },
      },
      profile: {
        subtitlesColor: primary,
        backgroundColorOne: primary,
        backgroundColorTwo: greyBg,
        backButton: {
          _hover: {
            backgroundColor: white,
            color: primary,
          },
        },
      },
      nav: {
        item: {
          mobile: {
            color: black,
            _hover: {
              color: 'lightgrey',
            },
          },
          desktop: {
            color: white,
            _hover: {
              color: 'lightgrey',
            },
          },
        },
      },
      navBar: {
        backgroundColorPrimary: primary,
        backgroundColorSecondary: secondary,
        borderColor: primary,
        iconButton: {
          color: white,
          _hover: {
            color: white,
          },
        },
        input: {
          color: white,
          borderColor: primary,
          iconColor: white,
          backgroundColor: primary,
          _focus: {
            borderColor: primary,
          },
          _hover: {
            borderColor: primary,
          },
          _placeholder: {
            color: white,
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
      avatar: {
        backgroundColor: secondary,
        color: white,
      },
      drawerMenu: {
        backgroundColor: white,
        backdropFilter: 'none',
        item: {
          color: black,
          borderColor: white,
        },
      },
      contact: {
        input: {
          borderColor: primary,
        },
      },
      footer: {
        backgroundColor: secondary,
        color: white,
        borderColor: white,
        iconButton: {
          backgroundColor: primary,
          color: white,
        },
      },
    },
  },

  components: {
    Form: {
      variants: {
        floating: {
          container: {
            _focusWithin: {
              label: {
                ...activeLabelStyles,
              },
            },

            'input:not(:placeholder-shown) + label, .chakra-select__wrapper + label, textarea:not(:placeholder-shown) ~ label': {
              ...activeLabelStyles,
            },
            label: {
              top: 0,
              left: 0,
              zIndex: 2,
              position: 'absolute',
              backgroundColor: 'white',
              pointerEvents: 'none',
              mx: 3,
              px: 1,
              my: 2,
              transformOrigin: 'left top',
            },
          },
        },
      },
    },
  },
};
