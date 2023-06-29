import { Flex, Input, Text } from '@chakra-ui/react';
import { FC } from 'react';
import { ProductList } from 'shared/entities/product-list';
import { useProductListGet } from 'shared/hooks/request/product-list';
import { groupBy, sort } from 'shared/utils/array';
import { Box, Button, Center, Grid, GridItem, ProductCard } from '..';

type MoveButtonProps = {
  direction: 'up' | 'foward' | 'down' | 'back';
};

type ProductListListProps = {
  productListId: number;
};

type ProductListSectionEditProps = {
  data: Array<ProductList>;
};

const ProductListList: FC<ProductListListProps> = ({ productListId }) => {
  const { data } = useProductListGet(productListId);
  const { name, product_ids, products } = data || {};
  return (
    <Box p={{ base: '0 0 1rem 0', sm: '0 1rem 1rem 1rem' }} border="dashed 1px lightgrey" bg="rgb(0 0 0 / 10%)">
      <Input m="1rem" p=".2rem .5rem" w="auto" h="auto" size="lg" bg="white" borderRadius="0" value={name} />
      <Grid gap="1rem" gridTemplateColumns={{ base: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', lg: 'repeat(5, 1fr)' }}>
        {product_ids?.map((id, i) => (
          <GridItem key={i}>
            <Flex alignItems="center">
              <ProductCard min product={products?.find(p => p.id === id)} />
            </Flex>
          </GridItem>
        ))}
        <GridItem>
          <Flex>
            <Button w="100%" h="10rem" m="0 2rem" bg="rgb(0 0 0 / 10%)" borderRadius="0">
              Agregar
            </Button>
          </Flex>
        </GridItem>
      </Grid>
    </Box>
  );
};

export const ProductListSectionEdit2: FC<ProductListSectionEditProps> = ({ data }) => (
  <Box p={{ base: '2rem 0 1rem 0', sm: '2rem 1rem 1rem .5rem' }} border="dashed 1px lightgrey">
    <Flex direction="column" gap="1rem">
      {data.map(({ id }, i) => (
        <ProductListList key={i} productListId={id} />
      ))}
      <Flex>
        <Box w="2rem" />
        <Button bg="lightgray" w="100%">
          Nueva lista
        </Button>
      </Flex>
    </Flex>
  </Box>
);

export const ProductListSectionEdit: FC<ProductListSectionEditProps> = ({ data }) => {
  const groups = groupBy(data, 'section');
  return (
    <Flex direction="column" gap="2rem" p={{ base: '0', sm: '0 1rem' }}>
      {Object.keys(groups)
        .sort()
        .map((sectionName, i) => (
          <Box key={i}>
            <Text
              as="span"
              display="inline-block"
              fontSize=".8rem"
              ml=".5rem"
              p="0 6px"
              bg="white"
              transform="translateY(.7rem)"
              textTransform="uppercase"
            >
              {sectionName}
            </Text>
            <ProductListSectionEdit2 data={sort<ProductList>(groups[sectionName], 'indx')} />
          </Box>
        ))}
    </Flex>
  );
};
