import { AspectRatio, Image, useBreakpointValue } from '@chakra-ui/react';
import { Box, Skeleton } from 'ui';
import Link from 'next/link';
import { useBannerList } from 'shared';
import { BannerCarousel } from './BannerCarousel';
import { useEffect, useState } from 'react';

const _ratio = { base: 164 / 75, md: 25 / 7 };

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
      <AspectRatio ratio={_ratio}>
        <Skeleton isLoaded={!isLoading}>
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
        </Skeleton>
      </AspectRatio>
    </Box>
  );
};
