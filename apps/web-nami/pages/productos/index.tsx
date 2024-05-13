import { useRouter } from 'next/router';
import { ProductSearchSortBy } from 'shared/entities/product-search';
import { NextPage } from 'next';
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

const ProductsPage: NextPage<ProductsPageProps> = () => {
  const router = useRouter();
  const b = router.query?.b;
  const pag = router.query?.pag;

  const props = {
    brandId: typeof b === 'string' ? Number(b) : undefined,
    categoryId: router.query?.c?.toString(),
    text: router.query?.t?.toString(),
    sortBy: router.query?.s?.toString() as ProductSearchSortBy,
    pag: typeof pag === 'string' ? Number(pag) : undefined,
  };

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
