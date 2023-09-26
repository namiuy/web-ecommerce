import { Swiper as SwiperType, Grid, Navigation } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Children, ReactNode, useRef } from 'react';
import { MdOutlineNavigateBefore, MdOutlineNavigateNext } from 'react-icons/md';
import { Box, Icon, IconButton } from '@chakra-ui/react';

import 'swiper/css';
import 'swiper/css/grid';
import 'swiper/css/navigation';
import { boxShadowLg, boxShadowMd } from './ThemeProvider/colors';

const _buttonSize = { base: '2rem', lg: '3rem' };

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
      aria-label={ariaLabel}
      pos="absolute"
      h={_buttonSize}
      w={_buttonSize}
      mt={{
        base: `calc(((${slideHeight} * ${rows}) - ${_buttonSize.base}) / 2)`,
        lg: `calc((((${slideHeight} * ${rows}) - ${_buttonSize.lg}) / 2) - 2rem)`,
      }}
      left={!isBefore ? undefined : left}
      right={isBefore ? undefined : right}
      minW="unset"
      zIndex="99"
      as="button"
      bg="white"
      borderRadius="50%"
      boxShadow={boxShadowMd}
      icon={
        <Icon as={icon} w={_buttonSize} h={_buttonSize} color={'brand.grey.2'} _hover={{ color: 'brand.grey.3' }} />
      }
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
    <Box pos="relative">
      {showNavigation && (
        <>
          <NavigationButton
            rows={rows}
            direction="before"
            slideHeight={slideHeight}
            left={navigationLeft}
            onClick={() => swiperRef.current?.slideTo(swiperRef.current?.realIndex - slidesPerView)}
          />
          <NavigationButton
            rows={rows}
            direction="next"
            slideHeight={slideHeight}
            right={navigationRight}
            onClick={() => swiperRef.current?.slideTo(swiperRef.current?.realIndex + slidesPerView)}
          />
        </>
      )}
      <Swiper
        slidesPerView={slidesPerView}
        grid={{
          rows,
        }}
        modules={[Grid, Navigation]}
        style={{ height: `calc(${slideHeight} * ${rows}` }}
        grabCursor={true}
        onBeforeInit={swiper => {
          swiperRef.current = swiper;
        }}
        spaceBetween={spaceBetween}
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
