import { useRouter } from 'next/router';
import { NextPage } from 'next';
import { ProductSearchSortBy } from 'shared/entities/product-search';
import { Categories, Brands, Head, Container, Box, ProductsTemplate, GaPage } from 'ui';
import { NavBar } from '../../components';

type ProductsPageProps = {
  brandId?: number;
  categoryId?: string;
  text?: string;
  sortBy?: ProductSearchSortBy;
};

const CategoriesAndBrands = () => (
  <Container pt="4rem">
    <Categories />
    <Box h="4rem" />
    <Brands />
  </Container>
);

const ProductsPage: NextPage<ProductsPageProps> = props => {
  const router = useRouter();
  const { brandId, categoryId, text } = props;
  const hasQueryParams = !!brandId || !!categoryId || !!text;

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

ProductsPage.getInitialProps = async ({ query }) => {
  const { b, c, t, s } = query;
  return {
    brandId: typeof b === 'string' ? Number(b) : undefined,
    categoryId: c?.toString(),
    text: t?.toString(),
    sortBy: s?.toString() as ProductSearchSortBy,
  };
};

export default ProductsPage;
