'use client';

import { NextPage } from 'next';
import { ProductSearchSortBy } from 'shared/entities/product-search';
import {
  Categories,
  Brands,
  Grid,
  Head,
  ProductSearch,
  ProductFilters,
  ResultsFor,
  Container,
  Box,
  Flex,
  ProductSortBy,
} from 'ui';
import { NavBar } from '../../components';

type ProductsPageProps = {
  brandId?: number;
  categoryId?: string;
  text?: string;
  sortBy?: ProductSearchSortBy;
};

const CategoriesAndBrands = () => (
  <Container pt="4rem">
    <Categories />
    <Box h="4rem" />
    <Brands />
  </Container>
);

const ProductsPage: NextPage<ProductsPageProps> = props => {
  const { brandId, categoryId, text } = props;
  const hasQueryParams = !!brandId || !!categoryId || !!text;
  return (
    <>
      <Head />
      <NavBar />
      {!hasQueryParams ? (
        <CategoriesAndBrands />
      ) : (
        <Grid gridTemplateColumns={{ base: 'auto', lg: '16rem auto' }}>
          <ProductFilters {...props} />
          <div>
            <Flex>
              <Box flex="1">
                <ResultsFor text={props.text} />
              </Box>
              <Box p="1rem">
                <ProductSortBy />
              </Box>
            </Flex>
            <ProductSearch {...props} />
          </div>
        </Grid>
      )}
    </>
  );
};

ProductsPage.getInitialProps = async ({ query }) => {
  const { b, c, t, s } = query;
  return {
    brandId: typeof b === 'string' ? Number(b) : undefined,
    categoryId: c?.toString(),
    text: t?.toString(),
    sortBy: s?.toString() as ProductSearchSortBy,
  };
};

export default ProductsPage;
