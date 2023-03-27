import { Flex } from '@chakra-ui/react';
import { useProductListList } from 'shared';
import { Text } from 'ui';
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
    <Flex direction="column" gap="2rem" pt="0.375rem" pl={{ base: '1rem', xl: 0 }}>
      {data
        .filter(productList => productList.section === name)
        .map(({ id, name, product_ids }, i) => (
          <Flex key={i} direction="column" w="100%" gap="0.375rem">
            <Text fontSize="1.5rem" color={_grey3} fontWeight="semibold">
              {name}
            </Text>
            <ProductCardCarousel key={i} productListId={id} productsLength={product_ids.length} />
          </Flex>
        ))}
    </Flex>
  );
};
