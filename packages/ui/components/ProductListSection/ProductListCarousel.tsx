import { useBreakpointValue } from '@chakra-ui/react';
import { useProductListGet, getEmptyArray } from 'shared';
import { Product } from 'shared/entities/product';
import { Carousel, ProductCard } from 'ui';
import { ProductCardCarousel } from '../ProductCardCarousel';

const _minH = { base: '17rem', lg: '21rem' };

type ProductListCarouselProps = { editMode?: boolean; productListId: number; productsLength: number };

export const ProductListCarousel = ({ editMode = false, productListId, productsLength }: ProductListCarouselProps) => {
  const { isLoading, error, data } = useProductListGet(productListId);

  if (error) {
    console.log(error);
    return <></>;
  }

  const products =
    isLoading || !data?.products ? getEmptyArray<Product>(productsLength) : data.products.filter(p => p.id);

  return <ProductCardCarousel editMode={editMode} products={products} isLoading={isLoading} />;
};
