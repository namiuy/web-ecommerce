import { useBreakpointValue } from '@chakra-ui/react';
import { Autopart } from 'shared/entities/autopart';
import { Carousel, AutopartCard } from 'ui';

const _minH = { base: '20rem', lg: '26rem' };

type AutopartCardCarouselProps = {
  isLoading: boolean;
  autoparts: Autopart[];
};

export const AutopartCardCarousel = ({ isLoading, autoparts }: AutopartCardCarouselProps) => {
  const isLg = useBreakpointValue({
    base: false,
    lg: true,
  });

  const slidesPerView =
    useBreakpointValue({
      base: 2,
      sm: 3,
      md: 4,
      lg: 4,
    }) || 2;
  const slideHeight = isLg ? _minH.lg : _minH.base;
  
  return (
    <Carousel
      slideHeight={slideHeight}
      navigationLeft={isLg ? '-1.5rem' : '-1rem'}
      navigationRight={isLg ? '-1.5rem' : '-1rem'}
      slidesPerView={slidesPerView}
      spaceBetween={32}
    >
      {autoparts?.map((autopart: Autopart, i: number) => (
        <AutopartCard key={i} isLoading={isLoading} product={autopart} />
      ))}
    </Carousel>
  );
};