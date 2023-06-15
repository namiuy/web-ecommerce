import { Flex } from '@chakra-ui/react';
import { sort, useProductListList } from 'shared';
import { Heading } from 'ui';
import { ModalEdit } from './ModalEdit';
import { ProductListSectionEdit } from './ProductListSectionEdit';
import { ProductCardCarousel } from './ProductCardCarousel';
import { ProductList } from 'shared/entities/product-list';

const _grey3 = 'brand.grey.3';

export const ProductListSection = ({ name }: { name: string }) => {
  const { isLoading, error, data = [] } = useProductListList();

  if (error) {
    console.log(error);
    return <></>;
  }

  if (isLoading) return <></>; // TODO:!

  const dataFilter = data.filter(productList => productList.section === name);
  const dataSort = sort<ProductList>(dataFilter, 'indx');

  return (
    <Flex direction="column" gap="2rem" pt="0.375rem" p={{ base: '0 1rem', xl: 0 }}>
      {dataSort.map(({ id, name, product_ids }, i) => (
        <Flex key={i} direction="column" w="100%" gap="1rem">
          <Heading as="h3" size="xl" color={_grey3}>
            {name}{' '}
            <ModalEdit title="Listas de productos">
              <ProductListSectionEdit data={data} />
            </ModalEdit>
          </Heading>
          <ProductCardCarousel key={i} productListId={id} productsLength={product_ids.length} />
        </Flex>
      ))}
    </Flex>
  );
};
