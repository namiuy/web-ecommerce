import { NextPage } from 'next';
import { ProductSearchSortBy } from 'shared/entities/product-search';
import { CategoriesAccordion, Brands, Head, Container, Box, ProductsTemplate } from 'ui';
import { Footer, NavBar } from '../../components';

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

const ProductsPage: NextPage<ProductsPageProps> = props => {
  const { brandId, categoryId, text } = props;
  const hasQueryParams = !!brandId || !!categoryId || !!text;
  return (
    <>
      <Head />
      <NavBar />
      {!hasQueryParams ? <CategoriesAndBrands /> : <ProductsTemplate {...props} />}
      <Footer />
    </>
  );
};

ProductsPage.getInitialProps = async ({ query }) => {
  const { b, c, t, s, pag } = query;
  return {
    brandId: typeof b === 'string' ? Number(b) : undefined,
    categoryId: c?.toString(),
    text: t?.toString(),
    sortBy: s?.toString() as ProductSearchSortBy,
    pag: typeof pag === 'string' ? Number(pag) : undefined,
  };
};

export default ProductsPage;
