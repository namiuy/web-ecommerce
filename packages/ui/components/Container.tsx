import { Container as ContainerChakra, ContainerProps, useBreakpointValue } from '@chakra-ui/react';

export const Container = (props: ContainerProps) => {
  const maxW = useBreakpointValue({
    base: 'none',
    sm: 'none', // '30em',
    md: 'none', // '48em',
    lg: '75rem', // '62em',
    //xl: '75rem', // '80em',
    //'2xl': '10rem', // '96em',
  });

  return <ContainerChakra maxW={maxW} {...props} />;
};
