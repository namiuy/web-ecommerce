import { Grid, ProductSearch, ProductFilters, ResultsFor } from 'ui';
import { FC } from 'react';

type ProductsProps = {
  brandId?: number;
  categoryId?: string;
  text?: string;
};

export const Products: FC<ProductsProps> = props => (
  <Grid mt="6rem" gridTemplateColumns={{ base: 'auto', lg: '16rem auto' }}>
    <ProductFilters {...props} />
    <div>
      <ResultsFor text={props.text} />
      <ProductSearch {...props} />
    </div>
  </Grid>
);
