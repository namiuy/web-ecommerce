'use client';

import { NextPage } from 'next';
import { Grid, Head, ProductSearch, ProductFilters, Text, Box } from 'ui';
import { NavBar } from '../components';

type ProductsPageProps = {
  brandId?: number;
  categoryId?: string;
  text?: string;
};

const ResultsFor = ({ text }: { text?: string }) =>
  !text ? (
    <></>
  ) : (
    <Box p="2rem">
      <Text as="span" fontSize="1.25rem" fontWeight="medium" color="brand.grey.2">
        Resultados para
      </Text>{' '}
      <Text as="span" fontSize="1.25rem" fontWeight="medium" color="black">{`'${text}'`}</Text>
    </Box>
  );

const ProductsPage: NextPage<ProductsPageProps> = props => (
  <>
    <Head />
    <NavBar />
    <Grid gridTemplateColumns="16rem auto">
      <ProductFilters {...props} />
      <div>
        <ResultsFor text={props.text} />
        <ProductSearch {...props} />
      </div>
    </Grid>
  </>
);

ProductsPage.getInitialProps = async ({ query }) => {
  const { b, c, t } = query;
  return {
    brandId: typeof b === 'string' ? Number(b) : undefined,
    categoryId: c?.toString(),
    text: t?.toString(),
  };
};

export default ProductsPage;
