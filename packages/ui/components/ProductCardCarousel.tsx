import { useBreakpointValue } from '@chakra-ui/react';
import { useProductListGet } from 'shared';
import { Product } from 'shared/entities/product';
import { Carousel, ProductCard } from 'ui';

// ProductCard
const _maxW = { base: '9rem', lg: '13rem' };
const _minH = { base: '15rem', lg: '21rem' }; // ['13rem', '18rem'];

const baseSizes = { slideWidth: _maxW.base, slideHeight: _minH.base, navigationLeft: '-1rem' };
const lgSizes = {
  slideWidth: _maxW.lg,
  slideHeight: _minH.lg,
  navigationLeft: undefined,
};

type ProductCardCarouselProps = { productListId: number; productsLength: number };

const getEmptyArray = <T,>(length: number) => {
  let arr = [];
  for (let i = 0; i < length; i++) arr.push({} as T);
  return arr;
};

export const ProductCardCarousel = ({ productListId, productsLength }: ProductCardCarouselProps) => {
  const { isLoading, error, data } = useProductListGet(productListId);

  const isLg = useBreakpointValue({
    base: false,
    lg: true,
  });

  const { slideWidth, slideHeight, navigationLeft } = isLg ? lgSizes : baseSizes;

  if (error) console.log(error);

  const products = isLoading ? getEmptyArray<Product>(productsLength) : data?.products;

  return (
    <Carousel slideWidth={slideWidth} slideHeight={slideHeight} navigationLeft={navigationLeft} spaceBetween={16}>
      {products?.map((product, i) => (
        <ProductCard key={i} isLoading={isLoading} product={product} href={'/'} />
      ))}
    </Carousel>
  );
};
