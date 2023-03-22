import { Center, useBreakpointValue } from '@chakra-ui/react';
import { ReactNode } from 'react';
import { Carousel } from './Carousel';

export const Banner = ({ children }: { children: ReactNode }) => {
  const h = { base: '10rem', lg: '21rem' };
  const isLg = useBreakpointValue({
    base: false,
    lg: true,
  });

  return (
    <Carousel slideWidth="100%" slideHeight={isLg ? h.lg : h.base}>
      <Center bg="lightgrey" w="100%" h={h} color="white">
        {children}
      </Center>
    </Carousel>
  );
};
