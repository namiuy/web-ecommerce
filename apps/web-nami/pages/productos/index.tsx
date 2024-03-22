import { ProductSearchSortBy } from 'shared/entities/product-search';
import { CategoriesAccordion, Brands, Head, Container, Box, ProductsTemplate, GaPage } from 'ui';
import { NavBar } from '../../components';
import { useSearchParams } from 'next/navigation';
import { NextPage } from 'next';

const CategoriesAndBrands = () => (
  <Container pt="4rem">
    <CategoriesAccordion />
    <Box h="4rem" />
    <Brands />
  </Container>
);

const ProductsPage: NextPage = () => {
  const searchParams = useSearchParams();
  const b = searchParams.get('b');
  const props = {
    brandId: typeof b === 'string' ? Number(b) : undefined,
    categoryId: searchParams.get('c') ?? undefined,
    text: searchParams.get('t') ?? undefined,
    sortBy: (searchParams.get('s') as ProductSearchSortBy) ?? undefined,
  };
  const hasQueryParams = !!props.brandId || !!props.categoryId || !!props.text;
  return (
    <GaPage page="Products">
      <>
        <Head />
        <NavBar />
        {!hasQueryParams ? <CategoriesAndBrands /> : <ProductsTemplate {...props} />}
      </>
    </GaPage>
  );
};

export default ProductsPage;
