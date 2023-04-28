import { Center, Image, useBreakpointValue } from '@chakra-ui/react';
import Link from 'next/link';
import { ReactNode } from 'react';
import { useBannerList } from 'shared';
import { Carousel } from './Carousel';

const h = { base: '10rem', lg: '21rem' };

type BannerProps = {
  section: string;
  showNavigation?: boolean;
};

export const Banner = ({ section, showNavigation }: BannerProps) => {
  const { isLoading, error, data = [] } = useBannerList();

  const isLg = useBreakpointValue({
    base: false,
    lg: true,
  });

  if (error) {
    console.log(error);
    return <></>;
  }

  if (isLoading) return <></>; // TODO:!

  const banners = data.filter(b => b.section === section).sort((a, b) => a.indx - b.indx);

  return (
    <Carousel slideHeight={isLg ? h.lg : h.base} slidesPerView={1} showNavigation={showNavigation}>
      {banners.map(({ name, color, url, link }, i) => {
        const Img = <Image key={i} w="100%" h={h} fit="contain" alt={name} bg={color} src={url} />;
        return link ? (
          <Link target="_blank" href={link}>
            {Img}
          </Link>
        ) : (
          Img
        );
      })}
    </Carousel>
  );
};
