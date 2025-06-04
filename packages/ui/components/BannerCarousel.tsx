import { Swiper as SwiperType, Grid, Navigation, Pagination, Autoplay } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Children, ReactNode, useRef } from 'react';
import { Box } from '@chakra-ui/react';
import 'swiper/css';
import 'swiper/css/grid';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';

const _paginationColor = 'brand.banner.paginationColor';

type CarouselProps = {
  rows?: number;
  navigationLeft?: number | string;
  navigationRight?: number | string;
  slideHeight: number | string;
  slidesPerView: number;
  spaceBetween?: number;
  showNavigation?: boolean;
  children: ReactNode;
  onChange?: () => void;
};

export const BannerCarousel = ({
  rows = 1,
  slideHeight,
  slidesPerView,
  spaceBetween = 0,
  children,
  onChange,
}: CarouselProps) => {
  const swiperRef = useRef<SwiperType>();

  return (
    <Box
      pos="relative"
      sx={{
        '.swiper-pagination .swiper-pagination-bullet-active': {
          backgroundColor: _paginationColor,
        },
      }}
    >
      <Swiper
        slidesPerView={slidesPerView}
        grid={{
          rows,
        }}
        modules={[Grid, Navigation, Pagination, Autoplay]}
        style={{ height: `calc(${slideHeight} * ${rows}` }}
        onBeforeInit={swiper => {
          swiperRef.current = swiper;
        }}
        spaceBetween={spaceBetween}
        onChange={onChange}
        loop={true}
        pagination={{ clickable: true }}
        autoplay={{
          delay: 5000,
        }}
      >
        {Children.map(children, (child, i) => (
          <SwiperSlide key={i} style={{ height: slideHeight }}>
            {child}
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
};
