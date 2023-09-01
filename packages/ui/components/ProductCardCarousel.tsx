import { useBreakpointValue } from '@chakra-ui/react';
import { useProductListGet, getEmptyArray } from 'shared';
import { Product } from 'shared/entities/product';
import { Carousel, ProductCard } from 'ui';

const _minH = { base: '16rem', lg: '21rem' };

type ProductCardCarouselProps = { editMode?: boolean; productListId: number; productsLength: number };

export const ProductCardCarousel = ({ editMode = false, productListId, productsLength }: ProductCardCarouselProps) => {
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

  const slideHeight = isLg ? _minH.lg : _minH.base;

  if (error) {
    console.log(error);
    return <></>;
  }

  const products = isLoading ? getEmptyArray<Product>(productsLength) : data?.products;

  return (
    <Carousel
      slideHeight={slideHeight}
      navigationLeft="-1rem"
      navigationRight="-1rem"
      slidesPerView={slidesPerView}
      spaceBetween={32}
    >
      {products?.map((product: Product, i: number) => (
        <ProductCard key={i} isLoading={isLoading} editMode={editMode} product={product} />
      ))}
    </Carousel>
  );
};
