const primary = '#030366';
const secondary = '#030366';

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
      nav: {
        item: {
          color: 'white',
          _hover: {
            color: 'lightgrey',
          },
        },
      },
      navBar: {
        backgroundColor: 'rgba(3, 3, 102, .94)',
        borderColor: 'none',
        iconButton: {
          color: 'white',
          _hover: {
            color: 'white',
          },
        },
        input: {
          color: 'white',
          borderColor: '#2f3092',
          iconColor: '#6566c1',
          //backgroundColor: '#0c0d77',
          _focus: {
            borderColor: '#6163d3',
          },
          _placeholder: {
            color: '#6566c1',
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
