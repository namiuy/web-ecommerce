import { Grid, GridItem } from '@chakra-ui/react';
import { getEmptyArray, useProductSearch } from 'shared';
import { Product } from 'shared/entities/product';
import { ProductCard } from './ProductCard';

type ProductSearchProps = {
  brandId?: number;
  categoryId?: string;
  text?: string;
};

const LOADING_LENGTH = 12;

export const ProductSearch = (props: ProductSearchProps) => {
  const { isLoading, error, data } = useProductSearch(props);

  if (error) {
    console.log(error);
    return <></>;
  }

  const products = isLoading ? getEmptyArray<Product>(LOADING_LENGTH) : data?.products;

  return (
    <Grid gridTemplateColumns="repeat(4, 1fr)">
      {products?.map((product, i) => (
        <GridItem key={i} p="1rem">
          <ProductCard isLoading={isLoading} product={product} />
        </GridItem>
      ))}
    </Grid>
  );
};
