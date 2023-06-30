import { useBreakpointValue } from '@chakra-ui/react';
import { useProductListGet, getEmptyArray } from 'shared';
import { Product } from 'shared/entities/product';
import { Carousel, ProductCard } from 'ui';

// ProductCard
const _minH = { base: '15rem', lg: '21rem' }; // ['13rem', '18rem'];

const baseSizes = {
  slideHeight: _minH.base,
  navigationLeft: '-1rem',
  navigationRight: '-1rem',
};
const lgSizes = {
  slideHeight: _minH.lg,
  navigationLeft: undefined,
  navigationRight: undefined,
};

type ProductCardCarouselProps = { productListId: number; productsLength: number };

export const ProductCardCarousel = ({ productListId, productsLength }: ProductCardCarouselProps) => {
  const { isLoading, error, data } = useProductListGet(productListId);

  const isLg = useBreakpointValue({
    base: false,
    lg: true,
  });

  const slidesPerView =
    useBreakpointValue({
      base: 2,
      sm: 3,
      lg: 4,
    }) || 2;

  const { slideHeight, navigationLeft, navigationRight } = isLg ? lgSizes : baseSizes;

  if (error) {
    console.log(error);
    return <></>;
  }

  const products = isLoading ? getEmptyArray<Product>(productsLength) : data?.products;

  return (
    <Carousel
      slideHeight={slideHeight}
      navigationLeft={navigationLeft}
      navigationRight={navigationRight}
      slidesPerView={slidesPerView}
      spaceBetween={16}
    >
      {products?.map((product, i) => (
        <ProductCard key={i} edit isLoading={isLoading} product={product} />
      ))}
    </Carousel>
  );
};
