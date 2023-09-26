import { AspectRatio, Box, Image, useBreakpointValue } from '@chakra-ui/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useBannerList } from 'shared';
//import { Carousel } from './Carousel';

const _ratio = { base: 164 / 75, md: 25 / 7 };

type BannerProps = {
  section: string;
  showNavigation?: boolean;
};

export const Banner = ({ section, showNavigation }: BannerProps) => {
  const [bg, setBg] = useState('#383838');
  const { isLoading, error, data = [] } = useBannerList();

  const isMd = useBreakpointValue({
    base: false,
    md: true,
  });

  if (error) {
    console.log(error);
  }

  const banners = data.filter(b => b.section === section).sort((a, b) => a.indx - b.indx);

  useEffect(() => {
    if (!isLoading && banners?.length) {
      setBg(banners[0].color);
    }
  }, [isLoading, banners]);

  return (
    <Box bg={bg}>
      <AspectRatio ratio={_ratio}>
        {isLoading ? (
          <Box />
        ) : (
          <>
            {banners.map(({ name, color, url, url_mobile, link }, i) => {
              const Img = <Image key={i} alt={name} src={isMd ? url : url_mobile} objectFit="cover" />;
              return link ? (
                <Link key={i} href={link}>
                  {Img}
                </Link>
              ) : (
                Img
              );
            })}
          </>
        )}
      </AspectRatio>
    </Box>
  );
};
{
  /* <Carousel slideHeight="100%" slidesPerView={1} showNavigation={showNavigation} onChange={r => console.log(r)}>*/
}
{
  /* </Carousel> */
}
