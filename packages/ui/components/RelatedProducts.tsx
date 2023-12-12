import { Carousel, Container, Heading, ProductCard, Skeleton } from 'ui';
import { getEmptyArray, useProductRelatedGet } from 'shared';
import { Flex, useBreakpointValue } from '@chakra-ui/react';
import { ProductCardCarousel } from './ProductCardCarousel';
import { Product } from 'shared/entities/product';

const _containerSize = { lg: '75%', base: '90%' };
const _minH = { base: '18rem', lg: '22rem' };

type RelatedProductsProps = {
  id: string;
};

export const RelatedProducts = ({ id }: RelatedProductsProps) => {
  const { data, isLoading, error } = useProductRelatedGet(id);

  if (error) {
    console.log(error);
    return <></>;
  }

  const products = isLoading || !data?.products ? getEmptyArray<Product>(5) : data.products.filter(p => p.id);

  return (
    <>
      <Container maxW={_containerSize} px="0" mb="1.5rem">
        <Heading size="lg">TAMBIÉN TE PUEDE INTERESAR</Heading>
        <ProductCardCarousel products={products ?? []} isLoading={isLoading} />
      </Container>
    </>
  );
};
