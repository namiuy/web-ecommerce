const primaryColor = '#030366';

export const theme: Record<string, any> = {
  colors: {
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
        backgroundColor: primaryColor,
        borderColor: 'none',
        iconButton: {
          color: 'white',
          _hover: {
            color: 'white',
          },
        },
        input: {
          color: 'white',
          borderColor: '#1c1d92',
          iconColor: '#6566c1',
          backgroundColor: '#08096a',
          _focus: {
            borderColor: '#464796',
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
