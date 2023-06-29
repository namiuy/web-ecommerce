import { AspectRatio, Box, Image, useBreakpointValue } from '@chakra-ui/react';
import Link from 'next/link';
import { useState } from 'react';
import { useBannerList } from 'shared';
//import { Carousel } from './Carousel';

const _pt = { base: '5rem', lg: '6rem' };
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
    return <></>;
  }

  if (isLoading) return <></>; // TODO:!

  const banners = data.filter(b => b.section === section).sort((a, b) => a.indx - b.indx);

  return (
    <Box pt={_pt} bg={bg}>
      <AspectRatio ratio={_ratio}>
        {/* <Carousel slideHeight="100%" slidesPerView={1} showNavigation={showNavigation} onChange={r => console.log(r)}>*/}
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
          {/* </Carousel> */}
        </>
      </AspectRatio>
    </Box>
  );
};
