import { useRouter } from 'next/router';
import { ProductSearchSortBy } from 'shared/entities/product-search';
import { NextPage } from 'next';
import { CategoriesAccordion, Brands, Head, Container, Box, ProductsTemplate } from 'ui';
import { Footer, NavBar } from '../../components';
import { getProductPropsFromRouter } from 'shared';

type ProductsPageProps = {
  brandId?: number;
  categoryId?: string;
  text?: string;
  pag?: number;
  sortBy?: ProductSearchSortBy;
};

const CategoriesAndBrands = () => (
  <Container pt="4rem">
    <CategoriesAccordion />
    <Box h="4rem" />
    <Brands />
  </Container>
);

const ProductsPage: NextPage<ProductsPageProps> = () => {
  const { query } = useRouter();
  const props = getProductPropsFromRouter(query);
  const hasQueryParams = !!props?.brandId || !!props?.categoryId || !!props?.text;

  return (
    <>
      <Head />
      <NavBar />
      {!hasQueryParams ? <CategoriesAndBrands /> : <ProductsTemplate {...props} />}
      <Footer />
    </>
  );
};

export default ProductsPage;
