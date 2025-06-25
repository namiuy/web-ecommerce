import { useBreakpointValue } from '@chakra-ui/react';
import { Product } from 'shared/entities/product';
import { Carousel } from 'ui';

import { product as productConf } from 'shared';
import { ProductCard } from './ProductCard';
const { showCod } = productConf;

const _minH = showCod ? { base: '20rem', lg: '25rem' } : { base: '18rem', lg: '22.5rem' };

type ProductCardCarouselProps = {
  isLoading: boolean;
  products: Product[];
};

export const ProductCardCarousel = ({ isLoading, products }: ProductCardCarouselProps) => {
  const isLg = useBreakpointValue({
    base: false,
    lg: true,
  });

  const slidesPerView =
    useBreakpointValue({
      base: 2,
      sm: 3,
      md: 4,
      lg: 5,
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
      {products?.map((product: Product, i: number) => <ProductCard key={i} isLoading={isLoading} product={product} />)}
    </Carousel>
  );
};
