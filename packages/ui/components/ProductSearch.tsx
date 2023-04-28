import { Flex, Grid, GridItem, Heading } from '@chakra-ui/react';
import { useContext } from 'react';
import { AppContext, getEmptyArray, useProductSearch } from 'shared';
import { Product } from 'shared/entities/product';
import { ProductSearchSortBy } from 'shared/entities/product-search';
import { ProductCard } from './ProductCard';

type ProductSearchProps = {
  brandId?: number;
  categoryId?: string;
  text?: string;
  sortBy?: ProductSearchSortBy;
};

const LOADING_LENGTH = 12;

const Message = ({ content }: { content: string }) => (
  <Flex flexDirection="column" alignItems="center" pt="20vh">
    <Heading as="h3" size="md">
      {content}
    </Heading>
  </Flex>
);

export const ProductSearch = (props: ProductSearchProps) => {
  const {
    productSearchOptions: { filters },
  } = useContext(AppContext);

  const { isLoading, error, data } = useProductSearch(props);

  if (error) {
    console.log(error);
    return <></>;
  }

  const products = isLoading ? getEmptyArray<Product>(LOADING_LENGTH) : data?.products;

  if (!isLoading) {
    if (!filters) return <Message content="Debes seleccionar un filtro." />;
    if (!products?.length) return <Message content="No se encontro ningun resultado." />;
  }

  return (
    <Grid gridTemplateColumns={['repeat(2, 1fr)', 'repeat(3, 1fr)']}>
      {products?.map((product, i) => (
        <GridItem key={i} p="1rem 0 2rem 2rem">
          <ProductCard isLoading={isLoading} product={product} />
        </GridItem>
      ))}
    </Grid>
  );
};
