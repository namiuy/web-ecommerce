import { useBreakpointValue } from '@chakra-ui/react';
import { useProductListGet } from 'shared';
import { Product } from 'shared/entities/product';
import { Carousel, ProductCard } from 'ui';

// ProductCard
const _maxW = { base: '9rem', lg: '13rem' };
const _minH = { base: '14rem', lg: '19rem' }; // ['12rem', '17rem'];

const baseSizes = { slideWidth: _maxW.base, slideHeight: _minH.base, navigationLeft: '-1rem' };
const lgSizes = {
  slideWidth: _maxW.lg,
  slideHeight: _minH.lg,
  navigationLeft: undefined,
};

type ProductCardCarouselProps = { productListId: number; productsLength: number };

export const ProductCardCarousel = ({ productListId, productsLength }: ProductCardCarouselProps) => {
  const { isLoading, error, data } = useProductListGet(productListId);

  const isLg = useBreakpointValue({
    base: false,
    lg: true,
  });

  const { slideWidth, slideHeight, navigationLeft } = isLg ? lgSizes : baseSizes;

  if (error) return <div>Error!</div>; // TODO:!

  const products = isLoading ? [...Array(productsLength).keys()].map(() => ({} as Product)) : data?.products;

  return (
    <Carousel slideWidth={slideWidth} slideHeight={slideHeight} navigationLeft={navigationLeft} spaceBetween={16}>
      {products?.map((product, i) => (
        <ProductCard key={i} isLoading={isLoading} product={product} href={'/'} />
      ))}
    </Carousel>
  );
};
