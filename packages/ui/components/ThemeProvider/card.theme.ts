import { cardAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/react';
import { boxShadowLg, boxShadowMd, boxShadowSm } from './colors';

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(cardAnatomy.keys);

const sizes = {
  sm: definePartsStyle({
    container: {
      boxShadow: boxShadowSm,
    },
  }),
  md: definePartsStyle({
    container: {
      boxShadow: boxShadowMd,
    },
  }),
  lg: definePartsStyle({
    container: {
      boxShadow: boxShadowLg,
    },
  }),
};

// export sizes in the component theme
export const cardTheme = defineMultiStyleConfig({
  baseStyle: {
    container: {
      borderRadius: '.5rem',
    },
  },
  sizes,
});
