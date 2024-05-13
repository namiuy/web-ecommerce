import { Grid, ProductSearch, ProductFilters, ResultsFor, Box, Container } from 'ui';

const _bg = 'brand.background';

type ProductsProps = {
  brandId?: number;
  categoryId?: string;
  text?: string;
  pag?: number;
};

export const Products = (props: ProductsProps) => {
  return (
    <Box minH="calc(100vh - 5rem)" bg={_bg} pt={{ base: 0, lg: '3rem' }} pb="5rem">
      <Container>
        <Grid gridTemplateColumns={{ lg: '2fr 5fr' }}>
          <Box pt={{ base: 0, lg: '2.125rem' }} mr={{ base: 0, lg: '3rem' }}>
            <ProductFilters {...props} />
          </Box>
          <Box>
            <ResultsFor text={props.text} />
            <ProductSearch {...props} />
          </Box>
        </Grid>
      </Container>
    </Box>
  );
};
