import Link from 'next/link';
import { Image, useBreakpointValue } from '@chakra-ui/react';
import { Box, Skeleton } from 'ui';
import { useBannerList } from 'shared';
import { BannerCarousel } from './BannerCarousel';
import { useEffect, useState } from 'react';

type BannerProps = {
  section: string;
  showNavigation?: boolean;
};

export const Banner = ({ section, showNavigation }: BannerProps) => {
  const { isLoading, error, data = [] } = useBannerList();
  const [bg, setBg] = useState('#383838');

  if (error) {
    console.log(error);
  }

  const isMd = useBreakpointValue({
    base: false,
    md: true,
  });

  const banners = data.filter(b => b.section === section).sort((a, b) => a.indx - b.indx);

  useEffect(() => {
    if (!isLoading && banners?.length) {
      setBg(banners[0].color);
    }
  }, [isLoading, banners]);

  return (
    <Box bg={bg}>
      <Skeleton isLoaded={!isLoading}>
        {banners.length === 1 ? (
          <Image alt={banners[0].name} src={isMd ? banners[0].url : banners[0].url_mobile} objectFit="cover" />
        ) : (
          <BannerCarousel slideHeight="100%" slidesPerView={1} showNavigation={showNavigation}>
            {banners.map(({ name, url, url_mobile, link }, i) => {
              const Img = <Image key={i} alt={name} src={isMd ? url : url_mobile} objectFit="cover" />;
              return link ? (
                <Link key={i} href={link}>
                  {Img}
                </Link>
              ) : (
                Img
              );
            })}
          </BannerCarousel>
        )}
      </Skeleton>
    </Box>
  );
};
