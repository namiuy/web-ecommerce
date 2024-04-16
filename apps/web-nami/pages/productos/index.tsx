import { ProductSearchSortBy } from 'shared/entities/product-search';
import { CategoriesAccordion, Brands, Head, Container, Box, ProductsTemplate, GaPage } from 'ui';
import { NavBar, Footer } from '../../components';
import { NextPage } from 'next';
import { isBrowser } from 'shared';
import { useEffect, useState } from 'react';

const CategoriesAndBrands = () => (
  <Container pt="4rem">
    <CategoriesAccordion />
    <Box h="4rem" />
    <Brands />
  </Container>
);

const ProductsPage: NextPage = () => {
  const browserState = isBrowser();
  const [isBrowserReady, setIsBrowserReady] = useState(false);
  const [props, setProps] = useState<any>({});
  const hasProps = props && (!!props?.brandId || !!props?.categoryId || !!props?.text);

  useEffect(() => {
    if (browserState) {
      const searchParams = new URL(document.location.toString()).searchParams;
      const b = searchParams.get('b');

      setProps({
        brandId: typeof b === 'string' ? Number(b) : undefined,
        categoryId: searchParams.get('c') ?? undefined,
        text: searchParams.get('t') ?? undefined,
        sortBy: (searchParams.get('s') as ProductSearchSortBy) ?? undefined,
      });
    }

    setIsBrowserReady(browserState);
  }, [browserState]);

  return (
    <GaPage page="Products">
      <>
        <Head />
        <NavBar />
        {!isBrowserReady || hasProps ? <ProductsTemplate {...props} /> : <CategoriesAndBrands />}
        <Footer />
      </>
    </GaPage>
  );
};

export default ProductsPage;
