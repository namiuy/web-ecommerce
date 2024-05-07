import lscache from 'lscache';
import { Flex, Grid, GridItem, Heading, Skeleton, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { getEmptyArray, useProductSearch } from 'shared';
import { Product } from 'shared/entities/product';
import { ProductSearchSortBy } from 'shared/entities/product-search';
import { ProductCard } from './ProductCard';
import { User } from 'shared/entities/user';
import { isBrowser } from 'shared';
import Pagination from './Pagination';

const _grey2 = 'brand.grey.2';

type ProductSearchProps = {
  brandId?: number;
  categoryId?: string;
  text?: string;
  pag?: number;
  sortBy?: ProductSearchSortBy;
};

const ITEMS_PER_PAGE = 12;

const Message = ({ content }: { content: string }) => (
  <Flex flexDirection="column" alignItems="center" pt="20vh">
    <Heading as="h3" size="md">
      {content}
    </Heading>
  </Flex>
);

export const ProductSearch = (props: ProductSearchProps) => {
  const issBrowser = isBrowser();
  const [user, setUser] = useState<User>();
  const isUserAdmin = user?.roles?.includes('admin'); // TODO: improve this

  useEffect(() => {
    if (issBrowser) setUser(lscache.get('user')); // TODO: improve this
  }, [issBrowser]);

  const { isLoading, error, data } = useProductSearch({ ...props, index: props?.pag ? props?.pag - 1 : 0 });

  if (error) {
    console.log(error);
    return <></>;
  }

  const products = isLoading ? getEmptyArray<Product>(ITEMS_PER_PAGE) : data?.products;

  if (!isLoading && products) {
    if (!products?.length) return <Message content="No se encontró ningún resultado." />;
  }

  return (
    <>
      {isLoading ? (
        <Skeleton />
      ) : data?.count ? (
        <Text fontSize=".85rem" pr="1rem" color={_grey2}>
          {data.count} resultados
        </Text>
      ) : (
        <></>
      )}
      <Grid
        gridTemplateColumns={['repeat(2, 1fr)', 'repeat(3, 1fr)']}
        gap={{ base: '1rem', sm: '2rem', lg: '2rem' }}
        mb="4rem"
      >
        {products?.map((product, i) => (
          <GridItem key={i}>
            <ProductCard isLoading={isLoading} editMode={isUserAdmin} product={product} />
          </GridItem>
        ))}
      </Grid>
      {data?.count && data?.count > ITEMS_PER_PAGE && (
        <Pagination currentPage={props?.pag || 1} maxRowsPerPage={ITEMS_PER_PAGE} totalItems={data.count} />
      )}
    </>
  );
};
