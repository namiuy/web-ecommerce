import { Center, useBreakpointValue, Image } from '@chakra-ui/react';
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
      <Center bg="#22343e" w="100%" h={h} color="white">
        <Image
          w="100%"
          h={h}
          fit="contain"
          alt="Launch"
          src="https://lnwfrvtxdlaazenidbdt.supabase.co/storage/v1/object/public/banners/launch_elevadores.jpg"
        />
      </Center>
    </Carousel>
  );
};
