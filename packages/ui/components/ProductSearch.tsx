import lscache from 'lscache';
import { Flex, Grid, GridItem, Heading, Skeleton, Text } from '@chakra-ui/react';
import { useContext, useEffect, useState } from 'react';
import { AppContext, getEmptyArray, useProductSearch } from 'shared';
import { Product } from 'shared/entities/product';
import { ProductSearchSortBy } from 'shared/entities/product-search';
import { ProductCard } from './ProductCard';
import { User } from 'shared/entities/user';
import { isBrowser } from 'shared';

const _grey2 = 'brand.grey.2';

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

  const issBrowser = isBrowser();
  const [user, setUser] = useState<User>();
  const isUserAdmin = user?.roles?.includes('admin'); // TODO: improve this

  useEffect(() => {
    if (issBrowser) setUser(lscache.get('user')); // TODO: improve this
  }, [issBrowser]);

  const { isLoading, error, data } = useProductSearch(props);

  if (error) {
    console.log(error);
    return <></>;
  }

  const products = isLoading ? getEmptyArray<Product>(LOADING_LENGTH) : data?.products;

  if (!isLoading && products) {
    // if (!filters) return <Message content="Debes seleccionar un filtro." />;
    if (!products?.length) return <Message content="No se encontro ningun resultado." />;
  }

  return (
    <>
      {isLoading ? (
        <Skeleton />
      ) : (
        <Text fontSize=".85rem" pr="1rem" color={_grey2}>
          {products?.length} resultados
        </Text>
      )}
      <Grid gridTemplateColumns={['repeat(2, 1fr)', 'repeat(3, 1fr)']} gap="2rem" pb="6rem">
        {products?.map((product, i) => (
          <GridItem key={i}>
            <ProductCard isLoading={isLoading} editMode={isUserAdmin} product={product} />
          </GridItem>
        ))}
      </Grid>
    </>
  );
};
