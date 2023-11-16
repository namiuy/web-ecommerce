import { Grid, ProductSearch, ProductFilters, ResultsFor, Box, Container } from 'ui';
import { FC, useContext } from 'react';
import { AppContext } from 'shared';

const _bg = 'brand.background';

type ProductsProps = {
  brandId?: number;
  categoryId?: string;
  text?: string;
};

export const Products: FC<ProductsProps> = props => {
  const { productSearchResultIsLoading: isLoading = true, productSearchResult } = useContext(AppContext);
  //const showFilters = isLoading || !!productSearchResult?.length;

  return (
    <Box minH="calc(100vh - 5rem)" bg={_bg} pt={{ base: 0, lg: '3rem' }}>
      <Container>
        <Grid gridTemplateColumns={{ /*base: 'auto',lg: showFilters ? '1fr 3fr' : 'auto' */ lg: '2fr 5fr' }}>
          {/* {showFilters && ( */}
          <Box pt={{ base: 0, lg: '2.125rem' }} mr={{ base: 0, lg: '3rem' }}>
            <ProductFilters {...props} />
          </Box>
          {/* )} */}
          <Box>
            <ResultsFor text={props.text} />
            <ProductSearch {...props} />
          </Box>
        </Grid>
      </Container>
    </Box>
  );
};
