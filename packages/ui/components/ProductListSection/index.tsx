import { Flex } from '@chakra-ui/react';
import { Box, Container } from 'ui';
import { sort, useProductListList } from 'shared';
import { ProductList } from 'shared/entities/product-list';
import { Heading } from 'ui';
import { ProductListCarousel } from './ProductListCarousel';

const _grey3 = 'brand.grey.3';
const _bg = 'brand.background';

type ProductListSectionProps = {
  name: string
};


export const ProductListSection = ({ name }: ProductListSectionProps) => {
  const { isLoading, error, data = [] } = useProductListList();

  if (error) {
    console.log(error);
    return <></>;
  }

  const dataFilter = data.filter((productList: ProductList) => productList.section === name);
  const dataSort = sort<ProductList>(dataFilter, 'indx');

  return (
    <Box bg={_bg}>
      <Container p="0">
        <Flex direction="column">
          {dataSort.map(({ id, name, product_ids }, i) => (
            <Flex key={i} direction="column" w="100%" p={{ base: '1rem 1rem 0', sm: '2rem 1rem 0' }}>
              <Heading as="h3" size="lg" color={_grey3} pb=".5rem">
                {name}
              </Heading>
              <ProductListCarousel
                key={i}
                productListId={id}
                productsLength={product_ids.length}
              />
            </Flex>
          ))}
        </Flex>
      </Container>
    </Box>
  );
};
