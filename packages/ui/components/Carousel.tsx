import { Swiper as SwiperType, Grid, Navigation } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Children, ReactNode, useRef } from 'react';
import { MdOutlineNavigateBefore, MdOutlineNavigateNext } from 'react-icons/md';
import { Box, Icon, IconButton } from '@chakra-ui/react';

import 'swiper/css';
import 'swiper/css/grid';
import 'swiper/css/navigation';
import { boxShadowLg, boxShadowMd } from './ThemeProvider/colors';

type NavigationButtonProps = {
  slideHeight: number | string;
  rows: number;
  direction: 'before' | 'next';
  left?: number | string;
  right?: number | string;
  onClick: VoidFunction;
};

const buttonSize = {
  base: '2rem',
  lg: '3rem',
};

const NavigationButton = ({ slideHeight, rows, direction, left, right = 0, onClick }: NavigationButtonProps) => {
  const isBefore = direction === 'before';
  const icon = isBefore ? MdOutlineNavigateBefore : MdOutlineNavigateNext;

  return (
    <IconButton
      aria-label={isBefore ? 'Atrás' : 'Siguiente'}
      onClick={onClick}
      icon={<Icon as={icon} w="100%" h="100%" color="brand.grey.2" _hover={{ color: 'brand.grey.3' }} />}
      position="absolute"
      top={{
        base: `calc(((${slideHeight} * ${rows}) - ${buttonSize.base}) / 2)`,
        lg: `calc(((${slideHeight} * ${rows}) - ${buttonSize.lg}) / 2)`,
      }}
      left={isBefore ? left : undefined}
      right={!isBefore ? right : undefined}
      zIndex="99"
      bg="white"
      borderRadius="full"
      boxShadow={boxShadowMd}
      minW={buttonSize}
      minH={buttonSize}
      aspectRatio={1}
      _hover={{ bg: 'white', boxShadow: boxShadowLg }}
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

export const Carousel = ({
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

  return (
    <Box position="relative">
      {showNavigation && (
        <>
          <NavigationButton
            direction="before"
            slideHeight={slideHeight}
            rows={rows}
            left={navigationLeft}
            onClick={() => swiperRef.current?.slidePrev()}
          />
          <NavigationButton
            direction="next"
            slideHeight={slideHeight}
            rows={rows}
            right={navigationRight}
            onClick={() => swiperRef.current?.slideNext()}
          />
        </>
      )}

      <Swiper
        modules={[Grid, Navigation]}
        slidesPerView={slidesPerView}
        spaceBetween={spaceBetween}
        grid={{ rows }}
        grabCursor
        style={{ height: `calc(${slideHeight} * ${rows})` }}
        onBeforeInit={swiper => (swiperRef.current = swiper)}
        onChange={onChange}
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
