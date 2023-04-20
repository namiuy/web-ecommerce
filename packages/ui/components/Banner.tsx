import { Center, useBreakpointValue } from '@chakra-ui/react';
import { ReactNode } from 'react';
import { Carousel } from './Carousel';

type BannerProps = {
  showNavigation?: boolean;
  children: ReactNode;
};

export const Banner = ({ showNavigation, children }: BannerProps) => {
  const h = { base: '10rem', lg: '21rem' };
  const isLg = useBreakpointValue({
    base: false,
    lg: true,
  });

  return (
    <Carousel slideHeight={isLg ? h.lg : h.base} slidesPerView={1} showNavigation={showNavigation}>
      <Center bg="#2716be" w="100%" h={h} color="white">
        {children}
      </Center>
    </Carousel>
  );
};
