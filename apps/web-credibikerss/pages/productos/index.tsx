'use client';

import { NextPage } from 'next';
import { Grid, Head, ProductSearch, ProductFilters, ResultsFor } from 'ui';
import { NavBar } from '../../components';

type ProductsPageProps = {
  brandId?: number;
  categoryId?: string;
  text?: string;
};

const ProductsPage: NextPage<ProductsPageProps> = props => (
  <>
    <Head />
    <NavBar />
    <Grid mt="6rem" gridTemplateColumns={{ base: 'auto', lg: '16rem auto' }}>
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
