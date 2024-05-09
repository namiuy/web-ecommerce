import { useBreakpointValue } from '@chakra-ui/react';
import { useProductListGet, getEmptyArray } from 'shared';
import { Product } from 'shared/entities/product';
import { Carousel, ProductCard } from 'ui';

import { product as productConf } from 'shared';
const { showCod } = productConf;

// const _minH = { base: '17rem', lg: '21rem' };

const _minH = showCod ? { base: '20rem', lg: '23rem' } : { base: '18rem', lg: '22rem' };

type ProductCardCarouselProps = {
  isLoading: boolean;
  editMode?: boolean;
  products: Product[];
};

export const ProductCardCarousel = ({ isLoading, editMode = false, products }: ProductCardCarouselProps) => {
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
      {products?.map((product: Product, i: number) => (
        <ProductCard key={i} isLoading={isLoading} editMode={editMode} product={product} />
      ))}
    </Carousel>
  );
};
