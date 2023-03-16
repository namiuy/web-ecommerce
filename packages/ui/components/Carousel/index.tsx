import { Swiper as SwiperType, Grid, Navigation } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Children, ReactNode, useRef } from 'react';
import { MdOutlineNavigateBefore, MdOutlineNavigateNext } from 'react-icons/md';
import { Box, Icon, IconButton } from '@chakra-ui/react';

import 'swiper/css';
import 'swiper/css/grid';
import 'swiper/css/navigation';

const iconButtonColor = 'brand.carousel.iconButton.color';
const iconButtonHoverColor = 'brand.carousel.iconButton._hover.color';

type NavigationButtonProps = {
  slideHeight: number | string;
  direction: 'before' | 'next';
  onClick: VoidFunction;
};

const NavigationButton = ({ slideHeight, direction, onClick }: NavigationButtonProps) => {
  const isBefore = direction === 'before';
  const ariaLabel = isBefore ? 'Atras' : 'Siguiente';
  const icon = isBefore ? MdOutlineNavigateBefore : MdOutlineNavigateNext;
  const size = '3rem';
  return (
    <IconButton
      aria-label={ariaLabel}
      pos="absolute"
      h={size}
      w={size}
      mt={`calc(${slideHeight} - ${size} / 2)`}
      right={isBefore ? undefined : '0'}
      minW="unset"
      zIndex="10111"
      as="button"
      bg="transparent"
      icon={<Icon as={icon} w={size} h={size} color={iconButtonColor} _hover={{ color: iconButtonHoverColor }} />}
      _hover={{ bg: 'transparent' }}
      onClick={onClick}
    />
  );
};

type CarouselProps = {
  rows: number;
  slideWidth: number | string;
  slideHeight: number | string;
  children: ReactNode;
};

export const Carousel = ({ rows, slideWidth, slideHeight, children }: CarouselProps) => {
  const swiperRef = useRef<SwiperType>();
  return (
    <Box pos="relative">
      <NavigationButton direction="before" slideHeight={slideHeight} onClick={() => swiperRef.current?.slidePrev()} />
      <NavigationButton direction="next" slideHeight={slideHeight} onClick={() => swiperRef.current?.slideNext()} />
      <Swiper
        slidesPerView="auto"
        grid={{
          rows,
        }}
        modules={[Grid, Navigation]}
        style={{ height: `calc(${slideHeight} * ${rows}` }}
        grabCursor={true}
        onBeforeInit={swiper => {
          swiperRef.current = swiper;
        }}
      >
        {Children.map(children, (child, i) => (
          <SwiperSlide key={i} style={{ width: slideWidth, height: slideHeight }}>
            {child}
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
};
