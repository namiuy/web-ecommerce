import { Flex } from '@chakra-ui/react';
import { useProductListList } from 'shared';
import { Heading } from 'ui';
import { ProductCardCarousel } from './ProductCardCarousel';

const _grey3 = 'brand.grey.3';

export const ProductListSection = ({ name }: { name: string }) => {
  const { isLoading, error, data = [] } = useProductListList();

  if (error) {
    console.log(error);
    return <></>;
  }

  if (isLoading) return <></>; // TODO:!

  return (
    <Flex direction="column" gap="2rem" pt="0.375rem" p={{ base: '0 1rem', xl: 0 }}>
      {data
        .filter(productList => productList.section === name)
        .map(({ id, name, product_ids }, i) => (
          <Flex key={i} direction="column" w="100%" gap="1rem">
            <Heading as="h3" size="xl">
              {/* <Text fontSize="1.5rem" color={_grey3} fontWeight="semibold"> */}
              {name}
            </Heading>
            <ProductCardCarousel key={i} productListId={id} productsLength={product_ids.length} />
          </Flex>
        ))}
    </Flex>
  );
};
