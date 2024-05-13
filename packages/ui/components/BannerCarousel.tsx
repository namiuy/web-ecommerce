import { Swiper as SwiperType, Grid, Navigation, Pagination, Autoplay } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Children, ReactNode, useRef, useState } from 'react';
import { MdOutlineNavigateBefore, MdOutlineNavigateNext } from 'react-icons/md';
import { Box, Icon, IconButton } from '@chakra-ui/react';

import 'swiper/css';
import 'swiper/css/grid';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import { boxShadowLg, boxShadowMd } from './ThemeProvider/colors';

const _buttonSize = { base: '2rem', lg: '3rem' };

const _paginationColor = 'brand.banner.paginationColor';
const _arrowsColor = 'brand.banner.arrowsColor';

type NavigationButtonProps = {
  slideHeight: number | string;
  rows: number;
  direction: 'before' | 'next';
  left?: number | string;
  right?: number | string;
  onClick: VoidFunction;
};

const NavigationButton = ({ slideHeight, rows, direction, left, right = 0, onClick }: NavigationButtonProps) => {
  const isBefore = direction === 'before';
  const ariaLabel = isBefore ? 'Atras' : 'Siguiente';
  const icon = isBefore ? MdOutlineNavigateBefore : MdOutlineNavigateNext;
  return (
    <IconButton
      as="button"
      aria-label={ariaLabel}
      pos="absolute"
      h={_buttonSize}
      w={_buttonSize}
      top={{
        base: `calc(((${slideHeight} * ${rows}) - ${_buttonSize.base}) / 2)`,
        lg: `calc((((${slideHeight} * ${rows}) - ${_buttonSize.lg}) / 2))`,
      }}
      left={!isBefore ? undefined : left}
      right={isBefore ? undefined : right}
      zIndex="99"
      bg="white"
      borderRadius={isBefore ? '0 2rem 2rem 0' : '2rem 0 0 2rem'}
      boxShadow={boxShadowMd}
      icon={<Icon as={icon} w={_buttonSize} h={_buttonSize} color={_arrowsColor} />}
      _hover={{ bg: 'wihte', boxShadow: boxShadowLg }}
      onClick={onClick}
    />
  );
};

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
  showNavigation = true,
  navigationLeft,
  navigationRight,
  children,
  onChange,
}: CarouselProps) => {
  const swiperRef = useRef<SwiperType>();
  const [isHovering, setIsHovering] = useState(false);

  return (
    <Box
      pos="relative"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      sx={{
        '.swiper-pagination .swiper-pagination-bullet-active': {
          backgroundColor: _paginationColor,
        },
      }}
    >
      {showNavigation && isHovering && (
        <Box>
          <NavigationButton
            rows={rows}
            direction="before"
            slideHeight={slideHeight}
            left={navigationLeft}
            onClick={() => swiperRef.current?.slidePrev()}
          />
          <NavigationButton
            rows={rows}
            direction="next"
            slideHeight={slideHeight}
            right={navigationRight}
            onClick={() => swiperRef.current?.slideNext()}
          />
        </Box>
      )}
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
