import { useProductListGet, getEmptyArray } from 'shared';
import { Product } from 'shared/entities/product';
import { ProductCardCarousel } from '../ProductCardCarousel';

type ProductListCarouselProps = { productListId: number; productsLength: number };

export const ProductListCarousel = ({ productListId, productsLength }: ProductListCarouselProps) => {
  const { isLoading, error, data } = useProductListGet(productListId);

  if (error) {
    console.log(error);
    return <></>;
  }

  const products =
    isLoading || !data?.products ? getEmptyArray<Product>(productsLength) : data.products.filter(p => p.id);

  return <ProductCardCarousel products={products} isLoading={isLoading} />;
};
